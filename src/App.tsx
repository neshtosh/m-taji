import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import ChangemakersPage from './pages/ChangemakersPage';
import StoriesPage from './pages/StoriesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import DashboardPage from './pages/DashboardPage';
import Footer from './components/layout/Footer';
import FloatingDonateButton from './components/ui/FloatingDonateButton';
import SignInPage from './pages/auth/SignInPage';
import SignUpPage from './pages/auth/SignUpPage';
import PrivateRoute from './components/auth/PrivateRoute';
import ProfilePage from './pages/ProfilePage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import SettingsPage from './pages/SettingsPage';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              } />
              <Route path="/project/:id" element={
                <PrivateRoute>
                  <ProjectDetailPage />
                </PrivateRoute>
              } />
              <Route path="/campaign/:id" element={
                <>
                  <Navbar />
                  <main>
                    <CampaignDetailPage />
                  </main>
                  <Footer />
                  <FloatingDonateButton />
                </>
              } />
              <Route path="/settings" element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              } />
              <Route path="/" element={
                <>
                  <Navbar />
                  <main>
                    <HomePage />
                  </main>
                  <Footer />
                  <FloatingDonateButton />
                </>
              } />
              <Route path="/changemakers" element={
                <>
                  <Navbar />
                  <main>
                    <ChangemakersPage />
                  </main>
                  <Footer />
                  <FloatingDonateButton />
                </>
              } />
              <Route path="/stories" element={
                <>
                  <Navbar />
                  <main>
                    <StoriesPage />
                  </main>
                  <Footer />
                  <FloatingDonateButton />
                </>
              } />
              <Route path="/about" element={
                <>
                  <Navbar />
                  <main>
                    <AboutPage />
                  </main>
                  <Footer />
                  <FloatingDonateButton />
                </>
              } />
              <Route path="/contact" element={
                <>
                  <Navbar />
                  <main>
                    <ContactPage />
                  </main>
                  <Footer />
                  <FloatingDonateButton />
                </>
              } />
              <Route path="/profile/:id" element={
                <>
                  <Navbar />
                  <main>
                    <ProfilePage />
                  </main>
                  <Footer />
                  <FloatingDonateButton />
                </>
              } />
              <Route path="/blog" element={
                <>
                  <Navbar />
                  <main>
                    <BlogPage />
                  </main>
                  <Footer />
                  <FloatingDonateButton />
                </>
              } />
              <Route path="/blog/:id" element={
                <>
                  <Navbar />
                  <main>
                    <BlogPostPage />
                  </main>
                  <Footer />
                  <FloatingDonateButton />
                </>
              } />
            </Routes>
          </AnimatePresence>
        </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;