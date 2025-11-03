// test.js
import fetch from "node-fetch";

const BASE_URL = "http://localhost:5000/analyze";

async function testHumeAPI() {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: "I am happy and relaxed today."
      }),
    });

    const data = await res.json();
    console.log("✅ API Response:\n", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("❌ Error testing API:", err);
  }
}

testHumeAPI();
