import { useId } from "react";
import { getPersonaById } from "@/lib/personas";

// One shared style for every guide: bold ink outline, cel-shaded two-tone fills with a soft gradient,
// rim highlights, an expressive face, and a coloured badge with a little scenery behind. Character cues
// only (hair, mask, hood, colours); no logos, emblems or official art.
const INK = "#17141c";
const S = { stroke: INK, strokeWidth: 2.4, strokeLinejoin: "round", strokeLinecap: "round" } as const;
const THIN = { stroke: INK, strokeWidth: 1.2, strokeLinejoin: "round", strokeLinecap: "round" } as const;
const SHOULDERS = "M8 100 C10 80 28 72 50 72 C72 72 92 80 92 100 Z";

type U = { u: string };

function Lin({ id, a, b, x2 = 0, y2 = 1 }: { id: string; a: string; b: string; x2?: number; y2?: number }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2={x2} y2={y2}>
      <stop offset="0" stopColor={a} />
      <stop offset="1" stopColor={b} />
    </linearGradient>
  );
}
function Rad({ id, a, b, cx = 0.5, cy = 0.4, r = 0.75 }: { id: string; a: string; b: string; cx?: number; cy?: number; r?: number }) {
  return (
    <radialGradient id={id} cx={cx} cy={cy} r={r}>
      <stop offset="0" stopColor={a} />
      <stop offset="1" stopColor={b} />
    </radialGradient>
  );
}

/** A head with cel shading: a shaded base, a lit shape offset up-left, then the ink outline on top. */
function Head({ u, cx, cy, rx, ry, base, lit }: U & { cx: number; cy: number; rx: number; ry: number; base: string; lit: string }) {
  return (
    <>
      <clipPath id={`${u}-hc`}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
      </clipPath>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={base} />
      <g clipPath={`url(#${u}-hc)`}>
        <ellipse cx={cx - 3.5} cy={cy - 3} rx={rx + 0.5} ry={ry + 0.5} fill={lit} />
      </g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" {...S} />
    </>
  );
}

/* ------------------------------------------------------------------ Naruto */

