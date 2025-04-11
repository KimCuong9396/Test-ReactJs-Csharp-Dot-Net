import React, { useState, useEffect } from "react";
import { getFavoriteWords, removeFavoriteWord } from "../services/api";

const FavoriteWords = () => {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await getFavoriteWords();
        setFavorites(response.data);
      } catch (err) {
        setError("Failed to load favorite words");
      }
    };
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (id) => {
    try {
      await removeFavoriteWord(id);
      setFavorites(favorites.filter((f) => f.favoriteId !== id));
    } catch (err) {
      setError("Failed to remove favorite");
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-primary mb-4">Favorite Words</h3>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
      )}
      <div className="space-y-4">
        {favorites.map((favorite) => (
          <div
            key={favorite.favoriteId}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h4 className="text-lg font-semibold text-gray-800">
              {favorite.word.wordText}
            </h4>
            <div className="text-gray-600 mt-2">
              {favorite.word.translations?.map((t) => (
                <p key={t.translationId}>
                  <strong>{t.language}:</strong> {t.meaning}
                </p>
              ))}
            </div>
            <button
              onClick={() => handleRemoveFavorite(favorite.favoriteId)}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteWords;
