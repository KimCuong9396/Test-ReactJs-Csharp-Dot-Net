import React, { useState, useEffect } from "react";
import axios from "axios";
const LessonManager = () => {
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    description: "",
    imageUrl: "",
    orderInCourse: 0,
  });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // API base URL
  const API_URL = "http://localhost:5191/api/lessons";
  const COURSES_API_URL = "http://localhost:5191/api/courses";
  // JWT token từ localStorage
  const token = localStorage.getItem("token");

  // Lấy danh sách bài học và khóa học khi component mount
  useEffect(() => {
    fetchLessons();
    fetchCourses();
  }, []);

  const fetchLessons = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessons(response.data.$values || response.data);
      //console.log("Đã tải danh sách bài học:", response.data);
    } catch (err) {
      win.error(
        err.response?.data?.message || "Không thể tải danh sách bài học"
      );
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(COURSES_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const coursesData = response.data.$values || response.data;
      setCourses(coursesData);
      setFilteredCourses(coursesData);
      //console.log("Đã tải danh sách khóa học:", coursesData);
    } catch (err) {
      console.error("Lỗi khi tải khóa học:", err);
      win.error(
        err.response?.data?.message || "Không thể tải danh sách khóa học"
      );
    }
  };

  // Lọc khóa học dựa trên từ khóa tìm kiếm
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(query)
    );
    setFilteredCourses(filtered);
    if (
      !filtered.some(
        (course) => course.courseId.toString() === formData.courseId
      )
    ) {
      setFormData({ ...formData, courseId: "" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra dữ liệu
    if (
      !formData.courseId ||
      !courses.some((c) => c.courseId.toString() === formData.courseId)
    ) {
      win.error("Vui lòng chọn một khóa học hợp lệ từ danh sách.");
      return;
    }
    if (!formData.title) {
      win.error("Tiêu đề bài học là bắt buộc.");
      return;
    }
    if (formData.orderInCourse < 0) {
      win.error("Thứ tự trong khóa học phải là số không âm.");
      return;
    }

    try {
      //console.log("Gửi formData:", formData);
      if (editingId) {
        // Cập nhật bài học
        await axios.put(`${API_URL}/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        win.success("Cập nhật bài học thành công!");
      } else {
        // Tạo bài học mới
        const response = await axios.post(API_URL, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        win.success("Tạo bài học thành công!");
        //console.log("Phản hồi tạo bài học:", response.data);
      }
      // Đóng modal, reset form, và làm mới danh sách bài học
      closeModal();
      fetchLessons();
    } catch (err) {
      console.error("Lỗi khi gửi bài học:", err);
      win.error(err.response?.data?.message || "Thao tác thất bại");
    }
  };

  const handleEdit = async (id) => {
    try {
      //console.log("Lấy bài học với ID:", id);
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const lesson = response.data;
      setFormData({
        courseId: lesson.courseId.toString() || "",
        title: lesson.title || "",
        description: lesson.description || "",
        imageUrl: lesson.imageUrl || "",
        orderInCourse: lesson.orderInCourse || 0,
      });
      setEditingId(id);
      setIsModalOpen(true);
      setSearchQuery("");
      setFilteredCourses(courses);
    } catch (err) {
      console.error("Lỗi khi chỉnh sửa:", err);
      win.error(err.response?.data?.message || "Không thể lấy bài học");
    }
  };

  const handleDelete = async (id) => {
    win.info(
      <div>
        <p>Bạn có chắc muốn xóa bài học này?</p>
        <div className="flex space-x-2 mt-2">
          <button
            onClick={async () => {
              try {
                await axios.delete(`${API_URL}/${id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                win.success("Xóa bài học thành công!");
                fetchLessons();
              } catch (err) {
                win.error(
                  err.response?.data?.message || "Xóa bài học thất bại"
                );
              }
            }}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Xóa
          </button>
          <button
            onClick={() => win.dismiss()}
            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
          >
            Hủy
          </button>
        </div>
      </div>,
      { autoClose: true, closeOnClick: false }
    );
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
    setSearchQuery("");
    setFilteredCourses(courses);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      courseId: "",
      title: "",
      description: "",
      imageUrl: "",
      orderInCourse: 0,
    });
    setEditingId(null);
    setSearchQuery("");
    setFilteredCourses(courses);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Bài học</h1>

      <button
        onClick={openCreateModal}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mb-6"
      >
        Thêm Bài học Mới
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {editingId ? "Chỉnh sửa Bài học" : "Thêm Bài học Mới"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tìm kiếm Khóa học
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Nhập để tìm kiếm khóa học..."
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Khóa học *
                </label>
                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Chọn khóa học</option>
                  {filteredCourses.map((course) => (
                    <option key={course.courseId} value={course.courseId}>
                      {course.title}
                    </option>
                  ))}
                </select>
                {filteredCourses.length === 0 && (
                  <p className="text-red-500 text-sm mt-1">
                    Không tìm thấy khóa học nào khớp với tìm kiếm.
                  </p>
                )}
                {courses.length === 0 && (
                  <p className="text-red-500 text-sm mt-1">
                    Không có khóa học nào. Vui lòng tạo khóa học trước.
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tiêu đề *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  URL Hình ảnh
                </label>
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Thứ tự trong Khóa học *
                </label>
                <input
                  type="number"
                  name="orderInCourse"
                  value={formData.orderInCourse}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {editingId ? "Cập nhật Bài học" : "Thêm Bài học"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Danh sách Bài học
      </h2>
      {lessons.length === 0 ? (
        <p className="text-gray-600">Chưa có bài học nào.</p>
      ) : (
        <div className="grid gap-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.lessonId}
              className="border border-gray-200 p-4 rounded-lg shadow-sm flex justify-between items-center bg-white hover:shadow-md transition"
            >
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  {lesson.title}
                </h3>
                <p className="text-gray-600">
                  Mô tả: {lesson.description || "-"}
                </p>
                <p className="text-gray-600">
                  Thứ tự trong Khóa học: {lesson.orderInCourse}
                </p>
                <p className="text-gray-600">
                  Khóa học:{" "}
                  {courses.find((c) => c.courseId === lesson.courseId)?.title ||
                    lesson.courseId}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(lesson.lessonId)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(lesson.lessonId)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <winContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default LessonManager;
