import whisper


model = whisper.load_model("small")

def transcribe_audio(audio_path: str):
    """
    Returns transcript, words with timestamps, and duration
    """
    result = model.transcribe(audio_path, word_timestamps=True)
    transcript = result["text"]
    words = result.get("words", [])
    duration = result.get("duration", None)
    return transcript, words, duration
