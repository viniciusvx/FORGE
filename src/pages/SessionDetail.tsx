import React, { useState } from 'react';
import type { View } from '../types';
import { getSession, getExercise, getPlan, deleteSession } from '../store';
import { ChevronLeftIcon, TrashIcon, RepeatIcon } from '../components/Icons';
import { ConfirmSheet } from '../components/Sheet';

interface Props {
  sessionId: string;
  onNavigate: (v: View) => void;
}

function fmt(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}h ${m}min`;
  return `${m}min`;
}

export default function SessionDetail({ sessionId, onNavigate }: Props) {
  const session = getSession(sessionId);
  const [confirmDelete, setConfirmDelete] = useState(false);
  if (!session) {
    return (
      <div className="page">
        <div className="page-header">
          <button className="icon-btn" onClick={() => onNavigate({ screen: 'history' })}><ChevronLeftIcon size={22} /></button>
        </div>
        <div className="page-inner"><p style={{ color: '#6b6b73' }}>Sessão não encontrada.</p></div>
      </div>
    );
  }

  const date = new Date(session.startedAt);

  return (
    <div className="page animate-fade-in">
      <div className="page-inner">
        <div className="page-header" style={{ padding: 0, paddingTop: 'calc(env(safe-area-inset-top, 0px) + 24px)', paddingBottom: 18 }}>
          <button className="icon-btn" onClick={() => onNavigate({ screen: 'history' })} aria-label="Voltar"><ChevronLeftIcon size={22} /></button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="label-xs" style={{ marginBottom: 4 }}>
              {date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            <h1 className="page-title">{session.planName} · {session.dayLabel}</h1>
          </div>
          <button className="icon-btn" style={{ color: '#E05555' }} onClick={() => setConfirmDelete(true)} aria-label="Excluir treino"><TrashIcon size={20} /></button>
        </div>

        {session.prs && session.prs.length > 0 && (
          <div className="card" style={{ marginBottom: 16, background: 'rgba(200,169,110,0.08)', border: '1px solid rgba(200,169,110,0.25)' }}>
            <div className="label-xs" style={{ color: '#C8A96E', marginBottom: 6 }}>Novo recorde de carga</div>
            <div style={{ fontSize: 14 }}>{session.prs.map(id => getExercise(id)?.name).filter(Boolean).join(', ')}</div>
          </div>
        )}

        <div className="card" style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 300, color: '#C8A96E' }}>
              {session.exercises.length}
            </div>
            <div style={{ fontSize: 12, color: '#525259' }}>exercícios</div>
          </div>
          {session.durationSeconds && (
            <div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 300, color: '#C8A96E' }}>
                {fmt(session.durationSeconds)}
              </div>
              <div style={{ fontSize: 12, color: '#525259' }}>duração</div>
            </div>
          )}
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 300, color: '#C8A96E' }}>
              {session.exercises.reduce((acc, l) => acc + l.sets.filter(s => s.done && !s.warmup).length, 0)}
            </div>
            <div style={{ fontSize: 12, color: '#525259' }}>séries feitas</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {session.exercises.map((log, i) => {
            const ex = getExercise(log.exerciseId);
            const doneSets = log.sets.filter(s => s.done && !s.warmup);
            const maxWeight = doneSets.reduce((m, s) => Math.max(m, s.weight), 0);

            return (
              <div key={i} className="card">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{ex?.name ?? 'Exercício removido'}{session.prs?.includes(log.exerciseId) && <span className="badge badge-amber" style={{ marginLeft: 8 }}>recorde</span>}</div>
                  <div className="badge badge-muted">{doneSets.length} séries</div>
                </div>

                {doneSets.length > 0 ? (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr 1fr', gap: 8, marginBottom: 6 }}>
                      <div className="label-xs" style={{ textAlign: 'center' }}>#</div>
                      <div className="label-xs" style={{ textAlign: 'center' }}>Carga</div>
                      <div className="label-xs" style={{ textAlign: 'center' }}>Reps</div>
                      <div className="label-xs" style={{ textAlign: 'center' }}>RIR</div>
                    </div>
                    {doneSets.map((set, si) => (
                      <div key={si} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr 1fr', gap: 8, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <div style={{ fontSize: 13, color: '#525259', textAlign: 'center' }}>{si + 1}</div>
                        <div style={{ fontSize: 15, fontWeight: 500, textAlign: 'center' }}>{set.weight}{set.unit}</div>
                        <div style={{ fontSize: 15, fontWeight: 500, textAlign: 'center' }}>{set.reps}</div>
                        <div style={{ fontSize: 13, color: '#525259', textAlign: 'center' }}>
                          {set.rir != null ? set.rir : '—'}
                        </div>
                      </div>
                    ))}
                    {maxWeight > 0 && (
                      <div style={{ fontSize: 12, color: '#525259', marginTop: 8 }}>
                        Máximo: {maxWeight}{doneSets[0].unit}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ fontSize: 13, color: '#525259' }}>Nenhuma série registrada</div>
                )}
              </div>
            );
          })}
        </div>

        {session.notes && (
          <div className="card" style={{ marginTop: 16 }}>
            <div className="label-xs" style={{ marginBottom: 6 }}>Observações</div>
            <div style={{ fontSize: 14, lineHeight: 1.5 }}>{session.notes}</div>
          </div>
        )}

        {session.planId !== 'free' && getPlan(session.planId)?.days.some(d => d.id === session.dayId) && (
          <button className="btn btn-primary btn-full" style={{ marginTop: 20 }} onClick={() => onNavigate({ screen: 'workout', planId: session.planId, dayId: session.dayId })}>
            <RepeatIcon size={16} /> Repetir este treino
          </button>
        )}
      </div>

      {confirmDelete && (
        <ConfirmSheet title="Excluir este treino?" message="Ele sai do histórico, dos recordes e do mapa muscular. Não dá para desfazer."
          confirmLabel="Excluir" onConfirm={() => { deleteSession(session.id); onNavigate({ screen: 'history' }); }} onCancel={() => setConfirmDelete(false)} />
      )}
    </div>
  );
}
