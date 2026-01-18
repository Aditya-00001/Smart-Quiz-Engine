import { useEffect, useState } from "react";
import { getMyQuizzes } from "../api";

export default function MyQuizzes({ onOpen, onAnalytics }) {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    getMyQuizzes().then(setQuizzes);
  }, []);

  return (
    <div>
      <h2>My Quizzes</h2>

      {quizzes.length === 0 && <p>No quizzes saved yet.</p>}

      {quizzes.map((q) => (
        <div key={q.id} style={{ marginBottom: 10 }}>
          <button onClick={() => onOpen(q.id)}>
            {q.title} — {new Date(q.created_at).toLocaleString()}
          </button>
          <button onClick={() => onAnalytics(q.id)}>Analytics</button>
        </div>
      ))}
    </div>
  );
}
