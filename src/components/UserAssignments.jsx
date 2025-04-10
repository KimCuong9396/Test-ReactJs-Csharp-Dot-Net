import React from "react";

const UserAssignments = ({ assignments }) => {
  if (!assignments || assignments.length === 0) {
    return (
      <p className="text-gray-600 text-center">
        Người dùng này chưa có công việc nào.
      </p>
    );
  }

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  return (
    <div className="flex flex-col gap-4 bg-white p-4 rounded-md shadow w-96">
      {assignments.map((assignment) => (
        <div key={assignment.id} className="border-b last:border-b-0 pb-2">
          <div className="flex justify-between items-center mb-2.5">
            <h3 className="text-lg text-gray-800">{assignment.title}</h3>
            <span
              className={`px-2.5 py-1 text-xs font-bold uppercase rounded-full ${
                assignment.status.toLowerCase() === "todo"
                  ? "bg-blue-100 text-blue-700"
                  : assignment.status.toLowerCase() === "inprogress"
                  ? "bg-amber-100 text-amber-700"
                  : assignment.status.toLowerCase() === "completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {assignment.status}
            </span>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">{assignment.description}</p>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <div>
              <strong className="text-gray-800">Hạn hoàn thành:</strong>{" "}
              {formatDate(assignment.dueDate)}
            </div>
            <div>
              <small>Ngày tạo: {formatDate(assignment.createdAt)}</small>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserAssignments;
