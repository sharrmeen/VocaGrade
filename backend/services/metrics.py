from difflib import SequenceMatcher

FILLERS = ['uh', 'um', 'like', 'you know', 'so', 'actually',
    'basically', 'literally', 'i mean', 'kind of', 'sort of']


def calculate_delivery_metrics(words, duration):
    # Speech rate WPM
    speech_rate = len(words) / (duration / 60) if duration else 0

    # Long pauses (>1s)
    pauses = [words[i+1]['start'] - words[i]['end'] for i in range(len(words)-1)]
    long_pauses = [p for p in pauses if p > 1.0]

    # Filler words
    num_fillers = sum(1 for w in words if w['word'].lower() in FILLERS)

    # Vocabulary richness
    unique_words = set(w['word'].lower() for w in words)
    vocab_richness = len(unique_words) / len(words) if words else 0

    return {
        "speech_rate_wpm": speech_rate,
        "long_pauses": len(long_pauses),
        "num_fillers": num_fillers,
        "vocab_richness": vocab_richness
    }

def compare_script(transcript: str, script: str):
    if not script:
        return None
    return SequenceMatcher(None, transcript, script).ratio()