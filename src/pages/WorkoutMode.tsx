import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { View, WorkoutPlan, PlanDay, WorkoutSession, ExerciseLog, SetRecord } from '../types';
import {
  getPlans, getPlan, getExercise, getActiveSession, saveActiveSession, saveSession,
  getLastSessionForDay, getLastPerformance, getExerciseRecords, suggestNextDay, uid, getPrefs,
} from '../store';
import { ChevronLeftIcon, CheckIcon, TimerIcon, PlusIcon, XIcon, StopIcon, ChevronRightIcon, DumbbellIcon } from '../components/Icons';
import Sheet from '../components/Sheet';
import ExercisePicker from '../components/ExercisePicker';

interface Props {
  planId?: string;
  dayId?: string;
  onNavigate: (v: View) => void;
}

const REST_KEY = 'forge.rest';
interface RestState { duration: number; endAt: number | null; pausedLeft: number | null; total: number; }

function readRest(fallback: number): RestState {
  try {
    const raw = localStorage.getItem(REST_KEY);
    if (raw) {
      const r = JSON.parse(raw) as RestState;
      if (r.endAt && r.endAt < Date.now()) return { ...r, endAt: null };
      return r;
    }
  } catch {}
  return { duration: fallback, endAt: null, pausedLeft: null, total: fallback };
}

const fmtClock = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

