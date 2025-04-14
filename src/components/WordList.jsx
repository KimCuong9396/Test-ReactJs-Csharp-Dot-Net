import React, { useState, useEffect } from "react";
import { addFavoriteWord, getWordsByLesson } from "../services/api";
import { useParams } from "react-router-dom";

const WordList = () => {
  const { lessonId } = useParams();
  const [words, setWords] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchWords = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getWordsByLesson(lessonId);
        setWords(response.data); // Trực tiếp sử dụng response.data vì nó là danh sách Word
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load words");
      } finally {
        setLoading(false);
      }
    };
    fetchWords();
  }, [lessonId]);
  const handleAddFavorite = async (wordId) => {
    try {
      await addFavoriteWord({ wordId });
      alert("Added to favorites");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add favorite");
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-primary mb-4">Words</h3>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
      )}
      {loading && <div className="text-gray-600">Loading words...</div>}
      {!loading && words.length === 0 && !error && (
        <div className="text-gray-600">No words available for this lesson.</div>
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
              {word.translations?.length > 0 ? (
                word.translations.map((t) => (
                  <p key={t.translationId}>
                    <strong>{t.language}:</strong> {t.meaning}
                  </p>
                ))
              ) : (
                <p>No translations available</p>
              )}
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
