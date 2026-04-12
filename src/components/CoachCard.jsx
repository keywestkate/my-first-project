import React from 'react'
import { Link } from 'react-router-dom'
import { SKILL_LEVELS } from '../data/mockData'

function StarRating({ rating }) {
  return (
    <span className="stars text-sm">
      {'★'.repeat(Math.floor(rating))}
      {rating % 1 >= 0.5 ? '½' : ''}
    </span>
  )
}

export default function CoachCard({ coach }) {
  const level = SKILL_LEVELS[coach.skillLevel]

  return (
    <div className="card p-5 flex flex-col gap-4 group">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-2xl ${coach.avatarBg} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm`}>
          {coach.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-slate-800 group-hover:text-spike-orange transition-colors truncate">
              {coach.name}
            </h3>
            {coach.insured && (
              <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                ✓ Insured
              </span>
            )}
          </div>
          <span className={`badge ${level.color} mt-1`}>{level.label}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <StarRating rating={coach.rating} />
          <span className="font-semibold text-slate-700">{coach.rating > 0 ? coach.rating.toFixed(1) : 'New'}</span>
          {coach.reviewCount > 0 && (
            <span className="text-slate-400">({coach.reviewCount})</span>
          )}
        </div>
        <span className="text-slate-300">|</span>
        <span className="text-slate-500">{coach.sessionCount} sessions</span>
      </div>

      {/* Specialties */}
      {coach.specialties?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {coach.specialties.slice(0, 3).map(s => (
            <span key={s} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
              {s}
            </span>
          ))}
          {coach.specialties.length > 3 && (
            <span className="text-xs text-slate-400 px-2.5 py-1">
              +{coach.specialties.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Location */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {coach.location?.city}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-auto">
        <div>
          <span className="text-2xl font-bold text-spike-navy">${coach.ratePerHour}</span>
          <span className="text-slate-400 text-sm">/hr</span>
        </div>
        <Link
          to={`/coaches/${coach.id}`}
          className="btn-primary text-sm py-2 px-4"
        >
          View Profile
        </Link>
      </div>
    </div>
  )
}