function RestDock({ defaultSeconds, trigger }: { defaultSeconds: number; trigger: { key: number; seconds: number } | null }) {
  const [st, setSt] = useState<RestState>(() => readRest(defaultSeconds));
  const [now, setNow] = useState(Date.now());
  const [flash, setFlash] = useState(false);

  function update(next: RestState) {
    setSt(next);
    try { localStorage.setItem(REST_KEY, JSON.stringify(next)); } catch {}
  }

  const running = st.endAt != null;
  const paused = st.pausedLeft != null;
  const active = running || paused;

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    if (trigger) {
      setFlash(false);
      update({ duration: st.duration, endAt: Date.now() + trigger.seconds * 1000, pausedLeft: null, total: trigger.seconds });
    }
  }, [trigger?.key]);

  const remaining = running ? Math.max(0, Math.ceil(((st.endAt as number) - now) / 1000)) : paused ? (st.pausedLeft as number) : st.duration;

  useEffect(() => {
    if (running && remaining <= 0) {
      try { navigator.vibrate?.([200, 100, 200, 100, 300]); } catch {}
      setFlash(true);
      update({ ...st, endAt: null, pausedLeft: null });
    }
  }, [running, remaining]);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(false), 2500);
    return () => clearTimeout(t);
  }, [flash]);

  function tap() {
    setFlash(false);
    if (running) update({ ...st, endAt: null, pausedLeft: remaining });
    else if (paused) update({ ...st, endAt: Date.now() + (st.pausedLeft as number) * 1000, pausedLeft: null });
    else update({ ...st, endAt: Date.now() + st.duration * 1000, total: st.duration });
  }

  function adjust(delta: number) {
    if (running) {
      update({ ...st, endAt: Math.max(Date.now() + 1000, (st.endAt as number) + delta * 1000), total: Math.max(1, st.total + delta) });
    } else if (paused) {
      update({ ...st, pausedLeft: Math.max(1, (st.pausedLeft as number) + delta), total: Math.max(1, st.total + delta) });
    } else {
      const d = Math.min(600, Math.max(15, st.duration + delta));
      update({ ...st, duration: d, total: d });
    }
  }

  function stop() {
    setFlash(false);
    update({ ...st, endAt: null, pausedLeft: null });
  }

  const size = 72, r = 32, circ = 2 * Math.PI * r;
  const pct = active ? Math.min(1, remaining / Math.max(1, st.total)) : 1;
  const gold = '#C8A96E';
  const side: React.CSSProperties = {
    width: 48, height: 48, borderRadius: 24, background: 'rgba(30,30,38,0.96)', border: '1px solid rgba(255,255,255,0.12)',
    color: '#EFEDE7', fontSize: 15, fontWeight: 600, fontVariantNumeric: 'tabular-nums', boxShadow: '0 6px 20px rgba(0,0,0,0.45)',
  };

  return createPortal(
    <div style={{
      position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 90, pointerEvents: 'none',
      paddingBottom: 'calc(10px + env(safe-area-inset-bottom))', paddingTop: 8,
      background: 'rgba(14,14,18,0.97)', borderTop: '1px solid rgba(200,169,110,0.25)', backdropFilter: 'blur(12px)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 6, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: flash ? '#4CAF7A' : gold }}>
        <span>{flash ? 'Hora da próxima série' : running ? 'Descanso · toque p/ pausar' : paused ? 'Pausado · toque p/ continuar' : 'Descanso · toque p/ iniciar'}</span>
        {active && <button onClick={stop} style={{ pointerEvents: 'auto', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8a8a92', textDecoration: 'underline' }}>Parar</button>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
        <button style={{ ...side, pointerEvents: 'auto' }} onClick={() => adjust(-15)} aria-label="Menos 15 segundos">−15</button>
        <button onClick={tap} aria-label="Timer de descanso" style={{
          pointerEvents: 'auto', position: 'relative', width: size, height: size, borderRadius: size / 2,
          background: flash ? '#4CAF7A' : running ? '#1a1a21' : gold, color: running ? '#EFEDE7' : '#0A0A0D',
          boxShadow: '0 8px 28px rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {active && (
            <svg width={size} height={size} style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
              <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={4} />
              <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={paused ? '#8a8a92' : gold} strokeWidth={4}
                strokeDasharray={`${circ * pct} ${circ}`} strokeLinecap="round" />
            </svg>
          )}
          <span style={{ position: 'relative', fontFamily: "'Fraunces', serif", fontSize: 21, fontWeight: 400, fontVariantNumeric: 'tabular-nums' }}>
            {flash ? 'Vai!' : fmtClock(remaining)}
          </span>
        </button>
        <button style={{ ...side, pointerEvents: 'auto' }} onClick={() => adjust(15)} aria-label="Mais 15 segundos">+15</button>
      </div>
    </div>,
    document.body
  );
}

interface PlanPickerProps {
  plans: WorkoutPlan[];
  onSelect: (plan: WorkoutPlan, day: PlanDay) => void;
  onFree: () => void;
  onClose: () => void;
}

function PlanPicker({ plans, onSelect, onFree, onClose }: PlanPickerProps) {
  const [selected, setSelected] = useState<WorkoutPlan | null>(null);

  if (selected) {
    const next = suggestNextDay(selected.id);
    return (
      <Sheet title={selected.name} onClose={onClose}>
        <div style={{ padding: '0 20px 8px' }}>
          <button className="chip" style={{ marginBottom: 8 }} onClick={() => setSelected(null)}><ChevronLeftIcon size={14} /> Outras fichas</button>
          {selected.days.length === 0 && <div style={{ color: '#6b6b73', fontSize: 14, padding: '12px 0' }}>Esta ficha ainda não tem dias.</div>}
          {selected.days.map(day => (
            <button key={day.id} className="row-btn" onClick={() => onSelect(selected, day)}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '0.04em' }}>
                  {day.label} {next === day.id && <span className="badge badge-amber" style={{ marginLeft: 6 }}>próximo</span>}
                </div>
                <div style={{ fontSize: 13, color: '#6b6b73', marginTop: 2 }}>{day.exercises.length} exercícios</div>
              </div>
              <ChevronRightIcon size={18} style={{ color: '#525259' }} />
            </button>
          ))}
        </div>
      </Sheet>
    );
  }

  return (
    <Sheet title="Qual treino hoje?" onClose={onClose}>
      <div style={{ padding: '0 20px 8px' }}>
        {plans.map(plan => (
          <button key={plan.id} className="row-btn" onClick={() => setSelected(plan)}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 500 }}>{plan.name}</div>
              <div style={{ fontSize: 13, color: '#6b6b73', marginTop: 2 }}>{plan.days.map(d => d.label).join(' · ') || 'sem dias'}</div>
            </div>
            <ChevronRightIcon size={18} style={{ color: '#525259' }} />
          </button>
        ))}
        <button className="row-btn" onClick={onFree}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 500, color: '#C8A96E' }}>Treino livre</div>
            <div style={{ fontSize: 13, color: '#6b6b73', marginTop: 2 }}>Sem ficha: escolha os exercícios na hora</div>
          </div>
          <PlusIcon size={18} style={{ color: '#C8A96E' }} />
        </button>
      </div>
    </Sheet>
  );
}

