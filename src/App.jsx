import React from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Courses from "./pages/Courses";
import Lessons from "./pages/Lessons";
import Search from "./pages/Search";
import LessonList from "./components/LessonList";
import WordList from "./components/WordList";
import Progress from "./components/Progress";
import Revise from "./pages/Revise";
import Statistics from "./components/Statistics";
import Admin from "./pages/Admin";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import ManageCourse from "./components/admin/ManageCourse";
import ErrorBoundary from "./components/admin/ErrorBoundary";

function App() {
  // Lấy token và isPremium từ Context
  const { token, isPremium } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
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
            <Route
              path="/search"
              element={token ? <Search /> : <Navigate to="/login" />}
            />
            <Route
              path="/revise"
              element={token ? <Revise /> : <Navigate to="/login" />}
            />
            <Route
              path="/statistics"
              element={token ? <Statistics /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin"
              element={
                token && isPremium ? <Admin /> : <Navigate to="/dashboard" />
              }
            />
            <Route
              path="/admin/manage-courses"
              element={
                token && isPremium ? (
                  <ErrorBoundary>
                    <ManageCourse />
                  </ErrorBoundary>
                ) : (
                  <Navigate to="/search" />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

// Bọc App trong AuthProvider
export default function Root() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
