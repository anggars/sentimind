# api/core/chatbot.py
import os
import google.generativeai as genai

class MBTIChatbot:
    def __init__(self):
        print("🚀 Initializing MBTI Chatbot (Lite Version)...")
        
        # 1. Setup Google Gemini
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("⚠️ WARNING: GEMINI_API_KEY not found in .env.")
        else:
            genai.configure(api_key=api_key)
            
        try:
            # Pake Gemini 2.0 Flash (Standard)
            self.model = genai.GenerativeModel('gemini-2.0-flash')
        except Exception:
            print("⚠️ 2.0 Flash failed, fallback to Lite")
            self.model = genai.GenerativeModel('gemini-2.0-flash-lite')
        
    def generate_response(self, user_query, lang="en"):
        # Versi Lite: Gak pake RAG (Database lokal), langsung pake knowledge LLM yang luas.
        
        lang_instruction = "Answer in English." if lang == "en" else "Jawab dalam Bahasa Indonesia gaul (Slang Jakarta/Lo-Gue), maskulin, santai, dan to the point. Panggil user 'bro' atau 'bre'. JANGAN panggil 'bestie', 'kak', atau 'gan'. Gaya bicara tongkrongan cowok tapi tetap edukatif soal MBTI."

        system_prompt = f"""
You are Sentimind AI, an expert in MBTI personality types and mental health.
{lang_instruction}

USER QUERY:
{user_query}

INSTRUCTIONS:
- Answer directly based on your extensive knowledge about MBTI and Psychology.
- Be empathetic, insightful, and use formatting (bullet points) if helpful.
- Keep answers concise (under 200 words) unless asked for details.
"""
        try:
            response = self.model.generate_content(system_prompt)
            return response.text
        except Exception as e:
            return f"Maaf, saya sedang mengalami gangguan koneksi ke otak AI saya. (Error: {str(e)})"