function Naruto({ u, skin }: U & { skin: string }) {
  return (
    <>
      <defs>
        <Rad id={`${u}-bg`} a="#ffd877" b="#ee8a00" cy={0.42} r={0.8} />
        <Lin id={`${u}-jk`} a="#313b87" b="#121741" />
        <Lin id={`${u}-hair`} a="#ffe88a" b="#ffb81a" x2={0.6} y2={1} />
        <Lin id={`${u}-plate`} a="#f4f7fc" b="#a9b3c8" x2={1} y2={1} />
        <Lin id={`${u}-band`} a="#3a4cb4" b="#1f2a78" />
      </defs>
      <rect x="-12" y="-12" width="124" height="124" fill={`url(#${u}-bg)`} />
      <circle cx="50" cy="52" r="46" fill="none" stroke="#fff" strokeOpacity=".22" strokeWidth="24" strokeDasharray="4 7" />
      <circle cx="50" cy="52" r="30" fill="#fff" fillOpacity=".12" />

      {/* jacket */}
      <path d={SHOULDERS} fill={`url(#${u}-jk)`} {...S} />
      <path d="M16 84 Q30 75 44 74" fill="none" stroke="#5967c9" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M82 80 L93 87 L90 98 L79 91Z" fill="#f26b1d" {...S} />
      <path d="M84 83 L90 87" stroke="#ffb27a" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M50 76 V100" stroke="#0a0d2a" strokeWidth="1.6" />
      <circle cx="50" cy="94" r="1.4" fill="#aab2d8" />

      {/* neck, collar */}
      <rect x="43" y="58" width="14" height="17" rx="4" fill="#efbb8d" {...S} />
      <path d="M33 75 Q50 84 67 75 L65 62 Q50 71 35 62Z" fill="#27307a" {...S} />
      <path d="M36 66 Q50 74 64 66" fill="none" stroke="#4452b0" strokeWidth="1.3" strokeLinecap="round" />
      <ellipse cx="50" cy="63" rx="13" ry="4" fill="#000" opacity=".16" />

      {/* ears */}
      <ellipse cx="31" cy="47" rx="3.6" ry="5.2" fill={skin} {...S} />
      <ellipse cx="69" cy="47" rx="3.6" ry="5.2" fill="#f3c196" {...S} />
      <path d="M30.5 45 Q32 47 30.5 50" fill="none" {...THIN} stroke="#c98a62" />
      <path d="M69.5 45 Q68 47 69.5 50" fill="none" {...THIN} stroke="#c98a62" />

      {/* hair, behind the face */}
      <path d="M30 44 L26 56 L33 50Z M70 44 L74 56 L67 50Z" fill={`url(#${u}-hair)`} {...S} />
      <Head u={u} cx={50} cy={45.5} rx={18.5} ry={20.5} base="#f1bf93" lit={skin} />

      {/* spiky hair in front */}
      <path d="M30 42 L21 30 L33 31 L27 13 L40 22 L44 5 L50 20 L56 5 L60 22 L73 13 L67 31 L79 30 L70 42 Q66 31 50 30 Q34 31 30 42Z" fill={`url(#${u}-hair)`} {...S} />
      <path d="M35 24 L31 16 M45 20 L45 11 M58 21 L61 12 M66 27 L71 21" stroke="#c98a12" strokeWidth="1.1" strokeLinecap="round" opacity=".7" />
      <path d="M33 29 L29 20 L36 25Z" fill="#fff6b8" opacity=".75" />

      {/* headband: tails, band, plain metal plate */}
      <path d="M70 38 L86 41 L79 45 L88 52 L72 45Z" fill="#2a3a8f" {...S} />
      <path d="M29 38 Q50 31 71 38 L71 45.5 Q50 38.5 29 45.5Z" fill={`url(#${u}-band)`} {...S} />
      <rect x="38.5" y="33.5" width="23" height="10" rx="2.4" fill={`url(#${u}-plate)`} {...S} />
      <path d="M42 36 H58" stroke="#fff" strokeOpacity=".9" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M42 40.5 H58" stroke="#7d879e" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="40.5" cy="38.5" r=".9" fill="#7d879e" />
      <circle cx="59.5" cy="38.5" r=".9" fill="#7d879e" />

      {/* face */}
      <path d="M36.5 43.5 Q41 41.5 45 43.2 M55 43.2 Q59 41.5 63.5 43.5" fill="none" stroke="#c58f1a" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M37.5 51 Q42 45.5 46.5 51 M53.5 51 Q58 45.5 62.5 51" fill="none" {...S} strokeWidth="2.6" />
      <ellipse cx="36" cy="54" rx="3.4" ry="2" fill="#ff7f6e" opacity=".35" />
      <ellipse cx="64" cy="54" rx="3.4" ry="2" fill="#ff7f6e" opacity=".35" />
      <path d="M33.5 48.5 L27.5 47 M33.5 52 L27.5 52 M33.5 55.5 L27.5 57 M66.5 48.5 L72.5 47 M66.5 52 L72.5 52 M66.5 55.5 L72.5 57" stroke="#a8643d" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M49 52.5 Q50 54.2 51 52.5" fill="none" stroke="#c98a62" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M37.5 56.5 Q50 69 62.5 56.5Z" fill="#7a2230" {...S} />
      <path d="M38.8 57.5 Q50 61.5 61.2 57.5 L60 59.5 Q50 63 40 59.5Z" fill="#fff" />
      <path d="M44 64 Q50 61.5 56 64 Q50 68 44 64Z" fill="#ef7a8a" />
    </>
  );
}

/* --------------------------------------------------------------- Spider-Man */

