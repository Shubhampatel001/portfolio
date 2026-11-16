// Canvas scenes for each guide. A scene draws ambient scenery on the back layer (behind the page content)
// and cursor effects on the front layer (above it, pointer-events none). Everything is original, simple
// geometry; colours come from the persona's CSS variables so light and dark each get their own look.

export type Ctx = CanvasRenderingContext2D;

export type SceneState = {
  w: number;
  h: number;
  /** Seconds since start and since last frame. */
  t: number;
  dt: number;
  /** Cursor position, and whether a mouse cursor is currently over the page. */
  mx: number;
  my: number;
  active: boolean;
  /** Smoothed scroll speed in px per 60fps frame (positive = scrolling down). */
  sv: number;
  dark: boolean;
  mobile: boolean;
  /** Calm mode: no pointer reactions and no click effects, just the quiet scenery. */
  calm: boolean;
  accent: string;
  alt: string;
  text: string;
};

/** Pushes a point away from the pointer. Returns the (dx, dy) shove for this frame, or zeros. */
function shove(px: number, py: number, s: SceneState, radius: number, power: number): [number, number] {
  if (!s.active || s.calm) return [0, 0];
  const dx = px - s.mx;
  const dy = py - s.my;
  const d = Math.hypot(dx, dy);
  if (d >= radius || d < 0.5) return [0, 0];
  const f = (1 - d / radius) * power * s.dt;
  return [(dx / d) * f, (dy / d) * f];
}

export type Scene = {
  back?: (c: Ctx, s: SceneState) => void;
  front?: (c: Ctx, s: SceneState) => void;
  click?: (x: number, y: number, s: SceneState) => void;
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const TAU = Math.PI * 2;

/** A critically-soft spring for values that should overshoot and settle. */
function spring(k = 90, d = 9) {
  let v = 0;
  let x = 0;
  return (target: number, dt: number) => {
    v += (-k * (x - target) - d * v) * dt;
    x += v * dt;
    return x;
  };
}

/* ------------------------------------------------------------------ Naruto */

function leafPath(c: Ctx) {
  c.beginPath();
  c.moveTo(0, -10);
  c.bezierCurveTo(8, -6, 8, 6, 0, 10);
  c.bezierCurveTo(-8, 6, -8, -6, 0, -10);
  c.closePath();
}

export function naruto(s0: SceneState): Scene {
  const n = s0.mobile ? 7 : 14;
  const leaves = Array.from({ length: n }, () => ({
    x: rand(0, s0.w),
    y: rand(0, s0.h),
    z: rand(0.5, 1.3),
    r: rand(0, TAU),
    vr: rand(-1.2, 1.2),
    ph: rand(0, TAU),
    kx: 0,
    ky: 0,
  }));
  const rings: { x: number; y: number; age: number }[] = [];

  return {
    back(c, s) {
      c.fillStyle = s.accent;
      c.strokeStyle = s.text;
      for (const l of leaves) {
        // Leaves drift on their own, shy away from the pointer, and get blown by clicks.
        const [px, py] = shove(l.x, l.y, s, 130, 700);
        l.kx *= Math.pow(0.04, s.dt);
        l.ky *= Math.pow(0.04, s.dt);
        l.x += (28 * l.z + Math.sin(s.t * 0.8 + l.ph) * 14 + l.kx) * s.dt + px;
        l.y += (34 * l.z + l.ky) * s.dt - s.sv * 0.35 * l.z + py;
        l.r += (l.vr + l.kx * 0.01) * s.dt;
        if (l.y > s.h + 24) { l.y = -24; l.x = rand(0, s.w); }
        else if (l.y < -40) { l.y = s.h + 24; l.x = rand(0, s.w); }
        if (l.x > s.w + 24) l.x = -24;
        else if (l.x < -40) l.x = s.w + 24;
        c.save();
        c.translate(l.x, l.y);
        c.rotate(l.r);
        c.scale(l.z, l.z);
        c.globalAlpha = s.dark ? 0.32 : 0.26;
        leafPath(c);
        c.fill();
        c.globalAlpha = 0.25;
        c.lineWidth = 0.8;
        c.beginPath();
        c.moveTo(0, -9);
        c.lineTo(0, 9);
        c.stroke();
        c.restore();
      }
    },
    front(c, s) {
      for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i];
        r.age += s.dt;
        if (r.age > 0.6) { rings.splice(i, 1); continue; }
        c.globalAlpha = (1 - r.age / 0.6) * 0.8;
        c.strokeStyle = s.alt;
        c.lineWidth = 2.5;
        c.beginPath();
        c.arc(r.x, r.y, 8 + r.age * 80, 0, TAU);
        c.stroke();
      }
      c.globalAlpha = 1;
    },
    click(x, y) {
      rings.push({ x, y, age: 0 });
      // A gust: nearby leaves are blown outward.
      for (const l of leaves) {
        const dx = l.x - x;
        const dy = l.y - y;
        const d = Math.hypot(dx, dy) || 1;
        if (d < 220) {
          const k = (1 - d / 220) * 520;
          l.kx += (dx / d) * k;
          l.ky += (dy / d) * k;
        }
      }
    },
  };
}

