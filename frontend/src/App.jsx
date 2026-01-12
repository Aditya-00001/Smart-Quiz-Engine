import { useState } from "react";
import Upload from "./components/Upload";
import QuizEditor from "./components/QuizEditor";
import QuizPlay from "./components/QuizPlay";

function App() {
  const [quizData, setQuizData] = useState(null);
  const [playMode, setPlayMode] = useState(false);

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
