import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getAllLearnedProgress, updateUserProgress } from "../services/api";
import { toast } from "react-toastify";
import { ProgressContext } from "../context/ProgressContext";
import { AuthContext } from "../context/AuthContext";

const Revise = () => {
  const { learnedWords, updateWordProgress } = useContext(ProgressContext);
  const { token } = useContext(AuthContext);
  const [filteredWords, setFilteredWords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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
  const location = useLocation();

  useEffect(() => {
    //console.log("learnedWords updated:", learnedWords);
    if (!token) {
      navigate("/login");
      toast.info("Vui lòng đăng nhập để ôn tập từ vựng!");
      return;
    }
    setFilteredWords(learnedWords);
    // Check for wordId query parameter
    const params = new URLSearchParams(location.search);
    const wordId = params.get("wordId");
    if (wordId && learnedWords.some((w) => w.wordId === parseInt(wordId))) {
      startGame(parseInt(wordId));
    }
  }, [learnedWords, location.search, token, navigate]);

  useEffect(() => {
    const checkReviews = () => {
      const now = new Date();
      learnedWords.forEach((word) => {
        if (word.nextReview && new Date(word.nextReview) <= now) {
          toast.info(`Đến lúc ôn tập: ${word.word?.wordText || "N/A"}!`, {
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

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredWords(learnedWords);
      return;
    }
    const filtered = learnedWords.filter((word) =>
      word.word?.wordText
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase().trim())
    );
    setFilteredWords(filtered);
  };

  const calculateNextReview = (memoryLevel) => {
    const now = new Date();
    const daysToAdd = memoryLevel === 1 ? 1 : memoryLevel === 2 ? 3 : 7;
    now.setDate(now.getDate() + daysToAdd);
    return now.toISOString();
  };

  const startGame = async (wordId = null) => {
    if (!token) {
      navigate("/login");
      return;
    }

    let wordsToReview;
    if (wordId) {
      wordsToReview = filteredWords.filter((w) => w.wordId === wordId);
    } else {
      wordsToReview = filteredWords;
    }

    if (wordsToReview.length === 0) {
      toast.info("Chưa có từ vựng nào để ôn tập!");
      return;
    }

    // Update nextReview for the specific word to remove it from notifications
    if (wordId) {
      try {
        const currentProgress = learnedWords.find(
          (w) => w.wordId === wordId
        ) || {
          wordId,
          memoryLevel: 1,
          reviewCount: 0,
          status: "Learned",
        };
        const updatedProgress = {
          wordId,
          memoryLevel: currentProgress.memoryLevel,
          lastReviewed: new Date().toISOString(),
          nextReview: calculateNextReview(currentProgress.memoryLevel),
          reviewCount: currentProgress.reviewCount,
          status: "Learned",
        };
        const response = await updateUserProgress(updatedProgress);
        updateWordProgress(wordId, response.data);
      } catch (err) {
        console.error("Lỗi khi cập nhật tiến độ:", err);
        toast.error("Không thể cập nhật tiến độ ôn tập");
      }
    }

    setGameWords(shuffleArray(wordsToReview));
    setShowGame(true);
    setCurrentWordIndex(0);
    setScore(0);
    setUserAnswer("");
    setShowResult(false);
    setIsCorrect(null);
    //console.log("Game started with words:", wordsToReview);
    navigate("/revise", { replace: true });
  };

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const handleCheckResult = async () => {
    // console.log("handleCheckResult called, userAnswer:", userAnswer);
    if (!userAnswer.trim()) {
      toast.error("Vui lòng nhập nghĩa của từ!");
      return;
    }

    const currentWord = gameWords[currentWordIndex];
    if (!currentWord?.word?.mean) {
      console.error("Missing mean for word:", currentWord);
      toast.error("Dữ liệu từ vựng không hợp lệ!");
      return;
    }

    const isAnswerCorrect =
      userAnswer.toLowerCase().trim() ===
      currentWord.word.mean.toLowerCase().trim();
    // console.log("Answer comparison:", {
    //   userAnswer: userAnswer.toLowerCase().trim(),
    //   correctAnswer: currentWord.word.mean.toLowerCase().trim(),
    //   isAnswerCorrect,
    // });

    setIsCorrect(isAnswerCorrect);
    setShowResult(true);

    if (isAnswerCorrect) {
      setScore(score + 1);
      toast.success("Đúng rồi!");
    } else {
      toast.error("Sai rồi!");
    }

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
      updateWordProgress(currentWord.wordId, response.data);
    } catch (err) {
      console.error("Lỗi khi cập nhật tiến độ:", err);
      toast.error("Không thể lưu tiến độ ôn tập");
    }
  };

  const handleContinue = async () => {
    //console.log("handleContinue called, currentWordIndex:", currentWordIndex);
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

      try {
        const progressResponse = await getAllLearnedProgress();
        updateWordProgress(null, progressResponse.data.$values);
      } catch (err) {
        console.error("Lỗi khi làm mới danh sách:", err);
      }
    }
  };

  if (!token) {
    return null; // Render nothing while redirecting
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-20 px-4">
      <div className="w-full max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={() => startGame()}
            className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 transition duration-200 font-medium"
          >
            Ôn tập tất cả từ vựng đã học
          </button>
        </div>
      </div>

      {showGame ? (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">
            Từ vựng: {gameWords[currentWordIndex]?.word?.wordText || "N/A"}
          </h4>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => {
              //console.log("Input changed, new value:", e.target.value);
              setUserAnswer(e.target.value);
            }}
            placeholder="Nhập nghĩa của từ..."
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 text-gray-900 placeholder-gray-400 transition duration-200 mb-4"
            disabled={showResult}
          />
          {!showResult ? (
            <button
              onClick={() => {
                //console.log("Xem kết quả button clicked");
                handleCheckResult();
              }}
              className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 transition duration-200 font-medium"
            >
              Xem kết quả
            </button>
          ) : (
            <div
              className={`p-6 rounded-lg shadow-sm ${
                isCorrect ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <p className="text-lg font-semibold text-gray-800">
                {isCorrect ? "Đúng!" : "Sai!"}
              </p>
              <p className="text-gray-600">
                Từ: {gameWords[currentWordIndex]?.word?.wordText || "N/A"}
              </p>
              <p className="text-gray-600">
                Nghĩa đúng: {gameWords[currentWordIndex]?.word?.mean || "N/A"}
              </p>
              <button
                onClick={handleContinue}
                className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 transition duration-200 font-medium mt-4"
              >
                Tiếp tục
              </button>
            </div>
          )}
          <p className="mt-4 text-gray-600">
            Điểm: {score}/{gameWords.length}
          </p>
        </div>
      ) : (
        <>
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-center shadow-sm">
              {error}
            </div>
          )}
          {loading && (
            <div className="text-gray-600 text-center py-6">Đang tải...</div>
          )}
          {!loading && filteredWords.length === 0 && !error && (
            <div className="text-gray-600 text-center py-6">
              {searchQuery
                ? "Không tìm thấy từ vựng phù hợp."
                : "Chưa có từ vựng nào được đánh dấu là đã học."}
            </div>
          )}
          {!loading && filteredWords.length > 0 && (
            <div className="space-y-4">
              {filteredWords.map((word) => {
                const nextReview = word.nextReview
                  ? new Date(word.nextReview)
                  : null;
                const isDue = nextReview && nextReview <= new Date();
                return (
                  <div
                    key={word.wordId}
                    className={`p-6 rounded-xl shadow-sm transition duration-300 ${
                      isDue ? "bg-yellow-50" : "bg-white"
                    } hover:shadow-md`}
                  >
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                      {word.word?.wordText || "N/A"}
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
                      <p className="text-red-600 font-semibold mt-2">
                        Đã đến lúc ôn tập!
                      </p>
                    )}
                    <button
                      onClick={() => startGame(word.wordId)}
                      className="text-blue-700 hover:text-blue-800 underline mt-3 inline-block transition duration-200"
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
