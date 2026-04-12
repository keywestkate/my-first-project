import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-spike-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-spike-orange rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">🏐</span>
              </div>
              <span className="text-xl font-bold">
                Spike<span className="text-spike-orange">Coach</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              The volleyball coaching marketplace where student athletes earn by sharing their skills, and young players level up with peer coaches who've been in their shoes.
            </p>
            <p className="text-slate-500 text-xs mt-4">
              Coaches keep <span className="text-spike-orange font-semibold">85%</span> of every session.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-slate-300 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/coaches" className="text-slate-400 hover:text-white text-sm transition-colors">Find a Coach</Link></li>
              <li><Link to="/register?role=coach" className="text-slate-400 hover:text-white text-sm transition-colors">Become a Coach</Link></li>
              <li><Link to="/register" className="text-slate-400 hover:text-white text-sm transition-colors">Sign Up as Parent</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-slate-300 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2">
              <li><span className="text-slate-400 text-sm">About Us</span></li>
              <li><span className="text-slate-400 text-sm">Safety & Insurance</span></li>
              <li><span className="text-slate-400 text-sm">Privacy Policy</span></li>
              <li><span className="text-slate-400 text-sm">Terms of Service</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs">© 2026 SpikeCoach. All rights reserved.</p>
          <p className="text-slate-500 text-xs">Built for volleyball families, by volleyball players.</p>
        </div>
      </div>
    </footer>
  )
}
