import { API_URL } from "./api";
import { useEffect, useState } from "react";

const StudentDashboard = ({ logout }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [summary, setSummary] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [notices, setNotices] = useState([]);

  // Current month
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  // Selected notice for full details
  const [selectedNotice, setSelectedNotice] = useState(null);

  // ==========================================
  // GET ATTENDANCE RECORDS
  // ==========================================

  const getAttendance = async (month) => {
    try {
      const response = await fetch(
        `${API_URL}/api/attendance/student/${user.id}?month=${month}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setAttendance(data.attendance || []);
      } else {
        console.error(data.message);
        setAttendance([]);
      }
    } catch (error) {
      console.error("Attendance error:", error);
      setAttendance([]);
    }
  };

  // ==========================================
  // GET ATTENDANCE SUMMARY
  // ==========================================

  const getSummary = async (month) => {
    try {
      const response = await fetch(
        `${API_URL}/api/attendance/summary/${user.id}?month=${month}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSummary(data.summary);
      } else {
        console.error(data.message);
        setSummary(null);
      }
    } catch (error) {
      console.error("Summary error:", error);
      setSummary(null);
    }
  };

  // ==========================================
  // GET NOTICES
  // ==========================================

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

      if (response.ok) {
        setNotices(data.notices || []);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Notices error:", error);
    }
  };

  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    getAttendance(selectedMonth);
    getSummary(selectedMonth);
  }, [selectedMonth]);

  useEffect(() => {
    getNotices();
  }, []);

  // ==========================================
  // MONTH CHANGE
  // ==========================================

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  // ==========================================
  // FORMAT MONTH
  // ==========================================

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
    <div className="student-dashboard-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <header className="student-dashboard-header">
        <div>
          <h1>Student Dashboard</h1>
          <p>Welcome, {user?.name}</p>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>
      </header>

      {/* ======================================
          TOP CARDS
      ====================================== */}

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
            <strong>Course:</strong>{" "}
            {user?.course || "Not assigned"}
          </p>

          <p>
            <strong>Branch:</strong>{" "}
            {user?.branch || "Not assigned"}
          </p>

          <p>
            <strong>Department:</strong>{" "}
            {user?.department || "Not assigned"}
          </p>
        </div>

        {/* ATTENDANCE SUMMARY */}

        <div className="student-dashboard-card">
          <h3>My Attendance</h3>

          <div className="form-group">
            <label>Attendance Month</label>

            <input
              type="month"
              value={selectedMonth}
              onChange={handleMonthChange}
            />
          </div>

          <p className="selected-month-text">
            {formatMonth(selectedMonth)}
          </p>

          {summary ? (
            <>
              <div className="student-attendance-percentage">
                {summary.attendancePercentage}%
              </div>

              <p>
                Present:{" "}
                {summary.presentClasses}
              </p>

              <p>
                Absent:{" "}
                {summary.absentClasses}
              </p>

              <p>
                Total Classes:{" "}
                {summary.totalClasses}
              </p>
            </>
          ) : (
            <p>
              No attendance data available for this
              month.
            </p>
          )}
        </div>

        {/* NOTICES */}

        <div className="student-dashboard-card student-notices-card">
          <h3>Latest Notices</h3>

          {notices.length === 0 ? (
            <p>No notices available.</p>
          ) : (
            notices.slice(0, 5).map((notice) => (
              <div
                className="student-notice"
                key={notice._id}
                onClick={() =>
                  setSelectedNotice(notice)
                }
              >
                <h4>{notice.title}</h4>

                <p>
                  {notice.description.length > 100
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
            ))
          )}
        </div>
      </div>

      {/* ======================================
          ATTENDANCE RECORDS
      ====================================== */}

      <div className="student-dashboard-card">

        <div className="attendance-record-header">
          <div>
            <h3>Attendance Records</h3>

            <p>
              {formatMonth(selectedMonth)}
            </p>
          </div>
        </div>

        {attendance.length === 0 ? (
          <p>
            No attendance records found for{" "}
            {formatMonth(selectedMonth)}.
          </p>
        ) : (
          attendance.map((record) => (
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
                  record.status === "present"
                    ? "present"
                    : "absent"
                }
              >
                {record.status}
              </span>
            </div>
          ))
        )}
      </div>

      {/* ======================================
          FULL NOTICE MODAL
      ====================================== */}

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
              type="button"
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
              type="button"
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

export default StudentDashboard;