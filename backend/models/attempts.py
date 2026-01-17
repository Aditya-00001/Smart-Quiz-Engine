from sqlalchemy import  Column, Integer, ForeignKey, DateTime
from sqlalchemy.types import JSON
from datetime import datetime
from database import Base


class Attempt(Base):
    __tablename__ = "attempts"
    
    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    answers = Column(JSON, nullable=False)
    score = Column(Integer, nullable=False)
    total = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False) 