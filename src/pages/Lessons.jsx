import React from "react";
import { useParams } from "react-router-dom";
import LessonList from "../components/LessonList";
import WordList from "../components/WordList";

const Lessons = () => {
  const { courseId } = useParams();

  return (
    <div>
      <LessonList />
      <WordList lessonId={courseId} />
    </div>
  );
};

export default Lessons;
