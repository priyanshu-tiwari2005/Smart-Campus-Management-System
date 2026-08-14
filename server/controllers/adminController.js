const User = require("../models/User");
const academicOptions = require("../config/academicOptions");

// ==========================================
// GET ALL STUDENTS
// ==========================================

const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({
      role: "student",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Students fetched successfully",
      count: students.length,
      students,
    });
  } catch (error) {
    console.error("Get All Students Error:", error);

    return res.status(500).json({
      message: "Failed to fetch students",
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL FACULTY
// ==========================================

const getAllFaculty = async (req, res) => {
  try {
    const faculty = await User.find({
      role: "faculty",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Faculty fetched successfully",
      count: faculty.length,
      faculty,
    });
  } catch (error) {
    console.error("Get All Faculty Error:", error);

    return res.status(500).json({
      message: "Failed to fetch faculty",
      error: error.message,
    });
  }
};

// ==========================================
// DASHBOARD STATS
// ==========================================

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalStudents = await User.countDocuments({
      role: "student",
    });

    const totalFaculty = await User.countDocuments({
      role: "faculty",
    });

    const totalAdmins = await User.countDocuments({
      role: "admin",
    });

    return res.status(200).json({
      message:
        "Dashboard statistics fetched successfully",

      stats: {
        totalUsers,
        totalStudents,
        totalFaculty,
        totalAdmins,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);

    return res.status(500).json({
      message:
        "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE STUDENT
// ==========================================

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await User.findOneAndDelete({
      _id: id,
      role: "student",
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    return res.status(200).json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Delete Student Error:", error);

    return res.status(500).json({
      message: "Failed to delete student",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE FACULTY
// ==========================================

const deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;

    const faculty = await User.findOneAndDelete({
      _id: id,
      role: "faculty",
    });

    if (!faculty) {
      return res.status(404).json({
        message: "Faculty not found",
      });
    }

    return res.status(200).json({
      message: "Faculty deleted successfully",
    });
  } catch (error) {
    console.error("Delete Faculty Error:", error);

    return res.status(500).json({
      message: "Failed to delete faculty",
      error: error.message,
    });
  }
};

// ==========================================
// GET STUDENTS BY COURSE + BRANCH
// Admin + Faculty
// ==========================================

const getStudentsByCourseAndBranch = async (
  req,
  res
) => {
  try {
    const { course, branch } = req.params;

    const selectedCourse = course?.trim();
    const selectedBranch = branch?.trim();

    if (!selectedCourse || !selectedBranch) {
      return res.status(400).json({
        message: "Course and branch are required",
      });
    }

    if (!academicOptions[selectedCourse]) {
      return res.status(400).json({
        message: "Invalid course",
      });
    }

    if (
      !academicOptions[selectedCourse][selectedBranch]
    ) {
      return res.status(400).json({
        message:
          "Invalid branch for selected course",
      });
    }

    const students = await User.find({
      role: "student",
      course: selectedCourse,
      branch: selectedBranch,
    })
      .select("-password")
      .sort({ name: 1 });

    return res.status(200).json({
      message: "Students fetched successfully",
      count: students.length,
      students,
    });
  } catch (error) {
    console.error(
      "Get Students By Course/Branch Error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch students",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE STUDENT ACADEMIC DETAILS
// ==========================================

const updateStudentAcademic = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { course, branch } = req.body;

    if (!course || !branch) {
      return res.status(400).json({
        message: "Course and branch are required",
      });
    }

    if (!academicOptions[course]) {
      return res.status(400).json({
        message: "Invalid course",
      });
    }

    const department =
      academicOptions[course][branch];

    if (!department) {
      return res.status(400).json({
        message:
          "Invalid branch for selected course",
      });
    }

    const student =
      await User.findOneAndUpdate(
        {
          _id: id,
          role: "student",
        },
        {
          course,
          branch,
          department,
        },
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    return res.status(200).json({
      message:
        "Student academic details updated successfully",
      student,
    });
  } catch (error) {
    console.error(
      "Update Student Academic Error:",
      error
    );

    return res.status(500).json({
      message: "Failed to update student",
      error: error.message,
    });
  }
};

module.exports = {
  getAllStudents,
  getAllFaculty,
  getDashboardStats,
  deleteStudent,
  deleteFaculty,
  getStudentsByCourseAndBranch,
  updateStudentAcademic,
};