import React, { useState, useEffect } from "react";
import {
  searchWords,
  getSearchHistory,
  deleteSearchHistory,
  deleteAllSearchHistory,
} from "../services/api";

const DictionarySearch = () => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  // Gọi API để lấy lịch sử tìm kiếm khi component mount
  useEffect(() => {
    const fetchSearchHistory = async () => {
      try {
        const historyResponse = await getSearchHistory();
        setHistory(historyResponse.data.$values);
        setError("");
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load search history"
        );
      }
    };

    fetchSearchHistory();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keyword) return;
    try {
      const response = await searchWords(keyword);
      setResults(response.data.$values);
      const historyResponse = await getSearchHistory();
      setHistory(historyResponse.data.$values);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Search failed");
    }
  };

  const reuseSearch = async (word) => {
    setKeyword(word);
    try {
      const response = await searchWords(word);
      setResults(response.data.$values);
      const historyResponse = await getSearchHistory();
      setHistory(historyResponse.data.$values);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Search failed");
    }
  };

  const deleteSearch = async (searchId) => {
    try {
      await deleteSearchHistory(searchId);
      setHistory(history.filter((search) => search.searchId !== searchId));
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete search history"
      );
    }
  };

  const deleteAllSearches = async () => {
    if (window.confirm("Are you sure you want to delete all search history?")) {
      try {
        await deleteAllSearchHistory();
        setHistory([]);
        setError("");
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to delete all search history"
        );
      }
    }
  };

  const playAudio = (audioUrl) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch((err) => console.error("Audio playback failed:", err));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 shadow-sm text-center">
            {error}
          </div>
        )}
        <form
          onSubmit={handleSearch}
          className="mb-8 flex flex-col sm:flex-row gap-4"
        >
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter keyword"
            className="flex-1 p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 text-gray-900 placeholder-gray-400 transition duration-200"
          />
          <button
            type="submit"
            className="bg-blue-700 text-white px-6 py-4 rounded-lg hover:bg-blue-800 focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 transition duration-200 font-medium"
          >
            Search
          </button>
        </form>
        <div>
          {results.length === 0 && (
            <p className="text-gray-500 italic text-center mb-6">
              No results found.
            </p>
          )}
          <div className="space-y-6">
            {results.map((word) => (
              <div
                key={word.wordId}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300 border border-gray-100"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  {word.imageUrl && (
                    <img
                      src={word.imageUrl}
                      alt={word.wordText}
                      className="w-32 h-32 object-cover rounded-lg"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  )}
                  <div className="flex-1">
                    <h5 className="text-xl font-semibold text-gray-900 mb-3">
                      {word.wordText}
                    </h5>
                    <div className="space-y-2 text-gray-600">
                      {word.pronunciation && (
                        <p>
                          <strong>Pronunciation:</strong> {word.pronunciation}
                        </p>
                      )}
                      {word.partOfSpeech && (
                        <p>
                          <strong>Part of Speech:</strong> {word.partOfSpeech}
                        </p>
                      )}
                      {word.level && (
                        <p>
                          <strong>Level:</strong> {word.level}
                        </p>
                      )}
                      {word.translations?.length > 0 && (
                        <div className="mt-4">
                          <strong>Translations:</strong>
                          {word.translations.map((t) => (
                            <p key={t.translationId} className="ml-4">
                              - {t.language}: {t.meaning}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                    {word.audioUrl && (
                      <button
                        onClick={() => playAudio(word.audioUrl)}
                        className="mt-4 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 flex items-center space-x-2 transition duration-200"
                      >
                        <svg
                          className="w-4 h-4"
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
                        <span>Play Audio</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xl font-semibold text-gray-800">
              Search History
            </h4>
            {history.length > 0 && (
              <button
                onClick={deleteAllSearches}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 transition duration-200 font-medium"
              >
                Clear All History
              </button>
            )}
          </div>
          <div className="space-y-3">
            {history.map((search) => (
              <div
                key={search.searchId}
                className="flex items-center justify-between text-gray-600 py-3 border-b border-gray-200 last:border-b-0"
              >
                <div>
                  {search.word} - {new Date(search.searchTime).toLocaleString()}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => reuseSearch(search.word)}
                    className="text-blue-700 hover:text-blue-800 transition duration-200"
                    title="Reuse this search"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9H9m6 4H9.582a8.001 8.001 0 0010.836-2H20v5"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteSearch(search.searchId)}
                    className="text-red-600 hover:text-red-800 transition duration-200"
                    title="Delete this search"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DictionarySearch;
