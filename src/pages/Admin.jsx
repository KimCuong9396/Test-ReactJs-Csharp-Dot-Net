import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Admin = () => {
  const [courses, setCourses] = useState([]);
  const API_URL = "http://localhost:5191/api/courses";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(response.data.$values);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-primary mb-6">Admin Dashboard</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Welcome to the Admin Dashboard!</p>
        <p className="text-gray-600">
          This page is only accessible to premium users.
        </p>
        <div className="mt-4 space-y-2">
          <div>
            <Link
              to="/admin/manage-courses"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Quản lý khóa học
            </Link>
          </div>
          <div>
            <Link
              to="/admin/manage-vocabulary"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Quản lý từ vựng
            </Link>
          </div>
          {courses.map((course) => (
            <div key={course.courseId}>
              <Link
                to={`/admin/manage-lessons/${course.courseId}`}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Quản lý bài học (Khóa: {course.title})
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
