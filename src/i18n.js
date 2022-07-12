import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-xhr-backend'
// import { setLocale } from 'yup'
import moment from 'moment'

import 'moment/locale/fr'

moment.locale(localStorage.getItem('i18nextLng'))

// TODO wrap in async function for loading?
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: `${process.env.REACT_APP_I18N_BASE_URL}/{{lng}}/{{ns}}.json`
    },
    react: {
      useSuspense: false //   <---- this will do the magic
    },
    returnObjects: true,
    languages: ['fr', 'en'],
    whitelist: ['fr', 'en'],
    // Use cimode to show keys instead of translations for debugging
    // lng: 'cimode',
    lng: localStorage.getItem('i18nextLng'),

    fallbackLng: process.env.REACT_APP_I18N_FALLBACK_LANGUAGE,
    ns: [
      'general',
      'menus'
    ],
    debug: false,
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
