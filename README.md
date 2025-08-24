# VocaGrade

## The smart way to analyze your speech.

**VocaGrade** is an AI-powered speech analysis tool that helps users improve spoken communication by comparing their speech to structured text. Originally designed for academic use, VocaGrade now supports use cases in **language learning**, **public speaking**, and **content creation**.

---

## 🚀 Overview

VocaGrade uses speech recognition and NLP-based comparison to analyze how well a spoken response matches a given reference (script, prompt, or formal answer). It provides feedback on **fluency**, **structure**, **pronunciation**, and **content coverage**.

---

## 🎯 Key Features

### ✅ Speech-to-Text Conversion
- Converts recorded speech into accurate text using modern ASR systems (e.g., Whisper, Google STT).

### ✅ Script/Prompt Comparison
- Compares your spoken response to a reference (script or formal text).
- Highlights missing or out-of-order points.

### ✅ Fluency Metrics
- Calculates **words-per-minute (WPM)**.
- Detects **pauses**, **filler words** ("uh", "um", "like"), and **speech disfluencies**.

### ✅ Pronunciation Evaluation *(basic version)*
- Compares phonetic structure of spoken text to expected pronunciation (experimental).
- Detects major mismatches using phoneme alignment.

### ✅ Performance Feedback
- Returns scores and improvement tips:
  - Content match
  - Fluency
  - Speaking pace
  - Filler words

### ✅ Use-Case Modes
- **Academic Mode:** Evaluate student answers against formal content.
- **Language Learning Mode:** Improve pronunciation, fluency, and recall.
- **Presentation Mode:** Practice and refine speeches or scripts.
- **Podcast/Content Mode:** Ensure clarity and alignment with talking points.

---

## 🧪 In Progress / Future Enhancements

- **Real-Time Feedback Mode** *(live deviation alerts)*
- **Multilingual Support**
- **Pronunciation Scoring**
- **Visual Feedback on Speaking Patterns**
- **User Accounts & Progress Tracking**
- **Mobile UI for on-the-go analysis**


## 🛠 Backend Setup

```bash
# Clone the repository
git clone https://github.com/your-username/VocaGrade.git
cd VocaGrade/backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server
uvicorn main:app --reload
```

## 🌐 Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Start the React development server
npm start
