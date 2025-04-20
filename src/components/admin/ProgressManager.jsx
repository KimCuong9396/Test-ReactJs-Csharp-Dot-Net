import React, { useState, useEffect } from "react";
import axios from "axios";

const ProgressManager = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [learnedCounts, setLearnedCounts] = useState([]);

  const API_URL = "http://localhost:5191/api/progress";
  const token = localStorage.getItem("token");

  // Lấy thông tin người dùng hiện tại và số từ đã học
  useEffect(() => {
    fetchCurrentUser();
    fetchLearnedCount();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5191/api/users/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCurrentUser(response.data);
      console.log("Đã tải hồ sơ người dùng hiện tại:", response.data);
    } catch (err) {
      window.alert(
        err.response?.data?.message || "Không thể tải hồ sơ người dùng hiện tại"
      );
    }
  };

  const fetchLearnedCount = async () => {
    try {
      const response = await axios.get(`${API_URL}/learned-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data.$values || response.data;
      setLearnedCounts(data);
      console.log("Đã tải số từ đã học:", data);
    } catch (err) {
      window.alert(err.response?.data?.message || "Không thể tải số từ đã học");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý Tiến độ Người dùng</h1>

      {/* Kiểm tra quyền Premium */}
      {!currentUser?.isPremium && (
        <div className="text-red-500 mb-4">
          Chỉ người dùng Premium mới có quyền xem tiến độ của tất cả người dùng.
        </div>
      )}

      {/* Bảng số từ đã học */}
      {currentUser?.isPremium && (
        <>
          <h2 className="text-xl font-bold mb-4">Số Từ Đã Học</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border bg-white">
              <thead>
                <tr>
                  <th className="border px-4 py-2 text-left">Username</th>
                  <th className="border px-4 py-2 text-left">Số từ đã học</th>
                </tr>
              </thead>
              <tbody>
                {learnedCounts.map((user) => (
                  <tr key={user.userId}>
                    <td className="border px-4 py-2">{user.username}</td>
                    <td className="border px-4 py-2">{user.learnedCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ProgressManager;
