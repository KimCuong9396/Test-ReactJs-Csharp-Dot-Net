import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { getAllLearnedProgress } from "../services/api";

export const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  const { token, handleLogout } = useContext(AuthContext);
  const [learnedWords, setLearnedWords] = useState([]);

  useEffect(() => {
    const fetchLearnedWords = async () => {
      if (!token) {
        setLearnedWords([]);
        return;
      }
      try {
        const progressResponse = await getAllLearnedProgress();
        //console.log("Fetched learnedWords:", progressResponse.data.$values);
        setLearnedWords(progressResponse.data.$values || []);
      } catch (err) {
        console.error("Không thể tải từ vựng đã học:", err);
        if (err.response?.status === 401) {
          handleLogout();
        }
      }
    };
    fetchLearnedWords();
  }, [token, handleLogout]);

  const updateWordProgress = (wordId, updatedProgress) => {
    if (!wordId) {
      //console.log("Updating entire learnedWords:", updatedProgress);
      setLearnedWords(updatedProgress || []);
      return;
    }
    setLearnedWords((prev) => {
      const existingWord = prev.find((word) => word.wordId === wordId);
      if (existingWord) {
        const updated = prev.map((word) =>
          word.wordId === wordId ? { ...word, ...updatedProgress } : word
        );
        //console.log("Updated existing word:", updated);
        return updated;
      }
      const newWord = { ...updatedProgress };
      //console.log("Added new word:", newWord);
      return [...prev, newWord];
    });
  };

  return (
    <ProgressContext.Provider value={{ learnedWords, updateWordProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};