/* --------------------------------------------------------------- Spider-Man */

export function spiderman(): Scene {
  const sagTL = spring();
  const sagBR = spring();
  // A web shot: a thread from the nearest corner to where you clicked, then a splat.
  const shots: { x: number; y: number; cx: number; cy: number; age: number }[] = [];

  /** A quarter web fanning out from a corner; rings sag with scroll speed. */
  function web(c: Ctx, ox: number, oy: number, sx: number, sy: number, size: number, sag: number) {
    const spokes = 6;
    const pts = (rad: number, i: number) => {
      const a = (i / spokes) * (Math.PI / 2);
      return [ox + sx * Math.cos(a) * rad, oy + sy * Math.sin(a) * rad] as const;
    };
    c.beginPath();
    for (let i = 0; i <= spokes; i++) {
      const [x, y] = pts(size, i);
      c.moveTo(ox, oy);
      c.lineTo(x, y);
    }
    for (let k = 1; k <= 5; k++) {
      const rad = (size * k) / 5;
      for (let i = 0; i < spokes; i++) {
        const [x1, y1] = pts(rad, i);
        const [x2, y2] = pts(rad, i + 1);
        const [cx, cy] = pts(rad * 0.86 - sag, i + 0.5);
        c.moveTo(x1, y1);
        c.quadraticCurveTo(cx, cy, x2, y2);
      }
    }
    c.stroke();
  }

  return {
    back(c, s) {
      const size = Math.min(s.w, s.h) * (s.mobile ? 0.55 : 0.5);
      const tension = clamp(s.sv * 1.4, -34, 34);
      c.strokeStyle = s.text;
      c.lineWidth = 1;
      c.globalAlpha = s.dark ? 0.2 : 0.13;
      web(c, 0, 0, 1, 1, size, 4 + sagTL(tension, s.dt));
      web(c, s.w, s.h, -1, -1, size, 4 + sagBR(-tension, s.dt));
      c.globalAlpha = 1;
    },
    front(c, s) {
      for (let i = shots.length - 1; i >= 0; i--) {
        const p = shots[i];
        p.age += s.dt;
        if (p.age > 0.8) { shots.splice(i, 1); continue; }
        const reach = Math.min(1, p.age / 0.12);
        const fade = p.age < 0.35 ? 1 : 1 - (p.age - 0.35) / 0.45;
        const ex = p.cx + (p.x - p.cx) * reach;
        const ey = p.cy + (p.y - p.cy) * reach;
        c.globalAlpha = fade * 0.75;
        c.strokeStyle = s.text;
        c.lineWidth = 1.4;
        c.beginPath();
        c.moveTo(p.cx, p.cy);
        c.lineTo(ex, ey);
        c.stroke();
        if (reach >= 1) {
          const r = 8 + (p.age - 0.12) * 30;
          c.globalAlpha = fade;
          c.strokeStyle = s.accent;
          c.lineWidth = 1.5;
          c.beginPath();
          for (let k = 0; k < 8; k++) {
            const a = (k / 8) * TAU;
            c.moveTo(p.x + Math.cos(a) * 3, p.y + Math.sin(a) * 3);
            c.lineTo(p.x + Math.cos(a) * r, p.y + Math.sin(a) * r);
          }
          c.stroke();
          c.beginPath();
          c.arc(p.x, p.y, r * 0.6, 0, TAU);
          c.stroke();
        }
      }
      c.globalAlpha = 1;
    },
    click(x, y, s) {
      shots.push({ x, y, cx: x < s.w / 2 ? 0 : s.w, cy: y < s.h / 2 ? 0 : s.h, age: 0 });
    },
  };
}

/* ---------------------------------------------------------------- Pennywise */

function balloon(c: Ctx, x: number, y: number, r: number) {
  c.beginPath();
  c.ellipse(x, y, r, r * 1.2, 0, 0, TAU);
  c.fill();
  c.beginPath();
  c.moveTo(x, y + r * 1.2);
  c.lineTo(x - r * 0.18, y + r * 1.2 + r * 0.28);
  c.lineTo(x + r * 0.18, y + r * 1.2 + r * 0.28);
  c.closePath();
  c.fill();
}

