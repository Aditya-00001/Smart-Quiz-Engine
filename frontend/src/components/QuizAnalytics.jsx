import { useEffect, useState } from "react";

export default function QuizAnalytics({ quizId, onBack }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/quiz/${quizId}/analytics`)
      .then(r => r.json())
      .then(setData);
  }, [quizId]);

  if (!data) return <p>Loading analytics...</p>;

  return (
    <div>
      <h2>Quiz Analytics</h2>
      <p>Total Attempts: {data.total_attempts}</p>
      <p>Average Score: {data.average_score}</p>

      <h3>Per Question Accuracy</h3>
      {Object.entries(data.per_question_accuracy).map(([i, v]) => (
        <p key={i}>
          Q{i}: {v}%
        </p>
      ))}

      <button onClick={onBack}>Back</button>
    </div>
  );
}
