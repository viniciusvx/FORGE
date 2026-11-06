import React, { useState } from 'react';
import type { View, WorkoutPlan } from '../types';
import { getPlans, savePlan, suggestNextDay, uid } from '../store';
import { PlusIcon, ClipboardIcon, ChevronRightIcon, CopyIcon, PlayIcon } from '../components/Icons';

interface Props { onNavigate: (v: View) => void; }

export default function Plans({ onNavigate }: Props) {
  const [plans, setPlans] = useState(() => getPlans().sort((a, b) => b.updatedAt - a.updatedAt));

  function duplicate(plan: WorkoutPlan) {
    const copy: WorkoutPlan = {
      ...plan, id: uid(), name: `${plan.name} (cópia)`, createdAt: Date.now(), updatedAt: Date.now(),
      days: plan.days.map(d => {
        const idMap = new Map<string, string>();
        const exercises = d.exercises.map(e => { const id = uid(); idMap.set(e.id, id); return { ...e, id }; })
          .map(e => ({ ...e, biSetWithId: e.biSetWithId ? idMap.get(e.biSetWithId) : undefined }));
        return { ...d, id: uid(), exercises };
      }),
    };
    savePlan(copy);
    setPlans(getPlans().sort((a, b) => b.updatedAt - a.updatedAt));
  }

  return (
    <div className="page animate-fade-in">
      <div className="page-header">
        <div style={{ flex: 1 }}>
          <div className="label-xs" style={{ marginBottom: 4 }}>Treinos</div>
          <h1 className="page-title">Fichas</h1>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => onNavigate({ screen: 'plan-new' })}><PlusIcon size={16} /> Nova</button>
      </div>

      <div className="page-inner">
        {plans.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <ClipboardIcon size={40} style={{ color: '#525259', margin: '0 auto 16px' }} />
            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Nenhuma ficha criada</div>
            <div style={{ fontSize: 13, color: '#6b6b73', marginBottom: 24 }}>Monte sua ficha com divisão A/B/C e exercícios.</div>
            <button className="btn btn-primary" onClick={() => onNavigate({ screen: 'plan-new' })}><PlusIcon size={16} /> Criar ficha</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {plans.map(plan => {
              const next = suggestNextDay(plan.id);
              return (
                <div key={plan.id} className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button style={{ flex: 1, textAlign: 'left', minWidth: 0 }} onClick={() => onNavigate({ screen: 'plan-detail', planId: plan.id })}>
                      <div style={{ fontSize: 16, fontWeight: 500 }}>{plan.name}</div>
                      {plan.goal && <div style={{ fontSize: 13, color: '#6b6b73', marginTop: 2 }}>{plan.goal}</div>}
                    </button>
                    <button className="icon-btn" onClick={() => duplicate(plan)} aria-label="Duplicar ficha"><CopyIcon size={18} /></button>
                    <button className="icon-btn" onClick={() => onNavigate({ screen: 'plan-detail', planId: plan.id })} aria-label="Editar ficha"><ChevronRightIcon size={18} /></button>
                  </div>
                  {plan.days.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                      {plan.days.map(day => (
                        <button key={day.id} className={`chip ${next === day.id ? 'on' : ''}`} disabled={day.exercises.length === 0}
                          style={{ opacity: day.exercises.length === 0 ? 0.4 : 1 }}
                          onClick={() => onNavigate({ screen: 'workout', planId: plan.id, dayId: day.id })}>
                          <PlayIcon size={12} />&nbsp;{day.label} · {day.exercises.length}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
