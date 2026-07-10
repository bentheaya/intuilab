'use client'

import { motion } from 'framer-motion'
import { BookOpen, Lightbulb, Map, BarChart3, MessageCircle, FileText, Users, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const sidebarItems = [
  { icon: BookOpen, label: 'Dashboard', href: '/' },
  { icon: Lightbulb, label: 'Learn', href: '/learn' },
  { icon: Map, label: 'Knowledge Map', href: '/map' },
  { icon: BarChart3, label: 'Lab', href: '/lab' },
  { icon: MessageCircle, label: 'Feynman', href: '/feynman' },
  { icon: FileText, label: 'Portfolio', href: '/portfolio' },
  { icon: Users, label: 'Collaborate', href: '/collaborate' },
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed left-0 top-16 h-[calc(100vh-64px)] glass-card border-r transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-4 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center hover:bg-indigo-600 transition-all"
      >
        <ChevronRight className={`w-4 h-4 text-white transition-transform ${isCollapsed ? '' : 'rotate-180'}`} />
      </button>

      {/* Navigation Items */}
      <nav className="flex flex-col gap-2 p-4 pt-8">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          return (
            <motion.div key={item.href} whileHover={{ x: 5 }}>
              <Link
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-indigo-500/20 group"
              >
                <Icon className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                {!isCollapsed && (
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                    {item.label}
                  </span>
                )}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Progress Section */}
      {!isCollapsed && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-6 left-4 right-4 p-4 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-400/10 border border-cyan-400/20"
        >
          <p className="text-xs font-semibold text-slate-300 mb-2">Overall Mastery</p>
          <div className="w-full h-2 bg-slate-700/40 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: '0%' }}
              animate={{ width: '68%' }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
            />
          </div>
          <p className="text-xs text-cyan-300 mt-2 font-semibold">68% Mastered</p>
        </motion.div>
      )}
    </motion.aside>
  )
}
