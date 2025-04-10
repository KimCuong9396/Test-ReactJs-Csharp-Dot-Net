import React from "react";

const UserList = ({ users, onAddAssignment, onShowAssignments }) => {
  if (!users || users.length === 0) {
    return (
      <p className="text-gray-600 text-center">Không có người dùng nào.</p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex justify-between items-center bg-white p-4 rounded-md shadow hover:-translate-y-0.5 hover:shadow-md transition-all"
        >
          <div>
            <h3 className="text-lg text-gray-800 mb-1">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
          <div className="flex gap-2.5">
            <button
              className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={() => onAddAssignment(user)}
            >
              Thêm công việc
            </button>
            <button
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={() => onShowAssignments(user)}
            >
              Xem công việc
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
