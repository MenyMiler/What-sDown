import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import hebrew from './hebrew';

export const resources = {
    he: {
        translation: hebrew,
    },
} as const;

i18next.use(initReactI18next).init({
    resources,
    lng: 'he',
    interpolation: {
        escapeValue: false,
    },
});
