import React from 'react';
import {
  Calendar,
  Clock,
  Phone,
  User,
  Tv,
  Radio,
  RotateCcw,
  Sparkles,
  Plus,
  Trash2,
  ShieldAlert,
  History,
  Activity,
  Layers,
  Monitor,
} from 'lucide-react';
import {
  TvRepairFormState,
  SchedulePeriod,
  TvStructureType,
  TvDeviceType,
} from '../types/os';
import { formatPhoneMask } from '../utils/maskGenerator';

interface Props {
  formState: TvRepairFormState;
  onChange: (updated: Partial<TvRepairFormState>) => void;
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

const STRUCTURE_OPTIONS: TvStructureType[] = ['Coaxial', 'Mininode'];

const DEVICE_OPTIONS: TvDeviceType[] = [
  'Decodificador Gospell',
  'Conversor Externo',
  'Cabo direto na TV',
];

const PROBLEM_SHORTCUTS = [
  {
    label: 'Todos canais sem sinal',
    text: 'Cliente relata que todos os canais estão completamente sem sinal na TV. Realizados testes básicos remotos e validação de conexões, porém sem retorno do sinal. Necessário envio de técnico ao local para aferição da recepção.',
  },
  {
    label: 'Canais falhando/digitalizando',
    text: 'Cliente relata canais falhando, travando ou digitalizando (pixelando imagem) de forma intermitente. Cabos e conexões verificados remotamente. Necessário aferição de níveis de sinal no local.',
  },
  {
    label: 'Canal com falha de áudio',
    text: 'Cliente relata ausência de áudio ou chiado/mudo em canais de TV, enquanto a imagem é exibida normalmente. Necessário validação dos cabos HDMI/RCA e configuração do conversor no local.',
  },
  {
    label: 'Conversor com defeito ou mau funcionamento',
    text: 'Cliente relata que o conversor/decodificador não liga, reinicia sozinho ou não responde aos comandos do controle remoto. Necessário teste ou substituição do equipamento no local.',
  },
];

export const TvRepairForm: React.FC<Props> = ({
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
      : [formState.contactPhone || ''];

  const handlePhoneChange = (index: number, val: string) => {
    const updated = [...phoneList];
    updated[index] = formatPhoneMask(val);
    onChange({
      phones: updated,
      contactPhone: updated[0] || '',
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
      contactPhone: updated[0] || '',
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2.5">
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
          <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200/60 animate-in fade-in">
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
            2. Informações do Cliente
          </h3>
        </div>

        <div className="space-y-3">
          {/* Contato (Telefones com máscara e botão +) */}
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

          {/* Cliente Desde */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Cliente Desde (Copiar e colar do sistema)
            </label>
            <input
              type="text"
              placeholder="Ex: 15/09/2021 ou 3 anos"
              value={formState.clientSince}
              onChange={(e) => onChange({ clientSince: e.target.value })}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50/50 text-slate-800 focus:outline-none focus:border-[#e4022c]"
            />
          </div>
        </div>
      </section>

      {/* SECTION 3: DETALHES DA O.S */}
      <section className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
          <div className="w-6 h-6 rounded-md bg-[#e4022c]/10 text-[#e4022c] flex items-center justify-center">
            <Tv className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            3. Detalhes da O.S — TV
          </h3>
        </div>

        <div className="space-y-3.5">
          {/* Descrição do Problema com Atalhos Rápidos */}
          <div>
            <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
              <label className="text-[11px] font-semibold text-slate-700">
                Descrição do Problema: *
              </label>
              <span className="text-[10px] text-slate-400">
                Clique em um atalho para preenchimento rápido
              </span>
            </div>

            {/* Atalhos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-2">
              {PROBLEM_SHORTCUTS.map((shortcut) => (
                <button
                  key={shortcut.label}
                  type="button"
                  onClick={() => onChange({ problemDescription: shortcut.text })}
                  className={`px-2.5 py-1.5 text-left text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    formState.problemDescription === shortcut.text
                      ? 'bg-[#e4022c]/10 text-[#e4022c] border-[#e4022c]/40 font-bold shadow-2xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-3 h-3 text-[#e4022c] shrink-0" />
                    <span className="truncate">{shortcut.label}</span>
                  </div>
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              placeholder="Descreva o problema de TV ou selecione um dos atalhos acima..."
              value={formState.problemDescription}
              onChange={(e) => onChange({ problemDescription: e.target.value })}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50/50 text-slate-800 leading-relaxed focus:outline-none focus:border-[#e4022c] focus:ring-1 focus:ring-[#e4022c]"
            />
          </div>

          {/* Estrutura: Coaxial / Mininode */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
              Estrutura de Transmissão: *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STRUCTURE_OPTIONS.map((struct) => (
                <button
                  key={struct}
                  type="button"
                  onClick={() => onChange({ structure: struct })}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    formState.structure === struct
                      ? 'bg-[#e4022c] text-white border-[#e4022c] font-bold shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Radio className="w-3.5 h-3.5" />
                    <span>{struct}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Dispositivo: Decodificador Gospell / Conversor Externo / Cabo direto na TV */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
              Dispositivo / Conexão no Cliente: *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {DEVICE_OPTIONS.map((dev) => (
                <button
                  key={dev}
                  type="button"
                  onClick={() => onChange({ device: dev })}
                  className={`py-2 px-2.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    formState.device === dev
                      ? 'bg-[#e4022c] text-white border-[#e4022c] font-bold shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5 text-center">
                    <Monitor className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{dev}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: ATENDIMENTOS OU ORDEM DE SERVIÇO RECENTE */}
      <section className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#e4022c]/10 text-[#e4022c] flex items-center justify-center">
              <History className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              4. Atendimentos ou O.S Recente
            </h3>
          </div>

          {/* Toggle Sim/Não */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => onChange({ hasRecent: false })}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                !formState.hasRecent
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Não
            </button>
            <button
              type="button"
              onClick={() => onChange({ hasRecent: true })}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                formState.hasRecent
                  ? 'bg-[#e4022c] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sim
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-600 mb-2">
          Teve atendimento ou ordem de serviço de TV recente nos últimos 90 dias?
        </p>

        {/* Campos condicionais se Sim */}
        {formState.hasRecent && (
          <div className="mt-2.5 p-3 rounded-lg bg-slate-50/80 border border-slate-200 space-y-2.5 animate-in fade-in">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Data do Atendimento / O.S Anterior:
              </label>
              <input
                type="date"
                value={formState.recentDate}
                onChange={(e) => onChange({ recentDate: e.target.value })}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-[#e4022c]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Baixa Resumida do Atendimento Anterior:
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Realizado alinhamento de conectores e troca de cabo HDMI..."
                value={formState.recentSummary}
                onChange={(e) => onChange({ recentSummary: e.target.value })}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-[#e4022c]"
              />
            </div>
          </div>
        )}
      </section>

      {/* SECTION 5: OPERADOR & AUTORIZAÇÃO */}
      <section className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#e4022c]/10 text-[#e4022c] flex items-center justify-center">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              5. Operador & Autorização
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
                placeholder="Ex: Supervisor Marcos, Coordenador Carlos..."
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
