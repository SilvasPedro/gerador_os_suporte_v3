import React from 'react';
import {
  Calendar,
  Clock,
  Wifi,
  Phone,
  User,
  AlertCircle,
  Activity,
  History,
  ShieldAlert,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  WorkOrderFormState,
  SchedulePeriod,
  EquipmentOwnership,
  OnuOwnership,
} from '../types/os';
import { formatPhoneMask } from '../utils/maskGenerator';

interface Props {
  formState: WorkOrderFormState;
  onChange: (updated: Partial<WorkOrderFormState>) => void;
  onClear: () => void;
  onFillExample: () => void;
}

const PERIOD_OPTIONS: SchedulePeriod[] = [
  'Horário Comercial',
  'Primeira do dia',
  'Manhã',
  'Tarde',
  'Última do dia',
  'Após',
];

const PRESET_MOTIVES = [
  {
    tag: 'LOS',
    text: 'Cliente sem acesso constando LOS na ONU/ONT, feito verificações remotas, porém sem sucesso, necessário avaliação no local.',
  },
  {
    tag: 'Lentidão',
    text: 'Cliente informando lentidão geral na conexão, realizado configurações/atualizações no roteador/ONT remotamente, mas sem sucesso, cliente ainda informa dificuldade, necessário avaliação no local.',
  },
  {
    tag: 'Oscilação',
    text: 'Cliente relatando oscilação, com quedas frequentes na conexão, mesmo após configurações e validações remotas, cliente ainda relata o mesmo problema, necessário verificação no local.',
  },
];

const ONU_STATUS_SHORTCUTS = [
  'Sem energia',
  'LOS',
  'Desprovisionada/Não encontrada',
];

const RECENT_TYPE_SHORTCUTS = [
  'Sem acesso geral',
  'Oscilação',
  'Lentidão',
  'Troca de Equipamento',
];

