export type MuscleId =
  | 'pec_clav' | 'pec_stern' | 'pec_abd'
  | 'delt_ant' | 'delt_lat' | 'delt_post'
  | 'biceps_long' | 'biceps_short' | 'brachialis' | 'brachioradialis'
  | 'triceps_long' | 'triceps_lat' | 'triceps_med'
  | 'forearm_flexors' | 'forearm_extensors'
  | 'rectus_abdominis'
  | 'rectus_femoris' | 'vastus_lat' | 'vastus_med' | 'vastus_int'
  | 'trap_upper' | 'trap_mid' | 'trap_lower' | 'rhomboids'
  | 'lats' | 'teres_major' | 'infraspinatus' | 'supraspinatus'
  | 'biceps_femoris' | 'semitendinosus' | 'semimembranosus'
  | 'glute_max' | 'glute_med' | 'gastrocnemius' | 'soleus';

export type Layer = 'sup' | 'deep';
export type View = 'front' | 'back';

export interface Shape {
  id: MuscleId | null;
  d: string;
  layer: Layer;
  line?: boolean;
}

type P = [number, number];

interface Spindle {
  c0: P; c1: P; bend?: number; W: number;
  a: number; b: number; t0: number; t1: number;
  base?: (t: number) => number;
}

const defaultBase = (t: number) => 0.72 + 0.28 * Math.sin(Math.PI * t);
const r1 = (n: number) => Math.round(n * 10) / 10;

function trace(o: Spindle, offs: number[], i0 = 0, i1 = 1): P[][] {
  const { c0, c1, bend = 0, W, t0, t1 } = o;
  const base = o.base ?? defaultBase;
  const dx = c1[0] - c0[0], dy = c1[1] - c0[1];
  const len = Math.hypot(dx, dy);
  const ctrl: P = [(c0[0] + c1[0]) / 2 - (dy / len) * bend, (c0[1] + c1[1]) / 2 + (dx / len) * bend];
  const N = 22;
  const out: P[][] = offs.map(() => []);
  for (let i = Math.round(i0 * N); i <= Math.round(i1 * N); i++) {
    const t = t0 + ((t1 - t0) * i) / N;
    const u = 1 - t;
    const px = u * u * c0[0] + 2 * u * t * ctrl[0] + t * t * c1[0];
    const py = u * u * c0[1] + 2 * u * t * ctrl[1] + t * t * c1[1];
    const tx = 2 * u * (ctrl[0] - c0[0]) + 2 * t * (c1[0] - ctrl[0]);
    const ty = 2 * u * (ctrl[1] - c0[1]) + 2 * t * (c1[1] - ctrl[1]);
    const l = Math.hypot(tx, ty) || 1;
    const nx = -ty / l, ny = tx / l;
    const e = i / N;
    const k = Math.sqrt(Math.min(1, Math.min(e, 1 - e) / 0.2));
    const w = W * base(t) * k;
    offs.forEach((off, idx) => out[idx].push([px + nx * off * w, py + ny * off * w]));
  }
  return out;
}

const fmt = (pts: P[]) => pts.map(p => `${r1(p[0])},${r1(p[1])}`).join(' L');

function spindle(o: Spindle): string {
  const [A, B] = trace(o, [o.a, o.b]);
  return 'M' + fmt([...A, ...B.reverse()]) + ' Z';
}

function fibers(o: Spindle): string {
  const ks = [0.28, 0.5, 0.72];
  return trace(o, ks.map(k => o.a + (o.b - o.a) * k), 0.14, 0.86).map(l => 'M' + fmt(l)).join(' ');
}

const S = (id: MuscleId | null, d: string, layer: Layer = 'sup', line = false): Shape => ({ id, d, layer, line });
const sp = (id: MuscleId, o: Spindle, layer: Layer = 'sup'): Shape[] => [S(id, spindle(o), layer), S(null, fibers(o), layer, true)];

/* ---------- limb geometry (left half of the figure, spine/midline at x = 120) ---------- */
const UA = { c0: [60, 132] as P, c1: [41, 208] as P, bend: 2, W: 11.5 };
const FA = { c0: [40, 210] as P, c1: [22, 298] as P, bend: 1, W: 10.5, base: (t: number) => 1 - 0.58 * t };
const TH = { c0: [95, 292] as P, c1: [91, 406] as P, W: 22, base: (t: number) => 0.8 + 0.2 * Math.sin(Math.PI * (t * 0.9 + 0.05)) };
const BT = { c0: [97, 318] as P, c1: [92, 404] as P, W: 20, base: (t: number) => 0.82 + 0.18 * Math.sin(Math.PI * t) };
const CF = { c0: [92, 414] as P, c1: [94, 516] as P, W: 16, base: (t: number) => 0.34 + 0.66 * Math.exp(-(((t - 0.2) / 0.3) ** 2)) };

