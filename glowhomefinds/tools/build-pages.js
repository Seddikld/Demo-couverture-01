// Generates every HTML page, sitemap.xml, robots.txt and the web manifest from site/config.js.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const art = require('./art');
const cfg = require('../site/config.js');

const SITE = path.join(__dirname, '..', 'site');
const B = cfg.BRAND_NAME;
const URL_ = cfg.SITE_URL.replace(/\/$/, '');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const AFF = esc(cfg.AFFILIATE_LINK);
const EMAIL = esc(cfg.CONTACT_EMAIL);
const PRICE_DATE = esc(cfg.PRICE_CHECK_DATE);
const PRICE = esc(cfg.PRICE_FROM);
const PRODUCT = 'Govee Permanent Outdoor Lights 2';

// Cache-busting versions for CSS/JS
const ver = (f) => crypto.createHash('md5').update(fs.readFileSync(path.join(SITE, f))).digest('hex').slice(0, 8);
const V = { css: ver('css/styles.css'), js: ver('js/main.js'), cfg: ver('config.js') };

const newTab = '<span class="visually-hidden"> (opens in a new tab)</span>';
const aff = (label, cls = 'btn', extra = '') =>
  `<a class="${cls}" href="${AFF}" rel="sponsored nofollow noopener" target="_blank" data-affiliate${extra}>${label}${newTab}</a>`;
const affText = (label) => `<a href="${AFF}" rel="sponsored nofollow noopener" target="_blank" data-affiliate>${label}${newTab}</a>`;

const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10"/><path d="M7.5 12.5l3 3 6-6"/></svg>';
const cross = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10"/><path d="M9 9l6 6M15 9l-6 6"/></svg>';
let markN = 0;
const markSvg = () => { const id = `mglow${++markN}`; return `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><defs>${art.markDefs}</defs>${art.markGroup()}</svg>`.replace(/mglow/g, id); };
const brandHtml = (() => {
  const m = /^(Glow)(.*)$/.exec(B);
  return m ? `<span class="accent">${esc(m[1])}</span>${esc(m[2])}` : esc(B);
})();

const priceSentence = `Starting around ${PRICE} when we checked on ${PRICE_DATE} — ${affText('check the current price')}.`;

function head({ title, description, pathName, noindex = false, jsonld = [] }) {
  const url = `${URL_}${pathName}`;
  const img = `${URL_}/images/og-image.png`;
  return `<!DOCTYPE html>
<html lang="en-US">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex">' : `<meta name="robots" content="index, follow, max-image-preview:large">\n<link rel="canonical" href="${url}">`}
<meta name="theme-color" content="#070f28">

<!-- Google Search Console: paste your verification tag here, e.g.
<meta name="google-site-verification" content="YOUR_GOOGLE_CODE">
-->
<!-- Pinterest domain verification: paste your tag here, e.g.
<meta name="p:domain_verify" content="YOUR_PINTEREST_CODE">
-->

<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(B)}">
<meta property="og:locale" content="en_US">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Illustrated house at night with glowing permanent lights under the roofline">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${img}">
<meta name="twitter:image:alt" content="Illustrated house at night with glowing permanent lights under the roofline">

<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="stylesheet" href="/css/styles.css?v=${V.css}">
<script src="/config.js?v=${V.cfg}" defer></script>
<script src="/js/main.js?v=${V.js}" defer></script>
${jsonld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')}
</head>`;
}

function header({ cta = true } = {}) {
  return `<a class="skip-link" href="#main">Skip to main content</a>
<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="/" aria-label="${esc(B)} home">${markSvg()}<span>${brandHtml}</span></a>
    ${cta ? aff(`Check price`, 'btn btn--small header-cta') : ''}
  </div>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="container">
    <a class="brand" href="/" aria-label="${esc(B)} home">${markSvg()}<span>${brandHtml}</span></a>
    <p class="footer-disclaimer">${esc(B)} is an independent site and is not affiliated with or endorsed by Govee. Product names are trademarks of their respective owners.</p>
    <p class="footer-disclaimer">As an affiliate, we may earn a commission from qualifying purchases made through links on this site, at no extra cost to you.</p>
    <nav aria-label="Footer">
      <ul class="footer-links">
        <li><a href="/about.html">About</a></li>
        <li><a href="/affiliate-disclosure.html">Affiliate Disclosure</a></li>
        <li><a href="/privacy-policy.html">Privacy Policy</a></li>
        <li><a href="mailto:${EMAIL}">Contact</a></li>
      </ul>
    </nav>
    <p class="copyright">© <span data-year>${new Date().getFullYear()}</span> ${esc(B)}. All rights reserved.</p>
  </div>
</footer>`;
}