function Spider({ u }: U) {
  return (
    <>
      <defs>
        <Rad id={`${u}-bg`} a="#4f6bf0" b="#1d2c86" cy={0.4} r={0.85} />
        <Lin id={`${u}-red`} a="#ff4150" b="#a60f1c" x2={0.7} y2={1} />
        <Lin id={`${u}-blue`} a="#2f58d8" b="#14288a" />
        <Lin id={`${u}-lens`} a="#ffffff" b="#cfd9ee" x2={0.4} y2={1} />
        <clipPath id={`${u}-mc`}>
          <ellipse cx="50" cy="45" rx="20" ry="22.5" />
        </clipPath>
      </defs>
      <rect x="-12" y="-12" width="124" height="124" fill={`url(#${u}-bg)`} />
      {/* web and halftone behind */}
      <g stroke="#fff" strokeOpacity=".24" fill="none" strokeWidth="1">
        <path d="M0 0 L100 100 M100 0 L0 100 M50 0 V100 M0 50 H100 M0 25 L100 75 M0 75 L100 25" />
        <circle cx="50" cy="50" r="18" />
        <circle cx="50" cy="50" r="32" />
        <circle cx="50" cy="50" r="46" />
      </g>
      <circle cx="50" cy="50" r="48" fill="none" stroke="#fff" strokeOpacity=".12" strokeWidth="8" strokeDasharray="1.5 4" />

      {/* suit */}
      <path d={SHOULDERS} fill={`url(#${u}-red)`} {...S} />
      <path d="M8 100 C10 85 20 77 34 73 L37 100Z M92 100 C90 85 80 77 66 73 L63 100Z" fill={`url(#${u}-blue)`} {...S} />
      <path d="M37 73 Q50 80 63 73 M50 79 V100 M42 83 Q50 88 58 83 M40 92 Q50 97 60 92" fill="none" stroke={INK} strokeOpacity=".7" strokeWidth="1.1" />
      <path d="M16 86 Q26 78 36 76" fill="none" stroke="#6f8cff" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="43" y="58" width="14" height="17" rx="4" fill="#b81422" {...S} />

      {/* mask */}
      <ellipse cx="50" cy="45" rx="20" ry="22.5" fill="#b81422" />
      <g clipPath={`url(#${u}-mc)`}>
        <ellipse cx="46" cy="42" rx="20.5" ry="23" fill={`url(#${u}-red)`} />
        <ellipse cx="41" cy="31" rx="9" ry="5" fill="#fff" opacity=".22" transform="rotate(-25 41 31)" />
      </g>
      <ellipse cx="50" cy="45" rx="20" ry="22.5" fill="none" {...S} />
      <path d="M50 22.5 V67 M50 45 L30 45 M50 45 L70 45 M50 31 Q41 32 32 36 M50 31 Q59 32 68 36 M50 59 Q41 57 33 53 M50 59 Q59 57 67 53 M50 38 Q42 40 36 44 M50 38 Q58 40 64 44 M50 52 Q43 53 38 51 M50 52 Q57 53 62 51" fill="none" stroke={INK} strokeOpacity=".8" strokeWidth="1" />

      {/* big lenses */}
      <path d="M29.5 46 Q33 34 48.5 42 Q48 54 36.5 55.5 Q29.5 53.5 29.5 46Z" fill={`url(#${u}-lens)`} {...S} />
      <path d="M70.5 46 Q67 34 51.5 42 Q52 54 63.5 55.5 Q70.5 53.5 70.5 46Z" fill={`url(#${u}-lens)`} {...S} />
      <path d="M33 44 Q37 39 43 41" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity=".9" />
      <path d="M67 44 Q63 39 57 41" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity=".9" />
      <path d="M34 53 Q41 54 47 49 M66 53 Q59 54 53 49" fill="none" stroke="#9fb0d4" strokeWidth="1.2" strokeLinecap="round" />
    </>
  );
}

/* ------------------------------------------------------------------ Batman */

