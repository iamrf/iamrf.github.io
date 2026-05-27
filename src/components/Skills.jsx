import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'
import { skills } from '../data/skills'

export default function Skills() {
  const { t } = useTranslation()

  return (
    <section id="skills" className="py-28 bg-[#0a0a18]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader title={t('skills.title')} subtitle={t('skills.subtitle')} />

        <div className="space-y-12">
          {skills.map((category, ci) => (
            <div key={category.id}>
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: ci * 0.08, duration: 0.5 }}
                className="text-white font-semibold text-base mb-5 flex items-center gap-3"
              >
                <span className="inline-block w-6 h-0.5 bg-gradient-to-r from-accent to-accent-light rounded-full" />
                {t(category.titleKey)}
              </motion.h3>

              <div className="flex flex-wrap gap-3">
                {category.items.map((skill, si) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: ci * 0.04 + si * 0.04, duration: 0.4 }}
                    whileHover={{ scale: 1.07, y: -3 }}
                    className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#0f0f23] border border-white/5 hover:border-accent/35 hover:bg-[#14143a] transition-all duration-200 cursor-default"
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0 shadow-sm"
                      style={{ background: skill.color, boxShadow: `0 0 6px ${skill.color}80` }}
                    />
                    <span className="text-slate-400 group-hover:text-white text-sm font-medium transition-colors duration-200">
                      {skill.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
