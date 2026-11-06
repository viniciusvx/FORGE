import React, { useState } from 'react';
import type { View, Exercise, MuscleGroup, Equipment } from '../types';
import { MUSCLE_LABELS, EQUIPMENT_LABELS } from '../types';
import { getExercise, saveExercise, deleteExercise, getExerciseRecords, getSessions, uid } from '../store';
import { ChevronLeftIcon, TrashIcon } from '../components/Icons';
import { ConfirmSheet } from '../components/Sheet';
import { ExerciseAnatomy } from '../components/ExerciseAnatomy';

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
      mapKey: existing?.mapKey,
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
        <div className="page-header" style={{ padding: 0, paddingTop: 'calc(env(safe-area-inset-top, 0px) + 24px)', paddingBottom: 18 }}>
          <button className="icon-btn" onClick={() => onNavigate({ screen: 'exercises' })} aria-label="Voltar">
            <ChevronLeftIcon size={22} />
          </button>
          <div style={{ flex: 1 }}>
            <div className="label-xs" style={{ marginBottom: 4 }}>{isNew ? 'Novo' : 'Editar'}</div>
            <h1 className="page-title">Exercício</h1>
          </div>
          {!isNew && (
            <button className="icon-btn" style={{ color: '#E05555' }} onClick={() => setConfirmDelete(true)} aria-label="Excluir">
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
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {MUSCLES.map(([value, label]) => (
                <button
                  key={value}
                  className={`chip ${muscleGroup === value ? 'on' : ''}`}
                  onClick={() => setMuscleGroup(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label-xs" style={{ display: 'block', marginBottom: 6 }}>Equipamento</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {EQUIPMENTS.map(([value, label]) => (
                <button
                  key={value}
                  className={`chip ${equipment === value ? 'on' : ''}`}
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
              style={{ resize: 'none' }}
              placeholder="Instruções, cuidados, variações..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          <button className="btn btn-primary btn-full" disabled={!name.trim()} onClick={save}>
            {isNew ? 'Criar exercício' : 'Salvar'}
          </button>
        </div>

        {existing && (
          <div style={{ marginTop: 28 }}>
            <div className="label-xs" style={{ marginBottom: 10 }}>Análise muscular</div>
            <ExerciseAnatomy exerciseId={existing.id} />
          </div>
        )}

        {existing && <ExerciseHistory exerciseId={existing.id} />}
      </div>

      {confirmDelete && (
        <ConfirmSheet title="Excluir exercício?" confirmLabel="Excluir"
          message="Fichas que usam este exercício perderão a referência. O histórico antigo é mantido."
          onConfirm={handleDelete} onCancel={() => setConfirmDelete(false)} />
      )}
    </div>
  );
}

function ExerciseHistory({ exerciseId }: { exerciseId: string }) {
  const rec = getExerciseRecords(exerciseId);
  const logs = getSessions().filter(s => s.finishedAt != null).flatMap(s =>
    s.exercises.filter(l => l.exerciseId === exerciseId && l.sets.some(x => x.done && !x.warmup)).map(l => ({ s, l }))
  ).slice(0, 6);
  if (logs.length === 0) return null;
  return (
    <div style={{ marginTop: 28 }}>
      <div className="label-xs" style={{ marginBottom: 10 }}>Seu histórico</div>
      <div className="card" style={{ display: 'flex', gap: 24, marginBottom: 10 }}>
        <div><div style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 300, color: '#C8A96E' }}>{rec.maxWeight}</div><div style={{ fontSize: 12, color: '#6b6b73' }}>recorde</div></div>
        <div><div style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 300, color: '#C8A96E' }}>{Math.round(rec.best1RM)}</div><div style={{ fontSize: 12, color: '#6b6b73' }}>1RM estimado</div></div>
      </div>
      {logs.map(({ s, l }) => (
        <div key={s.id} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="label-xs" style={{ marginBottom: 4 }}>{new Date(s.startedAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}</div>
          <div style={{ fontSize: 13 }}>{l.sets.filter(x => x.done && !x.warmup).map(x => `${x.weight}${x.unit}×${x.reps}`).join(' · ')}</div>
        </div>
      ))}
    </div>
  );
}
