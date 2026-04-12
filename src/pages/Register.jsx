import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { SKILL_LEVELS } from '../data/mockData'

const AVATAR_COLORS = [
  'bg-pink-500', 'bg-blue-500', 'bg-purple-500', 'bg-teal-500',
  'bg-rose-500', 'bg-amber-500', 'bg-indigo-500', 'bg-cyan-500',
]

function initials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function randomColor() {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
}

export default function Register() {
  const [searchParams] = useSearchParams()
  const initialRole = searchParams.get('role') === 'coach' ? 'coach' : null
  const [role, setRole] = useState(initialRole)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const { registerCoach, registerParent, currentUser } = useApp()
  const navigate = useNavigate()

  const [coachForm, setCoachForm] = useState({
    name: '', email: '', password: '', skillLevel: 'intermediate',
    bio: '', ratePerHour: 30, specialties: '',
    certifications: [], insured: false, avatarBg: randomColor(),
  })
  const [parentForm, setParentForm] = useState({
    name: '', email: '', password: '',
    studentName: '', studentAge: '', studentSkillLevel: 'beginner',
  })

  React.useEffect(() => {
    if (currentUser) {
      navigate(currentUser.role === 'coach' ? '/coach/dashboard' : '/parent/dashboard')
    }
  }, [currentUser, navigate])

  const handleCoachSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      const specs = coachForm.specialties.split(',').map(s => s.trim()).filter(Boolean)
      registerCoach({
        ...coachForm,
        avatar: initials(coachForm.name),
        specialties: specs,
        ratePerHour: Number(coachForm.ratePerHour),
        location: {
          id: 'loc1', name: 'Sunrise Sports Center',
          address: '1420 Sunrise Blvd', city: 'Orlando, FL',
        },
      })
      setLoading(false)
    }, 600)
  }

  const handleParentSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      registerParent({
        name: parentForm.name,
        email: parentForm.email,
        password: parentForm.password,
        avatar: initials(parentForm.name),
        avatarBg: randomColor(),
        student: {
          id: 'student_' + Date.now(),
          name: parentForm.studentName,
          age: Number(parentForm.studentAge),
          skillLevel: parentForm.studentSkillLevel,
          avatar: initials(parentForm.studentName),
          avatarBg: randomColor(),
        },
      })
      setLoading(false)
    }, 600)
  }

  // ── Role selection ────────────────────────────────────────────────────
  if (!role) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-spike-orange rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🏐</span>
              </div>
              <span className="text-2xl font-bold text-spike-navy">
                Spike<span className="text-spike-orange">Coach</span>
              </span>
            </Link>
            <h1 className="text-3xl font-bold text-slate-800">Join SpikeCoach</h1>
            <p className="text-slate-500 mt-2">How would you like to use the platform?</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coach card */}
            <button
              onClick={() => setRole('coach')}
              className="card p-8 text-left hover:border-spike-orange hover:shadow-lg border-2 border-transparent transition-all duration-200 group"
            >
              <div className="w-16 h-16 bg-spike-orange/10 rounded-2xl flex items-center justify-center text-4xl mb-4 group-hover:bg-spike-orange/20 transition-colors">
                🏐
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">I'm a Student Coach</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                I play volleyball and want to coach younger players, earn money, and set my own schedule.
              </p>
              <div className="mt-4 flex items-center gap-2 text-spike-orange font-medium text-sm">
                Sign up as a coach
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* Parent card */}
            <button
              onClick={() => setRole('parent')}
              className="card p-8 text-left hover:border-spike-navy hover:shadow-lg border-2 border-transparent transition-all duration-200 group"
            >
              <div className="w-16 h-16 bg-spike-navy/10 rounded-2xl flex items-center justify-center text-4xl mb-4 group-hover:bg-spike-navy/20 transition-colors">
                👨‍👩‍👧
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">I'm a Parent</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                I want to find a qualified student coach for my child and manage their training sessions safely.
              </p>
              <div className="mt-4 flex items-center gap-2 text-spike-navy font-medium text-sm">
                Sign up as a parent
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-spike-orange font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    )
  }

  // ── Coach registration form ───────────────────────────────────────────
  if (role === 'coach') {
    const levels = Object.values(SKILL_LEVELS).filter(l => l.canCoach.length > 0)
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-spike-orange rounded-xl flex items-center justify-center">
                <span className="text-white">🏐</span>
              </div>
              <span className="text-xl font-bold text-spike-navy">
                Spike<span className="text-spike-orange">Coach</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-slate-800">Create your Coach Profile</h1>
            <p className="text-slate-500 text-sm mt-1">Get ready to earn while you coach!</p>
          </div>

          <form onSubmit={handleCoachSubmit} className="card p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name *</label>
                <input className="input" placeholder="Your full name" required
                  value={coachForm.name}
                  onChange={e => setCoachForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="label">Email *</label>
                <input type="email" className="input" placeholder="you@example.com" required
                  value={coachForm.email}
                  onChange={e => setCoachForm(f => ({ ...f, email: e.target.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Password *</label>
                <input type="password" className="input" placeholder="Create password" required minLength={6}
                  value={coachForm.password}
                  onChange={e => setCoachForm(f => ({ ...f, password: e.target.value }))} />
              </div>
              <div>
                <label className="label">Hourly Rate ($)</label>
                <input type="number" className="input" min={10} max={200}
                  value={coachForm.ratePerHour}
                  onChange={e => setCoachForm(f => ({ ...f, ratePerHour: e.target.value }))} />
              </div>
            </div>

            <div>
              <label className="label">Your Skill Level *</label>
              <div className="grid grid-cols-3 gap-3">
                {levels.map(level => (
                  <button key={level.id} type="button"
                    onClick={() => setCoachForm(f => ({ ...f, skillLevel: level.id }))}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      coachForm.skillLevel === level.id
                        ? 'border-spike-orange bg-orange-50 text-spike-orange'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
              {coachForm.skillLevel && (
                <p className="text-xs text-slate-500 mt-2">
                  You can coach: {SKILL_LEVELS[coachForm.skillLevel].canCoach.map(l => SKILL_LEVELS[l].label).join(', ') || 'No one yet'}
                </p>
              )}
            </div>

            <div>
              <label className="label">Bio</label>
              <textarea className="input min-h-[100px] resize-none" placeholder="Tell students about your volleyball background..."
                value={coachForm.bio}
                onChange={e => setCoachForm(f => ({ ...f, bio: e.target.value }))} />
            </div>

            <div>
              <label className="label">Specialties (comma separated)</label>
              <input className="input" placeholder="e.g. Serving, Setting, Defense"
                value={coachForm.specialties}
                onChange={e => setCoachForm(f => ({ ...f, specialties: e.target.value }))} />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-spike-orange"
                  checked={coachForm.certifications.includes('USA Volleyball Certified')}
                  onChange={e => setCoachForm(f => ({
                    ...f,
                    certifications: e.target.checked
                      ? [...f.certifications, 'USA Volleyball Certified']
                      : f.certifications.filter(c => c !== 'USA Volleyball Certified')
                  }))} />
                <span className="text-sm text-slate-700">USA Volleyball Certified</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-spike-orange"
                  checked={coachForm.insured}
                  onChange={e => setCoachForm(f => ({ ...f, insured: e.target.checked }))} />
                <span className="text-sm text-slate-700">Insured</span>
              </label>
            </div>

            <div className="bg-orange-50 rounded-xl p-4 text-sm text-slate-700">
              <p className="font-semibold text-spike-orange mb-1">💰 You keep 85%</p>
              At ${coachForm.ratePerHour}/hr, you earn <strong>${(coachForm.ratePerHour * 0.85).toFixed(2)}</strong> per session hour.
              Platform fee: ${(coachForm.ratePerHour * 0.15).toFixed(2)}.
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setRole(null)}
                className="btn-outline flex-1">
                Back
              </button>
              <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {loading ? 'Creating...' : 'Create Coach Profile'}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-slate-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-spike-orange font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    )
  }

  // ── Parent registration form ──────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-spike-orange rounded-xl flex items-center justify-center">
              <span className="text-white">🏐</span>
            </div>
            <span className="text-xl font-bold text-spike-navy">
              Spike<span className="text-spike-orange">Coach</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Create your Family Account</h1>
          <p className="text-slate-500 text-sm mt-1">You're in control — approve every session.</p>
        </div>

        <form onSubmit={handleParentSubmit} className="card p-8 space-y-5">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <span className="text-lg">👤</span> Parent / Guardian Info
            </h3>
            <div className="space-y-4">
              <div>
                <label className="label">Full Name *</label>
                <input className="input" placeholder="Your full name" required
                  value={parentForm.name}
                  onChange={e => setParentForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Email *</label>
                  <input type="email" className="input" placeholder="you@example.com" required
                    value={parentForm.email}
                    onChange={e => setParentForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Password *</label>
                  <input type="password" className="input" placeholder="Create password" required minLength={6}
                    value={parentForm.password}
                    onChange={e => setParentForm(f => ({ ...f, password: e.target.value }))} />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <span className="text-lg">🏐</span> Your Player's Info
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Player's Name *</label>
                  <input className="input" placeholder="Player's full name" required
                    value={parentForm.studentName}
                    onChange={e => setParentForm(f => ({ ...f, studentName: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Age *</label>
                  <input type="number" className="input" placeholder="e.g. 14" min={8} max={22} required
                    value={parentForm.studentAge}
                    onChange={e => setParentForm(f => ({ ...f, studentAge: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="label">Player's Current Skill Level *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.values(SKILL_LEVELS).map(level => (
                    <button key={level.id} type="button"
                      onClick={() => setParentForm(f => ({ ...f, studentSkillLevel: level.id }))}
                      className={`p-3 rounded-xl border-2 text-xs font-medium transition-all ${
                        parentForm.studentSkillLevel === level.id
                          ? 'border-spike-navy bg-slate-50 text-spike-navy'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {SKILL_LEVELS[parentForm.studentSkillLevel]?.description}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 text-sm text-slate-700">
            <p className="font-semibold text-blue-700 mb-1">🔒 You approve every session</p>
            Before any session is confirmed, you'll receive a notification to review and approve the booking details, coach, time, and location.
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setRole(null)} className="btn-outline flex-1">
              Back
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-slate-500 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-spike-orange font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  )
}
