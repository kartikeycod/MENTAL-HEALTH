// src/components/MentalHealthAssessment.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import "../App.css"; // your global CSS (keeps theme consistent)

/**
 * Production-ready 55-question assessment component.
 *
 * Sections / Domain breakdown:
 * - Depression (15)  => includes PHQ-9 core items + extras (index Qs 0..14)
 * - Anxiety (15)     => GAD-7 core + extras
 * - Stress (15)      => PSS/K10 style
 * - WellBeing (10)   => WHO-5 + positive affect
 *
 * Scoring:
 * - Each item is scored 0..3 (Not at all -> Nearly every day)
 * - Wellbeing is scored 0..3 (higher = better)
 * - Subscores are summed per domain.
 * - MHI = (Depression + Anxiety + Stress) - WellBeing
 * - MHI_normalized = clamp( ((MHI + 40) / 130) * 100, 0, 100 )
 *
 * Triage:
 * - If suicidal_flag (depression suicidal item > 0) -> "Doctor Counselling Required (Immediate referral)"
 * - Else if MHI_normalized >= 70 -> "Doctor Counselling Required"
 * - Else if MHI_normalized >= 50 -> "AI Counselling Recommended"
 * - Else -> "No Counselling Needed"
 *
 * Firestore collection: "MentalHealthTests"
 */

