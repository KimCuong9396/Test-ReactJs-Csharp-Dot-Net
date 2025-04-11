import React, { useState, useEffect } from "react";
import { getStatistics } from "../services/api";

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getStatistics();
        setStats(response.data);
      } catch (err) {
        setError("Failed to load statistics");
      }
    };
    fetchStats();
  }, []);

  if (!stats) return null;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-primary mb-4">
        Learning Statistics
      </h3>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
      )}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">
          Your Progress
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p className="text-gray-600">
            Total Words Learned:{" "}
            <span className="font-bold">{stats.totalWordsLearned}</span>
          </p>
          <p className="text-gray-600">
            Mastered Words:{" "}
            <span className="font-bold">{stats.masteredWords}</span>
          </p>
          <p className="text-gray-600">
            Mastery Rate:{" "}
            <span className="font-bold">{stats.masteryRate}%</span>
          </p>
          <p className="text-gray-600">
            Words Due Today:{" "}
            <span className="font-bold">{stats.wordsDueToday}</span>
          </p>
          <p className="text-gray-600">
            Quizzes Completed:{" "}
            <span className="font-bold">{stats.quizzesCompleted}</span>
          </p>
          <p className="text-gray-600">
            Average Quiz Score:{" "}
            <span className="font-bold">{stats.averageQuizScore}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
