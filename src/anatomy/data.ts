import type { Equipment, Exercise, MuscleGroup } from '../types';
import type { MuscleId } from './shapes';

export interface MuscleInfo {
  name: string;
  short: string;
  region: string;
  func: string;
}

export const MUSCLES: Record<MuscleId, MuscleInfo> = {
  pec_clav: { name: 'Peitoral maior — porção clavicular', short: 'Peitoral clavicular', region: 'Peito (superior)', func: 'Flexão do ombro e adução horizontal. Fibras descem da clavícula ao úmero.' },
  pec_stern: { name: 'Peitoral maior — porção esternocostal', short: 'Peitoral esternocostal', region: 'Peito (médio)', func: 'Adução e rotação interna do ombro. Maior parte do peitoral, com origem no esterno e nas cartilagens costais.' },
  pec_abd: { name: 'Peitoral maior — porção abdominal', short: 'Peitoral abdominal', region: 'Peito (inferior)', func: 'Fibras inferiores: levam o braço para baixo e para dentro. Mais exigidas em movimentos de cima para baixo.' },
  delt_ant: { name: 'Deltoide anterior', short: 'Deltoide anterior', region: 'Ombro', func: 'Flexão e rotação interna do ombro. Auxilia nos supinos e desenvolvimentos.' },
  delt_lat: { name: 'Deltoide lateral', short: 'Deltoide lateral', region: 'Ombro', func: 'Abdução do ombro (elevar o braço para o lado).' },
  delt_post: { name: 'Deltoide posterior', short: 'Deltoide posterior', region: 'Ombro', func: 'Extensão e abdução horizontal do ombro; rotação externa.' },
  biceps_long: { name: 'Bíceps braquial — cabeça longa', short: 'Bíceps cabeça longa', region: 'Braço (frente)', func: 'Cruza ombro e cotovelo: flexão do cotovelo, supinação e auxílio na flexão do ombro. É alongada com o ombro em extensão.' },
  biceps_short: { name: 'Bíceps braquial — cabeça curta', short: 'Bíceps cabeça curta', region: 'Braço (frente)', func: 'Origem no processo coracoide: flexão do cotovelo e supinação do antebraço.' },
  brachialis: { name: 'Braquial', short: 'Braquial', region: 'Braço (profundo)', func: 'Flexor do cotovelo, atua qualquer que seja a posição do antebraço. Fica sob o bíceps.' },
  brachioradialis: { name: 'Braquiorradial', short: 'Braquiorradial', region: 'Antebraço (lateral)', func: 'Flexor do cotovelo, mais ativo com a pegada neutra ou pronada.' },
  triceps_long: { name: 'Tríceps braquial — cabeça longa', short: 'Tríceps cabeça longa', region: 'Braço (trás)', func: 'Cruza ombro e cotovelo: extensão do cotovelo e extensão do ombro. É alongada com o braço elevado.' },
  triceps_lat: { name: 'Tríceps braquial — cabeça lateral', short: 'Tríceps cabeça lateral', region: 'Braço (trás)', func: 'Extensão do cotovelo (origem no úmero, lado lateral).' },
  triceps_med: { name: 'Tríceps braquial — cabeça medial', short: 'Tríceps cabeça medial', region: 'Braço (trás, profundo)', func: 'Extensão do cotovelo. Fica sob as outras cabeças e aparece mais perto do cotovelo.' },
  forearm_flexors: { name: 'Flexores do antebraço', short: 'Flexores do antebraço', region: 'Antebraço (frente)', func: 'Flexão do punho e dos dedos (grupo muscular, identificação abrangente).' },
  forearm_extensors: { name: 'Extensores do antebraço', short: 'Extensores do antebraço', region: 'Antebraço (trás)', func: 'Extensão do punho e dos dedos (grupo muscular, identificação abrangente).' },
  rectus_abdominis: { name: 'Reto abdominal', short: 'Reto abdominal', region: 'Abdômen', func: 'Flexão do tronco e estabilização da coluna.' },
  rectus_femoris: { name: 'Quadríceps — reto femoral', short: 'Reto femoral', region: 'Coxa (frente)', func: 'Cruza quadril e joelho: extensão do joelho e flexão do quadril.' },
  vastus_lat: { name: 'Quadríceps — vasto lateral', short: 'Vasto lateral', region: 'Coxa (frente, lateral)', func: 'Extensão do joelho. Maior músculo do grupo.' },
  vastus_med: { name: 'Quadríceps — vasto medial', short: 'Vasto medial', region: 'Coxa (frente, medial)', func: 'Extensão do joelho; a porção distal ajuda a estabilizar a patela.' },
  vastus_int: { name: 'Quadríceps — vasto intermédio', short: 'Vasto intermédio', region: 'Coxa (profundo)', func: 'Extensão do joelho. Fica sob o reto femoral, por isso só aparece na camada profunda.' },
  trap_upper: { name: 'Trapézio — fibras superiores', short: 'Trapézio superior', region: 'Costas (superior)', func: 'Elevação e rotação ascendente da escápula.' },
  trap_mid: { name: 'Trapézio — fibras médias', short: 'Trapézio médio', region: 'Costas (média)', func: 'Retração da escápula (aproximá-las da coluna).' },
  trap_lower: { name: 'Trapézio — fibras inferiores', short: 'Trapézio inferior', region: 'Costas (média/baixa)', func: 'Depressão e rotação ascendente da escápula.' },
  rhomboids: { name: 'Romboides', short: 'Romboides', region: 'Costas (profundo)', func: 'Retração da escápula. Ficam sob o trapézio, na camada profunda.' },
  lats: { name: 'Latíssimo do dorso', short: 'Latíssimo do dorso', region: 'Costas (larga)', func: 'Extensão, adução e rotação interna do ombro: puxa o braço para baixo e para trás.' },
  teres_major: { name: 'Redondo maior', short: 'Redondo maior', region: 'Costas (lateral)', func: 'Extensão, adução e rotação interna do ombro; auxilia o latíssimo.' },
  infraspinatus: { name: 'Infraespinal', short: 'Infraespinal', region: 'Escápula', func: 'Rotação externa do ombro (manguito rotador).' },
  supraspinatus: { name: 'Supraespinal', short: 'Supraespinal', region: 'Escápula (profundo)', func: 'Inicia a abdução do ombro e estabiliza a cabeça do úmero (manguito rotador). Fica sob o trapézio.' },
  biceps_femoris: { name: 'Bíceps femoral', short: 'Bíceps femoral', region: 'Coxa (trás, lateral)', func: 'Flexão do joelho e, na cabeça longa, extensão do quadril.' },
  semitendinosus: { name: 'Semitendíneo', short: 'Semitendíneo', region: 'Coxa (trás, medial)', func: 'Flexão do joelho e extensão do quadril.' },
  semimembranosus: { name: 'Semimembranáceo', short: 'Semimembranáceo', region: 'Coxa (trás, profundo)', func: 'Flexão do joelho e extensão do quadril. Fica sob o semitendíneo e aparece mais na parte medial.' },
  glute_max: { name: 'Glúteo máximo', short: 'Glúteo máximo', region: 'Quadril', func: 'Extensão e rotação externa do quadril.' },
  glute_med: { name: 'Glúteo médio', short: 'Glúteo médio', region: 'Quadril (lateral)', func: 'Abdução do quadril e estabilização da pelve.' },
  gastrocnemius: { name: 'Gastrocnêmio', short: 'Gastrocnêmio', region: 'Panturrilha', func: 'Flexão plantar; cruza o joelho, então é mais exigido com o joelho estendido.' },
  soleus: { name: 'Sóleo', short: 'Sóleo', region: 'Panturrilha (profundo)', func: 'Flexão plantar; mais exigido com o joelho flexionado. Fica sob o gastrocnêmio.' },
};

