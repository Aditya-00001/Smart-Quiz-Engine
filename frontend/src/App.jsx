import './App.css';
import { useEffect, useState } from "react";
import Upload from "./components/Upload";
import QuizEditor from "./components/QuizEditor";
import QuizPlay from "./components/QuizPlay";
import Signup from "./components/Signup";
import Login from "./components/Login";
import MyQuizzes from "./components/MyQuizzes";
import QuizAnalytics from "./components/QuizAnalytics";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [playMode, setPlayMode] = useState(false);
  const [viewMyQuizzes, setViewMyQuizzes] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setLoggedIn(true);
  }, []);

  if (!loggedIn) {
    return showSignup ? (
      <Signup onSwitch={() => setShowSignup(false)} />
    ) : (
      <Login
        onLogin={() => setLoggedIn(true)}
        onSwitch={() => setShowSignup(true)}
      />
    );
  }

  if (playMode) {
    return <QuizPlay quiz={quizData} />;
  }

  return (
    <div style={{ padding: 20 }}>
      
      <div style={{ marginBottom: 15 }}>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            setLoggedIn(false);
            setQuizData(null);
            setPlayMode(false);
            setViewMyQuizzes(false);
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ marginBottom: 15 }}>
        <button
          onClick={() => {
            setQuizData(null);
            setPlayMode(false);
            setViewMyQuizzes(false);
          }}
        >
          New Quiz
        </button>

        <button
          onClick={() => {
            setQuizData(null);
            setPlayMode(false);
            setViewMyQuizzes(true);
          }}
        >
          My Quizzes
        </button>
      </div>

      {viewMyQuizzes && (
        <MyQuizzes
          onOpen={async (id) => {
            const res = await fetch(`http://localhost:8000/quiz/${id}`);
            const data = await res.json();
            setQuizData(data);
            setViewMyQuizzes(false);
          }}
          onAnalytics={(id) => {
            setSelectedQuizId(id);
            setViewMyQuizzes(false);
            setShowAnalytics(true);
          }}
        />
      )}

      {showAnalytics && (
        <QuizAnalytics
          quizId={selectedQuizId}
          onBack={() => setShowAnalytics(false)}
        />
      )}


      {!viewMyQuizzes && !quizData && <Upload onQuizReady={setQuizData} />}

      {!viewMyQuizzes && quizData && (
        <QuizEditor
          quiz={quizData}
          setQuiz={setQuizData}
          onStartQuiz={() => setPlayMode(true)}
        />
      )}
    </div>
  );
}

export default App;
