import React from "react";
import ProgressList from "../components/ProgressList";
import Statistics from "../components/Statistics";
import FavoriteWords from "../components/FavoriteWords";
import DictionarySearch from "../components/DictionarySearch";
import QuizResultList from "../components/QuizResultList";

const Search = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-primary mb-6">Search</h2>
      <DictionarySearch />
    </div>
  );
};

export default Search;
