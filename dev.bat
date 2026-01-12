@echo off
title Sentimind Launcher
echo ==================================================
echo MEMULAI SENTIMIND DEV ENVIRONMENT
echo ==================================================

:: 1. Cek apakah Conda tersedia & Activate Environment
echo Mengaktifkan Conda: sentimind...
call conda activate sentimind

:: Cek jika activate gagal (opsional, tapi bagus buat debugging)
if %errorlevel% neq 0 (
    echo Gagal activate conda 'sentimind'. Pastikan env sudah dibuat!
    pause
    exit /b
)

:: 2. Jalankan FastAPI di Terminal Ini
echo Menyalakan Backend (FastAPI)...
uvicorn api.index:app --reload --port 8000