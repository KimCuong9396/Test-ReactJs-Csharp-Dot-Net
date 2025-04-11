import React from "react";
import ProgressList from "../components/ProgressList";
import Statistics from "../components/Statistics";
import FavoriteWords from "../components/FavoriteWords";
import DictionarySearch from "../components/DictionarySearch";
import QuizResultList from "../components/QuizResultList";

const Dashboard = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-primary mb-6">Dashboard</h2>
      <ProgressList />
      <Statistics />
      <FavoriteWords />
      <DictionarySearch />
      <QuizResultList />
    </div>
  );
};

export default Dashboard;
