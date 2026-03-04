'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import {
  Search, Menu, X, Code2, ChevronRight, Moon, Sun, LayoutDashboard, Settings,
  Info, ExternalLink, Check, Copy, RotateCcw, Heart, Mail, MessageSquarePlus,
  Grid, ShieldAlert, RefreshCw, Bell, Sparkles, Compass, MousePointer2, Plus,
  ArrowRight, LayoutGrid, List, Wand2, ShieldCheck, Smartphone, Monitor, Maximize, ChevronRight as ChevronRightIcon
} from 'lucide-react';

import { LazyMotion, domAnimation, motion, AnimatePresence } from 'motion/react';
import { TOOLS } from '@/constants/tools';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/Icon';

const ToolRenderer = dynamic(() => import('@/components/ToolRenderer').then(mod => mod.ToolRenderer), { loading: () => <div className="p-12 text-center text-text-main/80">Carregando otimizações...</div> });
const DonationModal = dynamic(() => import('@/components/DonationModal').then(mod => mod.DonationModal));
const UpdateNotification = dynamic(() => import('@/components/UpdateNotification').then(mod => mod.UpdateNotification));
const Tour = dynamic(() => import('@/components/Tour').then(mod => mod.Tour));

const getCategoryIcon = (category: string): string => {
  switch (category) {
    case 'Desenvolvimento':
    case 'Dev': return 'Code2';
    case 'Design': return 'Palette';
    case 'Produtividade': return 'Timer';
    case 'Ciência': return 'Atom';
    case 'Segurança': return 'Lock';
    case 'Jogos':
    case 'Diversos': return 'Gamepad2';
    case 'Negócios': return 'Briefcase';
    case 'Multimídia': return 'Video';
    case 'Utilitários': return 'Wrench';
    case 'Educação': return 'BookOpen';
    default: return 'Box';
  }
};

