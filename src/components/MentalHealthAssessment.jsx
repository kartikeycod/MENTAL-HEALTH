import React from "react";
import { useMentalHealthAssessment } from "../hooks/useMentalHealthAssessment";
import { ASSESSMENT_OPTION_LABELS } from "../constants/assessment";
import "../App.css";

export default function MentalHealthAssessment() {
  const {
    nameFromDB,
    answers,
    loadingUser,
    submitting,
    sectionIndex,
    setSectionIndex,
    message,
    sections,
    questionsByDomain,
    totalQuestions,
    handleSelect,
    handleSubmit,
  } = useMentalHealthAssessment();

  if (loadingUser) return <div style={{ padding: 30 }}>Loading user...</div>;

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
              {nameFromDB || "User"}
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
                  {ASSESSMENT_OPTION_LABELS.map((opt) => (
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
