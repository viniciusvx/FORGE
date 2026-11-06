import React, { useState } from 'react';
import type { View } from '../types';
import { getSessions, getExercises } from '../store';
import { ChevronRightIcon, ClipboardIcon } from '../components/Icons';

interface Props { onNavigate: (v: View) => void; }

function fmt(sec: number) {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60);
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

export default function History({ onNavigate }: Props) {
  const all = getSessions().filter(s => s.finishedAt != null);
  const [plan, setPlan] = useState('all');
  const [exId, setExId] = useState('all');

  const planNames = [...new Set(all.map(s => s.planName))];
  const usedEx = getExercises().filter(e => all.some(s => s.exercises.some(l => l.exerciseId === e.id)))
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

  const sessions = all.filter(s =>
    (plan === 'all' || s.planName === plan) &&
    (exId === 'all' || s.exercises.some(l => l.exerciseId === exId))
  );

  const grouped: { label: string; items: typeof sessions }[] = [];
  for (const s of sessions) {
    const label = new Date(s.startedAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    const g = grouped.find(x => x.label === label);
    if (g) g.items.push(s); else grouped.push({ label, items: [s] });
  }

  return (
    <div className="page animate-fade-in">
      <div className="page-header">
        <div>
          <div className="label-xs" style={{ marginBottom: 4 }}>Passado</div>
          <h1 className="page-title">Histórico</h1>
        </div>
      </div>
      <div className="page-inner">
        {all.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <ClipboardIcon size={40} style={{ color: '#525259', margin: '0 auto 16px' }} />
            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Nenhum treino registrado</div>
            <div style={{ fontSize: 13, color: '#6b6b73' }}>Seus treinos concluídos aparecerão aqui.</div>
          </div>
        ) : (
          <>
            {planNames.length > 1 && (
              <div className="chips">
                <button className={`chip ${plan === 'all' ? 'on' : ''}`} onClick={() => setPlan('all')}>Todas as fichas</button>
                {planNames.map(n => <button key={n} className={`chip ${plan === n ? 'on' : ''}`} onClick={() => setPlan(n)}>{n}</button>)}
              </div>
            )}
            <select className="field" style={{ marginBottom: 20 }} value={exId} onChange={e => setExId(e.target.value)}>
              <option value="all">Todos os exercícios</option>
              {usedEx.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>

            {sessions.length === 0 && <div style={{ textAlign: 'center', color: '#6b6b73', padding: 24, fontSize: 14 }}>Nenhum treino neste filtro.</div>}

            {grouped.map(group => (
              <div key={group.label} style={{ marginBottom: 24 }}>
                <div className="label-xs" style={{ marginBottom: 6, textTransform: 'capitalize' }}>{group.label}</div>
                {group.items.map(s => {
                  const d = new Date(s.startedAt);
                  return (
                    <button key={s.id} className="row-btn" style={{ gap: 14 }} onClick={() => onNavigate({ screen: 'session-detail', sessionId: s.id })}>
                      <div style={{ background: '#16161C', borderRadius: 8, padding: '6px 10px', textAlign: 'center', flexShrink: 0, minWidth: 46 }}>
                        <div style={{ fontSize: 18, fontFamily: "'Fraunces', serif", fontWeight: 300, color: '#C8A96E', lineHeight: 1 }}>{d.getDate()}</div>
                        <div className="label-xs" style={{ marginTop: 2 }}>{d.toLocaleDateString('pt-BR', { weekday: 'short' })}</div>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 500 }}>{s.planName} · {s.dayLabel}</div>
                        <div style={{ fontSize: 12, color: '#6b6b73', marginTop: 2 }}>
                          {s.exercises.length} exercícios{s.durationSeconds ? ` · ${fmt(s.durationSeconds)}` : ''}{s.prs && s.prs.length > 0 ? ` · ${s.prs.length} recorde${s.prs.length > 1 ? 's' : ''}` : ''}
                        </div>
                      </div>
                      <ChevronRightIcon size={18} style={{ color: '#525259', flexShrink: 0 }} />
                    </button>
                  );
                })}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
