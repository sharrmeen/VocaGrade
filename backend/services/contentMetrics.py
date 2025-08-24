from services.transcriber import transcribe_audio
from services.scriptCompare import compare_script_with_transcript
import librosa

def analyze_content(audio_path:str,script_path:str=None,theme:str=None):
    script_text=None
    with open(script_path, 'r', encoding='utf-8') as f:
        script_text = f.read()
    transcript,words,duration=transcribe_audio(audio_path)
    result=compare_script_with_transcript(script_text or "",transcript)
    return result

