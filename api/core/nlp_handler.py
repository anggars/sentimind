import joblib
import os
import re
import requests
import numpy as np
from deep_translator import GoogleTranslator

# --- CONFIG PATH ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MBTI_PATH = os.path.join(BASE_DIR, 'data', 'model_mbti.pkl')
EMOTION_PATH = os.path.join(BASE_DIR, 'data', 'model_emotion.pkl')

# --- GLOBAL VARS ---
_model_mbti = None
_model_emotion = None

# --- TRANSLATION DICT ---
EMOTION_TRANSLATIONS = {
    'admiration': 'Kagum', 'amusement': 'Terhibur', 'anger': 'Marah',
    'annoyance': 'Kesal', 'approval': 'Setuju', 'caring': 'Peduli',
    'confusion': 'Bingung', 'curiosity': 'Penasaran', 'desire': 'Keinginan',
    'disappointment': 'Kecewa', 'disapproval': 'Tidak Setuju', 'disgust': 'Jijik',
    'embarrassment': 'Malu', 'excitement': 'Semangat', 'fear': 'Takut',
    'gratitude': 'Bersyukur', 'grief': 'Berduka', 'joy': 'Gembira',
    'love': 'Cinta', 'nervousness': 'Gugup', 'optimism': 'Optimis',
    'pride': 'Bangga', 'realization': 'Sadar', 'relief': 'Lega',
    'remorse': 'Menyesal', 'sadness': 'Sedih', 'surprise': 'Terkejut',
    'neutral': 'Netral'
}

