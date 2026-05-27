import { motion } from 'framer-motion'

export default function SectionHeader({ title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="text-center mb-16"
    >
      <p className="text-accent-light text-xs font-bold uppercase tracking-[0.2em] mb-3">
        {subtitle}
      </p>
      <h2 className="text-3xl sm:text-4xl font-black text-white">{title}</h2>
      <div className="mt-5 mx-auto w-14 h-0.5 rounded-full bg-gradient-to-r from-accent to-cyan-400" />
    </motion.div>
  )
}
