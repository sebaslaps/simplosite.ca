import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://simplosite.ca',
  output: 'static',
  integrations: [sitemap()],
});
