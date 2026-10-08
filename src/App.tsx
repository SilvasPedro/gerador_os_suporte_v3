import React, { useState, useEffect, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  FileText,
  Radio,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Flame,
  CheckCircle2,
  Menu,
  Eye,
  EyeOff,
  Layers,
  ArrowRight,
  Home,
  Network,
  Tv,
  ArrowRightLeft,
} from 'lucide-react';
import {
  WorkOrderFormState,
  AddressChangeFormState,
  AdditionalPointCablingFormState,
  TvRepairFormState,
  RoomChangeFormState,
} from './types/os';
import {
  generateWorkOrderMask,
  generateAddressChangeMask,
  generateAdditionalPointMask,
  generateAdditionalPointCablingMask,
  generateTvRepairMask,
  generateRoomChangeMask,
} from './utils/maskGenerator';
import { WorkOrderForm } from './components/WorkOrderForm';
import { AddressChangeForm } from './components/AddressChangeForm';
import { AdditionalPointForm } from './components/AdditionalPointForm';
import { TvRepairForm } from './components/TvRepairForm';
import { RoomChangeForm } from './components/RoomChangeForm';
import { LiveMaskPreview } from './components/LiveMaskPreview';
import { RouteNoticesModal } from './components/RouteNoticesModal';
import { Sidebar, ScreenId } from './components/Sidebar';
import { TelecomAppIcon } from './components/TelecomAppIcon';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { useRouteNotices } from './hooks/useRouteNotices';
import { testFirestoreConnection } from './firebase/config';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
  },
});

const OPERATOR_STORAGE_KEY = 'telecom_operator_name';

const getInitialGeneralOSState = (savedOperator: string): WorkOrderFormState => {
  const today = new Date().toISOString().split('T')[0];
  return {
    scheduleDate: today,
    period: 'Horário Comercial',
    customPeriodTime: '',

    routerOwnership: 'Comodato',
    onuOwnership: 'Comodato',
    contactPhone: '',
    contactSuccess: true,
    clientSince: '',

    motive:
      'Cliente sem acesso constando LOS na ONU/ONT, feito verificações remotas, porém sem sucesso, necessário avaliação no local.',

    onuSignal: 'LOS',
    dropLogs: '',

    recentHistory: {
      hasRecent: false,
      recentType: '',
      recentDate: '',
      recentSummary: '',
    },

    exceptionAuth: {
      hasException: false,
      authorizedBy: '',
    },

    operatorName: savedOperator || 'Operador',
  };
};

const getInitialAddressChangeState = (savedOperator: string): AddressChangeFormState => {
  const today = new Date().toISOString().split('T')[0];
  return {
    scheduleDate: today,
    canAdvance: true,
    period: 'Horário Comercial',
    customPeriodTime: '',
    fee: 'Isento (Fixo)',

    hasAdditionalPoint: false,
    additionalPointQuantity: 1,

    clientSince: '',
    phone: '',
    phones: [''],
    currentAddress: '',
    newAddress: '',
    referencePoint: '',
    mapsLink: '',

    proofOfAddress: 'Anexado',
    freightAccepted: 'Aceitou',

    exceptionAuth: {
      hasException: false,
      authorizedBy: '',
    },
    operatorName: savedOperator || 'Operador',
  };
};

const getInitialAdditionalPointCablingState = (
  savedOperator: string
): AdditionalPointCablingFormState => {
  const today = new Date().toISOString().split('T')[0];
  return {
    scheduleDate: today,
    period: 'Horário Comercial',
    customPeriodTime: '',
    motive:
      'Cliente solicita instalação/ativação de Ponto Adicional para expansão de cobertura Wi-Fi/cabeada no imóvel. Realizado alinhamento prévio, necessário envio de técnico para conectorização e configuração.',

    phone: '',
    phones: [''],
    plan: '600Mb',
    clientSince: '',
    mainRouterOwnership: 'Comodato',
    onuOwnership: 'Comodato',

    didUpgrade: false,
    needsRouter: true,
    routerType: 'Comodato',
    hasCost: false,
    exemptionReason: 'Upgrade',
    directorName: '',
    customExemptionReason: '',

    hasTechnicalEvaluation: false,
    evaluationSummary: '',

    exceptionAuth: {
      hasException: false,
      authorizedBy: '',
    },
    operatorName: savedOperator || 'Operador',
  };
};

const getInitialTvRepairState = (savedOperator: string): TvRepairFormState => {
  const today = new Date().toISOString().split('T')[0];
  return {
    scheduleDate: today,
    period: 'Horário Comercial',
    customPeriodTime: '',

    contactPhone: '',
    phones: [''],
    clientSince: '',

    problemDescription:
      'Cliente relata que todos os canais estão completamente sem sinal na TV. Realizados testes básicos remotos e validação de conexões, porém sem retorno do sinal. Necessário envio de técnico ao local para aferição da recepção.',
    structure: 'Coaxial',
    device: 'Decodificador Gospell',

    hasRecent: false,
    recentDate: '',
    recentSummary: '',

    exceptionAuth: {
      hasException: false,
      authorizedBy: '',
    },
    operatorName: savedOperator || 'Operador',
  };
};

