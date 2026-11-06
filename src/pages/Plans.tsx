import React from 'react';
import type { View } from '../types';
import { getPlans } from '../store';
import { PlusIcon, ChevronRightIcon, ClipboardIcon } from '../components/Icons';

interface Props { onNavigate: (v: View) => void; }

export default function Plans({ onNavigate }: Props) {
  const plans = getPlans().sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="page animate-fade-in">
      <div className="page-inner">
        <div className="page-header">
          <div style={{ flex: 1 }}>
            <div className="label-xs" style={{ marginBottom: 4 }}>Treinos</div>
            <h1 className="page-title">Fichas</h1>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate({ screen: 'plan-new' })}>
            <PlusIcon size={16} />
            Nova
          </button>
        </div>

        {plans.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <ClipboardIcon size={40} style={{ color: '#525259', margin: '0 auto 16px' } as React.CSSProperties} />
            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Nenhuma ficha criada</div>
            <div style={{ fontSize: 13, color: '#525259', marginBottom: 24 }}>Monte sua ficha com divisão A/B/C e exercícios.</div>
            <button className="btn btn-primary" onClick={() => onNavigate({ screen: 'plan-new' })}>
              <PlusIcon size={16} />
              Criar ficha
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {plans.map(plan => (
              <button
                key={plan.id}
                className="card"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left', width: '100%' }}
                onClick={() => onNavigate({ screen: 'plan-detail', planId: plan.id })}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 500 }}>{plan.name}</div>
                  {plan.goal && <div style={{ fontSize: 13, color: '#525259', marginTop: 2 }}>{plan.goal}</div>}
                  <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                    {plan.days.map(day => (
                      <span key={day.id} className="badge badge-muted">{day.label}</span>
                    ))}
                  </div>
                </div>
                <ChevronRightIcon size={18} style={{ color: '#525259', flexShrink: 0, marginLeft: 8 } as React.CSSProperties} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
