from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models.attempts import Attempt
from models.quiz import Question

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/quiz/{quiz_id}/analytics")
def get_quiz_analytics(quiz_id: int, db: Session = Depends(get_db)):
    attempts = db.query(Attempt).filter(Attempt.quiz_id == quiz_id).all()
    questions = db.query(Question).filter(Question.quiz_id == quiz_id).all()

    if not attempts:
        return {"total_attempts": 0}

    total_attempts = len(attempts)
    avg_score = sum(a.score for a in attempts) / total_attempts

    question_stats = {i: 0 for i in range(len(questions))}

    for a in attempts:
        for idx, ans in a.answers.items():
            if questions[int(idx)].correct_answer == ans:
                question_stats[int(idx)] += 1

    return {
        "total_attempts": total_attempts,
        "average_score": round(avg_score, 2),
        "per_question_accuracy": {
            str(i): round((c / total_attempts) * 100, 2)
            for i, c in question_stats.items()
        }
    }
