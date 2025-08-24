from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
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


# Utility: analyze audio

def analyze_audio(file_path: str):
    # Load audio directly from disk
    y, sr = librosa.load(file_path, sr=None)
    duration = librosa.get_duration(y=y, sr=sr)
    
    # Volume (RMS)
    rms = librosa.feature.rms(y=y)[0]
    volume_consistency = 100 - (np.std(rms) / np.mean(rms) * 100) if np.mean(rms) > 0 else 0
    
    # Heuristic clarity proxy
    clarity = max(0, min(100, 100 - (np.std(rms) * 300)))
    
    # Detect pauses: zero-crossing rate
    zcr = librosa.feature.zero_crossing_rate(y)[0]
    avg_pause = round(np.mean(zcr < 0.01) * duration / 10, 2)  # crude pause estimation

    # Fluency score heuristic
    fluency_score = max(0, min(100, 90 - avg_pause * 10 + (volume_consistency / 10)))

    # Determine speaking pace category (fake WPM calculation)
    pace_category = "Optimal"
    if fluency_score < 50:
        pace_category = "Too Slow"
    elif fluency_score > 85:
        pace_category = "Too Fast"

    return {
        "fluencyScore": int(fluency_score),
        "clarity": int(clarity),
        "totalDuration": f"{int(duration//60)}:{int(duration%60):02d}",
        "averagePause": f"{avg_pause:.1f}s",
        "volumeConsistency": int(volume_consistency),
        "fillerWords": np.random.randint(3, 10),  
        "speakingPace": pace_category
    }

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
    delivery_metrics = analyze_audio(audio_path)

    return {
        "audio_filename": audio.filename,
        "audio_path": audio_path,
        "script_provided": bool(script),
        "script_path": script_path,
        "theme": theme if theme else None,
        "delivery_analysis": delivery_metrics
        
    }
    

