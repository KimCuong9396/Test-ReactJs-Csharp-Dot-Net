import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const wordsResponse = await getWordsByLesson(lessonId);
        const fetchedWords = wordsResponse.data.$values.map((word) => ({
          wordId: word.wordId,
          wordText: word.wordText,
          mean: word.mean,
          example: word.example,
          pronunciation: word.pronunciation,
          partOfSpeech: word.partOfSpeech,
          audioUrl: word.audioUrl,
          imageUrl: word.imageUrl,
        }));
        setWords(fetchedWords);

        if (fetchedWords.length > 0) {
          try {
            const progressResponse = await getUserProgress(lessonId);
            const progressMap = progressResponse.data.reduce((acc, p) => {
              acc[p.wordId] = p;
              return acc;
            }, {});
            setProgress(progressMap);
          } catch (progressErr) {
            console.warn("Lỗi lấy tiến độ người dùng:", progressErr);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || "Không thể tải từ vựng");
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
      handleNext();
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
      setCurrentIndex(words.length);
      setIsCompleted(true);
      toast.success("Hoàn thành bộ từ vựng!");
      setTimeout(() => {
        navigate(`/revise`);
      }, 2000);
    }
  };

  const calculateNextReview = (memoryLevel) => {
    const now = new Date();
    const daysToAdd = memoryLevel === 1 ? 1 : memoryLevel === 2 ? 3 : 7;
    now.setDate(now.getDate() + daysToAdd);
    return now.toISOString();
  };

  // Phím tắt
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === " " && !isCompleted) {
        e.preventDefault();
        document.querySelector(".flashcard-container")?.click();
      } else if (e.key === "Enter" && !isCompleted) {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCompleted]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 bg-opacity-80 flex flex-col items-center justify-center pt-16 p-0 m-0 box-border">
      <div className="w-200 h-117 max-w-lg mx-4 bg-white bg-opacity-90 shadow-xl p-6 relative">
        <div className="flex flex-col items-center">
          {/* Thanh tiến độ */}
          <div className="w-full bg-gray-200 h-8 rounded-xl border border-gray-300 overflow-hidden mb-1 z-10">
            <div
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-full flex items-center justify-center text-indigo-900 text-sm font-semibold shadow-sm rounded-xl transition-all duration-300"
              style={{
                width:
                  words.length > 0
                    ? `${(currentIndex / words.length) * 100}%`
                    : "0%",
              }}
            >
              {currentIndex > 0 ? `${currentIndex}/${words.length}` : ""}
            </div>
          </div>
          {/* Thông báo hoàn thành */}
          {isCompleted && (
            <div className="flex items-center justify-center mt-4 z-20">
              <div className="bg-[#ffcb09] text-indigo-900 text-lg font-bold px-6 py-3 rounded-xl shadow-lg animate-pulse">
                Chúc mừng! Bạn đã hoàn thành bộ từ vựng!
              </div>
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-2 h-2 rounded-full animate-[fall_2s_ease-in-out_infinite] ${
                      i % 3 === 0
                        ? "bg-red-500"
                        : i % 3 === 1
                        ? "bg-blue-500"
                        : "bg-green-500"
                    }`}
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      transform: `rotate(${Math.random() * 360}deg)`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg mb-4 text-sm text-center">
              {error}
            </div>
          )}
          {loading && (
            <div className="text-gray-600 text-center italic text-sm">
              Đang tải thẻ...
            </div>
          )}
          {!loading && words.length === 0 && !error && (
            <div className="text-gray-600 text-center italic text-sm">
              Không có thẻ từ vựng cho bài học này.
            </div>
          )}
          {!loading && words.length > 0 && !isCompleted && (
            <div
              className={`transition-all duration-300 flashcard-container ${
                animate ? "animate-slideIn" : ""
              }`}
            >
              <div className="p-14">
                <Flashcard
                  word={words[currentIndex]}
                  onNext={handleNext}
                  onSpeak={handleSpeak}
                  onAddFavorite={handleAddFavorite}
                  onLearned={handleLearned}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fall {
          0% {
            transform: translateY(-100%) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default WordList;
