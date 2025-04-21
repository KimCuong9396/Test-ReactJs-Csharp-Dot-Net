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
        setCourses(response.data.$values || response.data);
      } catch (err) {
        console.error("Không thể tải danh sách khóa học:", err);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="container mx-auto p-6">
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
        <div>
          <Link
            to="/admin/manage-lessons"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Quản lý bài học
          </Link>
        </div>
        <div>
          <Link
            to="/admin/manage-users"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Quản lý tài khoản người dùng
          </Link>
        </div>
        <div>
          <Link
            to="/admin/manage-progress"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Quản lý quá trình học
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Admin;
