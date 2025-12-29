import json
import os

# --- CONFIG PATH ---
# Mengambil path folder "api"
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Mengarah ke api/data/questions.json
DB_PATH = os.path.join(BASE_DIR, 'data', 'questions.json')

class QuizHandler:
    @staticmethod
    def get_questions():
        """Mengambil semua soal dari database JSON"""
        try:
            if not os.path.exists(DB_PATH):
                return []
            with open(DB_PATH, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error reading quiz db: {e}")
            return []

    @staticmethod
    def calculate_mbti(answers):
        """
        Hitung MBTI berdasarkan jawaban user.
        Format answers: { "1": 2, "2": -1, ... } (Key=ID Soal, Value=Skala -3 s/d 3)
        """
        questions = QuizHandler.get_questions()
        if not questions:
            return "UNKNOWN"
        
        # Skor Awal (Balance 0)
        scores = {'EI': 0, 'SN': 0, 'TF': 0, 'JP': 0}

        for q in questions:
            q_id = str(q['id'])
            if q_id in answers:
                # Rumus: Nilai User (-3 s/d 3) * Arah Soal (1 atau -1)
                # Contoh: Soal Introvert (Dir -1), User Jawab Sangat Setuju (3)
                # Hitungan: 3 * -1 = -3 (Skor bergerak ke arah I)
                val = int(answers[q_id])
                scores[q['dimension']] += (val * q['direction'])

        # Tentukan Hasil Akhir
        # Positif = E, S, T, J
        # Negatif = I, N, F, P
        result = ""
        result += "E" if scores['EI'] >= 0 else "I"
        result += "S" if scores['SN'] >= 0 else "N"
        result += "T" if scores['TF'] >= 0 else "F"
        result += "J" if scores['JP'] >= 0 else "P"

        return result