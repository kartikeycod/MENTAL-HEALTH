// src/components/ToDo.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ToDo.css";

const ToDo = () => {
  const navigate = useNavigate();

  const lessons = [
    {
      title: "Daily Lesson",
      path: "/lesson",
      description: "Reflect on timeless wisdom for emotional balance.",
    },
    {
      title: "Physical Interaction",
      path: "/physical",
      description: "Connect and express your emotions meaningfully.",
    },
    {
      title: "Leisure Activity",
      path: "/leisure",
      description: "Do something joyful or mindful today.",
    },
  ];

  return (
    <section className="todo-section">
      <h2 className="todo-title">🌿 Daily Mind & Body Goals</h2>
      <div className="todo-grid">
        {lessons.map((l, i) => (
          <div key={i} className="todo-card" onClick={() => navigate(l.path)}>
            <h3>{l.title}</h3>
            <p>{l.description}</p>
            <button className="todo-btn">Start</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ToDo;
