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
        setLessons(response.data.$values);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load lessons");
      }
    };
    fetchLessons();
  }, [courseId]);

  return (
    <div className="flex justify-center min-h-screen">
      <div className="w-full max-w-4xl px-4">
        <div className="relative flex justify-center">
          <h2 className="w-120 h-10 pr-[26px] pl-2.5 absolute z-10 flex items-center justify-center text-black text-center text-xl font-bold leading-none rounded-[10px] bg-[#ffcb09] shadow-[4px_6px_10px_rgba(255,150,0,0.25)] mb-100">
            Danh sách bài học
          </h2>
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-5 w-150 h-10 p-20 ">
            {lessons.map((lesson) => (
              <div
                key={lesson.lessonId}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition bg-amber-200 text-primary px-4 py-2 rounded hover:bg-yellow-300"
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  {lesson.title}
                </h3>
                <p className="text-gray-600 mt-2">{lesson.description}</p>
                <Link
                  to={`/lessons/${lesson.lessonId}`}
                  className="mt-4 inline-block bg-secondary text-primary px-4 py-2 rounded hover:bg-yellow-500"
                >
                  View word
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
