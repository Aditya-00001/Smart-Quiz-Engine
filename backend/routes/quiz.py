from utils.jwt_utils import verify_access_token
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models.quiz import Quiz, Question

quiz =  APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@quiz.post("/quiz/save")
def save_quiz(quiz_data: dict, user_id: int=Depends(verify_access_token), db: Session = Depends(get_db)):
    if "questions" not in quiz_data:
        raise HTTPException(status_code=400, detail={"error": "Invalid quiz format"})
    with db.begin():
        try:
            new_quiz = Quiz(
                user_id=user_id,
                title=quiz_data.get("title", "Untitled Quiz")
            )
            db.add(new_quiz)
            db.flush()
            db.refresh(new_quiz)
            print("New Quiz ID:", new_quiz.id)
            for q in quiz_data["questions"]:
                new_question = Question(
                    quiz_id=new_quiz.id,
                    question_text=q["question"],
                    options=q["options"],
                    correct_answer=q["answer"]
                )
                db.add(new_question)

            return {"message": "Quiz saved successfully", "quiz_id": new_quiz.id}
        except Exception as e:
            db.rollback()
            return {"error": str(e)}