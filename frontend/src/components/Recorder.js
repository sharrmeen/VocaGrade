import React, { useCallback } from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import axios from "axios";

const Recorder = ({ onTranscribe }) => {
  const handleStop = useCallback(async (blobUrl, blob) => {
    if (!blob) {
      console.error("Recording failed or was empty.");
      return;
    }

    // Convert blob to File
    const audioFile = new File([blob], "audio.wav", { type: "audio/wav" });

    // Prepare FormData for FastAPI
    const formData = new FormData();
    formData.append("file", audioFile);

    try {
      // Send to backend
      const response = await axios.post("http://localhost:8000/transcribe/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Transcription:", response.data.transcribed_text);
      onTranscribe(blob,response.data.transcribed_text); // Pass transcription result to parent component
    } catch (error) {
      console.error("Error sending audio file:", error);
    }
  }, [onTranscribe]);

  return (
    <div>
      <ReactMediaRecorder
        audio
        onStop={handleStop} // Convert blob to file & send
        render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
          <div>
            <p>Recording Status: {status}</p>
            <button onClick={startRecording}>🎙 Start Recording</button>
            <button onClick={stopRecording}>🛑 Stop Recording</button>
            {mediaBlobUrl && <audio src={mediaBlobUrl} controls />}
          </div>
        )}
      />
    </div>
  );
};

export default Recorder;
