import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Navbar() {
  const { currentUser, logout } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const dashboardPath = currentUser?.role === 'coach' ? '/coach/dashboard' : '/parent/dashboard'

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-spike-orange rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white text-lg">🏐</span>
            </div>
            <span className="text-xl font-bold text-spike-navy">
              Spike<span className="text-spike-orange">Coach</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/coaches"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/coaches'
                  ? 'text-spike-orange'
                  : 'text-slate-600 hover:text-spike-orange'
              }`}
            >
              Find a Coach
            </Link>
            {!currentUser && (
              <Link
                to="/register?role=coach"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/register'
                    ? 'text-spike-orange'
                    : 'text-slate-600 hover:text-spike-orange'
                }`}
              >
                Become a Coach
              </Link>
            )}
            {currentUser ? (
              <div className="flex items-center gap-3">
                <Link
                  to={dashboardPath}
                  className="text-sm font-medium text-slate-600 hover:text-spike-orange transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${currentUser.avatarBg || 'bg-spike-orange'}`}>
                    {currentUser.avatar || currentUser.name?.charAt(0)}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-slate-500 hover:text-red-500 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-spike-navy transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/coaches" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">
              Find a Coach
            </Link>
            {currentUser ? (
              <>
                <Link to={dashboardPath} onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/register?role=coach" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">
                  Become a Coach
                </Link>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">
                  Log in
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm font-semibold text-spike-orange hover:bg-orange-50 rounded-lg">
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