const ToolCard = React.memo(({ tool, isMobile, onClick }: { tool: any, isMobile: boolean, onClick: () => void }) => (
  <motion.button
    whileHover={{ y: -4, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="group bg-card-main p-5 lg:p-6 rounded-[24px] lg:rounded-[32px] border border-border-main shadow-sm hover:shadow-xl transition-all duration-200 text-left flex flex-col h-full"
  >
    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-text-main/5 rounded-xl sm:rounded-2xl flex items-center justify-center text-text-main mb-3 sm:mb-4 group-hover:bg-text-main group-hover:text-bg-main transition-colors">
      <Icon name={tool.icon} className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-1 sm:mb-2">
        <span className="text-[8px] lg:text-[10px] font-bold uppercase tracking-widest opacity-90 truncate">{tool.category}</span>
        {!isMobile && <span className="text-[9px] lg:text-[10px] font-mono opacity-90">#{tool.id}</span>}
      </div>
      <h3 className="font-bold text-xs sm:text-base lg:text-lg mb-1 sm:mb-2 line-clamp-1 sm:line-clamp-2">{tool.name}</h3>
      <p className="hidden sm:block text-xs lg:text-sm opacity-90 leading-relaxed line-clamp-2">
        {tool.description}
      </p>
    </div>
    <div className="mt-2 sm:mt-4 lg:mt-6 flex items-center font-bold text-[10px] sm:text-xs lg:text-sm opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
      <span>Abrir</span> <ChevronRight size={12} className="ml-1" />
    </div>
  </motion.button>
));
ToolCard.displayName = 'ToolCard';

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isMobile, setIsMobile] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);
  const [toolSuggestion, setToolSuggestion] = useState('');
  const [isSendingSuggestion, setIsSendingSuggestion] = useState(false);
  const [suggestionStatus, setSuggestionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [currentUrl, setCurrentUrl] = useState('');
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);
  const [lastInsertedTool, setLastInsertedTool] = useState<any>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const pixKey = "5904eb47-9c13-4ee1-b018-6acb40d8a154";

  const copyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2000);
  };

  const sendSuggestion = async () => {
    if (!toolSuggestion.trim() || isSendingSuggestion) return;

    setIsSendingSuggestion(true);
    setSuggestionStatus('idle');

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ suggestion: toolSuggestion }),
      });

      if (response.ok) {
        setSuggestionStatus('success');
        setToolSuggestion('');
        setTimeout(() => setSuggestionStatus('idle'), 5000);
      } else {
        setSuggestionStatus('error');
      }
    } catch (error) {
      console.error('Erro ao enviar:', error);
      setSuggestionStatus('error');
    } finally {
      setIsSendingSuggestion(false);
    }
  };

  const [activePixTab, setActivePixTab] = useState<'qrcode' | 'banks'>('banks');
  const [selectedBank, setSelectedBank] = useState<any>(null);

  const BANKS = [
    { name: 'Nubank', scheme: 'nubank://pix-pay/v1/qr-code?payload=', color: 'bg-purple-600' },
    { name: 'Inter', scheme: 'inter://pix-pay?payload=', color: 'bg-orange-500' },
    { name: 'Itaú', scheme: 'itau://pix-pay?payload=', color: 'bg-orange-600' },
    { name: 'BB', scheme: 'bancodobrasil://pix-pay?payload=', color: 'bg-yellow-400' },
    { name: 'PicPay', scheme: 'picpay://pix-pay?payload=', color: 'bg-green-500' },
    { name: 'C6 Bank', scheme: 'c6bank://pix-pay?payload=', color: 'bg-black' }
  ];

  const openBankApp = (bank: any) => {
    const fullScheme = bank.scheme + pixPayload;
    navigator.clipboard.writeText(pixPayload);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 3000);

    if (isMobile) {
      window.location.href = fullScheme;
    } else {
      // No desktop, ao selecionar, mostramos o QR Code com o logo do banco para confiança
      setSelectedBank(bank);
    }
  };

  const pixPayload = useMemo(() => {
    // Helper para gerar campos no formato ID + Tamanho + Valor (Padrão EMV)
    const formatField = (id: string, value: string) => {
      const len = value.length.toString().padStart(2, '0');
      return `${id}${len}${value}`;
    };

    const payloadFormat = formatField("00", "01");
    const pointOfInitiation = formatField("01", "11"); // 11 = Estático (permite editar valor)

    // Merchant Account Information (Tag 26)
    const gui = formatField("00", "br.gov.bcb.pix");
    const key = formatField("01", pixKey);
    const merchantAccount = formatField("26", `${gui}${key}`);

    const mcc = formatField("52", "0000"); // Merchant Category Code
    const currency = formatField("53", "986"); // BRL
    const country = formatField("58", "BR");
    const merchantName = formatField("59", "CANIVETE");
    const merchantCity = formatField("60", "SAO PAULO");
    const additionalData = formatField("62", formatField("05", "***"));

    const crcPlaceholder = "6304";

    const payload = `${payloadFormat}${pointOfInitiation}${merchantAccount}${mcc}${currency}${country}${merchantName}${merchantCity}${additionalData}${crcPlaceholder}`;

    // Cálculo preciso do CRC16-CCITT
    let crc = 0xFFFF;
    for (let i = 0; i < payload.length; i++) {
      crc ^= payload.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
      }
    }
    const finalCrc = (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');

    return `${payload}${finalCrc}`;
  }, [pixKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDonationModalOpen(true);
    }, 15000); // Atrasado para não conflitar com a notificação de nova ferramenta

    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);

      // Lógica de Notificação de Nova Ferramenta
      const lastTool = TOOLS[TOOLS.length - 1];
      const acknowledgedToolId = localStorage.getItem('last_seen_tool');

      if (lastTool && lastTool.id !== acknowledgedToolId) {
        setLastInsertedTool(lastTool);
        setHasUnreadNotifications(true);
        // Pequeno atraso para o usuário notar a entrada
        setTimeout(() => setShowUpdateNotification(true), 2000);
      }
      // Lógica de Tour Guiado
      const tourCompleted = localStorage.getItem('has_completed_tour');
      if (!tourCompleted) {
        setTimeout(() => setIsTourOpen(true), 3000);
      }
    }

    return () => clearTimeout(timer);
  }, []);

  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const copyShareLink = () => {
    const url = window.location.href;
    const title = `Canivete Suíço - ${selectedTool?.name}`;
    const text = `${title}\n${selectedTool?.description}\n${url}`;

    navigator.clipboard.writeText(text);
    setShareStatus('copied');
    setTimeout(() => setShareStatus('idle'), 2000);
  };

  const categories = useMemo(() => {
    const cats = new Set(TOOLS.map(t => t.category));
    return Array.from(cats);
  }, []);

  const filteredTools = useMemo(() => {
    return TOOLS.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const selectedTool = useMemo(() =>
    TOOLS.find(t => t.id === selectedToolId),
    [selectedToolId]);

  const handleNextTourStep = useCallback(() => {
    setTourStep(prev => prev + 1);
  }, []);

  const handleCloseTour = useCallback(() => {
    localStorage.setItem('has_completed_tour', 'true');
    setIsTourOpen(false);
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <div className={cn(
        "flex h-screen bg-bg-main text-text-main font-sans overflow-hidden transition-colors duration-300",
        !isSidebarOpen && "sidebar-closed"
      )}>
        <AnimatePresence>
          {isMobile && isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
          )}
        </AnimatePresence>

        {isMobile && !selectedToolId && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] w-[90%] max-w-sm"
          >
            <div className="bg-card-main/80 backdrop-blur-2xl border border-white/10 rounded-[32px] p-2 shadow-2xl flex items-center justify-around gap-1">
              <button
                onClick={() => { setSelectedCategory(null); setSelectedToolId(null); }}
                aria-label="Ir para o Início"
                className={cn(
                  "flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-300 flex-1",
                  !selectedCategory ? "bg-text-main text-bg-main shadow-lg scale-105" : "text-text-main/80"
                )}
              >
                <LayoutDashboard size={20} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Início</span>
              </button>
              <button
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Abrir Categorias"
                className={cn(
                  "flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-300 flex-1",
                  isSidebarOpen ? "bg-text-main text-bg-main shadow-lg scale-105" : "text-text-main/80"
                )}
              >
                <Grid size={20} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Categorias</span>
              </button>
              <button
                onClick={toggleTheme}
                aria-label="Alternar Tema"
                className="flex flex-col items-center gap-1 p-3 rounded-2xl text-text-main/80 flex-1 transition-all active:scale-90"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                <span className="text-[10px] font-bold uppercase tracking-widest">Tema</span>
              </button>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 250 }}
              className={cn(
                "fixed bg-card-main border border-border-main shadow-2xl flex flex-col overflow-hidden z-[90]",
                isMobile
                  ? "inset-y-0 left-0 w-[85%] rounded-r-[40px]"
                  : "inset-y-3 left-3 w-64 xl:w-72 rounded-[24px] xl:rounded-[32px]"
              )}
            >
              <div className="p-8 notebook-sidebar-p border-b border-border-main flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-[20px] flex items-center justify-center shadow-lg transition-colors duration-300",
                    theme === 'light' ? "bg-black text-white" : "bg-white text-black"
                  )}>
                    <Image
                      src="/favicon.svg"
                      alt="Canivete Logo"
                      width={40}
                      height={40}
                      priority
                      className={cn(
                        "w-10 h-10",
                        theme === 'light' ? "invert-0" : "invert"
                      )}
                    />
                  </div>
                  <div>
                    <h1 className="font-black text-xl leading-tight">Canivete</h1>
                    <p className="text-[10px] opacity-90 uppercase tracking-[3px] font-bold">Menu</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  aria-label="Fechar menu"
                  className="p-3 bg-text-main/5 hover:bg-text-main/10 rounded-2xl transition-all active:scale-95"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 custom-scrollbar">
                <button
                  onClick={() => { setSelectedCategory(null); setSelectedToolId(null); if (isMobile) setIsSidebarOpen(false); }}
                  className={cn(
                    "w-full flex items-center gap-4 px-5 py-4 rounded-[24px] transition-all duration-300",
                    !selectedCategory && !selectedToolId
                      ? "bg-text-main text-bg-main shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] scale-[1.02]"
                      : "hover:bg-text-main/5"
                  )}
                >
                  <LayoutDashboard size={20} />
                  <span className="font-bold text-sm uppercase tracking-widest">Dashboard</span>
                </button>

                <div className="pt-4 pb-2 px-4">
                  <p className="text-[10px] font-bold text-text-main/90 uppercase tracking-widest">Categorias</p>
                </div>

                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setSelectedToolId(null); if (isMobile) setIsSidebarOpen(false); }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-sm",
                      selectedCategory === cat && !selectedToolId
                        ? "bg-text-main text-bg-main shadow-lg"
                        : "hover:bg-text-main/5"
                    )}
                  >
                    <Icon name={getCategoryIcon(cat)} className="w-4 h-4" />
                    <span className="font-medium">{cat}</span>
                  </button>
                ))}
              </nav>

              <div className="p-4 border-t border-border-main">
                <div className="bg-text-main/5 rounded-2xl p-4">
                  <p className="text-xs font-medium opacity-85 mb-2">Total de Ferramentas</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold">{TOOLS.length}</span>
                    <span className="text-sm font-semibold opacity-90 mb-1">/ {TOOLS.length}</span>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <main className="flex-1 flex flex-col relative overflow-hidden transition-all duration-500 bg-bg-main" style={{ paddingLeft: 'var(--sidebar-width)' }}>
          <header className="fixed top-3 notebook-safe-header right-3 z-40 transition-all duration-500 flex items-center gap-3" style={{ left: 'calc(var(--sidebar-width) + 12px)' }}>
            <AnimatePresence>
              {!isSidebarOpen && (
                <motion.button
                  initial={{ opacity: 0, x: -20, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.8 }}
                  onClick={() => setIsSidebarOpen(true)}
                  aria-label="Abrir barra lateral"
                  className="p-3 bg-card-main/80 backdrop-blur-xl border border-border-main rounded-2xl shadow-xl hover:bg-text-main/5 transition-all flex items-center justify-center shrink-0 active:scale-95"
                >
                  <Menu size={20} />
                </motion.button>
              )}
            </AnimatePresence>

            <div className="flex-1 bg-card-main/80 backdrop-blur-xl border border-border-main rounded-[24px] lg:rounded-[28px] p-2 pr-4 lg:p-3 lg:pr-6 notebook-nav-compact shadow-xl flex items-center justify-between gap-4">

              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity" size={16} />
                <input
                  type="text"
                  placeholder={isMobile ? "Buscar..." : "Buscar ferramenta..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-bg-main/50 border-none rounded-xl py-2 pl-9 pr-4 notebook-input-compact focus:ring-2 focus:ring-text-main/10 transition-all text-sm placeholder:text-text-main/80"
                />
              </div>

              <div className="flex items-center gap-1 sm:gap-2 border-l border-border-main pl-4 ml-2">
                <button
                  onClick={() => setIsDonationModalOpen(true)}
                  className={cn(
                    "p-2 hover:bg-text-main/5 rounded-xl notebook-btn-compact transition-colors flex items-center gap-1 group/donate",
                    isMobile ? "text-red-500/80" : "hidden sm:flex text-text-main"
                  )}
                  title="Apoie o Projeto"
                >
                  <Heart size={20} className="group-hover/donate:scale-110 transition-transform fill-current sm:fill-none" />
                </button>

                <div className="relative">
                  <button
                    onClick={() => {
                      setIsNotificationsOpen(!isNotificationsOpen);
                      setHasUnreadNotifications(false);
                      if (lastInsertedTool) localStorage.setItem('last_seen_tool', lastInsertedTool.id);
                    }}
                    className="p-2 hover:bg-text-main/5 rounded-xl notebook-btn-compact transition-colors relative"
                    title="Notificações"
                  >
                    <Bell size={20} className={cn(isNotificationsOpen && "text-blue-500")} />
                    {hasUnreadNotifications && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-bg-main animate-pulse" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isNotificationsOpen && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setIsNotificationsOpen(false)}
                          className="fixed inset-0 z-[-1]"
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-4 w-[320px] bg-card-main border border-border-main rounded-[28px] shadow-2xl overflow-hidden z-50 p-2"
                        >
                          <div className="p-4 border-b border-border-main/5 flex items-center justify-between">
                            <h4 className="text-[10px] font-black uppercase tracking-[3px] opacity-40">Novidades</h4>
                            <Sparkles size={14} className="text-yellow-500" />
                          </div>
                          <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
                            {TOOLS.slice(-5).reverse().map((tool, idx) => (
                              <button
                                key={tool.id}
                                onClick={() => {
                                  setSelectedToolId(tool.id);
                                  setIsNotificationsOpen(false);
                                  setIsSidebarOpen(false);
                                }}
                                className="w-full p-4 hover:bg-text-main/5 rounded-2xl transition-all text-left flex gap-3 group border-b border-border-main/5 last:border-0"
                              >
                                <div className="w-10 h-10 bg-text-main/5 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-text-main group-hover:text-bg-main transition-colors">
                                  <Icon name={tool.icon} className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <h5 className="font-bold text-xs truncate">{tool.name}</h5>
                                    {idx === 0 && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />}
                                  </div>
                                  <p className="text-[10px] opacity-40 line-clamp-1 italic">{tool.description}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                          <div className="p-2 pt-0">
                            <div className="bg-text-main/5 p-3 rounded-2xl text-center text-[9px] font-bold opacity-30 uppercase tracking-widest">
                              Canivete Suíço v1.0.4
                            </div>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={() => {
                    setTourStep(0);
                    setIsTourOpen(true);
                  }}
                  className="p-2 hover:bg-text-main/5 rounded-xl notebook-btn-compact transition-colors"
                  title="Tutorial Guiado"
                >
                  <Compass size={20} className={cn(isTourOpen && "text-blue-500 animate-spin-slow")} />
                </button>

                {!isMobile && (
                  <button
                    onClick={toggleTheme}
                    className="p-2 hover:bg-text-main/5 rounded-xl notebook-btn-compact transition-colors"
                    title="Alternar Tema"
                  >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                  </button>
                )}
              </div>
            </div>
          </header>

          <div className={cn(
            "flex-1 custom-scrollbar transition-all duration-500",
            selectedToolId
              ? "overflow-hidden p-3 sm:p-4 lg:p-6 pt-16 sm:pt-24 lg:pt-24 notebook-safe-pt"
              : "overflow-y-auto p-4 sm:p-6 lg:p-10 pt-24 sm:pt-28 lg:pt-32 pb-32 sm:pb-10 notebook-safe-pt"
          )}>
            <AnimatePresence mode="wait">
              {!selectedToolId ? (
                <motion.div
                  key="dashboard"
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="max-w-7xl mx-auto"
                >
                  <div className="mb-6 lg:mb-10 notebook-title-mb">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2">
                      {selectedCategory || (
                        <>
                          <span className="inline lg:hidden">Ferramentas</span>
                          <span className="hidden lg:inline">Todas as Ferramentas</span>
                        </>
                      )}
                    </h2>
                    <p className="text-text-main/80 font-medium text-xs sm:text-sm lg:text-base">
                      {filteredTools.length} {filteredTools.length === 1 ? 'ferramenta encontrada' : 'ferramentas encontradas'}.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 notebook-card-gap">
                    {filteredTools.map((tool) => (
                      <ToolCard
                        key={tool.id}
                        tool={tool}
                        isMobile={isMobile}
                        onClick={() => {
                          setSelectedToolId(tool.id);
                          setIsSidebarOpen(false);
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="tool-view"
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: 10 }}
                  className="max-w-[1700px] mx-auto w-full h-full flex flex-col grow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 lg:mb-6 notebook-title-mb">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setSelectedToolId(null);
                          setIsSidebarOpen(true);
                          setIsFullscreen(false);
                        }}
                        aria-label="Voltar para a lista de ferramentas"
                        className="p-2.5 bg-text-main/5 hover:bg-text-main/10 rounded-xl transition-colors shrink-0"
                      >
                        <X size={20} />
                      </button>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">{selectedTool?.category}</span>
                          <span className="w-0.5 h-0.5 rounded-full bg-text-main/20" />
                          <span className="text-[9px] font-mono opacity-90">#{selectedTool?.id}</span>
                        </div>
                        <h2 className="text-lg lg:text-xl font-bold truncate">{selectedTool?.name}</h2>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="flex-1 sm:flex-none p-2.5 bg-text-main/5 hover:bg-text-main/10 rounded-xl transition-colors flex items-center justify-center"
                        title={isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}
                      >
                        {isFullscreen ? <Maximize size={18} className="rotate-180" /> : <Maximize size={18} />}
                      </button>
                      <button
                        onClick={() => setIsAboutOpen(true)}
                        className="flex-1 sm:flex-none px-3 py-2 bg-text-main/5 hover:bg-text-main/10 rounded-xl text-[11px] lg:text-sm font-bold transition-colors flex items-center justify-center gap-2"
                      >
                        <Info size={14} /> {isMobile ? "Sobre" : "Ver Detalhes"}
                      </button>
                      <button
                        onClick={() => setIsShareOpen(true)}
                        className="flex-1 sm:flex-none px-3 py-2 bg-text-main text-bg-main rounded-xl text-[11px] lg:text-sm font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                      >
                        <ExternalLink size={14} /> {isMobile ? "Enviar" : "Compartilhar"}
                      </button>
                    </div>
                  </div>

                  <div className={cn(
                    "flex-1 min-h-0 bg-card-main rounded-[24px] lg:rounded-[32px] border border-border-main shadow-2xl flex flex-col overflow-hidden backdrop-blur-sm transition-all duration-500",
                    isFullscreen && "fixed inset-2 z-[100] rounded-[32px] sm:rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                  )}>
                    <div className="flex-1 p-4 sm:p-6 lg:p-8 notebook-tool-p overflow-y-auto custom-scrollbar">
                      <ToolRenderer toolId={selectedToolId} />
                    </div>
                    {isFullscreen && (
                      <button
                        onClick={() => setIsFullscreen(false)}
                        className="absolute top-6 right-6 p-4 bg-text-main text-bg-main rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all z-[101]"
                        title="Sair da Tela Cheia"
                      >
                        <X size={24} />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        <AnimatePresence>
          {isAboutOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAboutOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
              />
              <motion.div
                initial={{ opacity: 0, scale: isMobile ? 1 : 0.9, y: isMobile ? '100%' : 20 }}
                animate={{ opacity: 1, scale: 1, y: isMobile ? 0 : 0 }}
                exit={{ opacity: 0, scale: isMobile ? 1 : 0.9, y: isMobile ? '100%' : 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className={cn(
                  "fixed bg-card-main border border-border-main shadow-2xl z-[110] overflow-hidden",
                  isMobile
                    ? "inset-x-0 bottom-0 rounded-t-[40px] max-h-[90vh]"
                    : "inset-x-4 top-1/2 -translate-y-1/2 mx-auto max-w-lg rounded-[40px]"
                )}
              >
                {isMobile && <div className="w-12 h-1.5 bg-text-main/10 rounded-full mx-auto mt-4 mb-2" />}
                <div className="p-8 lg:p-10 notebook-tool-p text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-text-main text-bg-main rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Icon name={selectedTool?.icon || 'Code2'} className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <div className="mb-6 lg:mb-8 notebook-title-mb">
                    <p className="text-[10px] font-bold text-text-main/80 uppercase tracking-[4px] mb-2">{selectedTool?.category}</p>
                    <h3 className="text-2xl sm:text-3xl font-black mb-3">{selectedTool?.name}</h3>
                    <p className="text-sm sm:text-base text-text-main/90 leading-relaxed px-2">
                      {selectedTool?.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
                    <div className="bg-text-main/5 p-3 sm:p-4 rounded-2xl text-left border border-border-main/5">
                      <p className="text-[9px] font-bold opacity-30 uppercase mb-0.5 sm:mb-1">Status</p>
                      <p className="text-xs sm:text-sm font-bold text-green-500 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Funcional
                      </p>
                    </div>
                    <div className="bg-text-main/5 p-3 sm:p-4 rounded-2xl text-left border border-border-main/5">
                      <p className="text-[9px] font-bold opacity-30 uppercase mb-0.5 sm:mb-1">Versão</p>
                      <p className="text-xs sm:text-sm font-bold opacity-80">v1.0.4</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={() => setIsAboutOpen(false)}
                      className="w-full py-4 bg-text-main text-bg-main rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                    >
                      Entendido
                    </button>
                    <p className="text-[9px] font-medium opacity-20 uppercase tracking-widest">Canivete Suíço 2026</p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isShareOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsShareOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
              />
              <motion.div
                initial={{ opacity: 0, scale: isMobile ? 1 : 0.9, y: isMobile ? '100%' : 20 }}
                animate={{ opacity: 1, scale: 1, y: isMobile ? 0 : 0 }}
                exit={{ opacity: 0, scale: isMobile ? 1 : 0.9, y: isMobile ? '100%' : 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className={cn(
                  "fixed bg-card-main border border-border-main shadow-2xl z-[110] overflow-hidden",
                  isMobile
                    ? "inset-x-0 bottom-0 rounded-t-[40px] max-h-[90vh]"
                    : "inset-x-4 top-1/2 -translate-y-1/2 mx-auto max-w-lg rounded-[40px]"
                )}
              >
                {isMobile && <div className="w-12 h-1.5 bg-text-main/10 rounded-full mx-auto mt-4 mb-2" />}
                <div className="p-8 lg:p-10">
                  <div className="text-center mb-8 sm:mb-10">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-text-main/5 text-text-main rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <ExternalLink size={isMobile ? 28 : 36} />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black mb-2 text-text-main">Compartilhar</h3>
                    <p className="text-sm sm:text-base text-text-main/80">Envie esta ferramenta para seu team.</p>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-main/90 uppercase tracking-widest ml-1">Link de Acesso</label>
                      <div className="relative group">
                        <input
                          readOnly
                          value={currentUrl}
                          className="w-full bg-text-main/5 border border-border-main rounded-2xl py-3.5 sm:py-4 pl-4 pr-16 text-xs sm:text-sm font-mono text-text-main/80 focus:ring-2 focus:ring-text-main/10 outline-none"
                        />
                        <button
                          onClick={copyShareLink}
                          className="absolute right-2 top-2 bottom-2 px-3 sm:px-4 bg-text-main text-bg-main rounded-xl font-bold text-[10px] sm:text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 sm:gap-2"
                        >
                          {shareStatus === 'copied' ? <Check size={14} /> : <Copy size={13} />}
                          {shareStatus === 'copied' ? 'Copiado' : 'Copiar'}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <button
                        onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Checkout this tool: ${selectedTool?.name} - ${window.location.href}`)}`)}
                        className="py-3.5 sm:py-4 bg-green-500/10 hover:bg-green-500/20 text-green-600 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
                      >
                        WhatsApp
                      </button>
                      <button
                        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Checkout this tool: ${selectedTool?.name}`)}&url=${encodeURIComponent(window.location.href)}`)}
                        className="py-3.5 sm:py-4 bg-blue-400/10 hover:bg-blue-400/20 text-blue-500 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
                      >
                        Twitter
                      </button>
                    </div>
                    <button onClick={() => setIsShareOpen(false)} className="w-full py-4 text-text-main/70 font-bold hover:text-text-main transition-colors text-sm">Fechar</button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <DonationModal
          isOpen={isDonationModalOpen}
          onClose={() => setIsDonationModalOpen(false)}
          isMobile={isMobile}
          activePixTab={activePixTab}
          setActivePixTab={setActivePixTab}
          selectedBank={selectedBank}
          setSelectedBank={setSelectedBank}
          BANKS={BANKS}
          openBankApp={openBankApp}
          pixPayload={pixPayload}
          pixCopied={pixCopied}
          setPixCopied={setPixCopied}
          toolSuggestion={toolSuggestion}
          setToolSuggestion={setToolSuggestion}
          isSendingSuggestion={isSendingSuggestion}
          sendSuggestion={sendSuggestion}
          suggestionStatus={suggestionStatus}
        />

        <UpdateNotification
          show={showUpdateNotification}
          tool={lastInsertedTool}
          onClose={() => {
            localStorage.setItem('last_seen_tool', lastInsertedTool.id);
            setShowUpdateNotification(false);
          }}
          onAction={() => {
            setSelectedToolId(lastInsertedTool.id);
            localStorage.setItem('last_seen_tool', lastInsertedTool.id);
            setShowUpdateNotification(false);
            setIsSidebarOpen(false);
          }}
        />

        <Tour
          isOpen={isTourOpen}
          step={tourStep}
          onNext={handleNextTourStep}
          onClose={handleCloseTour}
        />

      </div>
    </LazyMotion >
  );
}
