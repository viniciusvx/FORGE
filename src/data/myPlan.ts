import type { Equipment } from '../types';

export interface MyPlanItem {
  name: string;
  key: string;
  equipment?: Equipment;
  sets: number;
  repsMin: number;
  repsMax: number;
  warmup?: number;
}
export interface MyPlanDay { label: string; weekday: number; items: MyPlanItem[]; }

export const MY_PLAN_NAME = 'Minha ficha';
export const MY_PLAN_GOAL = 'Preparatórias: 2 no primeiro exercício pesado do grupo, sem chegar perto da falha, sem contar no volume. Válidas: 1ª 2–3 RIR, 2ª 1–2 RIR, 3ª 0–1 RIR. Pernas (Smith, terra): 1–2 RIR na última.';

export const MY_PLAN_DAYS: MyPlanDay[] = [
  {
    label: 'SEG · Peito e tríceps', weekday: 1,
    items: [
      { name: 'Supino inclinado com halteres', key: 'supino-inclinado', equipment: 'dumbbell', sets: 3, repsMin: 6, repsMax: 12, warmup: 2 },
      { name: 'Supino reto com halteres', key: 'supino-reto', equipment: 'dumbbell', sets: 3, repsMin: 6, repsMax: 12 },
      { name: 'Peck deck', key: 'peck-deck', equipment: 'machine', sets: 2, repsMin: 10, repsMax: 15 },
      { name: 'Extensão de tríceps acima da cabeça', key: 'triceps-overhead', sets: 3, repsMin: 10, repsMax: 15, warmup: 2 },
      { name: 'Tríceps pulley barra V', key: 'triceps-polia-v', equipment: 'cable', sets: 2, repsMin: 10, repsMax: 15 },
    ],
  },
  {
    label: 'TER · Costas e bíceps', weekday: 2,
    items: [
      { name: 'Puxada alta', key: 'puxada-alta-polia', equipment: 'cable', sets: 3, repsMin: 8, repsMax: 12, warmup: 2 },
      { name: 'Remada aberta com apoio peitoral', key: 'remada-apoio-peitoral-aberta', equipment: 'machine', sets: 3, repsMin: 8, repsMax: 12 },
      { name: 'Remada unilateral com halter', key: 'remada-unilateral', equipment: 'dumbbell', sets: 3, repsMin: 8, repsMax: 12 },
      { name: 'Rosca Bayesian', key: 'rosca-bayesian', equipment: 'cable', sets: 3, repsMin: 10, repsMax: 15, warmup: 2 },
      { name: 'Rosca Scott', key: 'rosca-scott', sets: 2, repsMin: 8, repsMax: 12 },
    ],
  },
  {
    label: 'QUA · Pernas', weekday: 3,
    items: [
      { name: 'Agachamento Smith', key: 'agachamento-smith', equipment: 'machine', sets: 3, repsMin: 8, repsMax: 12, warmup: 2 },
      { name: 'Leg press deitado', key: 'leg-press-deitado', equipment: 'machine', sets: 3, repsMin: 8, repsMax: 12 },
      { name: 'Cadeira extensora', key: 'cadeira-extensora', equipment: 'machine', sets: 2, repsMin: 10, repsMax: 15 },
      { name: 'Cadeira flexora', key: 'cadeira-flexora', equipment: 'machine', sets: 3, repsMin: 10, repsMax: 15 },
      { name: 'Terra romeno com halteres', key: 'terra-romeno-halteres', equipment: 'dumbbell', sets: 2, repsMin: 8, repsMax: 12 },
      { name: 'Panturrilha máquina', key: 'panturrilha', equipment: 'machine', sets: 3, repsMin: 10, repsMax: 20 },
    ],
  },
  {
    label: 'SEX · Ombros e braços', weekday: 5,
    items: [
      { name: 'Elevação lateral', key: 'elevacao-lateral', equipment: 'dumbbell', sets: 3, repsMin: 12, repsMax: 20, warmup: 2 },
      { name: 'Crucifixo inverso máquina', key: 'crucifixo-invertido', equipment: 'machine', sets: 3, repsMin: 12, repsMax: 15 },
      { name: 'Tríceps testa', key: 'triceps-testa', sets: 2, repsMin: 8, repsMax: 12, warmup: 2 },
      { name: 'Extensão de tríceps acima da cabeça', key: 'triceps-overhead', sets: 2, repsMin: 10, repsMax: 15 },
      { name: 'Rosca alternada com halteres', key: 'rosca-alternada', equipment: 'dumbbell', sets: 2, repsMin: 8, repsMax: 12, warmup: 2 },
    ],
  },
  {
    label: 'SÁB · Peito e costas', weekday: 6,
    items: [
      { name: 'Supino inclinado com halteres', key: 'supino-inclinado', equipment: 'dumbbell', sets: 2, repsMin: 6, repsMax: 12, warmup: 2 },
      { name: 'Peck deck', key: 'peck-deck', equipment: 'machine', sets: 2, repsMin: 10, repsMax: 15 },
      { name: 'Puxada alta', key: 'puxada-alta-polia', equipment: 'cable', sets: 2, repsMin: 8, repsMax: 12, warmup: 2 },
      { name: 'Remada baixa máquina pegada fechada', key: 'remada-baixa-fechada', equipment: 'machine', sets: 2, repsMin: 8, repsMax: 12 },
      { name: 'Rosca inversa na polia', key: 'rosca-inversa', equipment: 'cable', sets: 2, repsMin: 12, repsMax: 15 },
    ],
  },
];
