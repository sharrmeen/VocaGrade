from fastapi import APIRouter, UploadFile, File
from services.transcriber import transcribe_audio
from services.fluency import analyze_fluency

import tempfile

router = APIRouter()

@router.post("/analyze-fluency/")
async def analyze_fluency_route(file: UploadFile = File(...)):
    print(f"File received: {file.filename}")
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        contents = await file.read()
        tmp.write(contents)
        tmp_path = tmp.name

    transcript, duration = transcribe_audio(tmp_path)
    result = analyze_fluency(transcript, duration)
    result["transcript"] = transcript

    return result