class NLPHandler:
    @staticmethod
    def load_models():
        global _model_mbti, _model_emotion
        if _model_mbti is None and os.path.exists(MBTI_PATH):
            try:
                _model_mbti = joblib.load(MBTI_PATH)
            except Exception as e:
                print(f"❌ MBTI Load Error: {e}")

        if _model_emotion is None and os.path.exists(EMOTION_PATH):
            try:
                _model_emotion = joblib.load(EMOTION_PATH)
            except Exception as e:
                print(f"❌ Emotion Load Error: {e}")

    @staticmethod
    def translate_to_english(text):
        """Terjemahkan input ke Inggris agar cocok dengan Model"""
        try:
            if len(text) > 4500: 
                text = text[:4500]
            
            translated = GoogleTranslator(source='auto', target='en').translate(text)
            return translated
        except Exception as e:
            return text

    @staticmethod
    def extract_keywords(text):
        """Ekstrak keyword dan sediakan versi ID & EN"""
        stopwords = ["the", "and", "is", "to", "in", "it", "of", "for", "with", "on", "that", "this", "my", "was", "as", "are", "have"]
        words = re.findall(r'\w+', text.lower())
        filtered = [w for w in words if len(w) > 3 and w not in stopwords]
        freq = {}
        for w in filtered:
            freq[w] = freq.get(w, 0) + 1
        sorted_words = sorted(freq.items(), key=lambda x: x[1], reverse=True)
        
        keywords_en = [w[0] for w in sorted_words[:5]]
        
        keywords_id = []
        try:
            translator = GoogleTranslator(source='auto', target='id')
            for k in keywords_en:
                keywords_id.append(translator.translate(k))
        except:
            keywords_id = keywords_en 

        return {"en": keywords_en, "id": keywords_id}

    @staticmethod
    def predict_all(raw_text):
        NLPHandler.load_models() 
        
        processed_text = NLPHandler.translate_to_english(raw_text)
        
        mbti_result = "UNKNOWN"
        if _model_mbti:
            try:
                mbti_result = _model_mbti.predict([processed_text])[0]
            except: pass
        
        # Default awal (kalau error banget)
        emotion_data = {"id": "Kompleks", "en": "Complex", "raw": "unknown"}
        
        if _model_emotion:
            try:
                pred_label = "neutral"
                
                # --- LOGIKA BARU: HAPUS NETRAL ---
                if hasattr(_model_emotion, "predict_proba"):
                    # Ambil probabilitas semua emosi (misal: Joy 20%, Neutral 60%, Sad 20%)
                    probs = _model_emotion.predict_proba([processed_text])[0]
                    classes = _model_emotion.classes_
                    
                    # Cari posisi 'neutral'
                    neutral_indices = [i for i, c in enumerate(classes) if c.lower() == 'neutral']
                    
                    # "Matikan" neutral dengan set probabilitasnya jadi 0
                    for idx in neutral_indices:
                        probs[idx] = 0.0
                    
                    # Ambil emosi dengan nilai tertinggi SISANYA
                    if np.sum(probs) > 0:
                        best_idx = np.argmax(probs)
                        pred_label = classes[best_idx]
                    else:
                        # Kalau sisa 0 semua (jarang terjadi), terpaksa prediksi biasa
                        pred_label = _model_emotion.predict([processed_text])[0]
                else:
                    # Fallback kalau model gak support probability
                    pred_label = _model_emotion.predict([processed_text])[0]

                # Format hasil akhir
                indo_label = EMOTION_TRANSLATIONS.get(pred_label, pred_label.capitalize())
                emotion_data = {
                    "id": indo_label,
                    "en": pred_label.capitalize(),
                    "raw": pred_label
                }
            except Exception as e:
                print(f"Emotion Prediction Error: {e}")
                pass
            
        return {
            "mbti": mbti_result,
            "emotion": emotion_data,
            "keywords": NLPHandler.extract_keywords(processed_text) 
        }
    
    @staticmethod
    def fetch_reddit_text(identifier):
        identifier = identifier.strip()
        
        # --- LIST SUMBER DATA (PRIORITAS) ---
        # 1. Server Mirror (Aman buat Vercel/Scraping)
        # 2. Server Asli (Buat Local yg pake VPN / Fallback terakhir)
        sources = [
            "https://reddit.invak.id",          # Mirror Indo (Biasanya kenceng di sini)
            "https://redlib.vling.moe",         # Mirror Luar 1
            "https://redlib.catsarch.com",      # Mirror Luar 2
            "https://redlib.tux.pizza",         # Mirror Luar 3
            "https://l.opnxng.com",             # Mirror Luar 4
            "https://api.reddit.com",           # Server ASLI (Cadangan terakhir)
        ]
        
        # Header pura-pura jadi browser beneran
        headers = {
            'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        
        texts = []
        
        for base_url in sources:
            try:
                print(f"🔄 Trying source: {base_url}...")
                
                if identifier.startswith("r/"):
                    subreddit = identifier[2:]
                    url = f"{base_url}/r/{subreddit}/hot.json?limit=10"
                else:
                    username = identifier.replace("u/", "")
                    url = f"{base_url}/user/{username}/comments.json?limit=25"
                
                # Timeout 8 detik biar server sempet mikir
                response = requests.get(url, headers=headers, timeout=8)
                
                # Kalau gagal akses, skip ke server berikutnya
                if response.status_code != 200:
                    print(f"⚠️ {base_url} returned {response.status_code}")
                    continue
                
                # Pastikan isinya JSON (bukan HTML error page)
                content_type = response.headers.get("Content-Type", "")
                if "application/json" not in content_type:
                    print(f"⚠️ {base_url} returned HTML (Not JSON)")
                    continue

                data = response.json()
                
                # Validasi struktur data Reddit
                children = data.get('data', {}).get('children', [])
                if not children:
                    print(f"⚠️ {base_url} data kosong/user not found")
                    continue
                    
                # Ambil isinya
                for item in children:
                    post = item.get('data', {})
                    if 'body' in post: texts.append(post['body'])
                    elif 'selftext' in post and post['selftext']: texts.append(post['selftext'])
                    elif 'title' in post: texts.append(f"Title: {post['title']}")
                
                # Kalau berhasil dapet teks, LANGSUNG BERHENTI & RETURN
                if texts:
                    print(f"✅ Success getting data from {base_url}")
                    return "\n\n------------------------------------------------\n\n".join(texts)

            except Exception as e:
                print(f"❌ Error connecting to {base_url}: {e}")
                continue # Coba server berikutnya
        
        # Kalau udah coba semua server tetep gagal
        print("❌ All sources failed.")
        return None