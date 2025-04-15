// src/components/Revise.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllLearnedProgress } from "../services/api"; // Import hàm mới
import { toast } from "react-toastify";

const Revise = () => {
  const [learnedWords, setLearnedWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLearnedWords = async () => {
      setLoading(true);
      setError("");
      try {
        const progressResponse = await getAllLearnedProgress(); // Sử dụng hàm mới
        setLearnedWords(progressResponse.data.$values);
      } catch (err) {
        setError(err.response?.data?.message || "Không thể tải từ vựng đã học");
      } finally {
        setLoading(false);
      }
    };
    fetchLearnedWords();
  }, []);

  useEffect(() => {
    const checkReviews = () => {
      const now = new Date();
      learnedWords.forEach((word) => {
        if (word.nextReview && new Date(word.nextReview) <= now) {
          toast.info(`Đến lúc ôn tập: ${word.word.wordText}!`, {
            autoClose: false,
            onClick: () => {
              // Có thể điều hướng đến trang ôn tập cụ thể
            },
          });
        }
      });
    };

    const interval = setInterval(checkReviews, 60000); // Kiểm tra mỗi phút
    checkReviews(); // Kiểm tra ngay lập tức
    return () => clearInterval(interval);
  }, [learnedWords]);

  return (
    <div className="mt-8 max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold text-primary mb-4">
        Ôn tập từ vựng của bạn
      </h3>
      <Link
        to="/lessons"
        className="text-primary hover:text-indigo-700 underline mb-4 inline-block"
      >
        Quay lại danh sách bài học
      </Link>
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
      )}
      {loading && <div className="text-gray-600 text-center">Đang tải...</div>}
      {!loading && learnedWords.length === 0 && !error && (
        <div className="text-gray-600 text-center">
          Chưa có từ vựng nào được đánh dấu là đã học.
        </div>
      )}
      {!loading && learnedWords.length > 0 && (
        <div className="space-y-4">
          {learnedWords.map((word) => {
            const nextReview = word.nextReview
              ? new Date(word.nextReview)
              : null;
            const isDue = nextReview && nextReview <= new Date();
            return (
              <div
                key={word.wordId}
                className={`p-4 rounded-lg shadow-md ${
                  isDue ? "bg-yellow-100" : "bg-white"
                }`}
              >
                <h4 className="text-xl font-semibold text-gray-800">
                  {word.word.wordText}
                </h4>
                <p className="text-gray-600">
                  Cấp độ ghi nhớ: {word.memoryLevel || 1}
                </p>
                <p className="text-gray-600">
                  Số lần ôn tập: {word.reviewCount || 0}
                </p>
                <p className="text-gray-600">
                  Lần ôn tập tiếp theo:{" "}
                  {nextReview ? nextReview.toLocaleString() : "Chưa lên lịch"}
                </p>
                {isDue && (
                  <p className="text-red-600 font-semibold">
                    Đã đến lúc ôn tập!
                  </p>
                )}
                <Link
                  to={`/lessons/${word.word.lessonId}/words`} // Giả sử word chứa lessonId
                  className="text-primary hover:text-indigo-700 underline mt-2 inline-block"
                >
                  Ôn tập ngay
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Revise;
