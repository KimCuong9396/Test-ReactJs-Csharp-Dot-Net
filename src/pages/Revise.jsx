// src/components/Revise.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllLearnedProgress, updateUserProgress } from "../services/api";
import { toast } from "react-toastify";

const Revise = () => {
  const [learnedWords, setLearnedWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [gameWords, setGameWords] = useState([]);
  const [showGame, setShowGame] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLearnedWords = async () => {
      setLoading(true);
      setError("");
      try {
        const progressResponse = await getAllLearnedProgress();
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
            onClick: () => startGame(word.wordId),
          });
        }
      });
    };

    const interval = setInterval(checkReviews, 60000);
    checkReviews();
    return () => clearInterval(interval);
  }, [learnedWords]);

  const startGame = (wordId = null) => {
    let wordsToReview;
    if (wordId) {
      wordsToReview = learnedWords.filter((w) => w.wordId === wordId);
    } else {
      wordsToReview = learnedWords;
    }

    if (wordsToReview.length === 0) {
      toast.info("Chưa có từ vựng nào để ôn tập!");
      return;
    }

    setGameWords(shuffleArray(wordsToReview));
    setShowGame(true);
    setCurrentWordIndex(0);
    setScore(0);
    setUserAnswer("");
    setShowResult(false);
    setIsCorrect(null);
  };

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const calculateNextReview = (memoryLevel) => {
    const now = new Date();
    const daysToAdd = memoryLevel === 1 ? 1 : memoryLevel === 2 ? 3 : 7;
    now.setDate(now.getDate() + daysToAdd);
    return now.toISOString();
  };

  const handleCheckResult = async () => {
    if (!userAnswer.trim()) {
      toast.error("Vui lòng nhập nghĩa của từ!");
      return;
    }

    const currentWord = gameWords[currentWordIndex];
    console.log("Current word:", currentWord.word.mean);
    const isAnswerCorrect =
      userAnswer.toLowerCase().trim() ===
      currentWord.word.mean.toLowerCase().trim();

    setIsCorrect(isAnswerCorrect);
    setShowResult(true);

    if (isAnswerCorrect) {
      setScore(score + 1);
      toast.success("Đúng rồi!");
    } else {
      toast.error("Sai rồi!");
    }

    // Cập nhật tiến độ học
    try {
      const currentProgress = learnedWords.find(
        (w) => w.wordId === currentWord.wordId
      ) || {
        wordId: currentWord.wordId,
        memoryLevel: 0,
        reviewCount: 0,
        status: "NotLearned",
      };

      const updatedProgress = {
        wordId: currentWord.wordId,
        memoryLevel: isAnswerCorrect
          ? currentProgress.memoryLevel + 1
          : Math.max(1, currentProgress.memoryLevel),
        lastReviewed: new Date().toISOString(),
        nextReview: calculateNextReview(
          isAnswerCorrect
            ? currentProgress.memoryLevel + 1
            : currentProgress.memoryLevel
        ),
        reviewCount: currentProgress.reviewCount + 1,
        status: "Learned",
      };

      const response = await updateUserProgress(updatedProgress);
      setLearnedWords((prev) =>
        prev.map((w) =>
          w.wordId === currentWord.wordId ? { ...w, ...response.data } : w
        )
      );
    } catch (err) {
      console.error("Lỗi khi cập nhật tiến độ:", err);
      toast.error("Không thể lưu tiến độ ôn tập");
    }
  };

  const handleContinue = async () => {
    if (currentWordIndex + 1 < gameWords.length) {
      setCurrentWordIndex(currentWordIndex + 1);
      setUserAnswer("");
      setShowResult(false);
      setIsCorrect(null);
    } else {
      toast.info(
        `Kết thúc game! Điểm số: ${score + (isCorrect ? 1 : 0)}/${
          gameWords.length
        }`
      );
      setShowGame(false);
      setShowResult(false);
      setIsCorrect(null);

      // Cập nhật lại danh sách từ đã học
      try {
        const progressResponse = await getAllLearnedProgress();
        setLearnedWords(progressResponse.data.$values);
      } catch (err) {
        console.error("Lỗi khi làm mới danh sách:", err);
      }
    }
  };

  return (
    <div className="mt-8 max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold text-primary mb-4">
        Ôn tập từ vựng của bạn
      </h3>
      <div className="flex gap-4 mb-4">
        <Link
          to="/lessons"
          className="text-primary hover:text-indigo-700 underline"
        >
          Quay lại danh sách bài học
        </Link>
        <button
          onClick={() => startGame()}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Ôn tập từ vựng
        </button>
      </div>

      {showGame ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-xl font-semibold mb-4">
            Từ vựng: {gameWords[currentWordIndex].word.wordText}
          </h4>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Nhập nghĩa của từ..."
            className="w-full p-2 border rounded mb-4"
            disabled={showResult}
          />
          {!showResult ? (
            <button
              onClick={handleCheckResult}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Xem kết quả
            </button>
          ) : (
            <div
              className={`p-4 rounded-lg shadow-md ${
                isCorrect ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <p className="text-lg font-semibold">
                {isCorrect ? "Đúng!" : "Sai!"}
              </p>
              <p className="text-gray-800">
                Từ: {gameWords[currentWordIndex].word.wordText}
              </p>
              <p className="text-gray-800">
                Nghĩa đúng: {gameWords[currentWordIndex].word.mean}
              </p>
              <button
                onClick={handleContinue}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-indigo-700 mt-4"
              >
                Tiếp tục
              </button>
            </div>
          )}
          <p className="mt-4">
            Điểm: {score}/{gameWords.length}
          </p>
        </div>
      ) : (
        <>
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
              {error}
            </div>
          )}
          {loading && (
            <div className="text-gray-600 text-center">Đang tải...</div>
          )}
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
                      {nextReview
                        ? nextReview.toLocaleString()
                        : "Chưa lên lịch"}
                    </p>
                    {isDue && (
                      <p className="text-red-600 font-semibold">
                        Đã đến lúc ôn tập!
                      </p>
                    )}
                    <button
                      onClick={() => startGame(word.wordId)}
                      className="text-primary hover:text-indigo-700 underline mt-2 inline-block"
                    >
                      Ôn tập ngay
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Revise;
