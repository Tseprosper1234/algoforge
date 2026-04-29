import React from 'react';
import { useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import PrivateRoute from './components/Auth/PrivateRoute';
import AdminRoute from './components/Auth/AdminRoute';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import VerifyEmail from './components/Auth/VerifyEmail';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import MainLayout from './components/Layout/MainLayout';
import BrowsePage from './components/Browse/BrowsePage';
import FileDetailPage from './components/FileDetail/FileDetailPage';
import ChatForum from './components/Chat/ChatForum';
import ProfilePage from './components/Profile/ProfilePage';
import AdminDashboard from './components/Admin/AdminDashboard';
import SearchResults from './components/Search/SearchResults';
import LoadingScreen from './components/Layout/LoadingScreen';
import AdInitializer from './components/Ads/AdInitializer';
import TopBannerAd from './components/Ads/TopBannerAd';
import PopupAd from './components/Ads/PopupAd';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import About from './components/About';

function App() {
  useEffect(() => {
    // Register Service Worker for PWA
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          {/* Initialize Google Ads */}
          <AdInitializer />
          
          {/* Top Banner Ad - shows on all routes every 60 seconds */}
          <TopBannerAd />
          
          {/* Popup Ad - shows only on home route */}
          <PopupAd />
          
          <ThemeProvider>
            <Routes>
              {/* Public routes - no authentication needed */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Legal Pages - Public Routes (ADD THESE) */}
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
<Route path="/about" element={<About />} />
              
              {/* Protected routes - require authentication */}
              <Route element={<PrivateRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Navigate to="/browse" />} />
                  <Route path="/browse" element={<BrowsePage />} />
                  <Route path="/files/:id" element={<FileDetailPage />} />
                  <Route path="/chat" element={<ChatForum />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/search" element={<SearchResults />} />
                </Route>
              </Route>
              
              {/* Admin routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin/*" element={<AdminDashboard />} />
              </Route>
            </Routes>
          </ThemeProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;