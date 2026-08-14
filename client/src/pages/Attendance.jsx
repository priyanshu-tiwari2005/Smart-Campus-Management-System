import { useEffect, useState } from "react";
import { academicOptions } from "../data/academicOptions";

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendanceOverview, setAttendanceOverview] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentSummary, setStudentSummary] = useState(null);
  const [studentAttendance, setStudentAttendance] =
    useState([]);

  const [form, setForm] = useState({
    student: "",
    subject: "",
    date: "",
    status: "present",
  });

  const [message, setMessage] = useState("");

  // --------------------------------------------------
  // GET ALL STUDENTS FOR MARK ATTENDANCE
  // --------------------------------------------------

  const getStudents = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/admin/students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStudents(data.students || []);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Students Error:", error);
    }
  };

  // --------------------------------------------------
  // GET ATTENDANCE OVERVIEW
  // COURSE + BRANCH + MONTH
  // --------------------------------------------------

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
      const token = localStorage.getItem("token");

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

      if (response.ok) {
        setAttendanceOverview(data.students || []);
      } else {
        alert(data.message);
        setAttendanceOverview([]);
      }
    } catch (error) {
      console.error(
        "Attendance Overview Error:",
        error
      );

      setAttendanceOverview([]);
    }
  };

  // --------------------------------------------------
  // GET SELECTED STUDENT MONTHLY SUMMARY
  // --------------------------------------------------

  const getStudentSummary = async (
    studentId,
    month
  ) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/attendance/summary/${studentId}?month=${month}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStudentSummary(data.summary);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(
        "Student Summary Error:",
        error
      );
    }
  };

  // --------------------------------------------------
  // GET SELECTED STUDENT MONTHLY RECORDS
  // --------------------------------------------------

  const getStudentAttendance = async (
    studentId,
    month
  ) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/attendance/student/${studentId}?month=${month}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStudentAttendance(
          data.attendance || []
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(
        "Student Attendance Error:",
        error
      );

      setStudentAttendance([]);
    }
  };

  // --------------------------------------------------
  // OPEN STUDENT DETAILS
  // --------------------------------------------------

  const openStudentDetails = async (student) => {
    setSelectedStudent(student);

    setStudentSummary(null);
    setStudentAttendance([]);

    await getStudentSummary(
      student.studentId,
      selectedMonth
    );

    await getStudentAttendance(
      student.studentId,
      selectedMonth
    );
  };

  // --------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------

  useEffect(() => {
    getStudents();

    // Default current month
    const currentMonth =
      new Date().toISOString().slice(0, 7);

    setSelectedMonth(currentMonth);
  }, []);

  // --------------------------------------------------
  // HANDLE COURSE
  // --------------------------------------------------

  const handleCourseChange = (e) => {
    const course = e.target.value;

    setSelectedCourse(course);
    setSelectedBranch("");
    setAttendanceOverview([]);
    setSelectedStudent(null);
  };

  // --------------------------------------------------
  // HANDLE BRANCH
  // --------------------------------------------------

  const handleBranchChange = (e) => {
    const branch = e.target.value;

    setSelectedBranch(branch);
    setAttendanceOverview([]);
    setSelectedStudent(null);
  };

  // --------------------------------------------------
  // HANDLE MONTH
  // --------------------------------------------------

  const handleMonthChange = (e) => {
    const month = e.target.value;

    setSelectedMonth(month);
    setSelectedStudent(null);
  };

  // --------------------------------------------------
  // FETCH OVERVIEW WHEN ALL FILTERS SELECTED
  // --------------------------------------------------

  useEffect(() => {
    if (
      selectedCourse &&
      selectedBranch &&
      selectedMonth
    ) {
      getAttendanceOverview(
        selectedCourse,
        selectedBranch,
        selectedMonth
      );
    } else {
      setAttendanceOverview([]);
    }
  }, [
    selectedCourse,
    selectedBranch,
    selectedMonth,
  ]);

  // --------------------------------------------------
  // HANDLE MARK ATTENDANCE INPUT
  // --------------------------------------------------

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // --------------------------------------------------
  // MARK ATTENDANCE
  // --------------------------------------------------

  const markAttendance = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

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

      // Refresh overview
      if (
        selectedCourse &&
        selectedBranch &&
        selectedMonth
      ) {
        await getAttendanceOverview(
          selectedCourse,
          selectedBranch,
          selectedMonth
        );
      }

      // Reset form
      setForm({
        student: "",
        subject: "",
        date: "",
        status: "present",
      });

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

  // --------------------------------------------------
  // FORMAT MONTH FOR DISPLAY
  // --------------------------------------------------

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

  return (
    <div className="page">

      {/* ==========================================
          PAGE HEADER
      ========================================== */}

      <div className="page-header">
        <div>
          <h1>Attendance</h1>

          <p>
            Mark and monitor student attendance
          </p>
        </div>
      </div>

      {/* ==========================================
          SUCCESS MESSAGE
      ========================================== */}

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {/* ==========================================
          MARK ATTENDANCE
      ========================================== */}

      <div className="attendance-form-card">

        <h2>Mark Attendance</h2>

        <form onSubmit={markAttendance}>

          {/* STUDENT */}

          <div className="form-group">

            <label>Student</label>

            <select
              name="student"
              value={form.student}
              onChange={handleChange}
              required
            >
              <option value="">
                Select Student
              </option>

              {students.map((student) => (
                <option
                  key={student._id}
                  value={student._id}
                >
                  {student.name}
                </option>
              ))}
            </select>

          </div>

          {/* SUBJECT */}

          <div className="form-group">

            <label>Subject</label>

            <input
              type="text"
              name="subject"
              placeholder="Enter subject"
              value={form.subject}
              onChange={handleChange}
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

      {/* ==========================================
          ATTENDANCE OVERVIEW
      ========================================== */}

      <div className="attendance-overview">

        <div className="page-header">

          <div>

            <h2>Attendance Overview</h2>

            <p>
              Select course, branch and month
              to view student attendance
            </p>

          </div>

          {attendanceOverview.length > 0 && (
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
              value={selectedCourse}
              onChange={handleCourseChange}
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

          {/* MONTH */}

          <div className="form-group">

            <label>Month</label>

            <input
              type="month"
              value={selectedMonth}
              onChange={handleMonthChange}
            />

          </div>

        </div>

        {/* FILTER INFORMATION */}

        {selectedCourse &&
          selectedBranch &&
          selectedMonth && (
            <div className="attendance-filter-info">

              <strong>
                {selectedCourse} -{" "}
                {selectedBranch}
              </strong>

              <span>
                {formatMonth(selectedMonth)}
              </span>

            </div>
          )}

        {/* STUDENT LIST */}

        {!selectedCourse ||
        !selectedBranch ||
        !selectedMonth ? (
          <div className="empty-state">

            <h3>
              Select Course, Branch and Month
            </h3>

            <p>
              Choose all three filters to view
              student attendance.
            </p>

          </div>
        ) : attendanceOverview.length === 0 ? (
          <div className="empty-state">

            <h3>
              No attendance data found
            </h3>

            <p>
              No attendance records are available
              for the selected course, branch and
              month.
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

                    <span>
                      Total
                    </span>

                    <strong>
                      {student.totalClasses}
                    </strong>

                  </div>

                  {/* PRESENT */}

                  <div className="overview-stat">

                    <span>
                      Present
                    </span>

                    <strong>
                      {student.presentClasses}
                    </strong>

                  </div>

                  {/* ABSENT */}

                  <div className="overview-stat">

                    <span>
                      Absent
                    </span>

                    <strong>
                      {student.absentClasses}
                    </strong>

                  </div>

                  {/* PERCENTAGE */}

                  <div className="percentage">
                    {student.attendancePercentage}%
                  </div>

                </div>
              )
            )}

          </div>
        )}

      </div>

      {/* ==========================================
          STUDENT DETAILS MODAL
      ========================================== */}

      {selectedStudent && (
        <div className="modal-overlay">

          <div className="attendance-detail-modal">

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
              {formatMonth(selectedMonth)}
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
                  No attendance records found
                  for this month.
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

    </div>
  );
};

export default Attendance;