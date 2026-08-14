const Attendance = require("../models/Attendance");
const User = require("../models/User");

// ==========================================
// GET MONTH DATE RANGE
// ==========================================

const getMonthRange = (month) => {
  if (!month) {
    return null;
  }

  const match = /^(\d{4})-(\d{2})$/.exec(month);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const monthNumber = Number(match[2]);

  if (monthNumber < 1 || monthNumber > 12) {
    return null;
  }

  const startDate = new Date(
    Date.UTC(year, monthNumber - 1, 1)
  );

  const endDate = new Date(
    Date.UTC(year, monthNumber, 1)
  );

  return {
    startDate,
    endDate,
  };
};

// ==========================================
// MARK ATTENDANCE
// ==========================================

const markAttendance = async (req, res) => {
  try {
    const {
      student,
      subject,
      date,
      status,
    } = req.body;

    if (!student || !subject || !date || !status) {
      return res.status(400).json({
        message:
          "Student, subject, date and status are required",
      });
    }

    // Make sure selected user is actually a student
    const studentExists = await User.findOne({
      _id: student,
      role: "student",
    });

    if (!studentExists) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // Prevent duplicate attendance
    const existingAttendance =
      await Attendance.findOne({
        student,
        subject: subject.trim(),
        date,
      });

    if (existingAttendance) {
      return res.status(400).json({
        message:
          "Attendance for this student, subject and date already exists",
      });
    }

    const attendance = await Attendance.create({
      student,
      subject: subject.trim(),
      date,
      status,
      markedBy: req.user.id,
    });

    return res.status(201).json({
      message: "Attendance marked successfully",
      attendance,
    });
  } catch (error) {
    console.error(
      "Mark Attendance Error:",
      error
    );

    return res.status(500).json({
      message: "Failed to mark attendance",
      error: error.message,
    });
  }
};

// ==========================================
// GET ONE STUDENT ATTENDANCE
// Optional month filter
// ==========================================

const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { month } = req.query;

    // Student can only view own attendance
    if (
      req.user.role === "student" &&
      req.user.id !== studentId
    ) {
      return res.status(403).json({
        message:
          "You can only view your own attendance",
      });
    }

    // Verify student exists
    const studentExists = await User.findOne({
      _id: studentId,
      role: "student",
    });

    if (!studentExists) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const filter = {
      student: studentId,
    };

    const range = getMonthRange(month);

    if (month && !range) {
      return res.status(400).json({
        message:
          "Month must be in YYYY-MM format",
      });
    }

    if (range) {
      filter.date = {
        $gte: range.startDate,
        $lt: range.endDate,
      };
    }

    const attendance = await Attendance.find(
      filter
    )
      .populate(
        "student",
        "name email department course branch"
      )
      .populate(
        "markedBy",
        "name email role"
      )
      .sort({ date: -1 });

    return res.status(200).json({
      message:
        "Attendance fetched successfully",
      count: attendance.length,
      attendance,
    });
  } catch (error) {
    console.error(
      "Get Student Attendance Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch attendance",
      error: error.message,
    });
  }
};

// ==========================================
// GET ONE STUDENT ATTENDANCE SUMMARY
// Optional month filter
// ==========================================

const getAttendanceSummary = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { month } = req.query;

    // Student can only view own summary
    if (
      req.user.role === "student" &&
      req.user.id !== studentId
    ) {
      return res.status(403).json({
        message:
          "You can only view your own attendance",
      });
    }

    const studentExists = await User.findOne({
      _id: studentId,
      role: "student",
    });

    if (!studentExists) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const filter = {
      student: studentId,
    };

    const range = getMonthRange(month);

    if (month && !range) {
      return res.status(400).json({
        message:
          "Month must be in YYYY-MM format",
      });
    }

    if (range) {
      filter.date = {
        $gte: range.startDate,
        $lt: range.endDate,
      };
    }

    const records =
      await Attendance.find(filter);

    const totalClasses = records.length;

    const presentClasses = records.filter(
      (record) =>
        record.status === "present"
    ).length;

    const absentClasses = records.filter(
      (record) =>
        record.status === "absent"
    ).length;

    const attendancePercentage =
      totalClasses === 0
        ? 0
        : Number(
            (
              (presentClasses /
                totalClasses) *
              100
            ).toFixed(2)
          );

    return res.status(200).json({
      message:
        "Attendance summary fetched successfully",

      month: month || null,

      summary: {
        totalClasses,
        presentClasses,
        absentClasses,
        attendancePercentage,
      },
    });
  } catch (error) {
    console.error(
      "Attendance Summary Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch attendance summary",
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL STUDENTS ATTENDANCE OVERVIEW
// COURSE + BRANCH + MONTH
// ==========================================

const getAllStudentsAttendance = async (
  req,
  res
) => {
  try {
    const {
      course,
      branch,
      month,
    } = req.query;

    // ------------------------------------------
    // Student filter
    // ------------------------------------------

    const studentFilter = {
      role: "student",
    };

    if (course) {
      studentFilter.course = course.trim();
    }

    if (branch) {
      studentFilter.branch = branch.trim();
    }

    // ------------------------------------------
    // Validate month
    // ------------------------------------------

    const range = getMonthRange(month);

    if (month && !range) {
      return res.status(400).json({
        message:
          "Month must be in YYYY-MM format",
      });
    }

    // ------------------------------------------
    // Get students FIRST
    // ------------------------------------------

    const students = await User.find(
      studentFilter
    )
      .select("-password")
      .sort({ name: 1 });

    // ------------------------------------------
    // Calculate attendance for every student
    // ------------------------------------------

    const result = await Promise.all(
      students.map(async (student) => {
        const attendanceFilter = {
          student: student._id,
        };

        // Month filter
        if (range) {
          attendanceFilter.date = {
            $gte: range.startDate,
            $lt: range.endDate,
          };
        }

        const records =
          await Attendance.find(
            attendanceFilter
          );

        const totalClasses =
          records.length;

        const presentClasses =
          records.filter(
            (record) =>
              record.status === "present"
          ).length;

        const absentClasses =
          records.filter(
            (record) =>
              record.status === "absent"
          ).length;

        const attendancePercentage =
          totalClasses === 0
            ? 0
            : Number(
                (
                  (presentClasses /
                    totalClasses) *
                  100
                ).toFixed(2)
              );

        return {
          studentId: student._id,
          name: student.name,
          email: student.email,
          course: student.course,
          branch: student.branch,
          department: student.department,

          totalClasses,
          presentClasses,
          absentClasses,
          attendancePercentage,
        };
      })
    );

    return res.status(200).json({
      message:
        "Attendance overview fetched successfully",

      count: result.length,

      filters: {
        course: course || null,
        branch: branch || null,
        month: month || null,
      },

      students: result,
    });
  } catch (error) {
    console.error(
      "Attendance Overview Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch attendance overview",
      error: error.message,
    });
  }
};

module.exports = {
  markAttendance,
  getStudentAttendance,
  getAttendanceSummary,
  getAllStudentsAttendance,
};