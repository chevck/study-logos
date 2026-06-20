import { BrowserRouter, Route, Routes } from "react-router-dom";
import StudyApp from "./StudyApp.jsx";
import AccountSettingsPage from "./pages/AccountSettingsPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/study" element={<StudyApp />} />
        <Route path="/account" element={<AccountSettingsPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}
