# Dockerfile untuk Hugging Face Spaces
# Build dan jalankan backend FastAPI saja

FROM python:3.10-slim

WORKDIR /app

# Copy requirements dan install dependencies
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy folder api ke dalam container
COPY api/ ./api/

# Expose port 7860 (default HF Spaces)
EXPOSE 7860

# Jalankan uvicorn dengan path module yang benar
CMD ["uvicorn", "api.index:app", "--host", "0.0.0.0", "--port", "7860"]
