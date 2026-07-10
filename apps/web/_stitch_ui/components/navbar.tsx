'use client'

import { motion } from 'framer-motion'
import { Flame, Search, Settings, User } from 'lucide-react'
import Link from 'next/link'

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 glass-card border-b backdrop-blur-xl"
    >
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
            <span className="text-white font-bold">IL</span>
          </div>
          <span className="text-lg font-semibold gradient-text">IntuiLab</span>
        </Link>

        {/* Subject Switcher */}
        <div className="hidden md:flex gap-1">
          {['Physics', 'Chemistry', 'Biology', 'Math'].map((subject) => (
            <button
              key={subject}
              className="px-3 py-1 text-sm rounded-lg transition-all hover:bg-indigo-500/20 text-slate-300 hover:text-white"
            >
              {subject.slice(0, 3)}
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Streak */}
          <div className="energy-badge">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>12</span>
          </div>

          {/* Search */}
          <button className="p-2 hover:bg-slate-700/40 rounded-lg transition-all">
            <Search className="w-5 h-5 text-slate-400" />
          </button>

          {/* Settings */}
          <button className="p-2 hover:bg-slate-700/40 rounded-lg transition-all">
            <Settings className="w-5 h-5 text-slate-400" />
          </button>

          {/* Profile Avatar */}
          <button className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center ring-2 ring-cyan-400/30 hover:ring-cyan-400/60 transition-all">
            <User className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </motion.nav>
  )
}