function fmtSet(s: SetRecord) {
  return `${s.weight ? `${s.weight}${s.unit}` : 'PC'}×${s.reps}`;
}

function makeSets(count: number, exerciseId: string, unit: 'kg' | 'lb'): SetRecord[] {
  const last = getLastPerformance(exerciseId);
  return Array.from({ length: count }, (_, i) => {
    const prev = last?.sets[i] ?? last?.sets[last.sets.length - 1];
    return { reps: prev?.reps ?? 0, weight: prev?.weight ?? 0, unit, done: false };
  });
}

interface SetRowProps {
  label: string;
  set: SetRecord;
  prefs: ReturnType<typeof getPrefs>;
  onChange: (s: SetRecord) => void;
  onDone: () => void;
}

function SetRow({ label, set, prefs, onChange, onDone }: SetRowProps) {
  const cols = 2 + (prefs.showRIR ? 1 : 0) + (prefs.showRPE ? 1 : 0);
  const num = (v: string, int: boolean) => (v === '' ? undefined : int ? parseInt(v) : parseFloat(v));
  return (
    <div className="set-row" style={{ ['--cols' as string]: cols, opacity: set.done ? 0.7 : 1 }}>
      <div className="label-xs" style={{ textAlign: 'center', color: set.warmup ? '#5E9BC4' : '#4CAF7A' }}>{label}</div>
      <input type="number" className="set-input" inputMode="decimal" placeholder="0" value={set.weight || ''}
        onChange={e => onChange({ ...set, weight: num(e.target.value, false) ?? 0 })} aria-label="Carga" />
      <input type="number" className="set-input" inputMode="numeric" placeholder="0" value={set.reps || ''}
        onChange={e => onChange({ ...set, reps: num(e.target.value, true) ?? 0 })} aria-label="Repetições" />
      {prefs.showRIR && (
        <input type="number" className="set-input" inputMode="numeric" placeholder="—" value={set.rir ?? ''}
          onChange={e => onChange({ ...set, rir: num(e.target.value, true) })} aria-label="RIR" />
      )}
      {prefs.showRPE && (
        <input type="number" className="set-input" inputMode="decimal" placeholder="—" value={set.rpe ?? ''}
          onChange={e => onChange({ ...set, rpe: num(e.target.value, false) })} aria-label="RPE" />
      )}
      <button className={`set-done ${set.done ? 'checked' : ''}`} onClick={onDone} aria-label="Concluir série"
        style={{ animation: set.done ? 'ring-pulse 0.4s ease' : undefined }}>
        <CheckIcon size={18} />
      </button>
    </div>
  );
}

function buildSession(plan: WorkoutPlan | null, day: PlanDay | null, unit: 'kg' | 'lb'): WorkoutSession {
  const exercises: ExerciseLog[] = day
    ? day.exercises.map(pe => {
        const warm: SetRecord[] = Array.from({ length: pe.warmupSets ?? 0 }, () => ({ reps: 0, weight: 0, unit, done: false, warmup: true }));
        return { plannedExerciseId: pe.id, exerciseId: pe.exerciseId, sets: [...warm, ...makeSets(pe.sets, pe.exerciseId, unit)] };
      })
    : [];
  const prev = plan && day ? getLastSessionForDay(plan.id, day.id) : undefined;
  if (prev) {
    for (const log of exercises) {
      const old = prev.exercises.find(l => l.plannedExerciseId === log.plannedExerciseId);
      if (old) log.sets = log.sets.map((s, i) => ({ ...s, reps: old.sets[i]?.reps ?? s.reps, weight: old.sets[i]?.weight ?? s.weight }));
    }
  }
  return {
    id: uid(),
    planId: plan?.id ?? 'free',
    planName: plan?.name ?? 'Treino livre',
    dayId: day?.id ?? 'free',
    dayLabel: day?.label ?? 'Livre',
    startedAt: Date.now(),
    exercises,
    notes: '',
  };
}

