import { useTranslation } from 'react-i18next'
import { Heart } from 'lucide-react'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-[#060610] border-t border-white/5 py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-600 text-sm">
        <span>
          © {new Date().getFullYear()} Aref Fallah.{' '}
          <span className="text-slate-700">{t('footer.rights')}</span>
        </span>
        <div className="flex items-center gap-1.5">
          <span>{t('footer.built')}</span>
          <Heart size={12} className="text-accent fill-accent" />
        </div>
      </div>
    </footer>
  )
}
