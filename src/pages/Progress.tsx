import React, { useState } from 'react';
import type { View, MuscleGroup, WorkoutSession } from '../types';
import { MUSCLE_LABELS } from '../types';
import { getSessions, getExercises, getExercise, getExerciseRecords } from '../store';
import { TrendingUpIcon } from '../components/Icons';
import AnatomyFigure from '../components/AnatomyFigure';
import { MUSCLES, resolveAnatomy } from '../anatomy/data';
import type { MuscleId, View as BodyView } from '../anatomy/shapes';

interface Props { onNavigate: (v: View) => void; }

const DAY = 86400000;

function regionHeat(sessions: WorkoutSession[]) {
  const sets: Partial<Record<MuscleId, number>> = {};
  let unmapped = 0;
  const seen = new Set<string>();
  for (const s of sessions) {
    for (const log of s.exercises) {
      const ex = getExercise(log.exerciseId);
      const n = log.sets.filter(x => x.done && !x.warmup).length;
      if (!ex || n === 0) continue;
      const a = resolveAnatomy(ex);
      if (!a || a.pending) { if (!seen.has(ex.id)) { seen.add(ex.id); unmapped++; } continue; }
      a.primary.forEach(id => { sets[id] = (sets[id] ?? 0) + n; });
      a.secondary.forEach(id => { sets[id] = (sets[id] ?? 0) + n * 0.5; });
    }
  }
  return { sets, unmapped };
}

function volumeByMuscle(sessions: WorkoutSession[]) {
  const sets: Partial<Record<MuscleGroup, number>> = {};
  const last: Partial<Record<MuscleGroup, number>> = {};
  for (const s of sessions) {
    for (const log of s.exercises) {
      const ex = getExercise(log.exerciseId);
      if (!ex) continue;
      const n = log.sets.filter(x => x.done && !x.warmup).length;
      if (n === 0) continue;
      sets[ex.muscleGroup] = (sets[ex.muscleGroup] ?? 0) + n;
      last[ex.muscleGroup] = Math.max(last[ex.muscleGroup] ?? 0, s.startedAt);
    }
  }
  return { sets, last };
}

function progressFor(exerciseId: string, sessions: WorkoutSession[]) {
  const pts: { date: number; weight: number }[] = [];
  for (const s of [...sessions].reverse()) {
    for (const log of s.exercises) {
      if (log.exerciseId !== exerciseId) continue;
      const best = log.sets.filter(x => x.done && !x.warmup && x.weight > 0).reduce((m, x) => Math.max(m, x.weight), 0);
      if (best > 0) pts.push({ date: s.startedAt, weight: best });
    }
  }
  return pts;
}

