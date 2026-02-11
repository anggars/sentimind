import os
import re
import requests
import html
from deep_translator import GoogleTranslator
from youtube_transcript_api import YouTubeTranscriptApi

# --- CONFIG ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

_classifier_mbti = None
_classifier_emotion = None

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
        global _classifier_mbti, _classifier_emotion
        print(f"Loading models from HuggingFace Hub...")
        
        if _classifier_mbti is None:
            try:
                print("Loading MBTI Model: anggars/xlm-mbti")
                from transformers import pipeline
                _classifier_mbti = pipeline("text-classification", model="anggars/xlm-mbti", top_k=1)
            except Exception as e: print(f"MBTI Load Error: {e}")

        if _classifier_emotion is None:
            try:
                print("Loading Emotion Model: anggars/xlm-emotion")
                from transformers import pipeline
                _classifier_emotion = pipeline("text-classification", model="anggars/xlm-emotion", top_k=None)
            except Exception as e: print(f"Emotion Load Error: {e}")



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
        
        # --- MBTI PREDICTION (anggars/xlm-mbti) ---
        mbti_result = "UNKNOWN"
        mbti_confidence = 0.0
        
        if _classifier_mbti:
            try:
                mbti_input = processed_text[:2000]
                mbti_output = _classifier_mbti(mbti_input)
                
                # Handle nested list output
                if isinstance(mbti_output, list) and isinstance(mbti_output[0], list):
                    mbti_res = mbti_output[0][0]
                elif isinstance(mbti_output, list):
                    mbti_res = mbti_output[0]
                else:
                    mbti_res = mbti_output

                mbti_result = mbti_res['label'].upper()
                mbti_confidence = mbti_res['score']
                print(f"[MBTI] Predicted: {mbti_result} ({mbti_confidence:.2%})")

            except Exception as e:
                print(f"[Error] MBTI Prediction Error: {e}")
                mbti_result = "INTJ"
                mbti_confidence = 0.0

        # --- EMOTION PREDICTION (anggars/xlm-emotion) ---
        emotion_data = {"id": "Netral", "en": "Neutral", "raw": "neutral", "list": []}
        confidence_score = 0.0
        
        if _classifier_emotion:
            try:
                emo_input = processed_text[:1500]
                emo_output = _classifier_emotion(emo_input)
                
                # Handle nested list output
                if isinstance(emo_output, list) and isinstance(emo_output[0], list):
                    emo_output = emo_output[0]
                
                # Filter out neutral and sort by score
                scores = {item['label']: item['score'] for item in emo_output if item['label'] != 'neutral'}
                sorted_emotions = sorted(scores.items(), key=lambda x: x[1], reverse=True)
                
                if sorted_emotions:
                    best_label, best_score = sorted_emotions[0]
                    confidence_score = best_score
                    
                    indo_label = EMOTION_TRANSLATIONS.get(best_label, best_label.capitalize())
                    emotion_data = {
                        "id": indo_label, 
                        "en": best_label.capitalize(), 
                        "raw": best_label,
                        "list": []
                    }
                    
                    # Top 3 list
                    for label, score in sorted_emotions[:3]:
                        emotion_data["list"].append({
                            "en": label.capitalize(),
                            "id": EMOTION_TRANSLATIONS.get(label, label.capitalize()),
                            "score": score
                        })
                    
                    print(f"[Emotion] Top 1: {emotion_data['en']} ({confidence_score:.2%})")
                else:
                    print("[Emotion] No clear emotion found (Neutral)")

            except Exception as e:
                print(f"[Error] Emotion Prediction Error: {e}")

        # --- REASONING GENERATION ---
        mbti_desc = MBTI_EXPLANATIONS.get(mbti_result, {
            'en': "Complex personality type.", 
            'id': "Kepribadian yang cukup kompleks."
        })
        mbti_desc['confidence'] = mbti_confidence
            
        # Emotion Reasoning
        em_list_str = ""
        if emotion_data['list']:
             labels = [f"{item['en']} ({int(item['score']*100)}%)" for item in emotion_data['list']]
             em_list_str = ", ".join(labels)

        emotion_reasoning = {
            'en': f"Dominant emotion is '{emotion_data['en']}'. Mix: {em_list_str}.",
            'id': f"Emosi dominan '{emotion_data['id']}'. Campuran: {em_list_str}."
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
        print(f"Using Official API Key for {video_id}...")
        
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
            print(f"Official API Error: {e}")
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
        print(f"Fetching transcript (fallback) for: {video_id}")
        try:
            transcript_list = YouTubeTranscriptApi.get_transcript(video_id, languages=['id', 'en', 'en-US'])
            full_text = " ".join([item['text'] for item in transcript_list])
            clean_text = re.sub(r'\[.*?\]|\(.*?\)', '', full_text).strip()
            # Unescape juga buat hasil scraping
            return html.unescape(clean_text)
        except Exception:
            pass

        return None