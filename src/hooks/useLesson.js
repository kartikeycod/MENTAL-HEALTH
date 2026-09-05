import { useState, useEffect } from "react";
import { getCurrentAuthUser } from "../services/firebase/auth.service";
import { fetchDailyArticleQuote } from "../services/api/quotes.api";
import { saveLessonTask } from "../services/firebase/tasks.service";

export const useLesson = () => {
  const [article, setArticle] = useState({ title: "", content: "", author: "" });
  const [loading, setLoading] = useState(true);
  const [read, setRead] = useState(false);

  useEffect(() => {
    const getQuote = async () => {
      const art = await fetchDailyArticleQuote();
      setArticle(art);
      setLoading(false);
    };
    getQuote();
  }, []);

  const handleComplete = async () => {
    const user = getCurrentAuthUser();
    if (!user) return alert("Login required");

    await saveLessonTask(user.uid, article);
    setRead(true);
  };

  return {
    article,
    loading,
    read,
    handleComplete,
  };
};
