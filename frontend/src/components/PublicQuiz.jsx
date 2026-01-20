import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import QuizPlay from "./QuizPlay";

export default function PublicQuiz() {
    const {id} = useParams();
    const [quiz, setQuiz] = useState(null);

    useEffect(()=>{
        fetch(`http://localhost:8000/quiz/${id}/play`)
        .then(res=>res.json())
        .then(setQuiz);
    }, [id]);

    if (!quiz) {
        return <div>Loading...</div>;
    }

    return <QuizPlay quiz={quiz} />;
}