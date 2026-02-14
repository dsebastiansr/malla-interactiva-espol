import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style/index.css";
import App from "./App.tsx";
import { MeshProvider } from "./context/MeshContext";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MeshProvider>
      <App />
    </MeshProvider>
  </StrictMode>
)
