import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getWordsByLesson,
  addFavoriteWord,
  getUserProgress,
  updateUserProgress,
} from "../services/api";
import { SpeakerWaveIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";

const WordList = () => {
  const { lessonId } = useParams();
  const [words, setWords] = useState([]);
  const [progress, setProgress] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const wordsResponse = await getWordsByLesson(lessonId);
        setWords(wordsResponse.data);

        const progressResponse = await getUserProgress(lessonId);
        const progressMap = progressResponse.data.reduce((acc, p) => {
          acc[p.wordId] = p;
          return acc;
        }, {});
        setProgress(progressMap);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [lessonId]);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleSpeak = (wordText, audioUrl) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch((err) => console.error("Error playing audio:", err));
    } else {
      const utterance = new SpeechSynthesisUtterance(wordText);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAddFavorite = async (wordId) => {
    try {
      await addFavoriteWord({ wordId });
      toast.success("Added to favorites!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add favorite");
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
      toast.success("Progress updated!");
      handleNext();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update progress");
    }
  };

  const handleResetProgress = async (wordId) => {
    if (
      !window.confirm("Are you sure you want to reset progress for this word?")
    ) {
      return;
    }
    try {
      const resetProgress = {
        wordId,
        memoryLevel: 1,
        lastReviewed: null,
        nextReview: null,
        reviewCount: 0,
        status: "NotLearned",
      };

      const response = await updateUserProgress(resetProgress);
      setProgress((prev) => ({
        ...prev,
        [wordId]: response.data,
      }));
      toast.success("Progress reset!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset progress");
    }
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setAnimate(true);
      setTimeout(() => {
        setFlipped(false);
        setCurrentIndex((prev) => prev + 1);
        setAnimate(false);
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setAnimate(true);
      setTimeout(() => {
        setFlipped(false);
        setCurrentIndex((prev) => prev - 1);
        setAnimate(false);
      }, 300);
    }
  };

  const calculateNextReview = (memoryLevel) => {
    const now = new Date();
    const daysToAdd = memoryLevel === 1 ? 1 : memoryLevel === 2 ? 3 : 7;
    now.setDate(now.getDate() + daysToAdd);
    return now.toISOString();
  };

  const currentWord = words[currentIndex];

  return (
    <div className="mt-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-primary">
          Vocabulary Flashcards
        </h3>
        <Link
          to={`/lessons/${lessonId}/progress`}
          className="text-primary hover:text-indigo-700 underline"
        >
          View Progress
        </Link>
      </div>
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
      )}
      {loading && (
        <div className="text-gray-600 text-center">Loading flashcard...</div>
      )}
      {!loading && words.length === 0 && !error && (
        <div className="text-gray-600 text-center">
          No flashcards available for this lesson.
        </div>
      )}
      {!loading && words.length > 0 && (
        <div className="flex flex-col items-center">
          <div
            className={`perspective-1000 w-full max-w-md transition-all duration-300 ${
              animate ? "opacity-50 scale-95" : "opacity-100 scale-100"
            }`}
            onClick={handleFlip}
          >
            <div
              className={`relative w-full h-64 transition-transform duration-500 transform-style-preserve-3d ${
                flipped ? "rotate-y-180" : ""
              }`}
            >
              {/* Mặt trước flashcard */}
              <div className="absolute w-full h-full bg-white rounded-lg shadow-md flex flex-col items-center justify-center p-4 backface-hidden">
                <h4 className="text-2xl font-bold text-gray-800">
                  {currentWord.wordText}
                </h4>
                <p className="text-sm text-gray-500 mt-2">
                  Status: {progress[currentWord.wordId]?.status || "NotLearned"}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak(currentWord.wordText, currentWord.audioUrl);
                  }}
                  className="mt-4 flex items-center text-primary hover:text-indigo-700"
                >
                  <SpeakerWaveIcon className="w-6 h-6 mr-2" />
                  Speak
                </button>
              </div>
              {/* Mặt sau flashcard */}
              <div className="absolute w-full h-full bg-white rounded-lg shadow-md flex flex-col items-center justify-center p-4 backface-hidden rotate-y-180">
                <div className="text-center">
                  {currentWord.translations?.length > 0 ? (
                    currentWord.translations.map((t) => (
                      <p
                        key={t.translationId}
                        className="text-lg text-gray-600"
                      >
                        <strong>{t.language}:</strong> {t.meaning}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-600">No translations available</p>
                  )}
                  {currentWord.pronunciation && (
                    <p className="text-gray-600 mt-2">
                      /{currentWord.pronunciation}/
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddFavorite(currentWord.wordId);
                  }}
                  className="mt-4 bg-accent text-white px-4 py-2 rounded hover:bg-pink-500"
                >
                  Add to Favorites
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`px-6 py-2 rounded ${
                currentIndex === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-500 text-white hover:bg-gray-600"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => handleLearned(currentWord.wordId)}
              className="bg-primary text-white px-6 py-2 rounded hover:bg-indigo-700"
            >
              Mark as Learned
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === words.length - 1}
              className={`px-6 py-2 rounded ${
                currentIndex === words.length - 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-secondary text-primary hover:bg-yellow-400"
              }`}
            >
              Next
            </button>
            <button
              onClick={() => handleResetProgress(currentWord.wordId)}
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
            >
              Reset Progress
            </button>
          </div>
          <p className="mt-4 text-gray-600">
            Card {currentIndex + 1} of {words.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default WordList;