export interface AnatomyExercise {
  key: string;
  name: string;
  aliases: string[];
  group: MuscleGroup;
  equipment: Equipment;
  primary: MuscleId[];
  secondary: MuscleId[];
  summary: string;
  execution: string;
  note: string;
  broad?: string;
  pending?: string;
}

const VASTI: MuscleId[] = ['vastus_lat', 'vastus_med', 'vastus_int'];

export const ANATOMY_EXERCISES: AnatomyExercise[] = [
  {
    key: 'supino-inclinado', name: 'Supino inclinado', aliases: ['supino inclinado com halteres', 'supino inclinado com barra'],
    group: 'chest', equipment: 'other',
    primary: ['pec_clav'], secondary: ['pec_stern', 'delt_ant', 'triceps_long', 'triceps_lat', 'triceps_med'],
    summary: 'A inclinação do banco (cerca de 30–45°) alinha o empurrão com as fibras claviculares, que descem da clavícula ao úmero. Elas recebem ênfase relativa maior que no supino reto; o esternocostal continua participando.',
    execution: 'Com o banco muito inclinado (acima de ~45°), o deltoide anterior assume mais da carga e a vantagem para a porção clavicular diminui.',
    note: 'Ênfase relativa, não isolamento: a porção clavicular não trabalha sozinha.',
  },
  {
    key: 'supino-reto', name: 'Supino reto', aliases: ['supino reto com barra', 'supino reto com halteres'],
    group: 'chest', equipment: 'other',
    primary: ['pec_stern'], secondary: ['pec_clav', 'delt_ant', 'triceps_long', 'triceps_lat', 'triceps_med'],
    summary: 'Empurrão horizontal: as fibras esternocostais (maior parte do peitoral) ficam alinhadas com a direção da força. A porção clavicular participa; deltoide anterior e tríceps ajudam na extensão do cotovelo.',
    execution: 'Cotovelos semiabertos (não a 90° do tronco) e escápulas firmes no banco mantêm o peitoral como principal; cotovelos muito abertos aumentam a demanda no ombro.',
    note: 'A porção abdominal não é alvo relevante no supino plano; participa mais em movimentos de cima para baixo.',
  },
  {
    key: 'crucifixo', name: 'Crucifixo', aliases: [],
    group: 'chest', equipment: 'other',
    primary: ['pec_stern'], secondary: ['pec_clav', 'delt_ant'],
    broad: 'Variação não informada (plano ou inclinado; halteres, polia ou máquina). Mapeado como crucifixo plano; inclinar o banco aumenta a ênfase na porção clavicular.',
    summary: 'Adução horizontal do ombro com cotovelos levemente flexionados: o peitoral maior é o principal e é bastante alongado na descida. O tríceps participa pouco.',
    execution: 'Cotovelos semiflexionados e fixos; desça até o limite confortável do ombro, onde o peitoral fica mais alongado.',
    note: 'Com halteres a tensão cai perto do topo; em polia ou máquina a resistência pode se manter na amplitude toda.',
  },
  {
    key: 'remada-unilateral', name: 'Remada unilateral inclinada com halteres (serrote)', aliases: ['serrote', 'remada serrote'],
    group: 'back', equipment: 'dumbbell',
    primary: ['lats'], secondary: ['teres_major', 'rhomboids', 'trap_mid', 'trap_lower', 'delt_post', 'biceps_long', 'biceps_short', 'brachialis'],
    summary: 'Puxar o halter em direção ao quadril é extensão do ombro: latíssimo e redondo maior são os motores principais. Romboides, trapézio médio/inferior e deltoide posterior retraem a escápula; bíceps e braquial flexionam o cotovelo.',
    execution: 'Cotovelo próximo ao tronco e puxada rumo ao quadril favorecem o latíssimo; cotovelo mais aberto favorece a retração escapular (romboides, trapézio, deltoide posterior).',
    note: 'O apoio da mão e do joelho no banco reduz a exigência de estabilizar o tronco.',
  },
  {
    key: 'puxada-alta-aberta', name: 'Puxada alta aberta', aliases: [],
    group: 'back', equipment: 'cable',
    primary: ['lats'], secondary: ['teres_major', 'trap_lower', 'rhomboids', 'biceps_long', 'biceps_short', 'brachialis', 'brachioradialis'],
    summary: 'Levar a barra até a altura do peito exige adução e extensão do ombro: o latíssimo é o principal, com o redondo maior. Bíceps, braquial e braquiorradial flexionam o cotovelo; trapézio inferior e romboides movem a escápula.',
    execution: 'Puxe com os cotovelos, sem inclinar demais o tronco, até a barra passar perto do queixo/peito.',
    note: 'A pegada aberta não isola uma região específica do latíssimo: diferenças de ativação por pegada são pequenas e variam entre pessoas.',
  },
  {
    key: 'remada-articulada-fechada', name: 'Remada articulada fechada', aliases: [],
    group: 'back', equipment: 'machine',
    primary: ['lats'], secondary: ['teres_major', 'rhomboids', 'trap_mid', 'trap_lower', 'delt_post', 'biceps_long', 'biceps_short', 'brachialis'],
    summary: 'Puxar as pegas até o tronco combina extensão do ombro (latíssimo e redondo maior, principais) com retração da escápula (romboides, trapézio médio e inferior, deltoide posterior). Bíceps e braquial ajudam.',
    execution: 'A pegada fechada mantém os cotovelos próximos ao tronco, o que favorece a extensão do ombro; no fim, aproxime as escápulas sem arquear a lombar.',
    note: 'Com apoio no peito, lombar e eretores são menos exigidos; a distribuição real depende do desenho da máquina.',
  },
  {
    key: 'rosca-bayesian', name: 'Rosca Bayesian', aliases: ['rosca bayesiana'],
    group: 'biceps', equipment: 'cable',
    primary: ['biceps_long'], secondary: ['biceps_short', 'brachialis'],
    summary: 'Com o cabo atrás do corpo, o ombro fica em extensão e o bíceps começa a rosca alongado. A cabeça longa cruza o ombro, então é a mais alongada nessa posição e recebe ênfase relativa maior. A cabeça curta e o braquial também trabalham.',
    execution: 'De costas para a polia baixa, braço atrás do tronco; mantenha o ombro estável, sem balançar, enquanto flexiona o cotovelo.',
    note: 'Ênfase relativa: a cabeça longa não trabalha isolada, e o efeito varia com a anatomia e a amplitude.',
  },
  {
    key: 'rosca-alternada', name: 'Rosca alternada com halteres', aliases: ['rosca alternada'],
    group: 'biceps', equipment: 'dumbbell',
    primary: ['biceps_long', 'biceps_short'], secondary: ['brachialis', 'brachioradialis'],
    summary: 'O bíceps flexiona o cotovelo e supina o antebraço; as duas cabeças participam. Braquial e braquiorradial ajudam na flexão, principalmente quando a palma não está supinada.',
    execution: 'Supinar (girar a palma para cima) durante a subida aumenta a contribuição do bíceps; com o ombro ao lado do corpo, nenhuma cabeça é favorecida em especial.',
    note: 'Evite balançar o tronco para manter a tensão no bíceps.',
  },
  {
    key: 'rosca-scott-maquina', name: 'Rosca Scott na máquina', aliases: [],
    group: 'biceps', equipment: 'machine',
    primary: ['biceps_long', 'biceps_short'], secondary: ['brachialis'],
    summary: 'Com o braço apoiado à frente do tronco, o movimento fica quase só flexão do cotovelo. As duas cabeças do bíceps trabalham e o braquial ajuda.',
    execution: 'Com o braço à frente, a cabeça longa fica encurtada no ombro, o que pode favorecer a participação relativa da cabeça curta, sem isolá-la.',
    note: 'O apoio reduz o balanço do corpo; o perfil de resistência depende da came da máquina.',
  },
  {
    key: 'rosca-45', name: 'Rosca bíceps 45°', aliases: [],
    group: 'biceps', equipment: 'other',
    primary: ['biceps_long', 'biceps_short'], secondary: ['brachialis', 'brachioradialis'],
    broad: 'Variação não informada, então o mapeamento é amplo (sem ênfase por cabeça). Se for em banco inclinado a 45° (ombro atrás do tronco), a cabeça longa tende a ter ênfase relativa maior, como na rosca Bayesian.',
    summary: 'Flexão do cotovelo com supinação: o bíceps braquial é o principal, com as duas cabeças. Braquial e braquiorradial auxiliam.',
    execution: 'A posição do braço define a ênfase: atrás do tronco, a cabeça longa fica mais alongada; à frente, mais encurtada.',
    note: 'Informe a variação exata para um mapeamento específico.',
  },
  {
    key: 'rosca-martelo', name: 'Rosca martelo', aliases: [],
    group: 'biceps', equipment: 'other',
    primary: ['brachialis', 'brachioradialis'], secondary: ['biceps_long', 'biceps_short'],
    summary: 'A pegada neutra (polegar para cima) tira a vantagem do bíceps, que é supinador, e passa mais trabalho para o braquial e o braquiorradial. O bíceps ainda participa.',
    execution: 'Sem girar o punho: a palma fica voltada para o corpo durante todo o movimento.',
    note: 'Diferente das roscas com supinação, em que o bíceps tem mais destaque. O braquial fica sob o bíceps (camada profunda).',
  },
  {
    key: 'triceps-corda', name: 'Tríceps corda', aliases: ['triceps na polia (corda)', 'tríceps na polia (corda)'],
    group: 'triceps', equipment: 'cable',
    primary: ['triceps_lat', 'triceps_med'], secondary: ['triceps_long'],
    summary: 'Extensão do cotovelo com o braço ao lado do corpo: as três cabeças trabalham. Com o ombro neutro, a cabeça longa não fica alongada, então lateral e medial têm participação relativa maior.',
    execution: 'Cotovelos fixos junto ao corpo; estenda por completo sem deslocar o ombro.',
    note: 'Mapeamento por ênfase relativa: todas as cabeças participam e a ativação varia entre pessoas.',
  },
  {
    key: 'triceps-frances', name: 'Tríceps francês', aliases: [],
    group: 'triceps', equipment: 'other',
    primary: ['triceps_long'], secondary: ['triceps_lat', 'triceps_med'],
    summary: 'Com o braço elevado acima da cabeça, a cabeça longa, que cruza o ombro, fica alongada e ganha ênfase relativa. As cabeças lateral e medial também estendem o cotovelo.',
    execution: 'Cotovelos apontados para cima e fixos; desça o peso atrás da cabeça até um alongamento confortável.',
    note: 'As três cabeças trabalham; a ênfase na longa é relativa, não exclusiva.',
  },
  {
    key: 'elevacao-lateral', name: 'Elevação lateral', aliases: [],
    group: 'shoulders', equipment: 'other',
    primary: ['delt_lat'], secondary: ['supraspinatus', 'trap_upper'],
    summary: 'Abdução do ombro: o deltoide lateral é o motor principal. O supraspinal ajuda a iniciar a elevação (participação variável) e o trapézio superior auxilia na rotação da escápula.',
    execution: 'Suba até a altura do ombro com cotovelos levemente flexionados; elevar demais ou encolher os ombros aumenta a participação do trapézio superior.',
    note: 'Deltoides anterior e posterior atuam como estabilizadores e não são o foco.',
  },
  {
    key: 'desenvolvimento', name: 'Desenvolvimento', aliases: ['desenvolvimento com halteres'],
    group: 'shoulders', equipment: 'other',
    primary: ['delt_ant', 'delt_lat'], secondary: ['triceps_long', 'triceps_lat', 'triceps_med', 'trap_upper'],
    broad: 'Equipamento não informado; o mapeamento vale para halteres, barra ou máquina.',
    summary: 'Empurrar acima da cabeça combina flexão e abdução do ombro: deltoide anterior e lateral são os principais. O tríceps estende o cotovelo e o trapézio superior gira a escápula para cima.',
    execution: 'Cotovelos mais à frente do tronco favorecem o deltoide anterior; mais para o lado, o lateral.',
    note: 'O deltoide posterior não é alvo relevante.',
  },
  {
    key: 'crucifixo-invertido', name: 'Crucifixo invertido', aliases: ['crucifixo inverso'],
    group: 'shoulders', equipment: 'other',
    primary: ['delt_post'], secondary: ['infraspinatus', 'rhomboids', 'trap_mid'],
    summary: 'Abdução horizontal do ombro: o deltoide posterior é o principal. Infraespinal, romboides e trapézio médio ajudam, conforme a execução.',
    execution: 'Cotovelos levemente flexionados; mova a partir do ombro. Juntar demais as escápulas transfere carga para romboides e trapézio.',
    note: 'A proporção entre deltoide posterior e músculos das costas varia com a amplitude e a posição do tronco.',
  },
  {
    key: 'agachamento-smith', name: 'Agachamento no Smith', aliases: [],
    group: 'quads', equipment: 'machine',
    primary: [...VASTI, 'glute_max'], secondary: ['rectus_femoris', 'biceps_femoris', 'semitendinosus', 'semimembranosus', 'glute_med'],
    summary: 'Extensão de joelhos e quadris: os vastos e o glúteo máximo são os principais. O reto femoral ajuda no joelho; posteriores de coxa e glúteo médio atuam como auxiliares e estabilizadores.',
    execution: 'Pés à frente da barra aumentam a demanda do quadril (glúteos e posteriores); pés sob a barra, a do joelho (quadríceps). Mais profundidade aumenta a exigência do glúteo máximo.',
    note: 'O trilho do Smith guia a barra e reduz a estabilização; a distribuição varia com postura e anatomia.',
  },
  {
    key: 'leg-press-45', name: 'Leg press 45°', aliases: ['leg press 45'],
    group: 'quads', equipment: 'machine',
    primary: VASTI, secondary: ['rectus_femoris', 'glute_max'],
    summary: 'Extensão de joelhos e quadris contra a plataforma: os três vastos são os principais. O reto femoral participa menos (quadril flexionado) e o glúteo máximo ajuda, mais em amplitudes profundas.',
    execution: 'Pés mais baixos na plataforma favorecem o joelho (quadríceps); mais altos ou afastados favorecem o quadril (glúteos e posteriores).',
    note: 'Não deixe o quadril descolar do encosto na parte baixa; a ênfase varia com a posição dos pés.',
  },
  {
    key: 'cadeira-extensora', name: 'Cadeira extensora', aliases: [],
    group: 'quads', equipment: 'machine',
    primary: ['rectus_femoris', ...VASTI], secondary: [],
    summary: 'Extensão isolada do joelho: os quatro músculos do quadríceps trabalham. Sentado, o quadril fica flexionado e o reto femoral fica encurtado no quadril; reclinar o encosto o alonga e tende a aumentar sua participação relativa.',
    execution: 'Alinhe o eixo do aparelho com o joelho; evite hiperextensão e solavancos no topo.',
    note: 'Não há ênfase confirmada de uma porção isolada do quadríceps por posição dos pés.',
  },
  {
    key: 'cadeira-flexora', name: 'Cadeira flexora', aliases: [],
    group: 'hamstrings', equipment: 'machine',
    primary: ['biceps_femoris', 'semitendinosus', 'semimembranosus'], secondary: ['gastrocnemius'],
    summary: 'Flexão do joelho: os três isquiotibiais trabalham como principais. O gastrocnêmio ajuda na flexão do joelho.',
    execution: 'Sentado, o quadril fica flexionado e os isquiotibiais, que cruzam o quadril, ficam alongados, aumentando a tensão no início da amplitude.',
    note: 'Mantenha o quadril fixo no assento para a pelve não compensar.',
  },
  {
    key: 'panturrilha', name: 'Panturrilha', aliases: [],
    group: 'calves', equipment: 'other',
    primary: ['gastrocnemius', 'soleus'], secondary: [],
    broad: 'Variação não informada (em pé ou sentado). Em pé, com o joelho estendido, o gastrocnêmio recebe maior ênfase; sentado, com o joelho flexionado, o sóleo ganha ênfase relativa.',
    summary: 'Flexão plantar: o tríceps sural (gastrocnêmio e sóleo) é o principal. O gastrocnêmio cruza o joelho; o sóleo é mais exigido com o joelho flexionado.',
    execution: 'Amplitude completa: calcanhar bem abaixo (alongamento) e subida até o máximo.',
    note: 'Informe se é em pé ou sentado para ajustar a ênfase.',
  },
  {
    key: 'antebraco', name: 'Antebraço (variação a definir)', aliases: [],
    group: 'forearms', equipment: 'other', primary: [], secondary: [],
    pending: 'Você ainda não informou qual é o exercício de antebraço (por exemplo rosca de punho, extensão de punho ou rosca inversa). Cada um trabalha músculos diferentes, então não há mapeamento até a variação ser definida.',
    summary: '', execution: '', note: '',
  },
  {
    key: 'perna-unilateral', name: 'Perna unilateral (variação a definir)', aliases: [],
    group: 'quads', equipment: 'other', primary: [], secondary: [],
    pending: 'Você ainda não informou qual é o exercício unilateral de perna. A ênfase muda muito entre as variações (agachamento búlgaro, afundo, leg press unilateral, etc.), então não há mapeamento até ela ser definida.',
    summary: '', execution: '', note: '',
  },
];

export function norm(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
}

export function getAnatomy(key: string): AnatomyExercise | undefined {
  return ANATOMY_EXERCISES.find(e => e.key === key);
}

export function resolveAnatomy(ex: Pick<Exercise, 'name' | 'mapKey'>): AnatomyExercise | undefined {
  if (ex.mapKey) return getAnatomy(ex.mapKey);
  const n = norm(ex.name);
  return ANATOMY_EXERCISES.find(a => norm(a.name) === n || a.aliases.some(al => norm(al) === n));
}
