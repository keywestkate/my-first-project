import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { SKILL_LEVELS, DAYS, REVIEWS } from '../data/mockData'

function StarRating({ rating, size = 'md' }) {
  const cls = size === 'lg' ? 'text-2xl' : 'text-base'
  return (
    <span className={`stars ${cls}`}>
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= Math.round(rating) ? 'text-yellow-400' : 'text-slate-200'}>★</span>
      ))}
    </span>
  )
}

export default function CoachProfile() {
  const { id } = useParams()
  const { coaches, currentUser } = useApp()
  const navigate = useNavigate()

  const coach = coaches.find(c => c.id === id)
  if (!coach) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🏐</p>
          <h2 className="text-xl font-bold text-slate-700 mb-2">Coach not found</h2>
          <Link to="/coaches" className="btn-primary mt-4">Browse Coaches</Link>
        </div>
      </div>
    )
  }

  const level = SKILL_LEVELS[coach.skillLevel]
  const reviews = REVIEWS[coach.id] || []
  const canBook = currentUser?.role === 'parent'
  const isOwner = currentUser?.id === coach.id
  const totalSlots = Object.values(coach.availability).reduce((sum, slots) => sum + slots.length, 0)

  const handleBook = () => {
    if (!currentUser) {
      navigate('/login')
    } else {
      navigate(`/book/${coach.id}`)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-spike-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link to="/coaches" className="text-slate-400 hover:text-white text-sm flex items-center gap-1.5 mb-6 w-fit transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to coaches
          </Link>

          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className={`w-24 h-24 rounded-2xl ${coach.avatarBg} flex items-center justify-center text-white text-3xl font-bold shadow-lg flex-shrink-0`}>
              {coach.avatar}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-black">{coach.name}</h1>
                <span className={`badge ${level.color}`}>{level.label}</span>
                {coach.insured && (
                  <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full font-medium">
                    ✓ Insured
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-5 text-sm text-slate-300">
                {coach.rating > 0 && (
                  <div className="flex items-center gap-1.5">
                    <StarRating rating={coach.rating} />
                    <span className="font-semibold text-white">{coach.rating.toFixed(1)}</span>
                    <span className="text-slate-400">({coach.reviewCount} reviews)</span>
                  </div>
                )}
                <span>🏐 {coach.sessionCount} sessions</span>
                <span>📍 {coach.location?.city}</span>
                <span>🗓️ Member since {coach.joinedDate}</span>
              </div>

              {coach.certifications?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {coach.certifications.map(c => (
                    <span key={c} className="bg-green-500/15 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/30">
                      ✓ {c}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Price / Book (desktop) */}
            <div className="hidden md:block">
              <div className="bg-white rounded-2xl p-5 shadow-lg min-w-[200px] text-center">
                <p className="text-3xl font-black text-spike-navy">${coach.ratePerHour}</p>
                <p className="text-slate-400 text-sm mb-4">per hour</p>
                {isOwner ? (
                  <Link to="/coach/dashboard" className="btn-secondary w-full block text-center">
                    Go to Dashboard
                  </Link>
                ) : (
                  <button onClick={handleBook} className="btn-primary w-full">
                    {!currentUser ? 'Log in to Book' : 'Book a Session'}
                  </button>
                )}
                <p className="text-xs text-slate-400 mt-3">
                  {totalSlots} available time slots
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main */}
          <div className="flex-1 space-y-6">
            {/* About */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-3">About {coach.name.split(' ')[0]}</h2>
              <p className="text-slate-600 leading-relaxed">{coach.bio || 'No bio provided yet.'}</p>
            </div>

            {/* Specialties */}
            {coach.specialties?.length > 0 && (
              <div className="card p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-3">Specialties</h2>
                <div className="flex flex-wrap gap-2">
                  {coach.specialties.map(s => (
                    <span key={s} className="bg-orange-50 text-spike-orange border border-orange-200 px-4 py-2 rounded-full text-sm font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Who they can coach */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-3">Who {coach.name.split(' ')[0]} can coach</h2>
              {level.canCoach.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {level.canCoach.map(l => {
                    const tl = SKILL_LEVELS[l]
                    return (
                      <div key={l} className={`p-4 rounded-xl border-2 ${
                        currentUser?.student?.skillLevel === l
                          ? 'border-spike-orange bg-orange-50'
                          : 'border-slate-100'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className={`badge ${tl.color}`}>{tl.label}</span>
                          {currentUser?.student?.skillLevel === l && (
                            <span className="text-xs text-spike-orange font-semibold">Your player ✓</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 mt-1">{tl.description}</p>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-slate-400">This coach is still awaiting skill verification.</p>
              )}
            </div>

            {/* Availability */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Weekly Availability</h2>
              {totalSlots === 0 ? (
                <p className="text-slate-400 text-sm">No availability set yet. Check back soon!</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {DAYS.map(day => {
                    const slots = coach.availability[day] || []
                    if (slots.length === 0) return null
                    return (
                      <div key={day} className="bg-slate-50 rounded-xl p-3">
                        <p className="text-xs font-bold text-slate-700 mb-2">{day}</p>
                        <div className="space-y-1">
                          {slots.map(t => (
                            <span key={t} className="block text-xs bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded-lg">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Location */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-3">Session Location</h2>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-spike-orange flex-shrink-0 mt-0.5">
                  📍
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{coach.location?.name}</p>
                  <p className="text-slate-500 text-sm">{coach.location?.address}</p>
                  <p className="text-slate-500 text-sm">{coach.location?.city}</p>
                  <p className="text-xs text-green-600 mt-1 font-medium">✓ SpikeCoach approved venue</p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-800">
                  Reviews {reviews.length > 0 && <span className="text-slate-400 font-normal text-base">({reviews.length})</span>}
                </h2>
                {coach.rating > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black text-spike-navy">{coach.rating.toFixed(1)}</span>
                    <StarRating rating={coach.rating} />
                  </div>
                )}
              </div>
              {reviews.length === 0 ? (
                <p className="text-slate-400 text-sm">No reviews yet. Be the first to book a session!</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map(r => (
                    <div key={r.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-700 text-sm">{r.studentName}</span>
                        <span className="text-xs text-slate-400">{r.date}</span>
                      </div>
                      <StarRating rating={r.rating} />
                      <p className="text-slate-600 text-sm mt-1">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sticky Sidebar (desktop) */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="card p-5 sticky top-24">
              <div className="text-center mb-5">
                <p className="text-4xl font-black text-spike-navy">${coach.ratePerHour}</p>
                <p className="text-slate-400 text-sm">per session hour</p>
              </div>

              <div className="space-y-2 mb-5 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="text-green-500">✓</span>
                  {coach.certifications?.length > 0 ? 'USA Volleyball Certified' : 'Background checked'}
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="text-green-500">✓</span>
                  {coach.insured ? 'Fully insured' : 'Registration required'}
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="text-green-500">✓</span>
                  Parent approval required
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="text-green-500">✓</span>
                  Approved venue only
                </div>
              </div>

              {isOwner ? (
                <Link to="/coach/dashboard" className="btn-secondary w-full block text-center">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <button onClick={handleBook} className="btn-primary w-full text-base py-3 mb-3">
                    {!currentUser ? 'Log in to Book' : canBook ? 'Book a Session' : 'Parents book sessions'}
                  </button>
                  {!currentUser && (
                    <p className="text-xs text-center text-slate-400">
                      <Link to="/register" className="text-spike-orange hover:underline">Create a parent account</Link> to book
                    </p>
                  )}
                </>
              )}

              <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-400">
                  Platform fee: 15% · Coach earns: ${(coach.ratePerHour * 0.85).toFixed(2)}/hr
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile book button */}
      {!isOwner && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xl font-black text-spike-navy">${coach.ratePerHour}<span className="text-sm font-normal text-slate-400">/hr</span></p>
          </div>
          <button onClick={handleBook} className="btn-primary py-3 px-6">
            {!currentUser ? 'Log in to Book' : 'Book Session'}
          </button>
        </div>
      )}
    </div>
  )
}
