import { API_URL } from "../api";
import { useEffect, useState } from "react";

const Notices = () => {
  const [notices, setNotices] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    target: "all",
    important: false,
  });

  const [message, setMessage] = useState("");
  const [selectedNotice, setSelectedNotice] =
    useState(null);

  // ==========================================
  // GET ALL NOTICES
  // ==========================================

  const getNotices = async () => {
    try {
      const token = localStorage.getItem("token");

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
        alert(data.message);
        return;
      }

      setNotices(data.notices || []);
    } catch (error) {
      console.error(
        "Get Notices Error:",
        error
      );

      alert("Failed to fetch notices");
    }
  };

  useEffect(() => {
    getNotices();
  }, []);

  // ==========================================
  // FORM INPUT
  // ==========================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ==========================================
  // CREATE NOTICE
  // ==========================================

  const createNotice = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter notice title");
      return;
    }

    if (!form.description.trim()) {
      alert(
        "Please enter notice description"
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/notices`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            title: form.title.trim(),
            description:
              form.description.trim(),
            target: form.target,
            important: form.important,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setMessage(
        "Notice created successfully!"
      );

      setForm({
        title: "",
        description: "",
        target: "all",
        important: false,
      });

      await getNotices();

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error(
        "Create Notice Error:",
        error
      );

      alert("Something went wrong");
    }
  };

  // ==========================================
  // DELETE NOTICE
  // ==========================================

  const deleteNotice = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this notice?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/notices/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setNotices((prev) =>
        prev.filter(
          (notice) =>
            notice._id !== id
        )
      );

      if (
        selectedNotice?._id === id
      ) {
        setSelectedNotice(null);
      }

      setMessage(
        "Notice deleted successfully!"
      );

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error(
        "Delete Notice Error:",
        error
      );

      alert("Something went wrong");
    }
  };

  // ==========================================
  // OPEN NOTICE
  // ==========================================

  const openNotice = (notice) => {
    setSelectedNotice(notice);
  };

  // ==========================================
  // CLOSE NOTICE
  // ==========================================

  const closeNotice = () => {
    setSelectedNotice(null);
  };

  return (
    <div className="page">

      {/* PAGE HEADER */}

      <div className="page-header">

        <div>
          <h1>Notices</h1>

          <p>
            Manage campus announcements
          </p>
        </div>

        <div className="count">
          Total Notices:{" "}
          {notices.length}
        </div>

      </div>

      {/* SUCCESS MESSAGE */}

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {/* CREATE NOTICE */}

      <div className="notice-form-card">

        <h2>Create Notice</h2>

        <form onSubmit={createNotice}>

          {/* TITLE */}

          <div className="form-group">

            <label>
              Title
            </label>

            <input
              type="text"
              name="title"
              placeholder="Enter notice title"
              value={form.title}
              onChange={handleChange}
              required
            />

          </div>

          {/* DESCRIPTION */}

          <div className="form-group">

            <label>
              Description
            </label>

            <textarea
              name="description"
              placeholder="Enter complete notice description"
              value={form.description}
              onChange={handleChange}
              rows="6"
              required
            />

          </div>

          {/* TARGET */}

          <div className="form-group">

            <label>
              Target Audience
            </label>

            <select
              name="target"
              value={form.target}
              onChange={handleChange}
            >

              <option value="all">
                Everyone
              </option>

              <option value="student">
                Students
              </option>

              <option value="faculty">
                Faculty
              </option>

            </select>

          </div>

          {/* IMPORTANT */}

          <label className="checkbox-group">

            <input
              type="checkbox"
              name="important"
              checked={form.important}
              onChange={handleChange}
            />

            Mark as Important

          </label>

          <button
            type="submit"
            className="mark-btn"
          >
            Create Notice
          </button>

        </form>

      </div>

      {/* ALL NOTICES */}

      <div className="notice-list-section">

        <div className="notice-list-heading">

          <div>
            <h2>
              All Notices
            </h2>

            <p>
              Click View Details to read
              the complete notice.
            </p>
          </div>

        </div>

        <div className="notice-list">

          {notices.length === 0 ? (

            <div className="empty-state">

              <h3>
                No notices found
              </h3>

              <p>
                Create a notice to get
                started.
              </p>

            </div>

          ) : (

            notices.map((notice) => {

              const description =
                notice.description || "";

              return (
                <div
                  className="notice-card"
                  key={notice._id}
                >

                  {/* TOP */}

                  <div className="notice-top">

                    <h2>
                      {notice.title}
                    </h2>

                    {notice.important && (
                      <span className="important">
                        Important
                      </span>
                    )}

                  </div>

                  {/* SHORT DESCRIPTION */}

                  <p className="notice-description">

                    {description.length >
                    150
                      ? `${description.substring(
                          0,
                          150
                        )}...`
                      : description}

                  </p>

                  {/* FOOTER */}

                  <div className="notice-footer">

                    <div className="notice-meta">

                      <span>
                        Target:{" "}
                        <strong>
                          {notice.target}
                        </strong>
                      </span>

                      <span>
                        Posted by:{" "}
                        <strong>
                          {notice
                            .postedBy
                            ?.name ||
                            "Admin"}
                        </strong>
                      </span>

                      <span>
                        {notice.createdAt
                          ? new Date(
                              notice.createdAt
                            ).toLocaleDateString()
                          : ""}
                      </span>

                    </div>

                    <div className="notice-actions">

                      <button
                        type="button"
                        className="view-btn"
                        onClick={() =>
                          openNotice(
                            notice
                          )
                        }
                      >
                        View Details
                      </button>

                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() =>
                          deleteNotice(
                            notice._id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>
              );
            })

          )}

        </div>

      </div>

      {/* FULL NOTICE MODAL */}

      {selectedNotice && (

        <div
          className="modal-overlay"
          onClick={closeNotice}
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
              onClick={closeNotice}
              aria-label="Close notice"
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
                  {
                    selectedNotice.target
                  }
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
                  {
                    selectedNotice
                      .postedBy
                      ?.name ||
                    "Admin"
                  }
                </strong>
              </span>

              <span>
                {selectedNotice.createdAt
                  ? new Date(
                      selectedNotice.createdAt
                    ).toLocaleDateString()
                  : ""}
              </span>

            </div>

            <button
              type="button"
              className="mark-btn"
              onClick={closeNotice}
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default Notices;