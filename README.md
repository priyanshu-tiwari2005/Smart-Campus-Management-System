# 🎓 Smart Campus Management System

A full-stack **MERN-based Smart Campus Management System** designed to digitize and simplify essential academic activities such as student management, faculty management, attendance tracking, notices, and academic information.

The system provides dedicated dashboards for **Admin, Faculty, and Students**, with secure JWT-based authentication and role-based access control.

---

## 📌 Overview

Managing student records, attendance, faculty information, and academic notices manually can be time-consuming and difficult to maintain.

The **Smart Campus Management System** provides a centralized web-based platform where different users can perform their respective academic activities from a single application.

### 👥 User Roles

* 👨‍💼 **Admin** — Manage students, faculty, notices, and attendance
* 👨‍🏫 **Faculty** — Manage attendance and access academic information
* 🎓 **Student** — View profile, attendance, and relevant notices

---

## ✨ Features

### 👨‍💼 Admin Dashboard

The Admin has complete control over the system.

#### Student Management

* View all students
* Search students
* Filter students by course and branch
* Add students
* Update student academic information
* Delete students

#### Faculty Management

* View faculty members
* Search faculty
* Add faculty
* Delete faculty

#### Notice Management

* Create notices
* Target notices to:

  * Everyone
  * Students
  * Faculty
* Mark notices as important
* View complete notice details
* Delete notices

#### Attendance Management

* Mark student attendance
* Filter attendance by:

  * Course
  * Branch
  * Month
* View student-wise attendance percentage
* View detailed monthly attendance records

---

### 👨‍🏫 Faculty Dashboard

Faculty members can:

* View faculty profile
* View registered students
* View latest notices
* View complete notice details
* Mark student attendance
* Select course and branch
* Select student and subject
* Select attendance date
* Mark students as Present/Absent
* View attendance statistics
* View detailed monthly attendance records

---

### 🎓 Student Dashboard

Students can:

* View personal profile
* View course, branch, and department
* Select attendance month
* View attendance percentage
* View total classes
* View present classes
* View absent classes
* View monthly attendance records
* View relevant notices
* View complete notice details

---

## 🔐 Authentication & Authorization

The application uses **JWT-based authentication** and role-based authorization.

### Access Levels

| Role          | Access                             |
| ------------- | ---------------------------------- |
| 👨‍💼 Admin   | Full system management             |
| 👨‍🏫 Faculty | Student information and attendance |
| 🎓 Student    | Personal profile and attendance    |

Passwords are securely hashed using **bcryptjs**.

Protected API routes ensure that users can only access functionality allowed for their role.

---

## 🏫 Academic Structure

The application follows a structured academic hierarchy:

```text
Course
   ↓
Branch
   ↓
Department
```

### Example

```text
B.Tech
├── CSE → Computer Science & Engineering
├── ECE → Electronics & Communication Engineering
├── EE  → Electrical Engineering
└── ME  → Mechanical Engineering
```

Academic information is validated on the backend before being stored in the database.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* JavaScript
* CSS
* Vite
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs

### Development Tools

* Git
* GitHub
* VS Code
* Nodemon
* MongoDB Atlas

---

## 🏗️ System Architecture

```text
                    Smart Campus
                         │
                         ↓
                   React Frontend
                         │
                    REST APIs
                         │
                         ↓
                 Node.js + Express
                         │
              ┌──────────┴──────────┐
              ↓                     ↓
        Authentication          Controllers
              │                     │
              └──────────┬──────────┘
                         ↓
                      Mongoose
                         │
                         ↓
                     MongoDB
```

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
│       │
│       ├── pages/
│       │   ├── Attendance.jsx
│       │   ├── Faculty.jsx
│       │   ├── FacultyDashboard.jsx
│       │   ├── Notices.jsx
│       │   ├── StudentDashboard.jsx
│       │   └── Students.jsx
│       │
│       ├── App.css
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── config/
│   │   ├── academicOptions.js
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── attendanceController.js
│   │   ├── authController.js
│   │   └── noticeController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── Attendance.js
│   │   ├── Notice.js
│   │   └── user.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── authRoutes.js
│   │   └── noticeRoutes.js
│   │
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/smart-campus-management-system.git
```

```bash
cd smart-campus-management-system
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../server
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

> ⚠️ Never commit your `.env` file or expose your MongoDB credentials and JWT secret.

---

## ▶️ Running the Application

### Start Backend

From the `server` directory:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

### Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

Vite will display the frontend development URL in the terminal.

---

## 🔄 Application Workflow

### 👨‍💼 Admin

```text
Login
  ↓
Admin Dashboard
  ↓
Students / Faculty / Notices / Attendance
  ↓
Manage Campus Data
```

### 👨‍🏫 Faculty

```text
Login
  ↓
Faculty Dashboard
  ↓
Select Course
  ↓
Select Branch
  ↓
Select Student / Subject / Date
  ↓
Mark Attendance
  ↓
View Attendance Overview
  ↓
View Monthly Details
```

### 🎓 Student

```text
Login
  ↓
Student Dashboard
  ↓
Select Month
  ↓
View Attendance Percentage
  ↓
View Attendance Records
  ↓
View Relevant Notices
```

---

## 📊 Attendance Management

Attendance records contain information such as:

```text
Student
Subject
Date
Status
Marked By
```

Supported attendance statuses:

```text
Present
Absent
```

The system calculates attendance percentage based on the student's attendance records.

---

## 📢 Notice Management

Each notice can contain:

```text
Title
Description
Target Audience
Important Status
Posted By
Created Date
```

### Target Audiences

```text
Everyone
Students
Faculty
```

Users receive notices according to their assigned role and the notice's target audience.

---

## 🔒 Security

The application implements:

* JWT authentication
* Password hashing with bcryptjs
* Protected API routes
* Role-based authorization
* Backend validation
* Restricted administrative operations
* User-specific data access

---

## 🚀 Future Enhancements

The following features can be added in future versions:

* 📱 Responsive mobile-first interface
* 📊 Advanced attendance analytics
* 📚 Student result management
* 📖 Faculty-wise subject management
* 📧 Email notifications
* 🔑 Password reset
* 🔎 Advanced search and filtering
* 📄 Pagination
* 🖼️ Profile photo support
* ☁️ Cloud deployment
* 📅 Online timetable management
* 💼 Placement management module

---

## 🎯 Project Goals

The main objectives of this project are:

1. Centralize campus-related academic information.
2. Reduce manual attendance management.
3. Provide role-specific access to users.
4. Improve communication through digital notices.
5. Provide students and faculty with easy access to academic information.
6. Build a scalable full-stack web application using the MERN stack.

---

## 👨‍💻 Author

**Priyanshu Tiwari**

B.Tech Computer Science Engineering
2027 Batch

GitHub: **[Add your GitHub profile]**

LinkedIn: **[Add your LinkedIn profile]**

---

## ⭐
