from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from routers import fluency,script,pronunciation
from dotenv import load_dotenv
import whisper
from pydantic import BaseModel
import requests
import json
import re
import os

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow requests from frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

app.include_router(fluency.router, prefix="/api")
app.include_router(script.router, prefix="/api")
app.include_router(pronunciation.router, prefix="/api")

# model = whisper.load_model("base")  # Load Whisper model for speech-to-text

# GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent"
# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# class CompareRequest(BaseModel):
#     spoken_text: str
#     formal_text: str

# @app.post("/transcribe/")
# async def transcribe(file: UploadFile = File(...)):
#     """Convert speech to text using Whisper."""
#     audio_path = f"temp_{file.filename}"
#     with open(audio_path, "wb") as buffer:
#         buffer.write(await file.read())

#     result = model.transcribe(audio_path)
#     return {"transcribed_text": result["text"]}

# def analyze_with_gemini(spoken_text, formal_text):
#     """Use Gemini to analyze text differences and suggest improvements."""
#     prompt = f"""
#     Compare the spoken text with the formal text and:
#     - Identify important missing points in the spoken text that are present in the formal text.
#     - Suggest how to add these missing points in the spoken text.
    
#     Spoken Text: {spoken_text}
#     Formal Text: {formal_text}
#     """

#     payload = {
#         "contents": [{"parts": [{"text": prompt}]}]
#     }

#     response = requests.post(
#         f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
#         json=payload,
#         headers={"Content-Type": "application/json"},
#     )

#     if response.status_code == 200:
#         return response.json().get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "Error: No response from Gemini")
#     else:
#         return f"Error: {response.text}"

# @app.post("/compare/")
# def compare_texts(request: CompareRequest):
#     """Compare spoken text with formal text using Gemini API."""
#     feedback = analyze_with_gemini(request.spoken_text, request.formal_text)
#     return {"analysis": feedback}
