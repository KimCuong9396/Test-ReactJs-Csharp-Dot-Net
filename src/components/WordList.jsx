import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getWordsByLesson,
  addFavoriteWord,
  getUserProgress,
  updateUserProgress,
} from "../services/api";
import { toast } from "react-toastify";
import Flashcard from "./Flashcard";
import { ProgressContext } from "../context/ProgressContext";
import { AuthContext } from "../context/AuthContext";

const WordList = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { updateWordProgress } = useContext(ProgressContext);
  const { token } = useContext(AuthContext);
  const [words, setWords] = useState([]);
  const [progress, setProgress] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      toast.info("Vui lòng đăng nhập để học từ vựng!");
      return;
    }

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
  }, [lessonId, token, navigate]);

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
        nextReview: calculateNextReview(currentProgress.memoryLevel + 1, true),
        reviewCount: currentProgress.reviewCount + 1,
        status: "Learned",
      };

      const response = await updateUserProgress(updatedProgress);
      setProgress((prev) => ({
        ...prev,
        [wordId]: response.data,
      }));
      const wordData = words.find((w) => w.wordId === wordId);
      updateWordProgress(wordId, {
        ...response.data,
        word: wordData,
      });
      toast.success("Đã đánh dấu từ thuộc!");
      handleNext();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không cập nhật được tiến độ");
    }
  };

  const handleNext = async () => {
    const wordId = words[currentIndex]?.wordId;
    if (wordId) {
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
          nextReview: calculateNextReview(
            currentProgress.memoryLevel + 1,
            false
          ),
          reviewCount: currentProgress.reviewCount + 1,
          status: "Learned",
        };

        const response = await updateUserProgress(updatedProgress);
        setProgress((prev) => ({
          ...prev,
          [wordId]: response.data,
        }));
        const wordData = words.find((w) => w.wordId === wordId);
        updateWordProgress(wordId, {
          ...response.data,
          word: wordData,
        });
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Không cập nhật được tiến độ"
        );
      }
    }

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

  const calculateNextReview = (memoryLevel, isLearned) => {
    const now = new Date();
    let daysToAdd;

    if (isLearned) {
      // Thời gian ôn tập dài hơn cho "Đã thuộc"
      daysToAdd = memoryLevel === 1 ? 2 : memoryLevel === 2 ? 5 : 10;
    } else {
      // Thời gian ôn tập ngắn hơn cho "Tiếp tục"
      daysToAdd = memoryLevel === 1 ? 1 : memoryLevel === 2 ? 3 : 7;
    }

    now.setDate(now.getDate() + daysToAdd);
    return now.toISOString();
  };

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

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg mx-auto p-6">
        <div className="flex flex-col items-center">
          <div className="w-full bg-gray-200 h-2 rounded-full mb-6 overflow-hidden">
            <div
              className="bg-blue-700 h-full rounded-full transition-all duration-300"
              style={{
                width:
                  words.length > 0
                    ? `${((currentIndex + 1) / words.length) * 100}%`
                    : "0%",
              }}
            />
          </div>
          {isCompleted && (
            <div className="flex items-center justify-center mb-6">
              <div className="bg-blue-50 text-blue-700 text-lg font-semibold px-6 py-3 rounded-lg shadow-sm">
                Chúc mừng! Bạn đã hoàn thành bộ từ vựng!
              </div>
            </div>
          )}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-center shadow-sm w-full">
              {error}
            </div>
          )}
          {loading && (
            <div className="text-gray-600 text-center italic">
              Đang tải thẻ...
            </div>
          )}
          {!loading && words.length === 0 && !error && (
            <div className="text-gray-600 text-center italic">
              Không có thẻ từ vựng cho bài học này.
            </div>
          )}
          {!loading && words.length > 0 && !isCompleted && (
            <div
              className={`w-full transition-all duration-300 flashcard-container ${
                animate ? "animate-slideIn" : ""
              }`}
            >
              <Flashcard
                word={words[currentIndex]}
                onNext={handleNext}
                onSpeak={handleSpeak}
                onAddFavorite={handleAddFavorite}
                onLearned={handleLearned}
              />
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
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default WordList;