export function pennywise(s0: SceneState): Scene {
  const n = s0.mobile ? 5 : 9;
  const balloons = Array.from({ length: n }, () => ({
    x: rand(0, s0.w),
    y: rand(0, s0.h),
    r: rand(16, 30),
    v: rand(18, 40),
    ph: rand(0, TAU),
  }));
  type Shard = { x: number; y: number; vx: number; vy: number; life: number };
  const shards: Shard[] = [];

  return {
    back(c, s) {
      for (const b of balloons) {
        // Balloons float up, drift away from the pointer, and can be popped with a click.
        const [px, py] = shove(b.x, b.y, s, 120, 520);
        b.y -= b.v * s.dt + s.sv * 0.45 * (b.r / 24);
        b.y += py;
        b.x += Math.sin(s.t * 0.7 + b.ph) * 12 * s.dt + px;
        if (b.y < -b.r * 4) { b.y = s.h + b.r * 3; b.x = rand(0, s.w); }
        else if (b.y > s.h + b.r * 5) { b.y = -b.r * 3; b.x = rand(0, s.w); }
        c.globalAlpha = s.dark ? 0.26 : 0.2;
        c.fillStyle = s.accent;
        balloon(c, b.x, b.y, b.r);
        c.globalAlpha = 0.16;
        c.strokeStyle = s.text;
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(b.x, b.y + b.r * 1.5);
        c.quadraticCurveTo(b.x + Math.sin(s.t + b.ph) * 10, b.y + b.r * 3, b.x, b.y + b.r * 4.5);
        c.stroke();
      }
      c.globalAlpha = 1;
    },
    front(c, s) {
      c.fillStyle = s.accent;
      for (let i = shards.length - 1; i >= 0; i--) {
        const p = shards[i];
        p.life -= s.dt;
        if (p.life <= 0) { shards.splice(i, 1); continue; }
        p.vy += 520 * s.dt;
        p.x += p.vx * s.dt;
        p.y += p.vy * s.dt;
        c.globalAlpha = clamp(p.life / 0.7, 0, 1);
        c.fillRect(p.x, p.y, 5, 3);
      }
      c.globalAlpha = 1;
    },
    click(x, y, s) {
      for (const b of balloons) {
        if (Math.hypot(b.x - x, (b.y - y) / 1.2) > b.r * 1.3) continue;
        for (let i = 0; i < 12; i++) {
          const a = rand(0, TAU);
          shards.push({ x: b.x, y: b.y, vx: Math.cos(a) * rand(60, 200), vy: Math.sin(a) * rand(60, 200) - 80, life: 0.7 });
        }
        b.y = s.h + b.r * 3;
        b.x = rand(0, s.w);
        break;
      }
    },
  };
}

/* ------------------------------------------------------------------- Batman */

