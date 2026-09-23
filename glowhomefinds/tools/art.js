// Original SVG artwork for GlowHomeFinds. Everything here is drawn from code:
// no external images, logos or photos are used.

const PALETTES = {
  rainbow: { colors: ['#ff6b81', '#ffa94d', '#ffe066', '#69db7c', '#4dd4ff', '#9d7bff', '#f783ac'], wash: '#ffb86b' },
  halloween: { colors: ['#ff7b1c', '#b35cff'], wash: '#ff8a3d' },
  christmas: { colors: ['#ff4d4d', '#3ddc84', '#fff4e0'], wash: '#ff9d7a' },
  july4: { colors: ['#ff4d5e', '#ffffff', '#4d8dff'], wash: '#b9c8ff' },
  warm: { colors: ['#ffc978'], wash: '#ffc978' },
};

const C = {
  skyTop: '#070f28',
  skyBottom: '#1c2c5c',
  wall: '#24315a',
  wallDark: '#1b2648',
  roof: '#101832',
  trim: '#3a4a7a',
  tree: '#0b1530',
  ground: '#0e1a33',
  gold: '#ffc86b',
};

// Deterministic pseudo-random numbers so images are identical on every build.
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n) => Math.round(n * 10) / 10;

function mix(hex, other, amt) {
  const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const a = p(hex), b = p(other);
  return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * amt).toString(16).padStart(2, '0')).join('');
}

function pointsAlong(pts, spacing) {
  const out = [];
  let carry = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
    const len = Math.hypot(x2 - x1, y2 - y1);
    let d = carry;
    while (d <= len) {
      const t = d / len;
      out.push([x1 + (x2 - x1) * t, y1 + (y2 - y1) * t]);
      d += spacing;
    }
    carry = d - len;
  }
  return out;
}

// Shared filters. userSpaceOnUse regions so horizontal lines still get blurred.
function commonDefs() {
  return `
  <filter id="glow" filterUnits="userSpaceOnUse" x="-400" y="-400" width="2400" height="2400"><feGaussianBlur stdDeviation="5"/></filter>
  <filter id="wash" filterUnits="userSpaceOnUse" x="-400" y="-400" width="2400" height="2400"><feGaussianBlur stdDeviation="18"/></filter>
  <filter id="soft" filterUnits="userSpaceOnUse" x="-400" y="-400" width="2400" height="2400"><feGaussianBlur stdDeviation="40"/></filter>
  <linearGradient id="win" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe7a8"/><stop offset="1" stop-color="#ffb95e"/></linearGradient>`;
}

function lightString(pts, palette, { spacing = 16, r = 3.6, washWidth = 34 } = {}) {
  const dots = pointsAlong(pts, spacing);
  const cols = palette.colors;
  const line = pts.map((p) => p.map(f).join(',')).join(' ');
  let glow = '', core = '';
  dots.forEach(([x, y], i) => {
    const c = cols[i % cols.length];
    glow += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 2.6)}" fill="${c}"/>`;
    core += `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${mix(c, '#ffffff', 0.55)}"/>`;
  });
  return `
  <polyline points="${line}" fill="none" stroke="${palette.wash}" stroke-width="${washWidth}" stroke-opacity="0.28" filter="url(#wash)"/>
  <polyline points="${line}" fill="none" stroke="#0a1022" stroke-width="3" stroke-opacity="0.6"/>
  <g filter="url(#glow)" opacity="0.95">${glow}</g>
  <g>${core}</g>`;
}

function windowRect(x, y, w, h, lit, frame) {
  const glass = lit ? 'url(#win)' : '#18213f';
  return `<rect x="${x - 4}" y="${y - 4}" width="${w + 8}" height="${h + 8}" rx="3" fill="${frame}"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${glass}"/>
  <path d="M${x + w / 2} ${y}v${h}M${x} ${y + h / 2}h${w}" stroke="${frame}" stroke-width="3"/>`;
}

