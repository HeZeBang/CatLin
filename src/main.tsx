import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router'
// import Gallery from './pages/Gallery.tsx'
import Landing from './pages/Landing.tsx'
import Settings from './pages/Settings.tsx'
import About from './pages/About.tsx'
import NotFound from './pages/404.tsx'
import Gallery from './pages/Gallery.tsx'
import { HomeworkDetails } from './pages/Details.tsx'
import { LoadingProvider } from './context/LoadingContext.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id';

createRoot(document.getElementById('root')!).render(
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
)
