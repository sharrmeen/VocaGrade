import axios from "axios";

const API_BASE = "http://127.0.0.1:8000"; // FastAPI backend

export const transcribeAudio = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${API_BASE}/transcribe/`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  return response.data.transcribed_text;
};

export const compareText = async (spokenText, formalText) => {
  const response = await axios.post(`${API_BASE}/compare/`, {
    spoken_text: spokenText,
    formal_text: formalText
  });

  return response.data.analysis;  // DeepSeek response
};
