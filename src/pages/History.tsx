import React from 'react';
import type { View } from '../types';
import { getSessions } from '../store';
import { ChevronRightIcon, ClipboardIcon } from '../components/Icons';

interface Props { onNavigate: (v: View) => void; }

function fmt(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}h ${m}min`;
  return `${m}min`;
}

export default function History({ onNavigate }: Props) {
  const sessions = getSessions().filter(s => s.finishedAt != null);

  const grouped: { label: string; sessions: typeof sessions }[] = [];
  for (const s of sessions) {
    const label = new Date(s.startedAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    const existing = grouped.find(g => g.label === label);
    if (existing) existing.sessions.push(s);
    else grouped.push({ label, sessions: [s] });
  }

  return (
    <div className="page animate-fade-in">
      <div className="page-inner">
        <div className="page-header">
          <div>
            <div className="label-xs" style={{ marginBottom: 4 }}>Passado</div>
            <h1 className="page-title">Histórico</h1>
          </div>
        </div>

        {sessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <ClipboardIcon size={40} style={{ color: '#525259', margin: '0 auto 16px' } as React.CSSProperties} />
            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Nenhum treino registrado</div>
            <div style={{ fontSize: 13, color: '#525259' }}>Seus treinos concluídos aparecerão aqui.</div>
          </div>
        ) : (
          grouped.map(group => (
            <div key={group.label} style={{ marginBottom: 24 }}>
              <div className="label-xs" style={{ marginBottom: 10, textTransform: 'capitalize' }}>{group.label}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {group.sessions.map(s => {
                  const date = new Date(s.startedAt);
                  return (
                    <button
                      key={s.id}
                      style={{ display: 'flex', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'left', width: '100%', gap: 14 }}
                      onClick={() => onNavigate({ screen: 'session-detail', sessionId: s.id })}
                    >
                      <div style={{ background: '#16161C', borderRadius: 8, padding: '6px 10px', textAlign: 'center', flexShrink: 0, minWidth: 42 }}>
                        <div style={{ fontSize: 18, fontFamily: "'Fraunces', serif", fontWeight: 300, color: '#C8A96E', lineHeight: 1 }}>{date.getDate()}</div>
                        <div className="label-xs" style={{ marginTop: 1 }}>{date.toLocaleDateString('pt-BR', { weekday: 'short' })}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 500 }}>{s.planName} · {s.dayLabel}</div>
                        <div style={{ fontSize: 12, color: '#525259', marginTop: 2 }}>
                          {s.exercises.length} exercícios{s.durationSeconds ? ` · ${fmt(s.durationSeconds)}` : ''}
                        </div>
                      </div>
                      <ChevronRightIcon size={18} style={{ color: '#525259', flexShrink: 0 } as React.CSSProperties} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
