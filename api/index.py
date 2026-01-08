from fastapi import FastAPI
from dotenv import load_dotenv
from .core.nlp_handler import NLPHandler
import os

# Load environment variables dari file .env
load_dotenv()

from api.predict import predict_endpoint
from api.quiz import get_quiz_questions, submit_quiz
from api.core.chatbot import MBTIChatbot
from pydantic import BaseModel

# Init Chatbot (Load dataset sekali di awal)
chatbot = MBTIChatbot()

class ChatRequest(BaseModel):
    message: str
    lang: str = "id" # Default ke Indo kalo gak dikirim


from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Tambahkan CORS biar frontend (port 3000) bisa akses backend (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Di produksi, ganti "*" dengan domain frontend lu
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- TAMBAHAN DEBUGGING (CEK SAAT SERVER NYALA) ---

@app.on_event("startup")
async def startup_event():
    api_key = os.getenv("YOUTUBE_API_KEY")
    print("\n" + "="*40)
    if api_key:
        print(f"✅ API KEY DITEMUKAN: {api_key[:5]}...******")
        print("🚀 Mode: OFFICIAL API (Anti-Blokir)")
    else:
        print("❌ API KEY TIDAK DITEMUKAN!")
        print("⚠️  Mode: FALLBACK SCRAPING (Rawan Error)")
    print("="*40 + "\n")

app.add_api_route("/api/predict", predict_endpoint, methods=["POST"])
app.add_api_route("/api/quiz", get_quiz_questions, methods=["GET"])
app.add_api_route("/api/quiz", submit_quiz, methods=["POST"])

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    return {"response": chatbot.generate_response(request.message, request.lang)}


@app.get("/api/hello")
def health_check():
    # Biar bisa dicek lewat browser: http://localhost:8000/api/hello
    has_key = bool(os.getenv("YOUTUBE_API_KEY"))
    return {
        "status": "online", 
        "mode": "youtube_ready", 
        "api_key_detected": has_key 
    }

# --- ROUTE YOUTUBE BARU ---
@app.get("/api/youtube/{video_id}") 
def analyze_youtube_video(video_id: str):
    # Panggil fungsi fetch YouTube
    text = NLPHandler.fetch_youtube_transcript(video_id)
    
    if not text:
        return {
            "success": False, 
            "error": "NO_TRANSCRIPT" # Kode error kalau video gak ada subtitle
        }
    
    # Analisis teks transkripnya
    result = NLPHandler.predict_all(text)
    
    return {
        "success": True,
        "mbti_type": result["mbti"],
        "emotion": result["emotion"],
        "keywords": result["keywords"],
        "fetched_text": text
    }