// src/pages/Lesson.jsx
import React, { useState, useEffect } from "react";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const Lesson = () => {
  const [article, setArticle] = useState({ title: "", content: "", author: "" });
  const [loading, setLoading] = useState(true);
  const [read, setRead] = useState(false);
  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // Fetch a philosophical or motivational long-form article
        const res = await fetch("https://zenquotes.io/api/quotes");
        const data = await res.json();

        // Pick one based on date index for daily change
        const index = new Date().getDate() % data.length;
        const selected = data[index];

        setArticle({
          title: "Art of Living – Daily Reflection",
          content: selected.q,
          author: selected.a || "Unknown Philosopher",
        });
      } catch (error) {
        console.error("Error fetching article:", error);
        setArticle({
          title: "Art of Living: Mindful Balance",
          content:
            "True art of living lies in harmonizing mind, body, and actions — focusing on growth without attachment, peace without withdrawal, and success without arrogance. Reflect today on how you can balance your external goals with inner calm.",
          author: "Sereny AI",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, []);

  const handleComplete = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Login required");

    await setDoc(doc(db, "userTasks", `${user.uid}_lesson`), {
      title: article.title,
      content: article.content,
      author: article.author,
      date: new Date().toISOString(),
      completed: true,
    });

    setRead(true);
  };

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