const QUESTIONS = [
  // --- Depression (15) - include PHQ-9 items among these; ensure index for suicidal item known
  // We'll mark suicidal item by id: "dep-9" (9th PHQ item). We'll include it here as the 9th depression item.
  // For readability: id format "{domain}-{n}"
  // 0..14 depression
  { id: "dep-0", domain: "depression", text: "Little interest or pleasure in doing things." },
  { id: "dep-1", domain: "depression", text: "Feeling down, depressed, or hopeless." },
  { id: "dep-2", domain: "depression", text: "Trouble falling or staying asleep, or sleeping too much." },
  { id: "dep-3", domain: "depression", text: "Feeling tired or having little energy." },
  { id: "dep-4", domain: "depression", text: "Poor appetite or overeating." },
  { id: "dep-5", domain: "depression", text: "Feeling bad about yourself — or that you are a failure." },
  { id: "dep-6", domain: "depression", text: "Trouble concentrating on things (reading, watching TV)." },
  { id: "dep-7", domain: "depression", text: "Moving or speaking slowly, or being fidgety/restless." },
  { id: "dep-8", domain: "depression", text: "Thoughts that you would be better off dead or of hurting yourself." }, // suicidal note
  { id: "dep-9", domain: "depression", text: "Feeling lonely even when around others." },
  { id: "dep-10", domain: "depression", text: "Feeling like nothing will ever work out for you." },
  { id: "dep-11", domain: "depression", text: "Loss of motivation or desire to engage in daily tasks." },
  { id: "dep-12", domain: "depression", text: "Feeling emotionally numb or detached." },
  { id: "dep-13", domain: "depression", text: "Difficulty making even small decisions." },
  { id: "dep-14", domain: "depression", text: "Feeling hopeless about the future." },

  // --- Anxiety (15)
  { id: "anx-0", domain: "anxiety", text: "Feeling nervous, anxious, or on edge." },
  { id: "anx-1", domain: "anxiety", text: "Not being able to stop or control worrying." },
  { id: "anx-2", domain: "anxiety", text: "Worrying too much about different things." },
  { id: "anx-3", domain: "anxiety", text: "Trouble relaxing." },
  { id: "anx-4", domain: "anxiety", text: "Being so restless it's hard to sit still." },
  { id: "anx-5", domain: "anxiety", text: "Becoming easily annoyed or irritable." },
  { id: "anx-6", domain: "anxiety", text: "Feeling afraid as if something awful might happen." },
  { id: "anx-7", domain: "anxiety", text: "Feeling shaky or trembling when anxious." },
  { id: "anx-8", domain: "anxiety", text: "Heart racing, pounding, or skipping beats." },
  { id: "anx-9", domain: "anxiety", text: "Avoiding places or situations because of fear." },
  { id: "anx-10", domain: "anxiety", text: "Sudden rushes of panic or intense fear." },
  { id: "anx-11", domain: "anxiety", text: "Difficulty controlling unwanted thoughts." },
  { id: "anx-12", domain: "anxiety", text: "Muscle tension or physical stiffness." },
  { id: "anx-13", domain: "anxiety", text: "Excessive worry about health or safety." },
  { id: "anx-14", domain: "anxiety", text: "Feeling like you might lose control." },

  // --- Stress / Distress (15)
  { id: "str-0", domain: "stress", text: "Felt unable to control important things in your life." },
  { id: "str-1", domain: "stress", text: "Felt confident about handling personal problems." }, // reverse-scored candidate
  { id: "str-2", domain: "stress", text: "Felt that things were going your way." }, // reverse-scored candidate
  { id: "str-3", domain: "stress", text: "Felt difficulties were piling up so high you couldn't overcome them." },
  { id: "str-4", domain: "stress", text: "Felt constantly under pressure or rushed." },
  { id: "str-5", domain: "stress", text: "Felt easily overwhelmed by daily responsibilities." },
  { id: "str-6", domain: "stress", text: "Found it hard to wind down after work or study." },
  { id: "str-7", domain: "stress", text: "Felt anger building up inside you." },
  { id: "str-8", domain: "stress", text: "Couldn't cope with unexpected changes." },
  { id: "str-9", domain: "stress", text: "Little things upset you more than usual." },
  { id: "str-10", domain: "stress", text: "Found it hard to focus because of stress." },
  { id: "str-11", domain: "stress", text: "Felt you were losing control of your temper or emotions." },
  { id: "str-12", domain: "stress", text: "Felt emotionally exhausted or drained." },
  { id: "str-13", domain: "stress", text: "Found it hard to find time for yourself." },
  { id: "str-14", domain: "stress", text: "Felt like everything was out of control." },

  // --- Wellbeing (10) (positive phrasing)
  { id: "wb-0", domain: "wellbeing", text: "I have felt cheerful and in good spirits." },
  { id: "wb-1", domain: "wellbeing", text: "I have felt calm and relaxed." },
  { id: "wb-2", domain: "wellbeing", text: "I have felt active and vigorous." },
  { id: "wb-3", domain: "wellbeing", text: "I woke up feeling fresh and rested." },
  { id: "wb-4", domain: "wellbeing", text: "My daily life has been filled with things that interest me." },
  { id: "wb-5", domain: "wellbeing", text: "I have felt a sense of purpose or meaning in life." },
  { id: "wb-6", domain: "wellbeing", text: "I have felt close to people around me." },
  { id: "wb-7", domain: "wellbeing", text: "I have been able to appreciate small positive moments." },
  { id: "wb-8", domain: "wellbeing", text: "I have felt satisfied with my achievements." },
  { id: "wb-9", domain: "wellbeing", text: "I have felt optimistic about the future." },
];

const OPTION_LABELS = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
];

