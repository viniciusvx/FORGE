import { STARTER_EXERCISES } from './data/starterExercises';
import { ANATOMY_EXERCISES, resolveAnatomy, norm, getAnatomy } from './anatomy/data';
import { MY_PLAN_DAYS, MY_PLAN_GOAL, MY_PLAN_NAME } from './data/myPlan';
import type { MyPlanItem } from './data/myPlan';
import type { Exercise, WorkoutPlan, WorkoutSession, BodyMeasurement, UserPrefs } from './types';

const KEYS = {
  exercises: 'forge.exercises.v1',
  plans: 'forge.plans.v1',
  sessions: 'forge.sessions.v1',
  measurements: 'forge.measurements.v1',
  prefs: 'forge.prefs.v1',
  activeSession: 'forge.active-session.v1',
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function getExercises(): Exercise[] {
  return read<Exercise[]>(KEYS.exercises, []);
}
export function saveExercise(ex: Exercise): void {
  const list = getExercises().filter(e => e.id !== ex.id);
  write(KEYS.exercises, [...list, ex]);
}
export function deleteExercise(id: string): void {
  write(KEYS.exercises, getExercises().filter(e => e.id !== id));
}
export function getExercise(id: string): Exercise | undefined {
  return getExercises().find(e => e.id === id);
}

export function getPlans(): WorkoutPlan[] {
  return read<WorkoutPlan[]>(KEYS.plans, []);
}
export function savePlan(plan: WorkoutPlan): void {
  const list = getPlans().filter(p => p.id !== plan.id);
  write(KEYS.plans, [...list, plan]);
}
export function deletePlan(id: string): void {
  write(KEYS.plans, getPlans().filter(p => p.id !== id));
}
export function getPlan(id: string): WorkoutPlan | undefined {
  return getPlans().find(p => p.id === id);
}

export function getSessions(): WorkoutSession[] {
  return read<WorkoutSession[]>(KEYS.sessions, []).sort((a, b) => b.startedAt - a.startedAt);
}
export function saveSession(session: WorkoutSession): void {
  const list = getSessions().filter(s => s.id !== session.id);
  write(KEYS.sessions, [...list, session]);
}
export function getSession(id: string): WorkoutSession | undefined {
  return getSessions().find(s => s.id === id);
}

export function getActiveSession(): WorkoutSession | null {
  return read<WorkoutSession | null>(KEYS.activeSession, null);
}
export function saveActiveSession(session: WorkoutSession | null): void {
  if (session === null) {
    localStorage.removeItem(KEYS.activeSession);
  } else {
    write(KEYS.activeSession, session);
  }
}

export function getMeasurements(): BodyMeasurement[] {
  return read<BodyMeasurement[]>(KEYS.measurements, []).sort((a, b) => b.date - a.date);
}
export function saveMeasurement(m: BodyMeasurement): void {
  const list = getMeasurements().filter(x => x.id !== m.id);
  write(KEYS.measurements, [...list, m]);
}
export function deleteMeasurement(id: string): void {
  write(KEYS.measurements, getMeasurements().filter(m => m.id !== id));
}

const DEFAULT_PREFS: UserPrefs = {
  weightUnit: 'kg',
  restTimerDefault: 90,
  showRIR: true,
  showRPE: false,
};
export function getPrefs(): UserPrefs {
  return { ...DEFAULT_PREFS, ...read<Partial<UserPrefs>>(KEYS.prefs, {}) };
}
export function savePrefs(prefs: UserPrefs): void {
  write(KEYS.prefs, prefs);
}

export function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function exportAllData(): string {
  return JSON.stringify({
    version: 1,
    exportedAt: Date.now(),
    exercises: getExercises(),
    plans: getPlans(),
    sessions: getSessions(),
    measurements: getMeasurements(),
    prefs: getPrefs(),
  }, null, 2);
}

export function importAllData(json: string): void {
  const data = JSON.parse(json);
  if (data.exercises) write(KEYS.exercises, data.exercises);
  if (data.plans) write(KEYS.plans, data.plans);
  if (data.sessions) write(KEYS.sessions, data.sessions);
  if (data.measurements) write(KEYS.measurements, data.measurements);
  if (data.prefs) write(KEYS.prefs, data.prefs);
}

export function getLastSessionForDay(planId: string, dayId: string): WorkoutSession | undefined {
  return getSessions().find(s => s.planId === planId && s.dayId === dayId && s.finishedAt != null);
}

export function getPRForExercise(exerciseId: string): number {
  let pr = 0;
  for (const session of getSessions()) {
    for (const log of session.exercises) {
      if (log.exerciseId !== exerciseId) continue;
      for (const set of log.sets) {
        if (set.done && set.weight > pr) pr = set.weight;
      }
    }
  }
  return pr;
}

export function deleteSession(id: string): void {
  write(KEYS.sessions, getSessions().filter(s => s.id !== id));
}

export function addStarterExercises(): number {
  const have = new Set(getExercises().map(e => e.name.toLowerCase()));
  const now = Date.now();
  const fresh = STARTER_EXERCISES.filter(e => !have.has(e.name.toLowerCase())).map((e, i) => ({
    id: `${uid()}-${i}`,
    name: e.name,
    muscleGroup: e.muscleGroup,
    secondaryMuscles: [],
    equipment: e.equipment,
    notes: '',
    createdAt: now + i,
  }));
  write(KEYS.exercises, [...getExercises(), ...fresh]);
  return fresh.length;
}

export function getLastPerformance(exerciseId: string, excludeSessionId?: string) {
  for (const session of getSessions()) {
    if (session.finishedAt == null || session.id === excludeSessionId) continue;
    const log = session.exercises.find(l => l.exerciseId === exerciseId && l.sets.some(s => s.done && !s.warmup));
    if (log) return { date: session.startedAt, sets: log.sets.filter(s => s.done && !s.warmup) };
  }
  return undefined;
}

export function estimate1RM(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0;
  return reps === 1 ? weight : weight * (1 + reps / 30);
}

export function getExerciseRecords(exerciseId: string, excludeSessionId?: string) {
  let maxWeight = 0, maxWeightDate = 0, best1RM = 0, maxVolume = 0;
  for (const session of getSessions()) {
    if (session.finishedAt == null || session.id === excludeSessionId) continue;
    for (const log of session.exercises) {
      if (log.exerciseId !== exerciseId) continue;
      let vol = 0;
      for (const set of log.sets) {
        if (!set.done || set.warmup) continue;
        vol += set.weight * set.reps;
        if (set.weight > maxWeight) { maxWeight = set.weight; maxWeightDate = session.startedAt; }
        best1RM = Math.max(best1RM, estimate1RM(set.weight, set.reps));
      }
      maxVolume = Math.max(maxVolume, vol);
    }
  }
  return { maxWeight, maxWeightDate, best1RM, maxVolume };
}

export function suggestNextDay(planId: string): string | undefined {
  const plan = getPlan(planId);
  if (!plan || plan.days.length === 0) return undefined;
  const last = getSessions().find(s => s.planId === planId && s.finishedAt != null);
  if (!last) return plan.days[0].id;
  const idx = plan.days.findIndex(d => d.id === last.dayId);
  return plan.days[(idx + 1) % plan.days.length].id;
}

export function addRoutineExercises(): number {
  const existing = getExercises();
  const now = Date.now();
  const fresh = ANATOMY_EXERCISES.filter(a => !a.pending && !existing.some(e => resolveAnatomy(e)?.key === a.key)).map((a, i) => ({
    id: `${uid()}-r${i}`,
    name: a.name,
    muscleGroup: a.group,
    secondaryMuscles: [],
    equipment: a.equipment,
    notes: '',
    createdAt: now + i,
    mapKey: a.key,
  }));
  write(KEYS.exercises, [...existing, ...fresh]);
  return fresh.length;
}

const SEED_FLAG = 'forge.seed.minhaficha.v2';

export function hasMyPlan(): boolean {
  return getPlans().some(p => p.name === MY_PLAN_NAME);
}

function writeMyPlan(): void {
  const exercises = getExercises();
  const now = Date.now();
  const byName = new Map(exercises.map(e => [norm(e.name), e]));
  const ensure = (it: MyPlanItem): Exercise => {
    const found = byName.get(norm(it.name));
    if (found) {
      if (!found.mapKey) found.mapKey = it.key;
      return found;
    }
    const a = getAnatomy(it.key);
    const ex: Exercise = {
      id: uid(), name: it.name, muscleGroup: a?.group ?? 'other', secondaryMuscles: [],
      equipment: it.equipment ?? a?.equipment ?? 'other', notes: '', createdAt: now, mapKey: it.key,
    };
    exercises.push(ex);
    byName.set(norm(ex.name), ex);
    return ex;
  };
  const prev = getPlans().find(p => p.name === MY_PLAN_NAME);
  const days = MY_PLAN_DAYS.map(d => ({
    id: prev?.days.find(x => x.weekday === d.weekday)?.id ?? uid(),
    label: d.label,
    weekday: d.weekday,
    exercises: d.items.map(it => ({
      id: uid(),
      exerciseId: ensure(it).id,
      sets: it.sets,
      repsMin: it.repsMin,
      repsMax: it.repsMax,
      restSeconds: 90,
      technique: 'normal' as const,
      notes: '',
      warmupSets: it.warmup ?? 0,
    })),
  }));
  const plan: WorkoutPlan = {
    id: prev?.id ?? uid(), name: MY_PLAN_NAME, goal: MY_PLAN_GOAL, days,
    createdAt: prev?.createdAt ?? now, updatedAt: now,
  };
  write(KEYS.exercises, exercises);
  write(KEYS.plans, [...getPlans().filter(p => p.id !== plan.id), plan]);
}

export function seedMyPlan(): void {
  writeMyPlan();
}

export function seedMyPlanOnce(): void {
  try {
    if (localStorage.getItem(SEED_FLAG)) return;
    writeMyPlan();
    localStorage.setItem(SEED_FLAG, '1');
  } catch {}
}
