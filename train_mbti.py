# train_mbti.py
import pandas as pd
import re
import joblib
import os
from datasets import load_dataset
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_recall_fscore_support

# ==========================================
# 🔧 KONFIGURASI
# ==========================================
MODEL_OUTPUT = 'api/data/model_mbti.pkl' 
# ==========================================

print("🔍 Mengunduh dataset MBTI (7000 Data)...")

try:
    # Kita pake dataset yang pasti jalan aja
    dataset = load_dataset("gmnsong/MBTI.csv", split="train")
    df = pd.DataFrame(dataset)
    
    # Pastikan nama kolom benar
    if 'type' not in df.columns:
        df.rename(columns={'label': 'type', 'text': 'posts'}, inplace=True)
    
    X = df['posts']
    y = df['type']
    print(f"✅ Data siap: {len(df)} baris.")

except Exception as e:
    print(f"❌ Error: {e}")
    exit()

# --- CLEANING DATA ---
def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'http\S+', '', text) 
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

print("🧹 Membersihkan data...")
X = X.apply(clean_text)

# --- TRAINING ---
print("🚀 Melatih Model MBTI (SVM Optimized)...")

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(
        max_features=15000,      # Fitur diperbanyak dikit
        stop_words='english',
        ngram_range=(1, 2),      # Unigram + Bigram
        sublinear_tf=True        # [TRICK] Scaling logaritmik biar kata umum gak dominan
    )),
    ('clf', LinearSVC(
        dual=False,              # Wajib False buat dataset teks > 1000
        C=0.6,                   # Sedikit melonggarkan regularisasi
        class_weight='balanced'  # Tetap balanced biar F1-Score bagus
    ))
])

pipeline.fit(X_train, y_train)

# --- EVALUASI ---
print("📊 Menghitung Metrik Evaluasi...")
predictions = pipeline.predict(X_test)

accuracy = accuracy_score(y_test, predictions)
precision, recall, f1, _ = precision_recall_fscore_support(y_test, predictions, average='weighted', zero_division=0)

print("\n" + "="*40)
print("   HASIL EVALUASI MODEL MBTI (FINAL)")
print("="*40)
print(f"{'Metrik':<15} | {'Skor':<10}")
print("-" * 30)
print(f"{'Akurasi':<15} | {accuracy:.3f} ({accuracy*100:.1f}%)")
print(f"{'Precision':<15} | {precision:.3f}")
print(f"{'Recall':<15} | {recall:.3f}")
print(f"{'F1-Score':<15} | {f1:.3f}")
print("="*40 + "\n")

os.makedirs(os.path.dirname(MODEL_OUTPUT), exist_ok=True)
joblib.dump(pipeline, MODEL_OUTPUT)
print(f"💾 SUKSES! Model MBTI disimpan di: {MODEL_OUTPUT}")