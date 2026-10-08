import React, { useState } from 'react';
import { X, History, Copy, Check, Trash2, Calendar, Phone, User } from 'lucide-react';
import { useWorkOrders } from '../hooks/useWorkOrders';
import { SavedWorkOrderRecord } from '../types/os';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLoadOrder: (order: SavedWorkOrderRecord) => void;
}

export const WorkOrderHistoryModal: React.FC<Props> = ({ isOpen, onClose, onLoadOrder }) => {
  const { workOrders, deleteOrder } = useWorkOrders();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyOrder = async (order: SavedWorkOrderRecord) => {
    try {
      await navigator.clipboard.writeText(order.generatedMask);
      setCopiedId(order.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4">
      <div className="flex flex-col w-full max-w-2xl max-h-[88vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#e4022c]/10 text-[#e4022c] flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">Histórico de O.S Geradas</h2>
              <p className="text-[11px] text-slate-500">Últimas ordens salvas nesta estação e na nuvem</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {workOrders.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <History className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-semibold text-slate-600">Nenhuma O.S salva no histórico ainda</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Ao gerar uma máscara, clique em &ldquo;Salvar&rdquo; para manter o registro.
              </p>
            </div>
          ) : (
            workOrders.map((order) => {
              const isCopied = copiedId === order.id;

              return (
                <div
                  key={order.id}
                  className="p-3.5 rounded-xl border border-slate-200/90 bg-white hover:border-[#e4022c]/40 hover:shadow-xs transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#e4022c]" />
                          {order.scheduleDate || 'Sem data'} - {order.period}
                        </span>
                        {order.contactPhone && (
                          <span className="text-[11px] text-slate-600 font-mono bg-slate-100 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {order.contactPhone}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          Op: {order.operatorName}
                        </span>
                        <span>•</span>
                        <span>{new Date(order.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleCopyOrder(order)}
                        title="Copiar máscara"
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 border transition-colors ${
                          isCopied
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-slate-50 hover:bg-[#e4022c] text-slate-700 hover:text-white border-slate-200'
                        }`}
                      >
                        {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{isCopied ? 'Copiado!' : 'Copiar'}</span>
                      </button>

                      <button
                        onClick={() => {
                          onLoadOrder(order);
                          onClose();
                        }}
                        title="Carregar no formulário"
                        className="px-2 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                      >
                        Carregar
                      </button>

                      <button
                        onClick={() => deleteOrder(order.id)}
                        title="Excluir do histórico"
                        className="p-1 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-lg font-sans border border-slate-100">
                    {order.motive}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
