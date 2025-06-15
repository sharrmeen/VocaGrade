from fastapi import APIRouter,UploadFile,File,Form
import tempfile
import os
import subprocess
import json
from services.transcriber import transcribe_audio
from services.pronunciation import parse_textgrid_for_pronunciation

router=APIRouter()

@router.post("/analyze-pronunciation/")
async def analyze_pronunciation_route(
    file: UploadFile = File(...),
    script: str = Form(None)
):
    # Save the uploaded audio file to a temp location
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_audio:
        contents = await file.read()
        tmp_audio.write(contents)
        audio_path = tmp_audio.name

    # If no script provided, transcribe
    if not script:
        script, _ = transcribe_audio(audio_path)

    # Create temp dir for alignment
    with tempfile.TemporaryDirectory() as tmpdir:
        text_path = os.path.join(tmpdir, "input.txt")
        with open(text_path, "w") as f:
            f.write(script)

        try:
            # Run MFA alignment
            subprocess.run([
                "mfa", "align",
                tmpdir,
                text_path,
                "english_us_arpa",
                tmpdir,
                "--clean",
                "--output_format", "json"
            ], check=True)

            # Look for JSON alignment output
            json_path = os.path.join(tmpdir, "input.json")
            if not os.path.exists(json_path):
                raise RuntimeError("MFA did not produce expected JSON output.")

            with open(json_path) as f:
                alignment_data = json.load(f)

            result = parse_textgrid_for_pronunciation(alignment_data)

        finally:
            os.remove(audio_path)

    return result

