/**
 * Pure scoring calculation function for Mental Health Assessment.
 * Preserves 100% of original logic and math:
 * - Subscores summed per domain
 * - Stress reverse-scored items: str-1 and str-2 (3 - v)
 * - MHI = depression + anxiety + stress - wellbeing
 * - MHI_normalized = clamp( Math.round(((MHI + 40) / 130) * 100), 0, 100 )
 * - Suicidal ideation check: dep-8 > 0
 * - Triage conclusion rules based on suicidalFlag and normalized score thresholds.
 */
export const computeAssessmentScores = (answers, questions) => {
  const subs = { depression: 0, anxiety: 0, stress: 0, wellbeing: 0 };

  for (const q of questions) {
    const v = Number(answers[q.id] ?? 0);
    if (q.id === "str-1" || q.id === "str-2") {
      subs[q.domain] += 3 - v;
    } else {
      subs[q.domain] += v;
    }
  }

  const { depression, anxiety, stress, wellbeing } = subs;
  const MHI = depression + anxiety + stress - wellbeing;

  let normalized = Math.round(((MHI + 40) / 130) * 100);
  if (normalized < 0) normalized = 0;
  if (normalized > 100) normalized = 100;

  const suicidalFlag = Number(answers["dep-8"] ?? 0) > 0;

  let conclusion = "No Counselling Needed";
  if (suicidalFlag) {
    conclusion = "Doctor Counselling Required (Immediate referral - suicidal ideation)";
  } else if (normalized >= 70) {
    conclusion = "Doctor Counselling Required";
  } else if (normalized >= 50) {
    conclusion = "AI Counselling Recommended";
  }

  return {
    subscores: { depression, anxiety, stress, wellbeing },
    MHI,
    normalized,
    conclusion,
    suicidalFlag,
  };
};
