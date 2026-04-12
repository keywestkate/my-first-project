import React, { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { SKILL_LEVELS } from '../data/mockData'

function StatusBadge({ status }) {
  const map = {
    pending_approval: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
  }
  const labels = {
    pending_approval: 'Needs Your Approval',
    approved: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
  }
  return (
    <span className={`badge ${map[status] || 'bg-slate-100 text-slate-600'}`}>
      {labels[status] || status}
    </span>
  )
}

export default function ParentDashboard() {
  const { currentUser, getParentBookings, approveBooking, declineBooking, getCoachById } = useApp()
  const [activeTab, setActiveTab] = useState('approvals')

  if (!currentUser) return <Navigate to="/login" />
  if (currentUser.role !== 'parent') return <Navigate to="/coach/dashboard" />

  const student = currentUser.student
  const studentLevel = SKILL_LEVELS[student?.skillLevel]
  const bookings = getParentBookings(currentUser.id)
  const pendingBookings = bookings.filter(b => b.status === 'pending_approval')
  const upcomingBookings = bookings.filter(b => b.status === 'approved')
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled')

  const tabs = ['approvals', 'upcoming', 'history', 'student']

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-spike-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Parent info */}
            <div className="flex items-center gap-4 flex-1">
              <div className={`w-16 h-16 rounded-2xl ${currentUser.avatarBg || 'bg-slate-600'} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                {currentUser.avatar || currentUser.name?.[0]}
              </div>
              <div>
                <p className="text-slate-400 text-sm">Welcome back, parent</p>
                <h1 className="text-2xl font-bold">{currentUser.name}</h1>
              </div>
            </div>

            {/* Student card */}
            <div className="bg-white/10 rounded-2xl p-4 flex items-center gap-4 md:w-80">
              <div className={`w-12 h-12 rounded-xl ${student?.avatarBg || 'bg-slate-500'} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                {student?.avatar}
              </div>
              <div>
                <p className="text-slate-400 text-xs">Your Player</p>
                <p className="font-bold text-white">{student?.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`badge ${studentLevel?.color} text-xs`}>{studentLevel?.label}</span>
                  <span className="text-slate-400 text-xs">Age {student?.age}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-slate-400 text-xs">Needs Approval</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1">{pendingBookings.length}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-slate-400 text-xs">Upcoming Sessions</p>
              <p className="text-2xl font-bold text-green-400 mt-1">{upcomingBookings.length}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-slate-400 text-xs">Sessions Completed</p>
              <p className="text-2xl font-bold text-white mt-1">{pastBookings.filter(b => b.status === 'completed').length}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-slate-400 text-xs">Total Invested</p>
              <p className="text-2xl font-bold text-spike-orange mt-1">
                ${bookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + b.totalCost, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 bg-white sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-spike-orange text-spike-orange'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab === 'approvals'
                  ? `⚡ Approvals${pendingBookings.length > 0 ? ` (${pendingBookings.length})` : ''}`
                  : tab === 'upcoming' ? '📅 Upcoming'
                  : tab === 'history' ? '📋 History'
                  : `🏐 ${student?.name}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Approvals Tab ──────────────────────────────────────────────── */}
        {activeTab === 'approvals' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800">Session Approval Requests</h2>
              <p className="text-slate-500 text-sm mt-1">
                Review and approve or decline session requests for {student?.name}.
              </p>
            </div>

            {pendingBookings.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-5xl mb-4">✅</p>
                <h3 className="text-lg font-bold text-slate-700 mb-2">All caught up!</h3>
                <p className="text-slate-400 text-sm mb-6">No pending session requests right now.</p>
                <Link to="/coaches" className="btn-primary">
                  Find a Coach
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingBookings.map(booking => {
                  const coach = getCoachById(booking.coachId)
                  return (
                    <ApprovalCard
                      key={booking.id}
                      booking={booking}
                      coach={coach}
                      student={student}
                      onApprove={() => approveBooking(booking.id)}
                      onDecline={() => declineBooking(booking.id)}
                    />
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Upcoming Tab ──────────────────────────────────────────────── */}
        {activeTab === 'upcoming' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800">Upcoming Sessions</h2>
              <p className="text-slate-500 text-sm mt-1">Confirmed sessions for {student?.name}.</p>
            </div>

            {upcomingBookings.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-5xl mb-4">📅</p>
                <h3 className="text-lg font-bold text-slate-700 mb-2">No upcoming sessions</h3>
                <p className="text-slate-400 text-sm mb-6">Book a session with one of our coaches!</p>
                <Link to="/coaches" className="btn-primary">
                  Browse Coaches
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map(booking => {
                  const coach = getCoachById(booking.coachId)
                  return (
                    <div key={booking.id} className="card p-5">
                      <div className="flex flex-col md:flex-row gap-4 md:items-center">
                        <div className="flex items-center gap-4 flex-1">
                          {coach && (
                            <div className={`w-12 h-12 rounded-xl ${coach.avatarBg} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                              {coach.avatar}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <StatusBadge status={booking.status} />
                            </div>
                            <p className="font-bold text-slate-800">{coach?.name}</p>
                            <p className="text-sm text-slate-500">
                              {booking.date} · {booking.time} · {booking.location?.name}
                            </p>
                            {booking.notes && (
                              <p className="text-sm text-slate-400 italic mt-1">"{booking.notes}"</p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <p className="text-xl font-bold text-spike-navy">${booking.totalCost}</p>
                          <Link to={`/coaches/${booking.coachId}`} className="text-sm text-spike-orange hover:underline">
                            View coach profile
                          </Link>
                          <button
                            onClick={() => declineBooking(booking.id)}
                            className="text-xs text-red-400 hover:text-red-600 transition-colors"
                          >
                            Cancel session
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── History Tab ───────────────────────────────────────────────── */}
        {activeTab === 'history' && (
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-6">Session History</h2>
            {pastBookings.length === 0 ? (
              <div className="card p-12 text-center text-slate-400">
                <p className="text-4xl mb-3">📋</p>
                <p>No past sessions yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pastBookings.map(booking => {
                  const coach = getCoachById(booking.coachId)
                  return (
                    <div key={booking.id} className="card p-5 flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex items-center gap-3 flex-1">
                        {coach && (
                          <div className={`w-10 h-10 rounded-xl ${coach.avatarBg} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                            {coach.avatar}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-800">{coach?.name}</p>
                          <p className="text-sm text-slate-500">{booking.date} · {booking.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                        <StatusBadge status={booking.status} />
                        <p className="text-slate-600 font-medium">${booking.totalCost}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Student Tab ───────────────────────────────────────────────── */}
        {activeTab === 'student' && (
          <div className="max-w-lg space-y-6">
            <div className="card p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-20 h-20 rounded-2xl ${student?.avatarBg || 'bg-slate-400'} flex items-center justify-center text-white text-2xl font-bold shadow`}>
                  {student?.avatar}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{student?.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`badge ${studentLevel?.color}`}>{studentLevel?.label}</span>
                    <span className="text-slate-500 text-sm">Age {student?.age}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Current Skill Level</p>
                  <p className="text-slate-700 mt-1">{studentLevel?.label} — {studentLevel?.description}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Eligible Coach Levels</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Object.values(SKILL_LEVELS)
                      .filter(l => l.canCoach.includes(student?.skillLevel))
                      .map(l => (
                        <span key={l.id} className={`badge ${l.color}`}>{l.label}</span>
                      ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Sessions Attended</p>
                  <p className="text-3xl font-black text-spike-navy mt-1">
                    {bookings.filter(b => b.status === 'completed').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-bold text-slate-800 mb-3">Coaches Worked With</h3>
              {bookings.length === 0 ? (
                <p className="text-slate-400 text-sm">No sessions booked yet.</p>
              ) : (
                <div className="space-y-3">
                  {[...new Set(bookings.map(b => b.coachId))].map(coachId => {
                    const coach = getCoachById(coachId)
                    if (!coach) return null
                    const sessionsWithCoach = bookings.filter(b => b.coachId === coachId && b.status !== 'cancelled').length
                    return (
                      <div key={coachId} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg ${coach.avatarBg} flex items-center justify-center text-white font-bold text-xs`}>
                            {coach.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">{coach.name}</p>
                            <p className="text-xs text-slate-400">{sessionsWithCoach} session{sessionsWithCoach !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                        <Link to={`/coaches/${coachId}`} className="text-xs text-spike-orange hover:underline">
                          View profile
                        </Link>
                      </div>
                    )
                  })}
                </div>
              )}
              <Link to="/coaches" className="btn-outline w-full text-center block mt-4 text-sm py-2">
                Find More Coaches
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ApprovalCard({ booking, coach, student, onApprove, onDecline }) {
  const [deciding, setDeciding] = useState(false)

  const handle = (action) => {
    setDeciding(true)
    setTimeout(() => {
      action()
    }, 300)
  }

  return (
    <div className="card p-6 border-l-4 border-yellow-400">
      <div className="flex flex-col md:flex-row gap-5">
        {/* Coach info */}
        <div className="flex items-start gap-4 flex-1">
          {coach && (
            <div className={`w-14 h-14 rounded-xl ${coach.avatarBg} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm`}>
              {coach.avatar}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="badge bg-yellow-100 text-yellow-700">⏳ Pending Your Approval</span>
            </div>
            <h3 className="font-bold text-slate-800 text-lg">{coach?.name}</h3>
            <p className="text-slate-500 text-sm">for <strong>{student?.name}</strong></p>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 text-sm">
              <div>
                <span className="text-slate-400 text-xs">Date</span>
                <p className="font-medium text-slate-700">{booking.date}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs">Time</span>
                <p className="font-medium text-slate-700">{booking.time}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs">Location</span>
                <p className="font-medium text-slate-700">{booking.location?.name}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs">Duration</span>
                <p className="font-medium text-slate-700">{booking.durationHours} hour</p>
              </div>
            </div>

            {booking.notes && (
              <div className="mt-3 bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500 font-medium mb-1">Session notes</p>
                <p className="text-sm text-slate-600 italic">"{booking.notes}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Action panel */}
        <div className="md:w-48 flex flex-col gap-3 flex-shrink-0">
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-spike-navy">${booking.totalCost}</p>
            <p className="text-xs text-slate-400">total for session</p>
            <p className="text-xs text-slate-400 mt-1">Coach earns ${booking.coachEarnings.toFixed(2)}</p>
          </div>
          <button
            onClick={() => handle(onApprove)}
            disabled={deciding}
            className="btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            ✓ Approve
          </button>
          <button
            onClick={() => handle(onDecline)}
            disabled={deciding}
            className="border-2 border-red-200 text-red-500 hover:bg-red-50 font-semibold py-2.5 rounded-xl transition-all text-sm disabled:opacity-60"
          >
            ✕ Decline
          </button>
          <Link to={`/coaches/${booking.coachId}`} className="text-xs text-center text-spike-orange hover:underline">
            View coach profile
          </Link>
        </div>
      </div>
    </div>
  )
}