function Batman({ u, skin }: U & { skin: string }) {
  return (
    <>
      <defs>
        <Rad id={`${u}-bg`} a="#33465f" b="#0f1622" cy={0.3} r={0.9} />
        <Rad id={`${u}-moon`} a="#fff6bf" b="#efc23a" cx={0.4} cy={0.4} r={0.7} />
        <Lin id={`${u}-cowl`} a="#323a50" b="#0d1018" x2={0.6} y2={1} />
        <Lin id={`${u}-cape`} a="#2a3347" b="#0f131c" />
        <Lin id={`${u}-armor`} a="#5a677f" b="#2c3446" x2={0.6} y2={1} />
        <clipPath id={`${u}-jc`}>
          <path d="M35 50 L44 53.5 L50 49.5 L56 53.5 L65 50 Q64 64 50 70.5 Q36 64 35 50Z" />
        </clipPath>
      </defs>
      <rect x="-12" y="-12" width="124" height="124" fill={`url(#${u}-bg)`} />
      <circle cx="69" cy="27" r="22" fill="#f2cf55" opacity=".18" />
      <circle cx="69" cy="27" r="18" fill={`url(#${u}-moon)`} />
      <circle cx="63" cy="22" r="3" fill="#e8b92c" opacity=".5" />
      <circle cx="74" cy="33" r="2" fill="#e8b92c" opacity=".45" />
      {/* skyline */}
      <path d="M0 84 V66 H7 V60 H14 V70 H19 V56 H26 V66 H30 V84Z M70 84 V64 H76 V58 H83 V68 H88 V54 H95 V62 H100 V84Z" fill="#0a0e16" />
      <path d="M10 62 H11 M21 59 H22 M79 61 H80 M91 58 H92" stroke="#f2cf55" strokeWidth="1.4" opacity=".7" />

      {/* cape and armour */}
      <path d="M4 100 L9 66 Q22 56 36 66 L30 100Z M96 100 L91 66 Q78 56 64 66 L70 100Z" fill={`url(#${u}-cape)`} {...S} />
      <path d="M14 96 L17 74 M24 96 L25 76 M86 96 L83 74 M76 96 L75 76" stroke="#0a0d14" strokeWidth="1.2" opacity=".7" />
      <path d={SHOULDERS} fill={`url(#${u}-armor)`} {...S} />
      <path d="M20 84 Q34 74 46 74 M80 84 Q66 74 54 74" fill="none" stroke="#8c9ab4" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M30 90 Q50 80 70 90 M34 97 Q50 90 66 97" fill="none" stroke="#1d2433" strokeWidth="1.3" />
      <path d="M26 74 L36 66 L42 76Z M74 74 L64 66 L58 76Z" fill="#202737" {...S} />

      {/* neck and cowl */}
      <rect x="43" y="58" width="14" height="17" rx="4" fill="#d9ab82" {...S} />
      <path d="M33 31 L30 5 L42 23 Q50 20 58 23 L70 5 L67 31 L68 46 Q67 58 50 66 Q33 58 32 46Z" fill={`url(#${u}-cowl)`} {...S} />
      <path d="M31.5 12 L30.5 7 L38 19Z" fill="#6f7d99" opacity=".8" />
      <path d="M36 28 Q50 22 64 28" fill="none" stroke="#454f68" strokeWidth="1.2" opacity=".8" />

      {/* jaw */}
      <path d="M35 50 L44 53.5 L50 49.5 L56 53.5 L65 50 Q64 64 50 70.5 Q36 64 35 50Z" fill={skin} />
      <g clipPath={`url(#${u}-jc)`}>
        <path d="M52 48 L70 48 L70 76 L40 76 Q58 66 52 48Z" fill="#c99a72" />
        <path d="M37 60 Q50 72 63 60 L63 76 L37 76Z" fill="#000" opacity=".08" />
      </g>
      <path d="M35 50 L44 53.5 L50 49.5 L56 53.5 L65 50 Q64 64 50 70.5 Q36 64 35 50Z" fill="none" {...S} />
      <path d="M44 61.5 Q50 58.5 56 61.5" fill="none" stroke="#7b4a3a" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M46 66 Q50 67.5 54 66" fill="none" stroke="#a97a58" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M48.5 55 Q50 57 51.5 55" fill="none" stroke="#a97a58" strokeWidth="1.2" strokeLinecap="round" />

      {/* eyes */}
      <path d="M35 36.5 L48 43.5 M65 36.5 L52 43.5" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
      <path d="M36 41.5 L47.5 45.5 L47.5 49 L37 47.5Z M64 41.5 L52.5 45.5 L52.5 49 L63 47.5Z" fill="#fafafa" {...S} strokeWidth="1.7" />
      <path d="M40 43.6 L46 46 M60 43.6 L54 46" stroke="#cfe6ff" strokeWidth="1.2" />
    </>
  );
}

