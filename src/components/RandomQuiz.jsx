import React, { useState } from "react";
import { createRandomQuiz } from "../services/api";

const RandomQuiz = () => {
  const [formData, setFormData] = useState({
    questionCount: 5,
    quizType: "MultipleChoice",
  });
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createRandomQuiz(formData);
      setQuiz(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create quiz");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-primary mb-4">
        Create Random Quiz
      </h3>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">
            Number of Questions
          </label>
          <input
            type="number"
            name="questionCount"
            value={formData.questionCount}
            onChange={handleChange}
            min="1"
            max="50"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Quiz Type</label>
          <select
            name="quizType"
            value={formData.quizType}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="MultipleChoice">Multiple Choice</option>
            <option value="Flashcard">Flashcard</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded hover:bg-indigo-700"
        >
          Create Quiz
        </button>
      </form>
      {quiz && (
        <div>
          <h4 className="text-xl font-semibold text-gray-800 mb-4">
            {quiz.title}
          </h4>
          <div className="space-y-4">
            {quiz.words.map((word) => (
              <div
                key={word.wordId}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <h5 className="text-lg font-semibold text-gray-800">
                  {word.wordText}
                </h5>
                <div className="text-gray-600 mt-2">
                  {word.translations.map((t) => (
                    <p key={t.language}>
                      <strong>{t.language}:</strong> {t.meaning}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RandomQuiz;
