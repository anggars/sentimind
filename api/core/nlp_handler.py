import joblib
import os
import re
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
            # Batasi panjang teks agar tidak timeout
            if len(text) > 4500: 
                text = text[:4500]
            
            # Auto-detect language & translate to 'en'
            translated = GoogleTranslator(source='auto', target='en').translate(text)
            return translated
        except Exception as e:
            print(f"⚠️ Translation Failed: {e}")
            return text # Fallback ke teks asli kalau gagal

    @staticmethod
    def extract_keywords(text):
        stopwords = ["the", "and", "is", "to", "in", "it", "of", "for", "with", "on", "that", "this", "my", "was", "as"]
        words = re.findall(r'\w+', text.lower())
        filtered = [w for w in words if len(w) > 3 and w not in stopwords]
        freq = {}
        for w in filtered:
            freq[w] = freq.get(w, 0) + 1
        sorted_words = sorted(freq.items(), key=lambda x: x[1], reverse=True)
        return [w[0] for w in sorted_words[:5]]

    @staticmethod
    def predict_all(raw_text):
        NLPHandler.load_models() 
        
        # 1. TRANSLATE DULU (Penting!)
        # Input: "Aku sedih banget" -> Output: "I am very sad"
        # Model cuma ngerti "sad", ga ngerti "sedih"
        processed_text = NLPHandler.translate_to_english(raw_text)
        
        # 2. Prediksi MBTI (Pakai teks Inggris)
        mbti_result = "UNKNOWN"
        if _model_mbti:
            try:
                mbti_result = _model_mbti.predict([processed_text])[0]
            except: pass
        
        # 3. Prediksi Emosi (Pakai teks Inggris)
        emotion_data = {"id": "Netral", "en": "Neutral", "raw": "neutral"}
        if _model_emotion:
            try:
                pred_label = _model_emotion.predict([processed_text])[0]
                indo_label = EMOTION_TRANSLATIONS.get(pred_label, pred_label.capitalize())
                emotion_data = {
                    "id": indo_label,
                    "en": pred_label.capitalize(),
                    "raw": pred_label
                }
            except: pass
            
        return {
            "mbti": mbti_result,
            "emotion": emotion_data,
            # Keywords diambil dari teks yang sudah ditranslate biar relevan
            "keywords": NLPHandler.extract_keywords(processed_text) 
        }