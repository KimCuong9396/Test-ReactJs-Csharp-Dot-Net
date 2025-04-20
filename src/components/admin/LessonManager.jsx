import React, { useState, useEffect } from "react";
import axios from "axios";

const LessonManager = () => {
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]); // Lưu danh sách khóa học
  const [filteredCourses, setFilteredCourses] = useState([]); // Khóa học đã lọc
  const [searchQuery, setSearchQuery] = useState(""); // Từ khóa tìm kiếm khóa học
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
      console.log("Đã tải danh sách bài học:", response.data); // Debugging
    } catch (err) {
      window.alert(
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
      console.log("Đã tải danh sách khóa học:", coursesData); // Debugging
    } catch (err) {
      console.error("Lỗi khi tải khóa học:", err);
      window.alert(
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
    // Nếu courseId hiện tại không nằm trong danh sách lọc, reset formData.courseId
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
      window.alert("Vui lòng chọn một khóa học hợp lệ từ danh sách.");
      return;
    }
    if (!formData.title) {
      window.alert("Tiêu đề bài học là bắt buộc.");
      return;
    }
    if (formData.orderInCourse < 0) {
      window.alert("Thứ tự trong khóa học phải là số không âm.");
      return;
    }

    try {
      console.log("Gửi formData:", formData); // Debugging
      if (editingId) {
        // Cập nhật bài học
        await axios.put(`${API_URL}/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        window.alert("Cập nhật bài học thành công!");
      } else {
        // Tạo bài học mới
        const response = await axios.post(API_URL, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        window.alert("Tạo bài học thành công!");
        console.log("Phản hồi tạo bài học:", response.data); // Debugging
      }
      // Đóng modal, reset form, và làm mới danh sách bài học
      closeModal();
      fetchLessons();
    } catch (err) {
      console.error("Lỗi khi gửi bài học:", err);
      window.alert(err.response?.data?.message || "Thao tác thất bại");
    }
  };

  const handleEdit = async (id) => {
    try {
      console.log("Lấy bài học với ID:", id); // Debugging
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
      setSearchQuery(""); // Reset tìm kiếm
      setFilteredCourses(courses); // Hiển thị tất cả khóa học
    } catch (err) {
      console.error("Lỗi khi chỉnh sửa:", err);
      window.alert(err.response?.data?.message || "Không thể lấy bài học");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài học này?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.alert("Xóa bài học thành công!");
      fetchLessons();
    } catch (err) {
      window.alert(err.response?.data?.message || "Xóa bài học thất bại");
    }
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
    setSearchQuery(""); // Reset tìm kiếm
    setFilteredCourses(courses); // Hiển thị tất cả khóa học
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
    setSearchQuery(""); // Reset tìm kiếm
    setFilteredCourses(courses); // Hiển thị tất cả khóa học
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý Bài học</h1>

      <button
        onClick={openCreateModal}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        Thêm Bài học Mới
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Chỉnh sửa Bài học" : "Thêm Bài học Mới"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">
                  Tìm kiếm Khóa học
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Nhập để tìm kiếm khóa học..."
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Khóa học *</label>
                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border rounded p-2"
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
                <label className="block text-sm font-medium">Tiêu đề *</label>
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
                <label className="block text-sm font-medium">Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  URL Hình ảnh
                </label>
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
                  Thứ tự trong Khóa học *
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
                  {editingId ? "Cập nhật Bài học" : "Thêm Bài học"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">Danh sách Bài học</h2>
      <div className="grid gap-4">
        {lessons.map((lesson) => (
          <div
            key={lesson.lessonId}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold">{lesson.title}</h3>
              <p>Mô tả: {lesson.description || "-"}</p>
              <p>Thứ tự trong Khóa học: {lesson.orderInCourse}</p>
              <p>
                Khóa học:{" "}
                {courses.find((c) => c.courseId === lesson.courseId)?.title ||
                  lesson.courseId}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(lesson.lessonId)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Sửa
              </button>
              <button
                onClick={() => handleDelete(lesson.lessonId)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonManager;
