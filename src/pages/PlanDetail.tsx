import React, { useState, useEffect, useRef } from 'react';
import type { View, WorkoutPlan, PlanDay, PlannedExercise } from '../types';
import { MUSCLE_LABELS } from '../types';
import { getPlan, savePlan, deletePlan, getExercise, uid } from '../store';
import { ChevronLeftIcon, PlusIcon, TrashIcon, ChevronDownIcon, ChevronRightIcon, ArrowUpIcon, ArrowDownIcon, CopyIcon, PlayIcon } from '../components/Icons';
import ExercisePicker from '../components/ExercisePicker';
import { ConfirmSheet } from '../components/Sheet';

interface Props {
  planId: string | null;
  onNavigate: (v: View) => void;
}

const TECHNIQUES = [
  { value: 'normal', label: 'Normal' },
  { value: 'drop-set', label: 'Drop-set' },
  { value: 'rest-pause', label: 'Rest-pause' },
  { value: 'bi-set', label: 'Bi-set' },
] as const;

function emptyPlan(): WorkoutPlan {
  return { id: uid(), name: '', goal: '', days: [], createdAt: Date.now(), updatedAt: Date.now() };
}

function emptyExercise(exerciseId: string): PlannedExercise {
  return { id: uid(), exerciseId, sets: 3, repsMin: 8, repsMax: 12, restSeconds: 90, technique: 'normal', notes: '' };
}

interface ExerciseRowProps {
  pe: PlannedExercise;
  index: number;
  total: number;
  siblings: PlannedExercise[];
  onChange: (updated: PlannedExercise) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}

