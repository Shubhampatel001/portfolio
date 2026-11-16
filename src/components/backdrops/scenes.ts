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
  /** While the button is held past a short tap: 0..1 charge, and where it was pressed (follows the pointer). */
  hold: number;
  hx: number;
  hy: number;
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
  /** Button released after a long hold; power is the charge, 0..1. A short tap calls click instead. */
  release?: (x: number, y: number, s: SceneState, power: number) => void;
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
  // A tap makes a ring and a gust. Holding charges a rasengan at the pointer; release blasts.
  const rings: { x: number; y: number; age: number }[] = [];
  const blasts: { x: number; y: number; age: number; p: number }[] = [];

  return {
    back(c, s) {
      c.fillStyle = s.accent;
      c.strokeStyle = s.text;
      for (const l of leaves) {
        // Leaves drift on their own, shy away from the pointer, and get blown by clicks.
        const [px, py] = shove(l.x, l.y, s, 130, 700);
        if (s.hold > 0) {
          // Leaves are drawn into the charging sphere.
          const dx = s.hx - l.x;
          const dy = s.hy - l.y;
          const d = Math.hypot(dx, dy) || 1;
          if (d < 320) {
            const k = (1 - d / 320) * 900 * s.hold * s.dt;
            l.kx += (dx / d) * k;
            l.ky += (dy / d) * k;
          }
        }
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
      if (s.hold > 0) {
        const p = s.hold;
        // The sphere trembles harder as it charges: that is the warning that a release is coming.
        const hx = s.hx + rand(-1, 1) * p * 4;
        const hy = s.hy + rand(-1, 1) * p * 4;
        const r = 6 + p * 34 + Math.sin(s.t * 30) * p * 1.5;
        const g = c.createRadialGradient(hx, hy, 0, hx, hy, r * 2.6);
        g.addColorStop(0, hexA(s.alt, 0.55));
        g.addColorStop(1, hexA(s.alt, 0));
        c.fillStyle = g;
        c.fillRect(hx - r * 2.6, hy - r * 2.6, r * 5.2, r * 5.2);
        c.lineCap = "round";
        for (let k = 0; k < 5; k++) {
          const a0 = s.t * 14 + (k / 5) * TAU;
          c.strokeStyle = k % 2 ? "#ffffff" : s.alt;
          c.globalAlpha = 0.85;
          c.lineWidth = 2.4;
          c.beginPath();
          c.arc(hx, hy, r * (0.55 + 0.1 * k), a0, a0 + 1.3);
          c.stroke();
        }
        c.globalAlpha = 0.95;
        c.fillStyle = "#ffffff";
        c.beginPath();
        c.arc(hx, hy, r * 0.42, 0, TAU);
        c.fill();
        // Sparks orbit the sphere and tighten as it nears full charge.
        c.fillStyle = s.alt;
        for (let k = 0; k < 6; k++) {
          const a = -s.t * 9 + (k / 6) * TAU;
          const rr = r * (1.4 + 0.5 * Math.sin(s.t * 6 + k)) * (1.1 - p * 0.3);
          c.beginPath();
          c.arc(hx + Math.cos(a) * rr, hy + Math.sin(a) * rr, 2.2, 0, TAU);
          c.fill();
        }
        c.globalAlpha = 1;
      }
      for (let i = blasts.length - 1; i >= 0; i--) {
        const b = blasts[i];
        b.age += s.dt;
        const life = 0.45 + b.p * 0.35;
        if (b.age > life) { blasts.splice(i, 1); continue; }
        const t = b.age / life;
        const R = (140 + b.p * 380) * (1 - Math.pow(1 - t, 3));
        c.globalAlpha = (1 - t) * 0.9;
        c.strokeStyle = s.alt;
        c.lineWidth = 3 + b.p * 7 * (1 - t);
        c.beginPath();
        c.arc(b.x, b.y, R, 0, TAU);
        c.stroke();
        c.strokeStyle = "#ffffff";
        c.lineWidth = 1.5;
        c.beginPath();
        c.arc(b.x, b.y, R * 0.7, 0, TAU);
        c.stroke();
        c.strokeStyle = s.alt;
        c.lineWidth = 2;
        c.beginPath();
        for (let k = 0; k < 16; k++) {
          const a = (k / 16) * TAU + b.p;
          c.moveTo(b.x + Math.cos(a) * R * 0.45, b.y + Math.sin(a) * R * 0.45);
          c.lineTo(b.x + Math.cos(a) * R * 0.95, b.y + Math.sin(a) * R * 0.95);
        }
        c.stroke();
        if (t < 0.25) {
          c.globalAlpha = (1 - t / 0.25) * 0.7;
          c.fillStyle = "#ffffff";
          c.beginPath();
          c.arc(b.x, b.y, 24 + b.p * 50, 0, TAU);
          c.fill();
        }
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
    release(x, y, s, power) {
      const p = Math.max(0.15, power);
      const bx = s.hx;
      const by = s.hy;
      blasts.push({ x: bx, y: by, age: 0, p });
      // The blast throws leaves outward, harder the longer it was charged.
      const reach = 200 + p * 360;
      for (const l of leaves) {
        const dx = l.x - bx;
        const dy = l.y - by;
        const d = Math.hypot(dx, dy) || 1;
        if (d < reach) {
          const k = (1 - d / reach) * (500 + p * 1100);
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
  const shots: { x: number; y: number; cx: number; cy: number; age: number; rot: number; big: number }[] = [];

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
      if (s.hold > 0) {
        // Four threads pull taut toward the pointer and hum; a web forms where it will land.
        const p = s.hold;
        c.lineCap = "round";
        c.strokeStyle = s.text;
        for (const [ox, oy] of [[0, 0], [s.w, 0], [0, s.h], [s.w, s.h]]) {
          const len = Math.hypot(s.hx - ox, s.hy - oy) || 1;
          const nx = -(s.hy - oy) / len;
          const ny = (s.hx - ox) / len;
          const wob = Math.sin(s.t * (40 + p * 50) + ox) * (3 + p * 14);
          c.globalAlpha = 0.25 + p * 0.6;
          c.lineWidth = 1 + p * 3;
          c.beginPath();
          c.moveTo(ox, oy);
          c.quadraticCurveTo((ox + s.hx) / 2 + nx * wob, (oy + s.hy) / 2 + ny * wob, s.hx, s.hy);
          c.stroke();
        }
        const R = 14 + p * 70;
        c.globalAlpha = 0.4 + p * 0.5;
        c.lineWidth = 1.5;
        c.beginPath();
        for (let k = 0; k < 9; k++) {
          const a = (k / 9) * TAU + s.t * 0.4;
          c.moveTo(s.hx, s.hy);
          c.lineTo(s.hx + Math.cos(a) * R + rand(-1, 1) * p * 2, s.hy + Math.sin(a) * R + rand(-1, 1) * p * 2);
        }
        c.stroke();
        c.beginPath();
        c.arc(s.hx, s.hy, R * 0.6, 0, TAU);
        c.stroke();
        c.globalAlpha = 1;
      }
      for (let i = shots.length - 1; i >= 0; i--) {
        const p = shots[i];
        p.age += s.dt;
        const tap = p.big === 0;
        if (p.age > (tap ? 0.8 : 2)) { shots.splice(i, 1); continue; }
        const reach = Math.min(1, p.age / (tap ? 0.12 : 0.1));
        const fade = tap ? (p.age < 0.35 ? 1 : 1 - (p.age - 0.35) / 0.45) : p.age < 1.3 ? 1 : 1 - (p.age - 1.3) / 0.7;
        const ex = p.cx + (p.x - p.cx) * reach;
        const ey = p.cy + (p.y - p.cy) * reach;
        // The thread twangs when it lands, then settles.
        const len = Math.hypot(p.x - p.cx, p.y - p.cy) || 1;
        const nx = -(p.y - p.cy) / len;
        const ny = (p.x - p.cx) / len;
        const wob = !tap && reach >= 1 ? Math.sin((p.age - 0.1) * 42) * 16 * Math.exp(-(p.age - 0.1) * 5) : 0;
        c.lineCap = "round";
        c.strokeStyle = s.text;
        c.globalAlpha = fade * (tap ? 0.75 : 0.9);
        c.lineWidth = tap ? 1.4 : 3 + p.big * 3;
        c.beginPath();
        c.moveTo(p.cx, p.cy);
        c.quadraticCurveTo((p.cx + ex) / 2 + nx * wob, (p.cy + ey) / 2 + ny * wob, ex, ey);
        c.stroke();
        if (tap && reach >= 1) {
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
        } else if (reach >= 1) {
          // The splat: a proper web, thick spokes with sagging rings, popping out with a little overshoot.
          const grow = Math.min(1, (p.age - 0.1) / 0.14);
          const R = (s.mobile ? 62 : 84) * (1 + p.big * 2.4) * (1 - Math.pow(1 - grow, 3)) * (1 + Math.sin(grow * Math.PI) * 0.12);
          const spokes = 9;
          c.globalAlpha = fade * 0.95;
          c.strokeStyle = s.text;
          c.lineWidth = 2.2;
          c.beginPath();
          for (let k = 0; k < spokes; k++) {
            const a = (k / spokes) * TAU + p.rot;
            c.moveTo(p.x, p.y);
            c.lineTo(p.x + Math.cos(a) * R, p.y + Math.sin(a) * R);
          }
          c.stroke();
          c.lineWidth = 1.6;
          c.beginPath();
          for (let ring = 1; ring <= 4; ring++) {
            const rr = (R * ring) / 4;
            for (let k = 0; k < spokes; k++) {
              const a1 = (k / spokes) * TAU + p.rot;
              const a2 = ((k + 1) / spokes) * TAU + p.rot;
              const am = (a1 + a2) / 2;
              c.moveTo(p.x + Math.cos(a1) * rr, p.y + Math.sin(a1) * rr);
              c.quadraticCurveTo(p.x + Math.cos(am) * rr * 0.82, p.y + Math.sin(am) * rr * 0.82, p.x + Math.cos(a2) * rr, p.y + Math.sin(a2) * rr);
            }
          }
          c.stroke();
          c.globalAlpha = fade * 0.9;
          c.fillStyle = s.accent;
          c.beginPath();
          c.arc(p.x, p.y, 5, 0, TAU);
          c.fill();
        }
      }
      c.globalAlpha = 1;
    },
    click(x, y, s) {
      shots.push({ x, y, cx: x < s.w / 2 ? 0 : s.w, cy: y < s.h / 2 ? 0 : s.h, age: 0, rot: rand(0, TAU), big: 0 });
    },
    release(x, y, s, power) {
      // Webs from all four corners slam into the spot, bigger the longer it was held.
      const rot = rand(0, TAU);
      for (const [cx, cy] of [[0, 0], [s.w, 0], [0, s.h], [s.w, s.h]]) shots.push({ x: s.hx, y: s.hy, cx, cy, age: 0, rot: rot + cx * 0.001, big: 0.3 + power * 0.7 });
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
  const bursts: { x: number; y: number; age: number; R: number }[] = [];
  const pop = (x: number, y: number, n: number) => {
    for (let i = 0; i < n; i++) {
      const a = rand(0, TAU);
      shards.push({ x, y, vx: Math.cos(a) * rand(80, 260), vy: Math.sin(a) * rand(80, 260) - 80, life: 0.8 });
    }
  };

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
      if (s.hold > 0) {
        // A balloon swells at the pointer, shaking harder as it fills.
        const p = s.hold;
        const r = 14 + p * (s.mobile ? 70 : 105);
        const sx = s.hx + rand(-1, 1) * p * 5;
        const sy = s.hy + rand(-1, 1) * p * 5;
        c.globalAlpha = 0.92;
        c.fillStyle = s.accent;
        balloon(c, sx, sy, r);
        c.globalAlpha = 0.4;
        c.fillStyle = "#ffffff";
        c.beginPath();
        c.ellipse(sx - r * 0.38, sy - r * 0.45, r * 0.18, r * 0.3, -0.5, 0, TAU);
        c.fill();
        c.globalAlpha = 1;
      }
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        b.age += s.dt;
        if (b.age > 0.5) { bursts.splice(i, 1); continue; }
        c.globalAlpha = (1 - b.age / 0.5) * 0.8;
        c.strokeStyle = s.accent;
        c.lineWidth = 4;
        c.beginPath();
        c.arc(b.x, b.y, b.R * (1 - Math.pow(1 - b.age / 0.5, 3)), 0, TAU);
        c.stroke();
      }
      c.globalAlpha = 1;
      c.fillStyle = s.accent;
      for (let i = shards.length - 1; i >= 0; i--) {
        const p = shards[i];
        p.life -= s.dt;
        if (p.life <= 0) { shards.splice(i, 1); continue; }
        p.vy += 520 * s.dt;
        p.x += p.vx * s.dt;
        p.y += p.vy * s.dt;
        c.globalAlpha = clamp(p.life / 0.8, 0, 1);
        c.fillRect(p.x, p.y, 6, 3);
      }
      c.globalAlpha = 1;
    },
    click(x, y, s) {
      for (const b of balloons) {
        if (Math.hypot(b.x - x, (b.y - y) / 1.2) > b.r * 1.3) continue;
        pop(b.x, b.y, 12);
        b.y = s.h + b.r * 3;
        b.x = rand(0, s.w);
        return;
      }
    },
    release(x, y, s, power) {
      // The held balloon bursts; the bang pops every balloon nearby, more of them the longer it was held.
      const r = 14 + power * (s.mobile ? 70 : 105);
      pop(s.hx, s.hy, 18 + Math.round(power * 60));
      bursts.push({ x: s.hx, y: s.hy, age: 0, R: r * 2 + power * 260 });
      const reach = r * 2 + power * 260;
      for (const b of balloons) {
        if (Math.hypot(b.x - s.hx, b.y - s.hy) > reach) continue;
        pop(b.x, b.y, 10);
        b.y = s.h + b.r * 3;
        b.x = rand(0, s.w);
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
  // Click to throw a batarang from the side; it spins in and sticks.
  const FLY = 0.26;
  const knives: { sx: number; sy: number; x: number; y: number; age: number; spin: number; stuck: number; landed: boolean }[] = [];
  const throwAt = (x: number, y: number, s: SceneState, fromLeft: boolean) =>
    knives.push({ sx: fromLeft ? -40 : s.w + 40, sy: clamp(y + rand(40, 160), 0, s.h), x, y, age: 0, spin: rand(0, TAU), stuck: rand(-0.6, 0.6), landed: false });
  const bat = (c: Ctx, size: number) => {
    const half: [number, number][] = [[0, -5], [3, -9], [5, -5], [12, -9], [23, -2], [17, -1], [15, 4], [10, 1], [5, 6], [0, 9]];
    c.beginPath();
    half.forEach(([x, y], i) => (i ? c.lineTo(x * size, y * size) : c.moveTo(x * size, y * size)));
    for (let i = half.length - 1; i >= 0; i--) c.lineTo(-half[i][0] * size, half[i][1] * size);
    c.closePath();
  };

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
      if (s.hold > 0) {
        // A batarang hovers at the pointer, spinning faster and shaking as the charge builds.
        const p = s.hold;
        const g = c.createRadialGradient(s.hx, s.hy, 0, s.hx, s.hy, 40 + p * 90);
        g.addColorStop(0, hexA(s.accent, 0.35 + p * 0.3));
        g.addColorStop(1, hexA(s.accent, 0));
        c.fillStyle = g;
        c.fillRect(s.hx - 130, s.hy - 130, 260, 260);
        c.save();
        c.translate(s.hx + rand(-1, 1) * p * 4, s.hy + rand(-1, 1) * p * 4);
        c.rotate(s.t * (8 + p * 34));
        c.fillStyle = s.dark ? "#d7dbe6" : "#12151c";
        c.strokeStyle = s.accent;
        c.lineWidth = 1.5;
        bat(c, 1.2 + p * 2.2);
        c.fill();
        c.stroke();
        c.restore();
      }
      for (let i = knives.length - 1; i >= 0; i--) {
        const k = knives[i];
        k.age += s.dt;
        const t = Math.min(1, k.age / FLY);
        const e = 1 - Math.pow(1 - t, 2);
        if (t >= 1 && !k.landed) {
          k.landed = true;
          rings.push({ x: k.x, y: k.y, age: 0 });
        }
        const after = k.age - FLY;
        if (after > 0.9) { knives.splice(i, 1); continue; }
        const px = k.sx + (k.x - k.sx) * e;
        const py = k.sy + (k.y - k.sy) * e;
        c.globalAlpha = after > 0.55 ? 1 - (after - 0.55) / 0.35 : 1;
        if (t < 1) {
          // A motion streak behind the spinning blade.
          c.strokeStyle = hexA(s.text, 0.35);
          c.lineWidth = 2;
          c.beginPath();
          c.moveTo(k.sx + (k.x - k.sx) * Math.max(0, e - 0.3), k.sy + (k.y - k.sy) * Math.max(0, e - 0.3));
          c.lineTo(px, py);
          c.stroke();
        }
        c.save();
        c.translate(px, py);
        // Spins in flight, then sticks at a slight tilt with a small wobble.
        c.rotate(t < 1 ? k.spin + t * 26 : k.stuck + Math.sin(after * 60) * 0.12 * Math.exp(-after * 6));
        c.fillStyle = s.dark ? "#d7dbe6" : "#12151c";
        c.strokeStyle = s.accent;
        c.lineWidth = 1.5;
        bat(c, 1.25);
        c.fill();
        c.stroke();
        c.restore();
      }
      c.globalAlpha = 1;
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
    release(x, y, s, power) {
      // A volley, wider and bigger the longer it was held.
      const n = 3 + Math.round(power * 8);
      for (let i = 0; i < n; i++) {
        throwAt(s.hx + rand(-1, 1) * (40 + power * 240), s.hy + rand(-1, 1) * (30 + power * 170), s, i % 2 === 0);
      }
      rings.push({ x: s.hx, y: s.hy, age: 0 });
    },
  };
}

/* ----------------------------------------------------------------- Ghostface */

export function ghostface(s0: SceneState): Scene {
  const fogs = Array.from({ length: 6 }, (_, i) => ({ x: rand(0, s0.w), y: rand(0.1, 0.95) * s0.h, r: rand(200, 360), v: rand(6, 14) * (i % 2 ? 1 : -1) }));
  // A phone "ringing" in the corner every so often: slow, soft rings (no flashing).
  let ringIn = 6;
  let ringAge = -1;
  const slashes: { x: number; y: number; age: number; h: number }[] = [];
  // A held release: the mask lunges out of the dark at that spot, then drops away.
  const masks: { x: number; y: number; age: number; tilt: number; k: number }[] = [];
  const mask = (c: Ctx, dark: boolean) => {
    c.fillStyle = dark ? "#eeeae0" : "#f7f4ec";
    c.strokeStyle = dark ? "#0b0b0d" : "#15151a";
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(-24, -34);
    c.quadraticCurveTo(0, -42, 24, -34);
    c.quadraticCurveTo(28, 6, 18, 36);
    c.quadraticCurveTo(0, 56, -18, 36);
    c.quadraticCurveTo(-28, 6, -24, -34);
    c.closePath();
    c.fill();
    c.stroke();
    c.fillStyle = "#0b0b0d";
    for (const sx of [-1, 1]) {
      c.beginPath();
      c.moveTo(sx * 15, -18);
      c.quadraticCurveTo(sx * 5, -20, sx * 7, -3);
      c.quadraticCurveTo(sx * 9, 8, sx * 14, 12);
      c.quadraticCurveTo(sx * 19, -2, sx * 15, -18);
      c.fill();
    }
    c.beginPath();
    c.ellipse(0, 28, 7, 13, 0, 0, TAU);
    c.fill();
  };

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
      if (s.hold > 0) {
        // The mask creeps out of the dark at the pointer, trembling more as it nears.
        const p = s.hold;
        c.globalAlpha = 0.15 + p * 0.8;
        c.save();
        c.translate(s.hx + rand(-1, 1) * p * 4, s.hy + rand(-1, 1) * p * 4);
        c.scale(0.3 + p * 1.3, 0.3 + p * 1.3);
        mask(c, s.dark);
        c.restore();
        c.globalAlpha = 1;
      }
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
        c.moveTo(sl.x - sl.h, sl.y - sl.h);
        c.lineTo(sl.x - sl.h + sl.h * 2 * p, sl.y - sl.h + sl.h * 2 * p);
        c.stroke();
      }
      for (let i = masks.length - 1; i >= 0; i--) {
        const m = masks[i];
        m.age += s.dt;
        if (m.age > 0.9) { masks.splice(i, 1); continue; }
        const inT = Math.min(1, m.age / 0.14);
        const scale = (0.35 + 0.85 * (1 - Math.pow(1 - inT, 3))) * (1 + Math.min(m.age, 0.5) * 0.12);
        c.globalAlpha = m.age < 0.55 ? 0.96 : 0.96 * (1 - (m.age - 0.55) / 0.35);
        c.save();
        c.translate(m.x, m.y + (m.age > 0.55 ? (m.age - 0.55) * 90 : 0));
        c.rotate(m.tilt);
        c.scale(scale * m.k, scale * m.k);
        mask(c, s.dark);
        c.restore();
      }
      c.globalAlpha = 1;
    },
    click(x, y) {
      slashes.push({ x, y, age: 0, h: 22 });
    },
    release(x, y, s, power) {
      // The mask lunges huge out of the dark and the knife slashes around it.
      masks.push({ x: s.hx, y: s.hy, age: 0, tilt: rand(-0.2, 0.2), k: 1.4 + power * 2.6 });
      const n = 2 + Math.round(power * 5);
      for (let i = 0; i < n; i++) slashes.push({ x: s.hx + rand(-1, 1) * (60 + power * 220), y: s.hy + rand(-1, 1) * (40 + power * 160), age: 0, h: 40 + power * 70 });
    },
  };
}

export const SCENES: Record<string, (s: SceneState) => Scene> = { naruto, spiderman, batman, pennywise, ghostface };
