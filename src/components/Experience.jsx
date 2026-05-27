import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Calendar, Briefcase } from 'lucide-react'
import SectionHeader from './SectionHeader'
import { experiences } from '../data/experience'

export default function Experience() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  return (
    <section id="experience" className="py-28 bg-[#0a0a18]">
      <div className="max-w-4xl mx-auto px-6">
        <SectionHeader title={t('experience.title')} subtitle={t('experience.subtitle')} />

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute start-5 md:start-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent via-accent/25 to-transparent md:-translate-x-px" />

          <div className="space-y-10">
            {experiences.map((exp, i) => {
              const isLeft = i % 2 === 0
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative flex md:items-start gap-8 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Timeline dot */}
                  <div
                    className="absolute start-5 md:start-1/2 w-4 h-4 bg-accent rounded-full border-2 border-[#0a0a18] -translate-x-1.5 md:-translate-x-2 mt-5 z-10 flex-shrink-0"
                    style={{ boxShadow: '0 0 12px rgba(124,58,237,0.6)' }}
                  />

                  {/* Card */}
                  <div
                    className={`ms-14 md:ms-0 md:w-[46%] ${isLeft ? 'md:me-auto' : 'md:ms-auto'}`}
                  >
                    <div className="p-6 rounded-2xl bg-[#0f0f23] border border-white/5 hover:border-accent/20 transition-all duration-300 group">
                      <div className="flex items-center gap-2 text-accent-light text-xs font-semibold mb-2">
                        <Calendar size={11} />
                        <span>{exp.period[lang] ?? exp.period.en}</span>
                      </div>

                      <h3 className="text-white font-bold text-base mb-1 group-hover:text-accent-light transition-colors">
                        {exp.role[lang] ?? exp.role.en}
                      </h3>

                      <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-3">
                        <Briefcase size={12} />
                        <span>{exp.company[lang] ?? exp.company.en}</span>
                      </div>

                      <p className="text-slate-500 text-sm leading-relaxed mb-4">
                        {exp.description[lang] ?? exp.description.en}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {exp.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded-md bg-accent/10 text-accent-light border border-accent/15"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
