# train_model.py
import pandas as pd
import re
import joblib
import os
from datasets import load_dataset
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

# ==========================================
# 🔧 KONFIGURASI
# ==========================================
MODEL_OUTPUT = 'api/model_mbti.pkl' 
# ==========================================

print("🔍 Sedang mengunduh dataset MBTI dari Hugging Face...")

try:
    # 1. Load Dataset dari Hugging Face (gmnsong/MBTI.csv)
    dataset = load_dataset("gmnsong/MBTI.csv", split="train")
    df = pd.DataFrame(dataset)
    
    # Dataset ini kolomnya biasanya 'type' dan 'posts'
    # Kita rename biar pasti
    df.rename(columns={'type': 'type', 'posts': 'posts'}, inplace=True)
    
    print(f"✅ Data berhasil dimuat: {len(df)} baris.")
    print("Contoh data:", df.head(1))

    X = df['posts'] # Input (Teks Curhat)
    y = df['type']  # Label (MBTI - INTJ, ENFP, dll)

except Exception as e:
    print(f"❌ Gagal memuat dataset: {e}")
    exit()

# --- CLEANING DATA ---
def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'http\S+', '', text) # Hapus Link
    text = re.sub(r'[^a-zA-Z\s]', '', text) # Hapus Angka & Simbol
    return text

print("🧹 Membersihkan data (Tunggu ya, agak lama)...")
X = X.apply(clean_text)

# --- TRAINING ---
print("🚀 Melatih Model SVM untuk MBTI...")

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Pipeline: TF-IDF -> SVM
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(max_features=5000, stop_words='english')),
    ('clf', LinearSVC(dual=False)) # dual=False biar lebih cepet
])

pipeline.fit(X_train, y_train)

# --- EVALUASI ---
predictions = pipeline.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"🎯 Akurasi Model MBTI: {accuracy * 100:.2f}%")

# --- SIMPAN MODEL ---
os.makedirs(os.path.dirname(MODEL_OUTPUT), exist_ok=True)
joblib.dump(pipeline, MODEL_OUTPUT)
print(f"💾 SUKSES! Model MBTI disimpan di: {MODEL_OUTPUT}")