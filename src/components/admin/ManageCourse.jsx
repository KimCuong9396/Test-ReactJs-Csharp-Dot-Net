import React, { useState, useEffect } from "react";
import {
  getCourses,
  DeleteCourse,
  UpdateCourse,
  CreateCourse,
} from "../../services/api";
import CreateCourseModal from "./CreateCourseModal";
import EditCourseModal from "./EditCourseModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

const ManageCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);

  // Lấy danh sách khóa học
  const fetchCourses = async () => {
    try {
      const response = await getCourses();
      setCourses(response.data.$values);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Không thể tải danh sách khóa học.");
      setLoading(false);
    }
  };

  // Gọi khi component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Tạo khóa học mới
  const handleCreateCourse = async (course) => {
    try {
      const response = await CreateCourse(course);
      await fetchCourses(); // Đồng bộ lại danh sách
      alert("Tạo khóa học thành công!");
    } catch (err) {
      console.error("Error creating course:", err);
      throw err;
    }
  };

  // Cập nhật khóa học
  const handleUpdateCourse = async (course) => {
    try {
      await UpdateCourse(course.courseId, {
        courseId: course.courseId,
        title: course.title,
        description: course.description,
        level: course.level,
      });
      await fetchCourses(); // Đồng bộ lại danh sách
      alert("Cập nhật khóa học thành công!");
    } catch (err) {
      console.error("Error updating course:", err);
      throw err;
    }
  };

  // Xóa khóa học
  const handleDeleteCourse = async () => {
    try {
      await DeleteCourse(courseToDelete.courseId);
      await fetchCourses(); // Đồng bộ lại danh sách
      alert("Xóa khóa học thành công!");
      setShowDeleteModal(false);
      setCourseToDelete(null);
    } catch (err) {
      console.error("Error deleting course:", err);
      alert("Xóa khóa học thất bại!");
      setShowDeleteModal(false);
      setCourseToDelete(null);
    }
  };

  if (loading) return <div className="text-center p-6">Đang tải...</div>;
  if (error) return <div className="text-center p-6 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-primary mb-6">Quản lý khóa học</h2>
      <div className="mb-4">
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Tạo khóa học mới
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {courses.length === 0 ? (
          <p className="text-gray-600">Chưa có khóa học nào.</p>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Tiêu đề</th>
                <th className="px-4 py-2 text-left">Mô tả</th>
                <th className="px-4 py-2 text-left">Cấp độ</th>
                <th className="px-4 py-2 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.courseId} className="border-t">
                  <td className="px-4 py-2">{course.title}</td>
                  <td className="px-4 py-2">
                    {course.description || "Không có mô tả"}
                  </td>
                  <td className="px-4 py-2">{course.level || "N/A"}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => {
                        setCurrentCourse(course);
                        setShowEditModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 mr-4"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => {
                        setCourseToDelete(course);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal tạo khóa học */}
      {showCreateModal && (
        <CreateCourseModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateCourse}
        />
      )}

      {/* Modal sửa khóa học */}
      {showEditModal && (
        <EditCourseModal
          course={currentCourse}
          onClose={() => {
            setShowEditModal(false);
            setCurrentCourse(null);
          }}
          onUpdate={handleUpdateCourse}
        />
      )}

      {/* Modal xác nhận xóa */}
      {showDeleteModal && (
        <DeleteConfirmModal
          course={courseToDelete}
          onClose={() => {
            setShowDeleteModal(false);
            setCourseToDelete(null);
          }}
          onDelete={handleDeleteCourse}
        />
      )}
    </div>
  );
};

export default ManageCourse;
