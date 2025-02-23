import React, { useState } from "react";
import Recorder from "./components/Recorder";
import TextInput from "./components/TextInput";
import Result from "./components/Result";
import { transcribeAudio, compareText } from "./components/api";

const App = () => {
  const [formalText, setFormalText] = useState("");
  const [spokenText, setSpokenText] = useState("");
  const [analysis, setAnalysis] = useState("");

  const handleStop = async (blob) => {
    const transcribedText = await transcribeAudio(blob);
    setSpokenText(transcribedText);
    if (formalText) {
      const response = await compareText(transcribedText, formalText);
      setAnalysis(response);
    }
  };

  return (
    <div>
      <h1>Speech Accuracy Checker</h1>
      <TextInput value={formalText} onChange={setFormalText} />
      <Recorder onTranscribe={handleStop} />
      <Result analysis={analysis} />
    </div>
  );
};

export default App;
