import React, { useState } from "react";

function PronunciationAnalyzer() {
  const [audioFile, setAudioFile] = useState(null);
  const [script, setScript] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!audioFile) {
      alert("Please select an audio file.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", audioFile);
    if (script.trim()) {
      formData.append("script", script);
    }

    try {
      const response = await fetch("http://localhost:8000/api/analyze-pronunciation/", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert("Error analyzing pronunciation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Pronunciation Analyzer</h2>

      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setAudioFile(e.target.files[0])}
        style={{ marginBottom: "1rem" }}
      />

      <textarea
        placeholder="(Optional) Paste expected script here..."
        value={script}
        onChange={(e) => setScript(e.target.value)}
        rows={5}
        style={{ width: "100%", marginBottom: "1rem" }}
      />

      <button
        onClick={handleSubmit}
        disabled={loading || !audioFile}
      >
        {loading ? "Analyzing..." : "Analyze Pronunciation"}
      </button>

      {result && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Result</h3>

          <p><strong>Average Phone Duration:</strong> {result.average_phone_duration?.toFixed(3)} sec</p>

          {result.mispronounced_phones && result.mispronounced_phones.length > 0 && (
            <div>
              <strong>Mispronounced Sounds:</strong>
              <ul>
                {result.mispronounced_phones.map((phone, idx) => (
                  <li key={idx}>
                    {phone.phone} (Score: {phone.score}, Duration: {phone.duration.toFixed(3)} sec)
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p><strong>Feedback:</strong> {result.feedback}</p>
        </div>
      )}
    </div>
  );
}

export default PronunciationAnalyzer;
