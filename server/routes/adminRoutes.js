const express = require("express");

const {
  authMiddleware,
  adminMiddleware,
  adminOrFacultyMiddleware,
} = require("../middleware/authMiddleware");

const {
  getAllStudents,
  getAllFaculty,
  getDashboardStats,
  deleteStudent,
  deleteFaculty,
  getStudentsByCourseAndBranch,
  updateStudentAcademic,
} = require("../controllers/adminController");

const router = express.Router();

// Admin dashboard
router.get(
  "/dashboard",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    res.json({
      message: "Welcome to Admin Dashboard",
      user: req.user,
    });
  }
);

// Admin + Faculty → all students
router.get(
  "/students",
  authMiddleware,
  adminOrFacultyMiddleware,
  getAllStudents
);

// Admin only → all faculty
router.get(
  "/faculty",
  authMiddleware,
  adminMiddleware,
  getAllFaculty
);

// Admin only → dashboard stats
router.get(
  "/stats",
  authMiddleware,
  adminMiddleware,
  getDashboardStats
);

// Admin only → delete student
router.delete(
  "/students/:id",
  authMiddleware,
  adminMiddleware,
  deleteStudent
);

// Admin only → delete faculty
router.delete(
  "/faculty/:id",
  authMiddleware,
  adminMiddleware,
  deleteFaculty
);

// Admin + Faculty → course + branch students
router.get(
  "/students/course/:course/branch/:branch",
  authMiddleware,
  adminOrFacultyMiddleware,
  getStudentsByCourseAndBranch
);

// Admin only → update student academic details
router.patch(
  "/students/:id/academic",
  authMiddleware,
  adminMiddleware,
  updateStudentAcademic
);

module.exports = router;