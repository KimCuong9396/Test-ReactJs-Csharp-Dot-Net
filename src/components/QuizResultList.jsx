import React, { useState, useEffect } from "react";
import { getQuizResults } from "../services/api";

const QuizResultList = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await getQuizResults();
        setResults(response.data);
      } catch (err) {
        setError("Failed to load quiz results");
      }
    };
    fetchResults();
  }, []);

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-primary mb-4">Quiz Results</h3>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
      )}
      <div className="space-y-4">
        {results.map((result) => (
          <div
            key={result.resultId}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h4 className="text-lg font-semibold text-gray-800">
              {result.quiz.title}
            </h4>
            <p className="text-gray-600 mt-2">
              Score: {result.score}
              <br />
              Completed: {new Date(result.completedAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizResultList;
