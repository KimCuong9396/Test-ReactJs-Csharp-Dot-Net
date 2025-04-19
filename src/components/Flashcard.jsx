import React, { useState } from "react";
import { SpeakerWaveIcon } from "@heroicons/react/24/solid";
import { FaHeart } from "react-icons/fa";

const Flashcard = ({ word, onNext, onSpeak, onAddFavorite, onLearned }) => {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <div className="w-full flex items-center justify-center p-0 m-0 box-border">
      <div className="flex flex-col items-center space-y-2">
        <div className="w-60 max-w-sm h-64 perspective-[1000px]">
          <div
            className={`relative w-full h-full transition-transform duration-500 ease-in-out [transform-style:preserve-3d] hover:scale-105 border border-gray-200 rounded-2xl flashcard-container ${
              flipped ? "rotate-y-180" : ""
            }`}
            onClick={handleFlip}
          >
            {/* Mặt trước */}
            <div className="absolute w-full h-full bg-gradient-to-br from-yellow-50 to-white rounded-2xl shadow-lg flex flex-col items-center justify-center p-4 [backface-visibility:hidden]">
              <h2 className="text-2xl font-bold text-indigo-900">
                {word.wordText}
              </h2>
              <p className="text-base text-indigo-700 mt-1">{word.mean}</p>
              {word.pronunciation && (
                <p className="text-sm text-indigo-600">{word.pronunciation}</p>
              )}
              {word.partOfSpeech && (
                <p className="text-sm text-indigo-600 italic">
                  {word.partOfSpeech}
                </p>
              )}
              {word.audioUrl && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSpeak(word.wordText, word.audioUrl);
                  }}
                  className="mt-2 flex items-center text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  <SpeakerWaveIcon className="w-5 h-5 mr-1" />
                </button>
              )}
            </div>
            {/* Mặt sau */}
            <div className="w-full h-full bg-gradient-to-br from-yellow-50 to-white rounded-2xl shadow-lg flex flex-col justify-between items-start p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <div className="flex flex-col h-full w-full">
                {word.imageUrl && (
                  <img
                    src={word.imageUrl}
                    alt={word.wordText}
                    className="w-60 h-30 object-cover rounded-xl animate-fadeIn"
                  />
                )}
                <p className="text-sm text-indigo-700 mt-8">
                  {word.example || "Không có ví dụ"}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddFavorite(word.wordId);
                  }}
                  className="mt-2 text-red-600 p-2 rounded-lg "
                  title="Thêm vào yêu thích" // Thêm tooltip để giải thích biểu tượng
                >
                  <FaHeart className="w-5 h-5" /> {/* Biểu tượng trái tim đỏ */}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setFlipped(false);
              onLearned(word.wordId);
            }}
            className="bg-purple-600 text-white px-4 py-1 rounded-lg hover:bg-purple-700 text-sm"
          >
            Đã thuộc
          </button>
          <button
            onClick={() => {
              setFlipped(false);
              onNext();
            }}
            className="bg-indigo-600 text-white px-4 py-1 rounded-lg hover:bg-indigo-700 text-sm"
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
