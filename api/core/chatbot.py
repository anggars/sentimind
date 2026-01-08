# api/core/chatbot.py
import os
import google.generativeai as genai
import pandas as pd
from datasets import load_dataset
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class MBTIChatbot:
    def __init__(self):
        print("🚀 Initializing MBTI Chatbot...")
        
        # 1. Setup Google Gemini
        # Ambil dari env variabel (loaded by dotenv di index.py)
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("⚠️ WARNING: GEMINI_API_KEY not found in .env. Chatbot will likely fail.")
        else:
            genai.configure(api_key=api_key)
            
        try:
            self.model = genai.GenerativeModel('gemini-2.0-flash')
        except Exception:
            print("⚠️ 2.0 Flash failed, fallback to Lite")
            self.model = genai.GenerativeModel('gemini-2.0-flash-lite')
        
        # 2. Load & Prepare Knowledge Base (RAG)
        self.documents = []
        self.vectorizer = None
        self.tfidf_matrix = None
        self._load_knowledge_base()

    def _load_knowledge_base(self):
        try:
            print("📚 Loading MBTI Dataset (gmnsong/MBTI)...")
            # Load dataset dari Hugging Face
            dataset = load_dataset("gmnsong/MBTI", split="train")
            df = pd.DataFrame(dataset)
            
            # Kita ambil sampel biar gak terlalu berat loadnya
            if len(df) > 2000:
                df = df.sample(2000, random_state=42)
            
            self.documents = df.apply(lambda x: f"Type: {x.get('label', 'Unknown')}\nPost: {x.get('text', '')[:500]}...", axis=1).tolist()
            
            print("🧠 Building Search Index (TF-IDF)...")
            self.vectorizer = TfidfVectorizer(stop_words='english')
            self.tfidf_matrix = self.vectorizer.fit_transform(self.documents)
            print("✅ Knowledge Base Ready!")
            
        except Exception as e:
            print(f"❌ Error loading knowledge base: {e}")
            self.documents = ["MBTI is a personality framework.", "There are 16 MBTI types."]
            self.vectorizer = TfidfVectorizer(stop_words='english')
            self.tfidf_matrix = self.vectorizer.fit_transform(self.documents)

    def _get_relevant_context(self, query, top_k=3):
        """Mencari 3 dokumen paling mirip dari dataset MBTI"""
        try:
            query_vec = self.vectorizer.transform([query])
            cosine_scores = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
            
            top_indices = cosine_scores.argsort()[-top_k:][::-1]
            results = [self.documents[i] for i in top_indices]
            return "\n\n".join(results)
        except Exception:
            return ""

    def generate_response(self, user_query, lang="en"):
        # 1. Cari Konteks Relevan (RAG)
        context = self._get_relevant_context(user_query)
        
        # 2. Tentukan Bahasa Prompt
        lang_instruction = "Answer in English." if lang == "en" else "Jawab dalam Bahasa Indonesia gaul (Slang Jakarta/Lo-Gue), maskulin, santai, dan to the point. Panggil user 'bro' atau 'bre'. JANGAN panggil 'bestie', 'kak', atau 'gan'. Gaya bicara tongkrongan cowok tapi tetap edukatif soal MBTI."

        # 3. Susun Prompt
        system_prompt = f"""
You are Sentimind AI, an expert in MBTI personality types and mental health.
{lang_instruction}

CONTEXT FROM DATABASE:
{context}

USER QUERY:
{user_query}

INSTRUCTIONS:
- Use the provided CONTEXT to ground your answer if relevant.
- If the user asks about something completely unrelated to MBTI, Psychology, or Mental Health (e.g. "How to cook rice", "Coding in Java"), politely decline and steer them back to MBTI.
- Be empathetic, insightful, and use formatting (bullet points) if helpful.
- Keep answers concise (under 200 words) unless asked for details.
"""
        
        try:
            response = self.model.generate_content(system_prompt)
            return response.text
        except Exception as e:
            return f"Maaf, saya sedang mengalami gangguan koneksi ke otak AI saya. (Error: {str(e)})"
