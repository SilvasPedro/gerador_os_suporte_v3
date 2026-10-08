import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Phone,
  User,
  MapPin,
  Navigation,
  FileCheck,
  Truck,
  ShieldAlert,
  RotateCcw,
  Sparkles,
  ExternalLink,
  AlertTriangle,
  Plus,
  Trash2,
  Layers,
  Copy,
  Check,
  AlertCircle,
} from 'lucide-react';
import {
  AddressChangeFormState,
  SchedulePeriod,
  ProofOfAddressStatus,
  FreightServiceStatus,
} from '../types/os';
import { formatPhoneMask, generateAdditionalPointMask } from '../utils/maskGenerator';

interface Props {
  formState: AddressChangeFormState;
  onChange: (updated: Partial<AddressChangeFormState>) => void;
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

const PROOF_OPTIONS: ProofOfAddressStatus[] = ['Anexado', 'Não enviado', 'Não Possui'];

const FREIGHT_OPTIONS: FreightServiceStatus[] = [
  'Aceitou',
  'Recusou',
  'Já mudou/Contratou outro serviço',
  'Não oferecido',
];

export const AddressChangeForm: React.FC<Props> = ({
  formState,
  onChange,
  onClear,
  onFillExample,
}) => {
  const [copiedAdditionalPoint, setCopiedAdditionalPoint] = useState(false);

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
    onChange({
      phones: updated,
    });
  };

  const handleRemovePhone = (index: number) => {
    if (phoneList.length <= 1) return;
    const updated = phoneList.filter((_, i) => i !== index);
    onChange({
      phones: updated,
      phone: updated[0] || '',
    });
  };

  const handleCopyAdditionalPointMask = async () => {
    const mask = generateAdditionalPointMask(formState);
    try {
      await navigator.clipboard.writeText(mask);
      setCopiedAdditionalPoint(true);
      setTimeout(() => setCopiedAdditionalPoint(false), 2200);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = mask;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedAdditionalPoint(true);
      setTimeout(() => setCopiedAdditionalPoint(false), 2200);
    }
  };

