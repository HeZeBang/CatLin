import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter, Routes, Route } from 'react-router'
// import Gallery from './oldpages/Gallery'
import Landing from './oldpages/Landing'
import Settings from './oldpages/Settings'
import About from './oldpages/About'
import NotFound from './oldpages/404'
import Gallery from './oldpages/Gallery'
import HomeworkDetails from './oldpages/Details'
import { LoadingProvider } from './context/LoadingContext'
import React from 'react'

// createRoot(document.getElementById('root')!).render(
export default function Index(){
  return (
  <StrictMode>
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
  </StrictMode>
)}