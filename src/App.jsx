import React, { useState } from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom"; // Thêm BrowserRouter nếu bọc tại đây
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Courses from "./pages/Courses";
import Lessons from "./pages/Lessons";
//import Quizzes from "./pages/Quizzes";
import Dashboard from "./pages/Dashboard";
import LessonList from "./components/LessonList";
import WordList from "./components/WordList";
import Progress from "./components/Progress";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Navbar token={token} onLogout={handleLogout} />
        <div className="container mx-auto p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={token ? <Profile /> : <Navigate to="/login" />}
            />
            <Route
              path="/courses"
              element={token ? <Courses /> : <Navigate to="/login" />}
            />
            <Route
              path="/courses/:courseId"
              element={token ? <LessonList /> : <Navigate to="/login" />}
            />
            <Route
              path="/lessons/:lessonId"
              element={token ? <WordList /> : <Navigate to="/login" />}
            />
            <Route
              path="/lessons/:lessonId/progress"
              element={token ? <Progress /> : <Navigate to="/login" />}
            />
            {/* <Route
              path="/quizzes/:lessonId"
              element={token ? <Quizzes /> : <Navigate to="/login" />}
            /> */}
            <Route
              path="/dashboard"
              element={token ? <Dashboard /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
