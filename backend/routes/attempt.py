from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models.attempts import Attempt
from models.quiz import Question

attempt = APIRouter()
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@attempt.post("/quiz/{quiz_id}/attempts/")
def save_attempt(quiz_id: int, attempt_data: dict, db: Session = Depends(get_db)):
    questions = db.query(Question).filter(Question.quiz_id == quiz_id).all()

    score = 0
    for idx, q in enumerate(questions):
        if attempt_data["answers"].get(str(idx)) == q.correct_answer:
            score += 1

    new_attempt = Attempt(
        quiz_id=quiz_id,
        user_id=attempt_data.get("user_id"),
        answers=attempt_data["answers"],
        score=score,
        total=len(questions)
    )

    db.add(new_attempt)
    db.commit()

    return {
        "score": score,
        "total": len(questions)
    }