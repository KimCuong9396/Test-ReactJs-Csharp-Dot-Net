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
    <div className="flex justify-center min-h-screen">
      <div className="w-full max-w-4xl px-4">
        <div className="relative flex justify-center">
          <h2 className="w-120 h-10 pr-[26px] pl-2.5 absolute z-10 flex items-center justify-center text-black text-center text-xl font-bold leading-none rounded-[10px] bg-[#ffcb09] shadow-[4px_6px_10px_rgba(255,150,0,0.25)] mb-100">
            Danh sách khóa học
          </h2>
          <div className="h-50"></div> {/* Khoảng cách 40px */}
          {error && (
            <div className="bg-red-100 text-red-700 p-5 rounded mb-4">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-5 w-150 h-10 p-20 ">
            {courses.map((course) => (
              <div
                key={course.courseId}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition bg-amber-200 text-primary px-4 py-2 rounded hover:bg-yellow-300"
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  {course.title}
                </h3>
                <p className="text-gray-600 mt-2">{course.description}</p>
                <Link
                  to={`/courses/${course.courseId}`}
                  className="mt-4 inline-block bg-amber-50 text-primary px-4 py-2 rounded hover:bg-yellow-500"
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
