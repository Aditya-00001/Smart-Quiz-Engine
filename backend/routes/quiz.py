from utils.jwt_utils import verify_access_token
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
import shutil
import uuid
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
                    question_image=q.get("image"),
                    options=q["options"],
                    correct_answer=q["answer"]
                )
                db.add(new_question)

            return {"message": "Quiz saved successfully", "quiz_id": new_quiz.id}
        except Exception as e:
            db.rollback()
            return {"error": str(e)}
        
@quiz.get("/quiz/my")
def get_my_quizzes(
    user_id: int = Depends(verify_access_token),
    db: Session = Depends(get_db)
):
    quizzes = db.query(Quiz).filter(Quiz.user_id==user_id).all()
    return [
        {
            "id": q.id,
            "title": q.title,
            "created_at": q.created_at
        }
        for q in quizzes
    ]

@quiz.get("/quiz/{quiz_id}")
def get_quiz_by_id(
    quiz_id: int,
    db: Session = Depends(get_db)
):
    quiz = db.query(Quiz).filter(Quiz.id==quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail={"error": "Quiz not found"})
    
    questions = db.query(Question).filter(Question.quiz_id==quiz_id).all()
    return {
        "id": quiz.id,
        "title": quiz.title,
        "questions": [
            {
                "id": q.id,
                "question": q.question_text,
                "image": q.question_image,
                "options": q.options,
                "answer": q.correct_answer
            }
            for q in questions
        ]
    }
    
@quiz.get("/quiz/{quiz_id}/play")
def play_quiz(
    quiz_id: int,
    db: Session = Depends(get_db)
):
    quiz = db.query(Quiz).filter(Quiz.id==quiz_id, Quiz.is_public==True).first()
    if not quiz:
        raise HTTPException(status_code=404, detail={"error": "Quiz not found or not public"})
    questions = db.query(Question).filter(Question.quiz_id==quiz_id).all()
    return {
        "id": quiz.id,
        "title": quiz.title,
        "questions": [
            {
                "id": q.id,
                "question": q.question_text,
                "image": q.question_image,
                "options": q.options
            }
            for q in questions
        ]
    }

@quiz.put("/quiz/{quiz_id}/publish")
def publish_quiz(
    quiz_id: int,
    user_id: int = Depends(verify_access_token),
    db: Session = Depends(get_db)
):
    quiz = db.query(Quiz).filter(Quiz.id==quiz_id, Quiz.user_id==user_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail={"error": "Quiz not found or unauthorized"})
    
    quiz.is_public = True
    db.commit()
    return {"message": "Quiz published successfully and is now public"}

@quiz.put("/quiz/{quiz_id}")
def update_quiz(
    quiz_id: int,
    payload: dict,
    user_id: int = Depends(verify_access_token),
    db: Session = Depends(get_db)
):
    quiz = db.query(Quiz).filter(
        Quiz.id == quiz_id,
        Quiz.user_id == user_id
    ).first()

    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    quiz.title = payload["title"]

    # delete old questions
    db.query(Question).filter(Question.quiz_id == quiz_id).delete()

    # insert updated questions
    for q in payload["questions"]:
        db.add(Question(
            quiz_id=quiz.id,
            question_text=q["question"],
            question_image=q.get("image"),
            options=q["options"],
            correct_answer=q["answer"]
        ))

    db.commit()
    return {"message": "Quiz updated"}

@quiz.post("/upload-image")
def upload_image(file: UploadFile = File(...)):
    filename = f"{uuid.uuid4()}_{file.filename}"
    filepath = f"static/uploads/{filename}"

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "url": f"http://localhost:8000/static/uploads/{filename}"
    }
