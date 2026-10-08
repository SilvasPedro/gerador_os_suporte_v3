import React from 'react';
import {
  Calendar,
  Clock,
  Phone,
  User,
  Sparkles,
  RotateCcw,
  Plus,
  Trash2,
  DollarSign,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  ArrowRightLeft,
  Info,
} from 'lucide-react';
import { RoomChangeFormState, SchedulePeriod, ExemptionReasonType } from '../types/os';
import { formatPhoneMask } from '../utils/maskGenerator';

interface Props {
  data: RoomChangeFormState;
  onChange: (data: RoomChangeFormState) => void;
  onClear: () => void;
  onFillExample: () => void;
  onOperatorChange: (name: string) => void;
}

const PERIOD_OPTIONS: SchedulePeriod[] = [
  'Horário Comercial',
  'Primeira do dia',
  'Manhã',
  'Tarde',
  'Última do dia',
  'Após',
];

const EXEMPTION_OPTIONS: ExemptionReasonType[] = [
  'Upgrade',
  'Cliente antigo',
  'Retenção de cancelamento',
  'Autorizado diretoria',
  'Outro',
];

const DESCRIPTION_SHORTCUTS = [
  {
    title: 'Roteador para Sala',
    desc: 'Mudança de cômodo do roteador principal para a sala (melhorar sinal Wi-Fi no ambiente principal).',
  },
  {
    title: 'Para Escritório / Quarto',
    desc: 'Mudança do roteador e ponto de rede para quarto/escritório para atendimento de Home Office / Cabear PC.',
  },
  {
    title: 'Reforma Residencial',
    desc: 'Relocação de ponto óptico e tomada de fibra devido a reforma/pintura e reorganização de móveis.',
  },
  {
    title: 'Painel Planejado de TV',
    desc: 'Mudança de cômodo e fixação da ONU e roteador em novo painel planejado de TV.',
  },
  {
    title: 'Nova Fiação Estruturada',
    desc: 'Passagem de nova fiação para transferência de cômodo em tubulação existente com guia.',
  },
];

