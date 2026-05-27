import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import fa from './locales/fa.json'
import ar from './locales/ar.json'
import ur from './locales/ur.json'
import es from './locales/es.json'
import ru from './locales/ru.json'
import zh from './locales/zh.json'
import tr from './locales/tr.json'

const savedLang = localStorage.getItem('lang') || 'en'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fa: { translation: fa },
    ar: { translation: ar },
    ur: { translation: ur },
    es: { translation: es },
    ru: { translation: ru },
    zh: { translation: zh },
    tr: { translation: tr },
  },
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
