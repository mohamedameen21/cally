import React from "react";
import { Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout";
import {
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  CtaSection,
} from "@/components/sections";
import {
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from "@/pages/auth";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardStats } from "@/components/dashboard";
import DashboardPage from "@/pages/dashboard";
import DashboardAvailabilityPage from "@/pages/dashboard/availability";
import DashboardBookingsPage from "@/pages/dashboard/bookings";
import UserAvailabilityPage from "@/pages/public/UserAvailabilityPage";


const HomePage: React.FC = () => {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CtaSection />
    </MainLayout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/signup" element={<RegisterPage />} /> {/* Added redirect for /signup */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        {/* Protected availability route */}
        <Route path="/u/:username" element={
          <ProtectedRoute>
            <UserAvailabilityPage />
          </ProtectedRoute>
        } />
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardStats />} />
          <Route
            path="availability"
            element={<DashboardAvailabilityPage />}
          />
          <Route
            path="bookings"
            element={<DashboardBookingsPage />}
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