/* --------------------------------------------------------------- Pennywise */

function Pennywise({ u, skin }: U & { skin: string }) {
  return (
    <>
      <defs>
        <Rad id={`${u}-bg`} a="#52797c" b="#1b3033" cy={0.35} r={0.9} />
        <Lin id={`${u}-hair`} a="#ff8030" b="#d23f0c" x2={0.7} y2={1} />
        <Lin id={`${u}-ruff`} a="#d6e0e9" b="#8fa2b3" x2={0.5} y2={1} />
        <Rad id={`${u}-iris`} a="#f4e66a" b="#b3a21e" r={0.8} />
        <Rad id={`${u}-ball`} a="#ff5a5f" b="#b8101a" cx={0.38} cy={0.35} r={0.8} />
      </defs>
      <rect x="-12" y="-12" width="124" height="124" fill={`url(#${u}-bg)`} />
      <path d="M0 0 L46 0 L8 100 L0 100Z" fill="#fff" opacity=".07" />
      {/* drain bars and a floating balloon */}
      <path d="M0 92 H100 M14 86 V100 M32 86 V100 M68 86 V100 M86 86 V100" stroke="#0f1d1f" strokeWidth="2" opacity=".5" />
      <path d="M14 30 Q10 48 16 64" fill="none" stroke="#efe6d2" strokeWidth="1.3" />
      <ellipse cx="15" cy="17" rx="10.5" ry="13" fill={`url(#${u}-ball)`} {...S} />
      <path d="M12 24.5 L18 24.5 L15 28.5Z" fill="#b8101a" {...THIN} />
      <path d="M9.5 12 Q10.5 8 14 7" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" opacity=".7" />

      {/* ruffle collar with pompoms */}
      <ellipse cx="50" cy="85" rx="40" ry="16" fill={`url(#${u}-ruff)`} {...S} />
      <path d="M50 85 L14 76 M50 85 L21 95 M50 85 L50 100 M50 85 L79 95 M50 85 L86 76" stroke="#6f8397" strokeWidth="1.5" />
      <circle cx="50" cy="82" r="4.4" fill="#ee5a1b" {...S} strokeWidth="1.8" />
      <circle cx="49" cy="92" r="4.4" fill="#ee5a1b" {...S} strokeWidth="1.8" />

      {/* side hair, then face */}
      <path d="M33 33 Q9 26 10 50 Q12 69 28 70 Q21 59 30 50Z" fill={`url(#${u}-hair)`} {...S} />
      <path d="M67 33 Q91 26 90 50 Q88 69 72 70 Q79 59 70 50Z" fill={`url(#${u}-hair)`} {...S} />
      <path d="M16 44 Q15 54 20 61 M84 44 Q85 54 80 61" fill="none" stroke="#a22b05" strokeWidth="1.2" strokeLinecap="round" opacity=".7" />
      <Head u={u} cx={50} cy={46.5} rx={19} ry={23.5} base="#c9d0da" lit={skin} />

      {/* brow dome and hair on top */}
      <path d="M31 38 Q29 20 44 14 Q47 4 54 10 Q60 4 62 16 Q71 22 69 38 Q50 26 31 38Z" fill={`url(#${u}-hair)`} {...S} />
      <path d="M40 17 Q43 10 47 9 M55 12 Q58 14 60 20" fill="none" stroke="#a22b05" strokeWidth="1.2" strokeLinecap="round" opacity=".8" />
      <path d="M38 16 Q41 12 45 11" fill="none" stroke="#ffc08a" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M40 31 Q50 27 60 31" fill="none" stroke="#aeb7c4" strokeWidth="1" opacity=".7" />

      {/* eyes and brows */}
      <path d="M33 38.5 L46.5 43.5 M67 38.5 L53.5 43.5" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />
      <ellipse cx="40.5" cy="48" rx="5" ry="3.8" fill="#fff" {...S} strokeWidth="1.6" />
      <ellipse cx="59.5" cy="48" rx="5" ry="3.8" fill="#fff" {...S} strokeWidth="1.6" />
      <circle cx="41.3" cy="48" r="3" fill={`url(#${u}-iris)`} />
      <circle cx="58.7" cy="48" r="3" fill={`url(#${u}-iris)`} />
      <circle cx="41.4" cy="48" r="1.3" fill={INK} />
      <circle cx="58.6" cy="48" r="1.3" fill={INK} />
      <circle cx="42.2" cy="47" r=".7" fill="#fff" />
      <circle cx="59.4" cy="47" r=".7" fill="#fff" />

      {/* face lines, nose, grin */}
      <path d="M44.5 52 Q42.5 60 41 65 M55.5 52 Q57.5 60 59 65" fill="none" stroke="#c0281b" strokeWidth="1.9" strokeLinecap="round" />
      <circle cx="50" cy="54.5" r="3.8" fill="#e0301f" {...S} strokeWidth="1.6" />
      <circle cx="48.8" cy="53.4" r="1" fill="#fff" opacity=".7" />
      <path d="M35 61 Q50 82 65 61 Q50 68.5 35 61Z" fill="#b8171c" {...S} strokeWidth="1.8" />
      <path d="M44.2 65.3 H49.6 V69.4 Q46.9 70.8 44.2 69.4Z M50.4 65.3 H55.8 V69.4 Q53.1 70.8 50.4 69.4Z" fill="#fff" {...THIN} strokeWidth=".9" />
      <ellipse cx="34" cy="56" rx="3" ry="1.8" fill="#e8737a" opacity=".3" />
      <ellipse cx="66" cy="56" rx="3" ry="1.8" fill="#e8737a" opacity=".3" />
    </>
  );
}

