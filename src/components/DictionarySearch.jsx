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
    } catch (err) {
      setError(err.response?.data?.message || "Search failed");
    }
  };

  return (
    <div className="mt-8">
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
        <div className="space-y-4">
          {results.map((word) => (
            <div
              key={word.wordId}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <h5 className="text-lg font-semibold text-gray-800">
                {word.wordText}
              </h5>
              <div className="text-gray-600 mt-2">
                {word.translations?.map((t) => (
                  <p key={t.translationId}>
                    <strong>{t.language}:</strong> {t.meaning}
                  </p>
                ))}
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
