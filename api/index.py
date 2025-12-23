from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import os
import random
import re
from textblob import TextBlob

app = FastAPI()

# --- 1. CONFIG & MODEL LOADING ---
current_dir = os.path.dirname(__file__)
model_path = os.path.join(current_dir, 'model_mbti.pkl')

model = None
try:
    if os.path.exists(model_path):
        model = joblib.load(model_path)
        print("✅ Model MBTI Real Loaded!")
    else:
        print("⚠️ Model pkl not found. Using Heuristic Logic fallback.")
except Exception as e:
    print(f"❌ Error loading model: {e}")

# --- 2. DATA MODELS ---
class UserInput(BaseModel):
    text: str

class ChatInput(BaseModel):
    message: str
    mbti_type: str = "Unknown"

# --- 3. HELPER FUNCTIONS ---
def extract_keywords(text):
    # Ambil kata unik > 4 huruf, buang stopwords umum inggris/indo simple
    stopwords = ["the", "and", "is", "of", "to", "in", "it", "that", "dan", "yang", "di", "ke", "dari", "ini", "itu", "saya", "aku"]
    words = re.findall(r'\w+', text.lower())
    # Filter kata
    filtered = [w for w in words if len(w) > 3 and w not in stopwords]
    # Hitung frekuensi
    freq = {}
    for w in filtered:
        freq[w] = freq.get(w, 0) + 1
    # Sort by frequency
    sorted_words = sorted(freq.items(), key=lambda x: x[1], reverse=True)
    return [w[0] for w in sorted_words[:7]] # Ambil top 7 keywords

def predict_mbti_fallback(text):
    """
    Logika cadangan yang LEBIH PINTAR.
    Kamus kata kunci diperluas untuk menangkap nuansa ESTP vs ENFP.
    """
    text = text.lower()
    
    # Skor Awal
    scores = {'IE': 0, 'SN': 0, 'TF': 0, 'JP': 0}

    # KAMUS KATA KUNCI (UPDATED)
    keywords = {
        'IE': {
            'I': ['alone', 'book', 'read', 'quiet', 'think', 'home', 'sendiri', 'buku', 'diam', 'rumah', 'sep', 'mikir', 'deep'],
            'E': ['party', 'talk', 'friend', 'people', 'social', 'meet', 'pesta', 'ngobrol', 'teman', 'orang', 'ramai', 'seru', 'kumpul']
        },
        'SN': { 
            # N = Abstrak, Masa Depan, Teori, Makna
            'N': ['future', 'dream', 'idea', 'theory', 'why', 'imagine', 'masa depan', 'mimpi', 'ide', 'teori', 'kenapa', 'filosofi', 'makna', 'universe', 'pola'],
            # S = Konkret, Fisik, Aksi, Sekarang, Detail
            'S': ['fact', 'real', 'now', 'do', 'action', 'risk', 'hands', 'sport', 'fakta', 'nyata', 'sekarang', 'lakukan', 'aksi', 'resiko', 'gerak', 'fisik', 'detail']
        },
        'TF': {
            # F = Perasaan, Orang, Moral
            'F': ['feel', 'love', 'heart', 'help', 'sad', 'happy', 'rasa', 'cinta', 'hati', 'bantu', 'sedih', 'peduli', 'maaf', 'nangis'],
            # T = Logika, Benar/Salah, Efisiensi
            'T': ['logic', 'think', 'analyze', 'why', 'true', 'false', 'solution', 'system', 'logika', 'pikir', 'analisis', 'benar', 'salah', 'solusi', 'sistem']
        },
        'JP': {
            # P = Spontan, Bebas, Lihat Nanti
            'P': ['flow', 'maybe', 'later', 'open', 'change', 'spontaneous', 'flexible', 'bebas', 'nanti', 'buka', 'ubah', 'spontan', 'santai', 'lihat nanti'],
            # J = Rencana, Jadwal, Keputusan
            'J': ['plan', 'list', 'time', 'rule', 'schedule', 'deadline', 'decide', 'rencana', 'daftar', 'waktu', 'aturan', 'jadwal', 'keputusan', 'target']
        }
    }

    # Hitung Skor
    for dim, categories in keywords.items():
        # Loop Kategori Positif (I, N, F, P)
        for word in categories[list(categories.keys())[0]]: 
            if word in text: scores[dim] += 1
            
        # Loop Kategori Negatif (E, S, T, J)
        for word in categories[list(categories.keys())[1]]: 
            if word in text: scores[dim] -= 1

    # Tentukan Hasil Huruf
    mbti = ""
    # Kalau skor < 0 berarti E, S, T, J
    mbti += "I" if scores['IE'] > 0 else "E" # Default E kalau 0 (biasanya orang nulis sosmed itu E)
    mbti += "N" if scores['SN'] > 0 else "S" # Default S kalau 0 (Fakta lebih umum)
    mbti += "F" if scores['TF'] > 0 else "T" # Default T kalau 0
    mbti += "P" if scores['JP'] > 0 else "J" # Default J kalau 0
    
    return mbti

