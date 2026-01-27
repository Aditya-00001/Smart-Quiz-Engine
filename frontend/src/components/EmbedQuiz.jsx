import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import QuizPlay from "./QuizPlay";


export default function EmbedQuiz() {
const { id } = useParams();
const [quiz, setQuiz] = useState(null);


useEffect(() => {
fetch(`http://localhost:8000/quiz/${id}/play`)
.then(r => r.json())
.then(setQuiz);
}, [id]);


if (!quiz) return <p>Loading...</p>;


return (
<div style={{ padding: 10 }}>
<QuizPlay quiz={quiz} />
</div>
);
}