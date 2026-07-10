'use client'

import { motion } from 'framer-motion'
import { Clock, BookOpen, Zap } from 'lucide-react'

const timelineEvents = [
  {
    year: '1687',
    scientist: 'Isaac Newton',
    title: "Newton's Laws of Motion",
    description: 'Revolutionary principles explaining how objects move and forces interact',
    color: 'from-blue-500',
  },
  {
    year: '1905',
    scientist: 'Albert Einstein',
    title: 'Theory of Special Relativity',
    description: 'Fundamentally changed our understanding of space, time, and energy',
    color: 'from-purple-500',
  },
  {
    year: '1953',
    scientist: 'Rosalind Franklin',
    title: 'DNA Double Helix Structure',
    description: 'Critical X-ray crystallography revealing the structure of DNA',
    color: 'from-green-500',
  },
  {
    year: '1869',
    scientist: 'Dmitri Mendeleev',
    title: 'Periodic Table of Elements',
    description: 'Organized elements by atomic weight, predicting undiscovered elements',
    color: 'from-orange-500',
  },
]

export default function HistoryPage() {
  return (
    <div className="flex-1 py-8 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold gradient-text mb-3 flex items-center gap-3">
            <Clock className="w-10 h-10" />
            Scientific History Timeline
          </h1>
          <p className="text-lg text-zinc-300">
            Explore the breakthroughs that shaped modern science
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 via-cyan-400 to-emerald-500" />

          <div className="space-y-12">
            {timelineEvents.map((event, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="pl-24 relative"
              >
                {/* Timeline node */}
                <div className="absolute left-[26px] top-6 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 border-4 border-zinc-950" />

                {/* Event card */}
                <div className="glass rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold text-cyan-300 mb-1">{event.year}</p>
                      <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                      <p className="text-zinc-400 mb-3">{event.scientist}</p>
                    </div>
                    <div className={`w-20 h-20 rounded-lg bg-gradient-to-br ${event.color} to-transparent opacity-20 flex items-center justify-center`}>
                      <BookOpen className="w-10 h-10 text-zinc-400" />
                    </div>
                  </div>

                  <p className="text-zinc-300 mb-6">{event.description}</p>

                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 hover:bg-indigo-500/30 transition-all text-sm font-semibold">
                    <Zap className="w-4 h-4" />
                    Replay Experiment
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Load more */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <button className="px-6 py-3 rounded-lg border-2 border-cyan-400/50 hover:border-cyan-400 text-cyan-300 hover:text-cyan-200 font-semibold transition-all hover:bg-cyan-400/10">
            Explore More Historical Figures →
          </button>
        </motion.div>
      </div>
    </div>
  )
}
