import React, { useState } from 'react'
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { SKILL_LEVELS, DAYS, LOCATIONS } from '../data/mockData'

const STEPS = ['Select Time', 'Choose Location', 'Review & Confirm']

export default function BookSession() {
  const { coachId } = useParams()
  const { coaches, currentUser, createBooking } = useApp()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!currentUser) return <Navigate to="/login" />
  if (currentUser.role !== 'parent') return <Navigate to="/coach/dashboard" />

  const coach = coaches.find(c => c.id === coachId)
  if (!coach) return <Navigate to="/coaches" />

  const student = currentUser.student
  const coachLevel = SKILL_LEVELS[coach.skillLevel]
  const studentLevel = SKILL_LEVELS[student?.skillLevel]

  // Check if coach can actually train this student
  const canTrain = coachLevel?.canCoach.includes(student?.skillLevel)

  // Available days (coach has slots)
  const availableDays = DAYS.filter(d => (coach.availability[d] || []).length > 0)

  // Get next occurrence of a weekday
  const getNextDate = (dayName) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const today = new Date()
    const targetDay = days.indexOf(dayName)
    const diff = (targetDay - today.getDay() + 7) % 7 || 7
    const next = new Date(today)
    next.setDate(today.getDate() + diff)
    return next.toISOString().split('T')[0]
  }

  const handleDaySelect = (day) => {
    setSelectedDay(day)
    setSelectedTime('')
    setSelectedDate(getNextDate(day))
  }

  const handleConfirm = () => {
    const booking = {
      coachId: coach.id,
      studentId: student.id,
      parentId: currentUser.id,
      date: selectedDate,
      day: selectedDay,
      time: selectedTime,
      location: selectedLocation,
      durationHours: 1,
      totalCost: coach.ratePerHour,
      coachEarnings: coach.ratePerHour * 0.85,
      platformFee: coach.ratePerHour * 0.15,
      notes,
    }
    createBooking(booking)
    setSubmitted(true)
  }

  // ── Success screen ────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">
            ✅
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Request Sent!</h1>
          <p className="text-slate-500 mb-6">
            Your session request with <strong>{coach.name}</strong> has been submitted.
            As the parent, you'll need to approve it from your dashboard before it's confirmed.
          </p>
          <div className="card p-5 text-left mb-6">
            <h3 className="font-semibold text-slate-700 mb-3">Booking Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Coach</span>
                <span className="font-medium">{coach.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Player</span>
                <span className="font-medium">{student?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date</span>
                <span className="font-medium">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Time</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location</span>
                <span className="font-medium">{selectedLocation?.name}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-700">Total</span>
                <span className="font-bold text-spike-navy">${coach.ratePerHour}</span>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 text-sm text-yellow-800 mb-6 border border-yellow-200">
            <p className="font-semibold mb-1">⏳ Pending your approval</p>
            Go to your parent dashboard to approve this session request.
          </div>
          <div className="flex gap-3">
            <Link to="/parent/dashboard" className="btn-primary flex-1">
              Go to Dashboard
            </Link>
            <Link to="/coaches" className="btn-outline flex-1">
              Browse More
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Booking flow ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link to={`/coaches/${coach.id}`} className="text-slate-400 hover:text-slate-600 text-sm flex items-center gap-1.5 mb-4 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to profile
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Book a Session</h1>

          {/* Coach mini-card */}
          <div className="card p-4 mt-4 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${coach.avatarBg} flex items-center justify-center text-white font-bold flex-shrink-0`}>
              {coach.avatar}
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-800">{coach.name}</p>
              <div className="flex items-center gap-2 text-sm">
                <span className={`badge ${SKILL_LEVELS[coach.skillLevel]?.color} text-xs`}>
                  {SKILL_LEVELS[coach.skillLevel]?.label}
                </span>
                {coach.rating > 0 && <span className="text-slate-500 stars">{'★'.repeat(Math.floor(coach.rating))} {coach.rating}</span>}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-spike-navy">${coach.ratePerHour}</span>
              <span className="text-slate-400 text-sm">/hr</span>
            </div>
          </div>

          {/* Compatibility check */}
          {!canTrain && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4">
              <p className="text-red-700 font-semibold text-sm">⚠️ Skill level mismatch</p>
              <p className="text-red-600 text-sm mt-1">
                {coach.name} coaches <strong>{coachLevel?.canCoach.map(l => SKILL_LEVELS[l].label).join(', ')}</strong> level players, but {student?.name} is <strong>{studentLevel?.label}</strong>.
                {' '}<Link to="/coaches" className="underline">Find a matching coach</Link>.
              </p>
            </div>
          )}

          {/* Player info */}
          <div className="bg-blue-50 rounded-xl p-4 mt-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${student?.avatarBg || 'bg-slate-400'} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
              {student?.avatar}
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-800">Player: {student?.name}</p>
              <p className="text-xs text-blue-600">
                Age {student?.age} · {studentLevel?.label} level
                {canTrain && <span className="ml-2 text-green-600 font-medium">✓ Coach match!</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  i < step ? 'bg-spike-orange text-white' :
                  i === step ? 'bg-spike-navy text-white' :
                  'bg-slate-200 text-slate-400'
                }`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <p className={`text-xs mt-1 text-center max-w-[70px] ${i === step ? 'text-spike-navy font-semibold' : 'text-slate-400'}`}>
                  {s}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-4 ${i < step ? 'bg-spike-orange' : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ── Step 0: Select Time ──────────────────────────────────────── */}
        {step === 0 && (
          <div className="card p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-800">Choose a Day & Time</h2>

            {availableDays.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p className="text-3xl mb-3">📅</p>
                <p>This coach hasn't set their availability yet.</p>
                <Link to="/coaches" className="text-spike-orange hover:underline text-sm mt-2 inline-block">Find another coach</Link>
              </div>
            ) : (
              <>
                <div>
                  <label className="label">Select a Day</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availableDays.map(day => (
                      <button
                        key={day}
                        onClick={() => handleDaySelect(day)}
                        className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          selectedDay === day
                            ? 'border-spike-orange bg-orange-50 text-spike-orange'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {day.slice(0, 3)}
                        <div className="text-xs font-normal mt-0.5 text-slate-400">
                          {(coach.availability[day] || []).length} slots
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedDay && (
                  <div>
                    <label className="label">Select a Time ({selectedDay})</label>
                    <p className="text-xs text-slate-400 mb-3">Next available: {selectedDate}</p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {(coach.availability[selectedDay] || []).map(time => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                            selectedTime === time
                              ? 'border-spike-orange bg-orange-50 text-spike-orange'
                              : 'border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="label">Notes for coach (optional)</label>
                  <textarea
                    className="input min-h-[80px] resize-none"
                    placeholder="What would you like to focus on? e.g. passing fundamentals, serving technique..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </div>

                <button
                  onClick={() => setStep(1)}
                  disabled={!selectedDay || !selectedTime}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Location →
                </button>
              </>
            )}
          </div>
        )}

        {/* ── Step 1: Location ─────────────────────────────────────────── */}
        {step === 1 && (
          <div className="card p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-800">Choose a Location</h2>
            <p className="text-slate-500 text-sm">All venues are pre-approved SpikeCoach partner facilities.</p>

            <div className="space-y-3">
              {/* Coach's primary first */}
              {[coach.location, ...LOCATIONS.filter(l => l.id !== coach.location?.id)].map(loc => (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    selectedLocation?.id === loc.id
                      ? 'border-spike-orange bg-orange-50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">{loc.name}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{loc.address}</p>
                      <p className="text-sm text-slate-500">{loc.city}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {loc.id === coach.location?.id && (
                        <span className="text-xs bg-orange-100 text-spike-orange px-2 py-0.5 rounded-full font-medium">
                          Coach's primary
                        </span>
                      )}
                      <span className="text-xs text-green-600 font-medium">✓ Approved venue</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="btn-outline flex-1">← Back</button>
              <button
                onClick={() => setStep(2)}
                disabled={!selectedLocation}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Review Booking →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Review & Confirm ──────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="card p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Review Your Booking</h2>

              <div className="space-y-3">
                {[
                  { label: 'Coach', value: coach.name },
                  { label: 'Player', value: `${student?.name} (${studentLevel?.label})` },
                  { label: 'Date', value: selectedDate },
                  { label: 'Day & Time', value: `${selectedDay} · ${selectedTime}` },
                  { label: 'Duration', value: '1 hour' },
                  { label: 'Location', value: `${selectedLocation?.name}, ${selectedLocation?.city}` },
                ].map(row => (
                  <div key={row.label} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                    <span className="text-slate-500 text-sm">{row.label}</span>
                    <span className="font-medium text-slate-800 text-sm text-right max-w-[60%]">{row.value}</span>
                  </div>
                ))}
                {notes && (
                  <div className="py-2 border-b border-slate-100">
                    <p className="text-slate-500 text-sm mb-1">Notes</p>
                    <p className="text-sm text-slate-700 italic">"{notes}"</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment breakdown */}
            <div className="card p-6">
              <h3 className="font-bold text-slate-800 mb-4">Payment Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Session rate (1hr)</span>
                  <span>${coach.ratePerHour}.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Platform fee (15%)</span>
                  <span className="text-slate-500">${(coach.ratePerHour * 0.15).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-slate-100">
                  <span>Total</span>
                  <span className="text-spike-navy">${coach.ratePerHour}.00</span>
                </div>
                <p className="text-xs text-slate-400 pt-1">
                  Coach earns ${(coach.ratePerHour * 0.85).toFixed(2)} from this session.
                </p>
              </div>
            </div>

            {/* Parent approval notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
              <p className="font-semibold text-yellow-800 mb-1">👨‍👩‍👧 Parent approval required</p>
              <p className="text-yellow-700 text-sm">
                After submitting, this booking will appear as <strong>"Pending Approval"</strong> in your dashboard. You'll need to review and approve it there before it's confirmed with the coach.
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-outline flex-1">← Back</button>
              <button onClick={handleConfirm} className="btn-primary flex-1">
                Submit Request ✓
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
