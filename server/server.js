const express = require("express");
const dns = require("dns");
const cors = require("cors");
const dotenv = require("dotenv");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://smart-campus-management-system-self.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Not allowed by CORS")
      );
    },
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/attendance", attendanceRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Smart Campus API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Smart Campus API running on port ${PORT}`
  );
});