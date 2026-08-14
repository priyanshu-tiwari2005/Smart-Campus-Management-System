const express = require("express");

const {
  createNotice,
  getAllNotices,
  deleteNotice,
} = require("../controllers/noticeController");

const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Admin → create notice
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createNotice
);

// Admin / Faculty / Student → view relevant notices
router.get(
  "/",
  authMiddleware,
  getAllNotices
);

// Admin → delete notice
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteNotice
);

module.exports = router;