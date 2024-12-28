import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './translation/en.json';
import urTranslations from './translation/ur.json';

// Configure i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      ur: {
        translation: urTranslations
      }
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    },
    // Handle text direction for RTL languages (Urdu)
    react: {
      useSuspense: true,
      defaultTransParent: 'span',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p', 'span'],
      // Handle RTL/LTR
      get bindI18n() {
        return 'languageChanged loaded';
      },
      get bindI18nStore() {
        return '';
      },
      // Update document direction based on language
      get defaultDirection() {
        return i18n.language === 'ur' ? 'rtl' : 'ltr';
      }
    }
  });

// Function to change language
export const changeLanguage = (lng) => {
  i18n.changeLanguage(lng);
  // Update document direction
  document.documentElement.dir = lng === 'ur' ? 'rtl' : 'ltr';
  // Dispatch event for components that need to know about language changes
  window.dispatchEvent(new Event('languagechange'));
};

export default i18n;