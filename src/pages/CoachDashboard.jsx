import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { DAYS, TIME_SLOTS, SKILL_LEVELS, LOCATIONS, COACHES } from '../data/mockData'

function StatCard({ label, value, sub, color }) {
  return (
    <div className="card p-5">
      <p className="text-slate-500 text-sm">{label}</p>
      <p className={`text-3xl font-black mt-1 ${color || 'text-spike-navy'}`}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    pending_approval: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
  }
  const labels = {
    pending_approval: 'Pending Parent Approval',
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

export default function CoachDashboard() {
  const { currentUser, updateAvailability, getCoachBookings, coaches } = useApp()
  const [activeTab, setActiveTab] = useState('schedule')
  const [availability, setAvailability] = useState(currentUser?.availability || {})

  if (!currentUser) return <Navigate to="/login" />
  if (currentUser.role !== 'coach') return <Navigate to="/parent/dashboard" />

  // Get up-to-date coach data (in case it was just registered)
  const coach = coaches.find(c => c.id === currentUser.id) || currentUser

  const bookings = getCoachBookings(coach.id)
  const upcomingBookings = bookings.filter(b => b.status === 'approved')
  const pendingBookings = bookings.filter(b => b.status === 'pending_approval')
  const totalEarnings = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.coachEarnings, 0)

  const toggleSlot = (day, time) => {
    const daySlots = availability[day] || []
    const newSlots = daySlots.includes(time)
      ? daySlots.filter(t => t !== time)
      : [...daySlots, time]
    const newAvailability = { ...availability, [day]: newSlots }
    if (newSlots.length === 0) delete newAvailability[day]
    setAvailability(newAvailability)
    updateAvailability(coach.id, newAvailability)
  }

  const level = SKILL_LEVELS[coach.skillLevel]
  const canCoach = level?.canCoach || []

  const tabs = ['schedule', 'bookings', 'profile', 'earnings']

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-spike-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl ${coach.avatarBg || 'bg-spike-orange'} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
              {coach.avatar}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{coach.name}</h1>
                {coach.certifications?.length > 0 && (
                  <span className="bg-green-500/20 text-green-400 text-xs px-2.5 py-1 rounded-full font-medium">
                    ✓ Certified
                  </span>
                )}
                {coach.insured && (
                  <span className="bg-blue-500/20 text-blue-300 text-xs px-2.5 py-1 rounded-full font-medium">
                    ✓ Insured
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className={`badge ${level?.color}`}>{level?.label} Coach</span>
                <span className="text-slate-400 text-sm">${coach.ratePerHour}/hr</span>
                {coach.rating > 0 && (
                  <span className="text-slate-400 text-sm stars">{'★'.repeat(Math.floor(coach.rating))} {coach.rating}</span>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-slate-400 text-xs">Pending Approvals</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1">{pendingBookings.length}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-slate-400 text-xs">Upcoming Sessions</p>
              <p className="text-2xl font-bold text-green-400 mt-1">{upcomingBookings.length}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-slate-400 text-xs">Total Sessions</p>
              <p className="text-2xl font-bold text-white mt-1">{coach.sessionCount}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-slate-400 text-xs">Total Earnings</p>
              <p className="text-2xl font-bold text-spike-orange mt-1">${totalEarnings.toFixed(0)}</p>
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
                className={`px-5 py-4 text-sm font-medium border-b-2 transition-colors capitalize whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-spike-orange text-spike-orange'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab === 'schedule' ? '📅 Schedule' :
                 tab === 'bookings' ? `📋 Bookings ${pendingBookings.length > 0 ? `(${pendingBookings.length})` : ''}` :
                 tab === 'profile' ? '👤 Profile' :
                 '💰 Earnings'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Schedule Tab ──────────────────────────────────────────────── */}
        {activeTab === 'schedule' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Your Availability</h2>
                <p className="text-slate-500 text-sm mt-1">Click time slots to toggle your availability. Students can only book your open slots.</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Active slots</p>
                <p className="text-2xl font-bold text-spike-orange">
                  {Object.values(availability).reduce((sum, slots) => sum + slots.length, 0)}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-medium text-slate-500 py-2 pr-4 w-24">Time</th>
                    {DAYS.map(day => (
                      <th key={day} className="text-center text-xs font-medium text-slate-500 py-2 px-1">
                        {day.slice(0, 3)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.map(time => (
                    <tr key={time} className="border-t border-slate-100">
                      <td className="text-xs text-slate-500 py-1.5 pr-4 whitespace-nowrap">{time}</td>
                      {DAYS.map(day => {
                        const isActive = (availability[day] || []).includes(time)
                        return (
                          <td key={day} className="px-1 py-1.5 text-center">
                            <button
                              onClick={() => toggleSlot(day, time)}
                              className={`w-full h-8 rounded-lg text-xs font-medium transition-all border-2 ${
                                isActive
                                  ? 'bg-spike-orange border-spike-orange text-white shadow-sm'
                                  : 'bg-slate-50 border-transparent text-slate-300 hover:border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              {isActive ? '✓' : ''}
                            </button>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-6 h-5 bg-spike-orange rounded" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-5 bg-slate-100 rounded border border-slate-200" />
                <span>Not available</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Bookings Tab ──────────────────────────────────────────────── */}
        {activeTab === 'bookings' && (
          <div className="space-y-8">
            {/* Pending */}
            {pendingBookings.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full" />
                  Pending Parent Approval ({pendingBookings.length})
                </h2>
                <div className="space-y-3">
                  {pendingBookings.map(b => (
                    <BookingCard key={b.id} booking={b} />
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming */}
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-green-400 rounded-full" />
                Upcoming Sessions ({upcomingBookings.length})
              </h2>
              {upcomingBookings.length === 0 ? (
                <div className="card p-8 text-center text-slate-400">
                  <p className="text-4xl mb-3">📅</p>
                  <p>No upcoming sessions yet. Make sure you have availability set!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingBookings.map(b => (
                    <BookingCard key={b.id} booking={b} />
                  ))}
                </div>
              )}
            </div>

            {/* All bookings */}
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-4">All Bookings</h2>
              {bookings.length === 0 ? (
                <div className="card p-8 text-center text-slate-400">
                  <p className="text-4xl mb-3">📋</p>
                  <p>No bookings yet. Set your availability to start getting bookings!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.map(b => (
                    <BookingCard key={b.id} booking={b} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Profile Tab ───────────────────────────────────────────────── */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Coach Profile</h2>
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-20 h-20 rounded-2xl ${coach.avatarBg || 'bg-spike-orange'} flex items-center justify-center text-white text-2xl font-bold shadow`}>
                  {coach.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{coach.name}</h3>
                  <span className={`badge ${level?.color} mt-1`}>{level?.label}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Bio</p>
                  <p className="text-slate-700 mt-1">{coach.bio || 'No bio yet.'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Specialties</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {coach.specialties?.map(s => (
                      <span key={s} className="text-sm bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Certifications</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {coach.certifications?.length > 0
                      ? coach.certifications.map(c => (
                          <span key={c} className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">{c}</span>
                        ))
                      : <span className="text-slate-400 text-sm">No certifications yet</span>
                    }
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Can Coach Skill Levels</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {canCoach.length > 0
                      ? canCoach.map(l => (
                          <span key={l} className={`badge ${SKILL_LEVELS[l].color}`}>{SKILL_LEVELS[l].label}</span>
                        ))
                      : <span className="text-slate-400 text-sm">Upgrade your skill level to coach</span>
                    }
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Hourly Rate</p>
                    <p className="text-2xl font-bold text-spike-navy mt-1">${coach.ratePerHour}<span className="text-sm font-normal text-slate-400">/hr</span></p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">You Earn Per Hour</p>
                    <p className="text-2xl font-bold text-spike-orange mt-1">${(coach.ratePerHour * 0.85).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-5 bg-blue-50 border-blue-100">
              <p className="text-sm font-semibold text-blue-800 mb-1">📍 Primary Location</p>
              <p className="text-blue-700 text-sm">{coach.location?.name}</p>
              <p className="text-blue-600 text-xs mt-0.5">{coach.location?.address}, {coach.location?.city}</p>
            </div>
          </div>
        )}

        {/* ── Earnings Tab ──────────────────────────────────────────────── */}
        {activeTab === 'earnings' && (
          <div className="max-w-2xl space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard label="Total Earned" value={`$${totalEarnings.toFixed(0)}`} sub="85% of sessions" color="text-spike-orange" />
              <StatCard label="Sessions Done" value={coach.sessionCount} sub="Lifetime" />
              <StatCard label="Avg Per Session" value={`$${coach.sessionCount > 0 ? (totalEarnings / coach.sessionCount).toFixed(2) : '0'}`} sub={`At $${coach.ratePerHour}/hr`} />
            </div>

            <div className="card p-6">
              <h3 className="font-bold text-slate-800 mb-4">Payment Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">Your rate per hour</span>
                  <span className="font-semibold">${coach.ratePerHour}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">Platform fee (15%)</span>
                  <span className="text-red-500">- ${(coach.ratePerHour * 0.15).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-bold text-spike-navy">You keep (85%)</span>
                  <span className="font-bold text-spike-orange text-xl">${(coach.ratePerHour * 0.85).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-bold text-slate-800 mb-4">Recent Sessions</h3>
              {bookings.filter(b => b.status !== 'cancelled').length === 0 ? (
                <p className="text-slate-400 text-center py-4">No sessions yet</p>
              ) : (
                <div className="space-y-3">
                  {bookings.filter(b => b.status !== 'cancelled').map(b => (
                    <div key={b.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-slate-700">{b.date} · {b.time}</p>
                        <p className="text-xs text-slate-400">{b.location?.name}</p>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={b.status} />
                        <p className="text-sm font-bold text-spike-orange mt-1">${b.coachEarnings.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function BookingCard({ booking }) {
  return (
    <div className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <StatusBadge status={booking.status} />
          <span className="text-sm font-semibold text-slate-700">
            {booking.date} · {booking.time}
          </span>
        </div>
        <p className="text-sm text-slate-600">📍 {booking.location?.name}, {booking.location?.city}</p>
        {booking.notes && (
          <p className="text-sm text-slate-500 mt-1 italic">"{booking.notes}"</p>
        )}
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-xl font-bold text-spike-orange">${booking.coachEarnings.toFixed(2)}</p>
        <p className="text-xs text-slate-400">your earnings</p>
      </div>
    </div>
  )
}

