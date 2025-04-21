import React, { useState, useEffect } from "react";
import axios from "axios";

const ProgressManager = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [learnedCounts, setLearnedCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:5191/api/progress";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        await Promise.all([fetchCurrentUser(), fetchLearnedCount()]);
      } catch (err) {
        setError("Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      throw new Error(
        err.response?.data?.message || "Không thể tải hồ sơ người dùng hiện tại"
      );
    }
  };

  const fetchLearnedCount = async () => {
    try {
      const response = await axios.get(`${API_URL}/learned-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(response.data.$values)
        ? response.data.$values
        : Array.isArray(response.data)
        ? response.data
        : [];
      setLearnedCounts(data);
      console.log("Đã tải số từ đã học:", data);
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Không thể tải số từ đã học"
      );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý Tiến độ Người dùng</h1>

      {/* Kiểm tra quyền Premium */}
      {currentUser && !currentUser.isPremium && (
        <div className="text-red-500 mb-4">
          Chỉ người dùng Premium mới có quyền xem tiến độ của tất cả người dùng.
        </div>
      )}

      {/* Bảng số từ đã học */}
      {currentUser?.isPremium && (
        <>
          <h2 className="text-xl font-bold mb-4">Số Từ Đã Học</h2>
          {learnedCounts.length === 0 ? (
            <p>Không có dữ liệu số từ đã học.</p>
          ) : (
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
          )}
        </>
      )}
    </div>
  );
};

export default ProgressManager;