const stickyCta = `<div class="sticky-cta">
  <p>${PRODUCT}<small>Price changes often</small></p>
  ${aff('Check price')}
</div>`;

function page(opts, body, { sticky = false, headerCta = true } = {}) {
  return `${head(opts)}
<body${sticky ? ' class="has-sticky"' : ''}>
${header({ cta: headerCta })}
${body}
${footer()}
${sticky ? stickyCta : ''}
</body>
</html>
`;
}

/* ================= index.html ================= */

const icon = (n) => art.iconSvg(n).replace('width="24" height="24" ', '');
const features = [
  ['colors', 'Up to 16 million colors', 'RGBWIC lighting: RGB color plus dedicated white, with IC control so different sections can show different colors at once.'],
  ['brightness', '55% brighter than before', 'Govee lists 40 lumens per light, 55% brighter than the previous generation.'],
  ['scenes', '100 scene modes', 'Pick from 100 preset scene modes in the app instead of building every effect yourself.'],
  ['voice', 'App, Alexa & Google Assistant', 'Control the lights from the Govee app or by voice with Alexa and Google Assistant.'],
  ['matter', 'Matter support', 'Supports Matter, the smart home standard for connecting with compatible platforms.'],
  ['waterproof', 'IP67 waterproof', 'Govee lists an IP67 rating for water and dust resistance.'],
  ['temperature', 'Works from -4°F to 140°F', 'Govee lists an operating temperature range of -4°F to 140°F.'],
  ['lengths', '50 ft, 100 ft or 150 ft', 'Three lengths, so you can match the size of your roofline.'],
  ['install', 'VHB adhesive and clips', 'Installs with VHB adhesive and clips, with no loose strands to hang every season.'],
];

const faqs = [
  ['What are permanent outdoor lights?', `<p>They are LED lights you mount once along your roofline or eaves and leave up all year. Instead of hanging new string lights for each holiday, you change the colors and effects from an app. The ${PRODUCT} is one example.</p>`],
  ['Can I install them myself?', `<p>Many homeowners install them on their own. The lights mount with VHB adhesive and clips, and you will need a ladder for the one-time setup. Plan for it to take a while. Always follow Govee's official instructions, and hire a professional if you are not comfortable working on a ladder.</p>`],
  ['Can they stay up in rain, snow and summer heat?', `<p>Govee lists an IP67 waterproof rating and an operating range of -4°F to 140°F. Check the ${affText('official product page')} to confirm the details for your climate.</p>`],
  ['Which length should I buy?', `<p>Measure the rooflines you want to light, then compare that with the available lengths: 50 ft, 100 ft and 150 ft. The ${affText('official product page')} shows current options.</p>`],
  ['Do I need Wi-Fi?', `<p>Smart features like app, voice and Matter control rely on your home network and the Govee app. Check the official requirements before you buy, especially if your Wi-Fi is weak near the front of the house.</p>`],
  ['Does it work with Alexa, Google Assistant or Matter?', `<p>Govee lists support for Alexa, Google Assistant and Matter. Smart home setups vary, so confirm compatibility with your devices on the ${affText('official product page')}.</p>`],
  ['How much does it cost?', `<p>${priceSentence} Prices, bundles and sales change often, so the official page is the only reliable source for today's price.</p>`],
];

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<span class="visually-hidden">.*?<\/span>/g, '').replace(/<[^>]+>/g, '').trim() } })),
};
const siteLd = { '@context': 'https://schema.org', '@type': 'WebSite', name: B, url: `${URL_}/` };

const holidays = [
  ['halloween', 'Halloween', 'Orange and purple for spooky season.', 'The same house at Halloween with orange and purple roofline lights, jack-o-lanterns and bats'],
  ['christmas', 'Christmas', 'Red, green and white for the holidays.', 'The same house at Christmas with red, green and white roofline lights, a wreath and snow'],
  ['july4', '4th of July', 'Red, white and blue for Independence Day.', 'The same house on the 4th of July with red, white and blue roofline lights and fireworks'],
  ['everyday', 'Every day', 'Soft warm white the rest of the year.', 'The same house on an ordinary evening with soft warm white roofline lights'],
];

