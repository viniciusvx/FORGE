import React, { useState } from 'react';
import type { View, MuscleGroup } from '../types';
import { MUSCLE_LABELS, EQUIPMENT_LABELS } from '../types';
import { getExercises, addStarterExercises, addRoutineExercises } from '../store';
import { PlusIcon, SearchIcon, ChevronRightIcon } from '../components/Icons';

interface Props { onNavigate: (v: View) => void; }

export default function Exercises({ onNavigate }: Props) {
  const [query, setQuery] = useState('');
  const [filterMuscle, setFilterMuscle] = useState<MuscleGroup | 'all'>('all');
  const [, force] = useState(0);

  const all = getExercises();
  const filtered = all.filter(ex => {
    const matchQuery = !query || ex.name.toLowerCase().includes(query.toLowerCase());
    const matchMuscle = filterMuscle === 'all' || ex.muscleGroup === filterMuscle;
    return matchQuery && matchMuscle;
  }).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

  const usedMuscles = [...new Set(all.map(e => e.muscleGroup))];

  return (
    <div className="page animate-fade-in">
      <div className="page-header">
        <div style={{ flex: 1 }}>
          <div className="label-xs" style={{ marginBottom: 4 }}>Biblioteca</div>
          <h1 className="page-title">Exercícios</h1>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => onNavigate({ screen: 'exercise-new' })}>
          <PlusIcon size={16} />
          Novo
        </button>
      </div>
      <div className="page-inner">

        <div style={{ marginBottom: 12 }}>
          <div style={{ position: 'relative' }}>
            <SearchIcon size={16} style={{ position: 'absolute', left: 14, top: 15, color: '#525259' }} />
            <input
              className="field"
              style={{ paddingLeft: 40 }}
              placeholder="Buscar exercício..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </div>

        {all.length > 0 && (
          <button className="btn btn-ghost btn-sm btn-full" style={{ marginBottom: 12 }} onClick={() => { addRoutineExercises(); force(n => n + 1); }}>
            Adicionar exercícios da minha rotina
          </button>
        )}

        {usedMuscles.length > 0 && (
          <div className="chips">
            <button className={`chip ${filterMuscle === 'all' ? 'on' : ''}`} onClick={() => setFilterMuscle('all')}>Todos</button>
            {usedMuscles.map(m => (
              <button key={m} className={`chip ${filterMuscle === m ? 'on' : ''}`} onClick={() => setFilterMuscle(m)}>{MUSCLE_LABELS[m]}</button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#525259' }}>
            {all.length === 0 ? (
              <>
                <div style={{ fontSize: 15, marginBottom: 8 }}>Nenhum exercício cadastrado</div>
                <div style={{ fontSize: 13, marginBottom: 20 }}>Adicione exercícios para montar suas fichas.</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                  <button className="btn btn-primary" onClick={() => onNavigate({ screen: 'exercise-new' })}>
                    <PlusIcon size={16} />
                    Adicionar exercício
                  </button>
                  <button className="btn btn-outline" onClick={() => { addRoutineExercises(); force(n => n + 1); }}>
                    Carregar exercícios da minha rotina
                  </button>
                  <button className="btn btn-ghost" onClick={() => { addStarterExercises(); force(n => n + 1); }}>
                    Carregar exercícios básicos
                  </button>
                </div>
              </>
            ) : (
              <div style={{ fontSize: 14 }}>Nenhum resultado</div>
            )}
          </div>
        ) : (
          <div>
            {filtered.map(ex => (
              <button key={ex.id} className="row-btn" onClick={() => onNavigate({ screen: 'exercise-detail', exerciseId: ex.id })}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{ex.name}</div>
                  <div style={{ fontSize: 12, color: '#525259', marginTop: 2 }}>
                    {MUSCLE_LABELS[ex.muscleGroup]} · {EQUIPMENT_LABELS[ex.equipment]}
                  </div>
                </div>
                <ChevronRightIcon size={18} style={{ color: '#525259', flexShrink: 0 }} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
