import { useState } from "react";

export default function QuizPlay({ quiz }) {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  const submit = async () => {
    let s = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.answer) s++;
    });

    setScore(s);

    await fetch(`http://localhost:8000/quiz/${quiz.id}/attempts/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answers,
        score: s,
        total: quiz.questions.length
      })
    });
  };

  return (
    <div>
      <h2>Quiz</h2>

      {quiz.questions.map((q, i) => (
        <div key={i}>
          <p>{q.question}</p>
          {Object.entries(q.options).map(([k, v]) => (
            <label key={k}>
              <input
                type="radio"
                name={`q${i}`}
                onChange={() => setAnswers({ ...answers, [i]: k })}
              />
              {k}) {v}
            </label>
          ))}
        </div>
      ))}

      <br />
      <button onClick={submit}>Submit</button>

      {score !== null && (
        <h3>
          Score: {score} / {quiz.questions.length}
        </h3>
      )}
    </div>
  );
}
