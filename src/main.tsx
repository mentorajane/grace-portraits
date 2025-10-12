import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ImageProvider } from "./contexts/ImageContext";

createRoot(document.getElementById("root")!).render(
  <ImageProvider>
    <App />
  </ImageProvider>
);
