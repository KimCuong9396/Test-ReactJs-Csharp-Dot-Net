import React, { useState, useEffect } from "react";
import { getDueWords, reviewWord } from "../services/api";

const ProgressList = () => {
  const [dueWords, setDueWords] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDueWords = async () => {
      try {
        const response = await getDueWords();
        setDueWords(response.data);
      } catch (err) {
        setError("Failed to load due words");
      }
    };
    fetchDueWords();
  }, []);

  const handleReview = async (progressId) => {
    try {
      await reviewWord(progressId);
      setDueWords(dueWords.filter((dw) => dw.progressId !== progressId));
      alert("Word reviewed!");
    } catch (err) {
      setError("Failed to review word");
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-primary mb-4">
        Words to Review (Golden Time)
      </h3>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
      )}
      <div className="space-y-4">
        {dueWords.map((progress) => (
          <div
            key={progress.progressId}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h4 className="text-lg font-semibold text-gray-800">
              {progress.word.wordText}
            </h4>
            <div className="text-gray-600 mt-2">
              {progress.word.translations?.map((t) => (
                <p key={t.translationId}>
                  <strong>{t.language}:</strong> {t.meaning}
                </p>
              ))}
              <p>Memory Level: {progress.memoryLevel}</p>
              <p>Status: {progress.status}</p>
            </div>
            <button
              onClick={() => handleReview(progress.progressId)}
              className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Mark as Reviewed
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressList;
