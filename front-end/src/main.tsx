import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { initializeAuth } from "./utils/auth";

// Initialize authentication on app start
const initializeApp = () => {
  // Clear any existing session data on fresh app start
  initializeAuth();
  
  const root = createRoot(document.getElementById("root")!);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

initializeApp();
