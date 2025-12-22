from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import os
import random
from textblob import TextBlob
import re

app = FastAPI()

# --- 1. LOAD MODEL MBTI ---
current_dir = os.path.dirname(__file__)
model_path = os.path.join(current_dir, 'model_mbti.pkl')

model = None
try:
    if os.path.exists(model_path):
        model = joblib.load(model_path)
        print("✅ Model MBTI berhasil dimuat!")
    else:
        print("⚠️ File model_mbti.pkl tidak ditemukan. Fitur prediksi MBTI akan error.")
except Exception as e:
    print(f"❌ Error loading model: {e}")

# --- 2. DATA MODELS ---
class UserInput(BaseModel):
    text: str

class ChatInput(BaseModel):
    message: str
    mbti_type: str = "Unknown"

# --- 3. HELPER FUNCTION ---
def extract_keywords(text):
    # Data mining simple: ambil kata unik > 4 huruf
    words = re.findall(r'\w+', text.lower())
    unique_words = list(set([w for w in words if len(w) > 4]))
    return unique_words[:5] # Ambil 5 kata kunci

# --- 4. ENDPOINTS ---
@app.get("/api/hello")
def health_check():
    return {"status": "online", "message": "Sentimind Brain is Active!"}

@app.post("/api/predict")
def predict_personality(input_data: UserInput):
    text = input_data.text
    
    # A. Prediksi MBTI
    mbti_result = "UNKNOWN"
    if model:
        mbti_result = model.predict([text])[0]
    
    # B. Sentiment Analysis (Data Mining)
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    if polarity > 0.1: sentiment = "Positif 😊"
    elif polarity < -0.1: sentiment = "Negatif 😔"
    else: sentiment = "Netral 😐"

    # C. Keyword Extraction
    keywords = extract_keywords(text)

    return {
        "success": True,
        "mbti_type": mbti_result,
        "sentiment": sentiment,
        "keywords": keywords
    }

@app.post("/api/chat")
def chat_bot(input_data: ChatInput):
    msg = input_data.message.lower()
    mbti = input_data.mbti_type
    
    # Logika Bot Sederhana
    if "halo" in msg or "hi" in msg:
        reply = f"Halo! Saya Sentimind Bot. Ada yang bisa saya bantu soal tipe {mbti} kamu?"
    elif "mbti" in msg:
        reply = "MBTI (Myers-Briggs Type Indicator) membagi kepribadian manusia menjadi 16 tipe unik."
    elif "sedih" in msg or "galau" in msg:
        reply = "Jangan sedih! Coba dengarkan lagu favoritmu atau istirahat sejenak."
    elif "terima kasih" in msg:
        reply = "Sama-sama! Senang bisa membantu."
    else:
        responses = [
            f"Sebagai tipe {mbti}, itu hal yang wajar.",
            "Ceritakan lebih lanjut, saya mendengarkan.",
            "Menarik sekali analisismu.",
            "Data menunjukkan pola pikirmu sangat kompleks."
        ]
        reply = random.choice(responses)
        
    return {"reply": reply}