export default function MentalHealthAssessment() {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const [user, setUser] = useState(null);
  const [nameFromDB, setNameFromDB] = useState("");
  const [answers, setAnswers] = useState({}); // { "dep-0": 2, ... }
  const [loadingUser, setLoadingUser] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sectionIndex, setSectionIndex] = useState(0); // 0..3 for 4 domains
  const [message, setMessage] = useState("");

  // group questions by domain for UI sections
  const sections = [
    { key: "depression", title: "Depression (15 items)" },
    { key: "anxiety", title: "Anxiety (15 items)" },
    { key: "stress", title: "Stress (15 items)" },
    { key: "wellbeing", title: "Well-being (10 items)" },
  ];

  // fetch auth user + name from USERS collection (or fallback to localStorage)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        navigate("/auth");
        return;
      }
      setUser(u);
      try {
        const userDoc = await getDoc(doc(db, "USERS", u.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setNameFromDB(data.NAME || data.name || "");
          // ensure localStorage also has user for fallback
          try {
            localStorage.setItem(
              "user",
              JSON.stringify({ name: data.NAME || data.name || "", email: u.email, uid: u.uid })
            );
          } catch (e) {
            // silent
          }
        } else {
          const ls = localStorage.getItem("user");
          if (ls) {
            const parsed = JSON.parse(ls);
            setNameFromDB(parsed.name || "");
          }
        }
      } catch (err) {
        console.error("Error fetching user doc:", err);
      } finally {
        setLoadingUser(false);
      }
    });

    return () => unsub();
  }, [auth, db, navigate]);

  // helpers to get questions per domain
  const questionsByDomain = (domain) => QUESTIONS.filter((q) => q.domain === domain);

  const totalQuestions = QUESTIONS.length;

  const handleSelect = (qid, value) => {
    setAnswers((prev) => ({ ...prev, [qid]: Number(value) }));
  };

  // compute sub-scores and MHI
  const computeScores = () => {
    const subs = { depression: 0, anxiety: 0, stress: 0, wellbeing: 0 };
    for (const q of QUESTIONS) {
      const v = Number(answers[q.id] ?? 0);
      // For stress reverse-scored items (str-1 and str-2) we treat them as reverse (higher -> lower stress)
      if (q.id === "str-1" || q.id === "str-2") {
        // reverse: 3 -> 0, 2 ->1, 1->2, 0->3
        subs[q.domain] += 3 - v;
      } else {
        subs[q.domain] += v;
      }
    }

    // Important: wellbeing is positive; in MHI it reduces severity
    const depression = subs.depression;
    const anxiety = subs.anxiety;
    const stress = subs.stress;
    const wellbeing = subs.wellbeing;

    const MHI = depression + anxiety + stress - wellbeing;

    // Normalize to 0..100 (clamp)
    let normalized = Math.round(((MHI + 40) / 130) * 100);
    if (normalized < 0) normalized = 0;
    if (normalized > 100) normalized = 100;

    // PHQ suicidal flag check: we used dep-8 as suicidal ideation item above (index accordingly)
    const suicidalFlag = Number(answers["dep-8"] ?? 0) > 0;

    // conclusion logic
    let conclusion = "No Counselling Needed";
    if (suicidalFlag) conclusion = "Doctor Counselling Required (Immediate referral - suicidal ideation)";
    else if (normalized >= 70) conclusion = "Doctor Counselling Required";
    else if (normalized >= 50) conclusion = "AI Counselling Recommended";

    return {
      subscores: { depression, anxiety, stress, wellbeing },
      MHI,
      normalized,
      conclusion,
      suicidalFlag,
    };
  };

  // submit function saves to Firestore
  const handleSubmit = async () => {
    // ensure all questions answered
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < totalQuestions) {
      alert(`Please answer all ${totalQuestions} questions (answered ${answeredCount}).`);
      return;
    }

    if (!user) {
      alert("Please log in to submit the assessment.");
      navigate("/auth");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const { subscores, normalized, conclusion, suicidalFlag, MHI } = computeScores();

      const payload = {
        uid: user.uid,
        email: user.email,
        name: nameFromDB || JSON.parse(localStorage.getItem("user") || "{}").name || "",
        answers, // map of qid -> numeric value 0..3
        subscores,
        mhi: MHI,
        mhi_normalized: normalized,
        conclusion,
        suicidalFlag,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "MentalHealthTests"), payload);

      setMessage(`✅ Submitted — Score ${normalized} — ${conclusion}`);
      // show brief success then redirect or allow review
      setTimeout(() => {
        navigate("/"); // back to home or replace with summary page
      }, 1200);
    } catch (err) {
      console.error("Error saving assessment:", err);
      setMessage("❌ Error saving assessment. Check console.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingUser) return <div style={{ padding: 30 }}>Loading user...</div>;

  // UI helpers
  const currentDomain = sections[sectionIndex].key;
  const currentQuestions = questionsByDomain(currentDomain);
  const answeredInSection = currentQuestions.filter((q) => answers[q.id] !== undefined).length;
  const progressPercent = Math.round((Object.keys(answers).length / totalQuestions) * 100);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#fff,#f3e8ff)" }}>
      <div style={{ maxWidth: 980, margin: "32px auto", padding: 24 }}>
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 18
        }}>
          <div>
            <h1 style={{ margin: 0, color: "#4b0082", fontSize: 22 }}>🧠 Mental Health Assessment</h1>
            <div style={{ color: "#6b2bd6", fontWeight: 600 }}>
              {nameFromDB || (JSON.parse(localStorage.getItem("user") || "{}").name) || "User"}
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: "#666" }}>Progress</div>
            <div style={{
              width: 180,
              height: 10,
              background: "#eee",
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)"
            }}>
              <div style={{
                width: `${progressPercent}%`,
                height: "100%",
                background: "linear-gradient(90deg,#8a2be2,#b28dff)",
                transition: "width .4s ease"
              }} />
            </div>
            <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>{progressPercent}% completed</div>
          </div>
        </div>

        {/* Section card */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          padding: 18,
          boxShadow: "0 8px 30px rgba(107,45,186,0.08)",
          border: "1px solid rgba(178,141,255,0.3)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h2 style={{ margin: 0, color: "#3a0066" }}>{sections[sectionIndex].title}</h2>
            <div style={{ color: "#666" }}>{answeredInSection}/{currentQuestions.length} answered</div>
          </div>

          {/* Questions for this section */}
          <div>
            {currentQuestions.map((q) => (
              <div key={q.id} style={{
                padding: 12,
                borderRadius: 12,
                marginBottom: 10,
                background: "#fbf7ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <div style={{ flex: 1, marginRight: 12 }}>
                  <div style={{ fontWeight: 600, color: "#3b0b7a" }}>{q.text}</div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  {OPTION_LABELS.map((opt) => (
                    <label key={opt.value} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      background: answers[q.id] === opt.value ? "linear-gradient(90deg,#8a2be2,#b28dff)" : "transparent",
                      color: answers[q.id] === opt.value ? "white" : "#4b0066",
                      padding: "6px 10px",
                      borderRadius: 10,
                      cursor: "pointer",
                      border: answers[q.id] === opt.value ? "none" : "1px solid rgba(178,141,255,0.35)"
                    }}>
                      <input
                        type="radio"
                        name={q.id}
                        value={opt.value}
                        checked={answers[q.id] === opt.value}
                        onChange={() => handleSelect(q.id, opt.value)}
                        style={{ display: "none" }}
                      />
                      <span style={{ fontSize: 13 }}>{opt.label.split(" ")[0]}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
            <div>
              {sectionIndex > 0 && (
                <button onClick={() => setSectionIndex(sectionIndex - 1)}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(107,45,186,0.15)",
                    color: "#4b0066",
                    padding: "8px 14px",
                    borderRadius: 10,
                    cursor: "pointer",
                    marginRight: 8
                  }}>
                  ← Previous
                </button>
              )}
              {sectionIndex < sections.length - 1 && (
                <button onClick={() => setSectionIndex(sectionIndex + 1)}
                  style={{
                    background: "linear-gradient(90deg,#8a2be2,#b28dff)",
                    border: "none",
                    color: "white",
                    padding: "8px 14px",
                    borderRadius: 10,
                    cursor: "pointer"
                  }}>
                  Next →
                </button>
              )}
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ color: "#666", fontSize: 13 }}>Answered: {Object.keys(answers).length}/{totalQuestions}</div>
              <button
                onClick={handleSubmit}
                disabled={submitting || Object.keys(answers).length < totalQuestions}
                style={{
                  background: submitting ? "#b9a1ff" : "linear-gradient(90deg,#5f21d9,#8a2be2)",
                  color: "white",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: 12,
                  cursor: submitting ? "wait" : "pointer",
                  fontWeight: 700
                }}
              >
                {submitting ? "Submitting..." : "Submit Assessment"}
              </button>
            </div>
          </div>

          {message && (
            <div style={{ marginTop: 12, color: message.startsWith("✅") ? "#1a7f4a" : "#b00020" }}>
              {message}
            </div>
          )}
        </div>

        {/* Small footer / notes */}
        <div style={{ marginTop: 12, color: "#5c2aa0", fontSize: 13 }}>
          <strong>Note:</strong> This is a screening tool. If assessed as "Doctor Counselling Required", please seek immediate professional help.
        </div>
      </div>
    </div>
  );
}