/** "#rrggbb" or "#rgb" to rgba(); other formats are returned unchanged. */
function hexA(color: string, a: number) {
  let h = color.trim();
  if (!h.startsWith("#")) return color;
  h = h.slice(1);
  if (h.length === 3) h = h.split("").map((x) => x + x).join("");
  const n = parseInt(h.slice(0, 6), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

function fogBlob(c: Ctx, x: number, y: number, r: number, color: string, a: number) {
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, hexA(color, a));
  g.addColorStop(1, hexA(color, 0));
  c.fillStyle = g;
  c.fillRect(x - r, y - r, r * 2, r * 2);
}

export function batman(s0: SceneState): Scene {
  const n = s0.mobile ? 45 : 90;
  const drops = Array.from({ length: n }, () => ({ x: rand(0, s0.w + 200), y: rand(0, s0.h), l: rand(10, 22), v: rand(600, 900) }));
  const fogs = Array.from({ length: 4 }, (_, i) => ({ x: rand(0, s0.w), y: rand(0.2, 0.9) * s0.h, r: rand(220, 380), v: rand(8, 18) * (i % 2 ? 1 : -1) }));
  const rings: { x: number; y: number; age: number }[] = [];

  return {
    back(c, s) {
      // The signal: a slow-sweeping beam from the lower right.
      const ox = s.w * 0.82;
      const oy = s.h + 10;
      const a = -Math.PI / 2 + Math.sin(s.t * 0.25) * 0.55;
      const len = Math.max(s.w, s.h) * 1.3;
      const sp = 0.12;
      const g = c.createLinearGradient(ox, oy, ox + Math.cos(a) * len, oy + Math.sin(a) * len);
      g.addColorStop(0, hexA(s.accent, s.dark ? 0.22 : 0.14));
      g.addColorStop(1, hexA(s.accent, 0));
      c.fillStyle = g;
      c.beginPath();
      c.moveTo(ox, oy);
      c.lineTo(ox + Math.cos(a - sp) * len, oy + Math.sin(a - sp) * len);
      c.lineTo(ox + Math.cos(a + sp) * len, oy + Math.sin(a + sp) * len);
      c.closePath();
      c.fill();

      for (const f of fogs) {
        f.x += f.v * s.dt;
        if (f.x > s.w + f.r) f.x = -f.r;
        else if (f.x < -f.r) f.x = s.w + f.r;
        fogBlob(c, f.x, f.y, f.r, s.text, s.dark ? 0.05 : 0.07);
      }

      c.strokeStyle = hexA(s.text, s.dark ? 0.26 : 0.16);
      c.lineWidth = 1;
      c.beginPath();
      for (const d of drops) {
        d.y += (d.v + Math.abs(s.sv) * 12) * s.dt;
        d.x -= 130 * s.dt;
        if (d.y > s.h + 30) { d.y = -30; d.x = rand(0, s.w + 200); }
        if (d.x < -20) d.x = s.w + 20;
        c.moveTo(d.x, d.y);
        c.lineTo(d.x + d.l * 0.2, d.y - d.l);
      }
      c.stroke();
    },
    front(c, s) {
      for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i];
        r.age += s.dt;
        if (r.age > 0.5) { rings.splice(i, 1); continue; }
        c.globalAlpha = 1 - r.age / 0.5;
        c.strokeStyle = s.accent;
        c.lineWidth = 2;
        c.beginPath();
        c.ellipse(r.x, r.y, 8 + r.age * 120, 3 + r.age * 40, 0, 0, TAU);
        c.stroke();
      }
      c.globalAlpha = 1;
    },
    click(x, y) {
      rings.push({ x, y, age: 0 });
    },
  };
}

/* ----------------------------------------------------------------- Ghostface */

export function ghostface(s0: SceneState): Scene {
  const fogs = Array.from({ length: 6 }, (_, i) => ({ x: rand(0, s0.w), y: rand(0.1, 0.95) * s0.h, r: rand(200, 360), v: rand(6, 14) * (i % 2 ? 1 : -1) }));
  // A phone "ringing" in the corner every so often: slow, soft rings (no flashing).
  let ringIn = 6;
  let ringAge = -1;
  const slashes: { x: number; y: number; age: number }[] = [];

  return {
    back(c, s) {
      for (const f of fogs) {
        // Fog drifts, and parts a little around the pointer.
        const [px, py] = shove(f.x, f.y, s, 320, 260);
        f.x += f.v * s.dt + px;
        f.y += py;
        if (f.x > s.w + f.r) f.x = -f.r;
        else if (f.x < -f.r) f.x = s.w + f.r;
        fogBlob(c, f.x, f.y, f.r, s.text, s.dark ? 0.06 : 0.08);
      }
      ringIn -= s.dt;
      if (ringIn <= 0 && ringAge < 0) { ringAge = 0; ringIn = rand(12, 20); }
      if (ringAge >= 0) {
        ringAge += s.dt;
        c.strokeStyle = s.accent;
        c.lineWidth = 2;
        for (let k = 0; k < 3; k++) {
          const p = (ringAge - k * 0.35) / 1.6;
          if (p < 0 || p > 1) continue;
          c.globalAlpha = (1 - p) * 0.35;
          c.beginPath();
          c.arc(s.w - 48, s.h - 48, 16 + p * 130, 0, TAU);
          c.stroke();
        }
        c.globalAlpha = 1;
        if (ringAge > 3) ringAge = -1;
      }
    },
    front(c, s) {
      for (let i = slashes.length - 1; i >= 0; i--) {
        const sl = slashes[i];
        sl.age += s.dt;
        if (sl.age > 0.5) { slashes.splice(i, 1); continue; }
        const p = Math.min(1, sl.age / 0.18);
        c.globalAlpha = 1 - sl.age / 0.5;
        c.strokeStyle = s.accent;
        c.lineWidth = 3;
        c.lineCap = "round";
        c.beginPath();
        c.moveTo(sl.x - 22, sl.y - 22);
        c.lineTo(sl.x - 22 + 44 * p, sl.y - 22 + 44 * p);
        c.stroke();
      }
      c.globalAlpha = 1;
    },
    click(x, y) {
      slashes.push({ x, y, age: 0 });
    },
  };
}

export const SCENES: Record<string, (s: SceneState) => Scene> = { naruto, spiderman, batman, pennywise, ghostface };
