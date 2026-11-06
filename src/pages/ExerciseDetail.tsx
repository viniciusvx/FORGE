import React, { useState } from 'react';
import type { View, Exercise, MuscleGroup, Equipment } from '../types';
import { MUSCLE_LABELS, EQUIPMENT_LABELS } from '../types';
import { getExercise, saveExercise, deleteExercise, uid } from '../store';
import { ChevronLeftIcon, TrashIcon } from '../components/Icons';

interface Props {
  exerciseId: string | null;
  onNavigate: (v: View) => void;
}

const MUSCLES = Object.entries(MUSCLE_LABELS) as [MuscleGroup, string][];
const EQUIPMENTS = Object.entries(EQUIPMENT_LABELS) as [Equipment, string][];

export default function ExerciseDetail({ exerciseId, onNavigate }: Props) {
  const existing = exerciseId ? getExercise(exerciseId) : undefined;
  const isNew = !exerciseId;

  const [name, setName] = useState(existing?.name ?? '');
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>(existing?.muscleGroup ?? 'other');
  const [equipment, setEquipment] = useState<Equipment>(existing?.equipment ?? 'other');
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [confirmDelete, setConfirmDelete] = useState(false);

  function save() {
    if (!name.trim()) return;
    const ex: Exercise = {
      id: existing?.id ?? uid(),
      name: name.trim(),
      muscleGroup,
      secondaryMuscles: existing?.secondaryMuscles ?? [],
      equipment,
      notes,
      createdAt: existing?.createdAt ?? Date.now(),
    };
    saveExercise(ex);
    onNavigate({ screen: 'exercises' });
  }

  function handleDelete() {
    if (!exerciseId) return;
    deleteExercise(exerciseId);
    onNavigate({ screen: 'exercises' });
  }

  return (
    <div className="page animate-fade-in">
      <div className="page-inner">
        <div className="page-header">
          <button onClick={() => onNavigate({ screen: 'exercises' })} style={{ color: '#525259', marginRight: 4 }}>
            <ChevronLeftIcon size={22} />
          </button>
          <div style={{ flex: 1 }}>
            <div className="label-xs" style={{ marginBottom: 4 }}>{isNew ? 'Novo' : 'Editar'}</div>
            <h1 className="page-title">Exercício</h1>
          </div>
          {!isNew && (
            <button style={{ color: '#E05555' }} onClick={() => setConfirmDelete(true)}>
              <TrashIcon size={20} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label-xs" style={{ display: 'block', marginBottom: 6 }}>Nome</label>
            <input className="field" placeholder="Ex: Supino Reto com Barra" value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div>
            <label className="label-xs" style={{ display: 'block', marginBottom: 6 }}>Grupo muscular</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {MUSCLES.map(([value, label]) => (
                <button
                  key={value}
                  className={`badge ${muscleGroup === value ? 'badge-amber' : 'badge-muted'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setMuscleGroup(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label-xs" style={{ display: 'block', marginBottom: 6 }}>Equipamento</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {EQUIPMENTS.map(([value, label]) => (
                <button
                  key={value}
                  className={`badge ${equipment === value ? 'badge-amber' : 'badge-muted'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setEquipment(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label-xs" style={{ display: 'block', marginBottom: 6 }}>Notas (opcional)</label>
            <textarea
              className="field"
              style={{ resize: 'none', height: 80 }}
              placeholder="Instruções, cuidados, variações..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          <button className="btn btn-primary btn-full" disabled={!name.trim()} onClick={save}>
            {isNew ? 'Criar exercício' : 'Salvar'}
          </button>
        </div>

        {confirmDelete && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-end', background: 'rgba(0,0,0,0.6)' }}>
            <div className="card-raised animate-slide-up" style={{ width: '100%', borderRadius: '14px 14px 0 0', padding: 24, paddingBottom: 'calc(24px + env(safe-area-inset-bottom))' }}>
              <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>Excluir exercício?</div>
              <div style={{ fontSize: 14, color: '#525259', marginBottom: 20 }}>Isso não pode ser desfeito. Fichas que usam este exercício perderão a referência.</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setConfirmDelete(false)}>Cancelar</button>
                <button className="btn btn-danger" style={{ flex: 1 }} onClick={handleDelete}>Excluir</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
