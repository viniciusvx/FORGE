import React, { useMemo, useState } from 'react';
import type { AnatomyExercise } from '../anatomy/data';
import { MUSCLES } from '../anatomy/data';
import type { Layer, MuscleId, View } from '../anatomy/shapes';
import { SHAPES, viewsFor } from '../anatomy/shapes';
import AnatomyFigure, { PRIMARY_COLOR, SECONDARY_COLOR, type Level } from './AnatomyFigure';

interface Props { exercise: AnatomyExercise; }

function hasShape(view: View, layer: Layer, id: MuscleId) {
  return SHAPES[view].some(s => s.id === id && (layer === 'deep' || s.layer === 'sup'));
}

const seg = (on: boolean): React.CSSProperties => ({
  flex: 1, minHeight: 38, borderRadius: 8, fontSize: 13, fontWeight: 500,
  background: on ? 'rgba(200,169,110,0.18)' : 'transparent', color: on ? '#C8A96E' : 'rgba(239,237,231,0.6)',
});

export default function MuscleAnalysis({ exercise }: Props) {
  const ordered = useMemo(() => [...exercise.primary, ...exercise.secondary], [exercise]);
  const levels = useMemo(() => {
    const m: Partial<Record<MuscleId, Level>> = {};
    exercise.primary.forEach(id => { m[id] = 'primary'; });
    exercise.secondary.forEach(id => { m[id] = 'secondary'; });
    return m;
  }, [exercise]);

  const initialView: View = useMemo(() => {
    const count = (v: View) => exercise.primary.filter(id => hasShape(v, 'sup', id)).length * 3 + exercise.secondary.filter(id => hasShape(v, 'sup', id)).length;
    return count('back') > count('front') ? 'back' : 'front';
  }, [exercise]);

  const [view, setView] = useState<View>(initialView);
  const [layer, setLayer] = useState<Layer>('sup');
  const [zoom, setZoom] = useState(true);
  const [selected, setSelected] = useState<MuscleId | null>(exercise.primary[0] ?? null);

  const visible = ordered.filter(id => hasShape(view, layer, id));
  const numbers = useMemo(() => {
    const m: Partial<Record<MuscleId, number>> = {};
    ordered.forEach((id, i) => { m[id] = i + 1; });
    return Object.fromEntries(Object.entries(m).filter(([id]) => hasShape(view, layer, id as MuscleId))) as Partial<Record<MuscleId, number>>;
  }, [ordered, view, layer]);

  function goTo(id: MuscleId) {
    setSelected(id);
    if (hasShape(view, layer, id)) return;
    const opts = viewsFor(id);
    if (!opts.length) return;
    const sameView = opts.find(o => o.view === view) ?? opts[0];
    setView(sameView.view);
    setLayer(sameView.layers.includes('sup') ? 'sup' : 'deep');
  }

  const selInfo = selected ? MUSCLES[selected] : null;
  const selRole = selected ? (levels[selected] === 'primary' ? 'Maior ênfase neste exercício' : levels[selected] === 'secondary' ? 'Participa neste exercício' : 'Sem destaque neste exercício') : '';
  const hidden = ordered.filter(id => !visible.includes(id));

  if (exercise.pending) {
    return (
      <div className="card" style={{ background: 'rgba(200,169,110,0.07)', border: '1px solid rgba(200,169,110,0.25)' }}>
        <div className="label-xs" style={{ color: '#C8A96E', marginBottom: 6 }}>Variação a confirmar</div>
        <div style={{ fontSize: 14, lineHeight: 1.55 }}>{exercise.pending}</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <div style={{ flex: 1, display: 'flex', padding: 3, borderRadius: 10, background: 'rgba(255,255,255,0.06)' }}>
          <button style={seg(view === 'front')} onClick={() => setView('front')}>Frente</button>
          <button style={seg(view === 'back')} onClick={() => setView('back')}>Costas</button>
        </div>
        <div style={{ flex: 1, display: 'flex', padding: 3, borderRadius: 10, background: 'rgba(255,255,255,0.06)' }}>
          <button style={seg(layer === 'sup')} onClick={() => setLayer('sup')}>Superficial</button>
          <button style={seg(layer === 'deep')} onClick={() => setLayer('deep')}>Profunda</button>
        </div>
      </div>

      <div style={{
        position: 'sticky', top: 0, zIndex: 5, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 14px',
        padding: '8px 2px', background: 'rgba(22,22,28,0.96)', backdropFilter: 'blur(6px)', fontSize: 12,
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><i style={{ width: 12, height: 12, borderRadius: 3, background: PRIMARY_COLOR, display: 'inline-block' }} />Maior ênfase</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><i style={{ width: 12, height: 12, borderRadius: 3, background: SECONDARY_COLOR, display: 'inline-block' }} />Participa</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(239,237,231,0.55)' }}><i style={{ width: 12, height: 12, borderRadius: 3, background: '#272731', border: '1px solid #3a3a46', display: 'inline-block' }} />Sem destaque</span>
        <button className="chip" style={{ marginLeft: 'auto', minHeight: 28, fontSize: 12 }} onClick={() => setZoom(z => !z)}>{zoom ? 'Corpo inteiro' : 'Aproximar'}</button>
      </div>

      <div style={{ maxWidth: 360, margin: '4px auto 8px' }}>
        <AnatomyFigure view={view} layer={layer} levels={levels} numbers={numbers} selected={selected} onSelect={id => setSelected(id)} zoom={zoom} />
      </div>

      {hidden.length > 0 && (
        <div style={{ fontSize: 12, color: 'rgba(239,237,231,0.55)', marginBottom: 10, lineHeight: 1.5 }}>
          {hidden.map(id => MUSCLES[id].short).join(', ')} {hidden.length > 1 ? 'estão' : 'está'} em outra vista ou camada. Toque no nome abaixo para ir até {hidden.length > 1 ? 'eles' : 'ele'}.
        </div>
      )}

      <div style={{ marginBottom: 14 }}>
        {ordered.map((id, i) => {
          const lvl = levels[id];
          const on = selected === id;
          return (
            <button key={id} onClick={() => goTo(id)} className="row-btn" style={{ padding: '10px 0', gap: 10, background: on ? 'rgba(255,255,255,0.04)' : 'transparent' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <span style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, background: lvl === 'primary' ? PRIMARY_COLOR : SECONDARY_COLOR, color: '#0A0A0D' }}>{i + 1}</span>
                <span style={{ fontSize: 14 }}>{MUSCLES[id].name}</span>
              </span>
              <span style={{ fontSize: 11, color: lvl === 'primary' ? PRIMARY_COLOR : SECONDARY_COLOR, whiteSpace: 'nowrap' }}>{lvl === 'primary' ? 'principal' : 'participa'}</span>
            </button>
          );
        })}
      </div>

      {selInfo && (
        <div className="card-raised" style={{ marginBottom: 14, padding: 14 }}>
          <div className="label-xs" style={{ marginBottom: 4 }}>{selInfo.region}</div>
          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>{selInfo.name}</div>
          <div style={{ fontSize: 13, lineHeight: 1.55, color: 'rgba(239,237,231,0.8)', marginBottom: 8 }}>{selInfo.func}</div>
          <div style={{ fontSize: 12, color: levels[selected!] === 'primary' ? PRIMARY_COLOR : levels[selected!] === 'secondary' ? SECONDARY_COLOR : 'rgba(239,237,231,0.5)' }}>{selRole}</div>
        </div>
      )}

      {exercise.broad && (
        <div className="card" style={{ marginBottom: 12, background: 'rgba(200,169,110,0.07)', border: '1px solid rgba(200,169,110,0.25)', fontSize: 13, lineHeight: 1.55 }}>
          <span className="label-xs" style={{ color: '#C8A96E', display: 'block', marginBottom: 4 }}>Mapeamento amplo</span>
          {exercise.broad}
        </div>
      )}

      {[
        { t: 'Por que trabalha esses músculos', x: exercise.summary },
        { t: 'Execução e posição', x: exercise.execution },
        { t: 'Observação técnica', x: exercise.note },
      ].map(b => (
        <div key={b.t} style={{ marginBottom: 14 }}>
          <div className="label-xs" style={{ marginBottom: 4 }}>{b.t}</div>
          <div style={{ fontSize: 14, lineHeight: 1.55 }}>{b.x}</div>
        </div>
      ))}

      <div style={{ fontSize: 11, color: 'rgba(239,237,231,0.4)', lineHeight: 1.5 }}>
        Ênfase relativa: nenhum exercício isola completamente um músculo ou cabeça muscular, e o estímulo varia com anatomia, amplitude, técnica e equipamento. Ilustração esquemática.
      </div>
    </div>
  );
}
