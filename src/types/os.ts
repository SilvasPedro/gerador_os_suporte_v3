export type SchedulePeriod =
  | 'Horário Comercial'
  | 'Primeira do dia'
  | 'Manhã'
  | 'Tarde'
  | 'Última do dia'
  | 'Após';

export type EquipmentOwnership = 'Comodato' | 'Compra (Próprio)';
export type OnuOwnership = 'Comodato' | 'Compra';

export interface RecentHistoryData {
  hasRecent: boolean;
  recentType: string;
  recentDate: string;
  recentSummary: string;
}

export interface ExceptionAuthData {
  hasException: boolean;
  authorizedBy: string;
}

export interface WorkOrderFormState {
  // Agendamento
  scheduleDate: string;
  period: SchedulePeriod;
  customPeriodTime: string;

  // Informações do cliente
  routerOwnership: EquipmentOwnership;
  onuOwnership: OnuOwnership;
  contactPhone: string;
  contactSuccess: boolean;
  clientSince: string;

  // Detalhes da O.S
  motive: string;

  // Informações técnicas
  onuSignal: string;
  dropLogs: string;

  // Histórico recente (90 dias)
  recentHistory: RecentHistoryData;

  // Responsável & Exceção
  exceptionAuth: ExceptionAuthData;
  operatorName: string;
}

export interface RouteNotice {
  id: string;
  title: string;
  route: string;
  status: 'active' | 'investigating' | 'resolved';
  description: string;
  author: string;
  createdAt: string;
}

export interface SavedWorkOrderRecord {
  id: string;
  createdAt: string;
  operatorName: string;
  scheduleDate: string;
  period: string;
  contactPhone: string;
  motive: string;
  generatedMask: string;
}

export type ProofOfAddressStatus = 'Anexado' | 'Não enviado' | 'Não Possui';

export type FreightServiceStatus =
  | 'Aceitou'
  | 'Recusou'
  | 'Já mudou/Contratou outro serviço'
  | 'Não oferecido';

export interface AddressChangeFormState {
  // Agendamento & Detalhes
  scheduleDate: string;
  canAdvance: boolean;
  period: SchedulePeriod;
  customPeriodTime: string;
  fee: string; // Isento (Fixo)

  // Ponto Adicional
  hasAdditionalPoint: boolean;
  additionalPointQuantity: number;

  // Endereços e Contato
  clientSince: string;
  phone: string; // Primário
  phones: string[]; // Lista com múltiplos telefones
  currentAddress: string;
  newAddress: string;
  referencePoint: string;
  mapsLink: string;

  // Verificações
  proofOfAddress: ProofOfAddressStatus;

  // ETECC Resolve
  freightAccepted: FreightServiceStatus;

  // Autorização & Atendente
  exceptionAuth: ExceptionAuthData;
  operatorName: string;
}

export type TelecomPlan =
  | '400Mb'
  | '600Mb'
  | '800Mb'
  | '1000Mb'
  | 'Gamer (1000 Mb)';

export type ExemptionReasonType =
  | 'Upgrade'
  | 'Cliente antigo'
  | 'Retenção de cancelamento'
  | 'Autorizado diretoria'
  | 'Outro';

export interface AdditionalPointCablingFormState {
  // Agendamento
  scheduleDate: string;
  period: SchedulePeriod;
  customPeriodTime: string;
  motive: string;

  // Informações do cliente
  phone: string;
  phones: string[];
  plan: TelecomPlan | string;
  clientSince: string;
  mainRouterOwnership: EquipmentOwnership;
  onuOwnership: OnuOwnership;

  // Informações da O.S
  didUpgrade: boolean;
  needsRouter: boolean;
  routerType: OnuOwnership; // Comodato / Compra
  hasCost: boolean;
  exemptionReason: ExemptionReasonType | string;
  directorName: string;
  customExemptionReason: string;

  // Avaliação técnica
  hasTechnicalEvaluation: boolean;
  evaluationSummary: string;

  // Autorização & Atendente
  exceptionAuth: ExceptionAuthData;
  operatorName: string;
}

export type TvStructureType = 'Coaxial' | 'Mininode';

export type TvDeviceType =
  | 'Decodificador Gospell'
  | 'Conversor Externo'
  | 'Cabo direto na TV';

export interface TvRepairFormState {
  // Agendamento
  scheduleDate: string;
  period: SchedulePeriod;
  customPeriodTime: string;

  // Informações do cliente
  contactPhone: string;
  phones: string[];
  clientSince: string;

  // Detalhes da O.S
  problemDescription: string;
  structure: TvStructureType;
  device: TvDeviceType;

  // Atendimentos ou Ordem de serviço Recente
  hasRecent: boolean;
  recentDate: string;
  recentSummary: string;

  // Operador & Autorização
  exceptionAuth: ExceptionAuthData;
  operatorName: string;
}

export interface RoomChangeFormState {
  // Agendamento
  scheduleDate: string;
  canAdvance: boolean;
  period: SchedulePeriod;
  customPeriodTime: string;

  // Informações do cliente
  contactPhone: string;
  phones: string[];
  clientSince: string;

  // Detalhes da O.S
  description: string;
  hasCost: boolean;
  exemptionReason: ExemptionReasonType | string;
  directorName: string;
  customExemptionReason: string;
  clientAwareOfCost: boolean;

  // Autorização & Atendente
  exceptionAuth: ExceptionAuthData;
  operatorName: string;
}

