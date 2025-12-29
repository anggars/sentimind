from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict
# Import Logic dari Core
from .core.quiz_logic import QuizHandler

app = FastAPI()

# Model untuk menerima jawaban dari frontend
class QuizSubmission(BaseModel):
    answers: Dict[str, int] # Contoh: {"1": 3, "2": -2}

@app.get("/api/quiz")
def get_quiz_questions():
    """Endpoint untuk Frontend mengambil soal"""
    questions = QuizHandler.get_questions()
    if not questions:
        # Jika file json tidak terbaca/kosong
        raise HTTPException(status_code=500, detail="Database soal tidak ditemukan")
    return {"questions": questions}

@app.post("/api/quiz")
def submit_quiz(submission: QuizSubmission):
    """Endpoint untuk Frontend kirim jawaban dan dapat hasil MBTI"""
    result = QuizHandler.calculate_mbti(submission.answers)
    return {"mbti": result}