export default function WorkoutMode({ planId, dayId, onNavigate }: Props) {
  const plans = getPlans();
  const prefs = getPrefs();

  const [session, setSessionRaw] = useState<WorkoutSession | null>(() => {
    const active = getActiveSession();
    if (active) return active;
    if (planId && dayId) {
      const plan = getPlan(planId);
      const day = plan?.days.find(d => d.id === dayId);
      if (plan && day) {
        const s = buildSession(plan, day, prefs.weightUnit);
        saveActiveSession(s);
        return s;
      }
    }
    return null;
  });
  const [showPicker, setShowPicker] = useState(false);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [timer, setTimer] = useState<{ key: number; seconds: number } | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [confirmFinish, setConfirmFinish] = useState(false);

  useEffect(() => {
    if (!session) return;
    const tick = () => setElapsed(Math.floor((Date.now() - session.startedAt) / 1000));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [session?.id]);

  useEffect(() => {
    if (!session) return;
    let lock: { release: () => Promise<void> } | null = null;
    const request = async () => {
      try {
        const wl = (navigator as unknown as { wakeLock?: { request: (t: string) => Promise<{ release: () => Promise<void> }> } }).wakeLock;
        if (wl && document.visibilityState === 'visible') lock = await wl.request('screen');
      } catch {}
    };
    request();
    document.addEventListener('visibilitychange', request);
    return () => { document.removeEventListener('visibilitychange', request); lock?.release().catch(() => {}); };
  }, [session?.id]);

  function persist(s: WorkoutSession | null) {
    setSessionRaw(s);
    saveActiveSession(s);
  }

  function startFromPlan(plan: WorkoutPlan, day: PlanDay) {
    persist(buildSession(plan, day, prefs.weightUnit));
    setShowPicker(false);
  }

  function startFree() {
    persist(buildSession(null, null, prefs.weightUnit));
    setShowPicker(false);
    setShowAddExercise(true);
  }

  function mapLog(ei: number, fn: (l: ExerciseLog) => ExerciseLog) {
    if (!session) return;
    persist({ ...session, exercises: session.exercises.map((l, i) => i === ei ? fn(l) : l) });
  }

  function markSetDone(ei: number, si: number) {
    if (!session) return;
    const log = session.exercises[ei];
    const becoming = !log.sets[si].done;
    mapLog(ei, l => ({ ...l, sets: l.sets.map((s, i) => i === si ? { ...s, done: !s.done } : s) }));
    if (becoming && !log.sets[si].warmup) {
      const plan = getPlan(session.planId);
      const pe = plan?.days.find(d => d.id === session.dayId)?.exercises.find(e => e.id === log.plannedExerciseId);
      const rest = pe?.restSeconds ?? prefs.restTimerDefault;
      if (rest > 0) setTimer({ key: Date.now(), seconds: rest });
    }
  }

  function addSet(ei: number) {
    mapLog(ei, l => {
      const last = l.sets[l.sets.length - 1];
      return { ...l, sets: [...l.sets, { reps: last?.reps ?? 0, weight: last?.weight ?? 0, unit: prefs.weightUnit, done: false }] };
    });
  }

  function removeLastSet(ei: number) {
    mapLog(ei, l => ({ ...l, sets: l.sets.slice(0, -1) }));
  }

  function removeExercise(ei: number) {
    if (!session) return;
    persist({ ...session, exercises: session.exercises.filter((_, i) => i !== ei) });
  }

  function addExerciseToSession(exerciseId: string) {
    setSessionRaw(prev => {
      if (!prev) return prev;
      const next = {
        ...prev,
        exercises: [...prev.exercises, { plannedExerciseId: uid(), exerciseId, sets: makeSets(3, exerciseId, prefs.weightUnit) }],
      };
      saveActiveSession(next);
      return next;
    });
  }

  function finishWorkout() {
    if (!session) return;
    const prs: string[] = [];
    const cleaned = session.exercises
      .map(l => ({ ...l, sets: l.sets.filter(s => s.done || s.weight > 0 || s.reps > 0) }))
      .filter(l => l.sets.length > 0);
    for (const log of cleaned) {
      const best = log.sets.filter(s => s.done && !s.warmup).reduce((m, s) => Math.max(m, s.weight), 0);
      const before = getExerciseRecords(log.exerciseId, session.id);
      if (best > 0 && before.maxWeight > 0 && best > before.maxWeight) prs.push(log.exerciseId);
    }
    const finished: WorkoutSession = {
      ...session, exercises: cleaned, prs,
      finishedAt: Date.now(), durationSeconds: Math.floor((Date.now() - session.startedAt) / 1000),
    };
    saveSession(finished);
    saveActiveSession(null);
    setSessionRaw(null);
    onNavigate({ screen: 'session-detail', sessionId: finished.id });
  }

  function discardWorkout() {
    saveActiveSession(null);
    setSessionRaw(null);
    onNavigate({ screen: 'home' });
  }

  function fmtElapsed(s: number) {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}` : `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }

  const backBtn = (
    <button className="icon-btn" onClick={() => onNavigate({ screen: 'home' })} aria-label="Voltar"><ChevronLeftIcon size={22} /></button>
  );

  if (!session) {
    return (
      <div className="page no-nav animate-fade-in">
        <div className="page-header">{backBtn}<div><div className="label-xs" style={{ marginBottom: 4 }}>Treinar</div><h1 className="page-title">Novo treino</h1></div></div>
        <div className="page-inner" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {plans.length > 0 && (
            <button className="btn btn-primary btn-lg btn-full" onClick={() => setShowPicker(true)}><DumbbellIcon size={20} /> Escolher ficha</button>
          )}
          <button className={`btn ${plans.length > 0 ? 'btn-ghost' : 'btn-primary'} btn-lg btn-full`} onClick={startFree}>Treino livre</button>
          {plans.length === 0 && (
            <button className="btn btn-outline btn-full" onClick={() => onNavigate({ screen: 'plan-new' })}>Criar uma ficha</button>
          )}
          <div style={{ fontSize: 13, color: '#6b6b73', lineHeight: 1.5 }}>
            Treino livre: você escolhe os exercícios na hora, sem precisar de ficha. Fica salvo no histórico igual aos outros.
          </div>
        </div>
        {showPicker && <PlanPicker plans={plans} onSelect={startFromPlan} onFree={startFree} onClose={() => setShowPicker(false)} />}
        {showAddExercise && <ExercisePicker onAdd={addExerciseToSession} onClose={() => setShowAddExercise(false)} />}
      </div>
    );
  }

  const plan = getPlan(session.planId);
  const planDay = plan?.days.find(d => d.id === session.dayId);

  return (
    <div className="page no-nav animate-fade-in" style={{ paddingBottom: 'calc(130px + env(safe-area-inset-bottom))' }}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 20, background: 'rgba(10,10,13,0.94)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '10px 12px 10px 8px', paddingTop: 'calc(10px + env(safe-area-inset-top))',
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 4 }}>
          {backBtn}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="label-xs" style={{ color: '#C8A96E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.planName}</div>
            <div style={{ fontSize: 18, fontFamily: "'Fraunces', serif", fontWeight: 300 }}>{session.dayLabel}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#8a8a92', fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>
            <TimerIcon size={15} />{fmtElapsed(elapsed)}
          </div>
          <button className="btn btn-danger btn-sm" style={{ marginLeft: 8 }} onClick={() => setConfirmFinish(true)}>
            <StopIcon size={14} /> Fim
          </button>
        </div>
      </div>

      <div className="page-inner" style={{ paddingTop: 16 }}>
        <div style={{ fontSize: 12, color: '#6b6b73', marginBottom: 12 }}>P = preparatória (não conta no volume) · números = séries válidas</div>
        {session.exercises.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 28, marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>Nenhum exercício ainda</div>
            <div style={{ fontSize: 13, color: '#6b6b73' }}>Toque em "Adicionar exercício" abaixo.</div>
          </div>
        )}

        {session.exercises.map((log, ei) => {
          const ex = getExercise(log.exerciseId);
          const pe = planDay?.exercises.find(e => e.id === log.plannedExerciseId);
          const partner = pe?.biSetWithId ? planDay?.exercises.find(e => e.id === pe.biSetWithId) : undefined;
          const last = getLastPerformance(log.exerciseId, session.id);
          const record = getExerciseRecords(log.exerciseId, session.id);
          const doneCount = log.sets.filter(s => s.done && !s.warmup).length;
          const workingCount = log.sets.filter(s => !s.warmup).length;
          let n = 0;
          const labels = log.sets.map(s => (s.warmup ? 'P' : String(++n)));
          const cols = 2 + (prefs.showRIR ? 1 : 0) + (prefs.showRPE ? 1 : 0);

          return (
            <div key={log.plannedExerciseId} style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8, gap: 8 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 17, fontWeight: 600 }}>{ex?.name ?? 'Exercício removido'}</div>
                  <div style={{ fontSize: 12, color: doneCount === workingCount && doneCount > 0 ? '#4CAF7A' : '#6b6b73', marginTop: 2 }}>
                    {doneCount}/{workingCount} séries
                    {pe && ` · meta ${pe.repsMin}–${pe.repsMax} reps`}
                    {pe && pe.technique !== 'normal' && ` · ${pe.technique}`}
                    {partner && ` com ${getExercise(partner.exerciseId)?.name}`}
                  </div>
                </div>
                <div style={{ display: 'flex', flexShrink: 0 }}>
                  <button className="icon-btn" style={{ width: 36, height: 36 }} onClick={() => removeExercise(ei)} aria-label="Remover exercício"><XIcon size={16} /></button>
                </div>
              </div>

              {(last || record.maxWeight > 0) && (
                <div style={{ fontSize: 12, color: '#8a8a92', marginBottom: 8, lineHeight: 1.5 }}>
                  {last && <>Última vez: {last.sets.map(fmtSet).join(' · ')}<br /></>}
                  {record.maxWeight > 0 && <>Recorde: {record.maxWeight}{prefs.weightUnit}</>}
                </div>
              )}
              {pe?.notes && <div style={{ fontSize: 12, color: '#C8A96E', marginBottom: 8 }}>{pe.notes}</div>}

              <div className="set-row" style={{ ['--cols' as string]: cols, borderBottom: 'none', paddingBottom: 0 }}>
                <div />
                <div className="label-xs" style={{ textAlign: 'center' }}>{prefs.weightUnit}</div>
                <div className="label-xs" style={{ textAlign: 'center' }}>reps</div>
                {prefs.showRIR && <div className="label-xs" style={{ textAlign: 'center' }}>RIR</div>}
                {prefs.showRPE && <div className="label-xs" style={{ textAlign: 'center' }}>RPE</div>}
                <div />
              </div>

              {log.sets.map((set, si) => (
                <SetRow key={si} label={labels[si]} set={set} prefs={prefs}
                  onChange={u => mapLog(ei, l => ({ ...l, sets: l.sets.map((s, i) => i === si ? u : s) }))}
                  onDone={() => markSetDone(ei, si)} />
              ))}

              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => addSet(ei)}><PlusIcon size={14} /> Série</button>
                {log.sets.length > 1 && (
                  <button className="btn btn-ghost btn-sm" onClick={() => removeLastSet(ei)}>− Série</button>
                )}
              </div>
            </div>
          );
        })}

        <button className="btn btn-outline btn-full" style={{ marginBottom: 20 }} onClick={() => setShowAddExercise(true)}>
          <PlusIcon size={16} /> Adicionar exercício
        </button>

        <div style={{ marginBottom: 20 }}>
          <label className="label-xs" style={{ display: 'block', marginBottom: 6 }}>Observações do treino</label>
          <textarea className="field" style={{ resize: 'none' }} placeholder="Como foi o treino, dores, energia..."
            value={session.notes} onChange={e => persist({ ...session, notes: e.target.value })} />
        </div>

        <button className="btn btn-primary btn-full btn-lg" style={{ marginBottom: 24 }} onClick={() => setConfirmFinish(true)}>
          Encerrar treino · {fmtElapsed(elapsed)}
        </button>
      </div>

      <RestDock defaultSeconds={prefs.restTimerDefault} trigger={timer} />
      {showAddExercise && <ExercisePicker onAdd={addExerciseToSession} onClose={() => setShowAddExercise(false)} />}

      {confirmFinish && (
        <Sheet onClose={() => setConfirmFinish(false)}>
          <div style={{ padding: '12px 20px 4px' }}>
            <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 8 }}>Encerrar treino?</div>
            <div style={{ fontSize: 14, color: 'rgba(239,237,231,0.55)', marginBottom: 20 }}>
              Séries sem marcar e sem carga/reps serão ignoradas. O treino vai para o histórico.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button className="btn btn-primary btn-full" onClick={finishWorkout}>Salvar e encerrar</button>
              <button className="btn btn-danger btn-full" onClick={discardWorkout}>Descartar treino</button>
              <button className="btn btn-ghost btn-full" onClick={() => setConfirmFinish(false)}>Continuar treinando</button>
            </div>
          </div>
        </Sheet>
      )}
    </div>
  );
}
