import React, { useState } from 'react';
import { Copy, Check, FileText, Layers, CheckCircle2 } from 'lucide-react';

interface Props {
  maskText: string;
  onSaveHistory?: () => void;
  isSaving?: boolean;
  secondaryMaskText?: string;
  secondaryMaskTitle?: string;
}

export const LiveMaskPreview: React.FC<Props> = ({
  maskText,
  secondaryMaskText,
  secondaryMaskTitle = 'O.S Ponto Adicional',
}) => {
  const [activeTab, setActiveTab] = useState<'primary' | 'secondary'>('primary');
  const [copiedPrimary, setCopiedPrimary] = useState(false);
  const [copiedSecondary, setCopiedSecondary] = useState(false);

  const currentText = activeTab === 'primary' || !secondaryMaskText ? maskText : secondaryMaskText;

  const handleCopyCurrent = async () => {
    try {
      await navigator.clipboard.writeText(currentText);
      if (activeTab === 'primary') {
        setCopiedPrimary(true);
        setTimeout(() => setCopiedPrimary(false), 2200);
      } else {
        setCopiedSecondary(true);
        setTimeout(() => setCopiedSecondary(false), 2200);
      }
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = currentText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      if (activeTab === 'primary') {
        setCopiedPrimary(true);
        setTimeout(() => setCopiedPrimary(false), 2200);
      } else {
        setCopiedSecondary(true);
        setTimeout(() => setCopiedSecondary(false), 2200);
      }
    }
  };

  const lineCount = currentText.split('\n').length;
  const charCount = currentText.length;
  const isCopied = activeTab === 'primary' ? copiedPrimary : copiedSecondary;

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-xs border border-slate-200/90 overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#e4022c]" />
          <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">
            Máscara Gerada
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {lineCount} linhas • {charCount} chars
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopyCurrent}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer ${
              isCopied
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-[#e4022c] hover:bg-[#c30022] text-white shadow-red-500/20'
            }`}
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Máscara</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs if secondary mask is present */}
      {secondaryMaskText && (
        <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-100/90 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('primary')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'primary'
                ? 'bg-white text-[#e4022c] font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1ª O.S - Principal
          </button>
          <button
            onClick={() => setActiveTab('secondary')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'secondary'
                ? 'bg-[#e4022c] text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>2ª {secondaryMaskTitle}</span>
          </button>
        </div>
      )}

      {/* Copy Banner when copied */}
      {isCopied && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-3.5 py-1.5 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              {activeTab === 'primary' ? 'O.S Principal' : secondaryMaskTitle} copiada! Pronto para colar no IXC / ERP.
            </span>
          </div>
        </div>
      )}

      {/* Preformatted Content Area */}
      <div className="relative flex-1 p-3 bg-slate-900 font-mono text-[11px] sm:text-xs leading-relaxed text-slate-100 overflow-y-auto select-all">
        <pre className="whitespace-pre-wrap break-words font-mono text-emerald-400/90 selection:bg-emerald-500 selection:text-black">
          {currentText}
        </pre>
      </div>

      {/* Bottom Hint */}
      <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>
            {secondaryMaskText && activeTab === 'secondary'
              ? 'Máscara vinculada de Ponto Adicional'
              : 'Formato homologado para abertura de O.S'}
          </span>
        </div>
        <button
          onClick={handleCopyCurrent}
          className="text-[#e4022c] font-semibold hover:underline text-[11px] cursor-pointer"
        >
          Clique para copiar
        </button>
      </div>
    </div>
  );
};
