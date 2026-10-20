// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // TODO: trocar pelo domínio real (usado em canonical, hreflang, OG e sitemap)
  site: 'https://jrstudio.pt',
  trailingSlash: 'always',

  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en'],
    routing: { prefixDefaultLocale: false },
  },

  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Manrope',
      cssVariable: '--font-manrope',
      weights: ['200 800'],
      subsets: ['latin', 'latin-ext'],
    },
  ],

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    sitemap({
      i18n: { defaultLocale: 'pt', locales: { pt: 'pt-PT', en: 'en' } },
    }),
  ]
});
