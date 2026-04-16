import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Locations from "./pages/Locations";
import Contact from "./pages/Contact";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute, { SubscribedRoute } from "./pages/ProtectedRoute";
import MarketingLayout from "./layouts/MarketingLayout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Onboarding from "./pages/Onboarding";
import UploadAd from "./pages/UploadAd";           // ← add this
import AdminDashboard from "./pages/AdminDashboard";


export default function App() {
  return (
    <Routes>
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route
          path="/onboarding"
          element={
            <SubscribedRoute>
              <Onboarding />
            </SubscribedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload-ad"
          element={
            <SubscribedRoute>
              <UploadAd />
            </SubscribedRoute>
          }
        />

        <Route
          path="/checkout/success"
          element={
            <ProtectedRoute>
              <CheckoutSuccess />
            </ProtectedRoute>
          }
        />
      </Route>

     

      <Route 
      path="/admin" 
      element={
      <ProtectedRoute>
          <AdminDashboard />
      </ProtectedRoute>} />

    </Routes>
  );
}