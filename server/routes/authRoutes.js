const express = require("express");

const {
  register,
  login,
} = require("../controllers/authController");

const router = express.Router();

// Public registration
// Final controller will allow public registration as Student
router.post("/register", register);

router.post("/login", login);

module.exports = router;