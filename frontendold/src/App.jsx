import React, { useState } from "react";
import AudioRecorder from "./components/AudioRecorder";

function App() {
  const [audioBlob, setAudioBlob] = useState(null);

  const handleAudioReady = (blob) => {
    console.log("Audio Blob ready:", blob);
    setAudioBlob(blob); // store for later upload if needed
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>VoiceGrade - Audio Recorder</h1>
      <AudioRecorder onAudioReady={handleAudioReady} />

      {audioBlob && (
        <div style={{ marginTop: "20px" }}>
          <p>Audio recorded successfully! You can now upload it.</p>
        </div>
      )}
    </div>
  );
}

export default App;
