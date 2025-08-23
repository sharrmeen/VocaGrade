//Take the input script in text or pdf format

// frontend/src/components/InputForm.jsx

import React, { useState } from 'react';

const InputForm = ({ onStartRecording }) => {
  const [script, setScript] = useState('');
  const [theme, setTheme] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (file) {
      onStartRecording(file, script, theme);
    } else {
      alert("Please select an audio file to upload.");
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col space-y-4 p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800">Upload or Record</h2>
      
      {/* File Input */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1" htmlFor="audio-file">
          Select an Audio File:
        </label>
        <input
          id="audio-file"
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Script Input */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1" htmlFor="script">
          Optional Script:
        </label>
        <textarea
          id="script"
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="Type or paste the script you are practicing..."
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
        />
      </div>

      {/* Theme Input */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1" htmlFor="theme">
          Optional Theme:
        </label>
        <input
          id="theme"
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="e.g., 'Interview on communication skills'"
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition duration-200"
      >
        Analyze Audio
      </button>
    </form>
  );
};

export default InputForm;