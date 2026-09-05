export const ASSESSMENT_QUESTIONS = [
  // --- Depression (15)
  { id: "dep-0", domain: "depression", text: "Little interest or pleasure in doing things." },
  { id: "dep-1", domain: "depression", text: "Feeling down, depressed, or hopeless." },
  { id: "dep-2", domain: "depression", text: "Trouble falling or staying asleep, or sleeping too much." },
  { id: "dep-3", domain: "depression", text: "Feeling tired or having little energy." },
  { id: "dep-4", domain: "depression", text: "Poor appetite or overeating." },
  { id: "dep-5", domain: "depression", text: "Feeling bad about yourself — or that you are a failure." },
  { id: "dep-6", domain: "depression", text: "Trouble concentrating on things (reading, watching TV)." },
  { id: "dep-7", domain: "depression", text: "Moving or speaking slowly, or being fidgety/restless." },
  { id: "dep-8", domain: "depression", text: "Thoughts that you would be better off dead or of hurting yourself." },
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
  { id: "str-1", domain: "stress", text: "Felt confident about handling personal problems." },
  { id: "str-2", domain: "stress", text: "Felt that things were going your way." },
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

  // --- Wellbeing (10)
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

export const ASSESSMENT_OPTION_LABELS = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
];

export const ASSESSMENT_SECTIONS = [
  { key: "depression", title: "Depression (15 items)" },
  { key: "anxiety", title: "Anxiety (15 items)" },
  { key: "stress", title: "Stress (15 items)" },
  { key: "wellbeing", title: "Well-being (10 items)" },
];
