import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpenIcon,
  StarIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/solid";

const Home = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      title: "Interactive Lessons",
      description: "Learn vocabulary through engaging flashcards and quizzes.",
      icon: <BookOpenIcon className="w-12 h-12 text-blue-700" />,
    },
    {
      title: "Daily Challenges",
      description: "Practice new words every day to build your skills.",
      icon: <StarIcon className="w-12 h-12 text-blue-700" />,
    },
    {
      title: "Global Community",
      description: "Connect with learners worldwide and share your progress.",
      icon: <GlobeAltIcon className="w-12 h-12 text-blue-700" />,
    },
  ];

  const testimonials = [
    {
      name: "Anna Tran",
      quote: "This platform made learning vocabulary so fun and effective!",
      role: "IELTS Student",
    },
    {
      name: "John Smith",
      quote: "The daily challenges helped me improve my English quickly.",
      role: "Language Learner",
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-white flex flex-col items-center justify-center text-center py-30 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
            Master English Vocabulary with Ease
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of learners worldwide to improve your English
            vocabulary through interactive lessons, daily challenges, and a
            supportive community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-blue-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-800 focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 transition duration-300"
            >
              Start Learning Now
            </Link>
            <Link
              to="/about"
              className="border-2 border-blue-700 text-blue-700 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300 ${
                  hoveredCard === index ? "scale-105" : ""
                }`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            What Our Learners Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl shadow-sm">
                <p className="text-gray-600 italic mb-4">
                  "{testimonial.quote}"
                </p>
                <p className="text-gray-800 font-semibold">
                  {testimonial.name}
                </p>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-700 py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Boost Your English?
          </h2>
          <p className="text-lg text-white mb-8 max-w-2xl mx-auto">
            Sign up today to access our interactive courses and start your
            journey to fluency.
          </p>
          <Link
            to="/register"
            className="bg-white text-blue-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700 transition duration-300"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-8 px-4 text-center text-white">
        <p className="text-sm">
          &copy; 2025 Vocabulary Master. All rights reserved.
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <Link to="/about" className="text-gray-300 hover:text-white">
            About
          </Link>
          <Link to="/contact" className="text-gray-300 hover:text-white">
            Contact
          </Link>
          <Link to="/privacy" className="text-gray-300 hover:text-white">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
