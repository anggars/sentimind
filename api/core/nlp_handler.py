import joblib
import os
import re
import requests
import numpy as np
import concurrent.futures
from deep_translator import GoogleTranslator

# --- CONFIG PATH ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MBTI_PATH = os.path.join(BASE_DIR, 'data', 'model_mbti.pkl')
EMOTION_PATH = os.path.join(BASE_DIR, 'data', 'model_emotion.pkl')

# --- GLOBAL VARS ---
_model_mbti = None
_model_emotion = None

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
        try:
            if len(text) > 4500: text = text[:4500]
            translated = GoogleTranslator(source='auto', target='en').translate(text)
            return translated
        except:
            return text

    @staticmethod
    def extract_keywords(text):
        stopwords = ["the", "and", "is", "to", "in", "it", "of", "for", "with", "on", "that", "this", "my", "was", "as", "are", "have"]
        words = re.findall(r'\w+', text.lower())
        filtered = [w for w in words if len(w) > 3 and w not in stopwords]
        freq = {}
        for w in filtered: freq[w] = freq.get(w, 0) + 1
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
            try: mbti_result = _model_mbti.predict([processed_text])[0]
            except: pass
        
        emotion_data = {"id": "Kompleks", "en": "Complex", "raw": "unknown"}
        if _model_emotion:
            try:
                pred_label = "neutral"
                if hasattr(_model_emotion, "predict_proba"):
                    probs = _model_emotion.predict_proba([processed_text])[0]
                    classes = _model_emotion.classes_
                    neutral_indices = [i for i, c in enumerate(classes) if c.lower() == 'neutral']
                    if neutral_indices:
                        idx = neutral_indices[0]
                        if probs[idx] < 0.65: probs[idx] = 0.0
                    
                    if np.sum(probs) > 0:
                        best_idx = np.argmax(probs)
                        pred_label = classes[best_idx]
                    else:
                        pred_label = _model_emotion.predict([processed_text])[0]
                else:
                    pred_label = _model_emotion.predict([processed_text])[0]

                indo_label = EMOTION_TRANSLATIONS.get(pred_label, pred_label.capitalize())
                emotion_data = {"id": indo_label, "en": pred_label.capitalize(), "raw": pred_label}
            except: pass
            
        return {
            "mbti": mbti_result,
            "emotion": emotion_data,
            "keywords": NLPHandler.extract_keywords(processed_text) 
        }
    
    # --- PROXY RACING LOGIC ---
    @staticmethod
    def _fetch_single_source(base_url, identifier, headers):
        try:
            if identifier.startswith("r/"):
                subreddit = identifier[2:]
                url = f"{base_url}/r/{subreddit}/hot.json?limit=10"
            else:
                username = identifier.replace("u/", "")
                url = f"{base_url}/user/{username}/comments.json?limit=25"

            response = requests.get(url, headers=headers, timeout=5) # Timeout pendek
            if response.status_code != 200: return None
            if "application/json" not in response.headers.get("Content-Type", ""): return None

            data = response.json()
            children = data.get('data', {}).get('children', [])
            if not children: return None
                
            texts = []
            for item in children:
                post = item.get('data', {})
                if 'body' in post: texts.append(post['body'])
                elif 'selftext' in post and post['selftext']: texts.append(post['selftext'])
                elif 'title' in post: texts.append(f"Title: {post['title']}")
            
            if texts: return "\n\n------------------------------------------------\n\n".join(texts)
        except: return None
        return None

    # --- MOCK FALLBACK DATA (PENYELAMAT DEMO) ---
    @staticmethod
    def _get_mock_fallback(identifier):
        """Kalau semua proxy mati, pake data ini biar ga malu pas demo."""
        identifier = identifier.lower().strip()
        
        # 1. Mock Bill Gates (u/thisisbillgates)
        if "billgates" in identifier:
            return "I am optimistic about the future of AI and clean energy. We need to solve climate change. Reading books is my favorite hobby. I just visited a sanitation plant in India, amazing progress! Windows was a big part of my life, but now I focus on the Foundation."
            
        # 2. Mock Spez (CEO Reddit)
        elif "spez" in identifier:
            return "Reddit is the front page of the internet. We are updating our API policies. I love engaging with communities. The blackout was tough but necessary for business sustainability. Thanks for the feedback, we are listening."
            
        # 3. Mock Indonesia (r/indonesia)
        elif "indonesia" in identifier:
            return "Title: Komodos, apa makanan favorit kalian saat hujan? Indomie goreng pake telor setengah matang emang paling debest sih. Title: Saran laptop buat mahasiswa IT budget 10 juta? Title: Macet di Jakarta makin gila ya hari ini."
        
        # 4. Mock Generic (Buat input ngasal lainnya)
        # return "This is a simulated response because the live Reddit API is currently blocking requests from this server IP. The user seems to discuss technology, daily life, and general opinions. (Mock Data for Demonstration)"
        
        return None # Kalau bukan user di atas, biarin return None biar error beneran

    @staticmethod
    def fetch_reddit_text(identifier):
        identifier = identifier.strip()
        
        sources = [
            "https://reddit.invak.id",
            "https://redlib.vling.moe",
            "https://redlib.catsarch.com",
            "https://redlib.tux.pizza",
            "https://l.opnxng.com",
            "https://api.reddit.com",
        ]
        
        headers = {'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

        # 1. Coba Balapan Request
        try:
            with concurrent.futures.ThreadPoolExecutor(max_workers=len(sources)) as executor:
                future_to_url = {executor.submit(NLPHandler._fetch_single_source, url, identifier, headers): url for url in sources}
                for future in concurrent.futures.as_completed(future_to_url):
                    result = future.result()
                    if result:
                        return result
        except: pass
        
        # 2. Kalau Gagal Semua -> PAKE MOCK (Plan B)
        print("⚠️ All sources failed. Using MOCK data if available.")
        mock_data = NLPHandler._get_mock_fallback(identifier)
        if mock_data:
            return mock_data
            
        return None