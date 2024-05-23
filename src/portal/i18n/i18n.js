import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from './locales/en/translation.json'
import de from './locales/de/translation.json'
import es from './locales/es/translation.json'
import fr from './locales/fr/translation.json'
import it from './locales/it/translation.json'
import nl from './locales/nl/translation.json'
import pt from './locales/pt/translation.json'
import tr from './locales/tr/translation.json'

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        de: { translation: de },
        es: { translation: es },
        fr: { translation: fr },
        it: { translation: it },
        nl: { translation: nl },
        pt: { translation: pt },
        tr: { translation: tr },
    },
    lng: import.meta.env.VITE_APP_DEFAULT_LANGUAGE ?? 'en',
    fallbackLng: 'en',
})