# --- 4. ENDPOINTS ---
@app.get("/api/hello")
def health_check():
    return {"status": "online", "message": "Sentimind Brain is Active!"}

@app.post("/api/predict")
def predict_personality(input_data: UserInput):
    text = input_data.text
    if not text:
        return {"success": False, "error": "No text provided"}
    
    # A. Prediksi MBTI
    if model:
        # Pake Model AI Asli (kalau ada file pkl)
        mbti_result = model.predict([text])[0]
    else:
        # Pake Logika Cadangan (Fallback)
        mbti_result = predict_mbti_fallback(text)
    
    # B. Sentiment Analysis (Data Mining pake TextBlob)
    try:
        blob = TextBlob(text)
        polarity = blob.sentiment.polarity
        # Logika Sentimen
        if polarity > 0.1: sentiment = "Positif 😊"
        elif polarity < -0.1: sentiment = "Negatif 😔"
        else: sentiment = "Netral 😐"
        
        # Tambahan: Deteksi Bahasa Indonesia (Simple Mockup)
        # TextBlob defaultnya Inggris. Kalau input Indo, hasilnya sering Netral.
        # Kita force dikit logicnya kalau ada kata negatif/positif indo umum.
        if sentiment == "Netral 😐":
            text_lower = text.lower()
            if any(w in text_lower for w in ['sedih', 'buruk', 'marah', 'kecewa', 'sakit']):
                sentiment = "Negatif 😔"
            elif any(w in text_lower for w in ['senang', 'bahagia', 'suka', 'keren', 'bagus']):
                sentiment = "Positif 😊"

    except Exception as e:
        sentiment = "Netral 😐"

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
    reply = ""
    if "halo" in msg or "hi" in msg:
        reply = f"Halo! Sebagai seorang {mbti}, apa yang sedang kamu pikirkan hari ini?"
    elif "mbti" in msg:
        reply = "MBTI membagi kita jadi 16 tipe. Analisis teks kamu menunjukkan kecenderungan pola pikir unik!"
    elif "sedih" in msg or "galau" in msg:
        reply = "Gapapa merasa sedih. Tarik napas, istirahat dulu ya."
    elif "siapa" in msg and "kamu" in msg:
        reply = "Saya Sentimind AI, asisten virtual yang dibuat untuk menganalisis kepribadian dari teks."
    elif "analisis" in msg:
        reply = "Coba masuk ke menu Analyzer, tempel tulisanmu, dan aku akan tebak MBTI kamu."
    else:
        # Jawaban Random tapi Kontekstual MBTI
        responses = [
            f"Hmm, sudut pandang {mbti} memang selalu menarik.",
            "Ceritain lagi dong, aku lagi ngumpulin data pola bicaramu.",
            "Apakah kamu mengambil keputusan ini pake logika atau perasaan?",
            "Menarik... Lanjutkan ceritamu.",
            "Sori server lagi mikir keras, tapi intinya aku paham maksudmu."
        ]
        reply = random.choice(responses)
        
    return {"reply": reply}