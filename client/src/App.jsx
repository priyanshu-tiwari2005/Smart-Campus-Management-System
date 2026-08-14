import { API_URL } from "./api";
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import "./App.css";

import Notices from "./pages/Notices";
import Faculty from "./pages/Faculty";
import Students from "./pages/Students";
import Attendance from "./pages/Attendance";

import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";

// ==========================================
// GET STORED USER
// ==========================================

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Invalid stored user:", error);

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    return null;
  }
};

// ==========================================
// ROLE PROTECTED ROUTE
// ==========================================

const RoleRoute = ({ allowedRole, children }) => {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== allowedRole) {
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (user.role === "faculty") {
      return <Navigate to="/faculty" replace />;
    }

    if (user.role === "student") {
      return <Navigate to="/student" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
};

// ==========================================
// ADMIN DASHBOARD HOME
// ==========================================

const DashboardHome = ({ stats, user }) => {
  return (
    <div className="page">
      <div className="topbar">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.name}</p>
        </div>

        <div className="profile">
          <strong>{user?.name}</strong>
          <span>{user?.role}</span>
        </div>
      </div>

      <div className="cards">
        <div className="card">
          <div className="card-icon">👥</div>
          <h3>Total Users</h3>
          <h2>{stats?.totalUsers ?? 0}</h2>
        </div>

        <div className="card">
          <div className="card-icon">🎓</div>
          <h3>Students</h3>
          <h2>{stats?.totalStudents ?? 0}</h2>
        </div>

        <div className="card">
          <div className="card-icon">👨‍🏫</div>
          <h3>Faculty</h3>
          <h2>{stats?.totalFaculty ?? 0}</h2>
        </div>

        <div className="card">
          <div className="card-icon">🛡️</div>
          <h3>Admins</h3>
          <h2>{stats?.totalAdmins ?? 0}</h2>
        </div>
      </div>

      <div className="welcome-box">
        <h2>Welcome to Smart Campus</h2>

        <p>
          Manage students, faculty, notices and
          attendance from one centralized dashboard.
        </p>
      </div>
    </div>
  );
};

// ==========================================
// LOGIN
// ==========================================

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setIsLoggedIn(true);

      if (data.user.role === "admin") {
        navigate("/admin", { replace: true });
        return;
      }

      if (data.user.role === "faculty") {
        navigate("/faculty", { replace: true });
        return;
      }

      if (data.user.role === "student") {
        navigate("/student", { replace: true });
        return;
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setIsLoggedIn(false);

      alert("Invalid user role");
    } catch (error) {
      console.error("Login Error:", error);
      alert("Unable to connect to server");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Smart Campus</h1>

        <p>Campus Management System</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// ADMIN LAYOUT
// ==========================================

const AdminLayout = ({ stats, user, logout }) => {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo">🎓 Smart Campus</div>

        <nav>
          <Link to="/admin" className="nav-link">
            📊 Dashboard
          </Link>

          <Link
            to="/admin/students"
            className="nav-link"
          >
            🎓 Students
          </Link>

          <Link
            to="/admin/faculty"
            className="nav-link"
          >
            👨‍🏫 Faculty
          </Link>

          <Link
            to="/admin/notices"
            className="nav-link"
          >
            📢 Notices
          </Link>

          <Link
            to="/admin/attendance"
            className="nav-link"
          >
            📋 Attendance
          </Link>
        </nav>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>
      </aside>

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <DashboardHome
                stats={stats}
                user={user}
              />
            }
          />

          <Route
            path="/students"
            element={<Students />}
          />

          <Route
            path="/faculty"
            element={<Faculty />}
          />

          <Route
            path="/notices"
            element={<Notices />}
          />

          <Route
            path="/attendance"
            element={<Attendance />}
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/admin"
                replace
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
};

// ==========================================
// APP
// ==========================================

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [stats, setStats] = useState(null);

  const user = getStoredUser();

  // ========================================
  // GET ADMIN STATS
  // ========================================

  const getStats = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      const response = await fetch(
        `${API_URL}/api/admin/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Stats Error:",
          data.message
        );
        return;
      }

      setStats(data.stats || null);
    } catch (error) {
      console.error("Get Stats Error:", error);
    }
  };

  useEffect(() => {
    if (
      isLoggedIn &&
      user?.role === "admin"
    ) {
      getStats();
    }
  }, [isLoggedIn, user?.role]);

  // ========================================
  // LOGOUT
  // ========================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setStats(null);
  };

  // ========================================
  // NOT LOGGED IN
  // ========================================

  if (!isLoggedIn) {
    return (
      <BrowserRouter>
        <Routes>
          <Route
            path="*"
            element={
              <Login
                setIsLoggedIn={setIsLoggedIn}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    );
  }

  // ========================================
  // LOGGED IN
  // ========================================

  return (
    <BrowserRouter>
      <Routes>
        {/* ADMIN */}
        <Route
          path="/admin/*"
          element={
            <RoleRoute allowedRole="admin">
              <AdminLayout
                stats={stats}
                user={user}
                logout={logout}
              />
            </RoleRoute>
          }
        />

        {/* STUDENT */}
        <Route
          path="/student"
          element={
            <RoleRoute allowedRole="student">
              <StudentDashboard
                logout={logout}
              />
            </RoleRoute>
          }
        />

        {/* FACULTY */}
        <Route
          path="/faculty"
          element={
            <RoleRoute allowedRole="faculty">
              <FacultyDashboard
                logout={logout}
              />
            </RoleRoute>
          }
        />

        {/* DEFAULT */}
        <Route
          path="*"
          element={
            user?.role === "admin" ? (
              <Navigate
                to="/admin"
                replace
              />
            ) : user?.role === "faculty" ? (
              <Navigate
                to="/faculty"
                replace
              />
            ) : user?.role === "student" ? (
              <Navigate
                to="/student"
                replace
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;