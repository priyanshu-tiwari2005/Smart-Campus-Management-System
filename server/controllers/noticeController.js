const Notice = require("../models/Notice");

// ==========================================
// CREATE NOTICE
// ==========================================

const createNotice = async (req, res) => {
  try {
    const {
      title,
      description,
      target,
      important,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message:
          "Title and description are required",
      });
    }

    const allowedTargets = [
      "all",
      "student",
      "faculty",
    ];

    const noticeTarget = target || "all";

    if (!allowedTargets.includes(noticeTarget)) {
      return res.status(400).json({
        message: "Invalid notice target",
      });
    }

    const notice = await Notice.create({
      title: title.trim(),
      description: description.trim(),
      target: noticeTarget,
      important: Boolean(important),
      postedBy: req.user.id,
    });

    const populatedNotice =
      await notice.populate(
        "postedBy",
        "name email role"
      );

    return res.status(201).json({
      message: "Notice created successfully",
      notice: populatedNotice,
    });
  } catch (error) {
    console.error(
      "Create Notice Error:",
      error
    );

    return res.status(500).json({
      message: "Failed to create notice",
      error: error.message,
    });
  }
};

// ==========================================
// GET NOTICES
// Student/Faculty see relevant notices
// Admin sees all notices
// ==========================================

const getAllNotices = async (req, res) => {
  try {
    const filter = {};

    if (req.user.role === "student") {
      filter.target = {
        $in: ["all", "student"],
      };
    }

    if (req.user.role === "faculty") {
      filter.target = {
        $in: ["all", "faculty"],
      };
    }

    const notices = await Notice.find(filter)
      .populate(
        "postedBy",
        "name email role"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Notices fetched successfully",
      count: notices.length,
      notices,
    });
  } catch (error) {
    console.error(
      "Get Notices Error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch notices",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE NOTICE
// ==========================================

const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;

    const notice =
      await Notice.findByIdAndDelete(id);

    if (!notice) {
      return res.status(404).json({
        message: "Notice not found",
      });
    }

    return res.status(200).json({
      message: "Notice deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Notice Error:",
      error
    );

    return res.status(500).json({
      message: "Failed to delete notice",
      error: error.message,
    });
  }
};

module.exports = {
  createNotice,
  getAllNotices,
  deleteNotice,
};