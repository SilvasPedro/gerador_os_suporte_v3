import React from 'react';
import {
  Calendar,
  Clock,
  Phone,
  User,
  Zap,
  Wifi,
  DollarSign,
  ShieldAlert,
  RotateCcw,
  Sparkles,
  Plus,
  Trash2,
  FileCheck,
  CheckCircle2,
  Layers,
  Network,
} from 'lucide-react';
import {
  AdditionalPointCablingFormState,
  SchedulePeriod,
  TelecomPlan,
  ExemptionReasonType,
  EquipmentOwnership,
  OnuOwnership,
} from '../types/os';
import { formatPhoneMask } from '../utils/maskGenerator';

interface Props {
  formState: AdditionalPointCablingFormState;
  onChange: (updated: Partial<AdditionalPointCablingFormState>) => void;
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

const PLAN_OPTIONS: TelecomPlan[] = [
  '400Mb',
  '600Mb',
  '800Mb',
  '1000Mb',
  'Gamer (1000 Mb)',
];

const EXEMPTION_REASONS: ExemptionReasonType[] = [
  'Upgrade',
  'Cliente antigo',
  'Retenção de cancelamento',
  'Autorizado diretoria',
  'Outro',
];

const SHORTCUT_MOTIVES = {
  pontoAdicional:
    'Cliente solicita instalação/ativação de Ponto Adicional para expansão de cobertura Wi-Fi/cabeada no imóvel. Realizado alinhamento prévio, necessário envio de técnico para conectorização e configuração.',
  cabearDispositivo:
    'Cliente solicita cabeamento de rede estruturado (UTP) para dispositivo específico (PC/Console/TV). Necessário passagem de cabo de rede, crimpagem de conectores RJ45 e testes de tráfego no local.',
};

export const AdditionalPointForm: React.FC<Props> = ({
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

  // Phones management
  const phoneList =
    formState.phones && formState.phones.length > 0
      ? formState.phones
      : [formState.phone || ''];

  const handlePhoneChange = (index: number, val: string) => {
    const updated = [...phoneList];
    updated[index] = formatPhoneMask(val);
    onChange({
      phones: updated,
      phone: updated[0] || '',
    });
  };

  const handleAddPhone = () => {
    const updated = [...phoneList, ''];
    onChange({ phones: updated });
  };

  const handleRemovePhone = (index: number) => {
    if (phoneList.length <= 1) return;
    const updated = phoneList.filter((_, i) => i !== index);
    onChange({
      phones: updated,
      phone: updated[0] || '',
    });
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
              1. Agendamento & Solicitação
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          {/* Data */}
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

          {/* Período */}
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

        {/* Período condicional "Após" */}
        {formState.period === 'Após' && (
          <div className="mb-3 p-2.5 rounded-lg bg-amber-50/60 border border-amber-200/60 animate-in fade-in">
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

        {/* Solicitação (com atalhos) */}
        <div>
          <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
            <label className="text-[11px] font-semibold text-slate-700">
              Solicitação (Motivo do Atendimento) *
            </label>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onChange({ motive: SHORTCUT_MOTIVES.pontoAdicional })}
                className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded bg-slate-100 hover:bg-[#e4022c]/10 text-slate-700 hover:text-[#e4022c] border border-slate-200 cursor-pointer transition-colors"
                title="Inserir texto padrão para Ponto Adicional"
              >
                <Layers className="w-3 h-3 text-[#e4022c]" />
                <span>Ponto Adicional</span>
              </button>
              <button
                type="button"
                onClick={() => onChange({ motive: SHORTCUT_MOTIVES.cabearDispositivo })}
                className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded bg-slate-100 hover:bg-[#e4022c]/10 text-slate-700 hover:text-[#e4022c] border border-slate-200 cursor-pointer transition-colors"
                title="Inserir texto padrão para Cabeamento de Dispositivo"
              >
                <Network className="w-3 h-3 text-[#e4022c]" />
                <span>Cabear Dispositivo</span>
              </button>
            </div>
          </div>

          <textarea
            rows={3}
            placeholder="Descreva a solicitação ou utilize os atalhos rápidos acima..."
            value={formState.motive}
            onChange={(e) => onChange({ motive: e.target.value })}
            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50/50 text-slate-800 leading-relaxed focus:outline-none focus:border-[#e4022c] focus:ring-1 focus:ring-[#e4022c]"
          />
        </div>
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

        <div className="space-y-3">
          {/* Telefones de Contato com botão + */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#e4022c]" />
                <span>Telefones de Contato ({phoneList.length})</span>
              </label>

              <button
                type="button"
                onClick={handleAddPhone}
                className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold text-[#e4022c] hover:bg-[#e4022c]/10 rounded-md border border-[#e4022c]/30 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Telefone</span>
              </button>
            </div>

            <div className="space-y-2">
              {phoneList.map((ph, idx) => (
                <div key={idx} className="flex items-center gap-2 animate-in fade-in">
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-2 text-[10px] font-bold text-slate-400">
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      placeholder="(00) 00000-0000"
                      value={ph}
                      onChange={(e) => handlePhoneChange(idx, e.target.value)}
                      className="w-full text-xs pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50/50 font-mono text-slate-800 focus:outline-none focus:border-[#e4022c]"
                    />
                  </div>

                  {phoneList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePhone(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Remover telefone"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Plano Atual */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
              Plano Atual do Cliente:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PLAN_OPTIONS.map((plan) => (
                <button
                  key={plan}
                  type="button"
                  onClick={() => onChange({ plan })}
                  className={`py-1 px-2.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    formState.plan === plan
                      ? 'bg-[#e4022c] text-white border-[#e4022c] shadow-xs font-bold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {plan}
                </button>
              ))}
            </div>
          </div>

          {/* Cliente Desde */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Cliente Desde (Copiar e colar do sistema)
            </label>
            <input
              type="text"
              placeholder="Ex: 10/08/2021 ou 3 anos"
              value={formState.clientSince}
              onChange={(e) => onChange({ clientSince: e.target.value })}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50/50 text-slate-800 focus:outline-none focus:border-[#e4022c]"
            />
          </div>

          {/* Roteador Principal & ONU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Roteador Principal
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-lg bg-slate-100/80 border border-slate-200">
                {(['Comodato', 'Compra (Próprio)'] as EquipmentOwnership[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onChange({ mainRouterOwnership: type })}
                    className={`py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      formState.mainRouterOwnership === type
                        ? 'bg-white text-[#e4022c] shadow-xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

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
        </div>
      </section>

      {/* SECTION 3: INFORMAÇÕES DA O.S (UPGRADE, ROTEADOR & CUSTO) */}
      <section className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
          <div className="w-6 h-6 rounded-md bg-[#e4022c]/10 text-[#e4022c] flex items-center justify-center">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            3. Informações da O.S & Equipamentos
          </h3>
        </div>

        <div className="space-y-3.5">
          {/* Realizou Upgrade? */}
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-50/70 border border-slate-200">
            <div>
              <label className="text-xs font-semibold text-slate-800 block">
                Realizou Upgrade de Plano?
              </label>
              <span className="text-[10px] text-slate-500">
                Indique se o cliente alterou para um plano superior nesta solicitação.
              </span>
            </div>

            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-200/70 shrink-0">
              <button
                type="button"
                onClick={() => onChange({ didUpgrade: false })}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  !formState.didUpgrade
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Não
              </button>
              <button
                type="button"
                onClick={() => onChange({ didUpgrade: true })}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  formState.didUpgrade
                    ? 'bg-[#e4022c] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sim
              </button>
            </div>
          </div>

          {/* Será necessário Roteador? */}
          <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-800 block">
                  Será necessário Roteador para o ponto?
                </label>
                <span className="text-[10px] text-slate-500">
                  Técnico precisará levar roteador secundário ou o cliente já possui equipamento?
                </span>
              </div>

              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-200/70 shrink-0">
                <button
                  type="button"
                  onClick={() => onChange({ needsRouter: false })}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    !formState.needsRouter
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Não
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ needsRouter: true })}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    formState.needsRouter
                      ? 'bg-[#e4022c] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sim
                </button>
              </div>
            </div>

            {/* Se sim, tipo do roteador */}
            {formState.needsRouter && (
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between animate-in fade-in">
                <span className="text-[11px] font-bold text-slate-700">
                  Tipo do Roteador para o Ponto:
                </span>
                <div className="flex items-center gap-1.5 p-1 rounded-lg bg-white border border-slate-300">
                  {(['Comodato', 'Compra'] as OnuOwnership[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => onChange({ routerType: type })}
                      className={`px-2.5 py-0.5 text-xs font-semibold rounded transition-all cursor-pointer ${
                        formState.routerType === type
                          ? 'bg-[#e4022c] text-white font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Será gerado custo? */}
          <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-800 block">
                  Será gerado custo / cobrança ao cliente?
                </label>
                <span className="text-[10px] text-slate-500">
                  Defina se haverá taxa de instalação do ponto adicional / passagem de cabo.
                </span>
              </div>

              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-200/70 shrink-0">
                <button
                  type="button"
                  onClick={() => onChange({ hasCost: false })}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    !formState.hasCost
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Não (Isento)
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ hasCost: true })}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    formState.hasCost
                      ? 'bg-[#e4022c] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sim (Cobrar)
                </button>
              </div>
            </div>

            {/* Se Não (Isento): Motivo da Isenção */}
            {!formState.hasCost && (
              <div className="pt-2 border-t border-slate-200 space-y-2 animate-in fade-in">
                <label className="block text-[11px] font-bold text-slate-700">
                  Motivo da Isenção de Custo: *
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {EXEMPTION_REASONS.map((reason) => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => onChange({ exemptionReason: reason })}
                      className={`py-1 px-2.5 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
                        formState.exemptionReason === reason
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>

                {/* Se Autorizado diretoria: informar nome */}
                {formState.exemptionReason === 'Autorizado diretoria' && (
                  <div className="mt-2 p-2 rounded-lg bg-white border border-slate-300 animate-in fade-in">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nome do Diretor / Gestor que autorizou: *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Diretor Carlos Mendes"
                      value={formState.directorName}
                      onChange={(e) => onChange({ directorName: e.target.value })}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50/50 text-slate-800 focus:outline-none focus:border-[#e4022c]"
                    />
                  </div>
                )}

                {/* Se Outro: especificar */}
                {formState.exemptionReason === 'Outro' && (
                  <div className="mt-2 p-2 rounded-lg bg-white border border-slate-300 animate-in fade-in">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Especifique o motivo da isenção: *
                    </label>
                    <input
                      type="text"
                      placeholder="Descreva o motivo da isenção..."
                      value={formState.customExemptionReason}
                      onChange={(e) => onChange({ customExemptionReason: e.target.value })}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50/50 text-slate-800 focus:outline-none focus:border-[#e4022c]"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 4: AVALIAÇÃO TÉCNICA */}
      <section className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#e4022c]/10 text-[#e4022c] flex items-center justify-center">
              <FileCheck className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              4. Avaliação Técnica
            </h3>
          </div>

          {/* Toggle Sim/Não */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => onChange({ hasTechnicalEvaluation: false })}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                !formState.hasTechnicalEvaluation
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Não
            </button>
            <button
              type="button"
              onClick={() => onChange({ hasTechnicalEvaluation: true })}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                formState.hasTechnicalEvaluation
                  ? 'bg-[#e4022c] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sim
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-600 mb-2">
          Já foi realizada visita prévia ou avaliação de viabilidade técnica no local?
        </p>

        {/* Campo condicional de baixa resumida */}
        {formState.hasTechnicalEvaluation && (
          <div className="mt-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2 animate-in fade-in">
            <label className="block text-[11px] font-bold text-slate-700">
              Baixa Resumida da Avaliação Técnica: *
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Técnico Rodrigo validou viabilidade para passagem de 25m de cabo UTP pelo conduíte da sala ao quarto."
              value={formState.evaluationSummary}
              onChange={(e) => onChange({ evaluationSummary: e.target.value })}
              className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-[#e4022c]"
            />
          </div>
        )}
      </section>

      {/* SECTION 5: AUTORIZAÇÃO & ATENDENTE */}
      <section className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#e4022c]/10 text-[#e4022c] flex items-center justify-center">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              5. Autorização & Atendente
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
                Autorizado por Exceção (Nome de quem autorizou): *
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

          {/* Operador (Fixado) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700">
                Nome do Operador Responsável *
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
