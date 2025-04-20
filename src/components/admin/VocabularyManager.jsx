import React, { useState, useEffect } from "react";
import axios from "axios";

const VocabularyManager = () => {
  const [words, setWords] = useState([]);
  const [lessonTitles, setLessonTitles] = useState([]); // Lưu tất cả tiêu đề bài học
  const [filteredTitles, setFilteredTitles] = useState([]); // Tiêu đề đã lọc
  const [searchQuery, setSearchQuery] = useState(""); // Từ khóa tìm kiếm
  const [formData, setFormData] = useState({
    wordText: "",
    title: "",
    mean: "",
    example: "",
    pronunciation: "",
    partOfSpeech: "",
    audioUrl: "",
    imageUrl: "",
    level: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // API base URL
  const API_URL = "http://localhost:5191/api/words";
  const LESSONS_API_URL = "http://localhost:5191/api/lessons";
  // JWT token từ localStorage
  const token = localStorage.getItem("token");

  // Lấy danh sách từ vựng và tiêu đề bài học khi component mount
  useEffect(() => {
    fetchWords();
    fetchLessonTitles();
  }, []);

  const fetchWords = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWords(response.data.$values || response.data);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Không thể tải danh sách từ vựng"
      );
    }
  };

  const fetchLessonTitles = async () => {
    try {
      const response = await axios.get(LESSONS_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const titles = response.data.$values
        ? response.data.$values.map((lesson) => lesson.title)
        : response.data.map((lesson) => lesson.title);
      const uniqueTitles = [...new Set(titles)]; // Loại bỏ tiêu đề trùng lặp
      setLessonTitles(uniqueTitles);
      setFilteredTitles(uniqueTitles); // Khởi tạo danh sách đã lọc
      console.log("Đã tải tiêu đề bài học:", uniqueTitles); // Debugging
    } catch (err) {
      console.error("Lỗi khi tải tiêu đề bài học:", err);
      setError(err.response?.data?.message || "Không thể tải tiêu đề bài học");
    }
  };

  // Lọc tiêu đề dựa trên từ khóa tìm kiếm
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = lessonTitles.filter((title) =>
      title.toLowerCase().includes(query)
    );
    setFilteredTitles(filtered);
    // Nếu tiêu đề hiện tại không nằm trong danh sách lọc, reset formData.title
    if (!filtered.includes(formData.title)) {
      setFormData({ ...formData, title: "" });
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

    // Kiểm tra tiêu đề
    if (!formData.title || !lessonTitles.includes(formData.title)) {
      setError("Vui lòng chọn một tiêu đề bài học hợp lệ từ danh sách.");
      return;
    }

    try {
      console.log("Gửi formData:", formData); // Debugging
      if (editingId) {
        // Cập nhật từ vựng
        await axios.put(`${API_URL}/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Cập nhật từ vựng thành công");
      } else {
        // Tạo từ vựng mới
        const response = await axios.post(API_URL, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Tạo từ vựng thành công");
        console.log("Phản hồi tạo từ vựng:", response.data); // Debugging
      }
      // Đóng modal, reset form, và làm mới danh sách từ vựng
      closeModal();
      fetchWords();
    } catch (err) {
      console.error("Lỗi khi gửi từ vựng:", err);
      setError(err.response?.data?.message || "Thao tác thất bại");
    }
  };

  const handleEdit = async (id) => {
    try {
      console.log("Lấy từ vựng với ID:", id); // Debugging
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const word = response.data;
      setFormData({
        wordText: word.wordText || "",
        title: word.title || "",
        mean: word.mean || "",
        example: word.example || "",
        pronunciation: word.pronunciation || "",
        partOfSpeech: word.partOfSpeech || "",
        audioUrl: word.audioUrl || "",
        imageUrl: word.imageUrl || "",
        level: word.level || "",
      });
      setEditingId(id);
      setIsModalOpen(true);
      setSearchQuery(""); // Reset tìm kiếm
      setFilteredTitles(lessonTitles); // Hiển thị tất cả tiêu đề khi chỉnh sửa
      setError("");
    } catch (err) {
      console.error("Lỗi khi chỉnh sửa:", err);
      setError(err.response?.data?.message || "Không thể lấy từ vựng");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa từ vựng này?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Xóa từ vựng thành công");
      fetchWords();
    } catch (err) {
      setError(err.response?.data?.message || "Xóa từ vựng thất bại");
    }
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
    setSearchQuery(""); // Reset tìm kiếm
    setFilteredTitles(lessonTitles); // Hiển thị tất cả tiêu đề
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      wordText: "",
      title: "",
      mean: "",
      example: "",
      pronunciation: "",
      partOfSpeech: "",
      audioUrl: "",
      imageUrl: "",
      level: "",
    });
    setEditingId(null);
    setError("");
    setSearchQuery(""); // Reset tìm kiếm
    setFilteredTitles(lessonTitles); // Hiển thị tất cả tiêu đề
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý Từ vựng</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      <button
        onClick={openCreateModal}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        Thêm Từ vựng Mới
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Chỉnh sửa Từ vựng" : "Thêm Từ vựng Mới"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">
                  Tìm kiếm Tiêu đề Bài học
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Nhập để tìm kiếm tiêu đề..."
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Tiêu đề Bài học *
                </label>
                <select
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border rounded p-2"
                >
                  <option value="">Chọn tiêu đề bài học</option>
                  {filteredTitles.map((title) => (
                    <option key={title} value={title}>
                      {title}
                    </option>
                  ))}
                </select>
                {filteredTitles.length === 0 && (
                  <p className="text-red-500 text-sm mt-1">
                    Không tìm thấy tiêu đề bài học nào khớp với tìm kiếm.
                  </p>
                )}
                {lessonTitles.length === 0 && (
                  <p className="text-red-500 text-sm mt-1">
                    Không có bài học nào. Vui lòng tạo bài học trước.
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Từ vựng *</label>
                <input
                  type="text"
                  name="wordText"
                  value={formData.wordText}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Nghĩa</label>
                <input
                  type="text"
                  name="mean"
                  value={formData.mean}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Ví dụ</label>
                <input
                  type="text"
                  name="example"
                  value={formData.example}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Phát âm</label>
                <input
                  type="text"
                  name="pronunciation"
                  value={formData.pronunciation}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Loại từ</label>
                <input
                  type="text"
                  name="partOfSpeech"
                  value={formData.partOfSpeech}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  URL Âm thanh
                </label>
                <input
                  type="text"
                  name="audioUrl"
                  value={formData.audioUrl}
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
                <label className="block text-sm font-medium">Cấp độ</label>
                <input
                  type="text"
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {editingId ? "Cập nhật Từ vựng" : "Thêm Từ vựng"}
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

      <h2 className="text-xl font-bold mb-4">Danh sách Từ vựng</h2>
      <div className="grid gap-4">
        {words.map((word) => (
          <div
            key={word.wordId}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold">{word.wordText}</h3>
              <p>Nghĩa: {word.mean || "-"}</p>
              <p>Tiêu đề: {word.title || "-"}</p>
              <p>Ví dụ: {word.example || "-"}</p>
              <p>Cấp độ: {word.level || "-"}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(word.wordId)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Sửa
              </button>
              <button
                onClick={() => handleDelete(word.wordId)}
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

export default VocabularyManager;
