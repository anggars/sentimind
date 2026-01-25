# api/core/chatbot.py
import os
from google import genai
from .nlp_handler import MBTI_EXPLANATIONS

class MBTIChatbot:
    def __init__(self):
        print("[INIT] Initializing MBTI Chatbot (Lite Version)...")
        # ... (rest of init)
        
        # 1. Setup Google Gemini
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("[WARN] GEMINI_API_KEY not found in .env.")
            self.client = None
        else:
            try:
                self.client = genai.Client(api_key=api_key)
            except Exception as e:
                print(f"[ERR] Gemini Client Init Failed: {e}")
                self.client = None
            
        # Model Configuration
        self.model_name = 'gemini-2.0-flash'
        
    def generate_response(self, user_query, lang="en"):
        lang_instruction = "Answer in English Slang." if lang == "en" else "Jawab dalam Bahasa Indonesia gaul (Slang Jakarta/Lo-Gue), maskulin, santai, dan to the point. Panggil user 'bro' atau 'bre'. JANGAN panggil 'bestie', 'kak', atau 'gan'. Gaya bicara tongkrongan cowok tapi tetap edukatif soal MBTI."

        # Prepare Knowledge Base String
        knowledge_base = "Here are the official MBTI definitions used in Sentimind:\n"
        for mbti, desc in MBTI_EXPLANATIONS.items():
            d_text = desc.get(lang, desc['en'])
            knowledge_base += f"- {mbti}: {d_text}\n"

        system_prompt = f"""
You are Sentimind AI, an expert in MBTI personality types and mental health.
{lang_instruction}

INTERNAL KNOWLEDGE BASE:
{knowledge_base}

USER QUERY:
{user_query}

INSTRUCTIONS:
- Answer directly based on your extensive knowledge about MBTI and Psychology.
- USE the Internal Knowledge Base for definitions if asked about specific types.
- STRICTLY REFUSE to answer questions unrelated to MBTI, Personality, Psychology, or Mental Health. 
  - If asked about coding, politics, math, or general trivia, say: "Maaf bro, gua cuma ahli soal MBTI dan Psikologi aja." (or English equivalent).
- Be empathetic, insightful, and use formatting (bullet points) if helpful.
- Keep answers concise (under 200 words) unless asked for details.
- DO NOT use emojis in your response. Keep it clean and text-only.
"""

        try:
            if not self.client:
                return "Maaf, kunci otak saya (API Key) belum dipasang atau salah."
                
            response = self.client.models.generate_content(
                model=self.model_name, 
                contents=system_prompt
            )
            return response.text
        except Exception as e:
            return f"Maaf, saya sedang mengalami gangguan koneksi ke otak AI saya. (Error: {str(e)})"