/* --------------------------------------------------------------- Ghostface */

function Ghost({ u }: U) {
  return (
    <>
      <defs>
        <Rad id={`${u}-bg`} a="#ff3340" b="#9c0710" cy={0.4} r={0.85} />
        <Lin id={`${u}-mask`} a="#ffffff" b="#d6d3ca" x2={0.7} y2={1} />
        <Lin id={`${u}-blade`} a="#ffffff" b="#a8b0be" x2={1} y2={0.5} />
        <Lin id={`${u}-hood`} a="#2a2733" b="#08070b" x2={0.5} y2={1} />
        <clipPath id={`${u}-mk`}>
          <path d="M47 26 Q58 20 69 26 Q72 52 66 70 Q58 84 50 70 Q44 52 47 26Z" />
        </clipPath>
      </defs>
      <rect x="-12" y="-12" width="124" height="124" fill={`url(#${u}-bg)`} />
      <path d="M50 -10 L50 110 M0 50 H100 M-5 -5 L105 105 M105 -5 L-5 105" stroke="#000" strokeOpacity=".1" strokeWidth="3" />
      <circle cx="58" cy="44" r="36" fill="#000" opacity=".14" />

      {/* robe and hood */}
      <path d="M16 100 L20 78 Q26 66 38 63 L82 64 Q92 72 94 100Z" fill={`url(#${u}-hood)`} {...S} />
      <path d="M34 66 Q34 16 58 12 Q82 16 82 66 L94 100 L24 100Z" fill={`url(#${u}-hood)`} {...S} />
      <path d="M38 40 Q37 22 52 16 M76 30 Q80 46 79 62 M44 84 Q52 90 60 100 M72 80 Q76 90 80 100" fill="none" stroke="#4a4656" strokeWidth="1.4" strokeLinecap="round" />

      {/* gloved hand and the raised knife */}
      <path d="M14 66 H32 V80 H14Z" fill="#14121a" {...S} />
      <path d="M16 70 H30 M16 74.5 H30" stroke="#3a3744" strokeWidth="1.2" />
      <path d="M13 62 H33 V66.5 H13Z" fill="#8d95a3" {...S} />
      <path d="M17.5 62 L24.5 24 Q32 44 29.5 62Z" fill={`url(#${u}-blade)`} {...S} />
      <path d="M22 58 L25 36" stroke="#8a93a4" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M27 56 L27.5 42" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" opacity=".9" />

      {/* the mask */}
      <path d="M47 26 Q58 20 69 26 Q72 52 66 70 Q58 84 50 70 Q44 52 47 26Z" fill="#cfccc2" />
      <g clipPath={`url(#${u}-mk)`}>
        <path d="M45 24 Q55 19 66 24 Q69 50 63 68 Q57 80 50 69 Q45 52 45 24Z" fill={`url(#${u}-mask)`} />
        <path d="M49 30 Q50 44 52 58" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".9" />
      </g>
      <path d="M47 26 Q58 20 69 26 Q72 52 66 70 Q58 84 50 70 Q44 52 47 26Z" fill="none" {...S} />
      <path d="M48.5 37 Q54 32.5 56.5 39 Q56.5 48 52 51 Q47.5 45 48.5 37Z M67.5 37 Q62 32.5 59.5 39 Q59.5 48 64 51 Q68.5 45 67.5 37Z" fill={INK} />
      <path d="M51 38.5 Q53 37 54 39.5" stroke="#6b6674" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      <path d="M58 50.5 Q60.5 53.5 58 56.5 Q55.5 53.5 58 50.5Z" fill={INK} />
      <path d="M53.5 61 Q58 58 62.5 61 Q64 72 58 78 Q52 72 53.5 61Z" fill={INK} />
    </>
  );
}

