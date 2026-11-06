import React from 'react';
import type { MuscleGroup } from '../types';

interface Props {
  sets: Partial<Record<MuscleGroup, number>>;
}

type Shape = { m: MuscleGroup; el: 'rect' | 'ellipse'; a: number[]; r?: number };

const FRONT: Shape[] = [
  { m: 'traps', el: 'rect', a: [84, 36, 32, 10], r: 5 },
  { m: 'shoulders', el: 'ellipse', a: [68, 56, 12, 11] },
  { m: 'shoulders', el: 'ellipse', a: [132, 56, 12, 11] },
  { m: 'chest', el: 'rect', a: [76, 50, 23, 24], r: 8 },
  { m: 'chest', el: 'rect', a: [101, 50, 23, 24], r: 8 },
  { m: 'abs', el: 'rect', a: [84, 78, 32, 46], r: 9 },
  { m: 'biceps', el: 'rect', a: [52, 68, 14, 32], r: 7 },
  { m: 'biceps', el: 'rect', a: [134, 68, 14, 32], r: 7 },
  { m: 'forearms', el: 'rect', a: [47, 104, 13, 38], r: 6 },
  { m: 'forearms', el: 'rect', a: [140, 104, 13, 38], r: 6 },
  { m: 'quads', el: 'rect', a: [75, 130, 24, 60], r: 11 },
  { m: 'quads', el: 'rect', a: [101, 130, 24, 60], r: 11 },
  { m: 'calves', el: 'rect', a: [77, 196, 19, 40], r: 9 },
  { m: 'calves', el: 'rect', a: [104, 196, 19, 40], r: 9 },
];

const BACK: Shape[] = [
  { m: 'traps', el: 'rect', a: [80, 34, 40, 20], r: 8 },
  { m: 'shoulders', el: 'ellipse', a: [68, 58, 12, 11] },
  { m: 'shoulders', el: 'ellipse', a: [132, 58, 12, 11] },
  { m: 'back', el: 'rect', a: [76, 58, 48, 50], r: 12 },
  { m: 'triceps', el: 'rect', a: [52, 68, 14, 32], r: 7 },
  { m: 'triceps', el: 'rect', a: [134, 68, 14, 32], r: 7 },
  { m: 'forearms', el: 'rect', a: [47, 104, 13, 38], r: 6 },
  { m: 'forearms', el: 'rect', a: [140, 104, 13, 38], r: 6 },
  { m: 'glutes', el: 'rect', a: [76, 112, 24, 24], r: 11 },
  { m: 'glutes', el: 'rect', a: [100, 112, 24, 24], r: 11 },
  { m: 'hamstrings', el: 'rect', a: [75, 140, 24, 52], r: 11 },
  { m: 'hamstrings', el: 'rect', a: [101, 140, 24, 52], r: 11 },
  { m: 'calves', el: 'rect', a: [77, 196, 19, 40], r: 9 },
  { m: 'calves', el: 'rect', a: [104, 196, 19, 40], r: 9 },
];

function Figure({ shapes, sets, max }: { shapes: Shape[]; sets: Props['sets']; max: number }) {
  return (
    <svg viewBox="0 0 200 244" style={{ width: '100%', height: 'auto' }}>
      <circle cx={100} cy={18} r={13} fill="rgba(255,255,255,0.05)" />
      <rect x={90} y={30} width={20} height={8} rx={3} fill="rgba(255,255,255,0.04)" />
      <rect x={72} y={46} width={56} height={84} rx={16} fill="rgba(255,255,255,0.03)" />
      {shapes.map((s, i) => {
        const v = sets[s.m] ?? 0;
        const fill = v > 0 ? `rgba(200,169,110,${0.25 + 0.75 * (v / max)})` : 'rgba(255,255,255,0.07)';
        return s.el === 'rect'
          ? <rect key={i} x={s.a[0]} y={s.a[1]} width={s.a[2]} height={s.a[3]} rx={s.r} fill={fill} />
          : <ellipse key={i} cx={s.a[0]} cy={s.a[1]} rx={s.a[2]} ry={s.a[3]} fill={fill} />;
      })}
    </svg>
  );
}

export default function MuscleMap({ sets }: Props) {
  const max = Math.max(1, ...Object.values(sets).map(v => v ?? 0));
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div>
          <Figure shapes={FRONT} sets={sets} max={max} />
          <div className="label-xs" style={{ textAlign: 'center' }}>Frente</div>
        </div>
        <div>
          <Figure shapes={BACK} sets={sets} max={max} />
          <div className="label-xs" style={{ textAlign: 'center' }}>Costas</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginTop: 10 }}>
        <span style={{ fontSize: 11, color: '#6b6b73' }}>menos</span>
        <div style={{ width: 90, height: 6, borderRadius: 3, background: 'linear-gradient(90deg, rgba(200,169,110,0.25), rgba(200,169,110,1))' }} />
        <span style={{ fontSize: 11, color: '#6b6b73' }}>mais séries</span>
      </div>
    </div>
  );
}
