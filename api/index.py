from fastapi import FastAPI
from dotenv import load_dotenv
from .core.nlp_handler import NLPHandler
import os

load_dotenv()

from api.predict import predict_endpoint
from api.quiz import get_quiz_questions, submit_quiz

app = FastAPI()

app.add_api_route("/api/predict", predict_endpoint, methods=["POST"])
app.add_api_route("/api/quiz", get_quiz_questions, methods=["GET"])
app.add_api_route("/api/quiz", submit_quiz, methods=["POST"])

@app.get("/api/hello")
def health_check():
    return {"status": "online", "mode": "local_dev_aggregated"}

@app.get("/api/reddit/{username:path}") 
def analyze_reddit_user(username: str):
    text = NLPHandler.fetch_reddit_text(username)
    
    if not text:
        return {
            "success": False, 
            # GANTI JADI KODE ERROR SINGKAT
            "error": "USER_NOT_FOUND" 
        }
    
    result = NLPHandler.predict_all(text)
    
    return {
        "success": True,
        "mbti_type": result["mbti"],
        "emotion": result["emotion"],
        "keywords": result["keywords"],
        "fetched_text": text
    }