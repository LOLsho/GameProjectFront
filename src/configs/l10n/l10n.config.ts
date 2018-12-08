import { L10nConfig, StorageStrategy, ProviderType } from 'angular-l10n';

export const l10nConfig: L10nConfig = {
	locale: {
		languages: [
			{ code: 'ru', dir: 'ltr' },
			{ code: 'en', dir: 'ltr' },
		],
		language: 'ru',
		storage: StorageStrategy.Cookie,
	},
	translation: {
		providers: [
			{ type: ProviderType.Static, prefix: './locale-' },
		],
		caching: true,
		missingValue: 'NO TRANSLATION',
	},
};