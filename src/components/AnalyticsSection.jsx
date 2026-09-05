import React, { useEffect, useState } from "react";
import AnimatedSection from "./AnimatedSection";
import { subscribeToAuthChanges } from "../services/firebase/auth.service";
import { fetchAnalyticsData } from "../services/firebase/aiProctor.service";
import "./AnalyticsSection.css";

const AnalyticsSection = () => {
  const [data, setData] = useState({
    streak: 0,
    exerciseSessions: 0,
    avgScore: 0,
    progressPct: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToAuthChanges(async (user) => {
      if (!user) return;
      try {
        const analytics = await fetchAnalyticsData(user.uid);
        setData(analytics);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <section className="analytics-section content-padding">
        <div className="analytics-loading">Fetching your analytics...</div>
      </section>
    );
  }

  return (
    <section id="analytics" className="analytics-section content-padding">
      <div className="analytics-grid">
        <AnimatedSection delay={0.1}>
          <div className="analytics-text-content">
            <div className="section-label">AI Proctor Analytics</div>
            <h2>Your Personalized Wellness Dashboard</h2>
            <p>
              Track your progress across multiple dimensions — daily activity,
              exercise, and weekly assessments. This dashboard evolves with your
              journey, keeping your growth visible and motivating.
            </p>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🔥</div>
                <div className="stat-value">{data.streak}</div>
                <div className="stat-label">Current Streak</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">💪</div>
                <div className="stat-value">{data.exerciseSessions}</div>
                <div className="stat-label">Exercise Sessions</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🧠</div>
                <div className="stat-value">{data.avgScore}</div>
                <div className="stat-label">Avg. Weekly Score</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📈</div>
                <div className="stat-value">{data.progressPct}%</div>
                <div className="stat-label">Course Progress</div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <div className="analytics-visual-panel">
            <div className="progress-ring">
              <div
                className="progress-fill"
                style={{ width: `${data.progressPct}%` }}
              ></div>
            </div>
            <p className="progress-label">
              You're {data.progressPct}% through your 28-day AI plan!
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default AnalyticsSection;
