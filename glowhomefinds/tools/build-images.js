// Writes every SVG illustration and exports the PNG/WebP versions.
const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const sharp = require('sharp');
const art = require('./art');
const config = require('../site/config.js');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const IMG = path.join(SITE, 'images');
const PINS = path.join(ROOT, 'marketing', 'pins');
const MARKETING_IMG = path.join(ROOT, 'marketing', 'illustrations');

const fontDir = path.join(__dirname, 'node_modules/@expo-google-fonts/poppins');
const fontFiles = ['500Medium/Poppins_500Medium.ttf', '600SemiBold/Poppins_600SemiBold.ttf', '700Bold/Poppins_700Bold.ttf', '800ExtraBold/Poppins_800ExtraBold.ttf']
  .map((p) => path.join(fontDir, p));

for (const d of [IMG, path.join(IMG, 'icons'), PINS, MARKETING_IMG]) fs.mkdirSync(d, { recursive: true });

function render(svg, width) {
  const r = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Poppins' },
  });
  return r.render().asPng();
}

async function writePng(svg, file, width, { webp = false } = {}) {
  const png = await sharp(render(svg, width)).png({ compressionLevel: 9, palette: false }).toBuffer();
  fs.writeFileSync(file, png);
  if (webp) await sharp(png).webp({ quality: 82 }).toFile(file.replace(/\.png$/, '.webp'));
}

// Collapse whitespace so the SVGs served to visitors stay small.
const min = (svg) => svg.replace(/\n\s*/g, '').replace(/>\s+</g, '><') + '\n';

(async () => {
  const brand = config.BRAND_NAME;
  const url = config.SITE_URL;

  const pages = {
    'hero-house.svg': art.hero(),
    'before-after.svg': art.beforeAfter(),
    'holiday-halloween.svg': art.holiday('halloween'),
    'holiday-christmas.svg': art.holiday('christmas'),
    'holiday-july4.svg': art.holiday('july4'),
    'holiday-everyday.svg': art.holiday('everyday'),
  };
  for (const [name, svg] of Object.entries(pages)) {
    fs.writeFileSync(path.join(IMG, name), min(svg));
    // PNG + WebP copies for social posts / other uses
    await writePng(svg, path.join(MARKETING_IMG, name.replace('.svg', '.png')), 1200, { webp: true });
  }

  for (const name of Object.keys(art.ICONS)) fs.writeFileSync(path.join(IMG, 'icons', `${name}.svg`), art.iconSvg(name) + '\n');

  // Brand
  const logoDark = art.logo(brand, true);
  const logoLight = art.logo(brand, false);
  fs.writeFileSync(path.join(IMG, 'logo.svg'), min(logoDark));
  fs.writeFileSync(path.join(IMG, 'logo-on-light.svg'), min(logoLight));
  await writePng(logoDark, path.join(MARKETING_IMG, 'logo.png'), 1000);
  await writePng(logoLight, path.join(MARKETING_IMG, 'logo-on-light.png'), 1000);

  const fav = art.favicon();
  fs.writeFileSync(path.join(SITE, 'favicon.svg'), min(fav));
  await writePng(fav, path.join(SITE, 'favicon-32.png'), 32);
  await writePng(fav, path.join(SITE, 'apple-touch-icon.png'), 180);
  await writePng(fav, path.join(SITE, 'icon-192.png'), 192);
  await writePng(fav, path.join(SITE, 'icon-512.png'), 512);

  // Social
  await writePng(art.ogImage(brand, url), path.join(IMG, 'og-image.png'), 1200);

  // Pinterest pins (not used on the site)
  await writePng(art.pin1(brand, url), path.join(PINS, 'pin-1-no-more-ladders.png'), 1000);
  await writePng(art.pin2(brand, url), path.join(PINS, 'pin-2-one-install-every-holiday.png'), 1000);
  await writePng(art.pin3(brand, url), path.join(PINS, 'pin-3-permanent-lights-explained.png'), 1000);

  console.log('Images built.');
})().catch((e) => { console.error(e); process.exit(1); });
