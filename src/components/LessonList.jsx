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
        setLessons(response.data.$values || []);
      } catch (err) {
        setError("Failed to load lessons");
      }
    };
    fetchLessons();
  }, [courseId]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-bold text-gray-800 bg-white px-6 py-3 rounded-lg shadow-sm mb-8">
            Danh sách bài học
          </h2>
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-center shadow-sm w-full">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {lessons.map((lesson) => (
              <div
                key={lesson.lessonId}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300 border border-gray-100"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {lesson.title}
                </h3>
                <p className="text-gray-600 mb-4">{lesson.description}</p>
                <Link
                  to={`/lessons/${lesson.lessonId}`}
                  className="inline-block bg-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 transition duration-200"
                >
                  View Word
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonList;
