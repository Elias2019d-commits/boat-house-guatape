// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO(clienta): dominio propio. Cuando exista, cambiar `site` y quitar `base`.
export default defineConfig({
  site: 'https://elias2019d-commits.github.io',
  base: '/boat-house-guatape',
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  integrations: [sitemap()],
  image: { responsiveStyles: false },
  build: { inlineStylesheets: 'always' },
});
