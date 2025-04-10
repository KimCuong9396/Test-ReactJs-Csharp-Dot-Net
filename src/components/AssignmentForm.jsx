import React, { useState } from "react";

const AssignmentForm = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: new Date().toISOString().slice(0, 16),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Vui lòng nhập tiêu đề công việc");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const success = await onSubmit(formData);
      if (success) {
        // Form will be hidden by parent component
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi tạo công việc");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-md shadow w-96">
      {error && (
        <div className="bg-red-50 text-red-800 p-2.5 rounded mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-600">
            Tiêu đề công việc
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2.5 border border-gray-300 rounded text-sm"
            placeholder="Nhập tiêu đề công việc"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-600">
            Mô tả công việc
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 rounded text-sm"
            rows="4"
            placeholder="Mô tả chi tiết công việc"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-600">
            Hạn hoàn thành
          </label>
          <input
            type="datetime-local"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
            className="w-full p-2.5 border border-gray-300 rounded text-sm"
          />
        </div>

        <div className="flex gap-2.5 mt-5">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : "Tạo công việc"}
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignmentForm;