export const RoomChangeForm: React.FC<Props> = ({
  data,
  onChange,
  onClear,
  onFillExample,
  onOperatorChange,
}) => {
  const updateField = <K extends keyof RoomChangeFormState>(
    field: K,
    value: RoomChangeFormState[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  const handlePhoneChange = (index: number, val: string) => {
    const formatted = formatPhoneMask(val);
    const newPhones = [...(data.phones || [data.contactPhone || ''])];
    newPhones[index] = formatted;
    onChange({
      ...data,
      phones: newPhones,
      contactPhone: newPhones[0] || '',
    });
  };

  const handleAddPhone = () => {
    const current = data.phones && data.phones.length > 0 ? data.phones : [data.contactPhone || ''];
    if (current.length >= 4) return;
    onChange({
      ...data,
      phones: [...current, ''],
    });
  };

  const handleRemovePhone = (index: number) => {
    const current = data.phones && data.phones.length > 0 ? data.phones : [data.contactPhone || ''];
    const updated = current.filter((_, i) => i !== index);
    onChange({
      ...data,
      phones: updated.length > 0 ? updated : [''],
      contactPhone: updated[0] || '',
    });
  };

  const setDateRelative = (daysFromToday: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysFromToday);
    const isoDate = target.toISOString().split('T')[0];
    updateField('scheduleDate', isoDate);
  };

  const applyDescriptionShortcut = (text: string) => {
    if (data.description && data.description.trim().length > 0) {
      updateField('description', `${data.description.trim()}\n• ${text}`);
    } else {
      updateField('description', text);
    }
  };

  const phonesList = data.phones && data.phones.length > 0 ? data.phones : [data.contactPhone || ''];

  return (
    <div className="space-y-3.5">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 sm:p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#e4022c]/10 text-[#e4022c] flex items-center justify-center shrink-0">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
              O.S - Mudança de Cômodo
            </h2>
            <p className="text-[11px] text-slate-500 truncate">
              Relocação interna de ponto óptico, roteador e cabos dentro da mesma residência
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onFillExample}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Preencher com exemplo realista"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Exemplo</span>
          </button>
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 transition-colors cursor-pointer"
            title="Limpar formulário mantendo operador"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpar</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: AGENDAMENTO */}
      <section className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
          <Calendar className="w-4 h-4 text-[#e4022c]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            1. Agendamento da Visita
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Data com atalhos */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                Data do Agendamento *
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setDateRelative(0)}
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  Hoje
                </button>
                <button
                  type="button"
                  onClick={() => setDateRelative(1)}
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  Amanhã
                </button>
                <button
                  type="button"
                  onClick={() => setDateRelative(2)}
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  +2 dias
                </button>
              </div>
            </div>
            <input
              type="date"
              required
              value={data.scheduleDate}
              onChange={(e) => updateField('scheduleDate', e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#e4022c] focus:ring-1 focus:ring-[#e4022c]"
            />
          </div>

          {/* Pode Adiantar */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Pode Adiantar se houver vaga?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateField('canAdvance', true)}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  data.canAdvance
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                SIM (Pode Adiantar)
              </button>
              <button
                type="button"
                onClick={() => updateField('canAdvance', false)}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  !data.canAdvance
                    ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                NÃO (Apenas no dia)
              </button>
            </div>
          </div>

          {/* Período */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Período de Atendimento *
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PERIOD_OPTIONS.map((p) => {
                const isSelected = data.period === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => updateField('period', p)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#e4022c] text-white border-[#e4022c] shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            {data.period === 'Após' && (
              <div className="mt-2 animate-in fade-in">
                <input
                  type="text"
                  placeholder="Ex: Após às 15:00 / Horário específico solicitado pelo cliente"
                  value={data.customPeriodTime}
                  onChange={(e) => updateField('customPeriodTime', e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#e4022c]"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 2: INFORMAÇÕES DO CLIENTE */}
      <section className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
          <User className="w-4 h-4 text-[#e4022c]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            2. Informações do Cliente
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Telefones de Contato */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Telefone(s) de Contato *
              </label>
              {phonesList.length < 4 && (
                <button
                  type="button"
                  onClick={handleAddPhone}
                  className="text-[10px] font-bold text-[#e4022c] hover:text-[#b30020] flex items-center gap-0.5 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Adicionar Tel</span>
                </button>
              )}
            </div>

            <div className="space-y-2">
              {phonesList.map((tel, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    required={idx === 0}
                    placeholder="(00) 00000-0000"
                    value={tel}
                    onChange={(e) => handlePhoneChange(idx, e.target.value)}
                    className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#e4022c] focus:ring-1 focus:ring-[#e4022c]"
                  />
                  {phonesList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePhone(idx)}
                      title="Remover telefone"
                      className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Cliente Desde */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Cliente Desde
            </label>
            <input
              type="text"
              placeholder="Ex: 10/2021 ou 15/03/2022"
              value={data.clientSince}
              onChange={(e) => updateField('clientSince', e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#e4022c] focus:ring-1 focus:ring-[#e4022c]"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Data de contratação para verificar tempo de fidelidade / política de isenção
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: DETALHES DA O.S */}
      <section className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
          <ArrowRightLeft className="w-4 h-4 text-[#e4022c]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            3. Detalhes da O.S - Mudança de Cômodo
          </h3>
        </div>

        {/* Descrição do serviço com atalhos */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">
              Descrição do Serviço *
            </label>
            <span className="text-[10px] text-slate-400">
              {data.description.length} caracteres
            </span>
          </div>

          {/* Atalhos */}
          <div className="flex flex-wrap gap-1.5">
            {DESCRIPTION_SHORTCUTS.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => applyDescriptionShortcut(item.desc)}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 transition-colors cursor-pointer"
                title={item.desc}
              >
                + {item.title}
              </button>
            ))}
          </div>

          <textarea
            rows={3}
            required
            placeholder="Descreva para onde os equipamentos serão movidos (ex: roteador da sala para o quarto do fundo, tubulação livre, etc.)."
            value={data.description}
            onChange={(e) => updateField('description', e.target.value)}
            className="w-full text-xs p-3 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#e4022c] focus:ring-1 focus:ring-[#e4022c] leading-relaxed"
          />
        </div>

        {/* Custo & Isenção */}
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 space-y-3 mb-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Será gerado custo? *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateField('hasCost', true)}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  data.hasCost
                    ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                SIM (Gerar Custo)
              </button>
              <button
                type="button"
                onClick={() => updateField('hasCost', false)}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  !data.hasCost
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                NÃO (Isento)
              </button>
            </div>
          </div>

          {/* Se NÃO gera custo: Motivo da Isenção */}
          {!data.hasCost && (
            <div className="pt-2 border-t border-slate-200/80 animate-in fade-in space-y-2">
              <label className="block text-[11px] font-bold text-slate-700">
                Motivo da Isenção *
              </label>
              <div className="flex flex-wrap gap-1.5">
                {EXEMPTION_OPTIONS.map((reason) => {
                  const isSelected = data.exemptionReason === reason;
                  return (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => updateField('exemptionReason', reason)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#e4022c] text-white border-[#e4022c]'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {reason}
                    </button>
                  );
                })}
              </div>

              {data.exemptionReason === 'Autorizado diretoria' && (
                <div className="mt-2 animate-in fade-in">
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Nome de quem autorizou na Diretoria *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Roberto Silva / Diretoria Operacional"
                    value={data.directorName}
                    onChange={(e) => updateField('directorName', e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#e4022c]"
                  />
                </div>
              )}

              {data.exemptionReason === 'Outro' && (
                <div className="mt-2 animate-in fade-in">
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Especifique o motivo da isenção *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Acordo no Procon / Cortesia comercial gerente"
                    value={data.customExemptionReason}
                    onChange={(e) => updateField('customExemptionReason', e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#e4022c]"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cliente Ciente da Possibilidade de Custo? */}
        <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            Cliente ciente da possibilidade de custo? *
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => updateField('clientAwareOfCost', true)}
              className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                data.clientAwareOfCost
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              SIM (Cliente Ciente)
            </button>
            <button
              type="button"
              onClick={() => updateField('clientAwareOfCost', false)}
              className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                !data.clientAwareOfCost
                  ? 'bg-red-600 text-white border-red-700 shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              NÃO (Não foi avisado)
            </button>
          </div>

          {!data.clientAwareOfCost && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Atenção:</strong> Alinhe com o cliente antes do envio do técnico para evitar recusa ou cobrança indevida no local.
              </span>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 4: AUTORIZAÇÃO & ATENDENTE */}
      <section className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
          <ShieldAlert className="w-4 h-4 text-[#e4022c]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            4. Autorização & Atendente
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Autorizado por Exceção */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Autorizado por Exceção?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  updateField('exceptionAuth', {
                    ...data.exceptionAuth,
                    hasException: false,
                    authorizedBy: '',
                  })
                }
                className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  !data.exceptionAuth.hasException
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                NÃO (Padrão)
              </button>
              <button
                type="button"
                onClick={() =>
                  updateField('exceptionAuth', {
                    ...data.exceptionAuth,
                    hasException: true,
                  })
                }
                className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  data.exceptionAuth.hasException
                    ? 'bg-amber-500 text-white border-amber-600'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                SIM (Exceção)
              </button>
            </div>

            {data.exceptionAuth.hasException && (
              <div className="mt-2 animate-in fade-in">
                <input
                  type="text"
                  required
                  placeholder="Nome do supervisor / gestor autorizador"
                  value={data.exceptionAuth.authorizedBy}
                  onChange={(e) =>
                    updateField('exceptionAuth', {
                      ...data.exceptionAuth,
                      authorizedBy: e.target.value,
                    })
                  }
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#e4022c]"
                />
              </div>
            )}
          </div>

          {/* Operador */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Nome do Operador *
            </label>
            <input
              type="text"
              required
              value={data.operatorName}
              onChange={(e) => {
                updateField('operatorName', e.target.value);
                onOperatorChange(e.target.value);
              }}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#e4022c] focus:ring-1 focus:ring-[#e4022c]"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Salvo no navegador para todas as telas do sistema
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
