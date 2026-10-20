import pt from './pt.json';
import enJson from './en.json';

// Typed against pt so a missing/renamed key in en.json fails `astro check`.
const en: typeof pt = enJson;

export const dict = { pt, en };
export type Lang = keyof typeof dict;

export const htmlLang: Record<Lang, string> = { pt: 'pt-PT', en: 'en' };
export const ogLocale: Record<Lang, string> = { pt: 'pt_PT', en: 'en_US' };

// Section anchors stay the same in both languages so links never break.
export const sections = ['services', 'portfolio', 'about', 'contact'] as const;
