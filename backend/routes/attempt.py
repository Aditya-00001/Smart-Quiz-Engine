from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models.attempts import Attempt

attempt = APIRouter()
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@attempt.post("/quiz/{quiz_id}/attempts/")
def save_attempt(quiz_id: int, attempt_data: dict, db: Session = Depends(get_db)):
    new_attempt = Attempt(
        quiz_id=quiz_id,
        user_id=attempt_data.get("user_id"),
        answers=attempt_data["answers"],
        score=attempt_data["score"],
        total=attempt_data["total"]
    )
    db.add(new_attempt)
    db.commit()
    return {"message": "Attempt saved successfully", "attempt_id": new_attempt.id}