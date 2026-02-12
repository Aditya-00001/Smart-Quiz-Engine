// import { useState } from "react";
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

// const [saving, setSaving] = useState(false);
const saveQuiz = async () => {
  const token = localStorage.getItem("token");

  // UPDATE
  if (quiz.id) {
    const res = await fetch(
      `http://localhost:8000/quiz/${quiz.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: quiz.title || "Untitled Quiz",
          questions: quiz.questions
        })
      }
    );

    if (res.ok) {
      alert("Quiz updated successfully");
    }
    return;
  }

  // CREATE
  const res = await fetch(
    "http://localhost:8000/quiz/save",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title: quiz.title || "Untitled Quiz",
        questions: quiz.questions
      })
    }
  );

  const data = await res.json();
  setQuiz({ ...quiz, id: data.quiz_id });
  alert("Quiz saved successfully");
};

  return (
    <div>
      <h2>Edit Quiz</h2>

      <input
        type="text"
        placeholder="Quiz title"
        value={quiz.title || ""}
        onChange={(e) =>
          setQuiz({
            ...quiz,
            title: e.target.value
          })
        }
        style={{ width: "100%", marginBottom: 20 }}
      />

      {quiz.questions.map((q, idx) => (
        <div key={idx} style={{ marginBottom: 20 }}>
          <input
            style={{ width: "100%" }}
            value={q.question}
            onChange={e => updateQuestion(idx, e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const formData = new FormData();
              formData.append("file", e.target.files[0]);

              const res = await fetch(
                "http://localhost:8000/upload-image",
                {
                  method: "POST",
                  body: formData
                }
              );

              const data = await res.json();

              const updated = [...quiz.questions];
              updated[idx].image = data.url;

              setQuiz({ ...quiz, questions: updated });
            }}
          />

          {/* Optional preview */}
          {q.image && (
            <img
              src={q.image}
              alt="preview"
              style={{ maxWidth: "200px", marginTop: 10 }}
            />
          )}

          {/* Options rendering continues here */}

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
      <button onClick={() => {
        saveQuiz();
        }}>{!quiz.id? "Save Quiz":"Update Quiz"}
      </button>


      <button onClick={() => {
        if (!quiz.id) {
          alert("Please save quiz before starting");
          return;
        }
        onStartQuiz();
      }}>
        Start Quiz
      </button>


      <button
        disabled={!quiz.id}
        onClick={async () => {
          const token = localStorage.getItem("token");
          await fetch(`http://localhost:8000/quiz/${quiz.id}/publish`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` }
          });
          alert(`
              Public Link:
              http://localhost:5173/quiz/${quiz.id}/play

              Embed Code:
              <iframe src="http://localhost:5173/embed/quiz/${quiz.id}" width="100%" height="600"></iframe>
          `);
        }}
      >
        Publish & Share
      </button>
    </div>
  );
}
