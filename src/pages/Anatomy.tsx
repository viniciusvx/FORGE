import React, { useState } from 'react';
import type { View as AppView } from '../types';
import { MUSCLE_LABELS } from '../types';
import { ANATOMY_EXERCISES, getAnatomy } from '../anatomy/data';
import MuscleAnalysis from '../components/MuscleAnalysis';

interface Props { exerciseKey?: string; onNavigate: (v: AppView) => void; }

export default function Anatomy({ exerciseKey }: Props) {
  const [key, setKey] = useState(exerciseKey ?? ANATOMY_EXERCISES[0].key);
  const ex = getAnatomy(key) ?? ANATOMY_EXERCISES[0];
  const groups = [...new Set(ANATOMY_EXERCISES.map(e => e.group))];

  return (
    <div className="page animate-fade-in">
      <div className="page-header">
        <div>
          <div className="label-xs" style={{ marginBottom: 4 }}>Anatomia</div>
          <h1 className="page-title">Análise muscular</h1>
        </div>
      </div>
      <div className="page-inner">
        <select className="field" style={{ marginBottom: 16 }} value={key} onChange={e => setKey(e.target.value)}>
          {groups.map(g => (
            <optgroup key={g} label={MUSCLE_LABELS[g]}>
              {ANATOMY_EXERCISES.filter(e => e.group === g).map(e => <option key={e.key} value={e.key}>{e.name}</option>)}
            </optgroup>
          ))}
        </select>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 300, marginBottom: 12 }}>{ex.name}</h2>
        <MuscleAnalysis key={ex.key} exercise={ex} />
      </div>
    </div>
  );
}
