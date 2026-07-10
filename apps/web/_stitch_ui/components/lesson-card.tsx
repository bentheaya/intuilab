'use client'

import { motion } from 'framer-motion'
import { Clock, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface LessonCardProps {
  title: string
  subject: 'physics' | 'chemistry' | 'biology' | 'math'
  duration: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  progress?: number
  href: string
}

const subjectColors = {
  physics: 'from-blue-500 to-cyan-400',
  chemistry: 'from-orange-500 to-red-400',
  biology: 'from-green-500 to-emerald-400',
  math: 'from-violet-500 to-purple-400',
}

const difficultyBadge = {
  beginner: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
  intermediate: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
  advanced: 'bg-red-500/20 text-red-300 border-red-400/30',
}

export default function LessonCard({
  title,
  subject,
  duration,
  difficulty,
  progress = 0,
  href,
}: LessonCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={href}>
        <div className="glass-card p-6 cursor-pointer group h-full">
          {/* Subject Gradient Background */}
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 rounded-xl bg-gradient-to-br ${subjectColors[subject]} transition-opacity duration-300 -z-10`} />

          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors flex-1">
              {title}
            </h3>
            <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium ${difficultyBadge[difficulty]}`}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </span>
            <span className="inline-flex items-center gap-1 text-sm text-slate-400">
              <Clock className="w-4 h-4" />
              {duration} min
            </span>
          </div>

          {/* Progress Bar */}
          {progress > 0 && (
            <div className="mb-4">
              <div className="w-full h-1.5 bg-slate-700/40 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">{progress}% complete</p>
            </div>
          )}

          {/* CTA */}
          <div className="flex items-center gap-2 text-sm font-medium text-cyan-400 group-hover:text-cyan-300 transition-colors">
            {progress === 100 ? 'Review' : 'Start Learning'}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
