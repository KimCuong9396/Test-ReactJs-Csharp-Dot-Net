import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getWordsByLesson,
  addFavoriteWord,
  getUserProgress,
  updateUserProgress,
} from "../services/api";
import { toast } from "react-toastify";
import Flashcard from "./Flashcard";

const WordList = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [progress, setProgress] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const wordsResponse = await getWordsByLesson(lessonId);
        setWords(
          wordsResponse.data.$values.map((word) => ({
            wordId: word.wordId, // Giả sử API trả về wordId
            wordText: word.wordText,
            mean: word.mean,
            example: word.example,
            pronunciation: word.pronunciation,
            partOfSpeech: word.partOfSpeech,
            audioUrl: word.audioUrl,
          }))
        );

        const progressResponse = await getUserProgress(lessonId);
        const progressMap = progressResponse.data.reduce((acc, p) => {
          acc[p.wordId] = p;
          return acc;
        }, {});
        setProgress(progressMap);
      } catch (err) {
        setError(err.response?.data?.message || "Không tải được dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [lessonId]);

  const handleSpeak = (wordText, audioUrl) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch((err) => console.error("Lỗi phát âm thanh:", err));
    } else {
      const utterance = new SpeechSynthesisUtterance(wordText);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAddFavorite = async (wordId) => {
    try {
      await addFavoriteWord({ wordId });
      toast.success("Đã thêm vào yêu thích!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Không thêm được vào yêu thích"
      );
    }
  };

  const handleLearned = async (wordId) => {
    try {
      const currentProgress = progress[wordId] || {
        wordId,
        memoryLevel: 0,
        reviewCount: 0,
        status: "NotLearned",
      };

      const updatedProgress = {
        wordId,
        memoryLevel: currentProgress.memoryLevel + 1,
        lastReviewed: new Date().toISOString(),
        nextReview: calculateNextReview(currentProgress.memoryLevel + 1),
        reviewCount: currentProgress.reviewCount + 1,
        status: "Learned",
      };

      const response = await updateUserProgress(updatedProgress);
      setProgress((prev) => ({
        ...prev,
        [wordId]: response.data,
      }));
      toast.success("Đã đánh dấu từ thuộc!");
      handleNext(); // Chuyển sang từ tiếp theo sau khi đánh dấu thuộc
    } catch (err) {
      toast.error(err.response?.data?.message || "Không cập nhật được tiến độ");
    }
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setAnimate(true);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setAnimate(false);
      }, 300);
    } else {
      toast.success("Hoàn thành bộ từ vựng!");
      setTimeout(() => {
        navigate(`/courses`);
      }, 1500);
    }
  };

  const calculateNextReview = (memoryLevel) => {
    const now = new Date();
    const daysToAdd = memoryLevel === 1 ? 1 : memoryLevel === 2 ? 3 : 7;
    now.setDate(now.getDate() + daysToAdd);
    return now.toISOString();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-3xl font-bold text-blue-800">Thẻ Từ Vựng</h3>
          <Link
            to={`/revise`}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Xem tiến độ
          </Link>
        </div>
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            {error}
          </div>
        )}
        {loading && (
          <div className="text-gray-600 text-center">Đang tải thẻ...</div>
        )}
        {!loading && words.length === 0 && !error && (
          <div className="text-gray-600 text-center">
            Không có thẻ từ vựng cho bài học này.
          </div>
        )}
        {!loading && words.length > 0 && (
          <div
            className={`transition-all duration-300 ${
              animate ? "opacity-50 scale-95" : "opacity-100 scale-100"
            }`}
          >
            <Flashcard
              word={words[currentIndex]}
              onNext={handleNext}
              onSpeak={handleSpeak}
              onAddFavorite={handleAddFavorite}
              onLearned={handleLearned}
            />
            <p className="text-center text-gray-600 mt-4">
              Thẻ {currentIndex + 1} / {words.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordList;
