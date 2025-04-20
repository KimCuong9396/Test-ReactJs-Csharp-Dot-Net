import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const LessonManager = () => {
  // Use courseId in API calls
  const [lessons, setLessons] = useState([]);
  const [formData, setFormData] = useState({
    courseId: 1, // Placeholder; replace with dynamic courseId
    title: "",
    description: "",
    imageUrl: "",
    orderInCourse: 0,
  });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // API base URL
  const API_URL = "http://localhost:5191/api/lessons";
  // JWT token from localStorage
  const token = localStorage.getItem("token");
  // Placeholder courseId
  const { courseId } = useParams();

  // Fetch lessons on component mount
  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const response = await axios.get(`${API_URL}/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessons(response.data.$values);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch lessons");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        // Update lesson (assumes PUT endpoint exists)
        await axios.put(`${API_URL}/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Lesson updated successfully");
      } else {
        // Create new lesson
        await axios.post(API_URL, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Lesson created successfully");
      }
      // Close modal, reset form, and refresh lessons
      closeModal();
      fetchLessons();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = async (id) => {
    try {
      //console.log("Fetching lesson with ID:", id); // Debugging
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const lesson = response.data;
      //console.log("Lesson data fetched:", lesson); // Debugging
      setFormData({
        courseId: lesson.courseId || 1,
        title: lesson.title || "",
        description: lesson.description || "",
        imageUrl: lesson.imageUrl || "",
        orderInCourse: lesson.orderInCourse || 0,
      });
      setEditingId(id);
      setIsModalOpen(true);
      setError("");
    } catch (err) {
      console.error("Error in handleEdit:", err); // Debugging
      setError(err.response?.data?.message || "Failed to fetch lesson");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Lesson deleted successfully");
      fetchLessons();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete lesson");
    }
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      courseId: 1, // Reset to placeholder; adjust as needed
      title: "",
      description: "",
      imageUrl: "",
      orderInCourse: 0,
    });
    setEditingId(null);
    setError("");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lesson Management</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      <button
        onClick={openCreateModal}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        Add New Lesson
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Lesson" : "Add New Lesson"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Course ID *</label>
                <input
                  type="number"
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Image URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Order in Course *
                </label>
                <input
                  type="number"
                  name="orderInCourse"
                  value={formData.orderInCourse}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {editingId ? "Update Lesson" : "Add Lesson"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">Lesson List</h2>
      <div className="grid gap-4">
        {lessons.map((lesson) => (
          <div
            key={lesson.lessonId}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold">{lesson.title}</h3>
              <p>Description: {lesson.description || "-"}</p>
              <p>Order in Course: {lesson.orderInCourse}</p>
              <p>Course ID: {lesson.courseId}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(lesson.lessonId)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(lesson.lessonId)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonManager;
