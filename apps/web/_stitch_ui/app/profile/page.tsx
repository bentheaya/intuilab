'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/navbar'
import Sidebar from '@/components/sidebar'
import { BarChart3, Trophy, Flame, BookOpen, Settings } from 'lucide-react'

export default function ProfilePage() {
  const stats = [
    { icon: BarChart3, label: 'Physics Mastery', value: '75%', color: 'from-blue-500' },
    { icon: BookOpen, label: 'Chemistry Mastery', value: '85%', color: 'from-orange-500' },
    { icon: Trophy, label: 'Biology Mastery', value: '90%', color: 'from-green-500' },
    { icon: Flame, label: 'Math Mastery', value: '60%', color: 'from-purple-500' },
  ]

  const achievements = [
    { id: 1, title: 'First Discovery', desc: 'Complete your first lesson', icon: '🎯' },
    { id: 2, title: '7-Day Streak', desc: 'Learn 7 days in a row', icon: '🔥' },
    { id: 3, title: 'Concept Master', desc: 'Reach 100% mastery on a topic', icon: '🧠' },
    { id: 4, title: 'Lab Explorer', desc: 'Complete 10 virtual experiments', icon: '🧪' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 ml-64 transition-all duration-300 py-8">
          <div className="max-w-6xl mx-auto px-4">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 mb-8"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center ring-4 ring-cyan-400/20">
                    <span className="text-4xl">👨‍🎓</span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Alex Chen</h1>
                    <p className="text-slate-400 mb-3">High School Student • Mathematics Enthusiast</p>
                    <div className="flex gap-3">
                      <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-xs font-semibold text-cyan-300">
                        ⭐ Member since Feb 2024
                      </span>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-xs font-semibold text-emerald-300">
                        🔥 12-day streak
                      </span>
                    </div>
                  </div>
                </div>

                <button className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-cyan-400/50 hover:border-cyan-400 text-cyan-300 hover:text-cyan-200 font-semibold transition-all hover:bg-cyan-400/10">
                  <Settings className="w-5 h-5" />
                  Edit Profile
                </button>
              </div>
            </motion.div>

            {/* Subject Mastery */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Subject Mastery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(({ icon: Icon, label, value, color }, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -5 }}
                    className="glass-card p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Icon className={`w-6 h-6 bg-gradient-to-r ${color} bg-clip-text text-transparent`} />
                      <span className={`text-2xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                        {value}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">{label}</p>
                    
                    {/* Progress Ring */}
                    <div className="mt-4 w-full h-2 bg-slate-700/40 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: value }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full bg-gradient-to-r ${color} rounded-full`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Achievements */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {achievements.map((ach, idx) => (
                  <motion.div
                    key={ach.id}
                    whileHover={{ scale: 1.05 }}
                    className={`glass-card p-6 text-center ${idx < 2 ? 'border-emerald-400/30' : 'opacity-50'}`}
                  >
                    <div className="text-4xl mb-3">{ach.icon}</div>
                    <h3 className="font-semibold text-white mb-1">{ach.title}</h3>
                    <p className="text-xs text-slate-400">{ach.desc}</p>
                    {idx < 2 && (
                      <div className="mt-3 px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-xs font-semibold text-emerald-300 inline-block">
                        Unlocked ✓
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Activity Stats */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Learning Activity</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Hours', value: '84', unit: 'hrs' },
                  { label: 'Lessons Completed', value: '32', unit: 'lessons' },
                  { label: 'Concepts Mastered', value: '28', unit: 'concepts' },
                  { label: 'Rank', value: 'Top 5%', unit: 'global' },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <p className="text-3xl font-bold gradient-text mb-1">{stat.value}</p>
                    <p className="text-xs text-slate-400">{stat.label}</p>
                    <p className="text-xs text-slate-500 mt-1">{stat.unit}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>
        </main>
      </div>
    </div>
  )
}
