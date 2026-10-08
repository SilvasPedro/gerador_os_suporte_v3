import {
  WorkOrderFormState,
  AddressChangeFormState,
  AdditionalPointCablingFormState,
  TvRepairFormState,
  RoomChangeFormState,
} from '../types/os';

export function formatPhoneMask(value: string): string {
  // Strip non-digits
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) {
    return digits.length > 0 ? `(${digits}` : '';
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

export function formatDateToBR(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

export function generateWorkOrderMask(data: WorkOrderFormState): string {
  const formattedDate = formatDateToBR(data.scheduleDate) || 'A DEFINIR';
  const periodText =
    data.period === 'Após'
      ? `Após ${data.customPeriodTime || 'horário a combinar'}`
      : data.period;

  const contactStatus = data.contactSuccess
    ? 'Contato realizado com sucesso'
    : 'SEM CONTATO COM CLIENTE (Tentativa efetuada)';

  let historyBlock = '';
  if (data.recentHistory.hasRecent) {
    historyBlock = [
      'HISTÓRICO RECENTE (ÚLTIMOS 90 DIAS): SIM',
      ` - Tipo: ${data.recentHistory.recentType || 'Não especificado'}`,
      ` - Data da O.S/Atendimento: ${formatDateToBR(data.recentHistory.recentDate) || 'Não informada'}`,
      ` - Baixa resumida: ${data.recentHistory.recentSummary.trim() || 'Sem observações adicionais'}`,
    ].join('\n');
  } else {
    historyBlock = 'HISTÓRICO RECENTE (ÚLTIMOS 90 DIAS): NÃO CONSTA';
  }

  const exceptionBlock = data.exceptionAuth.hasException
    ? `SIM - Autorizado por: ${data.exceptionAuth.authorizedBy.trim() || 'Não informado'}`
    : 'NÃO';

  const logsBlock = data.dropLogs.trim()
    ? `\n - Histórico de Quedas (Logs):\n   ${data.dropLogs.trim()}`
    : '';

  return `========================================
[ ORDEM DE SERVIÇO - SUPORTE TÉCNICO ]
========================================
AGENDAMENTO:
 - Data: ${formattedDate}
 - Período: ${periodText}

INFORMAÇÕES DO CLIENTE:
 - Roteador: ${data.routerOwnership}
 - ONU: ${data.onuOwnership}
 - Contato: ${data.contactPhone || 'Não informado'} [${contactStatus}]
 - Cliente desde: ${data.clientSince.trim() || 'Não informado'}

DETALHES DA O.S:
 - Motivo/Solicitação:
   ${data.motive.trim() || 'Aguardando preenchimento do motivo.'}

INFORMAÇÕES TÉCNICAS:
 - Sinal / Status ONU: ${data.onuSignal.trim() || 'Não aferido'}${logsBlock}

${historyBlock}

RESPONSÁVEL & EXCEÇÃO:
 - Agendamento por Exceção: ${exceptionBlock}
 - Operador Responsável: ${data.operatorName.trim() || 'Não informado'}
========================================`;
}

export function generateAddressChangeMask(data: AddressChangeFormState): string {
  const formattedDate = formatDateToBR(data.scheduleDate) || 'A DEFINIR';
  const periodText =
    data.period === 'Após'
      ? `Após ${data.customPeriodTime || 'horário a combinar'}`
      : data.period;

  const canAdvanceText = data.canAdvance ? 'SIM' : 'NÃO';

  const exceptionBlock = data.exceptionAuth.hasException
    ? `SIM - Autorizado por: ${data.exceptionAuth.authorizedBy.trim() || 'Não informado'}`
    : 'NÃO';

  // Format phones (supports multiple phones)
  const validPhones = (data.phones || [])
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  const phonesText =
    validPhones.length > 0
      ? validPhones.join(' / ')
      : data.phone || 'Não informado';

  const additionalPointNote = data.hasAdditionalPoint
    ? `\n - Ponto Adicional: SIM (${data.additionalPointQuantity || 1} ponto(s) adicional(is) ativo(s) - Requer O.S separada)`
    : ' - Ponto Adicional: NÃO';

  return `========================================
[ ORDEM DE SERVIÇO - MUDANÇA DE ENDEREÇO ]
========================================
AGENDAMENTO & DETALHES:
 - Data do Agendamento: ${formattedDate}
 - Pode Adiantar: ${canAdvanceText}
 - Período: ${periodText}
 - Taxa de Mudança: ${data.fee || 'Isento (Fixo)'}${additionalPointNote}

ENDEREÇOS E CONTATO:
 - Cliente Desde: ${data.clientSince.trim() || 'Não informado'}
 - Telefones / Contato: ${phonesText}
 - Endereço Atual: ${data.currentAddress.trim() || 'Não informado'}
 - Novo Endereço: ${data.newAddress.trim() || 'Não informado'}
 - Ponto de Referência: ${data.referencePoint.trim() || 'Não informado'}
 - Localização (Maps): ${data.mapsLink.trim() || 'Não informada'}

VERIFICAÇÕES:
 - Comprovante de Endereço: ${data.proofOfAddress}

ETECC RESOLVE:
 - Cliente aceitou serviço de frete? ${data.freightAccepted}

AUTORIZAÇÃO & ATENDENTE:
 - Autorizado por Exceção: ${exceptionBlock}
 - Operador Responsável: ${data.operatorName.trim() || 'Não informado'}
========================================`;
}

export function generateAdditionalPointMask(data: AddressChangeFormState): string {
  const formattedDate = formatDateToBR(data.scheduleDate) || 'A DEFINIR';
  const periodText =
    data.period === 'Após'
      ? `Após ${data.customPeriodTime || 'horário a combinar'}`
      : data.period;

  const canAdvanceText = data.canAdvance ? 'SIM' : 'NÃO';

  const exceptionBlock = data.exceptionAuth.hasException
    ? `SIM - Autorizado por: ${data.exceptionAuth.authorizedBy.trim() || 'Não informado'}`
    : 'NÃO';

  const validPhones = (data.phones || [])
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  const phonesText =
    validPhones.length > 0
      ? validPhones.join(' / ')
      : data.phone || 'Não informado';

  return `========================================
[ ORDEM DE SERVIÇO - PONTO ADICIONAL ]
[ MUDANÇA DE ENDEREÇO ]
========================================
AGENDAMENTO & DETALHES:
 - Tipo de O.S: MUDANÇA DE ENDEREÇO - PONTO ADICIONAL
 - Data do Agendamento: ${formattedDate}
 - Pode Adiantar: ${canAdvanceText}
 - Período: ${periodText}
 - Taxa de Mudança: ${data.fee || 'Isento (Fixo)'}
 - Quantidade de Pontos: ${data.additionalPointQuantity || 1} Ponto(s)

DADOS DO CLIENTE & CONTATO:
 - Cliente Desde: ${data.clientSince.trim() || 'Não informado'}
 - Telefones / Contato: ${phonesText}

ENDEREÇOS:
 - Endereço Atual: ${data.currentAddress.trim() || 'Não informado'}
 - Novo Endereço: ${data.newAddress.trim() || 'Não informado'}
 - Ponto de Referência: ${data.referencePoint.trim() || 'Não informado'}
 - Localização (Maps): ${data.mapsLink.trim() || 'Não informada'}

DETALHES DO SERVIÇO:
 - O.S vinculada à Mudança de Endereço do ponto principal.
 - Executar remanejamento, cabeamento e conectorização do PONTO ADICIONAL no novo endereço.

AUTORIZAÇÃO & ATENDENTE:
 - Autorizado por Exceção: ${exceptionBlock}
 - Operador Responsável: ${data.operatorName.trim() || 'Não informado'}
========================================`;
}

export function generateAdditionalPointCablingMask(
  data: AdditionalPointCablingFormState
): string {
  const formattedDate = formatDateToBR(data.scheduleDate) || 'A DEFINIR';
  const periodText =
    data.period === 'Após'
      ? `Após ${data.customPeriodTime || 'horário a combinar'}`
      : data.period;

  const validPhones = (data.phones || [])
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  const phonesText =
    validPhones.length > 0
      ? validPhones.join(' / ')
      : data.phone || 'Não informado';

  const upgradeText = data.didUpgrade ? 'SIM' : 'NÃO';
  const routerNeededText = data.needsRouter
    ? `SIM (${data.routerType || 'Comodato'})`
    : 'NÃO';

  let costText = '';
  if (data.hasCost) {
    costText = 'SIM (Gerado custo)';
  } else {
    let reasonDetail = data.exemptionReason || 'Isento';
    if (data.exemptionReason === 'Autorizado diretoria' && data.directorName) {
      reasonDetail = `Autorizado diretoria (${data.directorName.trim()})`;
    } else if (data.exemptionReason === 'Outro' && data.customExemptionReason) {
      reasonDetail = `Outro: ${data.customExemptionReason.trim()}`;
    }
    costText = `NÃO / ISENTO (Motivo: ${reasonDetail})`;
  }

  let evalText = 'NÃO';
  if (data.hasTechnicalEvaluation) {
    evalText = `SIM - Baixa resumida: ${data.evaluationSummary.trim() || 'Sem observações'}`;
  }

  const exceptionBlock = data.exceptionAuth.hasException
    ? `SIM - Autorizado por: ${data.exceptionAuth.authorizedBy.trim() || 'Não informado'}`
    : 'NÃO';

  return `========================================
[ ORDEM DE SERVIÇO - PONTO ADICIONAL / CABEAMENTO ]
========================================
AGENDAMENTO:
 - Data: ${formattedDate}
 - Período: ${periodText}
 - Solicitação:
   ${data.motive.trim() || 'Aguardando preenchimento da solicitação.'}

INFORMAÇÕES DO CLIENTE:
 - Telefones / Contato: ${phonesText}
 - Plano Atual: ${data.plan || 'Não informado'}
 - Cliente Desde: ${data.clientSince.trim() || 'Não informado'}
 - Roteador Principal: ${data.mainRouterOwnership}
 - ONU: ${data.onuOwnership}

INFORMAÇÕES DA O.S & EQUIPAMENTO:
 - Realizou Upgrade? ${upgradeText}
 - Será Necessário Roteador? ${routerNeededText}
 - Será Gerado Custo? ${costText}

AVALIAÇÃO TÉCNICA:
 - Já foi feita avaliação? ${evalText}

AUTORIZAÇÃO & ATENDENTE:
 - Autorizado por Exceção: ${exceptionBlock}
 - Operador Responsável: ${data.operatorName.trim() || 'Não informado'}
========================================`;
}

export function generateTvRepairMask(data: TvRepairFormState): string {
  const formattedDate = formatDateToBR(data.scheduleDate) || 'A DEFINIR';
  const periodText =
    data.period === 'Após'
      ? `Após ${data.customPeriodTime || 'horário a combinar'}`
      : data.period;

  const validPhones = (data.phones || [])
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  const phonesText =
    validPhones.length > 0
      ? validPhones.join(' / ')
      : data.contactPhone || 'Não informado';

  let recentBlock = 'NÃO';
  if (data.hasRecent) {
    const dateFormatted = formatDateToBR(data.recentDate);
    const summaryText = data.recentSummary.trim() || 'Sem observações adicionais';
    recentBlock = `SIM${dateFormatted ? ` (Data: ${dateFormatted})` : ''} - ${summaryText}`;
  }

  const exceptionBlock = data.exceptionAuth.hasException
    ? `SIM - Autorizado por: ${data.exceptionAuth.authorizedBy.trim() || 'Não informado'}`
    : 'NÃO';

  return `========================================
[ ORDEM DE SERVIÇO - REPARO DE TV ]
========================================
AGENDAMENTO:
 - Data: ${formattedDate}
 - Período: ${periodText}

INFORMAÇÕES DO CLIENTE:
 - Contato: ${phonesText}
 - Cliente desde: ${data.clientSince.trim() || 'Não informado'}

DETALHES DA O.S:
 - Descrição do Problema:
   ${data.problemDescription.trim() || 'Não informada'}
 - Estrutura: ${data.structure}
 - Dispositivo: ${data.device}

ATENDIMENTOS OU ORDEM DE SERVIÇO RECENTE:
 - Teve atendimento recente? ${recentBlock}

OPERADOR & AUTORIZAÇÃO:
 - Autorizado por Exceção: ${exceptionBlock}
 - Operador Responsável: ${data.operatorName.trim() || 'Não informado'}
========================================`;
}

export function generateRoomChangeMask(data: RoomChangeFormState): string {
  const formattedDate = formatDateToBR(data.scheduleDate);
  const periodText =
    data.period === 'Após' && data.customPeriodTime
      ? `Após às ${data.customPeriodTime}`
      : data.period;

  const validPhones = (data.phones || [])
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  const phonesText =
    validPhones.length > 0
      ? validPhones.join(' / ')
      : data.contactPhone || 'Não informado';

  let costText = 'NÃO (Isento)';
  if (data.hasCost) {
    costText = 'SIM (Gerar cobrança de taxa de mudança de cômodo)';
  } else if (data.exemptionReason) {
    if (data.exemptionReason === 'Autorizado diretoria') {
      costText = `NÃO - Isento por Autorização da Diretoria (${data.directorName.trim() || 'Nome não informado'})`;
    } else if (data.exemptionReason === 'Outro' && data.customExemptionReason) {
      costText = `NÃO - Isenção: ${data.customExemptionReason.trim()}`;
    } else {
      costText = `NÃO - Isenção: ${data.exemptionReason}`;
    }
  }

  const exceptionBlock = data.exceptionAuth.hasException
    ? `SIM - Autorizado por: ${data.exceptionAuth.authorizedBy.trim() || 'Não informado'}`
    : 'NÃO';

  const awareText = data.clientAwareOfCost
    ? 'SIM (Cliente informado e ciente)'
    : 'NÃO (ALINHAR PREVIAMENTE COM O CLIENTE ANTES DO ENVIO)';

  return `========================================
[ ORDEM DE SERVIÇO - MUDANÇA DE CÔMODO ]
========================================
AGENDAMENTO:
 - Data: ${formattedDate}
 - Pode Adiantar: ${data.canAdvance ? 'SIM' : 'NÃO'}
 - Período: ${periodText}

INFORMAÇÕES DO CLIENTE:
 - Contato: ${phonesText}
 - Cliente desde: ${data.clientSince.trim() || 'Não informado'}

DETALHES DA O.S:
 - Descrição:
   ${data.description.trim() || 'Não informada'}
 - Será gerado custo? ${costText}
 - Cliente ciente da possibilidade de custo? ${awareText}

AUTORIZAÇÃO & ATENDENTE:
 - Autorizado por Exceção: ${exceptionBlock}
 - Operador Responsável: ${data.operatorName.trim() || 'Não informado'}
========================================`;
}

