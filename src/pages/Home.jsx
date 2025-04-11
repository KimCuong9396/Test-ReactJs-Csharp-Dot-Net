import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-5xl font-bold text-primary mb-4 animate-bounce">
        Welcome to Vocabulary App
      </h1>
      <p className="text-xl text-gray-700 mb-6 max-w-2xl">
        Learn English vocabulary with fun, interactive lessons and games! Boost
        your skills and master new words every day.
      </p>
      <div className="flex space-x-4 mb-8">
        <Link
          to="/register"
          className="bg-secondary text-primary px-6 py-3 rounded-full font-semibold hover:bg-yellow-400 transition"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition"
        >
          Login
        </Link>
      </div>
      <img
        src="https://via.placeholder.com/400x300?text=Learn+with+Fun"
        alt="Learn with Fun"
        className="rounded-lg shadow-lg max-w-full h-auto"
      />
    </div>
  );
};

export default Home;