// House drawn in local coordinates: about 800 wide, ground line at y=430.
// palette: light colors under the roofline (null = no permanent lights)
// tone: 'night' | 'dusk'
function house({ palette = null, tone = 'night', litWindows = true } = {}) {
  const dusk = tone === 'dusk';
  const wall = dusk ? '#4a5a8c' : C.wall;
  const wallDark = dusk ? '#3d4c7c' : C.wallDark;
  const roof = dusk ? '#262f55' : C.roof;
  const trim = dusk ? '#5d6fa3' : C.trim;
  const mainRoof = [[90, 224], [330, 84], [570, 224]];
  const garageEave = [[536, 298], [774, 298]];
  let s = '';
  // chimney (drawn first, roof overlaps its base)
  s += `<rect x="440" y="104" width="40" height="70" fill="${wallDark}"/><rect x="434" y="98" width="52" height="10" rx="2" fill="${trim}"/>`;
  // garage wing
  s += `<rect x="550" y="292" width="210" height="140" fill="${wallDark}"/>`;
  s += `<polygon points="534,298 586,248 724,248 776,298" fill="${roof}"/>`;
  s += `<rect x="580" y="330" width="150" height="100" rx="3" fill="${dusk ? '#33406c' : '#1f2a4f'}"/>`;
  s += [355, 380, 405].map((y) => `<path d="M580 ${y}h150" stroke="${trim}" stroke-width="2" opacity="0.7"/>`).join('');
  // main body
  s += `<rect x="110" y="214" width="440" height="218" fill="${wall}"/>`;
  s += `<path d="M110 318h440" stroke="${wallDark}" stroke-width="6"/>`;
  s += `<polygon points="86,226 330,80 574,226" fill="${roof}"/>`;
  s += `<polyline points="86,226 330,80 574,226" fill="none" stroke="${trim}" stroke-width="6" stroke-linejoin="round"/>`;
  s += `<polyline points="534,298 776,298" fill="none" stroke="${trim}" stroke-width="5"/>`;
  s += `<circle cx="330" cy="168" r="14" fill="${wallDark}" stroke="${trim}" stroke-width="3"/>`;
  // windows
  s += windowRect(160, 244, 70, 58, litWindows, trim);
  s += windowRect(300, 250, 60, 50, litWindows && !dusk, trim);
  s += windowRect(430, 244, 70, 58, litWindows && !dusk, trim);
  s += windowRect(150, 344, 90, 58, litWindows, trim);
  s += windowRect(420, 344, 90, 58, litWindows, trim);
  // door + porch
  s += `<rect x="282" y="318" width="96" height="12" rx="2" fill="${roof}"/>`;
  s += `<rect x="302" y="334" width="56" height="98" rx="3" fill="${dusk ? '#5b3b36' : '#3b2530'}"/>`;
  s += `<circle cx="348" cy="386" r="3" fill="${C.gold}"/>`;
  s += `<circle cx="290" cy="350" r="10" fill="#ffd27a" opacity="0.35" filter="url(#glow)"/><circle cx="290" cy="350" r="4" fill="#ffe3a3"/>`;
  // walkway, bushes
  s += `<polygon points="306,432 354,432 374,470 286,470" fill="${dusk ? '#56628f' : '#1e2947'}"/>`;
  s += `<polygon points="584,432 726,432 780,470 560,470" fill="${dusk ? '#4d5886' : '#1a2442'}"/>`;
  const bush = dusk ? '#1f3a3a' : '#0d2626';
  s += `<ellipse cx="140" cy="430" rx="46" ry="22" fill="${bush}"/><ellipse cx="240" cy="432" rx="40" ry="18" fill="${bush}"/><ellipse cx="505" cy="432" rx="44" ry="20" fill="${bush}"/>`;
  if (palette) {
    s += lightString(mainRoof.map(([x, y]) => [x, y + 7]), palette);
    s += lightString(garageEave.map(([x, y]) => [x, y + 6]), palette);
    // warm spill of light on the lawn
    s += `<ellipse cx="420" cy="462" rx="360" ry="26" fill="${palette.wash}" opacity="0.16" filter="url(#wash)"/>`;
  }
  return s;
}