const index = page({
  title: `${PRODUCT}: No More Ladders Every December | ${B}`,
  description: `An honest, independent look at ${PRODUCT}: install once under your roofline, then switch colors for Halloween, Christmas, the 4th of July and every day.`,
  pathName: '/',
  jsonld: [siteLd, faqLd],
}, `<main id="main">
  <section class="hero" aria-labelledby="hero-title">
    <div class="container hero-grid">
      <div>
        <span class="eyebrow">Independent look · ${PRODUCT}</span>
        <h1 id="hero-title">No more ladders <span class="glow">every December</span></h1>
        <p class="lead">Mount permanent lights under your roofline once. After that, switch from Halloween orange to Christmas red and green, or everyday warm white, right from your phone.</p>
        <div class="hero-actions">
          ${aff(`Check current price ${arrow}`, 'btn', ' data-hero-cta')}
          <a class="btn btn--ghost" href="#features">See the features</a>
        </div>
        <p class="price-note">${priceSentence}</p>
        <p class="disclosure-line">We may earn a commission if you buy through our links, at no extra cost to you. <a href="/affiliate-disclosure.html">Read our affiliate disclosure</a>.</p>
      </div>
      <div class="hero-art">
        <img src="/images/hero-house.svg" width="1200" height="800" fetchpriority="high" alt="Illustration of a suburban house at night with a line of colorful permanent lights glowing along the roofline under a starry sky">
      </div>
    </div>
  </section>

  <section class="section section--soft" aria-labelledby="problem-title">
    <div class="container">
      <span class="kicker">The problem</span>
      <h2 id="problem-title">Holiday lights turn into a yearly chore</h2>
      <p class="section-intro">If you decorate the outside of your home, you know the routine. It usually takes a cold weekend, and you do it all again for the next holiday.</p>
      <ul class="pain-list">
        <li>${cross}<span>Dragging the ladder out and climbing up and down along the gutters.</span></li>
        <li>${cross}<span>Untangling string lights and hunting for the bulb that went dark.</span></li>
        <li>${cross}<span>Clipping everything up, then taking it all down again in January.</span></li>
        <li>${cross}<span>Buying different lights for Halloween, Christmas and the 4th of July.</span></li>
      </ul>
      <figure class="ba-figure">
        <img src="/images/before-after.svg" width="1200" height="540" loading="lazy" decoding="async" alt="Before and after illustration. Before: a person on a ladder struggles with a tangle of string lights at dusk. After: the same house at night with a neat line of warm permanent lights under the roofline.">
        <div class="ba-labels" aria-hidden="true"><span>Before</span><span>After</span></div>
        <figcaption>Left: the yearly ladder routine. Right: the same house with permanent lights installed once.</figcaption>
      </figure>
    </div>
  </section>

  <section class="section" aria-labelledby="solution-title">
    <div class="container">
      <span class="kicker">The solution</span>
      <h2 id="solution-title">Permanent outdoor lights: set up once, enjoy all year</h2>
      <p class="section-intro">Permanent outdoor lights mount along your roofline and stay there. The ${PRODUCT} is controlled from an app, so the same lights can match every season, party or ordinary evening.</p>
      <ol class="steps">
        <li><h3>Install once</h3><p>Mount the lights under your eaves with VHB adhesive and clips.</p></li>
        <li><h3>Pick a look</h3><p>Choose colors or one of 100 scene modes from the app or by voice.</p></li>
        <li><h3>Change anytime</h3><p>Switch from Halloween to Christmas without climbing a ladder again.</p></li>
      </ol>
      <div class="cta-row">
        ${aff(`Check current price ${arrow}`)}
        <span class="small">Opens the official product page. We may earn a commission.</span>
      </div>
    </div>
  </section>

  <section class="section section--soft" id="features" aria-labelledby="features-title">
    <div class="container">
      <span class="kicker">Key features</span>
      <h2 id="features-title">What you get with ${PRODUCT}</h2>
      <p class="section-intro">These are the headline specs Govee lists for this model. Nothing more, nothing added.</p>
      <ul class="feature-grid">
        ${features.map(([ic, t, d]) => `<li class="feature"><span class="icon">${icon(ic)}</span><div><h3>${t}</h3><p>${d}</p></div></li>`).join('\n        ')}
      </ul>
      <p class="spec-note">Specs as listed by Govee. Please confirm the latest details on the ${affText('official product page')}.</p>
    </div>
  </section>

  <section class="section section--dark" aria-labelledby="holiday-title">
    <div class="container">
      <span class="kicker">One install, every holiday</span>
      <h2 id="holiday-title">The same lights, all year round</h2>
      <p class="section-intro">Instead of storing boxes of seasonal lights, change the look of the same roofline lights in a few taps.</p>
      <ul class="holiday-grid">
        ${holidays.map(([k, t, d, alt]) => `<li class="holiday"><img src="/images/holiday-${k}.svg" width="600" height="440" loading="lazy" decoding="async" alt="${alt}"><div><h3>${t}</h3><p>${d}</p></div></li>`).join('\n        ')}
      </ul>
      <div class="cta-row">
        ${aff(`Check current price ${arrow}`)}
        <span class="small">Affiliate link. Opens the official product page in a new tab.</span>
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="proscons-title">
    <div class="container">
      <span class="kicker">Honest take</span>
      <h2 id="proscons-title">Pros and cons</h2>
      <p class="section-intro">Permanent lights are not the right choice for every home. Here is the balanced picture.</p>
      <div class="two-col">
        <div class="card card--pro">
          <h3>${check} Pros</h3>
          <ul class="check-list">
            <li>${check}<span>One installation instead of a ladder trip for every holiday.</span></li>
            <li>${check}<span>Up to 16 million colors and 100 scene modes for any occasion.</span></li>
            <li>${check}<span>App, Alexa, Google Assistant and Matter support.</span></li>
            <li>${check}<span>Rated IP67 with a listed range of -4°F to 140°F.</span></li>
            <li>${check}<span>Three lengths (50, 100, 150 ft) to fit different rooflines.</span></li>
          </ul>
        </div>
        <div class="card card--con">
          <h3>${cross} Cons</h3>
          <ul class="check-list">
            <li>${cross}<span>Higher upfront cost than regular string lights.</span></li>
            <li>${cross}<span>Installation takes time, so plan a day for the first setup.</span></li>
            <li>${cross}<span>Needs Wi-Fi and the app for the smart features.</span></li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--soft" aria-labelledby="fit-title">
    <div class="container">
      <span class="kicker">Is it right for you?</span>
      <h2 id="fit-title">Who it is for, and who it is not for</h2>
      <div class="two-col">
        <div class="card card--pro">
          <h3>${check} A good fit if you…</h3>
          <ul class="check-list">
            <li>${check}<span>Own your home and decorate the outside for several holidays a year.</span></li>
            <li>${check}<span>Are tired of hanging and removing string lights every season.</span></li>
            <li>${check}<span>Like controlling things from your phone or smart speaker.</span></li>
            <li>${check}<span>Want a clean, low-profile look that stays up all year.</span></li>
          </ul>
        </div>
        <div class="card card--con">
          <h3>${cross} Probably not for you if you…</h3>
          <ul class="check-list">
            <li>${cross}<span>Rent, or your HOA does not allow permanent fixtures on the house.</span></li>
            <li>${cross}<span>Only decorate once a year and are happy with basic string lights.</span></li>
            <li>${cross}<span>Want the lowest possible upfront price.</span></li>
            <li>${cross}<span>Don't have reliable Wi-Fi near the front of your home.</span></li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="price-title">
    <div class="container narrow">
      <div class="price-box">
        <h2 id="price-title">What does it cost?</h2>
        <p>${priceSentence}</p>
        <p>Prices and bundles change often, so check the official page for today's price and available lengths.</p>
        ${aff(`Check current price ${arrow}`)}
        <p class="small">Affiliate link. We may earn a commission at no extra cost to you.</p>
      </div>
    </div>
  </section>

  <section class="section section--soft" aria-labelledby="faq-title">
    <div class="container narrow">
      <span class="kicker">FAQ</span>
      <h2 id="faq-title">Frequently asked questions</h2>
      <div class="faq">
        ${faqs.map(([q, a]) => `<details><summary>${q}</summary><div>${a}</div></details>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="section section--dark final-cta" aria-labelledby="final-title">
    <div class="container narrow">
      <img src="/images/holiday-everyday.svg" width="600" height="440" loading="lazy" decoding="async" alt="House at night with warm white permanent lights along the roofline">
      <h2 id="final-title">Ready to retire the ladder?</h2>
      <p class="section-intro center">Check today's price and lengths on the official ${PRODUCT} page.</p>
      <div class="cta-row">
        ${aff(`Check current price ${arrow}`)}
        <span class="small">${esc(B)} is independent and not affiliated with Govee.</span>
      </div>
    </div>
  </section>
</main>`, { sticky: true });

/* ================= Secondary pages ================= */

const prosePage = ({ file, title, description, h1, intro, content }) => page(
  { title: `${title} | ${B}`, description, pathName: `/${file}` },
  `<main id="main">
  <section class="page-hero"><div class="container narrow"><h1>${h1}</h1><p>${intro}</p></div></section>
  <div class="container narrow prose">
${content}
  </div>
</main>`,
);

const about = prosePage({
  file: 'about.html',
  title: 'About Us',
  description: `${B} is an independent site that recommends smart home lighting for US homeowners. We are not affiliated with Govee.`,
  h1: `About ${esc(B)}`,
  intro: 'Independent smart lighting recommendations for homeowners.',
  content: `
    <h2>Who we are</h2>
    <p>${esc(B)} is a small, independent website for homeowners in the United States who want their home to look great at night with less hassle. We focus on smart home lighting, especially permanent outdoor lights that make decorating for Halloween, Christmas, the 4th of July and every day much easier.</p>
    <h2>What we do</h2>
    <p>We explain products in plain English. We cover what they do, who they suit and where they fall short, so you can decide whether they fit your home and budget.</p>
    <ul>
      <li>We base product details on the manufacturer's published specifications and say so clearly.</li>
      <li>We point you to the official product page to confirm prices and specs, because they change.</li>
      <li>We include cons as well as pros.</li>
      <li>We never publish fake reviews, fake star ratings, fake countdowns or fake "only 2 left" messages.</li>
    </ul>
    <h2>Independence</h2>
    <p class="callout">${esc(B)} is an independent site and is not affiliated with, sponsored by or endorsed by Govee. Product names and trademarks belong to their respective owners.</p>
    <p>Some links on this site are affiliate links. If you buy through them, we may earn a commission at no extra cost to you. Read our <a href="/affiliate-disclosure.html">affiliate disclosure</a> for details.</p>
    <h2>Contact</h2>
    <p>Questions, corrections or suggestions are welcome: <a href="mailto:${EMAIL}">${EMAIL}</a>.</p>`,
});

const disclosure = prosePage({
  file: 'affiliate-disclosure.html',
  title: 'Affiliate Disclosure',
  description: `How ${B} earns money: we may earn a commission from qualifying purchases made through our links, at no extra cost to you.`,
  h1: 'Affiliate Disclosure',
  intro: `Last updated: ${PRICE_DATE}`,
  content: `
    <p class="callout"><strong>In short:</strong> if you click a product link on ${esc(B)} and make a purchase, we may earn a commission at no extra cost to you.</p>
    <h2>How affiliate links work</h2>
    <p>Links to products on this site may be affiliate links, for example through the Govee affiliate program on the Impact network. When you click one and buy something, the retailer may pay us a small commission. The price you pay is the same whether you use our link or not.</p>
    <h2>Our relationship with Govee</h2>
    <p>${esc(B)} is an independent site. We are <strong>not owned, operated, sponsored or endorsed by Govee</strong>. Govee and product names mentioned on this site are trademarks of their respective owners and are used only to identify the products we write about.</p>
    <h2>Our editorial standards</h2>
    <ul>
      <li>Commissions do not change what we write. We list cons as well as pros.</li>
      <li>We do not publish fake reviews, testimonials, star ratings, countdown timers or scarcity claims.</li>
      <li>Product specifications come from the manufacturer's published information. Always confirm current details, prices and availability on the official product page before buying.</li>
      <li>Prices change often. Any price we mention is marked with the date we checked it.</li>
    </ul>
    <h2>Why we disclose this</h2>
    <p>We follow the U.S. Federal Trade Commission (FTC) guidance on endorsements, which asks sites to clearly tell readers about any financial relationship. We mark affiliate links with <code>rel="sponsored"</code> and place short disclosure notes near our main buttons.</p>
    <h2>Questions</h2>
    <p>Contact us any time at <a href="mailto:${EMAIL}">${EMAIL}</a>.</p>`,
});

const privacy = prosePage({
  file: 'privacy-policy.html',
  title: 'Privacy Policy',
  description: `The ${B} privacy policy: what information is collected when you visit this static website and click affiliate links.`,
  h1: 'Privacy Policy',
  intro: `Effective date: ${PRICE_DATE}`,
  content: `
    <p>This policy explains how ${esc(B)} ("we", "us") handles information when you visit ${esc(URL_.replace(/^https?:\/\//, ''))}. We keep it simple because this is a simple, static website.</p>
    <h2>Information we collect</h2>
    <ul>
      <li><strong>No accounts or forms.</strong> We do not ask you to sign up, and we do not collect your name, address or payment details.</li>
      <li><strong>No analytics or advertising cookies from us.</strong> We currently do not use analytics tools, tracking pixels or advertising cookies. If that changes, we will update this page first.</li>
      <li><strong>Hosting logs.</strong> Our hosting provider (Netlify) may automatically process technical data such as your IP address, browser type and the pages requested, to deliver and secure the website.</li>
      <li><strong>Email.</strong> If you email us, we use your email address and message only to reply to you.</li>
    </ul>
    <h2>Affiliate links and third parties</h2>
    <p>When you click a product link, you leave our site and go to a third-party website such as Govee's store. That site and affiliate networks such as Impact may use cookies or similar technologies to record that you came from ${esc(B)}, so a commission can be credited. Their own privacy policies apply to what they collect. We do not receive your personal or payment information from those purchases.</p>
    <h2>Your choices</h2>
    <p>You can block or delete cookies in your browser settings, and you can use private browsing. The site works fully without cookies.</p>
    <h2>Selling or sharing personal information</h2>
    <p>We do not sell or share your personal information, and we do not use it for targeted advertising.</p>
    <h2>Children</h2>
    <p>This website is intended for adults and is not directed to children under 13. We do not knowingly collect information from children.</p>
    <h2>Changes to this policy</h2>
    <p>We may update this policy from time to time. The effective date at the top shows when it last changed.</p>
    <h2>Contact</h2>
    <p>Questions about privacy? Email <a href="mailto:${EMAIL}">${EMAIL}</a>.</p>`,
});

const notFound = page({
  title: `Page Not Found | ${B}`,
  description: 'Sorry, this page could not be found.',
  pathName: '/404.html',
  noindex: true,
}, `<main id="main">
  <section class="container narrow notfound">
    <img src="/images/holiday-everyday.svg" width="600" height="440" alt="House at night with warm permanent lights along the roofline">
    <h1>This page went dark</h1>
    <p class="section-intro center">We couldn't find the page you were looking for. It may have moved, or the link may be wrong.</p>
    <div class="cta-row">
      <a class="btn" href="/">Back to the home page</a>
    </div>
  </section>
</main>`);

/* ================= Write files ================= */

const out = {
  'index.html': index,
  'about.html': about,
  'affiliate-disclosure.html': disclosure,
  'privacy-policy.html': privacy,
  '404.html': notFound,
};
for (const [f, html] of Object.entries(out)) fs.writeFileSync(path.join(SITE, f), html);

const today = new Date().toISOString().slice(0, 10);
const pages = [['/', '1.0'], ['/about.html', '0.5'], ['/affiliate-disclosure.html', '0.3'], ['/privacy-policy.html', '0.3']];
fs.writeFileSync(path.join(SITE, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(([p, pr]) => `  <url><loc>${URL_}${p}</loc><lastmod>${today}</lastmod><priority>${pr}</priority></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(SITE, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${URL_}/sitemap.xml\n`);
fs.writeFileSync(path.join(SITE, 'site.webmanifest'), JSON.stringify({
  name: B, short_name: B, start_url: '/', display: 'browser', background_color: '#070f28', theme_color: '#070f28',
  icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }],
}, null, 2) + '\n');

console.log('Pages built:', Object.keys(out).join(', '));
