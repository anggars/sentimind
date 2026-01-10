from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
# Import Logic dari Core
from .core.nlp_handler import NLPHandler

app = FastAPI()

class UserInput(BaseModel):
    text: str

@app.post("/api/predict")
def predict_endpoint(input_data: UserInput):
    if not input_data.text:
        raise HTTPException(status_code=400, detail="No text provided")
    
    # Panggil Logic NLP (Auto-Translate -> Predict)
    result = NLPHandler.predict_all(input_data.text)

    # Return format JSON
    return {
        "success": True,
        "mbti_type": result["mbti"],
        "emotion": result["emotion"],
        "keywords": result["keywords"],
        "reasoning": result["reasoning"]
    }