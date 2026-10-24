import fs from "node:fs";
import path from "node:path";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY secret is missing.");
}

const today = new Date().toISOString().slice(0, 10);

const prompt = `
You create safe, accurate space-science quiz questions for children aged 6-14.

Generate exactly 5 different multiple-choice questions for a daily space quiz.
Use a mixture of planets, moons, stars, astronauts, rockets, the Solar System,
space exploration, and basic astronomy.

Rules:
- Use simple, child-friendly English.
- Each question must have exactly 4 options.
- There must be exactly one correct answer.
- Make questions scientifically accurate and age-appropriate.
- Do not ask for personal information.
- Avoid repeating the same question within this set.
- Return ONLY JSON matching this structure:
{
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "A short explanation for children.",
      "difficulty": "easy",
      "topic": "Planets"
    }
  ]
}

The correctAnswer must be an index from 0 to 3.
Difficulty must be easy, medium, or hard.
The topic should be a short space-related category.
Today's date is ${today}. Make this set fresh and varied.
`;

const response = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.9,
      },
    }),
  }
);

if (!response.ok) {
  const details = await response.text();
  throw new Error(
    `Gemini API request failed (${response.status}): ${details}`
  );
}

const result = await response.json();
const text = result.candidates?.[0]?.content?.parts
  ?.map((part) => part.text || "")
  .join("");

if (!text) {
  throw new Error("Gemini returned an empty response.");
}

const parsed = JSON.parse(text);
const questions = parsed.questions;

if (!Array.isArray(questions) || questions.length !== 5) {
  throw new Error("Gemini must return exactly 5 questions.");
}

for (const [index, q] of questions.entries()) {
  if (
    typeof q.question !== "string" ||
    !q.question.trim() ||
    !Array.isArray(q.options) ||
    q.options.length !== 4 ||
    q.options.some((option) => typeof option !== "string" || !option.trim()) ||
    !Number.isInteger(q.correctAnswer) ||
    q.correctAnswer < 0 ||
    q.correctAnswer > 3 ||
    typeof q.explanation !== "string" ||
    !q.explanation.trim() ||
    !["easy", "medium", "hard"].includes(q.difficulty) ||
    typeof q.topic !== "string" ||
    !q.topic.trim()
  ) {
    throw new Error(`Question ${index + 1} has an invalid format.`);
  }
}

const output = {
  date: today,
  title: "Daily Space Challenge",
  questions: questions.map((q, index) => ({
    id: `${today}-${index + 1}`,
    question: q.question.trim(),
    options: q.options.map((option) => option.trim()),
    correctAnswer: q.correctAnswer,
    explanation: q.explanation.trim(),
    difficulty: q.difficulty,
    topic: q.topic.trim(),
  })),
};

const outputPath = path.join(
  process.cwd(),
  "public",
  "data",
  "daily-questions.json"
);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2) + "\n");

console.log(`Successfully generated ${questions.length} questions for ${today}.`);
  
