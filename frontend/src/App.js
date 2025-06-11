import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ComparePage from "./pages/comparePage";
import FluencyPage from "./pages/fluencyPage"; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ComparePage />} />
        <Route path="/fluency" element={<FluencyPage />} />
      </Routes>
    </Router>
  );
};

export default App;
