import React from 'react';
import {
  FileText,
  Radio,
  Repeat,
  Home,
  Wrench,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  X,
  Network,
  Tv,
  ArrowRightLeft,
} from 'lucide-react';
import { TelecomAppIcon } from './TelecomAppIcon';

export type ScreenId =
  | 'os-geral'
  | 'os-mudanca-endereco'
  | 'os-ponto-adicional'
  | 'os-reparo-tv'
  | 'os-mudanca-comodo'
  | 'os-troca-equipamento'
  | 'os-reparo-externo'
  | 'rotas-plantao';

interface Props {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  activeNoticesCount: number;
  operatorName: string;
}

export const Sidebar: React.FC<Props> = ({
  currentScreen,
  onSelectScreen,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  activeNoticesCount,
  operatorName,
}) => {
  const menuItems: {
    id: ScreenId;
    label: string;
    shortLabel: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeColor?: string;
    isComingSoon?: boolean;
  }[] = [
    {
      id: 'os-geral',
      label: 'O.S - Geral',
      shortLabel: 'Geral',
      icon: FileText,
    },
    {
      id: 'os-mudanca-endereco',
      label: 'O.S - Mudança de Endereço',
      shortLabel: 'Mudança',
      icon: Home,
    },
    {
      id: 'os-ponto-adicional',
      label: 'O.S - Ponto Adicional / Cabear',
      shortLabel: 'P. Adicional',
      icon: Network,
    },
    {
      id: 'os-reparo-tv',
      label: 'O.S - Reparo de TV',
      shortLabel: 'Reparo TV',
      icon: Tv,
    },
    {
      id: 'os-mudanca-comodo',
      label: 'O.S - Mudança de Cômodo',
      shortLabel: 'M. Cômodo',
      icon: ArrowRightLeft,
    },
    {
      id: 'os-troca-equipamento',
      label: 'O.S - Troca de Equipamento',
      shortLabel: 'Troca',
      icon: Repeat,
      isComingSoon: true,
    },
    {
      id: 'os-reparo-externo',
      label: 'O.S - Reparo Externo / Fibra',
      shortLabel: 'Fibra',
      icon: Wrench,
      isComingSoon: true,
    },
    {
      id: 'rotas-plantao',
      label: 'Rotas & Plantão',
      shortLabel: 'Rotas',
      icon: Radio,
      badge: activeNoticesCount > 0 ? activeNoticesCount : undefined,
      badgeColor: 'bg-[#e4022c] text-white',
    },
  ];

  const handleItemClick = (item: (typeof menuItems)[0]) => {
    onSelectScreen(item.id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-20 h-screen bg-white border-r border-slate-200/90 shadow-sm flex flex-col transition-all duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'w-16' : 'w-64'}`}
      >
        {/* Brand Header */}
        <div
          className={`h-14 flex items-center border-b border-slate-100 shrink-0 ${
            isCollapsed ? 'justify-center px-1' : 'justify-between px-3'
          }`}
        >
          {isCollapsed ? (
            <button
              onClick={onToggleCollapse}
              title="Expandir menu lateral (Gerador O.S)"
              className="group p-1 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer relative"
            >
              <TelecomAppIcon size="md" />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-800 text-white flex items-center justify-center text-[9px] shadow-xs group-hover:bg-[#e4022c] transition-colors">
                <ChevronRight className="w-2.5 h-2.5" />
              </span>
            </button>
          ) : (
            <>
              <div className="flex items-center gap-2.5 min-w-0">
                <TelecomAppIcon size="sm" />
                <div className="min-w-0">
                  <span className="text-xs font-extrabold text-slate-900 tracking-tight block truncate">
                    Gerador O.S
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold block truncate">
                    Central Telecom
                  </span>
                </div>
              </div>

              {/* Mobile close button / Desktop collapse button */}
              <div className="flex items-center">
                <button
                  onClick={onCloseMobile}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 lg:hidden cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  onClick={onToggleCollapse}
                  title="Recolher menu"
                  className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          <div className="px-2 pb-1.5">
            {!isCollapsed && (
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Modelos de Máscara
              </span>
            )}
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-[#e4022c]/10 text-[#e4022c] shadow-2xs font-bold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#e4022c]' : 'text-slate-400 group-hover:text-slate-700'
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="truncate text-left">{item.label}</span>
                  )}
                </div>

                {!isCollapsed && (
                  <div className="flex items-center gap-1 shrink-0">
                    {item.isComingSoon && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-400 border border-slate-200 uppercase">
                        Breve
                      </span>
                    )}
                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          item.badgeColor || 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Operator Profile Card at Bottom */}
        <div className="p-2.5 border-t border-slate-100 bg-slate-50/70 shrink-0">
          {!isCollapsed ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-slate-900 block truncate">
                    {operatorName || 'Operador'}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online • Firestore Sync
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center" title={`Operador: ${operatorName}`}>
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