function stars(w, h, count, seed) {
  const r = rng(seed);
  let s = '';
  for (let i = 0; i < count; i++) {
    const x = r() * w, y = r() * h, rad = 0.6 + r() * 1.4, o = 0.35 + r() * 0.6;
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rad)}" fill="#fff" opacity="${f(o)}"/>`;
  }
  return s;
}

function pine(x, base, h, fill) {
  const w = h * 0.42;
  return `<polygon points="${f(x)},${f(base - h)} ${f(x + w * 0.55)},${f(base - h * 0.55)} ${f(x + w * 0.35)},${f(base - h * 0.55)} ${f(x + w)},${f(base)} ${f(x - w)},${f(base)} ${f(x - w * 0.35)},${f(base - h * 0.55)} ${f(x - w * 0.55)},${f(base - h * 0.55)}" fill="${fill}"/>`;
}

function roundTree(x, base, h, fill) {
  return `<rect x="${f(x - 5)}" y="${f(base - h * 0.4)}" width="10" height="${f(h * 0.4)}" fill="${fill}"/>
  <circle cx="${f(x)}" cy="${f(base - h * 0.62)}" r="${f(h * 0.3)}" fill="${fill}"/><circle cx="${f(x - h * 0.2)}" cy="${f(base - h * 0.48)}" r="${f(h * 0.22)}" fill="${fill}"/><circle cx="${f(x + h * 0.2)}" cy="${f(base - h * 0.5)}" r="${f(h * 0.22)}" fill="${fill}"/>`;
}

let moonCount = 0;
function moon(x, y, r) {
  const id = `moon${moonCount++}`;
  return `<mask id="${id}"><circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${x + r * 0.35}" cy="${y - r * 0.2}" r="${r * 0.9}" fill="#000"/></mask>
  <circle cx="${x}" cy="${y}" r="${r * 2.2}" fill="#fff1c9" opacity="0.12" filter="url(#wash)"/><circle cx="${x}" cy="${y}" r="${r}" fill="#fff4d8" mask="url(#${id})"/>`;
}

// A full night (or dusk) scene: sky, stars, moon, trees, ground and the house.
function scene({ id = 's', w, h, palette, tone = 'night', hx, hy, scale = 1, seed = 1, extras = '', front = '', ground = null, moonAt = null, starCount = 70 }) {
  const dusk = tone === 'dusk';
  const groundY = hy + 430 * scale;
  const skyA = dusk ? '#2a3570' : C.skyTop, skyB = dusk ? '#9a7aa8' : C.skyBottom;
  const defs = `<linearGradient id="${id}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${skyA}"/><stop offset="1" stop-color="${skyB}"/></linearGradient>
  <linearGradient id="${id}gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ground || (dusk ? '#2c3a5e' : '#13223f')}"/><stop offset="1" stop-color="${dusk ? '#1d2745' : '#0a1428'}"/></linearGradient>`;
  let body = `<rect width="${w}" height="${h}" fill="url(#${id}sky)"/>`;
  body += stars(w, groundY - 60, dusk ? Math.round(starCount / 4) : starCount, seed);
  if (moonAt) body += moon(moonAt[0], moonAt[1], moonAt[2]);
  const far = dusk ? '#3a4577' : '#101d42';
  body += `<path d="M0 ${f(groundY - 40 * scale)} Q ${w * 0.25} ${f(groundY - 90 * scale)} ${w * 0.5} ${f(groundY - 50 * scale)} T ${w} ${f(groundY - 70 * scale)} V ${groundY} H 0 Z" fill="${far}"/>`;
  const treeFill = dusk ? '#232c55' : C.tree;
  body += pine(hx - 20 * scale, groundY + 4, 250 * scale, treeFill) + pine(hx + 40 * scale, groundY + 4, 170 * scale, treeFill);
  body += roundTree(hx + 850 * scale, groundY + 2, 230 * scale, treeFill);
  body += extras;
  body += `<rect x="0" y="${f(groundY - 2)}" width="${w}" height="${f(h - groundY + 2)}" fill="url(#${id}gr)"/>`;
  body += `<g transform="translate(${f(hx)} ${f(hy)}) scale(${scale})">${house({ palette, tone })}${front}</g>`;
  return { defs, body };
}

