import React from "react";

const Result = ({ analysis }) => {
  return (
    <div>
      <h2>Analysis:</h2>
      <p>{analysis || "No analysis available yet."}</p>
    </div>
  );
};

export default Result;
