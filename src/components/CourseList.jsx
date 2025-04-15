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
        //console.log("API Response:", response.data); // Debug log
        setCourses(response.data.$values || []); // Use $values, fallback to empty array
      } catch (err) {
        setError("Failed to load courses");
      }
    };
    fetchCourses();
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold text-primary mb-6">Courses</h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.courseId}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold text-gray-800">
              {course.title}
            </h3>
            <p className="text-gray-600 mt-2">{course.description}</p>
            <Link
              to={`/courses/${course.courseId}`}
              className="mt-4 inline-block bg-secondary text-primary px-4 py-2 rounded hover:bg-yellow-400"
            >
              View Lessons
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
