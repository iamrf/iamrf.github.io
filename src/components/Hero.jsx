import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Twitter, Instagram } from 'lucide-react'
import { useTypewriter } from '../hooks/useTypewriter'

const SOCIALS = [
  { Icon: Github, href: 'https://github.com/iamrf', label: 'GitHub' },
  { Icon: Linkedin, href: 'https://ir.linkedin.com/in/aref-fallah', label: 'LinkedIn' },
  { Icon: Twitter, href: 'https://twitter.com/areffallah', label: 'Twitter' },
  { Icon: Instagram, href: 'https://instagram.com/rf.fa', label: 'Instagram' },
]

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

export default function Hero() {
  const { t, i18n } = useTranslation()
  const roles = t('hero.roles', { returnObjects: true })
  const typedText = useTypewriter(roles, 80, 2200, i18n.language)

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 right-1/5 w-[400px] h-[400px] bg-purple-700/15 rounded-full blur-[90px] animate-float-delayed" />
        <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px] animate-float-slow" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(#a78bfa 1px, transparent 1px), linear-gradient(to right, #a78bfa 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Radial fade overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#0a0a18_80%)]" />
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
      >
        <motion.p variants={itemVariants} className="text-accent-light text-sm font-semibold tracking-[0.25em] uppercase mb-4">
          {t('hero.greeting')}
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-7xl lg:text-8xl font-black leading-none mb-6"
        >
          <span className="bg-gradient-to-br from-white via-purple-100 to-accent-light bg-clip-text text-transparent">
            {t('hero.name')}
          </span>
        </motion.h1>

        <motion.div variants={itemVariants} className="h-9 flex items-center justify-center gap-1.5 mb-5">
          <span className="text-xl sm:text-2xl text-slate-300 font-medium">{typedText}</span>
          <span className="text-xl sm:text-2xl text-accent-light font-light animate-blink">|</span>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-10"
        >
          {t('hero.tagline')}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <button
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3.5 bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-accent/30 w-48 sm:w-auto"
          >
            {t('hero.cta_work')}
          </button>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3.5 border border-accent/40 hover:border-accent-light text-slate-300 hover:text-white font-semibold rounded-xl transition-all duration-300 hover:bg-accent/10 w-48 sm:w-auto"
          >
            {t('hero.cta_contact')}
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="flex items-center justify-center gap-4">
          {SOCIALS.map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="p-2.5 rounded-xl border border-white/8 text-slate-500 hover:text-white hover:border-accent/50 hover:bg-accent/10 transition-all duration-200"
            >
              <Icon size={18} />
            </a>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-8 flex flex-col items-center gap-2 text-slate-600 text-xs"
      >
        <span className="tracking-widest uppercase text-[10px]">{t('hero.scroll_hint')}</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={15} />
        </motion.div>
      </motion.div>
    </section>
  )
}
