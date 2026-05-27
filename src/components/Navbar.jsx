import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, Check } from 'lucide-react'

const NAV_LINKS = [
  { key: 'nav.about', id: 'about' },
  { key: 'nav.skills', id: 'skills' },
  { key: 'nav.projects', id: 'projects' },
  { key: 'nav.experience', id: 'experience' },
  { key: 'nav.contact', id: 'contact' },
]

const LANGUAGES = [
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'fa', flag: '🇮🇷', label: 'فارسی', fontClass: 'font-fa' },
  { code: 'ar', flag: '🇸🇦', label: 'العربية', fontClass: 'font-ar' },
  { code: 'ur', flag: '🇵🇰', label: 'اردو', fontClass: 'font-ar' },
  { code: 'es', flag: '🇪🇸', label: 'Español' },
  { code: 'ru', flag: '🇷🇺', label: 'Русский' },
  { code: 'zh', flag: '🇨🇳', label: '中文', fontClass: 'font-zh' },
  { code: 'tr', flag: '🇹🇷', label: 'Türkçe' },
]

const RTL_LANGS = ['fa', 'ar', 'ur']

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const scrollTo = (id) => {
    setMobileOpen(false)
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 280)
  }

  const changeLang = (code) => {
    i18n.changeLanguage(code)
    localStorage.setItem('lang', code)
    const dir = RTL_LANGS.includes(code) ? 'rtl' : 'ltr'
    document.documentElement.setAttribute('dir', dir)
    document.documentElement.setAttribute('lang', code)
    setLangOpen(false)
  }

  const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0]

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
        {/* Logo */}
        <button
          onClick={() => scrollTo('home')}
          className="text-xl font-black tracking-tighter select-none"
        >
          <span className="text-white">A</span>
          <span className="text-accent-light">F</span>
        </button>

        {/* Desktop nav links */}
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

        {/* Right side: language picker + mobile burger */}
        <div className="flex items-center gap-3">
          {/* Language dropdown */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-accent/40 text-accent-light text-xs font-medium hover:bg-accent/15 hover:border-accent/60 transition-all duration-200"
            >
              <span className="text-base leading-none">{current.flag}</span>
              <span className={current.fontClass ?? ''}>{current.label}</span>
              <ChevronDown
                size={11}
                className={`transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute end-0 top-full mt-2 w-48 bg-[#0f0f23] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/60 z-50"
                >
                  {LANGUAGES.map((lang) => {
                    const active = i18n.language === lang.code
                    return (
                      <button
                        key={lang.code}
                        onClick={() => changeLang(lang.code)}
                        className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors duration-150 text-start ${
                          active
                            ? 'bg-accent/10 text-accent-light'
                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className="text-base leading-none w-5 flex-shrink-0">
                          {lang.flag}
                        </span>
                        <span className={`flex-1 ${lang.fontClass ?? ''}`}>{lang.label}</span>
                        {active && <Check size={12} className="text-accent-light flex-shrink-0" />}
                      </button>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
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
