import React, { useMemo } from 'react';
import type { Layer, MuscleId, Shape, View } from '../anatomy/shapes';
import { HEAD, SHAPES, SILHOUETTE_HALF } from '../anatomy/shapes';

export const PRIMARY_COLOR = '#E3B25B';
export const SECONDARY_COLOR = '#5E9BC4';

export type Level = 'primary' | 'secondary';

interface Props {
  view: View;
  layer: Layer;
  levels?: Partial<Record<MuscleId, Level>>;
  heat?: Partial<Record<MuscleId, number>>;
  numbers?: Partial<Record<MuscleId, number>>;
  selected?: MuscleId | null;
  onSelect?: (id: MuscleId) => void;
  zoom?: boolean;
}

function pointsOf(d: string): [number, number][] {
  const n = d.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  const out: [number, number][] = [];
  for (let i = 0; i + 1 < n.length; i += 2) out.push([n[i], n[i + 1]]);
  return out;
}

function visible(shapes: Shape[], layer: Layer): Shape[] {
  return shapes.filter(s => (layer === 'deep' ? true : s.layer === 'sup'));
}

export function shapesFor(view: View, layer: Layer, id: MuscleId): Shape[] {
  const all = SHAPES[view].filter(s => s.id === id);
  if (layer === 'sup') return all.filter(s => s.layer === 'sup');
  const deep = all.filter(s => s.layer === 'deep');
  return deep.length ? deep : all;
}

export default function AnatomyFigure({ view, layer, levels = {}, heat, numbers, selected, onSelect, zoom = true }: Props) {
  const shapes = SHAPES[view];
  const active = useMemo(() => new Set<MuscleId>([...Object.keys(levels), ...Object.keys(heat ?? {})] as MuscleId[]), [levels, heat]);

  const box = useMemo(() => {
    if (!zoom || active.size === 0) return { y0: 0, h: 560 };
    let minY = 560, maxY = 0;
    for (const id of active) {
      for (const s of shapesFor(view, layer, id)) {
        for (const [, y] of pointsOf(s.d)) { minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
      }
    }
    if (minY > maxY) return { y0: 0, h: 560 };
    let y0 = Math.max(0, minY - 34), y1 = Math.min(560, maxY + 34);
    if (y1 - y0 < 230) { const c = (y0 + y1) / 2; y0 = Math.max(0, c - 115); y1 = Math.min(560, y0 + 230); y0 = Math.max(0, y1 - 230); }
    return { y0, h: y1 - y0 };
  }, [view, layer, active, zoom]);

  const markers = useMemo(() => {
    if (!numbers) return [];
    const list = (Object.keys(numbers) as MuscleId[]).flatMap(id => {
      const pts = shapesFor(view, layer, id).flatMap(s => pointsOf(s.d));
      if (!pts.length) return [];
      const x = pts.reduce((a, p) => a + p[0], 0) / pts.length;
      const y = pts.reduce((a, p) => a + p[1], 0) / pts.length;
      return [{ id, n: numbers[id]!, x, y }];
    });
    for (let k = 0; k < 40; k++) {
      for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
        const dx = list[j].x - list[i].x, dy = list[j].y - list[i].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 17) {
          const ux = dist < 0.01 ? 1 : dx / dist, uy = dist < 0.01 ? 0 : dy / dist;
          const push = (17 - dist) / 2;
          list[i].x -= ux * push; list[i].y -= uy * push;
          list[j].x += ux * push; list[j].y += uy * push;
        }
      }
    }
    return list;
  }, [numbers, view, layer]);

  const heatColor = (v: number) => `rgba(227,178,91,${(0.22 + 0.78 * v).toFixed(2)})`;

  function paths(half: 'L' | 'R') {
    return visible(shapes, layer).map((s, i) => {
      if (s.line) {
        return <path key={`${half}${i}`} d={s.d} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={0.8} strokeLinecap="round" />;
      }
      const ghost = layer === 'deep' && s.layer === 'sup';
      const level = s.id ? levels[s.id] : undefined;
      const h = s.id && heat ? heat[s.id] : undefined;
      let fill = s.id ? (s.layer === 'deep' ? '#33333f' : '#272731') : '#1c1c23';
      if (level) fill = level === 'primary' ? PRIMARY_COLOR : SECONDARY_COLOR;
      else if (h !== undefined) fill = heatColor(h);
      const isSel = !!s.id && s.id === selected;
      return (
        <path
          key={`${half}${i}`} d={s.d} fill={fill}
          fillOpacity={ghost ? (level || h !== undefined ? 0.32 : 0.1) : 1}
          stroke={isSel ? '#ffffff' : ghost ? 'rgba(255,255,255,0.16)' : '#0A0A0D'}
          strokeWidth={isSel ? 1.8 : ghost ? 0.7 : 0.9}
          strokeLinejoin="round"
          style={{ cursor: s.id && onSelect ? 'pointer' : 'default' }}
          onClick={s.id && onSelect ? () => onSelect(s.id!) : undefined}
        />
      );
    });
  }

  return (
    <svg viewBox={`0 ${box.y0} 240 ${box.h}`} style={{ width: '100%', display: 'block', touchAction: 'manipulation' }} role="img" aria-label={view === 'front' ? 'Vista frontal' : 'Vista posterior'}>
      <g>
        <path d={SILHOUETTE_HALF} fill="#15151a" stroke="#2c2c36" strokeWidth={1} />
        <g transform="translate(240 0) scale(-1 1)"><path d={SILHOUETTE_HALF} fill="#15151a" stroke="#2c2c36" strokeWidth={1} /></g>
        <ellipse cx={HEAD.cx} cy={HEAD.cy} rx={HEAD.rx} ry={HEAD.ry} fill="#15151a" stroke="#2c2c36" strokeWidth={1} />
      </g>
      <g>{paths('L')}</g>
      <g transform="translate(240 0) scale(-1 1)">{paths('R')}</g>
      {markers.map(m => (
        <g key={m.id} style={{ pointerEvents: 'none' }}>
          <circle cx={m.x} cy={m.y} r={7.2} fill="#0A0A0D" stroke="#fff" strokeWidth={0.9} />
          <text x={m.x} y={m.y + 3.2} textAnchor="middle" fontSize={9} fontWeight={600} fill="#fff" fontFamily="Inter, sans-serif">{m.n}</text>
        </g>
      ))}
    </svg>
  );
}
