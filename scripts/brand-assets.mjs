// Regenerates the raster brand files in public/ from the SVG logo. Run: node scripts/brand-assets.mjs
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';

const lockup = await readFile('src/assets/logo/lockup-horizontal.svg', 'utf8');
const inner = lockup.replace(/^<svg[^>]*>|<\/svg>\s*$/g, '');

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" fill="none">
  <rect width="1200" height="630" fill="#0E0E10"/>
  <g transform="translate(235 195) scale(2.5)">${inner}</g>
</svg>`;

await sharp(Buffer.from(og)).png().toFile('public/og-image.png');
await sharp('public/favicon.svg', { density: 300 }).resize(180, 180).png().toFile('public/apple-touch-icon.png');
console.log('public/og-image.png and public/apple-touch-icon.png written');
