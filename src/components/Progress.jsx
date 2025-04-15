import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUserProgress } from "../services/api";

const Progress = () => {
  const { lessonId } = useParams();
  const [progressList, setProgressList] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("memoryLevel");

  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getUserProgress(lessonId);
        setProgressList(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load progress");
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [lessonId]);
  // Lọc theo status
  const filteredProgress =
    filterStatus === "All"
      ? progressList
      : progressList.filter((p) => p.status === filterStatus);

  // Sắp xếp
  const sortedProgress = [...filteredProgress].sort((a, b) => {
    if (sortBy === "memoryLevel") {
      return b.memoryLevel - a.memoryLevel;
    } else if (sortBy === "nextReview") {
      return (a.nextReview || "9999-12-31") > (b.nextReview || "9999-12-31")
        ? 1
        : -1;
    }
    return 0;
  });

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString("en-GB") : "-";
  };

  return (
    <div className="mt-8 max-w-4xl mx-auto p-4">
      <h3 className="text-2xl font-bold text-primary mb-6 text-center">
        Learning Progress
      </h3>
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
      )}
      {loading && (
        <div className="text-gray-600 text-center">Loading progress...</div>
      )}
      {!loading && progressList.length === 0 && !error && (
        <div className="text-gray-600 text-center">
          No progress available for this lesson.
        </div>
      )}
      {!loading && progressList.length > 0 && (
        <div className="flex flex-col gap-4">
          {/* Bộ lọc và sắp xếp */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <label className="text-gray-700">Filter by Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border rounded p-2 bg-white"
              >
                <option value="All">All</option>
                <option value="Learned">Learned</option>
                <option value="NotLearned">NotLearned</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded p-2 bg-white"
              >
                <option value="memoryLevel">Memory Level (High to Low)</option>
                <option value="nextReview">Next Review (Soonest First)</option>
              </select>
            </div>
          </div>
          {/* Danh sách tiến trình */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedProgress.map((progress) => (
              <div
                key={progress.wordId}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-2"
              >
                <h4 className="text-lg font-bold text-gray-800">
                  {progress.word?.wordText || "Unknown"}
                </h4>
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong> {progress.status}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Memory Level:</strong> {progress.memoryLevel}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Last Reviewed:</strong>{" "}
                  {formatDate(progress.lastReviewed)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Next Review:</strong>{" "}
                  {formatDate(progress.nextReview)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Review Count:</strong> {progress.reviewCount}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;
