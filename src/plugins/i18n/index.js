import ko from '@/plugins/i18n/locales/ko.json';
import { createI18n } from 'vue-i18n';

const defaultLocale = 'ko';

const languages = {
    ko: ko
};

const messages = Object.assign(languages);

export const i18n = createI18n({
    legacy: false,
    locale: defaultLocale,
    globalInjection: true,
    missingWarn: false,
    fallbackWarn: false,
    messages
});

export default i18n;
