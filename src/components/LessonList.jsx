import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getLessons } from "../services/api";

const LessonList = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await getLessons(courseId);
        setLessons(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load lessons");
      }
    };
    fetchLessons();
  }, [courseId]);

  return (
    <div>
      <h2 className="text-3xl font-bold text-primary mb-6">Lessons</h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <div
            key={lesson.lessonId}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold text-gray-800">
              {lesson.title}
            </h3>
            <p className="text-gray-600 mt-2">{lesson.description}</p>
            <Link
              to={`/lessons/${lesson.lessonId}`}
              className="mt-4 inline-block bg-secondary text-primary px-4 py-2 rounded hover:bg-yellow-400"
            >
              View word
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonList;
