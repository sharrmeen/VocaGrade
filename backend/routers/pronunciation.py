from fastapi import APIRouter, UploadFile, File, Form
import tempfile
import os
import subprocess
import json
from services.transcriber import transcribe_audio
from services.pronunciation import parse_textgrid_for_pronunciation

router = APIRouter()

@router.post("/analyze-pronunciation/")
async def analyze_pronunciation_route(
    file: UploadFile = File(...),
    script: str = Form(None)
):
    # Create a temp workspace
    with tempfile.TemporaryDirectory() as tmpdir:
        wav_dir = os.path.join(tmpdir, "wavs")
        txt_dir = os.path.join(tmpdir, "txts")
        output_dir = os.path.join(tmpdir, "aligned")
        os.makedirs(wav_dir, exist_ok=True)
        os.makedirs(txt_dir, exist_ok=True)
        os.makedirs(output_dir, exist_ok=True)

        # Save audio
        wav_path = os.path.join(wav_dir, "sample.wav")
        contents = await file.read()
        with open(wav_path, "wb") as f:
            f.write(contents)

        # Get script if not provided
        if not script:
            script, _ = transcribe_audio(wav_path)

        # Save script
        txt_path = os.path.join(txt_dir, "sample.txt")
        with open(txt_path, "w") as f:
            f.write(script)

        try:
            # Run MFA
            subprocess.run([
                "mfa", "align",
                wav_dir,
                txt_dir,
                "english_us_arpa",
                output_dir,
                "--clean",
                "--output_format", "json"
            ], check=True,timeout=60)

            # Look for output JSON
            json_path = os.path.join(output_dir, "sample.json")
            if not os.path.exists(json_path):
                raise RuntimeError("MFA did not produce expected JSON output.")

            with open(json_path, "r") as f:
                alignment_data = json.load(f)

            # Parse alignment
            result = parse_textgrid_for_pronunciation(alignment_data)

        except subprocess.CalledProcessError as e:
            return {"error": f"MFA failed: {str(e)}"}
        except Exception as e:
            return {"error": str(e)}

    return result
