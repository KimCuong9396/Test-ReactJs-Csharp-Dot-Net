import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-900 to-blue-600 text-white py-20">
        {/* Wave Background */}
        <div className="absolute inset-0 overflow-hidden">
          <svg
            className="absolute bottom-0 w-full"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="#60a5fa"
              fillOpacity="1"
              d="M0,128L48,138.7C96,149,192,171,288,176C384,181,480,171,576,149.3C672,128,768,96,864,106.7C960,117,1056,171,1152,181.3C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>

        <div className="relative container mx-auto px-4 max-w-screen-xl text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8">
            Join the Vocabulary Bowl
          </h1>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="bg-blue-700 rounded-full p-6 shadow-lg">
              <p className="text-2xl font-bold">424,796,907</p>
              <p className="text-sm">Words mastered</p>
            </div>
            <Link
              to="/vocabulary-bowl"
              className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-blue-600 transition-colors"
            >
              Get involved
            </Link>
            <div className="bg-blue-700 rounded-full p-6 shadow-lg">
              <p className="text-2xl font-bold">2,529,600</p>
              <p className="text-sm">Jams played</p>
            </div>
          </div>
          <div className="bg-blue-700 rounded-full p-6 shadow-lg mx-auto max-w-xs">
            <p className="text-2xl font-bold">9,128,612,631</p>
            <p className="text-sm">Questions answered</p>
          </div>
          <Link
            to="/register"
            className="bg-blue-500 text-white font-semibold px-8 py-3 rounded-full hover:bg-blue-600 transition-colors"
          >
            Get started
          </Link>
        </div>
      </section>

      {/* Video Introduction Section */}
      <section>
        {/* Video Introduction Section */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Discover VocabMaster
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Watch our introduction video to learn how VocabMaster helps you
            improve your vocabulary effortlessly.
          </p>
          <div className="relative w-full max-w-3xl mx-auto">
            <iframe
              className="w-full h-64 md:h-96 rounded-lg shadow-lg"
              src="https://www.youtube.com/embed/kvWCVCzk8e4?si=thNEzQrho0SzNRZm" // Replace with your YouTube video embed URL
              title="VocabMaster Introduction Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      <section className="bg-white text-gray-900 py-16">
        <div className="container mx-auto px-4 max-w-screen-xl">
          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 text-center">
            Look up a word, learn it forever.
          </h2>

          {/* Search Bar */}
          <div className="flex justify-center mb-6">
            <div className="relative w-full max-w-lg">
              <input
                type="text"
                placeholder="Please add words"
                className="w-full p-4 pr-32 rounded-full text-gray-800 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-blue-700 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span>Word Finder</span>
              </button>
            </div>
          </div>

          {/* Subtitle */}
          <h3 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            I am looking for...
          </h3>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-blue-100 text-blue-900 px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-200 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
              A dictionary for learning
            </button>
            <button className="bg-blue-100 text-blue-900 px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-200 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
              A scientific and fun way to improve vocabulary
            </button>
            <button className="bg-blue-100 text-blue-900 px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-200 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
              A better way to teach words
            </button>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="bg-white text-black py-16">
        <div className="container mx-auto px-4 max-w-screen-xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">
            Success Stories
          </h2>
          <p className="text-center text-lg mb-8">
            Teachers and learners are doing amazing things with VocabMaster
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full">
              All testimonials
            </button>
            <button className="bg-blue-900 text-white px-4 py-2 rounded-full">
              Administrators
            </button>
            <button className="bg-blue-900 text-white px-4 py-2 rounded-full">
              Teachers
            </button>
            <button className="bg-blue-900 text-white px-4 py-2 rounded-full">
              Learners
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Testimonial 1 */}
            <div className="bg-blue-200 text-gray-800 p-6 rounded-xl shadow-lg">
              <p className="text-lg italic mb-4">
                "We have fun, they are learning, and in turn their writing is
                enhanced with the new vocabulary they have been practicing.
                Everyone benefits from this well-rounded digital learning
                program."
              </p>
              <p className="text-sm font-semibold text-blue-600">
                Elementary school language arts teacher
              </p>
              <p className="text-sm text-gray-600">Pearce, AZ</p>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-blue-100 text-gray-800 p-6 rounded-xl shadow-lg">
              <p className="text-lg italic mb-4">
                "VocabMaster works through synonyms, antonyms, and sentence
                usage. It makes learning stick for life, not just regurgitate it
                for a test and then purge it from their memory."
              </p>
              <p className="text-sm font-semibold text-blue-600">
                High school English teacher
              </p>
              <p className="text-sm text-gray-600">Tucson, AZ</p>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-blue-300 text-gray-800 p-6 rounded-xl shadow-lg">
              <p className="text-lg italic mb-4">
                "We have seen an increase in the Vocabulary acquisition scores
                on the NWEA MAP testing. This has led to higher reading
                comprehension simply from understanding more words."
              </p>
              <p className="text-sm font-semibold text-blue-600">
                Middle school social studies teacher
              </p>
              <p className="text-sm text-gray-600">Tuckahoe, NY</p>
            </div>
          </div>
          <div className="text-center">
            <div className="flex justify-center gap-2 mb-4">
              <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
              <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
              <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
            </div>
            <Link
              to="/testimonials"
              className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
            >
              See more
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white relative">
        {/* Wave Transition (optional, if this section follows a colored section) */}
        <div className="absolute inset-x-0 top-0 h-32 overflow-hidden">
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="#2563eb"
              fillOpacity="1"
              d="M0,128L48,138.7C96,149,192,171,288,176C384,181,480,171,576,149.3C672,128,768,96,864,106.7C960,117,1056,171,1152,181.3C1248,192,1344,160,1392,144L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            />
          </svg>
        </div>

        <div className="container mx-auto px-4 max-w-screen-xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Learners */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <span className="text-blue-500 text-sm font-semibold mb-2 block">
                FOR LEARNERS
              </span>
              <h3 className="text-3xl font-extrabold text-gray-900 mb-4">
                A scientific and fun way to improve vocabulary
              </h3>
              <p className="text-gray-600 mb-4">
                Play games and compete in activities on your own or with
                participants from around the globe. With our advanced teaching
                algorithm and study tools, get ready for your vocabulary to
                expand!
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="text-blue-600 hover:underline flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Multiple-Meaning Words
                </span>
                <span className="text-blue-600 hover:underline flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m0-16l3.761.94c.159.04.322.06.485.06H15.263a2 2 0 011.789-1.106l3.5 7A2 2 0 0118.764 14H14"
                    />
                  </svg>
                  Words to Capture Tone
                </span>
                <span className="text-blue-600 hover:underline flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Vocabulary from Hamlet
                </span>
              </div>
              <Link
                to="/subscribe"
                className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors"
              >
                Subscribe now
              </Link>
            </div>

            {/* For Educators */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <span className="text-blue-600 text-sm font-semibold mb-2 block">
                FOR EDUCATORS
              </span>
              <h3 className="text-3xl font-extrabold text-gray-900 mb-4">
                A better way to teach words
              </h3>
              <p className="text-gray-600 mb-4">
                Engage your students with a fast-paced Vocab Jam, assign
                ready-made word lists for thousands of books and topics, and
                more!
              </p>
              {/* Placeholder for Illustration */}
              <div className="bg-blue-100 p-4 rounded-lg mb-4 flex justify-center">
                <svg
                  className="w-16 h-16 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div className="flex gap-4">
                <Link
                  to="/trial"
                  className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors"
                >
                  Start your free trial
                </Link>
                <Link
                  to="/educators"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (retained from previous version) */}
      <footer className="bg-blue-900 text-white py-6">
        <div className="container mx-auto px-4 max-w-screen-xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0">
              <span className="text-sm">
                Copyright © 2025 VocabMaster Inc. All Rights Reserved.
              </span>
              <a href="#" className="text-sm text-gray-300 hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-300 hover:text-white">
                Terms of Service
              </a>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.56c-.89.39-1.84.65-2.83.77 1.02-.61 1.8-1.58 2.17-2.73-.95.56-2 .97-3.12 1.19-.89-.95-2.17-1.54-3.58-1.54-2.71 0-4.91 2.2-4.91 4.91 0 .39.04.77.13 1.13-4.08-.2-7.7-2.16-10.12-5.14-.42.72-.66 1.56-.66 2.46 0 1.7.86 3.2 2.17 4.08-.8-.03-1.55-.24-2.21-.61v.06c0 2.38 1.69 4.36 3.94 4.81-.41.11-.85.17-1.3.17-.32 0-.63-.03-.94-.09.63 2 2.47 3.45 4.65 3.49-1.7 1.33-3.84 2.12-6.17 2.12-.4 0-.79-.02-1.18-.07 2.18 1.4 4.77 2.22 7.55 2.22 9.05 0 14-7.5 14-14 0-.21 0-.42-.01-.63.96-.69 1.79-1.56 2.45-2.55z" />
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.27c-.97 0-1.75-.79-1.75-1.73s.79-1.73 1.75-1.73 1.75.79 1.75 1.73-.79 1.73-1.75 1.73zm13.5 12.27h-3v-5.6c0-1.34-.48-2.25-1.68-2.25-.92 0-1.47.62-1.71 1.22-.09.21-.11.5-.11.79v5.84h-3v-11h3v1.55c.43-.67 1.2-1.62 2.92-1.62 2.14 0 3.58 1.4 3.58 4.41v6.66z" />
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.04c-5.52 0-10 4.48-10 10 0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.61-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48 3.97-1.32 6.84-5.07 6.84-9.49 0-5.52-4.48-10-10-10z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
