import { useEffect, useState } from "react";
import Upload from "./components/Upload";
import QuizEditor from "./components/QuizEditor";
import QuizPlay from "./components/QuizPlay";
import Signup from "./components/Signup";
import Login from "./components/Login";


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [playMode, setPlayMode] = useState(false);

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
      {!quizData && <Upload onQuizReady={setQuizData} />}
      {quizData && (
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
