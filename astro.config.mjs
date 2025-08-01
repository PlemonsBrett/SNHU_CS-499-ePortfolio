// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://portfolio.plemons.dev',
  integrations: [svelte(), mdx()],
  output: 'static',
});
