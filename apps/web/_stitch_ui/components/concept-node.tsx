'use client'

import { motion } from 'framer-motion'
import { Lock, CheckCircle } from 'lucide-react'

interface ConceptNodeProps {
  label: string
  mastered?: boolean
  locked?: boolean
  connections?: number
  onClick?: () => void
}

export default function ConceptNode({
  label,
  mastered = false,
  locked = false,
  connections = 0,
  onClick,
}: ConceptNodeProps) {
  return (
    <motion.button
      whileHover={!locked ? { scale: 1.15, rotate: 5 } : {}}
      whileTap={!locked ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={locked}
      className={`relative group transition-all ${locked ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
    >
      {/* Glow effect */}
      <div
        className={`absolute inset-0 rounded-full blur-lg transition-all ${
          mastered
            ? 'bg-emerald-500/30 scale-125 group-hover:scale-150'
            : 'bg-indigo-500/20 scale-100 group-hover:scale-125'
        }`}
      />

      {/* Main node */}
      <div
        className={`relative w-20 h-20 rounded-full flex items-center justify-center border-2 transition-all ${
          mastered
            ? 'bg-gradient-to-br from-emerald-500/20 to-cyan-400/10 border-emerald-400 shadow-lg shadow-emerald-500/20 glow-accent'
            : locked
              ? 'bg-slate-700/30 border-slate-600'
              : 'bg-gradient-to-br from-indigo-500/20 to-cyan-400/10 border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/30'
        }`}
      >
        {/* Icon */}
        {locked ? (
          <Lock className="w-8 h-8 text-slate-400" />
        ) : mastered ? (
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        ) : (
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400" />
        )}
      </div>

      {/* Label */}
      <p className={`mt-4 text-sm font-medium text-center max-w-24 leading-tight transition-colors ${
        mastered ? 'text-emerald-300' : 'text-slate-200 group-hover:text-cyan-300'
      }`}>
        {label}
      </p>

      {/* Connection indicator */}
      {connections > 0 && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-2 rounded-full border border-dashed border-indigo-400/30 group-hover:border-cyan-400/50 transition-colors"
        />
      )}
    </motion.button>
  )
}
