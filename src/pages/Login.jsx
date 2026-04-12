import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Login() {
  const { login, currentUser, notification, clearNotification } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (currentUser) {
      navigate(currentUser.role === 'coach' ? '/coach/dashboard' : '/parent/dashboard')
    }
  }, [currentUser, navigate])

  useEffect(() => () => clearNotification(), [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      login(form.email.trim(), form.password)
      setLoading(false)
    }, 400)
  }

  const fillDemo = (email) => {
    setForm({ email, password: 'demo' })
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="card p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-spike-orange rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🏐</span>
              </div>
              <span className="text-2xl font-bold text-spike-navy">
                Spike<span className="text-spike-orange">Coach</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-slate-800">Welcome back</h1>
            <p className="text-slate-500 text-sm mt-1">Sign in to your account</p>
          </div>

          {/* Error */}
          {notification?.type === 'error' && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {notification.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-spike-orange font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        {/* Demo accounts */}
        <div className="mt-6 card p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Demo Accounts (password: demo)
          </p>
          <div className="space-y-2">
            {[
              { label: '🏐 Elite Coach – Stacy Ramirez', email: 'stacy@demo.com' },
              { label: '🏐 Advanced Coach – Marcus Thompson', email: 'marcus@demo.com' },
              { label: '👨‍👩‍👧 Parent – Linda (student: Emmy)', email: 'emmy.parent@demo.com' },
              { label: '👨‍👩‍👧 Parent – Robert (student: Alex)', email: 'alex.parent@demo.com' },
            ].map(d => (
              <button
                key={d.email}
                onClick={() => fillDemo(d.email)}
                className="w-full text-left text-sm px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-slate-700"
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
