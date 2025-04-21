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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-20 px-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-gray-800 bg-white px-6 py-3 rounded-lg shadow-sm mb-6">
            Danh sách khóa học
          </h2>
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-center shadow-sm w-full">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {courses.map((course) => (
              <div
                key={course.courseId}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300 border border-gray-100"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <Link
                  to={`/courses/${course.courseId}`}
                  className="inline-block bg-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 transition duration-200"
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
