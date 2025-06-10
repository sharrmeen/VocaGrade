import re
from typing import List, Dict

filler_words=['uh', 'um', 'like', 'you know', 'so', 'actually',
    'basically', 'literally', 'i mean', 'kind of', 'sort of']

def count_words(text:str)->int:
    words=re.findall(r'\b\w+\b',text)
    return len(words)


def detect_filler_words(text:str)->Dict[str,int]:
    text_lower=text.lower()
    counts={}
    for word in filler_words:
        pattern=r'\b'+re.escape(word)+r'\b'
        matches=re.findall(pattern,text_lower)
        if matches:
            counts[word]=len(matches)
    return counts

def analyze_fluency(transcript:str,duration:float):
    total_words=count_words(transcript)
    filler_words=detect_filler_words(transcript)
    wpm=total_words/(duration/60) if duration>0 else 0
    
    return{
        "duration":round(duration,2),
        "total_words":total_words,
        "filler_words":filler_words,
        "filler_word_total":sum(filler_words.values()),
        "wpm":round(wpm,2)
        
    }