function svgDoc(w, h, defs, body, title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${title}"><title>${title}</title><defs>${commonDefs()}${defs}</defs>${body}</svg>\n`;
}

/* ---------- Page illustrations ---------- */

function hero() {
  const s = scene({ id: 'h', w: 1200, h: 800, palette: PALETTES.rainbow, hx: 200, hy: 226, scale: 1, seed: 7, moonAt: [1040, 120, 38], starCount: 110 });
  return svgDoc(1200, 800, s.defs, s.body, 'Illustration of a suburban house at night with a line of colorful permanent lights glowing under the roofline');
}

function tangle(seed, x0, y0, x1, y1, loops, amp) {
  const r = rng(seed);
  let d = `M${x0} ${y0}`;
  const pts = [];
  for (let i = 1; i <= loops; i++) {
    const t = i / loops;
    const x = x0 + (x1 - x0) * t + (r() - 0.5) * amp;
    const y = y0 + (y1 - y0) * t + (r() - 0.5) * amp;
    const cx = x + (r() - 0.5) * amp * 1.6, cy = y + (r() - 0.5) * amp * 1.6;
    d += ` Q${f(cx)} ${f(cy)} ${f(x)} ${f(y)}`;
    pts.push([x, y], [cx * 0.5 + x * 0.5, cy * 0.5 + y * 0.5]);
  }
  return { d, pts };
}

function beforeAfter() {
  const W = 1200, H = 540, pw = 596;
  // "Before": dusk, ladder, person with tangled string lights, a few sagging bulbs.
  const t1 = tangle(11, 118, 232, 170, 330, 9, 40);
  const t2 = tangle(5, 150, 330, 240, 420, 12, 34);
  const bulbColors = ['#ff6b6b', '#ffd43b', '#51cf66', '#4dabf7', '#6c7593'];
  const bulbs = [...t1.pts, ...t2.pts].filter((_, i) => i % 2 === 0)
    .map(([x, y], i) => `<circle cx="${f(x)}" cy="${f(y)}" r="4.5" fill="${bulbColors[i % bulbColors.length]}"/>`).join('');
  const sag = [];
  for (let i = 0; i <= 8; i++) {
    const x = 540 + i * 26, y = 304 + Math.sin((i / 8) * Math.PI * 3) * 9 + i * 2;
    sag.push([x, y]);
  }
  const sagBulbs = sag.map(([x, y], i) => `<circle cx="${f(x)}" cy="${f(y + 5)}" r="4.5" fill="${i % 3 === 1 ? '#6c7593' : bulbColors[i % 4]}"/>`).join('');
  const ladderRungs = [];
  for (let i = 1; i <= 8; i++) {
    const t = i / 9;
    const ax = 40 + 65 * t, ay = 430 - 205 * t, bx = 76 + 65 * t, by = 432 - 204 * t;
    ladderRungs.push(`<path d="M${f(ax)} ${f(ay)} L${f(bx)} ${f(by)}"/>`);
  }
  const person = `<g fill="#0b1020" stroke="none">
    <circle cx="92" cy="250" r="11"/>
    <path d="M80 263 Q92 257 104 263 L101 303 L83 303 Z"/>
    <path d="M84 301 L78 336 L87 337 L92 308 L96 337 L105 336 L100 301 Z"/>
  </g>
  <path d="M84 268 L94 232 M100 268 L118 232" stroke="#0b1020" stroke-width="7" stroke-linecap="round"/>`;
  const beforeFront = `
    <g stroke="#c9a46a" stroke-width="5" stroke-linecap="round" fill="none"><path d="M40 430 L105 225 M76 432 L141 228"/>${ladderRungs.join('')}</g>
    ${person}
    <path d="${t1.d}" fill="none" stroke="#1c2233" stroke-width="2.4"/>
    <path d="${t2.d}" fill="none" stroke="#1c2233" stroke-width="2.4"/>
    <polyline points="${sag.map((p) => p.map(f).join(',')).join(' ')}" fill="none" stroke="#1c2233" stroke-width="2.4"/>
    ${bulbs}${sagBulbs}
    <ellipse cx="248" cy="432" rx="34" ry="9" fill="#1c2233" opacity="0.6"/>
    <rect x="620" y="408" width="54" height="30" rx="4" fill="#8a6d4a"/><path d="M620 418h54" stroke="#6b5236" stroke-width="3"/>`;
  const b = scene({ id: 'b', w: pw, h: H, palette: null, tone: 'dusk', hx: 30, hy: 188, scale: 0.66, seed: 3, front: beforeFront, starCount: 40 });
  const a = scene({ id: 'a', w: pw, h: H, palette: PALETTES.warm, hx: 30, hy: 188, scale: 0.66, seed: 4, moonAt: [500, 80, 22], starCount: 60 });
  const body = `<clipPath id="cb"><rect width="${pw}" height="${H}" rx="18"/></clipPath>
  <g clip-path="url(#cb)">${b.body}</g>
  <g transform="translate(${W - pw} 0)"><g clip-path="url(#cb)">${a.body}</g></g>`;
  return svgDoc(W, H, b.defs + a.defs, body, 'Before and after: on the left a person on a ladder struggles with tangled string lights; on the right the same house glows with neat permanent lights');
}

