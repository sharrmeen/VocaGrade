import React, { useState } from "react";

function ScriptAnalyzer() {
  const [script, setScript] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!script || !audioFile) {
      alert("Please provide both a script and an audio file.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("script", script);
    formData.append("file", audioFile);

    try {
      const response = await fetch("http://localhost:8000/api/analyze-script/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert("Error analyzing script");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Script Mode Analyzer</h2>
      <textarea
        placeholder="Paste your expected script here..."
        rows={6}
        style={{ width: "100%", marginBottom: "1rem" }}
        value={script}
        onChange={(e) => setScript(e.target.value)}
      />
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setAudioFile(e.target.files[0])}
      />
      <br />
      <button onClick={handleSubmit} disabled={loading || !script || !audioFile} style={{ marginTop: "1rem" }}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {result && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Analysis Result</h3>
          <p><strong>Transcript:</strong> {result.transcript}</p>
          <p><strong>Similarity Score:</strong> {result.similarity_score}</p>
          {result.missing_points.length > 0 && (
            <div>
              <strong>Missing Points:</strong>
              <ul>
                {result.missing_points.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          )}
          {result.extra_content?.length > 0 && (
            <div>
              <strong>Extra Content:</strong>
              <ul>
                {result.extra_content.map((point, idx) => (
                  <li key={idx}>{point}</li>
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

export default ScriptAnalyzer;
