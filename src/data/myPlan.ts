import type { Equipment } from '../types';

export interface MyPlanItem { name: string; key: string; equipment?: Equipment; }
export interface MyPlanDay { label: string; weekday: number; items: MyPlanItem[]; }

export const MY_PLAN_NAME = 'Minha ficha';
export const MY_PLAN_GOAL = 'Seg, Ter, Qua, Sex e Sáb. Descanso na quinta e no domingo.';

export const MY_PLAN_DAYS: MyPlanDay[] = [
  {
    label: 'SEG · Peito e tríceps', weekday: 1,
    items: [
      { name: 'Supino inclinado com halteres', key: 'supino-inclinado', equipment: 'dumbbell' },
      { name: 'Supino reto com halteres', key: 'supino-reto', equipment: 'dumbbell' },
      { name: 'Peck deck (ênfase inferior)', key: 'peck-deck-inferior', equipment: 'machine' },
      { name: 'Extensão de tríceps acima da cabeça', key: 'triceps-overhead' },
      { name: 'Tríceps na polia alta com barra V', key: 'triceps-polia-v', equipment: 'cable' },
    ],
  },
  {
    label: 'TER · Costas e bíceps', weekday: 2,
    items: [
      { name: 'Puxada alta na polia', key: 'puxada-alta-polia', equipment: 'cable' },
      { name: 'Remada unilateral com halter', key: 'remada-unilateral', equipment: 'dumbbell' },
      { name: 'Remada com apoio peitoral e pegada aberta', key: 'remada-apoio-peitoral-aberta', equipment: 'machine' },
      { name: 'Rosca bayesian', key: 'rosca-bayesian', equipment: 'cable' },
      { name: 'Rosca Scott', key: 'rosca-scott' },
    ],
  },
  {
    label: 'QUA · Pernas', weekday: 3,
    items: [
      { name: 'Agachamento no Smith', key: 'agachamento-smith', equipment: 'machine' },
      { name: 'Leg press deitado', key: 'leg-press-deitado', equipment: 'machine' },
      { name: 'Cadeira extensora', key: 'cadeira-extensora', equipment: 'machine' },
      { name: 'Cadeira flexora', key: 'cadeira-flexora', equipment: 'machine' },
      { name: 'Terra romeno com halteres', key: 'terra-romeno-halteres', equipment: 'dumbbell' },
      { name: 'Panturrilha na máquina', key: 'panturrilha', equipment: 'machine' },
    ],
  },
  {
    label: 'SEX · Ombros e braços', weekday: 5,
    items: [
      { name: 'Elevação lateral com halteres', key: 'elevacao-lateral', equipment: 'dumbbell' },
      { name: 'Crucifixo inverso na máquina', key: 'crucifixo-invertido', equipment: 'machine' },
      { name: 'Tríceps testa', key: 'triceps-testa' },
      { name: 'Rosca alternada com halteres', key: 'rosca-alternada', equipment: 'dumbbell' },
    ],
  },
  {
    label: 'SÁB · Peito e costas', weekday: 6,
    items: [
      { name: 'Supino inclinado com halteres', key: 'supino-inclinado', equipment: 'dumbbell' },
      { name: 'Peck deck', key: 'peck-deck', equipment: 'machine' },
      { name: 'Puxada alta na polia', key: 'puxada-alta-polia', equipment: 'cable' },
      { name: 'Remada baixa com pegada fechada', key: 'remada-baixa-fechada', equipment: 'cable' },
      { name: 'Rosca inversa na polia baixa com barra reta', key: 'rosca-inversa', equipment: 'cable' },
    ],
  },
];
