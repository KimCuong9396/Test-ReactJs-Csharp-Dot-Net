import React, { useState } from "react";
import { SpeakerWaveIcon } from "@heroicons/react/24/solid";
import { FaHeart } from "react-icons/fa";

const Flashcard = ({ word, onNext, onSpeak, onAddFavorite, onLearned }) => {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-full max-w-sm h-80 perspective-[1000px]">
          <div
            className={`relative w-full h-full transition-transform duration-500 ease-in-out [transform-style:preserve-3d] hover:shadow-md border border-gray-100 rounded-xl flashcard-container ${
              flipped ? "rotate-y-180" : ""
            }`}
            onClick={handleFlip}
          >
            {/* Mặt trước */}
            <div className="absolute w-full h-full bg-white rounded-xl shadow-sm flex flex-col items-center justify-center p-6 [backface-visibility:hidden]">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {word.wordText}
              </h2>
              <p className="text-base text-gray-600">{word.mean}</p>
              {word.pronunciation && (
                <p className="text-sm text-gray-500 mt-1">
                  {word.pronunciation}
                </p>
              )}
              {word.partOfSpeech && (
                <p className="text-sm text-gray-500 italic mt-1">
                  {word.partOfSpeech}
                </p>
              )}
              {word.audioUrl && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSpeak(word.wordText, word.audioUrl);
                  }}
                  className="mt-3 flex items-center text-blue-700 hover:text-blue-800 transition duration-200"
                >
                  <SpeakerWaveIcon className="w-5 h-5 mr-1" />
                  <span className="text-sm">Listen</span>
                </button>
              )}
            </div>
            {/* Mặt sau */}
            <div className="absolute w-full h-full bg-white rounded-xl shadow-sm flex flex-col justify-between items-start p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <div className="flex flex-col w-full">
                {word.imageUrl && (
                  <img
                    src={word.imageUrl}
                    alt={word.wordText}
                    className="w-full h-32 object-cover rounded-lg mb-4 animate-fadeIn"
                  />
                )}
                <p className="text-sm text-gray-600">
                  {word.example || "Không có ví dụ"}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddFavorite(word.wordId);
                }}
                className="mt-2 text-red-600 hover:text-red-700 p-2 rounded-lg transition duration-200"
                title="Thêm vào yêu thích"
              >
                <FaHeart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              setFlipped(false);
              onLearned(word.wordId);
            }}
            className="bg-blue-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 transition duration-200"
          >
            Đã thuộc
          </button>
          <button
            onClick={() => {
              setFlipped(false);
              onNext();
            }}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 transition duration-200"
          >
            Tiếp tục
          </button>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in forwards;
        }
      `}</style>
    </div>
  );
};

export default Flashcard;
