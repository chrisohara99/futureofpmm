import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://futureofpmm.com',
  markdown: {
    shikiConfig: {
      theme: 'github-dark'
    }
  }
});