export const WorkOrderForm: React.FC<Props> = ({
  formState,
  onChange,
  onClear,
  onFillExample,
}) => {
  const setToday = () => {
    const today = new Date().toISOString().split('T')[0];
    onChange({ scheduleDate: today });
  };

  const setTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    onChange({ scheduleDate: tomorrow.toISOString().split('T')[0] });
  };

  return (
    <div className="space-y-4">
      {/* SECTION 1: AGENDAMENTO */}
      <section className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#e4022c]/10 text-[#e4022c] flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              1. Agendamento
            </h3>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={setToday}
              className="px-2 py-0.5 text-[11px] font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              Hoje
            </button>
            <button
              type="button"
              onClick={setTomorrow}
              className="px-2 py-0.5 text-[11px] font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              Amanhã
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Data do Agendamento *
            </label>
            <input
              type="date"
              value={formState.scheduleDate}
              onChange={(e) => onChange({ scheduleDate: e.target.value })}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50/50 text-slate-800 font-medium focus:outline-none focus:border-[#e4022c] focus:ring-1 focus:ring-[#e4022c]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Período de Atendimento *
            </label>
            <select
              value={formState.period}
              onChange={(e) => onChange({ period: e.target.value as SchedulePeriod })}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50/50 text-slate-800 font-medium focus:outline-none focus:border-[#e4022c]"
            >
              {PERIOD_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'Horário Comercial' ? `${opt} (Padrão)` : opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Campo condicional para o período "Após" */}
        {formState.period === 'Após' && (
          <div className="mt-2.5 p-2.5 rounded-lg bg-amber-50/60 border border-amber-200/60 animate-in fade-in">
            <label className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900 mb-1">
              <Clock className="w-3 h-3 text-[#e4022c]" />
              Informar horário combinado (Após...):
            </label>
            <input
              type="text"
              placeholder="Ex: 14:00, 16h30 ou após o almoço"
              value={formState.customPeriodTime}
              onChange={(e) => onChange({ customPeriodTime: e.target.value })}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-amber-300 bg-white text-slate-800 focus:outline-none focus:border-[#e4022c]"
            />
          </div>
        )}
      </section>

      {/* SECTION 2: INFORMAÇÕES DO CLIENTE */}
      <section className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
          <div className="w-6 h-6 rounded-md bg-[#e4022c]/10 text-[#e4022c] flex items-center justify-center">
            <User className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            2. Informações do Cliente & Equipamentos
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          {/* Roteador */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Roteador Wi-Fi
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-lg bg-slate-100/80 border border-slate-200">
              {(['Comodato', 'Compra (Próprio)'] as EquipmentOwnership[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => onChange({ routerOwnership: type })}
                  className={`py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    formState.routerOwnership === type
                      ? 'bg-white text-[#e4022c] shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {type === 'Compra (Próprio)' ? 'Compra (Próprio)' : type}
                </button>
              ))}
            </div>
          </div>

          {/* ONU */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              ONU / Modem Óptico
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-lg bg-slate-100/80 border border-slate-200">
              {(['Comodato', 'Compra'] as OnuOwnership[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => onChange({ onuOwnership: type })}
                  className={`py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    formState.onuOwnership === type
                      ? 'bg-white text-[#e4022c] shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Contato com máscara */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Telefone / Celular de Contato
            </label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="(00) 00000-0000"
                value={formState.contactPhone}
                onChange={(e) => onChange({ contactPhone: formatPhoneMask(e.target.value) })}
                className="w-full text-xs pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50/50 font-mono text-slate-800 focus:outline-none focus:border-[#e4022c] focus:ring-1 focus:ring-[#e4022c]"
              />
            </div>

            {/* Checkbox contato com cliente */}
            <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formState.contactSuccess}
                onChange={(e) => onChange({ contactSuccess: e.target.checked })}
                className="w-4 h-4 rounded text-[#e4022c] focus:ring-[#e4022c] accent-[#e4022c]"
              />
              <span
                className={`text-[11px] font-semibold ${
                  formState.contactSuccess ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {formState.contactSuccess
                  ? '✅ Conseguiu contato com o cliente'
                  : '⚠️ Não conseguiu contato (Sem sucesso)'}
              </span>
            </label>
          </div>

          {/* Cliente Desde */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Cliente Desde (Copiar e colar do sistema)
            </label>
            <input
              type="text"
              placeholder="Ex: 15/04/2021 ou 3 anos"
              value={formState.clientSince}
              onChange={(e) => onChange({ clientSince: e.target.value })}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50/50 text-slate-800 focus:outline-none focus:border-[#e4022c] focus:ring-1 focus:ring-[#e4022c]"
            />
            <span className="block text-[10px] text-slate-400 mt-1">
              Cole a data de ativação ou tempo de contrato
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 3: DETALHES DA O.S / MOTIVO */}
      <section className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#e4022c]/10 text-[#e4022c] flex items-center justify-center">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              3. Detalhes da O.S (Solicitação / Motivo)
            </h3>
          </div>

          <span className="text-[10px] text-slate-400 hidden sm:inline">
            Clique nos atalhos para preencher instantaneamente
          </span>
        </div>

        {/* Atalhos de motivos mais comuns */}
        <div className="mb-2.5">
          <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
            Atalhos mais comuns:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_MOTIVES.map((item) => (
              <button
                key={item.tag}
                type="button"
                onClick={() => onChange({ motive: item.text })}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-[#e4022c]/10 text-slate-700 hover:text-[#e4022c] border border-slate-200/80 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Zap className="w-3 h-3 text-[#e4022c]" />
                <span>{item.tag}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <textarea
            rows={3}
            placeholder="Descreva o motivo detalhado da O.S ou utilize os atalhos acima..."
            value={formState.motive}
            onChange={(e) => onChange({ motive: e.target.value })}
            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50/50 text-slate-800 leading-relaxed focus:outline-none focus:border-[#e4022c] focus:ring-1 focus:ring-[#e4022c]"
          />
        </div>
      </section>

      {/* SECTION 4: INFORMAÇÕES TÉCNICAS */}
      <section className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
          <div className="w-6 h-6 rounded-md bg-[#e4022c]/10 text-[#e4022c] flex items-center justify-center">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            4. Informações Técnicas
          </h3>
        </div>

        <div className="space-y-3">
          {/* Sinal ONU */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-600">
                Sinal / Status ONU (ex: -XX.XX dBm ou status)
              </label>
            </div>

            {/* Atalhos de Sinal rápidos */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {ONU_STATUS_SHORTCUTS.map((sc) => (
                <button
                  key={sc}
                  type="button"
                  onClick={() => onChange({ onuSignal: sc })}
                  className="px-2 py-0.5 text-[11px] font-medium rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                >
                  {sc}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Digite o sinal (ex: -19.45 dBm) ou escolha um atalho acima"
              value={formState.onuSignal}
              onChange={(e) => onChange({ onuSignal: e.target.value })}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50/50 text-slate-800 focus:outline-none focus:border-[#e4022c] focus:ring-1 focus:ring-[#e4022c]"
            />
          </div>

          {/* Histórico de Quedas (Logs) opcional */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Histórico de Quedas (Logs de Autenticação/Porta) - Opcional
            </label>
            <textarea
              rows={2}
              placeholder="Cole aqui os logs recentes de desconexão, quedas ou flapping..."
              value={formState.dropLogs}
              onChange={(e) => onChange({ dropLogs: e.target.value })}
              className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-slate-50/50 font-mono text-[11px] text-slate-800 focus:outline-none focus:border-[#e4022c]"
            />
          </div>
        </div>
      </section>

      {/* SECTION 5: HISTÓRICO RECENTE (90 DIAS) */}
      <section className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#e4022c]/10 text-[#e4022c] flex items-center justify-center">
              <History className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              5. Histórico Recente (Últimos 90 dias)
            </h3>
          </div>

          {/* Toggle Sim/Não */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() =>
                onChange({
                  recentHistory: {
                    ...formState.recentHistory,
                    hasRecent: false,
                  },
                })
              }
              className={`px-2.5 py-0.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                !formState.recentHistory.hasRecent
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Não
            </button>
            <button
              type="button"
              onClick={() =>
                onChange({
                  recentHistory: {
                    ...formState.recentHistory,
                    hasRecent: true,
                  },
                })
              }
              className={`px-2.5 py-0.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                formState.recentHistory.hasRecent
                  ? 'bg-[#e4022c] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sim
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 mb-2">
          Teve atendimento ou ordem de serviço aberta nos últimos 90 dias?
        </p>

        {/* Campos condicionais se Sim */}
        {formState.recentHistory.hasRecent && (
          <div className="mt-3 p-3 rounded-lg bg-slate-50/80 border border-slate-200 space-y-3 animate-in fade-in">
            {/* Tipo de atendimento com atalhos */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Tipo de Atendimento / O.S Anterior:
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {RECENT_TYPE_SHORTCUTS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() =>
                      onChange({
                        recentHistory: {
                          ...formState.recentHistory,
                          recentType: t,
                        },
                      })
                    }
                    className="px-2 py-0.5 text-[11px] font-semibold rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 cursor-pointer"
                  >
                    {t}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Ex: Sem acesso geral, Oscilação, Lentidão..."
                value={formState.recentHistory.recentType}
                onChange={(e) =>
                  onChange({
                    recentHistory: {
                      ...formState.recentHistory,
                      recentType: e.target.value,
                    },
                  })
                }
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-[#e4022c]"
              />
            </div>

            {/* Data do atendimento anterior */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Data do Atendimento / O.S Anterior
              </label>
              <input
                type="date"
                value={formState.recentHistory.recentDate}
                onChange={(e) =>
                  onChange({
                    recentHistory: {
                      ...formState.recentHistory,
                      recentDate: e.target.value,
                    },
                  })
                }
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-[#e4022c]"
              />
            </div>

            {/* Baixa resumida */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Baixa Resumida (O que foi realizado na visita anterior?)
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Trocado conector óptico na CTO, sinal estabilizado em -19 dBm."
                value={formState.recentHistory.recentSummary}
                onChange={(e) =>
                  onChange({
                    recentHistory: {
                      ...formState.recentHistory,
                      recentSummary: e.target.value,
                    },
                  })
                }
                className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-[#e4022c]"
              />
            </div>
          </div>
        )}
      </section>

      {/* SECTION 6: RESPONSÁVEL & EXCEÇÃO */}
      <section className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#e4022c]/10 text-[#e4022c] flex items-center justify-center">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              6. Responsável & Exceção
            </h3>
          </div>

          {/* Toggle Exceção Sim/Não */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() =>
                onChange({
                  exceptionAuth: {
                    ...formState.exceptionAuth,
                    hasException: false,
                  },
                })
              }
              className={`px-2.5 py-0.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                !formState.exceptionAuth.hasException
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Não
            </button>
            <button
              type="button"
              onClick={() =>
                onChange({
                  exceptionAuth: {
                    ...formState.exceptionAuth,
                    hasException: true,
                  },
                })
              }
              className={`px-2.5 py-0.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                formState.exceptionAuth.hasException
                  ? 'bg-[#e4022c] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sim
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {formState.exceptionAuth.hasException && (
            <div className="p-3 rounded-lg bg-red-50/70 border border-red-200 animate-in fade-in">
              <label className="block text-[11px] font-bold text-[#e4022c] mb-1">
                Nome de quem autorizou a exceção: *
              </label>
              <input
                type="text"
                placeholder="Ex: Coordenador Carlos, Supervisor Marcos..."
                value={formState.exceptionAuth.authorizedBy}
                onChange={(e) =>
                  onChange({
                    exceptionAuth: {
                      ...formState.exceptionAuth,
                      authorizedBy: e.target.value,
                    },
                  })
                }
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-red-300 bg-white text-slate-800 focus:outline-none focus:border-[#e4022c]"
              />
            </div>
          )}

          {/* Nome do Operador (Fixado) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700">
                Nome do Operador Responsável pela O.S *
              </label>
              <span className="text-[10px] text-emerald-600 font-semibold">
                ✓ Salvo no seu navegador (não apaga ao limpar)
              </span>
            </div>
            <input
              type="text"
              placeholder="Digite seu nome (ex: João Silva)"
              value={formState.operatorName}
              onChange={(e) => onChange({ operatorName: e.target.value })}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50/50 font-medium text-slate-900 focus:outline-none focus:border-[#e4022c] focus:ring-1 focus:ring-[#e4022c]"
            />
          </div>
        </div>
      </section>

      {/* ACTION BAR: LIMPAR / TESTE */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onFillExample}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-200/80 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#e4022c]" />
          <span>Preencher Exemplo</span>
        </button>

        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Limpar Campos</span>
        </button>
      </div>
    </div>
  );
};
