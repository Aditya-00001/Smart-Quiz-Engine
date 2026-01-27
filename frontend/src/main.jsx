import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";
import PublicQuiz from "./components/PublicQuiz.jsx";
import EmbedQuiz from "./components/EmbedQuiz.jsx";
import './index.css';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/quiz/:id/play" element={<PublicQuiz />} />
        <Route path="/embed/quiz/:id" element={<EmbedQuiz />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
