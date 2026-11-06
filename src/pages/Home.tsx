import React from 'react';
import type { View } from '../types';
import { getPlans, getSessions, getActiveSession } from '../store';
import { DumbbellIcon, ClipboardIcon, TrendingUpIcon, ZapIcon } from '../components/Icons';

interface Props { onNavigate: (v: View) => void; }

function fmt(ms: number) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  if (h > 0) return `${h}h ${m}min`;
  return `${m}min`;
}

function relativeDate(ts: number) {
  const diff = Date.now() - ts;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'hoje';
  if (days === 1) return 'ontem';
  if (days < 7) return `há ${days} dias`;
  return new Date(ts).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
}

export default function Home({ onNavigate }: Props) {
  const plans = getPlans();
  const sessions = getSessions();
  const activeSession = getActiveSession();
  const lastSession = sessions[0];

  const weekSessions = sessions.filter(s => s.startedAt > Date.now() - 7 * 86400000 && s.finishedAt != null);

  return (
    <div className="page animate-fade-in">
      <div className="page-inner">
        <div className="page-header" style={{ paddingBottom: 24 }}>
          <div>
            <div className="label-xs" style={{ marginBottom: 4 }}>FORGE</div>
            <h1 className="page-title">Bom treino.</h1>
          </div>
        </div>

        {activeSession && (
          <div
            style={{ background: 'rgba(200, 169, 110, 0.1)', border: '1px solid rgba(200, 169, 110, 0.3)', borderRadius: 14, padding: 16, marginBottom: 16, cursor: 'pointer' }}
            onClick={() => onNavigate({ screen: 'workout' })}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <ZapIcon size={16} style={{ color: '#C8A96E' } as React.CSSProperties} />
              <span className="label-xs" style={{ color: '#C8A96E' }}>TREINO EM ANDAMENTO</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>{activeSession.planName} · {activeSession.dayLabel}</div>
            <div style={{ fontSize: 13, color: '#525259', marginTop: 2 }}>Toque para retomar</div>
          </div>
        )}

        {plans.length > 0 ? (
          <div style={{ marginBottom: 24 }}>
            <div className="label-xs" style={{ marginBottom: 12 }}>Fichas</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {plans.slice(0, 3).map(plan => (
                <div
                  key={plan.id}
                  className="card"
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  onClick={() => onNavigate({ screen: 'plan-detail', planId: plan.id })}
                >
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>{plan.name}</div>
                    {plan.goal && <div style={{ fontSize: 13, color: '#525259', marginTop: 2 }}>{plan.goal}</div>}
                  </div>
                  <div className="label-xs" style={{ marginLeft: 12 }}>{plan.days.length}D</div>
                </div>
              ))}
            </div>
            <button className="btn btn-primary btn-full" style={{ marginTop: 12 }} onClick={() => onNavigate({ screen: 'workout' })}>
              <DumbbellIcon size={18} />
              Iniciar treino
            </button>
          </div>
        ) : (
          <div style={{ marginBottom: 24 }}>
            <div className="card" style={{ textAlign: 'center', padding: 32 }}>
              <ClipboardIcon size={32} style={{ color: '#525259', margin: '0 auto 12px' } as React.CSSProperties} />
              <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>Sem fichas ainda</div>
              <div style={{ fontSize: 13, color: '#525259', marginBottom: 16 }}>Crie sua primeira ficha de treino para começar.</div>
              <button className="btn btn-primary" onClick={() => onNavigate({ screen: 'plan-new' })}>
                Criar ficha
              </button>
            </div>
          </div>
        )}

        <div style={{ marginBottom: 24 }}>
          <div className="label-xs" style={{ marginBottom: 12 }}>Esta semana</div>
          <div className="card" style={{ display: 'flex', gap: 24 }}>
            <div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 300, color: '#C8A96E' }}>{weekSessions.length}</div>
              <div style={{ fontSize: 12, color: '#525259' }}>treinos</div>
            </div>
            {weekSessions.length > 0 && (
              <div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 300, color: '#C8A96E' }}>
                  {Math.round(weekSessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0) / 60)}
                </div>
                <div style={{ fontSize: 12, color: '#525259' }}>min total</div>
              </div>
            )}
          </div>
        </div>

        {lastSession && (
          <div style={{ marginBottom: 24 }}>
            <div className="label-xs" style={{ marginBottom: 12 }}>Último treino</div>
            <div
              className="card"
              style={{ cursor: 'pointer' }}
              onClick={() => onNavigate({ screen: 'session-detail', sessionId: lastSession.id })}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{lastSession.planName}</div>
                  <div style={{ fontSize: 13, color: '#525259' }}>{lastSession.dayLabel}</div>
                </div>
                <div className="label-xs">{relativeDate(lastSession.startedAt)}</div>
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
                <div style={{ fontSize: 13, color: '#525259' }}>{lastSession.exercises.length} exercícios</div>
                {lastSession.durationSeconds && (
                  <div style={{ fontSize: 13, color: '#525259' }}>{fmt(lastSession.durationSeconds * 1000)}</div>
                )}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
          {[
            { label: 'Histórico', Icon: ClipboardIcon, screen: 'history' as const },
            { label: 'Evolução', Icon: TrendingUpIcon, screen: 'progress' as const },
          ].map(({ label, Icon, screen }) => (
            <button
              key={screen}
              className="card"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8, cursor: 'pointer', textAlign: 'left' }}
              onClick={() => onNavigate({ screen })}
            >
              <Icon size={20} style={{ color: '#525259' } as React.CSSProperties} />
              <span style={{ fontSize: 14 }}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
