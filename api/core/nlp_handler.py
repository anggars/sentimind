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
        # ... (Bagian Reddit tetep sama kayak sebelumnya, gak perlu diubah)
        headers = {'User-agent': 'Sentimind-Academic-Project/1.0'}
        texts = []
        identifier = identifier.strip()
        
        try:
            if identifier.startswith("r/"):
                subreddit = identifier[2:]
                url = f"https://www.reddit.com/r/{subreddit}/hot.json?limit=15"
                response = requests.get(url, headers=headers, timeout=10)
                if response.status_code != 200: return None
                
                data = response.json()
                for item in data['data']['children']:
                    post = item['data']
                    if 'title' in post: texts.append(f"Title: {post['title']}")
                    if 'selftext' in post and post['selftext']: texts.append(post['selftext'])

            else:
                username = identifier.replace("u/", "")
                url = f"https://www.reddit.com/user/{username}/comments.json?limit=25"
                response = requests.get(url, headers=headers, timeout=10)
                if response.status_code != 200: return None
                
                data = response.json()
                for item in data['data']['children']:
                    if 'body' in item['data']:
                        texts.append(item['data']['body'])

            if not texts: return None
            
            return "\n\n------------------------------------------------\n\n".join(texts)

        except Exception as e:
            print(f"Reddit Error: {e}")
            return None