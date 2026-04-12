import React from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import CoachCard from '../components/CoachCard'
import { COACHES, SKILL_LEVELS } from '../data/mockData'

function StatCard({ number, label }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-black text-spike-orange">{number}</div>
      <div className="text-slate-300 text-sm mt-1">{label}</div>
    </div>
  )
}

function HowItWorksStep({ step, title, desc, icon }) {
  return (
    <div className="text-center px-4">
      <div className="w-16 h-16 bg-spike-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
        {icon}
      </div>
      <div className="inline-block bg-spike-orange text-white text-xs font-bold px-2.5 py-1 rounded-full mb-3">
        Step {step}
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}

export default function Landing() {
  const { currentUser } = useApp()
  const featuredCoaches = COACHES.filter(c => c.rating >= 4.7).slice(0, 3)

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-spike-navy overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-spike-orange/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/3 text-[20rem] font-black select-none">
            🏐
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-spike-orange/20 text-spike-orange px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span>🏐</span>
              <span>The Volleyball Coaching Marketplace</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
              Train with coaches
              <br />
              <span className="text-spike-orange">who've been there</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-10 max-w-2xl mx-auto">
              Connect with certified student coaches who match your skill level.
              Set your own schedule. Earn on your terms. Grow the game together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {currentUser ? (
                <Link
                  to={currentUser.role === 'coach' ? '/coach/dashboard' : '/parent/dashboard'}
                  className="btn-primary text-lg py-4 px-8"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/coaches" className="btn-primary text-lg py-4 px-8">
                    Find a Coach
                  </Link>
                  <Link to="/register?role=coach" className="btn-outline text-lg py-4 px-8 border-white text-white hover:bg-white hover:text-spike-navy">
                    Become a Coach
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatCard number="200+" label="Active Coaches" />
              <StatCard number="1,400+" label="Sessions Booked" />
              <StatCard number="85%" label="Coach Earnings" />
              <StatCard number="4.8★" label="Average Rating" />
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works (Coaches) ───────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="badge bg-blue-100 text-blue-700 mb-3">For Student Coaches</span>
            <h2 className="section-title">Turn your skills into income</h2>
            <p className="section-sub">Set your own schedule, coach at your level, keep 85% of every session.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <HowItWorksStep step={1} icon="📋" title="Sign Up & Get Certified" desc="Create your coach profile, submit your volleyball background, and get USA Volleyball certified." />
            <HowItWorksStep step={2} icon="📅" title="Set Your Schedule" desc="Choose your available days and times. Coach as much or as little as you want — total flexibility." />
            <HowItWorksStep step={3} icon="🤝" title="Get Matched & Booked" desc="Students and parents find you based on skill level and availability. You accept sessions you want." />
            <HowItWorksStep step={4} icon="💰" title="Earn & Grow" desc="Get paid directly after each session. Build reviews and grow your coaching reputation." />
          </div>
          <div className="text-center mt-12">
            <Link to="/register?role=coach" className="btn-primary">
              Start Coaching Today
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it works (Students) ──────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="badge bg-orange-100 text-orange-700 mb-3">For Students & Parents</span>
            <h2 className="section-title">Find the perfect coach for your player</h2>
            <p className="section-sub">Safe, skill-matched coaching sessions — approved by parents every step of the way.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <HowItWorksStep step={1} icon="👨‍👩‍👧" title="Parent Creates Account" desc="Parents sign up and create a secure profile for their student. You're in control at every step." />
            <HowItWorksStep step={2} icon="🔍" title="Browse Skill-Matched Coaches" desc="Find coaches at the right level for your player — filtered by skill, location, and availability." />
            <HowItWorksStep step={3} icon="✅" title="Book & Approve Sessions" desc="Request a session and get a parent approval prompt. Confirm the time, location, and payment together." />
          </div>
          <div className="text-center mt-12">
            <Link to="/register" className="btn-primary">
              Get Your Player Coached
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured Coaches ─────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title">Top Rated Coaches</h2>
              <p className="section-sub">Verified student coaches ready to train your player.</p>
            </div>
            <Link to="/coaches" className="btn-outline hidden md:inline-flex">
              View All Coaches
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCoaches.map(coach => (
              <CoachCard key={coach.id} coach={coach} />
            ))}
          </div>
          <div className="text-center mt-8 md:hidden">
            <Link to="/coaches" className="btn-outline">
              View All Coaches
            </Link>
          </div>
        </div>
      </section>

      {/* ── Skill Level Guide ────────────────────────────────────────────── */}
      <section className="py-20 bg-spike-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Skill-matched coaching</h2>
            <p className="text-slate-400 text-lg mt-3">Coaches can only train players at or below their verified skill level.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.values(SKILL_LEVELS).map(level => (
              <div key={level.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                <span className={`badge ${level.color} mb-3`}>{level.label}</span>
                <p className="text-slate-300 text-sm mb-3">{level.description}</p>
                {level.canCoach.length > 0 ? (
                  <div>
                    <p className="text-slate-500 text-xs font-medium mb-2">Can coach:</p>
                    <div className="flex flex-wrap gap-1">
                      {level.canCoach.map(l => (
                        <span key={l} className={`badge ${SKILL_LEVELS[l].color} text-xs`}>
                          {SKILL_LEVELS[l].label}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 text-xs">Student level — find a coach above!</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Safety Section ───────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge bg-green-100 text-green-700 mb-4">Safety First</span>
              <h2 className="section-title">Built for families you can trust</h2>
              <div className="space-y-5 mt-6">
                {[
                  { icon: '🛡️', title: 'Coach Certification', desc: 'All coaches go through USA Volleyball certification and background checks before they can accept bookings.' },
                  { icon: '👨‍👩‍👧', title: 'Parent-Controlled Bookings', desc: 'Every session request requires explicit parent approval. No session happens without your sign-off.' },
                  { icon: '📍', title: 'Verified Locations', desc: 'Sessions only take place at pre-approved, safe venues like sports centers and community gyms.' },
                  { icon: '💳', title: 'Secure Payments', desc: 'Payments are processed securely through the platform. Coaches only get paid after sessions are complete.' },
                ].map(item => (
                  <div key={item.title} className="flex gap-4">
                    <div className="text-2xl mt-0.5">{item.icon}</div>
                    <div>
                      <h4 className="font-semibold text-slate-800">{item.title}</h4>
                      <p className="text-slate-500 text-sm mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-spike-orange/10 to-blue-500/10 rounded-3xl p-8 space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 text-xl">✓</div>
                <div>
                  <div className="font-semibold text-slate-800">USA Volleyball Certified</div>
                  <div className="text-sm text-slate-500">Coach verified & insured</div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-xl">📱</div>
                <div>
                  <div className="font-semibold text-slate-800">Parent Approval Required</div>
                  <div className="text-sm text-slate-500">You're notified for every booking</div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 text-xl">📍</div>
                <div>
                  <div className="font-semibold text-slate-800">Approved Venues Only</div>
                  <div className="text-sm text-slate-500">No private locations allowed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-spike-orange">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Ready to get on the court?
          </h2>
          <p className="text-orange-100 text-xl mb-10">
            Join hundreds of players and coaches already on SpikeCoach.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/coaches" className="bg-white text-spike-orange font-bold py-4 px-8 rounded-xl hover:bg-orange-50 transition-colors text-lg shadow-lg">
              Find My Coach
            </Link>
            <Link to="/register?role=coach" className="border-2 border-white text-white font-bold py-4 px-8 rounded-xl hover:bg-white/10 transition-colors text-lg">
              Start Coaching
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
