# train_emotion.py
import pandas as pd
import joblib
import os
from datasets import load_dataset
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# ==========================================
# 🔧 KONFIGURASI
# ==========================================
MODEL_OUTPUT = 'api/model_emotion.pkl' 
# ==========================================

print("🔍 Sedang mengunduh dataset GoEmotions dari Hugging Face...")

try:
    # 1. Load Dataset GoEmotions (Versi simplified)
    # Dataset ini labelnya angka (0-27).
    dataset = load_dataset("google-research-datasets/go_emotions", "simplified", split="train")
    
    # Ambil sebagian aja kalau mau cepet buat tes (misal 5000 data).
    # Hapus tanda pagar di bawah ini kalau laptop lu keberatan:
    # dataset = dataset.select(range(5000)) 
    
    df = pd.DataFrame(dataset)
    
    # 2. Mapping Label Angka ke Teks
    # GoEmotions labels: 0=admiration, 1=amusement, ..., 27=neutral
    labels_list = dataset.features['labels'].feature.names
    
    print(f"✅ Label Emosi yang tersedia: {len(labels_list)} kategori")
    
    # Dataset ini Multi-label. Kita ambil label PERTAMA aja buat Logistic Regression.
    def get_first_label(label_ids):
        if len(label_ids) > 0:
            return labels_list[label_ids[0]]
        return "neutral"

    df['emotion_label'] = df['labels'].apply(get_first_label)
    
    X = df['text']
    y = df['emotion_label']
    
    print(f"✅ Data siap: {len(df)} baris.")

except Exception as e:
    print(f"❌ Gagal memuat dataset: {e}")
    exit()

# --- TRAINING ---
print("🚀 Melatih Model Logistic Regression untuk Emosi...")

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Pipeline: TF-IDF -> Logistic Regression
# FIX: 'multi_class' dihapus karena di scikit-learn baru udah otomatis.
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(max_features=3000, stop_words='english')),
    ('clf', LogisticRegression(max_iter=1000, solver='lbfgs')) 
])

pipeline.fit(X_train, y_train)

# --- EVALUASI ---
predictions = pipeline.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"🎯 Akurasi Model Emosi: {accuracy * 100:.2f}%")

# --- SIMPAN MODEL ---
# Pastikan folder api/ ada
os.makedirs(os.path.dirname(MODEL_OUTPUT), exist_ok=True)

joblib.dump(pipeline, MODEL_OUTPUT)
print(f"💾 SUKSES! Model Emosi disimpan di: {MODEL_OUTPUT}")