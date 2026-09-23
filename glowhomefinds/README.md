# GlowHomeFinds

Independent affiliate review site for **Govee Permanent Outdoor Lights 2**. Plain HTML/CSS/JS, no framework, no backend.

## Where things are

| Path | What it is |
|---|---|
| `site/` | The live website (this folder is what gets published) |
| `site/config.js` | **All settings**: brand name, affiliate link, contact email, site URL, price-check date |
| `marketing/pins/` | 3 Pinterest pins (1000×1500 PNG), not used on the site |
| `marketing/illustrations/` | PNG + WebP copies of every illustration and the logo |
| `tools/` | Scripts that draw all images and generate every page from `config.js` |

All artwork is original, drawn from code in `tools/art.js`. No brand images or photos are used.

## Changing a setting (e.g. the affiliate link)

1. Edit `site/config.js`.
2. Rebuild: `cd tools && npm install && npm run build`
3. Redeploy: `netlify deploy --prod --dir site` (from this folder)

## Deploy

`netlify.toml` publishes the `site/` folder. With the Netlify CLI: `netlify deploy --prod --dir site`.
