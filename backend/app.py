from fastapi import FastAPI, UploadFile, File
import whisper
from pydantic import BaseModel
import requests
import json
import re

app = FastAPI()
model = whisper.load_model("base")  # Load Whisper model for speech-to-text

OLLAMA_URL = "http://localhost:11434/api/generate"  # Ollama API endpoint
DEEPSEEK_MODEL = "deepseek-r1:1.5b"  # Model name in Ollama

class CompareRequest(BaseModel):
    spoken_text: str
    formal_text: str

@app.post("/transcribe/")
async def transcribe(file: UploadFile = File(...)):
    """Convert speech to text using Whisper."""
    audio_path = f"temp_{file.filename}"
    with open(audio_path, "wb") as buffer:
        buffer.write(await file.read())
    
    result = model.transcribe(audio_path)
    return {"transcribed_text": result["text"]}

# Function to analyze spoken vs. formal text using Ollama

def analyze_ollama(spoken_text, formal_text):
    """Use Ollama's DeepSeek LLM to analyze differences and suggest improvements."""
    prompt = f"""
    Compare the spoken text with only the formal text. Identify:
    - Important missing points in the spoken text that are there in the formal text
    - Suggest to add these missing points in the spoken text even if it is a small point

    Spoken Text: {spoken_text}
    Formal Text: {formal_text}
    """
    
    payload = {
        "model": DEEPSEEK_MODEL,
        "prompt": prompt,
        "stream": False
    }
    
    response = requests.post(OLLAMA_URL, json=payload)
    if response.status_code == 200:
        return response.json().get("response", "Error: No response from model")
    else:
        return f"Error: {response.text}"
    
def clean_response(deepseek_output):
    # Remove <think> ... </think> section
    cleaned_output = re.sub(r"<think>.*?</think>", "", deepseek_output, flags=re.DOTALL)
    return cleaned_output.strip()


@app.post("/compare/")
def compare_texts(request: CompareRequest):
    """Compare spoken text with formal text using Ollama's DeepSeek model."""
    feedback = analyze_ollama(request.spoken_text, request.formal_text)
    cleaned_feedback=clean_response(feedback)
    return {"analysis": cleaned_feedback}
