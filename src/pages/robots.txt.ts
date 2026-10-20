import type { APIRoute } from 'astro';

// Built from `site` so the domain lives only in astro.config.mjs.
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap-index.xml', site)}\n`);
