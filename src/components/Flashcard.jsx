import React, { useState } from "react";
import { SpeakerWaveIcon } from "@heroicons/react/24/solid";

const Flashcard = ({ word, onNext, onSpeak, onAddFavorite, onLearned }) => {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-full max-w-md h-80 perspective-[1000px]">
        <div
          className={`relative w-full h-full transition-transform duration-500 ease-in-out [transform-style:preserve-3d] ${
            flipped ? "rotate-y-180" : ""
          }`}
          onClick={handleFlip}
        >
          {/* Mặt trước */}
          <div className="absolute w-full h-full bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg flex flex-col items-center justify-center p-6 [backface-visibility:hidden]">
            <h2 className="text-3xl font-bold text-gray-800">
              {word.wordText}
            </h2>
            <p className="text-lg text-gray-600 mt-2">
              <strong>Nghĩa:</strong> {word.mean}
            </p>
            {word.pronunciation && (
              <p className="text-gray-500">{word.pronunciation}</p>
            )}
            {word.partOfSpeech && (
              <p className="text-gray-500 italic">{word.partOfSpeech}</p>
            )}
            {word.audioUrl && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSpeak(word.wordText, word.audioUrl);
                }}
                className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
              >
                <SpeakerWaveIcon className="w-6 h-6 mr-2" />
                Nghe
              </button>
            )}
          </div>
          {/* Mặt sau */}
          <div className="absolute w-full h-full bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg flex flex-col items-center justify-center p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <h3 className="text-xl font-semibold text-gray-800">Ví dụ:</h3>
            <p className="text-gray-600 text-center mt-2">
              {word.example || "Không có ví dụ"}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddFavorite(word.wordId);
              }}
              className="mt-4 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
            >
              Thêm vào yêu thích
            </button>
          </div>
        </div>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={() => {
            setFlipped(false);
            onLearned(word.wordId);
          }}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Đã thuộc
        </button>
        <button
          onClick={() => {
            setFlipped(false);
            onNext();
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
};

export default Flashcard;