function pumpkin(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><circle r="30" fill="#ff7b1c" opacity="0.35" filter="url(#glow)"/>
  <ellipse rx="22" ry="17" fill="#f06a12"/><ellipse rx="10" ry="17" fill="#ff8a2a"/><rect x="-2" y="-24" width="5" height="9" rx="2" fill="#3a5a2a"/>
  <path d="M-11 -3 l5 -6 l5 6z M2 -3 l5 -6 l5 6z M-10 5 q10 8 20 0 q-10 3 -20 0z" fill="#ffe08a"/></g>`;
}

function bat(x, y, s = 1) {
  return `<path transform="translate(${x} ${y}) scale(${s})" d="M0 0 q-8 -10 -22 -6 q6 4 4 10 q-6 -4 -10 2 q10 0 14 6 q4 -6 14 -4 q10 -2 14 4 q4 -6 14 -6 q-4 -6 -10 -2 q-2 -6 4 -10 q-14 -4 -22 6z" fill="#05080f" opacity="0.9"/>`;
}

function firework(x, y, r, color, seed) {
  const rr = rng(seed);
  let s = `<g stroke="${color}" stroke-width="3" stroke-linecap="round">`;
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 + rr() * 0.2;
    const r0 = r * 0.35, r1 = r * (0.8 + rr() * 0.25);
    s += `<path d="M${f(x + Math.cos(a) * r0)} ${f(y + Math.sin(a) * r0)} L${f(x + Math.cos(a) * r1)} ${f(y + Math.sin(a) * r1)}"/>`;
  }
  return s + `</g><circle cx="${x}" cy="${y}" r="${r * 0.9}" fill="${color}" opacity="0.18" filter="url(#wash)"/>`;
}

function holiday(kind) {
  const W = 600, H = 440;
  const cfg = {
    halloween: {
      palette: PALETTES.halloween, title: 'The house at Halloween with orange and purple permanent lights, jack-o-lanterns and bats',
      extras: bat(120, 80, 1) + bat(210, 50, 0.7) + bat(470, 70, 0.9), front: pumpkin(236, 424, 1.3) + pumpkin(420, 426, 1.1), moonAt: [520, 70, 26],
    },
    christmas: {
      palette: PALETTES.christmas, title: 'The house at Christmas with red, green and white permanent lights, a wreath and fresh snow',
      extras: stars(W, 300, 40, 21).replace(/fill="#fff"/g, 'fill="#e8f0ff"'), ground: '#c9d6ec',
      front: `<circle cx="330" cy="362" r="17" fill="none" stroke="#2f9e5a" stroke-width="9"/><path d="M322 346 l8 7 l8 -7 l-2 10 h-12z" fill="#e03131"/>
      <path d="M86 226 L330 80 L574 226 L562 226 L330 92 L98 226Z" fill="#eef4ff" opacity="0.9"/><path d="M534 298 L586 248 L724 248 L776 298 L766 298 L720 256 L590 256 L544 298Z" fill="#eef4ff" opacity="0.9"/>`,
    },
    july4: {
      palette: PALETTES.july4, title: 'The house on the 4th of July with red, white and blue permanent lights and fireworks',
      extras: firework(130, 90, 46, '#ff4d5e', 1) + firework(300, 60, 38, '#ffffff', 2) + firework(470, 100, 50, '#4d8dff', 3), moonAt: null,
    },
    everyday: {
      palette: PALETTES.warm, title: 'The house on an ordinary evening with soft warm white permanent lights',
      extras: '', moonAt: [510, 80, 26],
      front: `<rect x="236" y="400" width="24" height="30" rx="4" fill="#6b4f3a"/><ellipse cx="248" cy="398" rx="22" ry="14" fill="#1f4d3a"/><rect x="398" y="400" width="24" height="30" rx="4" fill="#6b4f3a"/><ellipse cx="410" cy="398" rx="22" ry="14" fill="#1f4d3a"/>`,
    },
  }[kind];
  const s = scene({ id: kind[0], w: W, h: H, palette: cfg.palette, hx: 52, hy: 116, scale: 0.62, seed: kind.length * 13, extras: cfg.extras, front: cfg.front || '', ground: cfg.ground, moonAt: cfg.moonAt, starCount: 60 });
  return svgDoc(W, H, s.defs, s.body, cfg.title);
}

/* ---------- Icons (24x24 line icons, stroke = currentColor) ---------- */

const ICONS = {
  colors: '<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.8-.8 1.8-1.8 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8z"/><circle cx="7.5" cy="11" r="1.2"/><circle cx="10.5" cy="7" r="1.2"/><circle cx="15" cy="7.5" r="1.2"/>',
  brightness: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  scenes: '<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/><path d="M5 16l.6 1.4L7 18l-1.4.6L5 20l-.6-1.4L3 18l1.4-.6z"/>',
  voice: '<rect x="3" y="3" width="10" height="18" rx="2"/><path d="M7 18h2"/><path d="M16.5 9.5a3.5 3.5 0 0 1 0 5M19 7a7 7 0 0 1 0 10"/>',
  matter: '<path d="M3 11l9-7 9 7"/><path d="M5 9.5V20h14V9.5"/><circle cx="12" cy="11.5" r="1.4"/><circle cx="8.5" cy="16.5" r="1.4"/><circle cx="15.5" cy="16.5" r="1.4"/><path d="M11.2 12.7l-1.9 2.6M12.8 12.7l1.9 2.6M9.9 16.5h4.2"/>',
  waterproof: '<path d="M12 3s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11z"/><path d="M9 14.5a3 3 0 0 0 3 3"/>',
  temperature: '<path d="M10 4a2 2 0 1 1 4 0v10.3a4 4 0 1 1-4 0z"/><path d="M12 9v7"/><path d="M17 5h3M17 8h2M17 11h3"/>',
  lengths: '<rect x="2" y="8" width="20" height="8" rx="1.5"/><path d="M6 8v3M10 8v4M14 8v3M18 8v4"/>',
  install: '<path d="M4 7h16"/><path d="M6 7v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7"/><circle cx="9" cy="16.5" r="1.6"/><circle cx="15" cy="16.5" r="1.6"/><path d="M12 12v8"/>',
};

function iconSvg(name, size = 24) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;
}

/* ---------- Brand ---------- */

// Mark: a roofline with a string of glowing lights beneath it (64x64 box).
function markGroup({ bg = false } = {}) {
  const dots = [[16, 42], [24, 35], [32, 28], [40, 35], [48, 42]];
  const cols = ['#ffc86b', '#ff8fa3', '#fff1cf', '#7fd6ff', '#ffc86b'];
  let s = bg ? '<rect width="64" height="64" rx="14" fill="#0c1733"/>' : '';
  s += '<path d="M8 36 L32 14 L56 36" fill="none" stroke="#ffc86b" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>';
  s += `<g filter="url(#mglow)">${dots.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="5.5" fill="${cols[i]}"/>`).join('')}</g>`;
  s += dots.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="3" fill="${mix(cols[i], '#ffffff', 0.5)}"/>`).join('');
  return s;
}
const markDefs = '<filter id="mglow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter>';

function favicon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><defs>${markDefs}</defs>${markGroup({ bg: true })}</svg>\n`;
}

function wordmarkText(brand, x, y, size, onDark = true, anchor = 'start') {
  const m = /^(Glow)(.*)$/.exec(brand);
  const main = onDark ? '#ffffff' : '#0c1733';
  const accent = onDark ? C.gold : '#b8660b';
  const inner = m ? `<tspan fill="${accent}">${m[1]}</tspan><tspan fill="${main}">${m[2]}</tspan>` : `<tspan fill="${main}">${brand}</tspan>`;
  return `<text x="${x}" y="${y}" font-family="Poppins, 'Segoe UI', Arial, sans-serif" font-weight="700" font-size="${size}" text-anchor="${anchor}" letter-spacing="-0.5">${inner}</text>`;
}

function logo(brand, onDark = true) {
  const w = 60 + brand.length * 19 + 10;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 64" width="${w}" height="64" role="img" aria-label="${brand}"><title>${brand}</title><defs>${markDefs}</defs>
  ${markGroup()}${wordmarkText(brand, 70, 43, 32, onDark)}</svg>\n`;
}

/* ---------- Social images ---------- */

function brandFooter(brand, url, cx, y, size = 30) {
  const host = url.replace(/^https?:\/\//, '');
  const textW = brand.length * size * 0.6;
  const mx = cx - (textW + size * 1.6) / 2;
  return `<g transform="translate(${f(mx)} ${f(y - size * 1.25)}) scale(${f(size / 30)})">${markGroup()}</g>
  ${wordmarkText(brand, f(mx + size * 2.1), y, size, true)}
  <text x="${cx}" y="${y + size * 1.4}" font-family="Poppins" font-weight="500" font-size="${f(size * 0.72)}" fill="#c6d0ea" text-anchor="middle">${host}</text>`;
}

function ogImage(brand, url) {
  const s = scene({ id: 'o', w: 1200, h: 630, palette: PALETTES.rainbow, hx: 590, hy: 262, scale: 0.72, seed: 9, moonAt: [1110, 70, 26], starCount: 90 });
  const shade = `<linearGradient id="oshade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#070f28" stop-opacity="0.92"/><stop offset="0.55" stop-color="#070f28" stop-opacity="0.55"/><stop offset="0.8" stop-color="#070f28" stop-opacity="0"/></linearGradient>`;
  const text = `<rect width="1200" height="630" fill="url(#oshade)"/>
  <g font-family="Poppins" font-weight="800" fill="#fff">
    <text x="64" y="220" font-size="64" letter-spacing="-1">No more ladders</text>
    <text x="64" y="298" font-size="64" letter-spacing="-1" fill="${C.gold}">every December</text>
  </g>
  <text x="64" y="362" font-family="Poppins" font-weight="500" font-size="28" fill="#dbe3f7">An honest look at Govee Permanent</text>
  <text x="64" y="400" font-family="Poppins" font-weight="500" font-size="28" fill="#dbe3f7">Outdoor Lights 2</text>
  <g transform="translate(64 470) scale(0.8)">${markGroup()}</g>
  ${wordmarkText(brand, 124, 506, 30, true)}
  <text x="64" y="560" font-family="Poppins" font-weight="500" font-size="22" fill="#aab6d6">${url.replace(/^https?:\/\//, '')}</text>`;
  return svgDoc(1200, 630, s.defs + shade + markDefs, s.body + text, 'No more ladders every December — an honest look at Govee Permanent Outdoor Lights 2');
}

function pinBase(id, bodyInner, extraDefs = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1500" width="1000" height="1500"><defs>${commonDefs()}${markDefs}${extraDefs}
  <linearGradient id="${id}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060d24"/><stop offset="1" stop-color="#18285a"/></linearGradient></defs>
  <rect width="1000" height="1500" fill="url(#${id}bg)"/>${stars(1000, 700, 90, id.length * 31)}${bodyInner}</svg>\n`;
}

const title = (lines, y0, size, gap, colors) => lines.map((l, i) => `<text x="500" y="${y0 + i * gap}" font-family="Poppins" font-weight="800" font-size="${size}" text-anchor="middle" letter-spacing="-1.5" fill="${colors[i] || '#fff'}">${l}</text>`).join('');

function pin1(brand, url) {
  const s = scene({ id: 'p1', w: 1000, h: 1500, palette: PALETTES.christmas, hx: 20, hy: 680, scale: 1.2, seed: 12, starCount: 0, ground: '#c9d6ec', moonAt: [840, 590, 34] });
  const body = `<g>${s.body.replace(/^<rect[^>]*\/>/, '')}</g>
  ${title(['No more ladders', 'every December'], 250, 96, 112, ['#fff', C.gold])}
  <text x="500" y="470" font-family="Poppins" font-weight="500" font-size="38" text-anchor="middle" fill="#dbe3f7">Install once. Change colors from your phone.</text>
  <rect x="0" y="1330" width="1000" height="170" fill="#060d24" opacity="0.88"/>
  ${brandFooter(brand, url, 500, 1412, 36)}`;
  return pinBase('p1', body, s.defs);
}

function pin2(brand, url) {
  const kinds = [['halloween', 'Halloween'], ['christmas', 'Christmas'], ['july4', '4th of July'], ['everyday', 'Every day']];
  const cells = kinds.map(([k, label], i) => {
    const x = i % 2 ? 515 : 65, y = i < 2 ? 510 : 900;
    const inner = holiday(k).replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<title>.*?<\/title>/, '');
    const ids = inner.replace(/id="(h|c|j|e)(sky|gr)"/g, `id="${k}$2"`).replace(/url\(#(h|c|j|e)(sky|gr)\)/g, `url(#${k}$2)`);
    return `<clipPath id="cl${i}"><rect x="${x}" y="${y}" width="420" height="308" rx="22"/></clipPath>
    <g clip-path="url(#cl${i})"><svg x="${x}" y="${y}" width="420" height="308" viewBox="0 0 600 440">${ids}</svg></g>
    <rect x="${x + 16}" y="${y + 248}" width="${label.length * 17 + 36}" height="44" rx="22" fill="#060d24" opacity="0.85"/>
    <text x="${x + 34}" y="${y + 279}" font-family="Poppins" font-weight="700" font-size="26" fill="#fff">${label}</text>`;
  }).join('');
  const body = `${title(['One install.', 'Every holiday.'], 210, 104, 120, ['#fff', C.gold])}
  <text x="500" y="410" font-family="Poppins" font-weight="500" font-size="36" text-anchor="middle" fill="#dbe3f7">Permanent outdoor lights, one app.</text>
  ${cells}
  ${brandFooter(brand, url, 500, 1382, 36)}`;
  return pinBase('p2', body);
}

function pin3(brand, url) {
  const s = scene({ id: 'p3', w: 1000, h: 1500, palette: PALETTES.warm, hx: 40, hy: 820, scale: 1.15, seed: 17, starCount: 0 });
  const points = ['Mounted once under your roofline', 'Change colors and scenes in an app', 'Ready for every holiday of the year'];
  const list = points.map((p, i) => {
    const y = 520 + i * 96;
    return `<circle cx="120" cy="${y - 12}" r="30" fill="${C.gold}"/><text x="120" y="${y}" font-family="Poppins" font-weight="800" font-size="32" text-anchor="middle" fill="#0c1733">${i + 1}</text>
    <text x="172" y="${y}" font-family="Poppins" font-weight="600" font-size="38" fill="#fff">${p}</text>`;
  }).join('');
  const body = `<g>${s.body.replace(/^<rect[^>]*\/>/, '')}</g>
  ${title(['Permanent outdoor', 'lights explained'], 220, 92, 108, ['#fff', C.gold])}
  ${list}
  <rect x="0" y="1340" width="1000" height="160" fill="#060d24" opacity="0.88"/>
  ${brandFooter(brand, url, 500, 1414, 36)}`;
  return pinBase('p3', body, s.defs);
}

module.exports = { hero, beforeAfter, holiday, ICONS, iconSvg, favicon, logo, ogImage, pin1, pin2, pin3, markGroup, markDefs };
