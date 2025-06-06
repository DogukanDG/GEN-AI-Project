import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* İlk açılan rota LoginPage olacak */}
        <Route
          path="/"
          element={<LoginPage />}
        />
        <Route
          path="/homepage"
          element={<HomePage />}
        />
        <Route
          path="/signup"
          element={<SignUpPage />}
        />{" "}
        {/* Opsiyonel */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