const getInitialRoomChangeState = (savedOperator: string): RoomChangeFormState => {
  const today = new Date().toISOString().split('T')[0];
  return {
    scheduleDate: today,
    canAdvance: true,
    period: 'Horário Comercial',
    customPeriodTime: '',

    contactPhone: '',
    phones: [''],
    clientSince: '',

    description:
      'Mudança de cômodo do roteador principal e ponto de fibra para a sala de estar, cliente ciente da tubulação e fiação.',
    hasCost: false,
    exemptionReason: 'Upgrade',
    directorName: '',
    customExemptionReason: '',
    clientAwareOfCost: true,

    exceptionAuth: {
      hasException: false,
      authorizedBy: '',
    },
    operatorName: savedOperator || 'Operador',
  };
};

function MainApp() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('os-geral');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // A visualização da máscara é OPCIONAL e OCULTA por padrão
  const [showMaskPreview, setShowMaskPreview] = useState(false);

  const [operatorName, setOperatorName] = useState(() => {
    return localStorage.getItem(OPERATOR_STORAGE_KEY) || 'Operador';
  });

  // Estado da Tela 1: O.S - Geral
  const [generalOSState, setGeneralOSState] = useState<WorkOrderFormState>(() =>
    getInitialGeneralOSState(operatorName)
  );

  // Estado da Tela 2: O.S - Mudança de Endereço
  const [addressChangeState, setAddressChangeState] = useState<AddressChangeFormState>(() =>
    getInitialAddressChangeState(operatorName)
  );

  // Estado da Tela 3: O.S - Ponto Adicional / Cabear Dispositivo
  const [additionalPointCablingState, setAdditionalPointCablingState] =
    useState<AdditionalPointCablingFormState>(() =>
      getInitialAdditionalPointCablingState(operatorName)
    );

  // Estado da Tela 4: O.S - Reparo de TV
  const [tvRepairState, setTvRepairState] = useState<TvRepairFormState>(() =>
    getInitialTvRepairState(operatorName)
  );

  // Estado da Tela 5: O.S - Mudança de Cômodo
  const [roomChangeState, setRoomChangeState] = useState<RoomChangeFormState>(() =>
    getInitialRoomChangeState(operatorName)
  );

  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState<string | boolean>(false);

  const { notices } = useRouteNotices();

  // Test Firestore on boot as required by skill
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  // Sync operatorName across all states when changed
  const handleOperatorChange = (newName: string) => {
    setOperatorName(newName);
    localStorage.setItem(OPERATOR_STORAGE_KEY, newName);
    setGeneralOSState((prev) => ({ ...prev, operatorName: newName }));
    setAddressChangeState((prev) => ({ ...prev, operatorName: newName }));
    setAdditionalPointCablingState((prev) => ({ ...prev, operatorName: newName }));
    setTvRepairState((prev) => ({ ...prev, operatorName: newName }));
    setRoomChangeState((prev) => ({ ...prev, operatorName: newName }));
  };

  // Change handler for General OS
  const handleGeneralOSChange = (updated: Partial<WorkOrderFormState>) => {
    if (updated.operatorName !== undefined) {
      handleOperatorChange(updated.operatorName);
    }
    setGeneralOSState((prev) => ({ ...prev, ...updated }));
  };

  // Change handler for Address Change
  const handleAddressChangeFormChange = (updated: Partial<AddressChangeFormState>) => {
    if (updated.operatorName !== undefined) {
      handleOperatorChange(updated.operatorName);
    }
    setAddressChangeState((prev) => ({ ...prev, ...updated }));
  };

  // Change handler for Additional Point / Cabling
  const handleAdditionalPointCablingChange = (
    updated: Partial<AdditionalPointCablingFormState>
  ) => {
    if (updated.operatorName !== undefined) {
      handleOperatorChange(updated.operatorName);
    }
    setAdditionalPointCablingState((prev) => ({ ...prev, ...updated }));
  };

  // Change handler for TV Repair
  const handleTvRepairChange = (updated: Partial<TvRepairFormState>) => {
    if (updated.operatorName !== undefined) {
      handleOperatorChange(updated.operatorName);
    }
    setTvRepairState((prev) => ({ ...prev, ...updated }));
  };

  // Change handler for Room Change (Mudança de Cômodo)
  const handleRoomChangeChange = (updated: Partial<RoomChangeFormState>) => {
    if (updated.operatorName !== undefined) {
      handleOperatorChange(updated.operatorName);
    }
    setRoomChangeState((prev) => ({ ...prev, ...updated }));
  };

  // Clear handlers - strictly preserving operatorName
  const handleClearGeneralOS = () => {
    const today = new Date().toISOString().split('T')[0];
    setGeneralOSState({
      scheduleDate: today,
      period: 'Horário Comercial',
      customPeriodTime: '',
      routerOwnership: 'Comodato',
      onuOwnership: 'Comodato',
      contactPhone: '',
      contactSuccess: true,
      clientSince: '',
      motive: '',
      onuSignal: '',
      dropLogs: '',
      recentHistory: {
        hasRecent: false,
        recentType: '',
        recentDate: '',
        recentSummary: '',
      },
      exceptionAuth: {
        hasException: false,
        authorizedBy: '',
      },
      operatorName: operatorName, // PRESERVES OPERATOR NAME
    });
  };

  const handleClearAddressChange = () => {
    const today = new Date().toISOString().split('T')[0];
    setAddressChangeState({
      scheduleDate: today,
      canAdvance: true,
      period: 'Horário Comercial',
      customPeriodTime: '',
      fee: 'Isento (Fixo)',
      hasAdditionalPoint: false,
      additionalPointQuantity: 1,
      clientSince: '',
      phone: '',
      phones: [''],
      currentAddress: '',
      newAddress: '',
      referencePoint: '',
      mapsLink: '',
      proofOfAddress: 'Anexado',
      freightAccepted: 'Aceitou',
      exceptionAuth: {
        hasException: false,
        authorizedBy: '',
      },
      operatorName: operatorName, // PRESERVES OPERATOR NAME
    });
  };

  const handleClearAdditionalPointCabling = () => {
    const today = new Date().toISOString().split('T')[0];
    setAdditionalPointCablingState({
      scheduleDate: today,
      period: 'Horário Comercial',
      customPeriodTime: '',
      motive: '',
      phone: '',
      phones: [''],
      plan: '600Mb',
      clientSince: '',
      mainRouterOwnership: 'Comodato',
      onuOwnership: 'Comodato',
      didUpgrade: false,
      needsRouter: true,
      routerType: 'Comodato',
      hasCost: false,
      exemptionReason: 'Upgrade',
      directorName: '',
      customExemptionReason: '',
      hasTechnicalEvaluation: false,
      evaluationSummary: '',
      exceptionAuth: {
        hasException: false,
        authorizedBy: '',
      },
      operatorName: operatorName, // PRESERVES OPERATOR NAME
    });
  };

  const handleClearTvRepair = () => {
    const today = new Date().toISOString().split('T')[0];
    setTvRepairState({
      scheduleDate: today,
      period: 'Horário Comercial',
      customPeriodTime: '',
      contactPhone: '',
      phones: [''],
      clientSince: '',
      problemDescription: '',
      structure: 'Coaxial',
      device: 'Decodificador Gospell',
      hasRecent: false,
      recentDate: '',
      recentSummary: '',
      exceptionAuth: {
        hasException: false,
        authorizedBy: '',
      },
      operatorName: operatorName, // PRESERVES OPERATOR NAME
    });
  };

  const handleClearRoomChange = () => {
    const today = new Date().toISOString().split('T')[0];
    setRoomChangeState({
      scheduleDate: today,
      canAdvance: true,
      period: 'Horário Comercial',
      customPeriodTime: '',
      contactPhone: '',
      phones: [''],
      clientSince: '',
      description: '',
      hasCost: false,
      exemptionReason: 'Upgrade',
      directorName: '',
      customExemptionReason: '',
      clientAwareOfCost: true,
      exceptionAuth: {
        hasException: false,
        authorizedBy: '',
      },
      operatorName: operatorName, // PRESERVES OPERATOR NAME
    });
  };

  // Example fillers
  const handleFillExampleGeneralOS = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setGeneralOSState({
      scheduleDate: tomorrow.toISOString().split('T')[0],
      period: 'Manhã',
      customPeriodTime: '',
      routerOwnership: 'Comodato',
      onuOwnership: 'Comodato',
      contactPhone: '(11) 98765-4321',
      contactSuccess: true,
      clientSince: '12/05/2022',
      motive:
        'Cliente informando lentidão geral na conexão, realizado configurações/atualizações no roteador/ONT remotamente, mas sem sucesso, cliente ainda informa dificuldade, necessário avaliação no local.',
      onuSignal: 'LOS',
      dropLogs: 'Flapping detectado na porta PON 03 / VLAN 200 nas últimas 24h.',
      recentHistory: {
        hasRecent: true,
        recentType: 'Lentidão',
        recentDate: '2026-09-15',
        recentSummary: 'Realizado alinhamento de Wi-Fi e troca de cabo de rede.',
      },
      exceptionAuth: {
        hasException: false,
        authorizedBy: '',
      },
      operatorName: operatorName,
    });
  };

  const handleFillExampleAddressChange = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 3);
    setAddressChangeState({
      scheduleDate: nextWeek.toISOString().split('T')[0],
      canAdvance: true,
      period: 'Horário Comercial',
      customPeriodTime: '',
      fee: 'Isento (Fixo)',
      hasAdditionalPoint: true,
      additionalPointQuantity: 1,
      clientSince: '18/02/2021',
      phone: '(11) 97654-3210',
      phones: ['(11) 97654-3210', '(11) 98111-2233'],
      currentAddress: 'Av. Paulista, 1000, Apto 42 - Bela Vista, São Paulo/SP',
      newAddress: 'Rua das Palmeiras, 350, Casa 2 - Jardim Paulista, São Paulo/SP',
      referencePoint: 'Próximo ao Colégio São José, portão branco',
      mapsLink: 'https://maps.google.com/?q=-23.561684,-46.655981',
      proofOfAddress: 'Anexado',
      freightAccepted: 'Aceitou',
      exceptionAuth: {
        hasException: false,
        authorizedBy: '',
      },
      operatorName: operatorName,
    });
  };

  const handleFillExampleAdditionalPointCabling = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    setAdditionalPointCablingState({
      scheduleDate: tomorrow.toISOString().split('T')[0],
      period: 'Tarde',
      customPeriodTime: '',
      motive:
        'Cliente solicita instalação de Ponto Adicional no segundo andar e cabeamento de rede para Smart TV e console na sala de jogos.',
      phone: '(11) 99887-6655',
      phones: ['(11) 99887-6655', '(11) 98777-1122'],
      plan: '800Mb',
      clientSince: '05/03/2022',
      mainRouterOwnership: 'Comodato',
      onuOwnership: 'Comodato',
      didUpgrade: true,
      needsRouter: true,
      routerType: 'Comodato',
      hasCost: false,
      exemptionReason: 'Upgrade',
      directorName: '',
      customExemptionReason: '',
      hasTechnicalEvaluation: true,
      evaluationSummary: 'Avaliado que há tubulação livre com guia para passagem de cabo UTP cat6.',
      exceptionAuth: {
        hasException: false,
        authorizedBy: '',
      },
      operatorName: operatorName,
    });
  };

  const handleFillExampleTvRepair = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setTvRepairState({
      scheduleDate: tomorrow.toISOString().split('T')[0],
      period: 'Tarde',
      customPeriodTime: '',
      contactPhone: '(11) 98765-4321',
      phones: ['(11) 98765-4321', '(11) 91234-5678'],
      clientSince: '14/07/2021',
      problemDescription:
        'Cliente relata canais falhando, travando ou digitalizando (pixelando imagem) de forma intermitente. Cabos e conexões verificados remotamente. Necessário aferição de níveis de sinal no local.',
      structure: 'Mininode',
      device: 'Decodificador Gospell',
      hasRecent: true,
      recentDate: '2026-09-10',
      recentSummary: 'Troca de conector F de compressão e ajuste de atenuação na régua.',
      exceptionAuth: {
        hasException: false,
        authorizedBy: '',
      },
      operatorName: operatorName,
    });
  };

  const handleFillExampleRoomChange = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setRoomChangeState({
      scheduleDate: tomorrow.toISOString().split('T')[0],
      canAdvance: true,
      period: 'Manhã',
      customPeriodTime: '',
      contactPhone: '(11) 98765-4321',
      phones: ['(11) 98765-4321', '(11) 97711-2233'],
      clientSince: '15/04/2022',
      description:
        'Mudança de cômodo do roteador principal e ponto óptico da sala para o quarto/escritório para atendimento de Home Office. Tubulação livre e desobstruída.',
      hasCost: false,
      exemptionReason: 'Upgrade',
      directorName: '',
      customExemptionReason: '',
      clientAwareOfCost: true,
      exceptionAuth: {
        hasException: false,
        authorizedBy: '',
      },
      operatorName: operatorName,
    });
  };

  // Compute active mask depending on current screen
  const activeGeneratedMask = useMemo(() => {
    if (currentScreen === 'os-mudanca-endereco') {
      return generateAddressChangeMask(addressChangeState);
    }
    if (currentScreen === 'os-ponto-adicional') {
      return generateAdditionalPointCablingMask(additionalPointCablingState);
    }
    if (currentScreen === 'os-reparo-tv') {
      return generateTvRepairMask(tvRepairState);
    }
    if (currentScreen === 'os-mudanca-comodo') {
      return generateRoomChangeMask(roomChangeState);
    }
    return generateWorkOrderMask(generalOSState);
  }, [
    currentScreen,
    generalOSState,
    addressChangeState,
    additionalPointCablingState,
    tvRepairState,
    roomChangeState,
  ]);

  // Compute second mask for Additional Point if on Address Change screen
  const additionalPointMask = useMemo(() => {
    if (currentScreen === 'os-mudanca-endereco' && addressChangeState.hasAdditionalPoint) {
      return generateAdditionalPointMask(addressChangeState);
    }
    return null;
  }, [currentScreen, addressChangeState]);

  const handleCopyQuick = async () => {
    try {
      await navigator.clipboard.writeText(activeGeneratedMask);
      setCopiedNotification('Máscara copiada! Pronta para colar no chamado.');
      setTimeout(() => setCopiedNotification(false), 2200);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = activeGeneratedMask;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedNotification('Máscara copiada! Pronta para colar no chamado.');
      setTimeout(() => setCopiedNotification(false), 2200);
    }
  };

  const handleCopyAdditionalPointQuick = async () => {
    if (!additionalPointMask) return;
    try {
      await navigator.clipboard.writeText(additionalPointMask);
      setCopiedNotification('O.S de Ponto Adicional copiada com sucesso!');
      setTimeout(() => setCopiedNotification(false), 2200);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = additionalPointMask;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedNotification('O.S de Ponto Adicional copiada com sucesso!');
      setTimeout(() => setCopiedNotification(false), 2200);
    }
  };

  const activeNoticesCount = notices.filter((n) => n.status !== 'resolved').length;

  const handleSelectScreen = (screen: ScreenId) => {
    if (screen === 'rotas-plantao') {
      setIsRouteModalOpen(true);
    } else {
      setCurrentScreen(screen);
    }
  };

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'os-geral':
        return 'Ordem de Serviço — Suporte Técnico Geral';
      case 'os-mudanca-endereco':
        return 'Ordem de Serviço — Mudança de Endereço';
      case 'os-ponto-adicional':
        return 'Ordem de Serviço — Ponto Adicional / Cabear Dispositivo';
      case 'os-reparo-tv':
        return 'Ordem de Serviço — Reparo de TV';
      case 'os-mudanca-comodo':
        return 'Ordem de Serviço — Mudança de Cômodo';
      case 'os-troca-equipamento':
        return 'Ordem de Serviço — Troca de Equipamento';
      default:
        return 'Ordem de Serviço';
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7f9] text-slate-800 flex font-sans selection:bg-[#e4022c] selection:text-white">
      {/* Left Sidebar Menu */}
      <Sidebar
        currentScreen={currentScreen}
        onSelectScreen={handleSelectScreen}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        activeNoticesCount={activeNoticesCount}
        operatorName={operatorName}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-20 lg:pb-8">
        {/* Top Header / Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
            {/* Left: Mobile Menu Toggle & Title */}
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden cursor-pointer shrink-0"
                title="Abrir menu lateral"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 min-w-0">
                <TelecomAppIcon size="sm" className="lg:hidden" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight truncate">
                      Gerador de O.S
                    </h1>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-sm bg-[#e4022c]/10 text-[#e4022c] uppercase">
                      Telecom
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 hidden sm:block truncate">
                    {getScreenTitle()}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Quick Actions & Preview Toggle */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Toggle de Visualização da Máscara (Opcional e Oculto por padrão) */}
              <button
                onClick={() => setShowMaskPreview(!showMaskPreview)}
                title={
                  showMaskPreview
                    ? 'Ocultar pré-visualização da máscara'
                    : 'Visualizar máscara formatada'
                }
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  showMaskPreview
                    ? 'bg-slate-800 text-white border-slate-800 shadow-2xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                }`}
              >
                {showMaskPreview ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-red-400" />
                    <span className="hidden sm:inline">Ocultar Máscara</span>
                    <span className="sm:hidden">Ocultar</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-[#e4022c]" />
                    <span className="hidden sm:inline">Visualizar Máscara</span>
                    <span className="sm:hidden">Ver</span>
                  </>
                )}
              </button>

              {/* Botão Copiar Máscara Direto (Sempre disponível no Header) */}
              <button
                onClick={handleCopyQuick}
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs transition-all cursor-pointer ${
                  copiedNotification
                    ? 'bg-emerald-600 shadow-emerald-500/20'
                    : 'bg-[#e4022c] hover:bg-[#c30022] shadow-red-500/20'
                }`}
              >
                {copiedNotification ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>
                      {additionalPointMask ? 'Copiar 1ª O.S (Principal)' : 'Copiar Máscara'}
                    </span>
                  </>
                )}
              </button>

              {/* Botão para copiar 2ª O.S se houver Ponto Adicional */}
              {additionalPointMask && (
                <button
                  onClick={handleCopyAdditionalPointQuick}
                  className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-all cursor-pointer"
                  title="Copiar máscara da 2ª O.S do Ponto Adicional"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Copiar 2ª O.S (P. Adicional)</span>
                </button>
              )}

              {/* Live Route notices badge */}
              <button
                onClick={() => setIsRouteModalOpen(true)}
                title="Alertas de rotas em tempo real"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  activeNoticesCount > 0
                    ? 'bg-red-50 text-[#e4022c] border-red-200 hover:bg-red-100'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Radio
                  className={`w-3.5 h-3.5 ${
                    activeNoticesCount > 0 ? 'animate-pulse text-[#e4022c]' : 'text-slate-400'
                  }`}
                />
                <span className="hidden xl:inline">Rotas</span>
                {activeNoticesCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#e4022c] text-white text-[10px] font-bold flex items-center justify-center">
                    {activeNoticesCount}
                  </span>
                )}
              </button>

              {/* In-app PWA install button */}
              <PWAInstallButton />
            </div>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="max-w-7xl mx-auto w-full px-2.5 sm:px-4 py-3 sm:py-4 flex-1">
          {/* Banner for Active Route Notices if any exist */}
          {activeNoticesCount > 0 && (
            <div
              onClick={() => setIsRouteModalOpen(true)}
              className="mb-3.5 p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-red-50 via-white to-red-50 border border-red-200/90 shadow-2xs flex items-center justify-between cursor-pointer hover:border-[#e4022c] transition-all"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="p-1 rounded-md bg-[#e4022c] text-white shrink-0">
                  <Flame className="w-3.5 h-3.5 animate-pulse" />
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    Alerta de Rota Ativo: {notices[0]?.title}
                  </div>
                  <div className="text-[11px] text-slate-600 truncate">
                    {notices[0]?.route} — {notices[0]?.description}
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#e4022c] underline ml-2 shrink-0">
                Ver {activeNoticesCount} avisos →
              </span>
            </div>
          )}

          {/* ACTIVE SCREEN RENDER */}
          {currentScreen === 'os-geral' ? (
            /* TELA 1: O.S - GERAL */
            <div
              className={`transition-all ${
                showMaskPreview
                  ? 'grid grid-cols-1 lg:grid-cols-12 gap-4 items-start'
                  : 'max-w-4xl mx-auto'
              }`}
            >
              <div className={`${showMaskPreview ? 'lg:col-span-7 xl:col-span-7' : 'w-full'} space-y-3.5`}>
                <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Tela Ativa:
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      Ordem de Serviço — Suporte Técnico Geral
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!showMaskPreview && (
                      <button
                        onClick={() => setShowMaskPreview(true)}
                        className="text-[11px] font-semibold text-[#e4022c] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Exibir Prévia</span>
                      </button>
                    )}
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      100% Responsivo
                    </span>
                  </div>
                </div>

                <WorkOrderForm
                  formState={generalOSState}
                  onChange={handleGeneralOSChange}
                  onClear={handleClearGeneralOS}
                  onFillExample={handleFillExampleGeneralOS}
                />
              </div>

              {/* Optional Preview Column */}
              {showMaskPreview && (
                <div className="lg:col-span-5 xl:col-span-5 sticky top-16 animate-in fade-in slide-in-from-right-4">
                  <div className="h-[calc(100vh-6rem)] min-h-[480px] flex flex-col">
                    <div className="flex items-center justify-between pb-1.5 px-1">
                      <span className="text-xs font-bold text-slate-700">Prévia ao Vivo</span>
                      <button
                        onClick={() => setShowMaskPreview(false)}
                        className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        ✕ Ocultar
                      </button>
                    </div>
                    <LiveMaskPreview
                      maskText={activeGeneratedMask}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : currentScreen === 'os-mudanca-endereco' ? (
            /* TELA 2: O.S - MUDANÇA DE ENDEREÇO */
            <div
              className={`transition-all ${
                showMaskPreview
                  ? 'grid grid-cols-1 lg:grid-cols-12 gap-4 items-start'
                  : 'max-w-4xl mx-auto'
              }`}
            >
              <div className={`${showMaskPreview ? 'lg:col-span-7 xl:col-span-7' : 'w-full'} space-y-3.5`}>
                <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Tela Ativa:
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      Ordem de Serviço — Mudança de Endereço
                    </span>
                    {addressChangeState.hasAdditionalPoint && (
                      <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                        + Ponto Adicional
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {!showMaskPreview && (
                      <button
                        onClick={() => setShowMaskPreview(true)}
                        className="text-[11px] font-semibold text-[#e4022c] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Exibir Prévia</span>
                      </button>
                    )}
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      100% Responsivo
                    </span>
                  </div>
                </div>

                <AddressChangeForm
                  formState={addressChangeState}
                  onChange={handleAddressChangeFormChange}
                  onClear={handleClearAddressChange}
                  onFillExample={handleFillExampleAddressChange}
                />
              </div>

              {/* Optional Preview Column (Supports tabs for Ponto Adicional) */}
              {showMaskPreview && (
                <div className="lg:col-span-5 xl:col-span-5 sticky top-16 animate-in fade-in slide-in-from-right-4">
                  <div className="h-[calc(100vh-6rem)] min-h-[480px] flex flex-col">
                    <div className="flex items-center justify-between pb-1.5 px-1">
                      <span className="text-xs font-bold text-slate-700">Prévia ao Vivo</span>
                      <button
                        onClick={() => setShowMaskPreview(false)}
                        className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        ✕ Ocultar
                      </button>
                    </div>
                    <LiveMaskPreview
                      maskText={activeGeneratedMask}
                      secondaryMaskText={additionalPointMask || undefined}
                      secondaryMaskTitle="O.S Ponto Adicional"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : currentScreen === 'os-ponto-adicional' ? (
            /* TELA 3: O.S - PONTO ADICIONAL / CABEAR DISPOSITIVO */
            <div
              className={`transition-all ${
                showMaskPreview
                  ? 'grid grid-cols-1 lg:grid-cols-12 gap-4 items-start'
                  : 'max-w-4xl mx-auto'
              }`}
            >
              <div className={`${showMaskPreview ? 'lg:col-span-7 xl:col-span-7' : 'w-full'} space-y-3.5`}>
                <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Tela Ativa:
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      Ordem de Serviço — Ponto Adicional / Cabear Dispositivo
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!showMaskPreview && (
                      <button
                        onClick={() => setShowMaskPreview(true)}
                        className="text-[11px] font-semibold text-[#e4022c] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Exibir Prévia</span>
                      </button>
                    )}
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      100% Responsivo
                    </span>
                  </div>
                </div>

                <AdditionalPointForm
                  formState={additionalPointCablingState}
                  onChange={handleAdditionalPointCablingChange}
                  onClear={handleClearAdditionalPointCabling}
                  onFillExample={handleFillExampleAdditionalPointCabling}
                />
              </div>

              {/* Optional Preview Column */}
              {showMaskPreview && (
                <div className="lg:col-span-5 xl:col-span-5 sticky top-16 animate-in fade-in slide-in-from-right-4">
                  <div className="h-[calc(100vh-6rem)] min-h-[480px] flex flex-col">
                    <div className="flex items-center justify-between pb-1.5 px-1">
                      <span className="text-xs font-bold text-slate-700">Prévia ao Vivo</span>
                      <button
                        onClick={() => setShowMaskPreview(false)}
                        className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        ✕ Ocultar
                      </button>
                    </div>
                    <LiveMaskPreview
                      maskText={activeGeneratedMask}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : currentScreen === 'os-reparo-tv' ? (
            /* TELA 4: O.S - REPARO DE TV */
            <div
              className={`transition-all ${
                showMaskPreview
                  ? 'grid grid-cols-1 lg:grid-cols-12 gap-4 items-start'
                  : 'max-w-4xl mx-auto'
              }`}
            >
              <div className={`${showMaskPreview ? 'lg:col-span-7 xl:col-span-7' : 'w-full'} space-y-3.5`}>
                <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Tela Ativa:
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      Ordem de Serviço — Reparo de TV
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!showMaskPreview && (
                      <button
                        onClick={() => setShowMaskPreview(true)}
                        className="text-[11px] font-semibold text-[#e4022c] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Exibir Prévia</span>
                      </button>
                    )}
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      100% Responsivo
                    </span>
                  </div>
                </div>

                <TvRepairForm
                  formState={tvRepairState}
                  onChange={handleTvRepairChange}
                  onClear={handleClearTvRepair}
                  onFillExample={handleFillExampleTvRepair}
                />
              </div>

              {/* Optional Preview Column */}
              {showMaskPreview && (
                <div className="lg:col-span-5 xl:col-span-5 sticky top-16 animate-in fade-in slide-in-from-right-4">
                  <div className="h-[calc(100vh-6rem)] min-h-[480px] flex flex-col">
                    <div className="flex items-center justify-between pb-1.5 px-1">
                      <span className="text-xs font-bold text-slate-700">Prévia ao Vivo</span>
                      <button
                        onClick={() => setShowMaskPreview(false)}
                        className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        ✕ Ocultar
                      </button>
                    </div>
                    <LiveMaskPreview
                      maskText={activeGeneratedMask}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : currentScreen === 'os-mudanca-comodo' ? (
            /* TELA 5: O.S - MUDANÇA DE CÔMODO */
            <div
              className={`transition-all ${
                showMaskPreview
                  ? 'grid grid-cols-1 lg:grid-cols-12 gap-4 items-start'
                  : 'max-w-4xl mx-auto'
              }`}
            >
              <div className={`${showMaskPreview ? 'lg:col-span-7 xl:col-span-7' : 'w-full'} space-y-3.5`}>
                <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Tela Ativa:
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      Ordem de Serviço — Mudança de Cômodo
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!showMaskPreview && (
                      <button
                        onClick={() => setShowMaskPreview(true)}
                        className="text-[11px] font-semibold text-[#e4022c] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Exibir Prévia</span>
                      </button>
                    )}
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      100% Responsivo
                    </span>
                  </div>
                </div>

                <RoomChangeForm
                  data={roomChangeState}
                  onChange={handleRoomChangeChange}
                  onClear={handleClearRoomChange}
                  onFillExample={handleFillExampleRoomChange}
                  onOperatorChange={handleOperatorChange}
                />
              </div>

              {/* Optional Preview Column */}
              {showMaskPreview && (
                <div className="lg:col-span-5 xl:col-span-5 sticky top-16 animate-in fade-in slide-in-from-right-4">
                  <div className="h-[calc(100vh-6rem)] min-h-[480px] flex flex-col">
                    <div className="flex items-center justify-between pb-1.5 px-1">
                      <span className="text-xs font-bold text-slate-700">Prévia ao Vivo</span>
                      <button
                        onClick={() => setShowMaskPreview(false)}
                        className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        ✕ Ocultar
                      </button>
                    </div>
                    <LiveMaskPreview
                      maskText={activeGeneratedMask}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* PLACEHOLDER PARA PRÓXIMAS TELAS */
            <div className="max-w-2xl mx-auto py-12 px-4 text-center bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-[#e4022c]/10 text-[#e4022c] flex items-center justify-center mx-auto mb-3">
                <Layers className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-slate-900 mb-1">
                {currentScreen === 'os-troca-equipamento'
                  ? 'O.S - Troca de Equipamento / Upgrade'
                  : 'O.S - Reparo Externo / Fibra'}
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed mb-6">
                Estamos criando tela por tela para garantir total precisão e evitar conflitos. A base comum já está estruturada e a próxima tela poderá ser configurada a qualquer momento.
              </p>
              <div className="flex items-center justify-center gap-2.5 flex-wrap">
                <button
                  onClick={() => setCurrentScreen('os-geral')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>O.S - Geral</span>
                </button>
                <button
                  onClick={() => setCurrentScreen('os-mudanca-endereco')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>Mudança de Endereço</span>
                </button>
                <button
                  onClick={() => setCurrentScreen('os-ponto-adicional')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>Ponto Adicional</span>
                </button>
                <button
                  onClick={() => setCurrentScreen('os-reparo-tv')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>Reparo de TV</span>
                </button>
                <button
                  onClick={() => setCurrentScreen('os-mudanca-comodo')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#e4022c] hover:bg-[#c30022] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <span>Mudança de Cômodo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Floating / Sticky Bottom Action Bar (Ultra-optimized for split-screen / narrow sidebar mode) */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 shadow-lg lg:hidden">
          <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
            <button
              onClick={
                currentScreen === 'os-mudanca-endereco'
                  ? handleClearAddressChange
                  : currentScreen === 'os-ponto-adicional'
                  ? handleClearAdditionalPointCabling
                  : currentScreen === 'os-reparo-tv'
                  ? handleClearTvRepair
                  : currentScreen === 'os-mudanca-comodo'
                  ? handleClearRoomChange
                  : handleClearGeneralOS
              }
              title="Limpar campos mantendo operador"
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleCopyQuick}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-extrabold text-white shadow-md transition-all cursor-pointer ${
                copiedNotification
                  ? 'bg-emerald-600 shadow-emerald-500/25'
                  : 'bg-[#e4022c] hover:bg-[#c30022] shadow-red-500/25'
              }`}
            >
              {copiedNotification ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>
                    {additionalPointMask ? 'Copiar 1ª O.S' : 'Copiar Máscara'}
                  </span>
                </>
              )}
            </button>

            {additionalPointMask && (
              <button
                onClick={handleCopyAdditionalPointQuick}
                className="p-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shrink-0 cursor-pointer shadow-xs flex items-center gap-1"
                title="Copiar 2ª O.S de Ponto Adicional"
              >
                <Layers className="w-4 h-4" />
                <span className="text-[10px]">2ª O.S</span>
              </button>
            )}

            <button
              onClick={() => setShowMaskPreview(!showMaskPreview)}
              title={showMaskPreview ? 'Ocultar prévia' : 'Ver prévia'}
              className={`p-2 rounded-lg text-xs font-semibold shrink-0 cursor-pointer border ${
                showMaskPreview
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              {showMaskPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Toast Notification when copied */}
        {copiedNotification && (
          <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{typeof copiedNotification === 'string' ? copiedNotification : 'Máscara copiada! Pronta para colar no chamado.'}</span>
          </div>
        )}

        {/* Modals */}
        <RouteNoticesModal
          isOpen={isRouteModalOpen}
          onClose={() => setIsRouteModalOpen(false)}
          operatorName={operatorName}
        />

        {/* Offline Indicator */}
        <OfflineIndicator />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainApp />
    </QueryClientProvider>
  );
}