export const SILHOUETTE_HALF =
  'M110,64 L112,84 Q100,88 74,92 Q56,92 46,98 Q38,116 35,150 Q34,180 32,206 Q28,222 28,230 Q22,262 17,298 ' +
  'Q14,312 12,336 Q14,344 22,344 Q30,340 30,312 Q27,300 28,298 Q36,262 50,224 Q52,212 52,206 Q56,176 62,148 ' +
  'L66,140 Q74,180 80,224 Q82,250 80,264 Q76,282 74,292 Q70,320 74,362 Q76,392 80,410 Q76,440 77,462 Q80,496 86,518 ' +
  'Q78,532 78,546 L106,546 Q104,530 102,516 Q106,480 106,450 Q106,430 105,410 Q108,370 112,330 Q116,312 120,300 L120,64 Z';

export const HEAD = { cx: 120, cy: 38, rx: 21, ry: 27 };

/* ------------------------------------ FRONT ------------------------------------ */
export const FRONT: Shape[] = [
  // contexto (não interativo)
  S(null, 'M103,60 L108,58 L121,90 L113,95 Z'),
  S(null, 'M68,146 L82,150 L84,159 L75,163 L85,171 L77,177 L86,184 L79,190 L71,176 Z'),
  S(null, 'M80,184 Q92,176 103,186 L101,252 Q90,262 81,256 Q76,220 80,184 Z'),
  S(null, spindle({ c0: [78, 284], c1: [104, 408], bend: 5, W: 3.2, a: -1, b: 1, t0: 0, t1: 1, base: () => 1 })),
  S(null, spindle({ ...TH, a: -1.0, b: -0.35, t0: 0.02, t1: 0.58 })),
  S(null, spindle({ c0: [88, 420], c1: [88, 516], W: 7, a: -1, b: 1, t0: 0, t1: 0.96, base: (t: number) => 0.5 + 0.5 * Math.sin(Math.PI * Math.min(1, t * 2.2 + 0.1)) })),
  S(null, 'M85,404 Q92,397 99,404 Q101,416 92,421 Q84,417 85,404 Z'),

  // camada profunda
  ...sp('vastus_int', { ...TH, a: -0.85, b: 0.85, t0: 0.1, t1: 0.9 }, 'deep'),
  ...sp('brachialis', { ...UA, a: -0.85, b: 0.95, t0: 0.3, t1: 0.99 }, 'deep'),

  // quadríceps
  ...sp('vastus_lat', { ...TH, a: 0.2, b: 1.0, t0: 0.08, t1: 0.97 }),
  ...sp('vastus_med', { ...TH, a: -1.0, b: -0.3, t0: 0.45, t1: 0.99 }),
  ...sp('rectus_femoris', { ...TH, a: -0.38, b: 0.38, t0: 0.02, t1: 0.82 }),

  // tronco
  S('rectus_abdominis', 'M104,174 L120,172 L120,262 L106,264 Q101,220 104,174 Z'),
  S(null, 'M105,198 L120,198 M105,224 L120,224 M106,246 L120,246', 'sup', true),
  S('pec_abd', 'M118,154 Q86,148 68,138 Q74,152 90,164 Q106,172 118,174 Z'),
  S(null, 'M116,160 Q96,158 74,146 M116,168 Q98,166 82,157', 'sup', true),
  S('pec_stern', 'M118,122 Q96,124 72,120 Q66,130 68,138 Q86,148 118,154 Z'),
  S(null, 'M116,130 Q94,128 70,126 M116,141 Q92,139 70,134', 'sup', true),
  S('pec_clav', 'M118,100 L74,102 Q70,112 72,120 Q96,124 118,122 Z'),
  S(null, 'M116,105 Q96,105 76,107 M116,113 Q96,115 74,115', 'sup', true),
  S(null, 'M119,96 Q96,92 72,100', 'sup', true),

  // ombro
  S('delt_ant', 'M80,100 Q72,96 62,96 Q54,122 49,153 L54,154 Q64,138 72,118 Q76,108 80,100 Z'),
  S('delt_lat', 'M62,96 Q52,92 44,102 Q38,114 40,132 Q42,144 46,152 L49,153 Q54,122 62,96 Z'),

  // braço
  ...sp('brachialis', { ...UA, a: 0.78, b: 1.22, t0: 0.42, t1: 0.97 }),
  ...sp('biceps_long', { ...UA, a: 0.04, b: 1.0, t0: 0.05, t1: 0.96 }),
  ...sp('biceps_short', { ...UA, a: -1.0, b: 0.04, t0: 0.05, t1: 0.96 }),

  // antebraço
  ...sp('forearm_flexors', { ...FA, a: -1.0, b: 0.15, t0: 0.04, t1: 0.96 }),
  ...sp('brachioradialis', { ...FA, a: 0.2, b: 1.05, t0: 0.0, t1: 0.52 }),
];

