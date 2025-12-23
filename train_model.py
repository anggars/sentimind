import pandas as pd
import re
import joblib
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# ==========================================
# 🔧 KONFIGURASI (GANTI SESUAI GAMBAR LU)
# ==========================================
# Kalau file lu ada di dalam folder 'dataset' dan namanya 'mbti.csv':
DATASET_PATH = 'dataset/mbti.csv' 

# Output model (JANGAN UBAH INI biar connect ke API)
MODEL_OUTPUT = 'api/model_mbti.pkl' 
# ==========================================

print("🔍 Memeriksa lokasi dataset...")

# Cek apakah file ada
if not os.path.exists(DATASET_PATH):
    print(f"❌ ERROR: File tidak ditemukan di: {DATASET_PATH}")
    print(f"📂 Posisi folder saat ini: {os.getcwd()}")
    print("👉 TIPS: Cek nama file di baris 14 ('DATASET_PATH') script ini.")
    print("👉 TIPS: Pastikan file csv ada di dalam folder 'dataset' jika path-nya 'dataset/nama.csv'")
    exit()

print(f"✅ Dataset ditemukan: {DATASET_PATH}")
print("⏳ Sedang memuat dan membaca CSV...")

try:
    # Coba baca CSV. Tambah error_bad_lines=False biar kalau ada baris rusak dia skip aja
    df = pd.read_csv(DATASET_PATH, on_bad_lines='skip') 
    
    # Cek kolom. Dataset Kaggle biasanya kolomnya 'type' dan 'posts'
    # Kita ubah jadi lowercase biar aman
    df.columns = [c.lower() for c in df.columns]
    
    if 'type' not in df.columns or 'posts' not in df.columns:
        print(f"❌ ERROR: Kolom CSV tidak sesuai. Ditemukan: {df.columns}")
        print("👉 Pastikan header CSV adalah 'type' dan 'posts'")
        exit()

    X = df['posts'] # Input (Teks Curhat)
    y = df['type']  # Label (MBTI - INTJ, ENFP, dll)
    
    print(f"✅ Data berhasil dimuat: {len(df)} baris.")

except Exception as e:
    print(f"❌ Gagal membaca CSV: {e}")
    exit()

# --- CLEANING DATA ---
def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'http\S+', '', text) # Hapus Link
    text = re.sub(r'[^a-zA-Z\s]', '', text) # Hapus Angka & Simbol
    return text

print("🧹 Membersihkan data (ini mungkin memakan waktu)...")
X = X.apply(clean_text)

# --- TRAINING ---
# max_features=5000 PENTING biar file .pkl gak kegedean (biar lolos Vercel)
print("🚀 Melatih Model AI (Tunggu bentar)...")

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(max_features=5000, stop_words='english')),
    ('clf', LinearSVC()) 
])

pipeline.fit(X_train, y_train)

# --- EVALUASI ---
predictions = pipeline.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"🎯 Akurasi Model: {accuracy * 100:.2f}%")

# --- SIMPAN MODEL ---
# Pastikan folder api/ ada
os.makedirs(os.path.dirname(MODEL_OUTPUT), exist_ok=True)

joblib.dump(pipeline, MODEL_OUTPUT)
print(f"💾 SUKSES! Model disimpan di: {MODEL_OUTPUT}")
print("✅ Sekarang lakukan: git add, git commit, git push")