/** Per-guide framing inside the badge: [scale, shift down]. */
const FRAME: Record<string, [number, number]> = {
  naruto: [1.0, 5],
  spiderman: [1.1, 0],
  batman: [1.0, 5],
  pennywise: [0.97, 4],
  ghostface: [1.06, 0],
};

const SCENE: Record<string, React.ComponentType<U & { skin: string }>> = {
  naruto: Naruto,
  spiderman: Spider,
  batman: Batman,
  pennywise: Pennywise,
  ghostface: Ghost,
};

/** Flat-vector bust on a coloured badge. Without an id, a neutral assistant silhouette is drawn. */
export function PersonaAvatar({ id, size = 56, ring }: { id?: string; size?: number; ring?: string }) {
  const raw = useId();
  const u = raw.replace(/[^a-zA-Z0-9]/g, "");
  const persona = getPersonaById(id);
  const Art = persona ? SCENE[persona.id] : undefined;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden className="shrink-0">
      <defs>
        <clipPath id={`${u}-clip`}>
          <circle cx="50" cy="50" r="48" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${u}-clip)`}>
        {Art && persona ? (
          <g transform={`translate(50 ${58 + FRAME[persona.id][1]}) scale(${FRAME[persona.id][0]}) translate(-50 -58)`}>
            <Art u={u} skin={persona.skin} />
          </g>
        ) : (
          <>
            <circle cx="50" cy="50" r="48" fill="color-mix(in srgb, var(--color-accent) 42%, var(--color-surface))" />
            <path d={SHOULDERS} fill="var(--color-text-muted)" />
            <circle cx="50" cy="42" r="17" fill="var(--color-text-muted)" />
          </>
        )}
        {/* soft vignette to seat the figure in the badge */}
        <circle cx="50" cy="50" r="48" fill="none" stroke="#000" strokeOpacity=".16" strokeWidth="6" />
      </g>
      <circle cx="50" cy="50" r="48" fill="none" stroke={ring ?? INK} strokeWidth="3" />
    </svg>
  );
}
