export default function QuizEditor({ quiz, setQuiz, onStartQuiz }) {

  const updateQuestion = (qIdx, newQuestion) => {
    const updated = {
      ...quiz,
      questions: quiz.questions.map((q, i) =>
        i === qIdx ? { ...q, question: newQuestion } : q
      )
    };
    setQuiz(updated);
  };

  const updateOption = (qIdx, optKey, value) => {
    const updated = {
      ...quiz,
      questions: quiz.questions.map((q, i) =>
        i === qIdx
          ? {
              ...q,
              options: { ...q.options, [optKey]: value }
            }
          : q
      )
    };
    setQuiz(updated);
  };

  const updateAnswer = (qIdx, value) => {
    const updated = {
      ...quiz,
      questions: quiz.questions.map((q, i) =>
        i === qIdx ? { ...q, answer: value } : q
      )
    };
    setQuiz(updated);
  };


const saveQuiz = async ()=> {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:8000/quiz/save",{
    method: "POST",
    headers:{
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(
      {
        title:"My Quiz",
        questions: quiz.questions
      })
  });
  const data = await response.json();
  alert("Quiz saved: " + data.quiz_id);
  };

  return (
    <div>
      <h2>Edit Quiz</h2>

      {quiz.questions.map((q, idx) => (
        <div key={idx} style={{ marginBottom: 20 }}>
          <input
            style={{ width: "100%" }}
            value={q.question}
            onChange={e => updateQuestion(idx, e.target.value)}
          />

          {Object.entries(q.options).map(([key, val]) => (
            <div key={key}>
              {key}:{" "}
              <input
                value={val}
                onChange={e => updateOption(idx, key, e.target.value)}
              />
            </div>
          ))}

          <select
            value={q.answer || ""}
            onChange={e => updateAnswer(idx, e.target.value)}
          >
            <option value="">No Answer</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>
      ))}
      <button onClick={saveQuiz}>Save Quiz</button>
      <button onClick={onStartQuiz}>Start Quiz</button>
    </div>
  );
}
