import React, { useState, useEffect } from "react";
import { getQuizzes } from "../services/api";

const QuizList = ({ lessonId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await getQuizzes(lessonId);
        setQuizzes(response.data);
      } catch (err) {
        setError("Failed to load quizzes");
      }
    };
    fetchQuizzes();
  }, [lessonId]);

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-primary mb-4">Quizzes</h3>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
      )}
      <div className="space-y-4">
        {quizzes.map((quiz) => (
          <div
            key={quiz.quizId}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h4 className="text-lg font-semibold text-gray-800">
              {quiz.title}
            </h4>
            <p className="text-gray-600 mt-2">{quiz.description}</p>
            <button className="mt-2 bg-primary text-white px-3 py-1 rounded hover:bg-indigo-700">
              Take Quiz
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizList;
