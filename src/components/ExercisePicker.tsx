import React, { useState } from 'react';
import type { Exercise, MuscleGroup } from '../types';
import { MUSCLE_LABELS } from '../types';
import { getExercises, saveExercise, addStarterExercises, addRoutineExercises, uid } from '../store';
import { PlusIcon, CheckIcon, SearchIcon } from './Icons';
import Sheet from './Sheet';

interface Props {
  onAdd: (exerciseId: string) => void;
  onClose: () => void;
}

const MUSCLES = Object.entries(MUSCLE_LABELS) as [MuscleGroup, string][];

export default function ExercisePicker({ onAdd, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [muscle, setMuscle] = useState<MuscleGroup | 'all'>('all');
  const [version, setVersion] = useState(0);
  const [added, setAdded] = useState<Record<string, number>>({});
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newMuscle, setNewMuscle] = useState<MuscleGroup>('chest');

  void version;
  const all = getExercises();
  const q = query.trim().toLowerCase();
  const list = all
    .filter(e => (!q || e.name.toLowerCase().includes(q)) && (muscle === 'all' || e.muscleGroup === muscle))
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  const usedMuscles = [...new Set(all.map(e => e.muscleGroup))];
  const total = Object.values(added).reduce((a, b) => a + b, 0);

  function pick(id: string) {
    onAdd(id);
    setAdded(a => ({ ...a, [id]: (a[id] ?? 0) + 1 }));
  }

  function createExercise(name: string, group: MuscleGroup) {
    const ex: Exercise = {
      id: uid(), name: name.trim(), muscleGroup: group, secondaryMuscles: [],
      equipment: 'other', notes: '', createdAt: Date.now(),
    };
    saveExercise(ex);
    setVersion(v => v + 1);
    setCreating(false);
    setNewName('');
    setQuery('');
    pick(ex.id);
  }

  function loadStarter() {
    addStarterExercises();
    setVersion(v => v + 1);
  }

  if (creating) {
    return (
      <Sheet
        title="Novo exercício"
        onClose={() => setCreating(false)}
        footer={
          <button className="btn btn-primary btn-full" disabled={!newName.trim()} onClick={() => createExercise(newName, newMuscle)}>
            Criar e adicionar
          </button>
        }
      >
        <div style={{ padding: '4px 20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label-xs" style={{ display: 'block', marginBottom: 6 }}>Nome</label>
            <input className="field" autoFocus placeholder="Ex: Supino reto com barra" value={newName} onChange={e => setNewName(e.target.value)} />
          </div>
          <div>
            <label className="label-xs" style={{ display: 'block', marginBottom: 8 }}>Grupo muscular</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {MUSCLES.filter(([m]) => m !== 'other').map(([value, label]) => (
                <button key={value} className={`chip ${newMuscle === value ? 'on' : ''}`} onClick={() => setNewMuscle(value)}>{label}</button>
              ))}
            </div>
          </div>
        </div>
      </Sheet>
    );
  }

  return (
    <Sheet
      title="Adicionar exercício"
      onClose={onClose}
      footer={
        <button className="btn btn-primary btn-full" onClick={onClose}>
          {total > 0 ? `Concluir (${total} adicionado${total > 1 ? 's' : ''})` : 'Fechar'}
        </button>
      }
    >
      <div style={{ padding: '0 20px 8px' }}>
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <SearchIcon size={16} style={{ position: 'absolute', left: 14, top: 15, color: '#525259' }} />
          <input className="field" style={{ paddingLeft: 40 }} placeholder="Buscar exercício..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>

        {usedMuscles.length > 1 && (
          <div className="chips">
            <button className={`chip ${muscle === 'all' ? 'on' : ''}`} onClick={() => setMuscle('all')}>Todos</button>
            {usedMuscles.map(m => (
              <button key={m} className={`chip ${muscle === m ? 'on' : ''}`} onClick={() => setMuscle(m)}>{MUSCLE_LABELS[m]}</button>
            ))}
          </div>
        )}

        <button className="btn btn-outline btn-full" style={{ marginBottom: 8 }} onClick={() => { setNewName(query.trim()); setCreating(true); }}>
          <PlusIcon size={16} />
          {query.trim() ? `Criar "${query.trim()}"` : 'Criar novo exercício'}
        </button>

        {all.length === 0 && (
          <div className="card" style={{ marginTop: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 14, marginBottom: 4 }}>Sua biblioteca está vazia</div>
            <div style={{ fontSize: 12, color: '#6b6b73', marginBottom: 12 }}>Crie os seus ou carregue uma lista básica de exercícios comuns (você pode editar e apagar depois).</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button className="btn btn-outline btn-sm" onClick={() => { addRoutineExercises(); setVersion(v => v + 1); }}>Carregar exercícios da minha rotina</button>
              <button className="btn btn-ghost btn-sm" onClick={loadStarter}>Carregar exercícios básicos</button>
            </div>
          </div>
        )}

        {list.map(ex => (
          <button key={ex.id} className="row-btn" onClick={() => pick(ex.id)}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 15 }}>{ex.name}</div>
              <div style={{ fontSize: 12, color: '#6b6b73', marginTop: 2 }}>{MUSCLE_LABELS[ex.muscleGroup]}</div>
            </div>
            {added[ex.id] ? (
              <span className="badge badge-success" style={{ gap: 4 }}><CheckIcon size={12} />{added[ex.id]}</span>
            ) : (
              <PlusIcon size={18} style={{ color: '#C8A96E' }} />
            )}
          </button>
        ))}

        {all.length > 0 && all.length < 15 && (
          <button className="btn btn-ghost btn-sm btn-full" style={{ marginTop: 12 }} onClick={loadStarter}>
            Carregar exercícios básicos (lista pronta)
          </button>
        )}

        {all.length > 0 && (
          <button className="btn btn-ghost btn-sm btn-full" style={{ marginTop: 8 }} onClick={() => { addRoutineExercises(); setVersion(v => v + 1); }}>
            Adicionar exercícios da minha rotina
          </button>
        )}

        {all.length > 0 && list.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#6b6b73', fontSize: 14 }}>Nenhum resultado. Toque em "Criar" acima.</div>
        )}
      </div>
    </Sheet>
  );
}
