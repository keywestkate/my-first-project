import React, { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import CoachCard from '../components/CoachCard'
import { SKILL_LEVELS, DAYS } from '../data/mockData'

export default function BrowseCoaches() {
  const { coaches, currentUser } = useApp()
  const [search, setSearch] = useState('')
  const [filterLevel, setFilterLevel] = useState('')
  const [filterDay, setFilterDay] = useState('')
  const [filterInsured, setFilterInsured] = useState(false)
  const [sortBy, setSortBy] = useState('rating')

  const studentLevel = currentUser?.role === 'parent' ? currentUser.student?.skillLevel : null

  const filtered = useMemo(() => {
    let list = [...coaches]

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.specialties?.some(s => s.toLowerCase().includes(q)) ||
        c.bio?.toLowerCase().includes(q)
      )
    }

    // Skill level filter
    if (filterLevel) {
      list = list.filter(c => c.skillLevel === filterLevel)
    }

    // Can coach the student
    if (studentLevel) {
      list = list.filter(c => SKILL_LEVELS[c.skillLevel]?.canCoach.includes(studentLevel))
    }

    // Day availability
    if (filterDay) {
      list = list.filter(c => (c.availability[filterDay] || []).length > 0)
    }

    // Insured only
    if (filterInsured) {
      list = list.filter(c => c.insured)
    }

    // Sort
    if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating)
    else if (sortBy === 'price_asc') list.sort((a, b) => a.ratePerHour - b.ratePerHour)
    else if (sortBy === 'price_desc') list.sort((a, b) => b.ratePerHour - a.ratePerHour)
    else if (sortBy === 'sessions') list.sort((a, b) => b.sessionCount - a.sessionCount)

    return list
  }, [coaches, search, filterLevel, filterDay, filterInsured, sortBy, studentLevel])

  const clearFilters = () => {
    setSearch('')
    setFilterLevel('')
    setFilterDay('')
    setFilterInsured(false)
    setSortBy('rating')
  }

  const hasFilters = search || filterLevel || filterDay || filterInsured

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-spike-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-black mb-2">Find Your Coach</h1>
          <p className="text-slate-400">
            {studentLevel
              ? `Showing coaches who can train ${SKILL_LEVELS[studentLevel]?.label} level players`
              : 'Browse certified student coaches across all skill levels'
            }
          </p>

          {/* Search */}
          <div className="mt-6 max-w-xl">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, specialty, or skill..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-400 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-spike-orange focus:bg-white/20 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="card p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800">Filters</h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-spike-orange hover:underline">
                    Clear all
                  </button>
                )}
              </div>

              {/* Student level indicator */}
              {studentLevel && (
                <div className="bg-blue-50 rounded-xl p-3 mb-4 border border-blue-100">
                  <p className="text-xs font-semibold text-blue-700 mb-1">Filtering for your player</p>
                  <p className="text-xs text-blue-600">
                    Showing coaches who can train <strong>{SKILL_LEVELS[studentLevel]?.label}</strong> players
                  </p>
                </div>
              )}

              {/* Skill Level */}
              {!studentLevel && (
                <div className="mb-5">
                  <label className="label">Coach Skill Level</label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setFilterLevel('')}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                        !filterLevel ? 'bg-spike-orange text-white' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      All Levels
                    </button>
                    {Object.values(SKILL_LEVELS).filter(l => l.canCoach.length > 0).map(level => (
                      <button
                        key={level.id}
                        onClick={() => setFilterLevel(level.id === filterLevel ? '' : level.id)}
                        className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                          filterLevel === level.id ? 'bg-spike-orange text-white' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability */}
              <div className="mb-5">
                <label className="label">Available On</label>
                <select
                  value={filterDay}
                  onChange={e => setFilterDay(e.target.value)}
                  className="input text-sm"
                >
                  <option value="">Any day</option>
                  {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* Insured */}
              <div className="mb-5">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setFilterInsured(!filterInsured)}
                    className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                      filterInsured ? 'bg-spike-orange' : 'bg-slate-200'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      filterInsured ? 'translate-x-5' : 'translate-x-1'
                    }`} />
                  </div>
                  <span className="text-sm text-slate-700">Insured only</span>
                </label>
              </div>

              {/* Sort */}
              <div>
                <label className="label">Sort By</label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="input text-sm"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="sessions">Most Experienced</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Coach Grid */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <p className="text-slate-600 text-sm">
                <span className="font-semibold text-slate-800">{filtered.length}</span> coaches found
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-4xl mb-4">🔍</p>
                <h3 className="text-lg font-bold text-slate-700 mb-2">No coaches found</h3>
                <p className="text-slate-400 text-sm">Try adjusting your filters</p>
                <button onClick={clearFilters} className="btn-outline mt-4 text-sm py-2">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(coach => (
                  <CoachCard key={coach.id} coach={coach} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
