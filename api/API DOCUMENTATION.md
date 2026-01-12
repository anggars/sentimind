# Dokumentasi Backend Sentimind (API)

Dokumen ini menjelaskan struktur folder `api`, fungsi dari setiap file, dan logika perhitungan yang digunakan dalam sistem Sentimind.

## 📂 Struktur Folder

```
api/
├── index.py                  # Entry point utama aplikasi (FastAPI)
├── predict.py                # Endpoint untuk prediksi teks manual
├── quiz.py                   # Endpoint untuk sistem kuis MBTI
├── core/
│   ├── chatbot.py            # Logic Chatbot menggunakan Google Gemini
│   ├── nlp_handler.py        # Logic utama NLP (Machine Learning + Youtube)
│   └── quiz_logic.py         # Perhitungan skor dan logika MBTI
└── data/
    ├── questions.json        # Database soal kuis
    ├── model_mbti.pkl        # Model Machine Learning untuk MBTI
    └── model_emotion.pkl     # Model Machine Learning untuk Emosi
```

---

## 🧠 Logika Perhitungan Kuis (MBTI Scoring)

Perhitungan MBTI dilakukan di file `api/core/quiz_logic.py`. Sistem tidak menggunakan sistem "benar/salah", melainkan sistem **Dimensi Bipolar**.

### 1. Variabel Dimensi

Kita memiliki 4 variabel skor awal yang dimulai dari angka 0:

- `EI`: Introvert vs Extravert
- `SN`: Sensing vs Intuition
- `TF`: Thinking vs Feeling
- `JP`: Judging vs Perceiving

### 2. Rumus Per Soal

Setiap soal memiliki atribut `dimension` (misal "EI") dan `direction` (1 atau -1).
User memberikan jawaban dalam skala -3 sampai 3 (Sangat Tidak Setuju s.d. Sangat Setuju).

**Rumus:**

```python
Skor Dimensi += (Jawaban User * Arah Soal)
```

**Contoh Kasus:**

- **Soal**: "Saya suka pesta."
  - Dimensi: `EI`
  - Arah (`direction`): `1` (Positif mengarah ke Extravert)
- **Jawaban User**: `3` (Sangat Setuju)
- **Hitungan**: `3 * 1 = 3`. Skor EI bertambah +3 (Makin E).

- **Soal**: "Saya butuh waktu sendiri."
  - Dimensi: `EI`
  - Arah (`direction`): `-1` (Positif mengarah ke Introvert)
- **Jawaban User**: `3` (Sangat Setuju)
- **Hitungan**: `3 * -1 = -3`. Skor EI berkurang -3 (Makin I).

### 3. Penentuan Hasil Akhir

Setelah menghitung total skor dari 40 soal, hasil ditentukan berdasarkan tanda positif/negatif:

| Dimensi | Skor Positif (>= 0) | Skor Negatif (< 0) |
| :------ | :------------------ | :----------------- |
| **EI**  | **E** (Extravert)   | **I** (Introvert)  |
| **SN**  | **S** (Sensing)     | **N** (Intuition)  |
| **TF**  | **T** (Thinking)    | **F** (Feeling)    |
| **JP**  | **J** (Judging)     | **P** (Perceiving) |

---

## 📜 Penjelasan File & Fungsi (Detail)

### 1. `api/index.py`

File utama untuk menjalankan server backend.

- **`app = FastAPI()`**: Inisialisasi aplikasi.
- **`startup_event()`**: Mengecek keberadaan `YOUTUBE_API_KEY` saat server nyala. Menentukan mode Official atau Scraping.
- **`app.add_middleware(CORSMiddleware)`**: Mengizinkan frontend (berbeda port) untuk mengakses API ini.
- **Routes**: Mendaftarkan URL endpoint dari file lain (`/api/predict`, `/api/quiz`, dll).
- **`analyze_youtube_video(video_id)`**: Endpoint khusus untuk analisis YouTube. Memanggil `NLPHandler` untuk mengambil transkrip/komentar dan melakukan prediksi.

### 2. `api/predict.py`

Handler untuk fitur "Analyzer" (Input Teks Manual).

- **`predict_endpoint(input_data)`**: Menerima JSON `{ "text": "..." }`, memvalidasi input, lalu memanggil `NLPHandler.predict_all` untuk mendapatkan hasil MBTI dan Emosi.

### 3. `api/quiz.py`

Handler untuk fitur "Quiz".

- **`get_quiz_questions()`**: Mengambil daftar soal dari `QuizHandler`.
- **`submit_quiz(submission)`**: Menerima jawaban user dan mengembalikan hasil MBTI.

### 4. `api/core/chatbot.py`

Otak dari fitur Chatbot.

- **`__init__`**: Menghubungkan ke Google Gemini API. Menggunakan model `gemini-2.0-flash` atau fallback ke `lite`.
- **`generate_response(user_query, lang)`**:
  - Membuat `system_prompt` yang mendefinisikan persona AI "Sentimind".
  - Menyesuaikan gaya bahasa (Slang Jakarta untuk ID, Formal untuk EN).
  - Mengirim prompt ke Gemini dan mengembalikan teks balasan.

### 5. `api/core/nlp_handler.py` (Core Logic)

File paling kompleks yang menangani Machine Learning dan pemrosesan data.

**Fungsi Utama:**

- **`load_models()`**: Memuat file `.pkl` (model ML yang sudah dilatih) ke memory agar prediksi cepat.
- **`_validate_with_gemini(text, ml_prediction)`**:
  - Teknik **Hybrid AI**: Menggunakan LLM (Gemini) untuk "mengoreksi" hasil Machine Learning klasik.
  - Jika teks cukup panjang (>50 kata), Gemini akan menganalisis ulang teks dan memberikan "second opinion".
  - Mengembalikan confidence score dan alasan logis.
- **`predict_all(raw_text)`**:
  1.  Translate teks ke Inggris (karena model dilatih pakai B.Inggris).
  2.  Prediksi MBTI pakai Model ML.
  3.  Validasi MBTI pakai Gemini (jika memungkinkan).
  4.  Prediksi Emosi pakai Model ML + Normalisasi probabilitas.
  5.  Ekstrak Keyword utama.
  6.  Generate penjelasan/reasoning untuk ditampilkan di UI.
- **`fetch_youtube_transcript(video_id)`**:
  - Mencoba pakai **Official YouTube API** dulu (ambil judul, deskripsi, komentar).
  - Jika gagal/tak ada key, fallback ke **Scraping** (ambil subtitle otomatis).

### 6. `api/core/quiz_logic.py`

Logic pemrosesan kuis.

- **`get_questions()`**: Membaca file `api/data/questions.json`.
- **`calculate_mbti(answers)`**: Mengimplementasikan rumus scoring MBTI (lihat bagian Logika Perhitungan Kuis di atas).

---

## 🛠 Flow Data (E2E)

1.  **Frontend** kirim data (Teks/Jawaban Kuis/Video ID) ke **Backend**.
2.  **Backend** (`index.py` / `quiz.py` / `predict.py`) terima request.
3.  **Core Logic** (`NLPHandler` / `QuizHandler`) memproses data:
    - Load Model ML.
    - Hitung Matematika / Prediksi Statistik.
    - Panggil External API (Gemini/YouTube) jika perlu.
4.  **Backend** membalas dengan JSON standar:
    ```json
    {
      "success": true,
      "mbti": "INTJ",
      "emotion": { "id": "Senang", "en": "Joy" },
      "reasoning": { ... }
    }
    ```
5.  **Frontend** menampilkan animasi dan hasil ke user.
