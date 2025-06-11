import React, { useState } from "react";
import "../App.css"; // Reuse existing CSS

const ComparePage = () => {
  const [spokenText, setSpokenText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  let recognition = null;

  if ("webkitSpeechRecognition" in window) {
    recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      setSpokenText(event.results[0][0].transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event);
    };
  }

  const startRecording = () => {
    if (recognition) {
      setIsRecording(true);
      recognition.start();
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };

  const stopRecording = () => {
    if (recognition) {
      setIsRecording(false);
      recognition.stop();
    }
  };

  return (
    <div className="container">
      <h1 className="title">Analyze your answers smartly.</h1>

      <div className="input-section">
        <label>Spoken Answer:</label>
        <div className="button-group">
          <button className="record-btn start" onClick={startRecording} disabled={isRecording}>
            🎙 Start Recording
          </button>
          <button className="record-btn stop" onClick={stopRecording} disabled={!isRecording}>
            ⏹ Stop Recording
          </button>
        </div>
        <textarea className="text-area" value={spokenText} readOnly></textarea>
      </div>

      <div className="input-section">
        <label>Formal Answer:</label>
        <textarea className="text-area" placeholder="Enter formal answer here..."></textarea>
      </div>

      <button className="compare-btn">Compare</button>

      <div className="result">
        <h2>Results</h2>
        <p className="accuracy">Accuracy: 85%</p>
        <p className="feedback">Feedback: You missed some key points.</p>
      </div>
    </div>
  );
};

export default ComparePage;
