import React, { useState, useEffect } from "react";
import { getLesson, addFavoriteWord } from "../services/api";

const WordList = ({ lessonId }) => {
  const [words, setWords] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await getLesson(lessonId);
        setWords(response.data.lessonWords.map((lw) => lw.word));
      } catch (err) {
        setError("Failed to load words");
      }
    };
    fetchWords();
  }, [lessonId]);

  const handleAddFavorite = async (wordId) => {
    try {
      await addFavoriteWord({ wordId });
      alert("Added to favorites");
    } catch (err) {
      setError("Failed to add favorite");
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-primary mb-4">Words</h3>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
      )}
      <div className="space-y-4">
        {words.map((word) => (
          <div
            key={word.wordId}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h4 className="text-lg font-semibold text-gray-800">
              {word.wordText}
            </h4>
            <div className="text-gray-600 mt-2">
              {word.translations?.map((t) => (
                <p key={t.translationId}>
                  <strong>{t.language}:</strong> {t.meaning}
                </p>
              ))}
            </div>
            <button
              onClick={() => handleAddFavorite(word.wordId)}
              className="mt-2 bg-accent text-white px-3 py-1 rounded hover:bg-pink-500"
            >
              Add to Favorites
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordList;
