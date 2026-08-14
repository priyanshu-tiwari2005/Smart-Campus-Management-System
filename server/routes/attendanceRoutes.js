const express = require("express");

const {
  markAttendance,
  getStudentAttendance,
  getAttendanceSummary,
  getAllStudentsAttendance,
} = require("../controllers/attendanceController");

const {
  authMiddleware,
  adminOrFacultyMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Admin + Faculty can mark attendance
router.post(
  "/mark",
  authMiddleware,
  adminOrFacultyMiddleware,
  markAttendance
);

// Authenticated user can view student attendance
router.get(
  "/student/:studentId",
  authMiddleware,
  getStudentAttendance
);

// Authenticated user can view attendance summary
router.get(
  "/summary/:studentId",
  authMiddleware,
  getAttendanceSummary
);

// Admin + Faculty can view attendance overview
router.get(
  "/overview",
  authMiddleware,
  adminOrFacultyMiddleware,
  getAllStudentsAttendance
);

module.exports = router;