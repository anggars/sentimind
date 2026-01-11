import joblib
import os
import re
import requests
import numpy as np
import html
from deep_translator import GoogleTranslator
from youtube_transcript_api import YouTubeTranscriptApi
import google.generativeai as genai

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


MBTI_EXPLANATIONS = {
    'ISTJ': {'en': "The Logistician. Practical and fact-minded individuals, whose reliability cannot be doubted.", 
             'id': "Si Organisator. Lo orangnya logis, praktis, dan bisa diandelin banget. Anti ribet-ribet club."},
    'ISFJ': {'en': "The Defender. Very dedicated and warm protectors, always ready to defend their loved ones.", 
             'id': "Si Pelindung. Hati lo lembut, setia, dan care banget sama orang terdekat. Temen curhat terbaik."},
    'INFJ': {'en': "The Advocate. Quiet and mystical, yet very inspiring and tireless idealists.", 
             'id': "Si Visioner Misterius. Lo peka, idealis, dan suka mikirin makna hidup mendalam. Langka nih!"},
    'INTJ': {'en': "The Architect. Imaginative and strategic thinkers, with a plan for everything.", 
             'id': "Si Strategis. Otak lo jalan terus, visioner, dan selalu punya rencana cadangan buat segala hal."},
    'ISTP': {'en': "The Virtuoso. Bold and practical experimenters, masters of all kinds of tools.", 
             'id': "Si Pengrajin. Lo cool, santuy, tapi jago banget mecahin masalah teknis secara praktis."},
    'ISFP': {'en': "The Adventurer. Flexible and charming artists, always ready to explore and experience something new.", 
             'id': "Si Seniman Bebas. Lo estetik, santai, dan suka banget nge-explore hal baru tanpa banyak drama."},
    'INFP': {'en': "The Mediator. Poetic, kind and altruistic people, always eager to help a good cause.", 
             'id': "Si Paling Perasa. Hati lo kayak kapas, puitis, idealis banget, dan selalu mau bikin dunia lebih baik."},
    'INTP': {'en': "The Logician. Innovative inventors with an unquenchable thirst for knowledge.", 
             'id': "Si Pemikir Kritis. Lo kepoan parah, logis abis, dan suka banget debat teori sampe pagi."},
    'ESTP': {'en': "The Entrepreneur. Smart, energetic and very perceptive people, who truly enjoy living on the edge.", 
             'id': "Si Pemberani. Lo enerjik, spontan, dan jago banget ngambil peluang dalam situasi mepet."},
    'ESFP': {'en': "The Entertainer. Spontaneous, energetic and enthusiastic people - life is never boring around them.", 
             'id': "Si Penghibur. Lo asik parah, spontan, dan selalu jadi pusat perhatian di tongkrongan."},
    'ENFP': {'en': "The Campaigner. Enthusiastic, creative and sociable free spirits, who can always find a reason to smile.", 
             'id': "Si Semangat 45. Lo kreatif, ramah, dan punya energi positif yang nular ke semua orang."},
    'ENTP': {'en': "The Debater. Smart and curious thinkers who cannot resist an intellectual challenge.", 
             'id': "Si Pendebat Ulung. Lo pinter, kritis, dan iseng banget suka mancing debat cuma buat seru-seruan."},
    'ESTJ': {'en': "The Executive. Excellent administrators, unsurpassed at managing things - or people.", 
             'id': "Si Bos Tegas. Lo jago ngatur, disiplin, dan gak suka liat ada yang lelet atau berantakan."},
    'ESFJ': {'en': "The Consul. Extraordinarily caring, social and popular people, always eager to help.", 
             'id': "Si Paling Gaul. Lo ramah, suka nolong, dan care banget sama harmoni di sirkel pertemanan."},
    'ENFJ': {'en': "The Protagonist. Charismatic and inspiring leaders, able to mesmerize their listeners.", 
             'id': "Si Pemimpin Karismatik. Lo jago banget ngomong, inspiratif, dan bisa bikin orang lain nurut sama lo."},
    'ENTJ': {'en': "The Commander. Bold, imaginative and strong-willed leaders, always finding a way - or making one.", 
             'id': "Si Jenderal. Lo ambisius, tegas, dan punya bakat alami buat mimpin dan naklukin tantangan."}
}

