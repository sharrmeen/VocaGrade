import React from "react";

const TextInput = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Enter the correct answer..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default TextInput;
