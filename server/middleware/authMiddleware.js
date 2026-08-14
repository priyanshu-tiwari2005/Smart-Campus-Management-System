const jwt = require("jsonwebtoken");

// ==========================================
// AUTHENTICATION
// ==========================================

const authMiddleware = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = authorization.startsWith("Bearer ")
      ? authorization.substring(7)
      : authorization;

    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (!decoded.id || !decoded.role) {
      return res.status(401).json({
        message: "Invalid authentication token",
      });
    }

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// ==========================================
// ADMIN ONLY
// ==========================================

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
};

// ==========================================
// FACULTY ONLY
// ==========================================

const facultyMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "faculty") {
    return res.status(403).json({
      message: "Faculty access required",
    });
  }

  next();
};

// ==========================================
// ADMIN OR FACULTY
// ==========================================

const adminOrFacultyMiddleware = (
  req,
  res,
  next
) => {
  if (
    !req.user ||
    (req.user.role !== "admin" &&
      req.user.role !== "faculty")
  ) {
    return res.status(403).json({
      message:
        "Admin or faculty access required",
    });
  }

  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  facultyMiddleware,
  adminOrFacultyMiddleware,
};