class NLPHandler:
    # ... code before ...
    # (The existing static methods load_models, translate_to_english, extract_keywords are unchanged)
    # Re-writing predict_all to include explanation logic

    @staticmethod
    def load_models():
        global _model_mbti, _model_emotion
        print(f"📂 Loading models from: {BASE_DIR}")
        
        if _model_mbti is None and os.path.exists(MBTI_PATH):
            try: 
                _model_mbti = joblib.load(MBTI_PATH)
            except Exception as e: print(f"❌ MBTI Load Error: {e}")
        
        if _model_emotion is None and os.path.exists(EMOTION_PATH):
            try: 
                _model_emotion = joblib.load(EMOTION_PATH)
            except Exception as e: print(f"❌ Emotion Load Error: {e}")

    # --- GEMINI VALIDATOR SETUP ---
    _gemini_model = None
    
    @staticmethod
    def _init_gemini():
        """Initialize Gemini model for validation (lazy loading)"""
        if NLPHandler._gemini_model is None:
            api_key = os.getenv("GEMINI_API_KEY")
            if api_key:
                try:
                    genai.configure(api_key=api_key)
                    NLPHandler._gemini_model = genai.GenerativeModel('gemini-2.0-flash-lite')
                    print("✅ Gemini Validator Ready")
                except Exception as e:
                    print(f"⚠️ Gemini Init Failed: {e}")
        return NLPHandler._gemini_model is not None
    
    @staticmethod
    def _validate_with_gemini(text, ml_prediction):
        """
        Use Gemini to validate ML prediction.
        Returns: (validated_mbti, confidence, reasoning)
        """
        if not NLPHandler._init_gemini():
            return ml_prediction, 0.6, "ML only (Gemini unavailable)"
        
        # Skip validation for very short text (not enough context)
        if len(text.split()) < 50:
            return ml_prediction, 0.5, "Short text - ML prediction"
        
        prompt = f"""You are an MBTI expert. Analyze this text and determine the MOST LIKELY MBTI type based ONLY on the content.

TEXT TO ANALYZE:
"{text}"

ANALYSIS FRAMEWORK:
1. I/E (Introversion/Extraversion):
   - E indicators: Mentions of social events, leading teams, networking, group activities, energized by people
   - I indicators: Preference for solitude, reflection, working alone, drained by social interaction

2. N/S (Intuition/Sensing):
   - N indicators: Abstract thinking, future-focused, big picture, patterns, possibilities, theory
   - S indicators: Concrete details, present-focused, practical, facts, reality, hands-on

3. T/F (Thinking/Feeling):
   - T indicators: Logic, efficiency, objectivity, direct communication, "facts over feelings"
   - F indicators: Empathy, harmony, values, subjective decisions, people-focused

4. J/P (Judging/Perceiving):
   - J indicators: Planning, structure, deadlines, organization, schedules, decisive
   - P indicators: Spontaneous, flexible, adaptable, open-ended, exploratory

CRITICAL INSTRUCTIONS:
- Analyze INDEPENDENTLY - ignore any preconceptions
- Look for EXPLICIT behavioral indicators in the text
- Weight E/I heavily on social energy language (not just content topic)
- If text mentions "leading", "networking", "team meetings" → strong E signal
- If text emphasizes "planning", "deadlines", "structure" → strong J signal

Respond in this EXACT format:
MBTI: [4-letter type]
CONFIDENCE: [0.0-1.0]
REASON: [One sentence citing specific text evidence]

Example:
MBTI: ENTJ
CONFIDENCE: 0.88
REASON: Explicit mentions of networking, leading teams, and structured planning indicate ENTJ.
"""
        
        try:
            response = NLPHandler._gemini_model.generate_content(prompt)
            result_text = response.text.strip()
            
            # Parse response
            lines = result_text.split('\n')
            validated_mbti = ml_prediction
            confidence = 0.7
            reason = "Gemini validation"
            
            for line in lines:
                if line.startswith('MBTI:'):
                    validated_mbti = line.split(':', 1)[1].strip().upper()
                elif line.startswith('CONFIDENCE:'):
                    try:
                        confidence = float(line.split(':', 1)[1].strip())
                    except:
                        confidence = 0.7
                elif line.startswith('REASON:'):
                    reason = line.split(':', 1)[1].strip()
            
            # Validate MBTI format (must be 4 chars)
            if len(validated_mbti) != 4 or not all(c in 'IENTFSJP' for c in validated_mbti):
                print(f"⚠️ Invalid Gemini MBTI: {validated_mbti}, using ML: {ml_prediction}")
                return ml_prediction, 0.6, "Invalid Gemini response - using ML"
            
            return validated_mbti, confidence, reason
            
        except Exception as e:
            print(f"⚠️ Gemini Validation Error: {e}")
            return ml_prediction, 0.6, f"Gemini error - using ML"

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
        
        # --- MBTI PREDICTION WITH GEMINI VALIDATION ---
        mbti_result = "UNKNOWN"
        mbti_confidence = 0.0
        mbti_reasoning = ""
        
        if _model_mbti:
            try:
                # Step 1: ML Model Prediction
                ml_prediction = _model_mbti.predict([processed_text])[0]
                print(f"📊 ML Prediction: {ml_prediction}")
                
                # Step 2: Gemini Validation (only if text is substantial)
                if len(raw_text.split()) >= 50:
                    validated_mbti, confidence, reason = NLPHandler._validate_with_gemini(
                        processed_text, ml_prediction
                    )
                    mbti_result = validated_mbti
                    mbti_confidence = confidence
                    mbti_reasoning = reason
                    
                    if validated_mbti != ml_prediction:
                        print(f"🔄 Gemini Override: {ml_prediction} → {validated_mbti} (Confidence: {confidence:.2f})")
                    else:
                        print(f"✅ Gemini Confirmed: {validated_mbti} (Confidence: {confidence:.2f})")
                else:
                    # Text too short for Gemini, use ML only
                    mbti_result = ml_prediction
                    mbti_confidence = 0.6
                    mbti_reasoning = "Short text - ML prediction only"
                    print(f"⚠️ Text too short (<50 words), using ML: {ml_prediction}")
                    
            except Exception as e:
                print(f"❌ MBTI Prediction Error: {e}")
                mbti_result = "INTJ"  # Fallback
                mbti_confidence = 0.3
                mbti_reasoning = "Error - fallback prediction"
        
        # --- EMOTION PREDICTION & CONFIDENCE ---
        emotion_data = {"id": "Kompleks", "en": "Complex", "raw": "unknown"}
        confidence_score = 0.0
        
        if _model_emotion:
            try:
                pred_label = "neutral"
                if hasattr(_model_emotion, "predict_proba"):
                    probs = _model_emotion.predict_proba([processed_text])[0]
                    classes = _model_emotion.classes_
                    
                    # Neutral dampening logic
                    neutral_indices = [i for i, c in enumerate(classes) if c.lower() == 'neutral']
                    if neutral_indices:
                        idx = neutral_indices[0]
                        if probs[idx] < 0.65: probs[idx] = 0.0
                        
                    # RE-NORMALIZE PROBABILITIES
                    # Agar sisa probabilitas naik proporsional. 
                    # Misal: [0.1, 0.1, 0.1, 0.0] -> [0.33, 0.33, 0.33, 0.0]
                    total_prob = np.sum(probs)
                    if total_prob > 0:
                        probs = probs / total_prob
                        
                    if np.sum(probs) > 0:
                        best_idx = np.argmax(probs)
                        pred_label = classes[best_idx]
                        confidence_score = float(probs[best_idx])
                    else:
                        pred_label = _model_emotion.predict([processed_text])[0]
                else:
                    pred_label = _model_emotion.predict([processed_text])[0]

                indo_label = EMOTION_TRANSLATIONS.get(pred_label, pred_label.capitalize())
                emotion_data = {"id": indo_label, "en": pred_label.capitalize(), "raw": pred_label}
            except: pass

        # --- REASONING GENERATION ---
        mbti_desc = MBTI_EXPLANATIONS.get(mbti_result, {
            'en': "Complex personality type.", 
            'id': "Kepribadian yang cukup kompleks."
        })
        
        # Add Gemini reasoning to MBTI description
        if mbti_reasoning:
            mbti_desc['validation'] = mbti_reasoning
            mbti_desc['confidence'] = mbti_confidence

        # Emotion Reasoning
        conf_percent = int(confidence_score * 100)
        emotion_reasoning = {
            'en': f"Based on the text pattern, the AI is {conf_percent}% confident this matches '{emotion_data['en']}'.",
            'id': f"Dari gaya tulisan lo, AI {conf_percent}% yakin mood lo lagi '{emotion_data['id']}'."
        }
        if conf_percent < 50 and confidence_score > 0:
            emotion_reasoning = {
                'en': f"The sentiment is mixed, but slightly leans towards '{emotion_data['en']}' ({conf_percent}%).",
                'id': f"Mood lo campur aduk, tapi agak condong ke '{emotion_data['id']}' dikit ({conf_percent}%)."
            }

        # Keywords Reasoning
        keywords_reasoning = {
            'en': "These words appeared most frequently and define the main topic.",
            'id': "Kata-kata ini paling sering muncul dan jadi inti topik lo."
        }

        return {
            "mbti": mbti_result,
            "emotion": emotion_data,
            "keywords": NLPHandler.extract_keywords(processed_text),
            "reasoning": {
                "mbti": mbti_desc,
                "emotion": emotion_reasoning,
                "keywords": keywords_reasoning
            }
        }

    # --- JALUR RESMI: YOUTUBE DATA API ---
    @staticmethod
    def _fetch_official_api(video_id, api_key):
        print(f"🔑 Using Official API Key for {video_id}...")
        
        result = {
            "video": None,
            "comments": [],
            "text_for_analysis": ""
        }
        text_parts = []
        
        try:
            # 1. Ambil Metadata Video
            url_meta = f"https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id={video_id}&key={api_key}"
            res_meta = requests.get(url_meta, timeout=5)
            
            if res_meta.status_code == 200:
                data = res_meta.json()
                if "items" in data and len(data["items"]) > 0:
                    item = data["items"][0]
                    snippet = item["snippet"]
                    stats = item.get("statistics", {})
                    
                    # Unescape HTML entities
                    title = html.unescape(snippet['title'])
                    desc = html.unescape(snippet['description'])
                    
                    # Get best thumbnail
                    thumbnails = snippet.get('thumbnails', {})
                    thumbnail = (thumbnails.get('maxres') or thumbnails.get('high') or thumbnails.get('medium') or thumbnails.get('default', {})).get('url', '')
                    
                    result["video"] = {
                        "title": title,
                        "description": desc,
                        "thumbnail": thumbnail,
                        "channel": snippet.get('channelTitle', 'Unknown Channel'),
                        "publishedAt": snippet.get('publishedAt', ''),
                        "viewCount": stats.get('viewCount', '0'),
                        "likeCount": stats.get('likeCount', '0'),
                        "commentCount": stats.get('commentCount', '0')
                    }
                    
                    text_parts.append(title)
                    text_parts.append(desc)
            
            # 2. Ambil Komentar dengan detail
            url_comm = f"https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId={video_id}&maxResults=20&order=relevance&key={api_key}"
            res_comm = requests.get(url_comm, timeout=5)
            
            if res_comm.status_code == 200:
                data = res_comm.json()
                for item in data.get("items", []):
                    comment_snippet = item["snippet"]["topLevelComment"]["snippet"]
                    raw_text = comment_snippet.get("textDisplay", "")
                    clean_text = re.sub(r'<[^>]+>', '', raw_text)
                    clean_text = html.unescape(clean_text)
                    
                    result["comments"].append({
                        "text": clean_text,
                        "author": comment_snippet.get("authorDisplayName", "Anonymous"),
                        "authorImage": comment_snippet.get("authorProfileImageUrl", ""),
                        "likeCount": comment_snippet.get("likeCount", 0),
                        "publishedAt": comment_snippet.get("publishedAt", ""),
                        "replyCount": item["snippet"].get("totalReplyCount", 0)
                    })
                    
                    text_parts.append(clean_text)
            
            if not text_parts:
                return None
            
            result["text_for_analysis"] = " ".join(text_parts)
            return result

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