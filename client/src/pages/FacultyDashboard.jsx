import { API_URL } from "./api";
import { useEffect, useState } from "react";
import { academicOptions } from "../data/academicOptions";

const FacultyDashboard = ({ logout }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [students, setStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [notices, setNotices] = useState([]);

  // ================================
  // MARK ATTENDANCE FILTERS
  // ================================

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBranch, setSelectedBranch] =
    useState("");

  // ================================
  // ATTENDANCE OVERVIEW FILTERS
  // ================================

  const [overviewCourse, setOverviewCourse] =
    useState("");

  const [overviewBranch, setOverviewBranch] =
    useState("");

  const [overviewMonth, setOverviewMonth] =
    useState(
      new Date().toISOString().slice(0, 7)
    );

  const [attendanceOverview, setAttendanceOverview] =
    useState([]);

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const [studentSummary, setStudentSummary] =
    useState(null);

  const [studentAttendance, setStudentAttendance] =
    useState([]);

  const [selectedNotice, setSelectedNotice] =
    useState(null);

  const [form, setForm] = useState({
    student: "",
    subject: "",
    date: "",
    status: "present",
  });

  const [message, setMessage] = useState("");

  // ==================================================
  // GET TOTAL REGISTERED STUDENTS
  // ==================================================

  const getTotalStudents = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/admin/students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Total Students Error:",
          data.message
        );
        return;
      }

      setTotalStudents(data.count ?? 0);
    } catch (error) {
      console.error(
        "Total Students Error:",
        error
      );
    }
  };

  // ==================================================
  // GET STUDENTS BY COURSE + BRANCH
  // FOR MARK ATTENDANCE
  // ==================================================

  const getStudentsByCourseAndBranch = async (
    course,
    branch
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/api/admin/students/course/${encodeURIComponent(
          course
        )}/branch/${encodeURIComponent(branch)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        setStudents([]);
        return;
      }

      setStudents(data.students || []);

      setForm((prev) => ({
        ...prev,
        student: "",
      }));
    } catch (error) {
      console.error(
        "Get Students Error:",
        error
      );

      setStudents([]);
    }
  };

  // ==================================================
  // GET NOTICES
  // ==================================================

  const getNotices = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/notices`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Notices Error:",
          data.message
        );
        return;
      }

      setNotices(data.notices || []);
    } catch (error) {
      console.error(
        "Notices Error:",
        error
      );
    }
  };

  // ==================================================
  // GET ATTENDANCE OVERVIEW
  // COURSE + BRANCH + MONTH
  // ==================================================

  const getAttendanceOverview = async (
    course,
    branch,
    month
  ) => {
    if (!course || !branch || !month) {
      setAttendanceOverview([]);
      return;
    }

    try {
      const params = new URLSearchParams({
        course,
        branch,
        month,
      });

      const response = await fetch(
        `${API_URL}/api/attendance/overview?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        setAttendanceOverview([]);
        return;
      }

      setAttendanceOverview(
        data.students || []
      );
    } catch (error) {
      console.error(
        "Attendance Overview Error:",
        error
      );

      setAttendanceOverview([]);
    }
  };

  // ==================================================
  // GET SELECTED STUDENT SUMMARY
  // ==================================================

  const getStudentSummary = async (
    studentId,
    month
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/api/attendance/summary/${studentId}?month=${month}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setStudentSummary(
        data.summary || null
      );
    } catch (error) {
      console.error(
        "Student Summary Error:",
        error
      );

      setStudentSummary(null);
    }
  };

  // ==================================================
  // GET SELECTED STUDENT ATTENDANCE
  // ==================================================

  const getStudentAttendance = async (
    studentId,
    month
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/api/attendance/student/${studentId}?month=${month}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setStudentAttendance(
        data.attendance || []
      );
    } catch (error) {
      console.error(
        "Student Attendance Error:",
        error
      );

      setStudentAttendance([]);
    }
  };

  // ==================================================
  // OPEN STUDENT DETAILS
  // ==================================================

  const openStudentDetails = async (
    student
  ) => {
    setSelectedStudent(student);
    setStudentSummary(null);
    setStudentAttendance([]);

    await getStudentSummary(
      student.studentId,
      overviewMonth
    );

    await getStudentAttendance(
      student.studentId,
      overviewMonth
    );
  };

  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {
    getTotalStudents();
    getNotices();
  }, []);

  // ==================================================
  // OVERVIEW FETCH
  // ==================================================

  useEffect(() => {
    if (
      overviewCourse &&
      overviewBranch &&
      overviewMonth
    ) {
      getAttendanceOverview(
        overviewCourse,
        overviewBranch,
        overviewMonth
      );
    } else {
      setAttendanceOverview([]);
    }
  }, [
    overviewCourse,
    overviewBranch,
    overviewMonth,
  ]);

  // ==================================================
  // MARK ATTENDANCE COURSE CHANGE
  // ==================================================

  const handleCourseChange = (e) => {
    const course = e.target.value;

    setSelectedCourse(course);
    setSelectedBranch("");
    setStudents([]);

    setForm({
      student: "",
      subject: "",
      date: "",
      status: "present",
    });
  };

  // ==================================================
  // MARK ATTENDANCE BRANCH CHANGE
  // ==================================================

  const handleBranchChange = (e) => {
    const branch = e.target.value;

    setSelectedBranch(branch);

    if (selectedCourse && branch) {
      getStudentsByCourseAndBranch(
        selectedCourse,
        branch
      );
    } else {
      setStudents([]);
    }
  };

  // ==================================================
  // OVERVIEW COURSE CHANGE
  // ==================================================

  const handleOverviewCourseChange = (e) => {
    const course = e.target.value;

    setOverviewCourse(course);
    setOverviewBranch("");
    setAttendanceOverview([]);
    setSelectedStudent(null);
  };

  // ==================================================
  // OVERVIEW BRANCH CHANGE
  // ==================================================

  const handleOverviewBranchChange = (e) => {
    const branch = e.target.value;

    setOverviewBranch(branch);
    setSelectedStudent(null);
  };

  // ==================================================
  // FORM CHANGE
  // ==================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==================================================
  // MARK ATTENDANCE
  // ==================================================

  const markAttendance = async (e) => {
    e.preventDefault();

    if (!selectedCourse) {
      alert("Please select a course");
      return;
    }

    if (!selectedBranch) {
      alert("Please select a branch");
      return;
    }

    if (!form.student) {
      alert("Please select a student");
      return;
    }

    if (!form.subject.trim()) {
      alert("Please enter subject");
      return;
    }

    if (!form.date) {
      alert("Please select date");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/attendance/mark`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setMessage(
        "Attendance marked successfully!"
      );

      setForm({
        student: "",
        subject: "",
        date: "",
        status: "present",
      });

      // Refresh overview if same
      // course/branch/month is selected
      if (
        overviewCourse === selectedCourse &&
        overviewBranch === selectedBranch &&
        overviewMonth
      ) {
        await getAttendanceOverview(
          overviewCourse,
          overviewBranch,
          overviewMonth
        );
      }

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error(
        "Mark Attendance Error:",
        error
      );

      alert("Something went wrong");
    }
  };

  // ==================================================
  // FORMAT MONTH
  // ==================================================

  const formatMonth = (month) => {
    if (!month) {
      return "";
    }

    const date = new Date(`${month}-01`);

    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const facultyNotices = notices
    .filter(
      (notice) =>
        notice.target === "all" ||
        notice.target === "faculty"
    )
    .slice(0, 3);

  return (
    <div className="student-dashboard-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="student-dashboard-header">
        <div>
          <h1>Faculty Dashboard</h1>
          <p>Welcome, {user?.name}</p>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>
      </header>

      {/* =================================================
          TOP CARDS
      ================================================= */}

      <div className="student-dashboard-grid">

        {/* PROFILE */}

        <div className="student-dashboard-card">
          <h3>My Profile</h3>

          <p>
            <strong>Name:</strong>{" "}
            {user?.name}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {user?.email}
          </p>

          <p>
            <strong>Department:</strong>{" "}
            {user?.department ||
              "Not assigned"}
          </p>
        </div>

        {/* TOTAL STUDENTS */}

        <div className="student-dashboard-card">
          <h3>Total Students</h3>

          <div className="student-attendance-percentage">
            {totalStudents}
          </div>

          <p>
            Total registered students
          </p>
        </div>

        {/* NOTICES */}

        <div className="student-dashboard-card">
          <h3>Latest Notices</h3>

          {facultyNotices.length === 0 ? (
            <p>
              No notices available.
            </p>
          ) : (
            facultyNotices.map(
              (notice) => (
                <div
                  key={notice._id}
                  className="student-notice"
                  onClick={() =>
                    setSelectedNotice(notice)
                  }
                >
                  <h4>
                    {notice.title}
                  </h4>

                  <p>
                    {notice.description.length >
                    100
                      ? `${notice.description.substring(
                          0,
                          100
                        )}...`
                      : notice.description}
                  </p>

                  {notice.important && (
                    <span className="important">
                      Important
                    </span>
                  )}

                  <small>
                    Click to read full notice
                  </small>
                </div>
              )
            )
          )}
        </div>

      </div>

      {/* =================================================
          MARK ATTENDANCE
      ================================================= */}

      <div className="student-dashboard-card">

        <h3>
          Mark Student Attendance
        </h3>

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        <form
          onSubmit={markAttendance}
          className="faculty-attendance-form"
        >

          {/* COURSE */}

          <div className="form-group">
            <label>Course</label>

            <select
              value={selectedCourse}
              onChange={handleCourseChange}
              required
            >
              <option value="">
                Select Course
              </option>

              {Object.keys(
                academicOptions
              ).map((course) => (
                <option
                  key={course}
                  value={course}
                >
                  {course}
                </option>
              ))}
            </select>
          </div>

          {/* BRANCH */}

          <div className="form-group">
            <label>Branch</label>

            <select
              value={selectedBranch}
              onChange={handleBranchChange}
              disabled={!selectedCourse}
              required
            >
              <option value="">
                Select Branch
              </option>

              {selectedCourse &&
                Object.keys(
                  academicOptions[
                    selectedCourse
                  ]
                ).map((branch) => (
                  <option
                    key={branch}
                    value={branch}
                  >
                    {branch}
                  </option>
                ))}
            </select>
          </div>

          {/* STUDENT */}

          <div className="form-group">
            <label>Student</label>

            <select
              name="student"
              value={form.student}
              onChange={handleChange}
              disabled={!selectedBranch}
              required
            >
              <option value="">
                {!selectedBranch
                  ? "Select Course and Branch first"
                  : students.length === 0
                  ? "No students found"
                  : "Select Student"}
              </option>

              {students.map(
                (student) => (
                  <option
                    key={student._id}
                    value={student._id}
                  >
                    {student.name}
                  </option>
                )
              )}
            </select>
          </div>

          {/* SUBJECT */}

          <div className="form-group">
            <label>Subject</label>

            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Enter subject"
              required
            />
          </div>

          {/* DATE */}

          <div className="form-group">
            <label>Date</label>

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          {/* STATUS */}

          <div className="form-group">
            <label>Status</label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="present">
                Present
              </option>

              <option value="absent">
                Absent
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="mark-btn"
          >
            Mark Attendance
          </button>

        </form>

      </div>

      {/* =================================================
          ATTENDANCE OVERVIEW
      ================================================= */}

      <div className="student-dashboard-card">

        <div className="page-header">

          <div>
            <h2>
              Attendance Overview
            </h2>

            <p>
              Course → Branch → Month →
              Students
            </p>
          </div>

          {attendanceOverview.length >
            0 && (
            <div className="count">
              Students:{" "}
              {attendanceOverview.length}
            </div>
          )}

        </div>

        {/* FILTERS */}

        <div className="attendance-filter-row">

          {/* COURSE */}

          <div className="form-group">

            <label>Course</label>

            <select
              value={overviewCourse}
              onChange={
                handleOverviewCourseChange
              }
            >
              <option value="">
                Select Course
              </option>

              {Object.keys(
                academicOptions
              ).map((course) => (
                <option
                  key={course}
                  value={course}
                >
                  {course}
                </option>
              ))}
            </select>

          </div>

          {/* BRANCH */}

          <div className="form-group">

            <label>Branch</label>

            <select
              value={overviewBranch}
              onChange={
                handleOverviewBranchChange
              }
              disabled={!overviewCourse}
            >
              <option value="">
                Select Branch
              </option>

              {overviewCourse &&
                Object.keys(
                  academicOptions[
                    overviewCourse
                  ]
                ).map((branch) => (
                  <option
                    key={branch}
                    value={branch}
                  >
                    {branch}
                  </option>
                ))}
            </select>

          </div>

          {/* MONTH */}

          <div className="form-group">

            <label>Month</label>

            <input
              type="month"
              value={overviewMonth}
              onChange={(e) => {
                setOverviewMonth(
                  e.target.value
                );
                setSelectedStudent(null);
              }}
            />

          </div>

        </div>

        {/* SELECTED FILTER INFO */}

        {overviewCourse &&
          overviewBranch &&
          overviewMonth && (
            <div className="attendance-filter-info">

              <strong>
                {overviewCourse} -{" "}
                {overviewBranch}
              </strong>

              <span>
                {formatMonth(
                  overviewMonth
                )}
              </span>

            </div>
          )}

        {/* STUDENTS */}

        {!overviewCourse ||
        !overviewBranch ||
        !overviewMonth ? (

          <div className="empty-state">

            <h3>
              Select Course, Branch and Month
            </h3>

            <p>
              Select all three filters to
              view attendance.
            </p>

          </div>

        ) : attendanceOverview.length ===
          0 ? (

          <div className="empty-state">

            <h3>
              No students found
            </h3>

            <p>
              No students are registered
              in {overviewCourse} -{" "}
              {overviewBranch}.
            </p>

          </div>

        ) : (

          <div className="overview-list">

            {attendanceOverview.map(
              (student) => (
                <div
                  className="attendance-student-card"
                  key={student.studentId}
                  onClick={() =>
                    openStudentDetails(student)
                  }
                >

                  {/* STUDENT */}

                  <div className="overview-student">

                    <div className="student-avatar">
                      {student.name
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>

                      <h3>
                        {student.name}
                      </h3>

                      <p>
                        {student.course} •{" "}
                        {student.branch}
                      </p>

                      <small>
                        Click to view details
                      </small>

                    </div>

                  </div>

                  {/* TOTAL */}

                  <div className="overview-stat">
                    <span>Total</span>
                    <strong>
                      {student.totalClasses}
                    </strong>
                  </div>

                  {/* PRESENT */}

                  <div className="overview-stat">
                    <span>Present</span>
                    <strong>
                      {student.presentClasses}
                    </strong>
                  </div>

                  {/* ABSENT */}

                  <div className="overview-stat">
                    <span>Absent</span>
                    <strong>
                      {student.absentClasses}
                    </strong>
                  </div>

                  {/* PERCENTAGE */}

                  <div className="percentage">
                    {
                      student.attendancePercentage
                    }
                    %
                  </div>

                </div>
              )
            )}

          </div>

        )}

      </div>

      {/* =================================================
          STUDENT ATTENDANCE DETAILS
      ================================================= */}

      {selectedStudent && (
        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedStudent(null)
          }
        >

          <div
            className="attendance-detail-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={() =>
                setSelectedStudent(null)
              }
            >
              ×
            </button>

            <h2>
              {selectedStudent.name}
            </h2>

            <p className="modal-student-course">
              {selectedStudent.course} •{" "}
              {selectedStudent.branch}
            </p>

            <p className="modal-month">
              {formatMonth(
                overviewMonth
              )}
            </p>

            {/* SUMMARY */}

            {studentSummary && (
              <div className="attendance-detail-summary">

                <div>
                  <span>
                    Total Classes
                  </span>

                  <strong>
                    {
                      studentSummary.totalClasses
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Present
                  </span>

                  <strong>
                    {
                      studentSummary.presentClasses
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Absent
                  </span>

                  <strong>
                    {
                      studentSummary.absentClasses
                    }
                  </strong>
                </div>

                <div className="detail-percentage">
                  <span>
                    Attendance
                  </span>

                  <strong>
                    {
                      studentSummary.attendancePercentage
                    }
                    %
                  </strong>
                </div>

              </div>
            )}

            {/* RECORDS */}

            <div className="attendance-detail-records">

              <h3>
                Attendance Records
              </h3>

              {studentAttendance.length ===
              0 ? (

                <p>
                  No attendance records for
                  this month.
                </p>

              ) : (

                studentAttendance.map(
                  (record) => (
                    <div
                      className="student-attendance-row"
                      key={record._id}
                    >

                      <div>

                        <strong>
                          {record.subject}
                        </strong>

                        <p>
                          {new Date(
                            record.date
                          ).toLocaleDateString()}
                        </p>

                      </div>

                      <span
                        className={
                          record.status ===
                          "present"
                            ? "present"
                            : "absent"
                        }
                      >
                        {record.status}
                      </span>

                    </div>
                  )
                )

              )}

            </div>

            <button
              className="mark-btn"
              onClick={() =>
                setSelectedStudent(null)
              }
            >
              Close
            </button>

          </div>

        </div>
      )}

      {/* =================================================
          NOTICE DETAILS
      ================================================= */}

      {selectedNotice && (
        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedNotice(null)
          }
        >

          <div
            className="notice-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={() =>
                setSelectedNotice(null)
              }
            >
              ×
            </button>

            <h2>
              {selectedNotice.title}
            </h2>

            <div className="modal-meta">

              <span>
                Target:{" "}
                <strong>
                  {selectedNotice.target}
                </strong>
              </span>

              {selectedNotice.important && (
                <span className="important">
                  Important
                </span>
              )}

            </div>

            <div className="full-description">
              {selectedNotice.description}
            </div>

            <div className="modal-footer">

              <span>
                Posted by:{" "}
                <strong>
                  {selectedNotice.postedBy?.name ||
                    "Admin"}
                </strong>
              </span>

              <span>
                {new Date(
                  selectedNotice.createdAt
                ).toLocaleDateString()}
              </span>

            </div>

            <button
              className="mark-btn"
              onClick={() =>
                setSelectedNotice(null)
              }
            >
              Close
            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default FacultyDashboard;