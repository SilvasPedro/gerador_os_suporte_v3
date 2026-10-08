import React, { useState } from 'react';
import { X, AlertTriangle, Plus, CheckCircle, Clock, Radio, Trash2 } from 'lucide-react';
import { useRouteNotices } from '../hooks/useRouteNotices';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  operatorName: string;
}

export const RouteNoticesModal: React.FC<Props> = ({ isOpen, onClose, operatorName }) => {
  const {
    notices,
    addNotice,
    updateStatus,
    deleteNotice,
    clearAllNotices,
    restoreDefaultNotices,
    isAdding,
    isClearingAll,
  } = useRouteNotices();
  const [showAddForm, setShowAddForm] = useState(false);
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [title, setTitle] = useState('');
  const [route, setRoute] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'active' | 'investigating' | 'resolved'>('active');

  if (!isOpen) return null;

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !route.trim()) return;

    await addNotice({
      title: title.trim(),
      route: route.trim(),
      status,
      description: description.trim(),
      author: operatorName.trim() || 'Operador',
      createdAt: new Date().toISOString(),
    });

    setTitle('');
    setRoute('');
    setDescription('');
    setStatus('active');
    setShowAddForm(false);
  };

  const handleClearAllConfirm = async () => {
    await clearAllNotices();
    setConfirmClearAll(false);
  };

  const activeCount = notices.filter((n) => n.status !== 'resolved').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4">
      <div className="flex flex-col w-full max-w-xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#e4022c]/10 text-[#e4022c] flex items-center justify-center">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">Informações de Rota & Plantão</h2>
              <p className="text-[11px] text-slate-500">
                Sincronizado em tempo real ({activeCount} {activeCount === 1 ? 'alerta ativo' : 'alertas ativos'})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="px-4 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-700">Avisos da Equipe de Rede / NOC</span>
          <div className="flex items-center gap-2">
            {notices.length > 0 && (
              <>
                {confirmClearAll ? (
                  <div className="flex items-center gap-1.5 bg-red-50 p-1 rounded-lg border border-red-200">
                    <span className="text-[10px] text-red-700 font-bold px-1">Limpar todos?</span>
                    <button
                      type="button"
                      disabled={isClearingAll}
                      onClick={handleClearAllConfirm}
                      className="px-2 py-0.5 text-[10px] font-bold rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                    >
                      Sim
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmClearAll(false)}
                      className="px-2 py-0.5 text-[10px] font-medium rounded bg-white text-slate-600 border border-slate-300 hover:bg-slate-50 cursor-pointer"
                    >
                      Não
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmClearAll(true)}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors cursor-pointer"
                    title="Excluir todos os avisos permanentemente"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Limpar Todos</span>
                  </button>
                )}
              </>
            )}

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#e4022c] text-white hover:bg-[#c30022] transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddForm ? 'Cancelar' : 'Novo Alerta'}</span>
            </button>
          </div>
        </div>

        {/* Add Notice Form */}
        {showAddForm && (
          <form onSubmit={handleCreateNotice} className="p-4 bg-slate-50/80 border-b border-slate-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Título do Alerta *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Rompimento na Rota Sul"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#e4022c] focus:ring-1 focus:ring-[#e4022c]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Rota / Região Afetada *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Região Central / CTO 01-12"
                  value={route}
                  onChange={(e) => setRoute(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#e4022c] focus:ring-1 focus:ring-[#e4022c]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#e4022c]"
                >
                  <option value="active">⚠️ Ativo (Alerta Crítico)</option>
                  <option value="investigating">🔍 Em Investigação / Em Campo</option>
                  <option value="resolved">✅ Resolvido / Normalizado</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Operador / Autor</label>
                <input
                  type="text"
                  disabled
                  value={operatorName || 'Operador'}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Detalhes / Observações</label>
              <textarea
                rows={2}
                placeholder="Detalhes para os operadores (técnicos em deslocamento, prazo estimado, etc.)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#e4022c] focus:ring-1 focus:ring-[#e4022c]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isAdding}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#e4022c] text-white hover:bg-[#c30022] disabled:opacity-50"
              >
                {isAdding ? 'Publicando...' : 'Publicar Alerta'}
              </button>
            </div>
          </form>
        )}

        {/* Notices List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
          {notices.length === 0 ? (
            <div className="text-center py-8 text-slate-400 space-y-2">
              <CheckCircle className="w-8 h-8 mx-auto text-emerald-500/80 mb-2" />
              <p className="text-xs font-bold text-slate-700">Nenhum alerta de rota no momento</p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Todas as rotas e OLTs operando dentro da normalidade. Alertas excluídos não retornam sozinhos.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => restoreDefaultNotices()}
                  className="px-3 py-1.5 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Restaurar avisos padrão de exemplo
                </button>
              </div>
            </div>
          ) : (
            notices.map((n) => {
              const isResolved = n.status === 'resolved';
              const isInvestigating = n.status === 'investigating';

              return (
                <div key={n.id} className="pt-3 first:pt-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">
                        {isResolved ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        ) : isInvestigating ? (
                          <Clock className="w-4 h-4 text-amber-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-[#e4022c]" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-xs font-bold ${
                              isResolved ? 'text-slate-600 line-through' : 'text-slate-900'
                            }`}
                          >
                            {n.title}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded-sm text-[10px] font-semibold uppercase tracking-wider ${
                              isResolved
                                ? 'bg-emerald-100 text-emerald-800'
                                : isInvestigating
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-[#e4022c]'
                            }`}
                          >
                            {n.status === 'active' ? 'Ativo' : n.status === 'investigating' ? 'Investigando' : 'Resolvido'}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#e4022c] font-semibold mt-0.5">
                          Rota: {n.route}
                        </div>
                        {n.description && (
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                            {n.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1.5">
                          <span>Por: {n.author}</span>
                          <span>•</span>
                          <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() =>
                          updateStatus({
                            id: n.id,
                            status: isResolved ? 'active' : 'resolved',
                          })
                        }
                        title={isResolved ? 'Reabrir alerta' : 'Marcar como resolvido'}
                        className="px-2 py-1 text-[10px] font-semibold rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100"
                      >
                        {isResolved ? 'Reabrir' : 'Resolver'}
                      </button>
                      <button
                        onClick={() => deleteNotice(n.id)}
                        title="Excluir aviso"
                        className="p-1 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
