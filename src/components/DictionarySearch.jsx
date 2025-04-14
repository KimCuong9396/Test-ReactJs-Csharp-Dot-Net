import React, { useState } from "react";
import { searchWords, getSearchHistory } from "../services/api";

const DictionarySearch = () => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keyword) return;
    try {
      const response = await searchWords(keyword);
      setResults(response.data);
      const historyResponse = await getSearchHistory();
      setHistory(historyResponse.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Search failed");
    }
  };

  // Hàm phát âm thanh
  const playAudio = (audioUrl) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch((err) => console.error("Audio playback failed:", err));
    }
  };

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-primary mb-4">
        Dictionary Search
      </h3>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
      )}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex space-x-2">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter keyword"
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Search
          </button>
        </div>
      </form>
      <div>
        <h4 className="text-xl font-semibold text-gray-800 mb-2">Results</h4>
        {results.length === 0 && (
          <p className="text-gray-500">No results found.</p>
        )}
        <div className="space-y-4">
          {results.map((word) => (
            <div
              key={word.wordId}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Hình ảnh (nếu có) */}
                {word.imageUrl && (
                  <img
                    src={word.imageUrl}
                    alt={word.wordText}
                    className="w-32 h-32 object-cover rounded-md"
                    onError={(e) => (e.target.style.display = "none")} // Ẩn nếu lỗi tải ảnh
                  />
                )}
                <div className="flex-1">
                  <h5 className="text-lg font-semibold text-gray-800">
                    {word.wordText}
                  </h5>
                  {word.pronunciation && (
                    <p className="text-gray-600">
                      <strong>Pronunciation:</strong> {word.pronunciation}
                    </p>
                  )}
                  {word.partOfSpeech && (
                    <p className="text-gray-600">
                      <strong>Part of Speech:</strong> {word.partOfSpeech}
                    </p>
                  )}
                  {word.level && (
                    <p className="text-gray-600">
                      <strong>Level:</strong> {word.level}
                    </p>
                  )}
                  {word.translations?.length > 0 && (
                    <div className="text-gray-600 mt-2">
                      <strong>Translations:</strong>
                      {word.translations.map((t) => (
                        <p key={t.translationId} className="ml-2">
                          - {t.language}: {t.meaning}
                        </p>
                      ))}
                    </div>
                  )}
                  {word.audioUrl && (
                    <button
                      onClick={() => playAudio(word.audioUrl)}
                      className="mt-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-200 flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707a1 1 0 011.414 0l8 8a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0L5.586 17z"
                        />
                      </svg>
                      Play Audio
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <h4 className="text-xl font-semibold text-gray-800 mb-2">
          Search History
        </h4>
        <div className="space-y-2">
          {history.map((search) => (
            <div key={search.searchId} className="text-gray-600">
              {search.word} - {new Date(search.searchTime).toLocaleString()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DictionarySearch;
