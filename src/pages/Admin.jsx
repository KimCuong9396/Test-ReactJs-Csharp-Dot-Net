import React from "react";
import { Link } from "react-router-dom";

const Admin = () => {
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-primary mb-6">Admin Dashboard</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Welcome to the Admin Dashboard!</p>
        <p className="text-gray-600">
          This page is only accessible to premium users.
        </p>
        <div className="mt-4">
          <Link
            to="/admin/manage-courses"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Quản lý khóa học
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Admin;
