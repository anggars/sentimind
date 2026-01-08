# Dockerfile untuk Hugging Face Spaces
# Build dan jalankan backend FastAPI saja

FROM python:3.10-slim

# Create non-root user (required by HF Spaces)
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

WORKDIR /app

# Copy requirements dan install dependencies
COPY --chown=user api/requirements.txt requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy folder api ke dalam container
COPY --chown=user api/ ./api/

# Expose port 7860 (default HF Spaces)
EXPOSE 7860

# Jalankan uvicorn dengan path module yang benar
CMD ["uvicorn", "api.index:app", "--host", "0.0.0.0", "--port", "7860"]
