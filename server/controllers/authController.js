const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const academicOptions = require("../config/academicOptions");

// ==========================================
// REGISTER
// ==========================================

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      course,
      branch,
      department,
    } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // ==========================================
    // ROLE
    // ==========================================

    const userRole = role || "student";

    const allowedRoles = [
      "student",
      "faculty",
      "admin",
    ];

    if (!allowedRoles.includes(userRole)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    // ==========================================
    // STUDENT ACADEMIC VALIDATION
    // ==========================================

    let finalCourse = null;
    let finalBranch = null;
    let finalDepartment = "";

    if (userRole === "student") {
      if (!course || !branch) {
        return res.status(400).json({
          message:
            "Course and branch are required for students",
        });
      }

      if (!academicOptions[course]) {
        return res.status(400).json({
          message: "Invalid course",
        });
      }

      if (!academicOptions[course][branch]) {
        return res.status(400).json({
          message:
            "Invalid branch for selected course",
        });
      }

      finalCourse = course;
      finalBranch = branch;

      // Department comes from backend configuration.
      // Frontend cannot send an incorrect department.
      finalDepartment =
        academicOptions[course][branch];
    } else {
      // Faculty/Admin
      finalDepartment = department?.trim() || "";
    }

    // ==========================================
    // CHECK EXISTING USER
    // ==========================================

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // ==========================================
    // HASH PASSWORD
    // ==========================================

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // ==========================================
    // CREATE USER
    // ==========================================

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: userRole,
      course: finalCourse,
      branch: finalBranch,
      department: finalDepartment,
    });

    return res.status(201).json({
      message: "User registered successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        course: user.course,
        branch: user.branch,
        department: user.department,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);

    return res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

// ==========================================
// LOGIN
// ==========================================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // ==========================================
    // JWT
    // ==========================================

    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        course: user.course,
        branch: user.branch,
        department: user.department,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
};