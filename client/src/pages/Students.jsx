import { useState } from "react";
import { academicOptions } from "../data/academicOptions";

const Students = () => {
  const [students, setStudents] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [showEditForm, setShowEditForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [loading, setLoading] = useState(false);

  const [studentForm, setStudentForm] = useState({
    name: "",
    email: "",
    password: "",
    course: "",
    branch: "",
    department: "",
  });

  const [editAcademic, setEditAcademic] = useState({
    course: "",
    branch: "",
    department: "",
  });

  // ==========================================
  // GET STUDENTS BY COURSE + BRANCH
  // ==========================================

  const getStudentsByCourseAndBranch = async (
    course,
    branch
  ) => {
    if (!course || !branch) {
      setStudents([]);
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

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
    } catch (error) {
      console.error("Students Error:", error);
      alert("Failed to fetch students");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // COURSE SELECT
  // ==========================================

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setSelectedBranch("");
    setStudents([]);
    setSearch("");

    setShowForm(false);
    setShowEditForm(false);

    setStudentForm({
      name: "",
      email: "",
      password: "",
      course: "",
      branch: "",
      department: "",
    });
  };

  // ==========================================
  // BRANCH SELECT
  // ==========================================

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
    setSearch("");

    setShowForm(false);
    setShowEditForm(false);

    const department =
      academicOptions[selectedCourse]?.[branch] || "";

    setStudentForm({
      name: "",
      email: "",
      password: "",
      course: selectedCourse,
      branch,
      department,
    });

    getStudentsByCourseAndBranch(
      selectedCourse,
      branch
    );
  };

  // ==========================================
  // ADD STUDENT FORM INPUT
  // ==========================================

  const handleStudentChange = (e) => {
    const { name, value } = e.target;

    setStudentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // ADD STUDENT
  // ==========================================

  const addStudent = async (e) => {
    e.preventDefault();

    if (!selectedCourse || !selectedBranch) {
      alert("Please select course and branch first");
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
            name: studentForm.name,
            email: studentForm.email,
            password: studentForm.password,
            role: "student",

            // Selected course + branch
            course: selectedCourse,
            branch: selectedBranch,

            // Backend derives department
            department:
              academicOptions[selectedCourse][
                selectedBranch
              ],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Student added successfully");

      setStudentForm({
        name: "",
        email: "",
        password: "",
        course: selectedCourse,
        branch: selectedBranch,
        department:
          academicOptions[selectedCourse][
            selectedBranch
          ],
      });

      setShowForm(false);

      await getStudentsByCourseAndBranch(
        selectedCourse,
        selectedBranch
      );
    } catch (error) {
      console.error("Add Student Error:", error);
      alert("Something went wrong");
    }
  };

  // ==========================================
  // OPEN UPDATE FORM
  // ==========================================

  const openEditStudent = (student) => {
    setEditingStudent(student);

    setEditAcademic({
      course: student.course || "",
      branch: student.branch || "",
      department:
        student.department || "",
    });

    setShowEditForm(true);
    setShowForm(false);
  };

  // ==========================================
  // UPDATE COURSE
  // ==========================================

  const handleEditCourseChange = (e) => {
    const course = e.target.value;

    setEditAcademic({
      course,
      branch: "",
      department: "",
    });
  };

  // ==========================================
  // UPDATE BRANCH
  // ==========================================

  const handleEditBranchChange = (e) => {
    const branch = e.target.value;

    setEditAcademic((prev) => ({
      ...prev,
      branch,
      department:
        academicOptions[prev.course]?.[branch] || "",
    }));
  };

  // ==========================================
  // UPDATE STUDENT
  // ==========================================

  const updateStudent = async (e) => {
    e.preventDefault();

    if (!editingStudent) {
      return;
    }

    if (
      !editAcademic.course ||
      !editAcademic.branch
    ) {
      alert("Please select course and branch");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/admin/students/${editingStudent._id}/academic`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            course: editAcademic.course,
            branch: editAcademic.branch,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Student updated successfully");

      setShowEditForm(false);
      setEditingStudent(null);

      // Refresh current branch
      await getStudentsByCourseAndBranch(
        selectedCourse,
        selectedBranch
      );
    } catch (error) {
      console.error(
        "Update Student Error:",
        error
      );

      alert("Something went wrong");
    }
  };

  // ==========================================
  // DELETE STUDENT
  // ==========================================

  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/admin/students/${id}`,
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

      alert("Student deleted successfully");

      setStudents((prevStudents) =>
        prevStudents.filter(
          (student) => student._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete Student Error:",
        error
      );

      alert("Something went wrong");
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredStudents = students.filter(
    (student) =>
      `${student.name || ""} ${
        student.email || ""
      } ${student.course || ""} ${
        student.branch || ""
      } ${student.department || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="page">

      {/* =====================================
          COURSE LEVEL
      ====================================== */}

      {!selectedCourse && (
        <>
          <div className="page-header">
            <div>
              <h1>Students</h1>

              <p>
                Select a course to manage students
              </p>
            </div>
          </div>

          <h2 className="section-title">
            Select Course
          </h2>

          <div className="course-grid">
            {Object.keys(academicOptions).map(
              (course) => (
                <div
                  key={course}
                  className="course-card"
                  onClick={() =>
                    handleCourseSelect(course)
                  }
                >
                  <div className="course-icon">
                    🎓
                  </div>

                  <h3>{course}</h3>

                  <p>
                    {Object.keys(
                      academicOptions[course]
                    ).length}{" "}
                    Branches
                  </p>
                </div>
              )
            )}
          </div>
        </>
      )}

      {/* =====================================
          BRANCH LEVEL
      ====================================== */}

      {selectedCourse && !selectedBranch && (
        <>
          <div className="breadcrumb-header">

            <button
              className="back-btn"
              onClick={() => {
                setSelectedCourse("");
                setSelectedBranch("");
                setStudents([]);
                setSearch("");
                setShowForm(false);
                setShowEditForm(false);
              }}
            >
              ← Courses
            </button>

            <div>
              <h2>{selectedCourse}</h2>

              <p>
                Select branch
              </p>
            </div>

          </div>

          <h2 className="section-title">
            Select Branch
          </h2>

          <div className="course-grid">

            {Object.keys(
              academicOptions[selectedCourse]
            ).map((branch) => (
              <div
                key={branch}
                className="course-card"
                onClick={() =>
                  handleBranchSelect(branch)
                }
              >

                <div className="course-icon">
                  📚
                </div>

                <h3>{branch}</h3>

                <p>
                  {
                    academicOptions[
                      selectedCourse
                    ][branch]
                  }
                </p>

              </div>
            ))}

          </div>
        </>
      )}

      {/* =====================================
          STUDENT LEVEL
      ====================================== */}

      {selectedCourse && selectedBranch && (
        <>
          <div className="breadcrumb-header">

            <button
              className="back-btn"
              onClick={() => {
                setSelectedBranch("");
                setStudents([]);
                setSearch("");
                setShowForm(false);
                setShowEditForm(false);
              }}
            >
              ← Branches
            </button>

            <div>
              <h2>
                {selectedCourse} -{" "}
                {selectedBranch}
              </h2>

              <p>
                {
                  academicOptions[
                    selectedCourse
                  ][selectedBranch]
                }
              </p>
            </div>

            <button
              className="add-btn"
              onClick={() => {
                setShowForm((prev) => !prev);
                setShowEditForm(false);

                setStudentForm({
                  name: "",
                  email: "",
                  password: "",
                  course: selectedCourse,
                  branch: selectedBranch,
                  department:
                    academicOptions[
                      selectedCourse
                    ][selectedBranch],
                });
              }}
            >
              {showForm
                ? "Close"
                : "+ Add Student"}
            </button>

          </div>

          {/* ===================================
              UPDATE FORM
          ==================================== */}

          {showEditForm &&
            editingStudent && (
              <div className="add-form-card">

                <h2>Update Student</h2>

                <p className="edit-student-name">
                  Student:{" "}
                  <strong>
                    {editingStudent.name}
                  </strong>
                </p>

                <form
                  onSubmit={updateStudent}
                >

                  <div className="form-group">
                    <label>Course</label>

                    <select
                      value={
                        editAcademic.course
                      }
                      onChange={
                        handleEditCourseChange
                      }
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

                  <div className="form-group">
                    <label>Branch</label>

                    <select
                      value={
                        editAcademic.branch
                      }
                      onChange={
                        handleEditBranchChange
                      }
                      disabled={
                        !editAcademic.course
                      }
                      required
                    >
                      <option value="">
                        Select Branch
                      </option>

                      {editAcademic.course &&
                        Object.keys(
                          academicOptions[
                            editAcademic.course
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

                  <div className="form-group">
                    <label>
                      Department
                    </label>

                    <input
                      type="text"
                      value={
                        editAcademic.department
                      }
                      readOnly
                    />
                  </div>

                  <div className="student-actions">

                    <button
                      type="submit"
                      className="mark-btn"
                    >
                      Update Student
                    </button>

                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => {
                        setShowEditForm(false);
                        setEditingStudent(null);
                      }}
                    >
                      Cancel
                    </button>

                  </div>

                </form>

              </div>
            )}

          {/* ===================================
              ADD FORM
          ==================================== */}

          {showForm && (
            <div className="add-form-card">

              <h2>Add Student</h2>

              <form onSubmit={addStudent}>

                <div className="form-group">
                  <label>Name</label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter student name"
                    value={studentForm.name}
                    onChange={
                      handleStudentChange
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter student email"
                    value={studentForm.email}
                    onChange={
                      handleStudentChange
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>

                  <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={
                      studentForm.password
                    }
                    onChange={
                      handleStudentChange
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Course</label>

                  <input
                    type="text"
                    value={
                      studentForm.course
                    }
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label>Branch</label>

                  <input
                    type="text"
                    value={
                      studentForm.branch
                    }
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label>
                    Department
                  </label>

                  <input
                    type="text"
                    value={
                      studentForm.department
                    }
                    readOnly
                  />
                </div>

                <button
                  type="submit"
                  className="mark-btn"
                >
                  Add Student
                </button>

              </form>

            </div>
          )}

          {/* ===================================
              SEARCH
          ==================================== */}

          <div className="search-box">

            <input
              type="text"
              placeholder="Search student by name, email, course, branch or department..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          {/* ===================================
              STUDENT LIST
          ==================================== */}

          <div className="student-list">

            {loading ? (
              <div className="empty-state">
                <h3>
                  Loading students...
                </h3>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="empty-state">

                <h3>
                  No students found
                </h3>

                <p>
                  No students are registered
                  in {selectedCourse} -{" "}
                  {selectedBranch}.
                </p>

              </div>
            ) : (
              filteredStudents.map(
                (student) => (
                  <div
                    className="student-card"
                    key={student._id}
                  >

                    <div className="student-avatar">
                      {student.name
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="student-info">

                      <h3>
                        {student.name}
                      </h3>

                      <p>
                        {student.email}
                      </p>

                      <span>
                        {student.course ||
                          "Course not assigned"}{" "}
                        •{" "}
                        {student.branch ||
                          "Branch not assigned"}
                      </span>

                      <small>
                        {student.department ||
                          "Department not assigned"}
                      </small>

                    </div>

                    <div className="student-role">
                      Student
                    </div>

                    <div className="student-actions">

                      <button
                        type="button"
                        className="edit-btn"
                        onClick={() =>
                          openEditStudent(
                            student
                          )
                        }
                      >
                        Update
                      </button>

                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() =>
                          deleteStudent(
                            student._id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                )
              )
            )}

          </div>
        </>
      )}
    </div>
  );
};

export default Students;