export default function Progress({ onNavigate }: Props) {
  const sessions = getSessions().filter(s => s.finishedAt != null);
  const exercises = getExercises().sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  const [selectedExId, setSelectedExId] = useState<string | null>(exercises[0]?.id ?? null);
  const [range, setRange] = useState<7 | 30>(7);
  const [bodyView, setBodyView] = useState<BodyView>('front');
  const [pickedRegion, setPickedRegion] = useState<MuscleId | null>(null);

  const week = sessions.filter(s => s.startedAt > Date.now() - 7 * DAY);
  const month = sessions.filter(s => s.startedAt > Date.now() - 30 * DAY);
  const { sets, last } = volumeByMuscle(sessions.filter(s => s.startedAt > Date.now() - range * DAY));
  const { last: lastAll } = volumeByMuscle(sessions);
  const { sets: regionSets, unmapped } = regionHeat(sessions.filter(s => s.startedAt > Date.now() - range * DAY));
  const maxRegion = Math.max(1, ...Object.values(regionSets).map(v => v ?? 0));
  const heat = Object.fromEntries(Object.entries(regionSets).map(([k, v]) => [k, (v ?? 0) / maxRegion])) as Partial<Record<MuscleId, number>>;
  void last;
  const muscleRows = (Object.keys(MUSCLE_LABELS) as MuscleGroup[])
    .filter(m => m !== 'other' && (sets[m] || lastAll[m]))
    .sort((a, b) => (sets[b] ?? 0) - (sets[a] ?? 0));

  const records = exercises
    .map(ex => ({ ex, rec: getExerciseRecords(ex.id) }))
    .filter(r => r.rec.maxWeight > 0)
    .sort((a, b) => b.rec.maxWeightDate - a.rec.maxWeightDate)
    .slice(0, 12);

  const pts = selectedExId ? progressFor(selectedExId, sessions) : [];

  return (
    <div className="page animate-fade-in">
      <div className="page-header">
        <div>
          <div className="label-xs" style={{ marginBottom: 4 }}>Dados</div>
          <h1 className="page-title">Evolução</h1>
        </div>
      </div>
      <div className="page-inner">
        {sessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <TrendingUpIcon size={40} style={{ color: '#525259', margin: '0 auto 16px' }} />
            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Sem dados ainda</div>
            <div style={{ fontSize: 13, color: '#6b6b73', marginBottom: 20 }}>Conclua treinos para ver mapa muscular, recordes e progressão.</div>
            <button className="btn btn-primary" onClick={() => onNavigate({ screen: 'workout' })}>Começar um treino</button>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 24 }}>
              {[{ v: week.length, l: 'Semana' }, { v: month.length, l: '30 dias' }, { v: sessions.length, l: 'Total' }].map(({ v, l }) => (
                <div key={l} className="card" style={{ textAlign: 'center', padding: 12 }}>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 300, color: '#C8A96E' }}>{v}</div>
                  <div style={{ fontSize: 11, color: '#6b6b73', marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div className="label-xs">Mapa muscular</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className={`chip ${range === 7 ? 'on' : ''}`} onClick={() => setRange(7)}>7 dias</button>
                  <button className={`chip ${range === 30 ? 'on' : ''}`} onClick={() => setRange(30)}>30 dias</button>
                </div>
              </div>
              <div className="card">
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  <button className={`chip ${bodyView === 'front' ? 'on' : ''}`} onClick={() => setBodyView('front')}>Frente</button>
                  <button className={`chip ${bodyView === 'back' ? 'on' : ''}`} onClick={() => setBodyView('back')}>Costas</button>
                </div>
                <div style={{ maxWidth: 300, margin: '0 auto' }}>
                  <AnatomyFigure view={bodyView} layer="sup" heat={heat} zoom={false} selected={pickedRegion} onSelect={setPickedRegion} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', margin: '8px 0' }}>
                  <span style={{ fontSize: 11, color: '#6b6b73' }}>menos</span>
                  <div style={{ width: 90, height: 6, borderRadius: 3, background: 'linear-gradient(90deg, rgba(227,178,91,0.22), rgba(227,178,91,1))' }} />
                  <span style={{ fontSize: 11, color: '#6b6b73' }}>mais séries</span>
                </div>
                <div style={{ fontSize: 12, color: '#8a8a92', textAlign: 'center', minHeight: 18 }}>
                  {pickedRegion ? `${MUSCLES[pickedRegion].name}: ${Math.round((regionSets[pickedRegion] ?? 0) * 10) / 10} séries equivalentes` : 'Toque em um músculo para ver o volume.'}
                </div>
                <div style={{ fontSize: 11, color: '#6b6b73', marginTop: 6, lineHeight: 1.5 }}>
                  Cada série conta 1 para o músculo principal e 0,5 para os que participam. {unmapped > 0 ? `${unmapped} exercício${unmapped > 1 ? 's' : ''} sem mapeamento muscular não ${unmapped > 1 ? 'entram' : 'entra'} neste mapa.` : ''}
                </div>
                <div style={{ marginTop: 16 }}>
                  {muscleRows.map(m => {
                    const days = lastAll[m] ? Math.floor((Date.now() - lastAll[m]!) / DAY) : null;
                    return (
                      <div key={m} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: 13 }}>
                        <span>{MUSCLE_LABELS[m]}</span>
                        <span style={{ color: '#8a8a92' }}>
                          {sets[m] ?? 0} {(sets[m] ?? 0) === 1 ? 'série' : 'séries'} · {days === null ? '—' : days === 0 ? 'hoje' : `há ${days}d`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {records.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <div className="label-xs" style={{ marginBottom: 12 }}>Recordes pessoais</div>
                <div className="card" style={{ padding: '4px 16px' }}>
                  {records.map(({ ex, rec }) => (
                    <div key={ex.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', gap: 12 }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 500 }}>{ex.name}</div>
                        <div style={{ fontSize: 12, color: '#6b6b73', marginTop: 2 }}>
                          1RM estimado {Math.round(rec.best1RM)} · {new Date(rec.maxWeightDate).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 300, color: '#C8A96E', whiteSpace: 'nowrap' }}>{rec.maxWeight}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {exercises.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div className="label-xs" style={{ marginBottom: 12 }}>Progressão de carga</div>
                <select className="field" style={{ marginBottom: 10 }} value={selectedExId ?? ''} onChange={e => setSelectedExId(e.target.value || null)}>
                  {exercises.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
                </select>
                {pts.length < 2 ? (
                  <div className="card" style={{ color: '#6b6b73', fontSize: 13, textAlign: 'center', padding: 24 }}>
                    Precisa de ao menos 2 treinos com este exercício para mostrar a curva.
                  </div>
                ) : (() => {
                  const max = Math.max(...pts.map(p => p.weight)), min = Math.min(...pts.map(p => p.weight));
                  const range = max - min || 1, W = 280, H = 90;
                  const xy = pts.map((p, i) => [(i / (pts.length - 1)) * W, H - ((p.weight - min) / range) * (H - 20) - 10]);
                  return (
                    <div className="card">
                      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
                        <polyline points={xy.map(p => p.join(',')).join(' ')} fill="none" stroke="#C8A96E" strokeWidth={2} strokeLinejoin="round" />
                        {xy.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={3.5} fill="#C8A96E" />)}
                      </svg>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 12 }}>
                        <span style={{ color: '#6b6b73' }}>mín {min}</span>
                        <span style={{ color: '#C8A96E', fontWeight: 500 }}>atual {pts[pts.length - 1].weight}</span>
                        <span style={{ color: '#6b6b73' }}>máx {max}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
