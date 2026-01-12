from fastapi import FastAPI
from fastapi.responses import HTMLResponse
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
        print(f"[OK] API KEY DITEMUKAN: {api_key[:5]}...******")
        print("[MODE] Mode: OFFICIAL API (Anti-Blokir)")
    else:
        print("[ERR] API KEY TIDAK DITEMUKAN!")
        print("[WARN] Mode: FALLBACK SCRAPING (Rawan Error)")
    
    print("\n[WAIT] PRE-LOADING MODELS (Transformer + Emotions)...")
    try:
        NLPHandler.load_models()
        print("[OK] Models Loaded Successfully!")
    except Exception as e:
        print(f"[ERR] Model Preload Failed: {e}")
        
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

@app.get("/", response_class=HTMLResponse)
def read_root():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Sentimind API</title>
        <style>
            body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
            iframe { width: 100%; height: 100%; border: none; }
        </style>
    </head>
    <body>
        <iframe src="https://sentimind.vercel.app"></iframe>
    </body>
    </html>
    """

# --- ROUTE YOUTUBE BARU ---
@app.get("/api/youtube/{video_id}") 
def analyze_youtube_video(video_id: str):
    # Panggil fungsi fetch YouTube
    data = NLPHandler.fetch_youtube_transcript(video_id)
    
    if not data:
        return {
            "success": False, 
            "error": "NO_TRANSCRIPT"
        }
    
    # Handle structured data from official API
    if isinstance(data, dict) and "text_for_analysis" in data:
        text_for_analysis = data["text_for_analysis"]
        result = NLPHandler.predict_all(text_for_analysis)
        
        return {
            "success": True,
            "mbti_type": result["mbti"],
            "emotion": result["emotion"],
            "keywords": result["keywords"],
            "reasoning": result["reasoning"],
            "video": data.get("video"),
            "comments": data.get("comments", []),
            "fetched_text": text_for_analysis
        }
    
    # Fallback for plain text (transcript fallback)
    result = NLPHandler.predict_all(data)
    return {
        "success": True,
        "mbti_type": result["mbti"],
        "emotion": result["emotion"],
        "keywords": result["keywords"],
        "reasoning": result["reasoning"],
        "fetched_text": data
    }