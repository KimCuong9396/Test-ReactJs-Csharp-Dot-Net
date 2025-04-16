import React, { useState } from "react";

const CreateCourseModal = ({ onClose, onCreate }) => {
  const [course, setCourse] = useState({
    title: "",
    description: "",
    level: "Beginner",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onCreate(course);
      onClose();
    } catch (err) {
      alert("Tạo khóa học thất bại!");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Tạo khóa học mới</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Tiêu đề</label>
            <input
              type="text"
              name="title"
              value={course.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Mô tả</label>
            <textarea
              name="description"
              value={course.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Cấp độ</label>
            <select
              name="level"
              value={course.level}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Tạo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourseModal;
