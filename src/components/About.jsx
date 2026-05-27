import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import SectionHeader from './SectionHeader'
import mePhoto from '../../assets/img/me.jpg'

const STATS = [
  { value: '5+', key: 'about.stats.experience' },
  { value: '50+', key: 'about.stats.projects' },
  { value: '20+', key: 'about.stats.clients' },
  { value: '15+', key: 'about.stats.technologies' },
]

export default function About() {
  const { t } = useTranslation()

  return (
    <section id="about" className="py-28 bg-[#0f0f23]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader title={t('about.title')} subtitle={t('about.subtitle')} />

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center lg:justify-start"
          >
            <div className="relative w-72 h-72 sm:w-80 sm:h-80">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/40 to-cyan-500/20 rounded-2xl blur-2xl scale-110" />
              <img
                src={mePhoto}
                alt="Aref Fallah"
                className="relative w-full h-full object-cover rounded-2xl border border-white/10 shadow-2xl"
              />
              {/* Corner accents */}
              <div className="absolute -top-2.5 -start-2.5 w-7 h-7 border-t-2 border-s-2 border-accent-light rounded-tl-sm" />
              <div className="absolute -bottom-2.5 -end-2.5 w-7 h-7 border-b-2 border-e-2 border-accent-light rounded-br-sm" />
              {/* Floating badge */}
              <div className="absolute -bottom-4 -end-4 sm:-end-6 bg-[#0f0f23] border border-white/10 rounded-xl px-3 py-2 shadow-xl">
                <span className="text-accent-light font-bold text-sm">Fullstack</span>
                <br />
                <span className="text-slate-400 text-xs">Developer</span>
              </div>
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="space-y-4 text-slate-400 leading-relaxed mb-8">
              <p>{t('about.bio_1')}</p>
              <p>{t('about.bio_2')}</p>
              <p>{t('about.bio_3')}</p>
            </div>

            <a
              href="/files/doc/aref-fallah-cv.pdf"
              download
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-accent/30"
            >
              <Download size={16} />
              {t('about.download_cv')}
            </a>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-20"
        >
          {STATS.map(({ value, key }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
              className="text-center p-6 rounded-2xl bg-[#0a0a18] border border-white/5 hover:border-accent/20 transition-all duration-300 group"
            >
              <div className="text-4xl font-black text-white group-hover:text-accent-light transition-colors mb-1">
                {value}
              </div>
              <div className="text-slate-500 text-sm">{t(key)}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
