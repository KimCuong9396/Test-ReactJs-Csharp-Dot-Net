import React, { useState, useEffect } from "react";
import axios from "axios";

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    preferredLanguage: "",
    isPremium: false,
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingUserPremiumStatus, setEditingUserPremiumStatus] =
    useState(false);

  const API_URL = "http://localhost:5191/api/users";
  const token = localStorage.getItem("token");

  // Lấy thông tin người dùng hiện tại và danh sách người dùng
  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(response.data);
      console.log("Đã tải hồ sơ người dùng hiện tại:", response.data);
    } catch (err) {
      window.alert(
        err.response?.data?.message || "Không thể tải hồ sơ người dùng hiện tại"
      );
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.$values || response.data);
      console.log("Đã tải danh sách người dùng:", response.data);
    } catch (err) {
      window.alert(
        err.response?.data?.message || "Không thể tải danh sách người dùng"
      );
    }
  };

  const handleEditUser = (user) => {
    setFormData({
      email: user.email || "",
      username: user.username || "",
      fullName: user.fullName || "",
      preferredLanguage: user.preferredLanguage || "",
      isPremium: user.isPremium || false,
    });
    setEditingUserId(user.userId);
    setEditingUserPremiumStatus(user.isPremium);
    setIsEditModalOpen(true);
  };

  const handleAddUser = () => {
    setFormData({
      email: "",
      username: "",
      fullName: "",
      preferredLanguage: "",
      isPremium: false,
    });
    setIsAddModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      // Cập nhật thông tin người dùng
      const updateResponse = await axios.put(
        `${API_URL}/${editingUserId}`,
        {
          email: formData.email,
          fullName: formData.fullName,
          preferredLanguage: formData.preferredLanguage,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Đã cập nhật người dùng:", updateResponse.data);

      // Cập nhật trạng thái Premium
      if (formData.isPremium && !editingUserPremiumStatus) {
        const premiumResponse = await axios.put(
          `${API_URL}/${editingUserId}/make-premium`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(
          "Đã nâng cấp người dùng thành Premium:",
          premiumResponse.data
        );
      } else if (!formData.isPremium && editingUserPremiumStatus) {
        const removePremiumResponse = await axios.put(
          `${API_URL}/${editingUserId}/remove-premium`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Đã hủy Premium người dùng:", removePremiumResponse.data);
      }

      window.alert("Cập nhật thông tin người dùng thành công!");
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (err) {
      window.alert(
        err.response?.data?.message || "Cập nhật người dùng thất bại"
      );
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        API_URL,
        {
          username: formData.username,
          email: formData.email,
          fullName: formData.fullName,
          preferredLanguage: formData.preferredLanguage,
          isPremium: formData.isPremium,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.alert("Tạo người dùng thành công!");
      setIsAddModalOpen(false);
      fetchUsers();
      console.log("Đã tạo người dùng:", response.data);
    } catch (err) {
      window.alert(err.response?.data?.message || "Tạo người dùng thất bại");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      return;
    }
    try {
      const response = await axios.delete(`${API_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.alert(response.data.message);
      fetchUsers();
      console.log("Đã xóa người dùng:", response.data);
    } catch (err) {
      window.alert(err.response?.data?.message || "Xóa người dùng thất bại");
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setFormData({
      email: "",
      username: "",
      fullName: "",
      preferredLanguage: "",
      isPremium: false,
    });
    setEditingUserId(null);
    setEditingUserPremiumStatus(false);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setFormData({
      email: "",
      username: "",
      fullName: "",
      preferredLanguage: "",
      isPremium: false,
    });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-20">
      <h1 className="text-2xl font-bold mb-4">Quản lý Tài khoản Người dùng</h1>

      {/* Kiểm tra quyền Premium */}
      {!currentUser?.isPremium && (
        <div className="text-red-500 mb-4">
          Chỉ người dùng Premium mới có quyền quản lý tất cả người dùng.
        </div>
      )}

      {/* Tìm kiếm và Thêm Người dùng */}
      {currentUser?.isPremium && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Danh sách Người dùng</h2>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Tìm kiếm theo username hoặc email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border rounded p-2 w-64"
              />
              <button
                onClick={handleAddUser}
                className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
              >
                Thêm Người dùng
              </button>
            </div>
          </div>

          {/* Danh sách người dùng */}
          <div className="grid gap-4 mb-6">
            {filteredUsers.map((user) => (
              <div
                key={user.userId}
                className="border p-4 rounded flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold">{user.username}</h3>
                  <p>Email: {user.email}</p>
                  <p>Họ và Tên: {user.fullName || "-"}</p>
                  <p>Ngôn ngữ: {user.preferredLanguage || "-"}</p>
                  <p>
                    Trạng thái: {user.isPremium ? "Premium" : "Non-Premium"}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    disabled={user.userId === currentUser?.userId}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.userId)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    disabled={user.userId === currentUser?.userId}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal chỉnh sửa người dùng */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Chỉnh sửa Người dùng</h2>
            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Họ và Tên</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Ngôn ngữ Ưa thích
                </label>
                <input
                  type="text"
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isPremium"
                    checked={formData.isPremium}
                    onChange={handleInputChange}
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-medium">Is Premium</span>
                </label>
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Cập nhật
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal thêm người dùng */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Thêm Người dùng</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Username *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Họ và Tên</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Ngôn ngữ Ưa thích
                </label>
                <input
                  type="text"
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isPremium"
                    checked={formData.isPremium}
                    onChange={handleInputChange}
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-medium">Is Premium</span>
                </label>
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Tạo
                </button>
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;
