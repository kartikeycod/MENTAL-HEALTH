import React from "react";
import { useLesson } from "../hooks/useLesson";

const Lesson = () => {
  const { article, loading, read, handleComplete } = useLesson();

  if (loading)
    return (
      <div className="lesson-page">
        <p>Fetching your daily article...</p>
      </div>
    );

  return (
    <div className="lesson-page">
      <h2>📘 {article.title}</h2>
      <p className="lesson-text">{article.content}</p>
      <p><em>— {article.author}</em></p>
      <button onClick={handleComplete} disabled={read}>
        {read ? "Marked as Read ✅" : "Mark as Read"}
      </button>
    </div>
  );
};

export default Lesson;
