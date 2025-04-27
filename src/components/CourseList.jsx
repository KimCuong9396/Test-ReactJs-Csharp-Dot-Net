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

  // Màu sắc cho từng bước trong lộ trình
  const colors = [
    "bg-green-500",
    "bg-orange-500",
    "bg-blue-500",
    "bg-yellow-500",
    "bg-purple-500",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section: Illustration Placeholder */}
          <div className="lg:w-1/3 flex justify-center items-center">
            <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Hình minh họa</span>
            </div>
          </div>

          {/* Right Section: Roadmap */}
          <div className="lg:w-2/3">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900">
                Lộ trình khóa học
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Theo dõi lộ trình học tập để nâng cao kỹ năng tiếng Anh của bạn.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-8">
                {error}
              </div>
            )}

            {/* Roadmap */}
            <div className="relative">
              {/* Đường dẫn (path) */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 600 400"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M50 50 Q150 50 150 150 Q150 250 300 250 Q450 250 450 150 Q450 50 550 50"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="4"
                    strokeDasharray="8,8"
                  />
                </svg>
              </div>

              {/* Các bước trong lộ trình */}
              <div className="relative flex flex-wrap justify-between items-center h-[400px]">
                {courses.map((course, index) => (
                  <div
                    key={course.courseId}
                    className="flex flex-col items-center z-10"
                  >
                    {/* Vòng tròn đại diện cho bước */}
                    <Link
                      to={`/courses/${course.courseId}`}
                      className={`w-24 h-24 rounded-full ${
                        colors[index % colors.length]
                      } flex items-center justify-center text-white font-semibold text-lg shadow-md hover:shadow-lg transition-shadow duration-300`}
                    >
                      {course.title.slice(0, 2)}
                    </Link>
                    {/* Tiêu đề bước */}
                    <h3 className="mt-4 text-lg font-semibold text-gray-800 text-center">
                      {course.title}
                    </h3>
                    {/* Mô tả ngắn */}
                    <p className="mt-2 text-sm text-gray-600 text-center">
                      {course.description.slice(0, 50)}...
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseList;
