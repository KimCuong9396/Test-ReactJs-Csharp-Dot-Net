import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VocabularyManager = () => {
  const [words, setWords] = useState([]);
  const [lessonTitles, setLessonTitles] = useState([]);
  const [filteredTitles, setFilteredTitles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(""); // For non-CRUD errors

  const API_URL = "http://localhost:5191/api/words";
  const LESSONS_API_URL = "http://localhost:5191/api/lessons";
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchWords();
    fetchLessonTitles();
  }, []);

  const fetchWords = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWords(response.data.$values || response.data);
      setIsLoading(false);
    } catch (err) {
      console.error(
        "Không thể tải danh sách từ vựng:",
        err.response?.data?.message || err.message
      );
      setIsLoading(false);
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
      const uniqueTitles = [...new Set(titles)];
      setLessonTitles(uniqueTitles);
      setFilteredTitles(uniqueTitles);
    } catch (err) {
      console.error(
        "Không thể tải tiêu đề bài học:",
        err.response?.data?.message || err.message
      );
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = lessonTitles.filter((title) =>
      title.toLowerCase().includes(query)
    );
    setFilteredTitles(filtered);
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

    if (!formData.title || !lessonTitles.includes(formData.title)) {
      setErrorMessage("Vui lòng chọn một tiêu đề bài học hợp lệ từ danh sách.");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Cập nhật từ vựng thành công");
      } else {
        await axios.post(API_URL, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Tạo từ vựng thành công");
      }
      closeModal();
      fetchWords();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Thao tác thất bại";
      toast.error(errorMessage);
    }
  };

  const handleEdit = async (id) => {
    try {
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
      setSearchQuery("");
      setFilteredTitles(lessonTitles);
    } catch (err) {
      console.error(
        "Không thể lấy từ vựng:",
        err.response?.data?.message || err.message
      );
    }
  };

  const handleDelete = async (id) => {
    toast.info(
      <div>
        <p>Bạn có chắc muốn xóa từ vựng này?</p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded text-gray-800 font-medium hover:bg-gray-300 transition-colors"
            onClick={() => toast.dismiss()}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded font-medium hover:bg-red-600 transition-colors"
            onClick={async () => {
              toast.dismiss();
              try {
                await axios.delete(`${API_URL}/${id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Xóa từ vựng thành công");
                fetchWords();
              } catch (err) {
                const errorMessage =
                  err.response?.data?.message || "Xóa từ vựng thất bại";
                toast.error(errorMessage);
              }
            }}
          >
            Xóa
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
    setSearchQuery("");
    setFilteredTitles(lessonTitles);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
    setErrorMessage("");
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
    setSearchQuery("");
    setFilteredTitles(lessonTitles);
  };

  const renderAudioPlayer = (url) => {
    if (!url) return null;
    return (
      <audio controls className="mt-2 w-full max-w-xs">
        <source src={url} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    );
  };

  const playAudio = (url) => {
    if (url) {
      const audio = new Audio(url);
      audio.play().catch((err) => {
        console.error("Không thể phát âm thanh:", err.message);
      });
    } else {
      //console.log("Không có âm thanh cho từ vựng này");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Quản lý Từ vựng
            </h1>
            <button
              onClick={openCreateModal}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Thêm Từ vựng Mới
            </button>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-700 border-b pb-2">
              Danh sách Từ vựng
            </h2>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : words.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <p className="text-xl">Chưa có từ vựng nào</p>
                <p className="mt-2">Hãy thêm từ vựng đầu tiên của bạn</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {words.map((word) => (
                  <div
                    key={word.wordId}
                    className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row">
                      {word.imageUrl && (
                        <div className="md:w-1/4 p-4">
                          <img
                            src={word.imageUrl}
                            alt={word.wordText}
                            className="rounded-lg w-full h-48 object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              // console.log(
                              //   `Không thể tải hình ảnh cho từ "${word.wordText}"`
                              // );
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center mb-3">
                              <h3 className="text-xl font-bold text-gray-800">
                                {word.wordText}
                              </h3>
                              {word.audioUrl && (
                                <button
                                  onClick={() => playAudio(word.audioUrl)}
                                  className="ml-3 text-blue-600 hover:text-blue-800"
                                  title="Phát âm thanh"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-gray-700">
                              <div>
                                <p>
                                  <span className="font-medium">Nghĩa:</span>{" "}
                                  {word.mean || "-"}
                                </p>
                                <p>
                                  <span className="font-medium">Tiêu đề:</span>{" "}
                                  {word.title || "-"}
                                </p>
                                <p>
                                  <span className="font-medium">Phát âm:</span>{" "}
                                  {word.pronunciation || "-"}
                                </p>
                              </div>
                              <div>
                                <p>
                                  <span className="font-medium">Loại từ:</span>{" "}
                                  {word.partOfSpeech || "-"}
                                </p>
                                <p>
                                  <span className="font-medium">Cấp độ:</span>{" "}
                                  {word.level || "-"}
                                </p>
                                <p>
                                  <span className="font-medium">Ví dụ:</span>{" "}
                                  {word.example || "-"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(word.wordId)}
                              className="bg-amber-100 text-amber-600 p-2 rounded-lg hover:bg-amber-200 transition-colors"
                              title="Sửa"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(word.wordId)}
                              className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors"
                              title="Xóa"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingId ? "Chỉnh sửa Từ vựng" : "Thêm Từ vựng Mới"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                  {errorMessage}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tìm kiếm Tiêu đề Bài học
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Nhập để tìm kiếm tiêu đề..."
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu đề Bài học <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Từ vựng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="wordText"
                  value={formData.wordText}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nghĩa
                  </label>
                  <input
                    type="text"
                    name="mean"
                    value={formData.mean}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phát âm
                  </label>
                  <input
                    type="text"
                    name="pronunciation"
                    value={formData.pronunciation}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ví dụ
                </label>
                <input
                  type="text"
                  name="example"
                  value={formData.example}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại từ
                  </label>
                  <input
                    type="text"
                    name="partOfSpeech"
                    value={formData.partOfSpeech}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cấp độ
                  </label>
                  <input
                    type="text"
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Âm thanh
                  </label>
                  <input
                    type="text"
                    name="audioUrl"
                    value={formData.audioUrl}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Hình ảnh
                  </label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {editingId ? "Cập nhật Từ vựng" : "Thêm Từ vựng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VocabularyManager;
