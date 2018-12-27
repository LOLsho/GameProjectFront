import {L10nConfig, StorageStrategy, ProviderType, L10nLoader} from 'angular-l10n';

export function initL10n(l10nLoader: L10nLoader): Function {
  return () => l10nLoader.load();
}

export const l10nConfig: L10nConfig = {
  locale: {
    languages: [
      {code: 'ru', dir: 'ltr'},
      {code: 'en', dir: 'ltr'},
    ],
    currency: 'RUB',
    defaultLocale: {languageCode: 'ru', countryCode: 'RU'},
    language: 'ru',
    storage: StorageStrategy.Cookie,
  },
  translation: {
    providers: [
      {type: ProviderType.Static, prefix: './assets/configs/l10n/locale-'},
    ],
    caching: true,
    missingValue: 'NO TRANSLATION',
  },
};
