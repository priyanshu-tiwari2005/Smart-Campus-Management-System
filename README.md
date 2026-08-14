# 🎓 Smart Campus Management System

A full-stack **MERN-based Campus Management System** designed to manage students, faculty, attendance, notices, and academic information through dedicated **Admin, Faculty, and Student dashboards**.

The application provides role-based access and a structured academic workflow using **Course → Branch → Department**.

---

## 🚀 Features

### 👨‍💼 Admin Dashboard

* Dashboard with total users, students, faculty, and admins
* Student management

  * Course-wise and branch-wise student listing
  * Add student
  * Search student
  * Update student academic details
  * Delete student
* Faculty management

  * Add faculty
  * Search faculty
  * Delete faculty
* Notice management

  * Create notices
  * Target notices to everyone, students, or faculty
  * Mark notices as important
  * View complete notice details
  * Delete notices
* Attendance management

  * Mark student attendance
  * Course → Branch → Month attendance overview
  * View all students with attendance percentage
  * Click a student to view detailed monthly attendance

### 👨‍🏫 Faculty Dashboard

* Faculty profile
* Total registered students
* Latest notices
* View complete notice details
* Mark attendance using:

  * Course
  * Branch
  * Student
  * Subject
  * Date
  * Present / Absent
* Attendance overview

  * Course → Branch → Month
  * Student-wise attendance percentage
  * Detailed monthly attendance on student selection

### 🎓 Student Dashboard

* Student profile
* Course, branch, and department information
* Monthly attendance selection
* Attendance percentage
* Total, present, and absent classes
* Monthly attendance records
* Latest notices
* Full notice details

---

## 🔐 Role-Based Access

| Role    | Access                                           |
| ------- | ------------------------------------------------ |
| Admin   | Full system management                           |
| Faculty | Student viewing, attendance, and faculty notices |
| Student | Own profile, attendance, and student notices     |

Authentication is implemented using **JWT**, with protected routes and role-based middleware.

---

## 🏫 Academic Structure

The application uses a fixed academic hierarchy:

```text
Course
  ↓
Branch
  ↓
Department
```

Example:

```text
B.Tech
  ├── CSE → Computer Science & Engineering
  ├── ECE → Electronics & Communication Engineering
  ├── EE  → Electrical Engineering
  └── ME  → Mechanical Engineering
```

Academic values are validated on the backend before storing student information.

---

## 🛠️ Tech Stack

### Frontend

* React
* React Router
* JavaScript
* CSS
* Vite

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs

### Development Tools

* Git
* GitHub
* Nodemon

---

## 📂 Project Structure

```text
smart-campus-management-system/
│
├── client/
│   ├── public/
│   └── src/
│       ├── data/
│       │   └── academicOptions.js
│       ├── pages/
│       │   ├── Attendance.jsx
│       │   ├── Faculty.jsx
│       │   ├── FacultyDashboard.jsx
│       │   ├── Notices.jsx
│       │   ├── StudentDashboard.jsx
│       │   └── Students.jsx
│       ├── App.css
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── config/
│   │   ├── academicOptions.js
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── attendanceController.js
│   │   ├── authController.js
│   │   └── noticeController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Attendance.js
│   │   ├── Notice.js
│   │   └── user.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── authRoutes.js
│   │   └── noticeRoutes.js
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/kajalengg/smart-campus-management-system.git
```

```bash
cd smart-campus-management-system
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `server` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Do not commit `.env` to GitHub.

---

## ▶️ Run the Project

### Start Backend

From the `server` folder:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

### Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

The frontend will run on the Vite development URL shown in the terminal.

---

## 🔄 Application Flow

### Admin

```text
Login
  ↓
Dashboard
  ↓
Students / Faculty / Notices / Attendance
```

### Faculty

```text
Login
  ↓
Faculty Dashboard
  ↓
Course → Branch → Student
  ↓
Mark Attendance

Course → Branch → Month
  ↓
Attendance Overview
  ↓
Click Student
  ↓
Monthly Details
```

### Student

```text
Login
  ↓
Student Dashboard
  ↓
Select Month
  ↓
Attendance Percentage
  ↓
Attendance Records
```

---

## 📊 Attendance System

Attendance is stored with:

```text
Student
Subject
Date
Status
Marked By
```

Supported statuses:

```text
Present
Absent
```

Attendance percentage is calculated from the selected month's attendance records.

---

## 📢 Notice System

Notices support:

```text
Title
Description
Target Audience
Important Status
Posted By
Created Date
```

Target audiences:

```text
Everyone
Students
Faculty
```

Users see the notices relevant to their role.

---

## 🔒 Security

* JWT-based authentication
* Password hashing using bcryptjs
* Protected API routes
* Role-based authorization
* Students can access their own attendance
* Admin-only management operations

---

## 🎯 Future Improvements

* Online deployment
* Profile photo support
* Attendance charts and analytics
* Faculty-wise subject management
* Student result management
* Email notifications
* Password reset functionality
* Pagination and advanced search
* Mobile UI improvements

---

## 👩‍💻 Author

**Kajal Yadav**

GitHub:
https://github.com/kajalengg

---

## ⭐ Project

If you find this project useful, consider giving the repository a ⭐ on GitHub.
v
