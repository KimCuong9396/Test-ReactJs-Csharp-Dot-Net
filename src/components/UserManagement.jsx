import React, { useState, useEffect } from "react";
import axios from "axios";
import UserList from "./UserList";
import AssignmentForm from "./AssignmentForm";
import UserAssignments from "./UserAssignments";

const API_URL = "http://localhost:5075/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [showUserAssignments, setShowUserAssignments] = useState(false);
  const [userAssignments, setUserAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/Users`);
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách người dùng. Vui lòng thử lại sau.");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAssignment = (user) => {
    setSelectedUser(user);
    setShowAssignmentForm(true);
    setShowUserAssignments(false);
  };

  const handleShowAssignments = async (user) => {
    try {
      setLoading(true);
      setSelectedUser(user);
      const response = await axios.get(
        `${API_URL}/Users/${user.id}/Assignments`
      );
      setUserAssignments(response.data);
      setShowUserAssignments(true);
      setShowAssignmentForm(false);
      setError(null);
    } catch (err) {
      setError(`Không thể tải công việc của người dùng ${user.name}.`);
      console.error("Error fetching user assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowAssignmentForm(false);
    setShowUserAssignments(false);
    setSelectedUser(null);
  };

  const handleCreateAssignment = async (assignmentData) => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/Assignment`, {
        ...assignmentData,
        assignedToUserId: selectedUser.id,
      });

      setShowAssignmentForm(false);
      setError(null);

      const response = await axios.get(
        `${API_URL}/Users/${selectedUser.id}/Assignments`
      );
      setUserAssignments(response.data);
      setShowUserAssignments(true);

      return true;
    } catch (err) {
      setError("Không thể tạo công việc. Vui lòng thử lại sau.");
      console.error("Error creating assignment:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-5 font-sans">
      <h1 className="text-3xl text-gray-800 mb-5">
        Quản lý Công việc Người dùng
      </h1>

      {error && (
        <div className="bg-red-50 text-red-800 p-2.5 rounded mb-4">{error}</div>
      )}
      {loading && (
        <div className="text-center my-5 text-gray-600">Đang tải...</div>
      )}

      <UserList
        users={users}
        onAddAssignment={handleAddAssignment}
        onShowAssignments={handleShowAssignments}
      />

      {(showAssignmentForm || showUserAssignments) && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            {showAssignmentForm && selectedUser && (
              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl text-gray-800">
                    Thêm công việc cho {selectedUser.name}
                  </h2>
                  <button
                    className="text-gray-600 hover:text-gray-800"
                    onClick={handleCloseModal}
                  >
                    ✕
                  </button>
                </div>
                <AssignmentForm
                  user={selectedUser}
                  onSubmit={handleCreateAssignment}
                  onCancel={handleCloseModal}
                />
              </div>
            )}

            {showUserAssignments && selectedUser && (
              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl text-gray-800">
                    Công việc của {selectedUser.name}
                  </h2>
                  <button
                    className="text-gray-600 hover:text-gray-800"
                    onClick={handleCloseModal}
                  >
                    ✕
                  </button>
                </div>
                <UserAssignments assignments={userAssignments} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
