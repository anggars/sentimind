---
title: Sentimind API
emoji: 🧠
colorFrom: orange
colorTo: yellow
sdk: docker
app_port: 7860
pinned: false
---

# Sentimind API Backend

Backend API untuk Sentimind - AI Personality Profiler.

## Endpoints

- `POST /api/predict` - Prediksi MBTI dari teks
- `POST /api/chat` - Chat dengan AI assistant
- `GET /api/quiz` - Get quiz questions
- `POST /api/quiz` - Submit quiz answers
- `GET /api/youtube/{video_id}` - Analyze YouTube video

## Environment Variables

Set these in HF Spaces Settings > Repository Secrets:
- `GOOGLE_API_KEY` - Gemini API key
- `YOUTUBE_API_KEY` - YouTube Data API key
