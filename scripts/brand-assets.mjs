// Regenerates favicon.svg, apple-touch-icon.png and og-image.png in public/ from public/logo_jr.svg.
// Run: node scripts/brand-assets.mjs
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const logo = await readFile('public/logo_jr.svg', 'utf8');
const letters = logo.match(/<path[^>]*fill="white"[^>]*\/>/g);
if (!letters?.length) throw new Error('No white letter paths found in public/logo_jr.svg');

// Favicon: dark background (the logo is white on transparent) and a thicker frame so it reads at 16px.
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1373 1373" fill="none">
  <rect width="1373" height="1373" fill="#0E0E10"/>
  <rect x="50" y="50" width="1273" height="1273" stroke="#C8A96A" stroke-width="100"/>
  ${letters.join('\n  ')}
</svg>
`;
await writeFile('public/favicon.svg', favicon);
await sharp(Buffer.from(favicon)).resize(180, 180).png().toFile('public/apple-touch-icon.png');

// OG image: the logo as-is, centred on the brand background.
const size = 360;
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0E0E10"/>
  <svg x="${(1200 - size) / 2}" y="${(630 - size) / 2}" width="${size}" height="${size}" viewBox="0 0 1373 1373" fill="none">${logo.replace(/^<svg[^>]*>|<\/svg>\s*$/g, '')}</svg>
</svg>`;
await sharp(Buffer.from(og)).png().toFile('public/og-image.png');

console.log('public/favicon.svg, apple-touch-icon.png and og-image.png written');
