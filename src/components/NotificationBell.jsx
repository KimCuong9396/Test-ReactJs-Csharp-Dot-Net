import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProgressContext } from "../context/ProgressContext";
import { AuthContext } from "../context/AuthContext";

const NotificationBell = () => {
  const { learnedWords } = useContext(ProgressContext);
  const { token } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dueWords, setDueWords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setDueWords([]);
      return;
    }
    const checkDueWords = () => {
      const now = new Date();
      const due = learnedWords.filter(
        (word) => word.nextReview && new Date(word.nextReview) <= now
      );
      setDueWords(due);
    };
    checkDueWords();
    const interval = setInterval(checkDueWords, 60000);
    return () => clearInterval(interval);
  }, [learnedWords, token]);

  const handleNotificationClick = (wordId) => {
    setIsDropdownOpen(false);
    navigate(`/revise?wordId=${wordId}`);
  };

  if (!token) {
    return null; // Don't render bell if not authenticated
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="text-white px-4 py-2 rounded-full hover:bg-indigo-700 hover:bg-opacity-70 transition-all duration-300 focus:outline-none"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {dueWords.length > 0 && (
          <span className="absolute top-0 right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {dueWords.length}
          </span>
        )}
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-blue-900 rounded-lg shadow-lg py-2 z-50 animate-fade-in-down">
          {dueWords.length === 0 ? (
            <p className="text-white px-4 py-2">
              Không có từ vựng nào cần ôn tập.
            </p>
          ) : (
            dueWords.map((word) => (
              <Link
                key={word.wordId}
                to={`/revise?wordId=${word.wordId}`}
                onClick={() => handleNotificationClick(word.wordId)}
                className="block w-full text-left text-white px-4 py-2 hover:bg-yellow-500 hover:text-indigo-900 transition-all duration-300"
              >
                Ôn tập: {word.word.wordText}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