function ExerciseRow({ pe, index, total, siblings, onChange, onRemove, onMove }: ExerciseRowProps) {
  const [expanded, setExpanded] = useState(false);
  const ex = getExercise(pe.exerciseId);
  if (!ex) return null;
  const partner = pe.biSetWithId ? siblings.find(s => s.id === pe.biSetWithId) : undefined;
  const partnerName = partner ? getExercise(partner.exerciseId)?.name : undefined;

  const numField = (label: string, key: 'sets' | 'repsMin' | 'repsMax' | 'restSeconds', min: number, max: number) => (
    <div key={key}>
      <label className="label-xs" style={{ display: 'block', marginBottom: 4 }}>{label}</label>
      <input
        type="number" inputMode="numeric" className="field" style={{ textAlign: 'center' }}
        value={pe[key]} min={min} max={max}
        onChange={e => onChange({ ...pe, [key]: Math.min(max, Math.max(min, parseInt(e.target.value) || min)) })}
      />
    </div>
  );

  return (
    <div className="card-raised" style={{ marginBottom: 8, padding: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button onClick={() => setExpanded(e => !e)} style={{ flex: 1, textAlign: 'left', minWidth: 0, padding: '4px 0' }}>
          <div style={{ fontSize: 15, fontWeight: 500 }}>{ex.name}</div>
          <div style={{ fontSize: 12, color: '#6b6b73', marginTop: 2 }}>
            {MUSCLE_LABELS[ex.muscleGroup]} · {pe.sets}×{pe.repsMin}–{pe.repsMax} · {pe.restSeconds}s
            {pe.technique !== 'normal' && ` · ${pe.technique}`}
            {partnerName && ` com ${partnerName}`}
          </div>
        </button>
        <button className="icon-btn" onClick={() => setExpanded(e => !e)} aria-label="Detalhes">
          {expanded ? <ChevronDownIcon size={18} /> : <ChevronRightIcon size={18} />}
        </button>
      </div>

      {expanded && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {numField('Séries', 'sets', 1, 20)}
            {numField('Rep. mín', 'repsMin', 1, 100)}
            {numField('Rep. máx', 'repsMax', 1, 100)}
          </div>
          {numField('Descanso (segundos)', 'restSeconds', 0, 600)}

          <div>
            <label className="label-xs" style={{ display: 'block', marginBottom: 8 }}>Técnica</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {TECHNIQUES.map(t => (
                <button key={t.value} className={`chip ${pe.technique === t.value ? 'on' : ''}`}
                  onClick={() => onChange({ ...pe, technique: t.value, biSetWithId: t.value === 'bi-set' ? pe.biSetWithId : undefined })}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {pe.technique === 'bi-set' && (
            <div>
              <label className="label-xs" style={{ display: 'block', marginBottom: 6 }}>Bi-set com</label>
              <select className="field" value={pe.biSetWithId ?? ''} onChange={e => onChange({ ...pe, biSetWithId: e.target.value || undefined })}>
                <option value="">Escolha o exercício par</option>
                {siblings.filter(s => s.id !== pe.id).map(s => (
                  <option key={s.id} value={s.id}>{getExercise(s.exerciseId)?.name ?? '—'}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="label-xs" style={{ display: 'block', marginBottom: 6 }}>Notas</label>
            <input className="field" placeholder="Instrução, foco..." value={pe.notes} onChange={e => onChange({ ...pe, notes: e.target.value })} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 4 }}>
              <button className="icon-btn" disabled={index === 0} style={{ opacity: index === 0 ? 0.3 : 1 }} onClick={() => onMove(-1)} aria-label="Subir"><ArrowUpIcon size={18} /></button>
              <button className="icon-btn" disabled={index === total - 1} style={{ opacity: index === total - 1 ? 0.3 : 1 }} onClick={() => onMove(1)} aria-label="Descer"><ArrowDownIcon size={18} /></button>
            </div>
            <button className="btn btn-danger btn-sm" onClick={onRemove}><TrashIcon size={14} /> Remover</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlanDetail({ planId, onNavigate }: Props) {
  const existing = planId ? getPlan(planId) : undefined;
  const [plan, setPlan] = useState<WorkoutPlan>(existing ?? emptyPlan());
  const [pickerDayId, setPickerDayId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const mounted = useRef(false);
  const isNew = !existing;

  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    if (!plan.name.trim()) return;
    savePlan(plan);
    setSavedFlash(true);
    const t = setTimeout(() => setSavedFlash(false), 1200);
    return () => clearTimeout(t);
  }, [plan]);

  function updatePlan(patch: Partial<WorkoutPlan>) {
    setPlan(p => ({ ...p, ...patch, updatedAt: Date.now() }));
  }

  function mapDay(dayId: string, fn: (d: PlanDay) => PlanDay) {
    setPlan(p => ({ ...p, updatedAt: Date.now(), days: p.days.map(d => d.id === dayId ? fn(d) : d) }));
  }

  function addDay() {
    const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const label = labels[plan.days.length] ?? `D${plan.days.length + 1}`;
    updatePlan({ days: [...plan.days, { id: uid(), label, exercises: [] }] });
  }

  function duplicateDay(day: PlanDay) {
    const idMap = new Map<string, string>();
    const exercises = day.exercises.map(e => { const id = uid(); idMap.set(e.id, id); return { ...e, id }; })
      .map(e => ({ ...e, biSetWithId: e.biSetWithId ? idMap.get(e.biSetWithId) : undefined }));
    updatePlan({ days: [...plan.days, { id: uid(), label: `${day.label} (cópia)`, exercises }] });
  }

  function moveExercise(dayId: string, idx: number, dir: -1 | 1) {
    mapDay(dayId, d => {
      const list = [...d.exercises];
      const j = idx + dir;
      if (j < 0 || j >= list.length) return d;
      [list[idx], list[j]] = [list[j], list[idx]];
      return { ...d, exercises: list };
    });
  }

  function removeExercise(dayId: string, peId: string) {
    mapDay(dayId, d => ({
      ...d,
      exercises: d.exercises.filter(e => e.id !== peId).map(e => e.biSetWithId === peId ? { ...e, biSetWithId: undefined } : e),
    }));
  }

  function handleDelete() {
    if (existing) deletePlan(existing.id);
    onNavigate({ screen: 'plans' });
  }

  return (
    <div className="page animate-fade-in">
      <div className="page-header">
        <button className="icon-btn" onClick={() => onNavigate({ screen: 'plans' })} aria-label="Voltar"><ChevronLeftIcon size={22} /></button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="label-xs" style={{ marginBottom: 4 }}>
            {isNew ? 'Nova ficha' : 'Editar ficha'} {savedFlash && <span style={{ color: '#4CAF7A' }}>· salvo</span>}
          </div>
          <h1 className="page-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{plan.name || 'Sem nome'}</h1>
        </div>
        {existing && (
          <button className="icon-btn" style={{ color: '#E05555' }} onClick={() => setConfirmDelete(true)} aria-label="Excluir ficha"><TrashIcon size={20} /></button>
        )}
      </div>

      <div className="page-inner">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
          <div>
            <label className="label-xs" style={{ display: 'block', marginBottom: 6 }}>Nome da ficha</label>
            <input className="field" placeholder="Ex: Hipertrofia ABC" value={plan.name} onChange={e => updatePlan({ name: e.target.value })} />
          </div>
          <div>
            <label className="label-xs" style={{ display: 'block', marginBottom: 6 }}>Objetivo (opcional)</label>
            <input className="field" placeholder="Ex: Hipertrofia, Força..." value={plan.goal} onChange={e => updatePlan({ goal: e.target.value })} />
          </div>
          {!plan.name.trim() && <div style={{ fontSize: 12, color: '#6b6b73' }}>Dê um nome à ficha — ela é salva automaticamente a cada alteração.</div>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div className="label-xs">Dias de treino</div>
          <button className="btn btn-ghost btn-sm" onClick={addDay}><PlusIcon size={14} /> Dia</button>
        </div>

        {plan.days.length === 0 && (
          <div className="card" style={{ textAlign: 'center', color: '#6b6b73', fontSize: 14, marginBottom: 16 }}>
            Toque em "Dia" para criar o treino A. Depois adicione os exercícios.
          </div>
        )}

        {plan.days.map(day => (
          <div key={day.id} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
              <input
                className="field" style={{ flex: 1, fontWeight: 600, letterSpacing: '0.06em' }}
                value={day.label} placeholder="Nome do dia"
                onChange={e => mapDay(day.id, d => ({ ...d, label: e.target.value }))}
              />
              <button className="icon-btn" onClick={() => duplicateDay(day)} aria-label="Duplicar dia"><CopyIcon size={18} /></button>
              <button className="icon-btn" onClick={() => updatePlan({ days: plan.days.filter(d => d.id !== day.id) })} aria-label="Remover dia"><TrashIcon size={18} /></button>
            </div>

            {day.exercises.map((pe, i) => (
              <ExerciseRow
                key={pe.id} pe={pe} index={i} total={day.exercises.length} siblings={day.exercises}
                onChange={u => mapDay(day.id, d => ({ ...d, exercises: d.exercises.map(e => e.id === u.id ? u : e) }))}
                onRemove={() => removeExercise(day.id, pe.id)}
                onMove={dir => moveExercise(day.id, i, dir)}
              />
            ))}

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setPickerDayId(day.id)}>
                <PlusIcon size={16} /> Exercício
              </button>
              {existing && plan.name.trim() && day.exercises.length > 0 && (
                <button className="btn btn-primary" onClick={() => onNavigate({ screen: 'workout', planId: plan.id, dayId: day.id })}>
                  <PlayIcon size={16} /> Iniciar
                </button>
              )}
            </div>
          </div>
        ))}

        <button className="btn btn-primary btn-full btn-lg" style={{ marginTop: 8 }} disabled={!plan.name.trim()} onClick={() => onNavigate({ screen: 'plans' })}>
          Concluir
        </button>
      </div>

      {pickerDayId && (
        <ExercisePicker
          onAdd={exId => mapDay(pickerDayId, d => ({ ...d, exercises: [...d.exercises, emptyExercise(exId)] }))}
          onClose={() => setPickerDayId(null)}
        />
      )}

      {confirmDelete && (
        <ConfirmSheet
          title="Excluir ficha?" confirmLabel="Excluir"
          message="O histórico de treinos feitos com esta ficha será mantido."
          onConfirm={handleDelete} onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}
