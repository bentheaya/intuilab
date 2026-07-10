'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/navbar'
import Sidebar from '@/components/sidebar'
import HeroSection from '@/components/hero-section'
import LessonCard from '@/components/lesson-card'
import { BookOpen, TrendingUp, Zap } from 'lucide-react'

export default function Home() {
  const recentLessons = [
    {
      title: 'Forces & Motion Basics',
      subject: 'physics' as const,
      duration: 15,
      difficulty: 'beginner' as const,
      progress: 65,
      href: '/learn/physics/mechanics/forces',
    },
    {
      title: 'Molecular Bonding',
      subject: 'chemistry' as const,
      duration: 20,
      difficulty: 'intermediate' as const,
      progress: 40,
      href: '/learn/chemistry/bonding/molecular',
    },
    {
      title: 'Cell Structure & Function',
      subject: 'biology' as const,
      duration: 25,
      difficulty: 'beginner' as const,
      progress: 85,
      href: '/learn/biology/cells/structure',
    },
    {
      title: 'Calculus Fundamentals',
      subject: 'math' as const,
      duration: 30,
      difficulty: 'advanced' as const,
      progress: 0,
      href: '/learn/math/calculus/fundamentals',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 ml-64 transition-all duration-300">
          <HeroSection />

          {/* Next Rediscovery Card */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto px-4 py-8 mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Next Rediscovery</h2>
            <motion.div
              whileHover={{ y: -8 }}
              className="glass-card p-8 bg-gradient-to-r from-indigo-500/20 to-cyan-400/10 border-cyan-400/30"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-cyan-300 font-semibold mb-2">RECOMMENDED FOR YOU</p>
                  <h3 className="text-3xl font-bold gradient-text mb-2">Quantum Mechanics Intro</h3>
                  <p className="text-slate-300">Understand wave-particle duality through interactive visualization</p>
                </div>
                <Zap className="w-16 h-16 text-yellow-400 opacity-30" />
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex gap-3">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-medium text-blue-300">
                    Physics
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-xs font-medium text-purple-300">
                    Advanced
                  </span>
                </div>
                <span className="text-sm text-slate-400">45 minutes</span>
                <button className="ml-auto px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all">
                  Start Now
                </button>
              </div>
            </motion.div>
          </motion.section>

          {/* Recent Activity */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto px-4 py-12"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-cyan-400" />
                Continue Learning
              </h2>
              <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
                View All
                <span>→</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentLessons.map((lesson) => (
                <LessonCard key={lesson.href} {...lesson} />
              ))}
            </div>
          </motion.section>

          {/* Stats Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto px-4 py-12 mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-8">Your Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: TrendingUp, label: 'Overall Mastery', value: '68%', color: 'from-indigo-500' },
                { icon: BookOpen, label: 'Lessons Completed', value: '24', color: 'from-cyan-400' },
                { icon: Zap, label: 'Current Streak', value: '12 days', color: 'from-emerald-500' },
              ].map(({ icon: Icon, label, value, color }, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="glass-card p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-slate-400">{label}</p>
                    <Icon className={`w-5 h-5 bg-gradient-to-r ${color} bg-clip-text text-transparent`} />
                  </div>
                  <p className="text-3xl font-bold text-white">{value}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </main>
      </div>
    </div>
  )
}
