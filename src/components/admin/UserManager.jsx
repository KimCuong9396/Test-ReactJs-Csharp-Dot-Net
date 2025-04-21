import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

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
      //console.log("Đã tải hồ sơ người dùng hiện tại:", response.data);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Không thể tải hồ sơ người dùng hiện tại",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.$values || response.data);
      //console.log("Đã tải danh sách người dùng:", response.data);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Không thể tải danh sách người dùng",
        {
          position: "top-right",
          autoClose: 3000,
        }
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
      const updateResponse = await axios.put(
        `${API_URL}/${editingUserId}`,
        {
          email: formData.email,
          fullName: formData.fullName,
          preferredLanguage: formData.preferredLanguage,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      //console.log("Đã cập nhật người dùng:", updateResponse.data);

      if (formData.isPremium && !editingUserPremiumStatus) {
        const premiumResponse = await axios.put(
          `${API_URL}/${editingUserId}/make-premium`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        //console.log(
        // "Đã nâng cấp người dùng thành Premium:",
        // premiumResponse.data
        //);
      } else if (!formData.isPremium && editingUserPremiumStatus) {
        const removePremiumResponse = await axios.put(
          `${API_URL}/${editingUserId}/remove-premium`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        //console.log("Đã hủy Premium người dùng:", removePremiumResponse.data);
      }

      toast.success("Cập nhật thông tin người dùng thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Cập nhật người dùng thất bại",
        {
          position: "top-right",
          autoClose: 3000,
        }
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
      toast.success("Tạo người dùng thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsAddModalOpen(false);
      fetchUsers();
      //console.log("Đã tạo người dùng:", response.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Tạo người dùng thất bại", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleDeleteUser = (userId) => {
    toast.info(
      <div>
        <p>Bạn có chắc chắn muốn xóa người dùng này?</p>
        <div className="flex space-x-2">
          <button
            onClick={async () => {
              try {
                const response = await axios.delete(`${API_URL}/${userId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                toast.success(response.data.message, {
                  position: "top-right",
                  autoClose: 3000,
                });
                fetchUsers();
                //console.log("Đã xóa người dùng:", response.data);
              } catch (err) {
                toast.error(
                  err.response?.data?.message || "Xóa người dùng thất bại",
                  {
                    position: "top-right",
                    autoClose: 3000,
                  }
                );
              }
            }}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Xóa
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
          >
            Hủy
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
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
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6 lg:p-22">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Quản lý Tài khoản Người dùng
        </h1>

        {!currentUser?.isPremium && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            Chỉ người dùng Premium mới có quyền quản lý tất cả người dùng.
          </div>
        )}

        {currentUser?.isPremium && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4 sm:mb-0">
                Danh sách Người dùng
              </h2>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo username hoặc email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <button
                  onClick={handleAddUser}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow"
                >
                  Thêm Người dùng
                </button>
              </div>
            </div>

            <div className="grid gap-6">
              {filteredUsers.map((user) => (
                <div
                  key={user.userId}
                  className="bg-white p-6 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center transition hover:shadow-lg"
                >
                  <div className="mb-4 sm:mb-0">
                    <h3 className="font-bold text-lg text-gray-800">
                      {user.username}
                    </h3>
                    <p className="text-gray-600">Email: {user.email}</p>
                    <p className="text-gray-600">
                      Họ và Tên: {user.fullName || "-"}
                    </p>
                    <p className="text-gray-600">
                      Ngôn ngữ: {user.preferredLanguage || "-"}
                    </p>
                    <p className="text-gray-600">
                      Trạng thái: {user.isPremium ? "Premium" : "Non-Premium"}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                      disabled={user.userId === currentUser?.userId}
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.userId)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
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

        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Chỉnh sửa Người dùng
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Họ và Tên
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ngôn ngữ Ưa thích
                  </label>
                  <input
                    type="text"
                    name="preferredLanguage"
                    value={formData.preferredLanguage}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isPremium"
                      checked={formData.isPremium}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Is Premium
                    </span>
                  </label>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleUserSubmit}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow"
                  >
                    Cập nhật
                  </button>
                  <button
                    onClick={closeEditModal}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition shadow"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Thêm Người dùng
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Họ và Tên
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ngôn ngữ Ưa thích
                  </label>
                  <input
                    type="text"
                    name="preferredLanguage"
                    value={formData.preferredLanguage}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isPremium"
                      checked={formData.isPremium}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Is Premium
                    </span>
                  </label>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleCreateUser}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow"
                  >
                    Tạo
                  </button>
                  <button
                    onClick={closeAddModal}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition shadow"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};
export default UserManager;
