import React, { useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const vocabCards = [
    { word: "Serendipity", meaning: "Finding something valuable unexpectedly" },
    { word: "Ephemeral", meaning: "Lasting for a very short time" },
    { word: "Ebullient", meaning: "Overflowing with enthusiasm" },
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 min-h-screen flex flex-col items-center justify-center text-center relative -mx-6 -mt-6">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="w-96 h-96 bg-white rounded-full absolute -top-48 -left-48 animate-pulse"></div>
        <div className="w-72 h-72 bg-yellow-300 rounded-full absolute bottom-0 right-0 animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center w-full pt-16 pb-10 px-4 mt-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 md:mb-6 animate-fade-in-down drop-shadow-lg">
          Master Vocabulary with Fun!
        </h1>
        <p className="text-lg md:text-xl text-white mb-6 md:mb-8 max-w-2xl animate-fade-in-up">
          Discover a new way to learn English vocabulary through interactive
          lessons, games, and daily challenges.
        </p>

        {/* Vocabulary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-10 z-10 w-full max-w-6xl">
          {vocabCards.map((card, index) => (
            <div
              key={index}
              className={`bg-white bg-opacity-90 p-4 md:p-6 rounded-xl shadow-lg transform transition-all duration-300 ${
                hoveredCard === index ? "scale-105 rotate-2" : "scale-100"
              }`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <h3 className="text-xl md:text-2xl font-bold text-indigo-600">
                {card.word}
              </h3>
              <p className="text-gray-600">{card.meaning}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row gap-4 sm:space-x-4 z-10 w-full sm:w-auto justify-center">
          <Link
            to="/register"
            className="bg-yellow-400 text-indigo-900 px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-lg hover:bg-yellow-500 hover:scale-110 transition-all duration-300 shadow-xl"
          >
            Start Learning Now
          </Link>
          <Link
            to="/about"
            className="border-2 border-white text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-lg hover:bg-white hover:text-indigo-900 transition-all duration-300"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