  return (
    <div className="space-y-4">
      {/* AVISO MANDATÓRIO NO TOPO */}
      <div className="p-3 sm:p-3.5 rounded-xl bg-amber-50 border-2 border-amber-300/80 shadow-2xs flex items-start gap-2.5">
        <div className="p-1 rounded-lg bg-amber-500 text-white shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-black text-amber-950 uppercase tracking-wide flex items-center gap-1.5">
            <span>Atenção Operador</span>
            <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-bold">
              Procedimento Obrigatório
            </span>
          </h4>
          <p className="text-xs text-amber-900 font-semibold mt-0.5 leading-snug">
            Consultar disponibilidade de vagas em{' '}
            <strong className="text-[#e4022c] underline decoration-2">
              &ldquo;Agendamentos Mudança de Endereço no ERP&rdquo;
            </strong>{' '}
            antes de confirmar a data com o cliente.
          </p>
        </div>
      </div>

      {/* SECTION 1: AGENDAMENTO & DETALHES */}
      <section className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#e4022c]/10 text-[#e4022c] flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              1. Agendamento & Detalhes
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

          {/* Pode Adiantar Sim/Não */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Pode Adiantar se houver vaga?
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-lg bg-slate-100 border border-slate-200">
              <button
                type="button"
                onClick={() => onChange({ canAdvance: true })}
                className={`py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  formState.canAdvance
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sim
              </button>
              <button
                type="button"
                onClick={() => onChange({ canAdvance: false })}
                className={`py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  !formState.canAdvance
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Não
              </button>
            </div>
          </div>

          {/* Período */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Período *
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

        {/* Taxa: Isento (Fixo) */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-600">Taxa de Mudança:</span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            {formState.fee || 'Isento (Fixo)'}
          </span>
        </div>
      </section>

      {/* SECTION 2: PONTO ADICIONAL */}
      <section className="bg-white rounded-xl p-3 sm:p-3.5 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-md bg-[#e4022c]/10 text-[#e4022c] flex items-center justify-center shrink-0">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-slate-800 tracking-tight">
                2. Possui Ponto Adicional ativo no local?
              </h3>
              <p className="text-[10px] text-slate-500 truncate">
                Indique se o cliente tem roteador ou ponto cabeado secundário
              </p>
            </div>
          </div>

          {/* Toggle Sim/Não */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => onChange({ hasAdditionalPoint: false })}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                !formState.hasAdditionalPoint
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Não
            </button>
            <button
              type="button"
              onClick={() => onChange({ hasAdditionalPoint: true })}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                formState.hasAdditionalPoint
                  ? 'bg-[#e4022c] text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sim
            </button>
          </div>
        </div>

        {/* AVISO DISCRETO E MINIMALISTA */}
        {formState.hasAdditionalPoint && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-[11px] animate-in fade-in">
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
              <span>Aviso: abrir <strong>2 O.S separadas</strong> no ERP (Principal + Adicional).</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                <span>Qtd:</span>
                {[1, 2, 3].map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => onChange({ additionalPointQuantity: qty })}
                    className={`px-1 rounded font-bold cursor-pointer transition-colors ${
                      (formState.additionalPointQuantity || 1) === qty
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {qty}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleCopyAdditionalPointMask}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  copiedAdditionalPoint
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                }`}
                title="Copiar máscara formatada da 2ª O.S de ponto adicional"
              >
                {copiedAdditionalPoint ? (
                  <>
                    <Check className="w-3 h-3 text-white" />
                    <span>Copiada!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-600" />
                    <span>Copiar 2ª O.S</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* SECTION 3: ENDEREÇOS E CONTATO COM MÚLTIPLOS TELEFONES */}
      <section className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
          <div className="w-6 h-6 rounded-md bg-[#e4022c]/10 text-[#e4022c] flex items-center justify-center">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            3. Endereços & Contato
          </h3>
        </div>

        <div className="space-y-3">
          {/* Cliente Desde */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Cliente Desde (Copiar e colar do sistema)
            </label>
            <input
              type="text"
              placeholder="Ex: 12/03/2021 ou 2 anos"
              value={formState.clientSince}
              onChange={(e) => onChange({ clientSince: e.target.value })}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50/50 text-slate-800 focus:outline-none focus:border-[#e4022c]"
            />
          </div>

          {/* TELEFONES DE CONTATO (COM SUPORTE A MÚLTIPLOS TELEFONES COM BOTÃO +) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#e4022c]" />
                <span>Telefones de Contato ({phoneList.length})</span>
              </label>

              {/* Botão + para adicionar mais telefones */}
              <button
                type="button"
                onClick={handleAddPhone}
                className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold text-[#e4022c] hover:bg-[#e4022c]/10 rounded-md border border-[#e4022c]/30 transition-colors cursor-pointer"
                title="Adicionar mais um telefone de contato"
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
                      title="Remover este telefone"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <span className="block text-[10px] text-slate-400 mt-1">
              Clique em &ldquo;+ Adicionar Telefone&rdquo; para inserir números extras (recado, celular alternativo, etc.).
            </span>
          </div>

          {/* Endereço Atual */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Endereço Atual *
            </label>
            <input
              type="text"
              placeholder="Rua, Número, Bairro, Complemento (Onde o sinal está ativo hoje)"
              value={formState.currentAddress}
              onChange={(e) => onChange({ currentAddress: e.target.value })}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50/50 text-slate-800 focus:outline-none focus:border-[#e4022c]"
            />
          </div>

          {/* Novo Endereço */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Novo Endereço *
            </label>
            <input
              type="text"
              placeholder="Rua, Número, Bairro, CEP e Complemento do novo imóvel"
              value={formState.newAddress}
              onChange={(e) => onChange({ newAddress: e.target.value })}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50/50 text-slate-800 focus:outline-none focus:border-[#e4022c]"
            />
          </div>

          {/* Referência & Link Maps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Ponto de Referência
              </label>
              <input
                type="text"
                placeholder="Ex: Próximo ao supermercado, em frente à praça..."
                value={formState.referencePoint}
                onChange={(e) => onChange({ referencePoint: e.target.value })}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50/50 text-slate-800 focus:outline-none focus:border-[#e4022c]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-600">
                  Localização do Maps (Link)
                </label>
                {formState.mapsLink && (
                  <a
                    href={formState.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-[#e4022c] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Abrir</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <div className="relative">
                <Navigation className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="https://maps.google.com/..."
                  value={formState.mapsLink}
                  onChange={(e) => onChange({ mapsLink: e.target.value })}
                  className="w-full text-xs pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50/50 text-slate-800 focus:outline-none focus:border-[#e4022c]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: VERIFICAÇÕES (COMPROVANTE DE ENDEREÇO) */}
      <section className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
          <div className="w-6 h-6 rounded-md bg-[#e4022c]/10 text-[#e4022c] flex items-center justify-center">
            <FileCheck className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            4. Verificações de Cadastro
          </h3>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
            Comprovante de Endereço:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PROOF_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange({ proofOfAddress: opt })}
                className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  formState.proofOfAddress === opt
                    ? opt === 'Anexado'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-400 font-bold shadow-2xs'
                      : opt === 'Não Possui'
                      ? 'bg-red-50 text-[#e4022c] border-red-300 font-bold shadow-2xs'
                      : 'bg-amber-50 text-amber-800 border-amber-300 font-bold shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: ETECC RESOLVE (SERVIÇO DE FRETE) */}
      <section className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
          <div className="w-6 h-6 rounded-md bg-[#e4022c]/10 text-[#e4022c] flex items-center justify-center">
            <Truck className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            5. ETECC Resolve
          </h3>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
            Cliente aceitou serviço de frete?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {FREIGHT_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange({ freightAccepted: opt })}
                className={`py-2 px-2.5 text-xs font-semibold rounded-lg border text-left transition-all cursor-pointer ${
                  formState.freightAccepted === opt
                    ? opt === 'Aceitou'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-400 font-bold shadow-2xs'
                      : 'bg-slate-800 text-white border-slate-800 font-bold shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{opt}</span>
                  {formState.freightAccepted === opt && <span>✓</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: AUTORIZAÇÃO & ATENDENTE */}
      <section className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#e4022c]/10 text-[#e4022c] flex items-center justify-center">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              6. Autorização & Atendente
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
                Autorizado por exceção (Nome de quem autorizou): *
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
