from fastapi import APIRouter
from models.attempts import Attempt
from database import SessionLocal
from sqlalchemy.orm import Session

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


analytics = APIRouter()
@analytics.get("/analytics/quiz/{quiz_id}/analytics")
def get_quiz_analytics(quiz_id: int, db: Session = Depends(get_db)):
    attempts = db.query(Attempt).filter(Attempt.quiz_id == quiz_id).all()
    if not attempts:
        return {"message": "No attempts found for this quiz."}
    total = len(attempts)
    avg_score = sum(a.score for a in attempts) / total
    return {
        "total_attempts": total,
        "average_score": round(avg_score, 2)
    }