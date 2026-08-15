import { API_URL } from "../api";
import { useEffect, useState } from "react";
import { academicOptions } from "../data/academicOptions";

const Faculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [facultyForm, setFacultyForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
  });

  // Get all faculty
  const getFaculty = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/admin/faculty`,
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

      setFaculty(data.faculty || []);
    } catch (error) {
      console.error("Faculty Error:", error);
      alert("Failed to fetch faculty");
    }
  };

  useEffect(() => {
    getFaculty();
  }, []);

  // Faculty form input
  const handleFacultyChange = (e) => {
    const { name, value } = e.target;

    setFacultyForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add faculty
  const addFaculty = async (e) => {
    e.preventDefault();

    if (!facultyForm.department) {
      alert("Please select department");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: facultyForm.name,
            email: facultyForm.email,
            password: facultyForm.password,
            department: facultyForm.department,
            role: "faculty",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Faculty added successfully");

      setFacultyForm({
        name: "",
        email: "",
        password: "",
        department: "",
      });

      setShowForm(false);

      await getFaculty();
    } catch (error) {
      console.error("Add Faculty Error:", error);
      alert("Something went wrong");
    }
  };

  // Delete faculty
  const deleteFaculty = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this faculty member?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/admin/faculty/${id}`,
        {
          method: "DELETE",

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

      alert("Faculty deleted successfully");

      setFaculty((prevFaculty) =>
        prevFaculty.filter(
          (member) => member._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete Faculty Error:",
        error
      );

      alert("Something went wrong");
    }
  };

  // Search
  const filteredFaculty = faculty.filter(
    (member) =>
      `${member.name || ""} ${
        member.email || ""
      } ${member.department || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // Fixed department options
  const departmentOptions = [
    ...new Set(
      Object.values(academicOptions).flatMap(
        (branches) =>
          Object.values(branches)
      )
    ),
  ];

  return (
    <div className="page">

      {/* HEADER */}

      <div className="page-header">

        <div>
          <h1>Faculty</h1>

          <p>
            Manage all faculty members
          </p>
        </div>

        <div className="header-actions">

          <div className="count">
            Total Faculty:{" "}
            {faculty.length}
          </div>

          <button
            className="add-btn"
            onClick={() =>
              setShowForm((prev) => !prev)
            }
          >
            {showForm
              ? "Close"
              : "+ Add Faculty"}
          </button>

        </div>

      </div>

      {/* ADD FACULTY FORM */}

      {showForm && (
        <div className="add-form-card">

          <h2>Add Faculty</h2>

          <form onSubmit={addFaculty}>

            {/* NAME */}

            <div className="form-group">

              <label>Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter faculty name"
                value={facultyForm.name}
                onChange={handleFacultyChange}
                required
              />

            </div>

            {/* EMAIL */}

            <div className="form-group">

              <label>Email</label>

              <input
                type="email"
                name="email"
                placeholder="Enter faculty email"
                value={facultyForm.email}
                onChange={handleFacultyChange}
                required
              />

            </div>

            {/* PASSWORD */}

            <div className="form-group">

              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder="Enter faculty password"
                value={facultyForm.password}
                onChange={handleFacultyChange}
                required
              />

            </div>

            {/* DEPARTMENT */}

            <div className="form-group">

              <label>Department</label>

              <select
                name="department"
                value={facultyForm.department}
                onChange={handleFacultyChange}
                required
              >

                <option value="">
                  Select Department
                </option>

                {departmentOptions.map(
                  (department) => (
                    <option
                      key={department}
                      value={department}
                    >
                      {department}
                    </option>
                  )
                )}

              </select>

            </div>

            <button
              type="submit"
              className="mark-btn"
            >
              Add Faculty
            </button>

          </form>

        </div>
      )}

      {/* SEARCH */}

      <div className="search-box">

        <input
          type="text"
          placeholder="Search by name, email or department..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* FACULTY LIST */}

      <div className="student-list">

        {filteredFaculty.length === 0 ? (

          <div className="empty-state">

            <h3>
              No faculty found
            </h3>

            <p>
              Try another search or add
              a faculty member.
            </p>

          </div>

        ) : (

          filteredFaculty.map(
            (member) => (

              <div
                className="student-card"
                key={member._id}
              >

                <div className="student-avatar">
                  {member.name
                    ?.charAt(0)
                    .toUpperCase()}
                </div>

                <div className="student-info">

                  <h3>
                    {member.name}
                  </h3>

                  <p>
                    {member.email}
                  </p>

                  <span>
                    {member.department ||
                      "Department not assigned"}
                  </span>

                </div>

                <div className="student-role">
                  Faculty
                </div>

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() =>
                    deleteFaculty(
                      member._id
                    )
                  }
                >
                  Delete
                </button>

              </div>

            )
          )

        )}

      </div>

    </div>
  );
};

export default Faculty;