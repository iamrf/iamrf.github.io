import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { key: 'nav.about', id: 'about' },
  { key: 'nav.skills', id: 'skills' },
  { key: 'nav.projects', id: 'projects' },
  { key: 'nav.experience', id: 'experience' },
  { key: 'nav.contact', id: 'contact' },
]

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  const toggleLang = () => {
    const next = i18n.language === 'en' ? 'fa' : 'en'
    i18n.changeLanguage(next)
    localStorage.setItem('lang', next)
    document.documentElement.setAttribute('dir', next === 'fa' ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', next)
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a18]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => scrollTo('home')}
          className="text-xl font-black tracking-tighter select-none"
        >
          <span className="text-white">A</span>
          <span className="text-accent-light">F</span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ key, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-200 relative group"
            >
              {t(key)}
              <span className="absolute -bottom-0.5 start-0 w-0 group-hover:w-full h-px bg-accent-light transition-all duration-300" />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="px-3 py-1.5 rounded-lg border border-accent/40 text-accent-light text-xs font-bold hover:bg-accent/15 hover:border-accent/70 transition-all duration-200"
          >
            {i18n.language === 'en' ? 'FA' : 'EN'}
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden bg-[#0f0f23] border-t border-white/5"
          >
            <div className="px-6 py-5 flex flex-col gap-4">
              {NAV_LINKS.map(({ key, id }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="text-slate-300 hover:text-white text-sm font-medium text-start transition-colors"
                >
                  {t(key)}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
