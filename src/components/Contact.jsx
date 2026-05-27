import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Github, Linkedin, Twitter, Instagram, Send, CheckCircle2 } from 'lucide-react'
import SectionHeader from './SectionHeader'

const SOCIALS = [
  { Icon: Github, href: 'https://github.com/iamrf', label: 'GitHub' },
  { Icon: Linkedin, href: 'https://ir.linkedin.com/in/aref-fallah', label: 'LinkedIn' },
  { Icon: Twitter, href: 'https://twitter.com/areffallah', label: 'Twitter' },
  { Icon: Instagram, href: 'https://instagram.com/rf.fa', label: 'Instagram' },
]

export default function Contact() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = `Portfolio Contact from ${form.name}`
    const body = `From: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    window.open(
      `mailto:Aref.Fallah@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    )
    setSent(true)
    setForm({ name: '', email: '', message: '' })
    setTimeout(() => setSent(false), 5000)
  }

  const inputClass =
    'w-full px-4 py-3.5 bg-[#0a0a18] border border-white/8 rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-all duration-200'

  return (
    <section id="contact" className="py-28 bg-[#0f0f23]">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader title={t('contact.title')} subtitle={t('contact.subtitle')} />

        <div className="grid md:grid-cols-2 gap-14">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-slate-400 leading-relaxed mb-8">{t('contact.description')}</p>

            <a
              href="mailto:Aref.Fallah@gmail.com"
              className="group flex items-center gap-3.5 text-slate-300 hover:text-white transition-colors mb-10"
            >
              <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 group-hover:bg-accent/20 transition-colors flex-shrink-0">
                <Mail size={18} className="text-accent-light" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Email</p>
                <p className="font-medium text-sm">Aref.Fallah@gmail.com</p>
              </div>
            </a>

            <p className="text-slate-500 text-xs uppercase tracking-widest mb-4">{t('contact.social')}</p>
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-3 rounded-xl border border-white/8 text-slate-500 hover:text-white hover:border-accent/50 hover:bg-accent/10 transition-all duration-200"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t('contact.form.name')}
              required
              className={inputClass}
            />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder={t('contact.form.email')}
              required
              className={inputClass}
            />
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder={t('contact.form.message')}
              required
              rows={5}
              className={`${inputClass} resize-none`}
            />

            <AnimatePresence>
              {sent && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-2 text-green-400 text-sm"
                >
                  <CheckCircle2 size={15} />
                  {t('contact.form.success')}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-accent/30"
            >
              <Send size={15} />
              {t('contact.form.send')}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
