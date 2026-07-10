'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/navbar'
import Sidebar from '@/components/sidebar'
import { Lightbulb, Mic, MessageSquare, RotateCcw, Trophy } from 'lucide-react'
import { useState } from 'react'

export default function FeynmanPage() {
  const [explanation, setExplanation] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState<number | null>(null)

  const concept = {
    title: 'Photosynthesis',
    subtitle: 'Explain how plants convert light energy into chemical energy',
    level: 'High School',
  }

  const handleSubmit = () => {
    if (explanation.trim()) {
      setSubmitted(true)
      // Simulate AI scoring
      setTimeout(() => {
        setScore(Math.floor(Math.random() * 40) + 60)
      }, 1500)
    }
  }

  const handleRetry = () => {
    setExplanation('')
    setSubmitted(false)
    setScore(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 ml-64 transition-all duration-300 py-8">
          <div className="max-w-4xl mx-auto px-4">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h1 className="text-4xl font-bold gradient-text mb-3 flex items-center gap-3">
                <Lightbulb className="w-10 h-10" />
                Feynman Challenger
              </h1>
              <p className="text-lg text-slate-300">
                Master concepts by explaining them simply. Teach as if explaining to a 12-year-old.
              </p>
            </motion.div>

            {/* Challenge Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 mb-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-sm font-semibold text-cyan-300 mb-2">TODAY'S CHALLENGE</p>
                  <h2 className="text-3xl font-bold text-white mb-3">{concept.title}</h2>
                  <p className="text-lg text-slate-300 mb-2">{concept.subtitle}</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-sm font-semibold text-indigo-300 whitespace-nowrap">
                  {concept.level}
                </div>
              </div>

              {/* Avatar */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 text-center mb-8">
                <div className="text-6xl mb-3">👦</div>
                <p className="text-slate-300 italic">
                  &ldquo;Explain {concept.title.toLowerCase()} to me like I&apos;m just starting middle school.&rdquo;
                </p>
              </div>

              {/* Input Area */}
              {!submitted ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Your Explanation
                    </label>
                    <textarea
                      value={explanation}
                      onChange={(e) => setExplanation(e.target.value)}
                      placeholder="Write your simple explanation here... Use everyday language and examples."
                      className="w-full h-40 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 transition-colors"
                    />
                    <p className="text-xs text-slate-400 mt-2">
                      {explanation.length} characters
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleSubmit}
                      disabled={!explanation.trim()}
                      className="flex-1 py-3 px-6 rounded-lg font-semibold bg-gradient-to-r from-indigo-500 to-cyan-400 text-white hover:shadow-lg hover:shadow-indigo-500/50 disabled:opacity-50 transition-all"
                    >
                      Submit Explanation
                    </button>
                    <button className="p-3 rounded-lg hover:bg-slate-700/40 transition-all flex items-center justify-center">
                      <Mic className="w-5 h-5 text-slate-300" />
                    </button>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Scoring */}
                  {score !== null ? (
                    <>
                      <div className="text-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                          className="mb-4"
                        >
                          {score >= 80 ? (
                            <Trophy className="w-20 h-20 text-yellow-400 mx-auto" />
                          ) : (
                            <Lightbulb className="w-20 h-20 text-cyan-400 mx-auto" />
                          )}
                        </motion.div>

                        <p className="text-sm text-slate-400 mb-2">YOUR SCORE</p>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="inline-flex items-center gap-1"
                        >
                          <span className={`text-5xl font-bold ${
                            score >= 80
                              ? 'text-emerald-400'
                              : score >= 60
                                ? 'text-cyan-400'
                                : 'text-yellow-400'
                          }`}>
                            {score}
                          </span>
                          <span className="text-2xl text-slate-400">/100</span>
                        </motion.div>
                      </div>

                      {/* Feedback */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { label: 'Clarity', value: Math.floor(score * 0.8), icon: '📊' },
                          { label: 'Depth', value: Math.floor(score * 0.9), icon: '📚' },
                          { label: 'Intuition', value: score, icon: '💡' },
                        ].map((metric) => (
                          <div key={metric.label} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                            <p className="text-3xl mb-2">{metric.icon}</p>
                            <p className="text-xs text-slate-400 mb-1">{metric.label}</p>
                            <div className="w-full h-2 bg-slate-700/40 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: '0%' }}
                                animate={{ width: `${metric.value}%` }}
                                transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* AI Feedback */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="p-6 rounded-lg bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border border-cyan-400/20"
                      >
                        <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          AI Feedback
                        </p>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          Great explanation! You captured the core concept of energy transformation. Next time, try to include a specific example from nature to make it even more relatable. Consider mentioning chlorophyll and how it captures sunlight.
                        </p>
                      </motion.div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <button
                          onClick={handleRetry}
                          className="flex-1 py-3 px-6 rounded-lg font-semibold border-2 border-cyan-400/50 hover:border-cyan-400 text-cyan-300 hover:text-cyan-200 transition-all hover:bg-cyan-400/10"
                        >
                          <RotateCcw className="w-4 h-4 inline mr-2" />
                          Try Again
                        </button>
                        <button className="flex-1 py-3 px-6 rounded-lg font-semibold bg-gradient-to-r from-indigo-500 to-cyan-400 text-white hover:shadow-lg hover:shadow-indigo-500/50 transition-all">
                          Next Challenge
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-12 h-12 rounded-full border-4 border-slate-700/50 border-t-cyan-400 mx-auto"
                      />
                      <p className="text-slate-400 mt-4">Analyzing your explanation...</p>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* Leaderboard */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                Today&apos;s Top Explanations
              </h3>

              <div className="space-y-3">
                {[
                  { rank: 1, name: 'Alex Chen', score: 98, time: '2:15' },
                  { rank: 2, name: 'Jordan Smith', score: 94, time: '3:42' },
                  { rank: 3, name: 'You', score: score || 0, time: submitted ? '1:30' : '-', highlight: true },
                ].map((entry) => (
                  <motion.div
                    key={entry.rank}
                    whileHover={{ x: 5 }}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                      entry.highlight
                        ? 'bg-indigo-500/20 border-indigo-400/30'
                        : 'bg-slate-800/30 border-slate-700/30 hover:border-slate-600/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-slate-400 w-8">{entry.rank}</span>
                      <span className={`font-semibold ${entry.highlight ? 'text-cyan-300' : 'text-slate-300'}`}>
                        {entry.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-slate-400 text-sm">{entry.time}</span>
                      <span className={`text-lg font-bold ${
                        entry.highlight
                          ? 'bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent'
                          : 'text-slate-300'
                      }`}>
                        {entry.score}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>
        </main>
      </div>
    </div>
  )
}
