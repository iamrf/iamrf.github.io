import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Github, ExternalLink } from 'lucide-react'
import SectionHeader from './SectionHeader'
import { projects } from '../data/projects'

export default function Projects() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  return (
    <section id="projects" className="py-28 bg-[#0f0f23]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader title={t('projects.title')} subtitle={t('projects.subtitle')} />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="group relative flex flex-col bg-[#0a0a18] rounded-2xl border border-white/5 overflow-hidden hover:border-accent/25 transition-colors duration-300 hover:shadow-2xl hover:shadow-accent/10"
            >
              {/* Gradient top bar */}
              <div className={`h-1 bg-gradient-to-r ${project.gradient} flex-shrink-0`} />

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-white font-bold text-lg mb-2.5 group-hover:text-accent-light transition-colors duration-200">
                  {project.title[lang] ?? project.title.en}
                </h3>

                <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-5">
                  {project.description[lang] ?? project.description.en}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-lg bg-accent/10 text-accent-light border border-accent/15 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-slate-500 hover:text-white text-sm transition-colors duration-200"
                    >
                      <Github size={14} />
                      {t('projects.code')}
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-accent-light hover:text-white text-sm transition-colors duration-200"
                    >
                      <ExternalLink size={14} />
                      {t('projects.demo')}
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-14"
        >
          <a
            href="https://github.com/iamrf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 border border-accent/35 hover:border-accent-light text-slate-300 hover:text-white font-semibold rounded-xl transition-all duration-300 hover:bg-accent/10"
          >
            <Github size={18} />
            {t('projects.view_all')}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
