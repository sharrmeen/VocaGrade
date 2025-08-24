from fastapi import APIRouter, File, UploadFile, Form, HTTPException
import tempfile
from pydantic import BaseModel
from backend.services.contentAnalyzer import compare_script_with_transcript
from services.transcriber import transcribe_audio

router = APIRouter()
@router.post("/analyze-script/")

async def analyze_script_with_audio(script: str= Form(...), file: UploadFile = File(...)):
   
    with tempfile.NamedTemporaryFile(delete=False, suffix=file.filename[-4:]) as tmp:
        contents = await file.read()
        tmp.write(contents)
        tmp_path = tmp.name

        # Transcribe
        transcript,duration = transcribe_audio(tmp_path)
        if not transcript:
            raise HTTPException(status_code=500, detail="Transcription failed.")

        # Compare with Gemini
        result = compare_script_with_transcript(script, transcript)
        result["transcript"] = transcript
        return result

 