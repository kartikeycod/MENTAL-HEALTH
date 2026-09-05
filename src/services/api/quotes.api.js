export const fetchDailyArticleQuote = async () => {
  try {
    const res = await fetch("https://zenquotes.io/api/quotes");
    const data = await res.json();
    const index = new Date().getDate() % data.length;
    const selected = data[index];

    return {
      title: "Art of Living – Daily Reflection",
      content: selected.q,
      author: selected.a || "Unknown Philosopher",
    };
  } catch (error) {
    console.error("Error fetching article:", error);
    return {
      title: "Art of Living: Mindful Balance",
      content:
        "True art of living lies in harmonizing mind, body, and actions — focusing on growth without attachment, peace without withdrawal, and success without arrogance. Reflect today on how you can balance your external goals with inner calm.",
      author: "Sereny AI",
    };
  }
};
