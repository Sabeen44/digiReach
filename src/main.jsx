import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from "react"; 
import ReactDOM from "react-dom/client";
 import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'

import LandingPage from "./pages/LandingPage";
import Pricing from "./Pricing";
import About from "./About";
import Locations from "./Locations";
import Contact from "./Contact";
import Signup from "./Signup";
import Login from "./Login";
import Dashboard from "./Dashboard";
// import Checkout from "./Checkout";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "./Layout";
import CheckoutSuccess from "./CheckoutSuccess";
import Privacy from "./Privacy";
import Terms from "./Terms";


export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
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
    </Routes>
  );
}