/* ------------------------------------ BACK ------------------------------------- */
export const BACK: Shape[] = [
  // contexto
  S(null, 'M110,160 Q118,200 118,258 L121,258 L121,160 Z'),
  S(null, spindle({ c0: [93, 506], c1: [94, 524], W: 2.6, a: -1, b: 1, t0: 0, t1: 1, base: () => 1 })),

  // camada profunda
  S('rhomboids', 'M118,106 L98,114 L96,150 L118,141 Z', 'deep'),
  S('supraspinatus', 'M100,106 Q88,102 76,104 Q84,112 98,114 Z', 'deep'),
  ...sp('triceps_med', { ...UA, a: -0.9, b: 0.9, t0: 0.18, t1: 0.97 }, 'deep'),
  ...sp('semimembranosus', { ...BT, a: -1.0, b: 0.25, t0: 0.08, t1: 0.95 }, 'deep'),
  ...sp('soleus', { ...CF, a: -0.95, b: 0.95, t0: 0.22, t1: 0.9 }, 'deep'),

  // dorso
  S('lats', 'M92,160 Q78,166 64,160 Q72,186 78,212 Q80,240 84,262 L121,262 L121,214 Q116,206 108,184 Z'),
  S(null, 'M118,236 Q96,214 70,176 M118,254 Q94,230 76,198 M110,260 Q92,246 80,228', 'sup', true),
  S('teres_major', 'M94,148 L74,140 Q62,148 62,158 Q78,166 92,162 Z'),
  S('infraspinatus', 'M97,120 L79,110 Q71,124 75,138 L96,146 Z'),
  S('trap_lower', 'M121,142 Q104,134 86,130 Q96,160 108,184 Q116,206 121,214 Z'),
  S(null, 'M120,152 L98,138 M120,176 L103,152 M120,198 L109,176', 'sup', true),
  S('trap_mid', 'M121,100 L104,108 L88,113 L86,128 Q104,132 121,142 Z'),
  S(null, 'M120,112 L92,117 M120,124 L90,125', 'sup', true),
  S('trap_upper', 'M121,64 Q112,72 106,78 Q90,88 72,97 Q88,108 104,108 Q114,102 121,100 Z'),
  S(null, 'M120,72 Q100,84 78,97 M119,88 Q102,98 88,104', 'sup', true),

  // ombro
  S('delt_post', 'M82,100 Q72,96 64,98 Q56,122 50,154 L56,154 Q66,140 74,120 Q78,108 82,100 Z'),
  S('delt_lat', 'M64,98 Q54,94 46,104 Q40,116 41,134 Q43,146 47,154 L50,154 Q56,122 64,98 Z'),

  // braço
  ...sp('triceps_med', { ...UA, a: -0.55, b: 0.55, t0: 0.58, t1: 0.97 }),
  ...sp('triceps_long', { ...UA, a: -1.0, b: 0.1, t0: 0.06, t1: 0.8 }),
  ...sp('triceps_lat', { ...UA, a: 0.1, b: 1.0, t0: 0.1, t1: 0.72 }),

  // antebraço
  ...sp('forearm_extensors', { ...FA, a: -1.0, b: 1.0, t0: 0.04, t1: 0.96 }),

  // quadril / glúteos
  S('glute_max', 'M121,254 Q100,248 85,264 Q77,284 85,308 Q100,326 121,320 Z'),
  S(null, 'M118,262 Q96,270 86,290 M118,290 Q100,296 90,308', 'sup', true),
  S('glute_med', 'M80,256 Q92,244 113,246 Q106,262 98,272 Q87,277 79,271 Q76,263 80,256 Z'),

  // coxa posterior
  ...sp('semimembranosus', { ...BT, a: -1.0, b: -0.62, t0: 0.5, t1: 0.96 }),
  ...sp('semitendinosus', { ...BT, a: -0.7, b: 0.08, t0: 0.05, t1: 0.9 }),
  ...sp('biceps_femoris', { ...BT, a: 0.02, b: 1.0, t0: 0.05, t1: 0.94 }),

  // panturrilha
  ...sp('soleus', { ...CF, a: 0.72, b: 1.2, t0: 0.34, t1: 0.86 }),
  ...sp('soleus', { ...CF, a: -1.2, b: -0.72, t0: 0.34, t1: 0.86 }),
  ...sp('gastrocnemius', { ...CF, a: -1.0, b: 0.0, t0: 0.02, t1: 0.62 }),
  ...sp('gastrocnemius', { ...CF, a: 0.0, b: 1.0, t0: 0.02, t1: 0.62 }),
];

export const SHAPES: Record<View, Shape[]> = { front: FRONT, back: BACK };

export function viewsFor(id: MuscleId): { view: View; layers: Layer[] }[] {
  const out: { view: View; layers: Layer[] }[] = [];
  for (const view of ['front', 'back'] as View[]) {
    const layers = [...new Set(SHAPES[view].filter(s => s.id === id).map(s => s.layer))];
    if (layers.length) out.push({ view, layers });
  }
  return out;
}
