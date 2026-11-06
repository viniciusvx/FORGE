import React, { useState } from 'react';
import type { Exercise } from '../types';
import { ANATOMY_EXERCISES, resolveAnatomy } from '../anatomy/data';
import { getExercise, saveExercise } from '../store';
import MuscleAnalysis from './MuscleAnalysis';
import Sheet from './Sheet';

export function ExerciseAnatomy({ exerciseId }: { exerciseId: string }) {
  const [, force] = useState(0);
  const ex = getExercise(exerciseId);
  if (!ex) return null;
  const a = resolveAnatomy(ex);

  function link(key: string) {
    saveExercise({ ...(ex as Exercise), mapKey: key || undefined });
    force(n => n + 1);
  }

  return (
    <div>
      {a ? (
        <MuscleAnalysis key={a.key} exercise={a} />
      ) : (
        <div className="card" style={{ marginBottom: 14, fontSize: 14, lineHeight: 1.55 }}>
          Este exercício ainda não tem análise muscular. Vincule-o abaixo a um dos exercícios mapeados (só se for o mesmo movimento).
        </div>
      )}
      <div style={{ marginTop: 18 }}>
        <label className="label-xs" style={{ display: 'block', marginBottom: 6 }}>Análise vinculada</label>
        <select className="field" value={ex.mapKey ?? ''} onChange={e => link(e.target.value)}>
          <option value="">{a && !ex.mapKey ? `Automática (${a.name})` : 'Automática (pelo nome)'}</option>
          {ANATOMY_EXERCISES.map(e => <option key={e.key} value={e.key}>{e.name}</option>)}
        </select>
      </div>
    </div>
  );
}

export function MuscleSheet({ exerciseId, onClose }: { exerciseId: string; onClose: () => void }) {
  const ex = getExercise(exerciseId);
  return (
    <Sheet title={ex ? `Músculos · ${ex.name}` : 'Músculos'} onClose={onClose}>
      <div style={{ padding: '0 20px 20px' }}>
        <ExerciseAnatomy exerciseId={exerciseId} />
      </div>
    </Sheet>
  );
}
