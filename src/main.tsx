import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter, Routes, Route } from 'react-router'
// import Gallery from './pages/Gallery'
import Landing from './pages/Landing'
import Settings from './pages/Settings'
import About from './pages/About'
import NotFound from './pages/404'
import Gallery from './pages/Gallery'
import { HomeworkDetails } from './pages/Details'
import { LoadingProvider } from './context/LoadingContext'
import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react'

const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id';

// createRoot(document.getElementById('root')!).render(
export default function Index(){
  return (
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <LoadingProvider>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Landing />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="settings" element={<Settings />} />
              <Route path="about" element={<About />} />
              <Route path="details/:id" element={<HomeworkDetails />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </LoadingProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
)}