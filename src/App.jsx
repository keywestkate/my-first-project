import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import BrowseCoaches from './pages/BrowseCoaches'
import CoachProfile from './pages/CoachProfile'
import CoachDashboard from './pages/CoachDashboard'
import BookSession from './pages/BookSession'
import ParentDashboard from './pages/ParentDashboard'

// Pages that show their own full-screen layout (no shared footer)
const FULL_SCREEN_PAGES = ['/login', '/register', '/coach/dashboard', '/parent/dashboard']

function AppLayout() {
  const { pathname } = useLocation()
  const isFullScreen = FULL_SCREEN_PAGES.some(p => pathname.startsWith(p))
  const isBookPage = pathname.startsWith('/book/')

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/coaches" element={<BrowseCoaches />} />
          <Route path="/coaches/:id" element={<CoachProfile />} />
          <Route path="/coach/dashboard" element={<CoachDashboard />} />
          <Route path="/book/:coachId" element={<BookSession />} />
          <Route path="/parent/dashboard" element={<ParentDashboard />} />
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isFullScreen && !isBookPage && <Footer />}
    </div>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <p className="text-6xl mb-4">🏐</p>
        <h1 className="text-2xl font-bold text-slate-700 mb-2">Page not found</h1>
        <p className="text-slate-400 mb-6">This page went out of bounds.</p>
        <a href="/" className="btn-primary">Go Home</a>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  )
}
