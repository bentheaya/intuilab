'use client'

import { motion } from 'framer-motion'
import { Flame, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative py-12 md:py-20 lg:py-24 px-4"
    >
      {/* Background gradient orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-4xl mx-auto text-center">
        {/* Streak Badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="energy-badge justify-center mx-auto mb-4">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>12 Day Streak</span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 variants={itemVariants} className="mb-6">
          <span className="block text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4">
            Rediscover Science
          </span>
          <span className="gradient-text text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            & Mathematics
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Next-generation learning platform where complex concepts become intuitive. Explore Physics, Chemistry, Biology, and Mathematics through interactive discovery.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/learn" className="group">
            <button className="relative px-8 py-4 rounded-xl font-semibold overflow-hidden transition-all hover:scale-105 active:scale-95">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-400 opacity-100 group-hover:opacity-90 transition-opacity" />

              {/* Content */}
              <span className="relative flex items-center justify-center gap-2 text-white">
                Start Rediscovering
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </Link>

          <button className="px-8 py-4 rounded-xl font-semibold border-2 border-cyan-400/50 hover:border-cyan-400 text-cyan-300 hover:text-cyan-200 transition-all hover:bg-cyan-400/10">
            Explore Map
          </button>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
        >
          {[
            { icon: Sparkles, title: 'Interactive Labs', desc: 'Hands-on virtual experiments' },
            { icon: Flame, title: 'Mastery Tracking', desc: 'Visual progress indicators' },
            { icon: ArrowRight, title: 'Adaptive Learning', desc: 'Personalized pathways' },
          ].map(({ icon: Icon, title, desc }, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="glass-card p-6 text-center"
            >
              <Icon className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-400">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}
