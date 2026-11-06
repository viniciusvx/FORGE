import React, { useState } from 'react';
import type { View, MuscleGroup } from '../types';
import { MUSCLE_LABELS } from '../types';
import { getSessions, getExercises, getExercise } from '../store';
import { TrendingUpIcon } from '../components/Icons';

interface Props { onNavigate: (v: View) => void; }

function getVolumeByMuscle(sessions: ReturnType<typeof getSessions>) {
  const counts: Partial<Record<MuscleGroup, number>> = {};
  for (const session of sessions) {
    for (const log of session.exercises) {
      const ex = getExercise(log.exerciseId);
      if (!ex) continue;
      const doneSets = log.sets.filter(s => s.done).length;
      counts[ex.muscleGroup] = (counts[ex.muscleGroup] ?? 0) + doneSets;
    }
  }
  return counts;
}

function getProgressForExercise(exerciseId: string, sessions: ReturnType<typeof getSessions>) {
  const points: { date: number; weight: number }[] = [];
  for (const session of [...sessions].reverse()) {
    for (const log of session.exercises) {
      if (log.exerciseId !== exerciseId) continue;
      const best = log.sets.filter(s => s.done && s.weight > 0).reduce((m, s) => Math.max(m, s.weight), 0);
      if (best > 0) points.push({ date: session.startedAt, weight: best });
    }
  }
  return points;
}

export default function Progress({ onNavigate }: Props) {
  const sessions = getSessions().filter(s => s.finishedAt != null);
  const exercises = getExercises();
  const [selectedExId, setSelectedExId] = useState<string | null>(exercises[0]?.id ?? null);

  const weekSessions = sessions.filter(s => s.startedAt > Date.now() - 7 * 86400000);
  const monthSessions = sessions.filter(s => s.startedAt > Date.now() - 30 * 86400000);
  const volumeByMuscle = getVolumeByMuscle(monthSessions);
  const topMuscles = Object.entries(volumeByMuscle)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6) as [MuscleGroup, number][];
  const maxVol = topMuscles[0]?.[1] ?? 1;

  const progressPoints = selectedExId ? getProgressForExercise(selectedExId, sessions) : [];

  return (
    <div className="page animate-fade-in">
      <div className="page-inner">
        <div className="page-header">
          <div>
            <div className="label-xs" style={{ marginBottom: 4 }}>Dados</div>
            <h1 className="page-title">Evolução</h1>
          </div>
        </div>

        {sessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <TrendingUpIcon size={40} style={{ color: '#525259', margin: '0 auto 16px' } as React.CSSProperties} />
            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Sem dados ainda</div>
            <div style={{ fontSize: 13, color: '#525259' }}>Complete treinos para ver sua evolução.</div>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 24 }}>
              {[
                { value: weekSessions.length, label: 'Esta semana' },
                { value: monthSessions.length, label: 'Último mês' },
                { value: sessions.length, label: 'Total' },
              ].map(({ value, label }) => (
                <div key={label} className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 300, color: '#C8A96E' }}>{value}</div>
                  <div style={{ fontSize: 11, color: '#525259', marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>

            {topMuscles.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div className="label-xs" style={{ marginBottom: 12 }}>Séries por músculo (30 dias)</div>
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {topMuscles.map(([muscle, vol]) => (
                    <div key={muscle}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 13 }}>{MUSCLE_LABELS[muscle]}</span>
                        <span style={{ fontSize: 13, color: '#525259' }}>{vol} séries</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 4, height: 4 }}>
                        <div style={{ background: '#C8A96E', borderRadius: 4, height: 4, width: `${(vol / maxVol) * 100}%`, transition: 'width 0.5s ease' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {exercises.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div className="label-xs" style={{ marginBottom: 12 }}>Progressão de carga</div>
                <div style={{ marginBottom: 10 }}>
                  <select
                    className="field"
                    value={selectedExId ?? ''}
                    onChange={e => setSelectedExId(e.target.value || null)}
                  >
                    {exercises.map(ex => (
                      <option key={ex.id} value={ex.id}>{ex.name}</option>
                    ))}
                  </select>
                </div>

                {progressPoints.length < 2 ? (
                  <div className="card" style={{ color: '#525259', fontSize: 13, textAlign: 'center', padding: 24 }}>
                    Precisa de ao menos 2 registros para mostrar a progressão.
                  </div>
                ) : (
                  <div className="card">
                    {(() => {
                      const max = Math.max(...progressPoints.map(p => p.weight));
                      const min = Math.min(...progressPoints.map(p => p.weight));
                      const range = max - min || 1;
                      const W = 280, H = 80;
                      const points = progressPoints.map((p, i) => {
                        const x = (i / (progressPoints.length - 1)) * W;
                        const y = H - ((p.weight - min) / range) * (H - 16) - 8;
                        return `${x},${y}`;
                      }).join(' ');
                      return (
                        <div>
                          <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
                            <polyline points={points} fill="none" stroke="#C8A96E" strokeWidth={2} strokeLinejoin="round" />
                            {progressPoints.map((p, i) => {
                              const x = (i / (progressPoints.length - 1)) * W;
                              const y = H - ((p.weight - min) / range) * (H - 16) - 8;
                              return <circle key={i} cx={x} cy={y} r={3} fill="#C8A96E" />;
                            })}
                          </svg>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                            <span style={{ fontSize: 12, color: '#525259' }}>{min}kg</span>
                            <span style={{ fontSize: 13, fontWeight: 500, color: '#C8A96E' }}>
                              {progressPoints[progressPoints.length - 1].weight}kg atual
                            </span>
                            <span style={{ fontSize: 12, color: '#525259' }}>{max}kg max</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
