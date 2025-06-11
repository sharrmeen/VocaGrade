import whisper
from pydub import AudioSegment

model = whisper.load_model("base")

def get_audio_duration(audio_path: str) -> float:
    audio = AudioSegment.from_file(audio_path)
    return len(audio) / 1000.0  # duration in seconds

def transcribe_audio(audio_path: str):
    result = model.transcribe(audio_path)
    transcript = result["text"]
    duration = get_audio_duration(audio_path)
    return transcript.strip(), duration
