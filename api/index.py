from fastapi import FastAPI
from dotenv import load_dotenv # <--- Import ini
import os

# 1. BACA .ENV DULUAN (Wajib Paling Atas)
# Ini biar Token kebaca sebelum kode lain jalan
load_dotenv()

# Import fungsi-fungsi modular
from api.predict import predict_endpoint
from api.quiz import get_quiz_questions, submit_quiz

app = FastAPI()

# =================================================================
#  ROUTING KHUSUS LOCAL DEVELOPMENT
# =================================================================

app.add_api_route("/api/predict", predict_endpoint, methods=["POST"])
app.add_api_route("/api/quiz", get_quiz_questions, methods=["GET"])
app.add_api_route("/api/quiz", submit_quiz, methods=["POST"])

@app.get("/api/hello")
def health_check():
    return {"status": "online", "mode": "local_dev_aggregated"}