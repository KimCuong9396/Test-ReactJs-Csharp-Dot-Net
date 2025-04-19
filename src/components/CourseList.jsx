import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCourses } from "../services/api";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCourses();
        setCourses(response.data.$values || []);
      } catch (err) {
        setError("Failed to load courses");
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 bg-opacity-80 flex justify-center pt-16 p-0 m-0 box-border">
      <div className="w-full max-w-4xl mx-4 rounded-xl p-6">
        <div className="flex flex-col items-center">
          <h2 className="w-150 h-10 px-4 flex items-center justify-center text-indigo-900 text-center text-xl font-bold leading-none rounded-[10px] bg-[#ffcb09] shadow-[4px_6px_10px_rgba(255,150,0,0.25)] mb-6">
            Danh sách khóa học
          </h2>
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-3 w-150">
            {courses.map((course) => (
              <div
                key={course.courseId}
                className="bg-white bg-opacity-90 p-4 rounded-lg shadow-md hover:shadow-lg hover:bg-yellow-100 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-indigo-800">
                  {course.title}
                </h3>
                <p className="text-gray-600 mt-2">{course.description}</p>
                <Link
                  to={`/courses/${course.courseId}`}
                  className="mt-4 inline-block bg-yellow-200 text-indigo-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 hover:scale-105 transition-all duration-300"
                >
                  View Lessons
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseList;
