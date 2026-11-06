import React, { useState } from 'react';
import type { View, MuscleGroup } from '../types';
import { MUSCLE_LABELS, EQUIPMENT_LABELS } from '../types';
import { getExercises } from '../store';
import { PlusIcon, SearchIcon, ChevronRightIcon } from '../components/Icons';

interface Props { onNavigate: (v: View) => void; }

export default function Exercises({ onNavigate }: Props) {
  const [query, setQuery] = useState('');
  const [filterMuscle, setFilterMuscle] = useState<MuscleGroup | 'all'>('all');

  const all = getExercises();
  const filtered = all.filter(ex => {
    const matchQuery = !query || ex.name.toLowerCase().includes(query.toLowerCase());
    const matchMuscle = filterMuscle === 'all' || ex.muscleGroup === filterMuscle;
    return matchQuery && matchMuscle;
  }).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

  const usedMuscles = [...new Set(all.map(e => e.muscleGroup))];

  return (
    <div className="page animate-fade-in">
      <div className="page-inner">
        <div className="page-header">
          <div style={{ flex: 1 }}>
            <div className="label-xs" style={{ marginBottom: 4 }}>Biblioteca</div>
            <h1 className="page-title">Exercícios</h1>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate({ screen: 'exercise-new' })}>
            <PlusIcon size={16} />
            Novo
          </button>
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ position: 'relative' }}>
            <SearchIcon size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#525259' } as React.CSSProperties} />
            <input
              className="field"
              style={{ paddingLeft: 38 }}
              placeholder="Buscar exercício..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </div>

        {usedMuscles.length > 0 && (
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 12, marginBottom: 4 }}>
            <button
              className={`badge ${filterMuscle === 'all' ? 'badge-amber' : 'badge-muted'}`}
              style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
              onClick={() => setFilterMuscle('all')}
            >
              Todos
            </button>
            {usedMuscles.map(m => (
              <button
                key={m}
                className={`badge ${filterMuscle === m ? 'badge-amber' : 'badge-muted'}`}
                style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => setFilterMuscle(m)}
              >
                {MUSCLE_LABELS[m]}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#525259' }}>
            {all.length === 0 ? (
              <>
                <div style={{ fontSize: 15, marginBottom: 8 }}>Nenhum exercício cadastrado</div>
                <div style={{ fontSize: 13, marginBottom: 20 }}>Adicione exercícios para montar suas fichas.</div>
                <button className="btn btn-primary" onClick={() => onNavigate({ screen: 'exercise-new' })}>
                  <PlusIcon size={16} />
                  Adicionar exercício
                </button>
              </>
            ) : (
              <div style={{ fontSize: 14 }}>Nenhum resultado</div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {filtered.map(ex => (
              <button
                key={ex.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  textAlign: 'left',
                  width: '100%',
                }}
                onClick={() => onNavigate({ screen: 'exercise-detail', exerciseId: ex.id })}
              >
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{ex.name}</div>
                  <div style={{ fontSize: 12, color: '#525259', marginTop: 2 }}>
                    {MUSCLE_LABELS[ex.muscleGroup]} · {EQUIPMENT_LABELS[ex.equipment]}
                  </div>
                </div>
                <ChevronRightIcon size={18} style={{ color: '#525259', flexShrink: 0 } as React.CSSProperties} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
