from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from services.deliveryMetrics import analyze_audio
from services.contentMetrics import analyze_content
from dotenv import load_dotenv
import tempfile
import librosa
import numpy as np
import os
import io
import soundfile as sf
import re

load_dotenv()
app = FastAPI()

# CORS settings
origins = [
    "http://localhost:8080",
    "http://localhost:8000",
    "http://127.0.0.1:8080",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# folder to store uploads
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# Main endpoint: upload + analyze
@app.post("/api/process-audio")
async def process_audio(
    audio: UploadFile = File(...),
    script: str = Form(None),
    theme: str = Form(None)
):
    # Save uploaded audio
    audio_path = os.path.join(UPLOAD_FOLDER, audio.filename)
    with open(audio_path, "wb") as f:
        f.write(await audio.read())

    # Save script if provided
    script_path = None
    if script:
        script_filename = f"{os.path.splitext(audio.filename)[0]}_script.txt"
        script_path = os.path.join(UPLOAD_FOLDER, script_filename)
        with open(script_path, "w", encoding="utf-8") as f:
            f.write(script)

    # Run delivery analysis on saved audio
    delivery_metrics=analyze_audio(audio_path)
    content_metrics=analyze_content(audio_path,script_path,delivery_metrics,theme)
    

    return {
        "audio_filename": audio.filename,
        "audio_path": audio_path,
        "script_provided": bool(script),
        "script_path": script_path,
        "theme": theme if theme else None,
        "delivery_analysis": delivery_metrics,
        "content_analysis":content_metrics
        
    }
    

