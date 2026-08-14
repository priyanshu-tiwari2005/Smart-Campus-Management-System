const Course = require("../models/Course");

const createCourse = async (req, res) => {
  try {
    const { name, code, department } = req.body;

    if (!name || !code || !department) {
      return res.status(400).json({
        message: "Name, code and department are required",
      });
    }

    const existingCourse = await Course.findOne({
      $or: [{ name }, { code: code.toUpperCase() }],
    });

    if (existingCourse) {
      return res.status(400).json({
        message: "Course already exists",
      });
    }

    const course = await Course.create({
      name,
      code: code.toUpperCase(),
      department,
    });

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create course",
      error: error.message,
    });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ name: 1 });

    res.status(200).json({
      message: "Courses fetched successfully",
      count: courses.length,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
};