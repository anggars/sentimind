import joblib
import os
import re
import requests
import numpy as np
import html
from deep_translator import GoogleTranslator
from youtube_transcript_api import YouTubeTranscriptApi

# --- CONFIG PATH ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MBTI_PATH = os.path.join(BASE_DIR, 'data', 'model_mbti.pkl')
EMOTION_PATH = os.path.join(BASE_DIR, 'data', 'model_emotion.pkl')

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
            try: _model_mbti = joblib.load(MBTI_PATH)
            except: pass
        if _model_emotion is None and os.path.exists(EMOTION_PATH):
            try: _model_emotion = joblib.load(EMOTION_PATH)
            except: pass

    @staticmethod
    def translate_to_english(text):
        try:
            if len(text) > 4500: text = text[:4500]
            return GoogleTranslator(source='auto', target='en').translate(text)
        except: return text

    @staticmethod
    def extract_keywords(text):
        stopwords = ["the", "and", "is", "to", "in", "it", "of", "for", "with", "on", "that", "this", "my", "was", "as", "are", "have", "you", "but", "so", "ini", "itu", "dan", "yang", "di", "ke"]
        words = re.findall(r'\w+', text.lower())
        filtered = [w for w in words if len(w) > 3 and w not in stopwords]
        freq = {}
        for w in filtered: freq[w] = freq.get(w, 0) + 1
        sorted_words = sorted(freq.items(), key=lambda x: x[1], reverse=True)
        
        keywords_en = [w[0] for w in sorted_words[:5]]
        keywords_id = []
        try:
            translator = GoogleTranslator(source='auto', target='id')
            for k in keywords_en: keywords_id.append(translator.translate(k))
        except: keywords_id = keywords_en 
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

    # --- JALUR RESMI: YOUTUBE DATA API ---
    @staticmethod
    def _fetch_official_api(video_id, api_key):
        print(f"🔑 Using Official API Key for {video_id}...")
        text_parts = []
        
        try:
            # 1. Ambil Metadata
            url_meta = f"https://www.googleapis.com/youtube/v3/videos?part=snippet&id={video_id}&key={api_key}"
            res_meta = requests.get(url_meta, timeout=5)
            
            if res_meta.status_code == 200:
                data = res_meta.json()
                if "items" in data and len(data["items"]) > 0:
                    snippet = data["items"][0]["snippet"]
                    # Unescape biar &quot; jadi " dan &#39; jadi '
                    title = html.unescape(snippet['title'])
                    desc = html.unescape(snippet['description'])
                    text_parts.append(f"Title: {title}")
                    text_parts.append(f"Description: {desc}")
            
            # 2. Ambil Komentar
            url_comm = f"https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId={video_id}&maxResults=30&order=relevance&key={api_key}"
            res_comm = requests.get(url_comm, timeout=5)
            
            if res_comm.status_code == 200:
                data = res_comm.json()
                comments = []
                for item in data.get("items", []):
                    raw_comm = item["snippet"]["topLevelComment"]["snippet"]["textDisplay"]
                    # Bersihkan tag HTML <b> <br>
                    clean_comm = re.sub(r'<[^>]+>', '', raw_comm)
                    # Bersihkan entities &quot; &#39;
                    clean_comm = html.unescape(clean_comm)
                    comments.append(clean_comm)
                
                if comments:
                    text_parts.append("\n\n--- Top Comments (Community Vibe) ---\n")
                    text_parts.extend(comments)
            
            if not text_parts:
                return None
                
            return "\n\n".join(text_parts)

        except Exception as e:
            print(f"❌ Official API Error: {e}")
            return None

    @staticmethod
    def fetch_youtube_transcript(video_id):
        # 1. PRIORITAS UTAMA: Cek API Key
        api_key = os.getenv("YOUTUBE_API_KEY")
        
        if api_key:
            official_data = NLPHandler._fetch_official_api(video_id, api_key)
            if official_data:
                return official_data
        
        # 2. PRIORITAS KEDUA: Fallback Scraping
        print(f"🎬 Fetching transcript (fallback) for: {video_id}")
        try:
            transcript_list = YouTubeTranscriptApi.get_transcript(video_id, languages=['id', 'en', 'en-US'])
            full_text = " ".join([item['text'] for item in transcript_list])
            clean_text = re.sub(r'\[.*?\]|\(.*?\)', '', full_text).strip()
            # Unescape juga buat hasil scraping
            return html.unescape(clean_text)
        except Exception:
            pass

        return None