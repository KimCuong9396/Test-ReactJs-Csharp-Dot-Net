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
      <h2 className="text-3xl font-bold text-primary mb-6">
        Bảng điều khiển Admin
      </h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">
          Chào mừng đến với Bảng điều khiển Admin!
        </p>
        <p className="text-gray-600">
          Trang này chỉ dành cho người dùng cao cấp.
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
          <div>
            <Link
              to="/admin/manage-lessons"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Quản lý bài học
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
