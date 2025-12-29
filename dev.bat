@echo off
title Sentimind Launcher
echo ==================================================
echo 🚀 MEMULAI SENTIMIND DEV ENVIRONMENT
echo ==================================================

:: 1. Cek apakah Conda tersedia & Activate Environment
echo 🐍 Mengaktifkan Conda: sentimind...
call conda activate sentimind

:: Cek jika activate gagal (opsional, tapi bagus buat debugging)
if %errorlevel% neq 0 (
    echo ❌ Gagal activate conda 'sentimind'. Pastikan env sudah dibuat!
    pause
    exit /b
)

:: 2. Jalankan FastAPI di Window Baru (Port 8000)
:: Menggunakan 'start' agar window baru terbuka dan script ini lanjut ke bawah
echo ⚙️  Menyalakan Backend (FastAPI) di window baru...
start "Sentimind Backend API" cmd /k "conda activate sentimind && uvicorn api.index:app --reload --port 8000"

:: 3. Jalankan Frontend di Window Ini (Port 3000)
echo 🎨 Menyalakan Frontend (Next.js)...
echo 👉 Tekan Ctrl+C di sini untuk stop Frontend.
echo.
npm run dev