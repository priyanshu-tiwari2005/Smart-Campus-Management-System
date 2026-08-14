const express = require("express");

const {
  createCourse,
  getAllCourses,
} = require("../controllers/courseController");

const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createCourse
);

router.get(
  "/",
  authMiddleware,
  getAllCourses
);

module.exports = router;