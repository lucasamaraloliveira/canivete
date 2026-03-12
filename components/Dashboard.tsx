'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Search, Menu, X, Code2, ChevronRight, Moon, Sun, LayoutDashboard, Settings,
    Info, ExternalLink, Check, Copy, RotateCcw, Heart, Mail, MessageSquarePlus,
    Grid, ShieldAlert, RefreshCw, Bell, Sparkles, Compass, MousePointer2, Plus,
    ArrowRight, LayoutGrid, List, Wand2, ShieldCheck, Smartphone, Monitor, Maximize, Lock, ChevronRight as ChevronRightIcon,
    Brain, Bot, Sparkles as SparklesIcon
} from 'lucide-react';

import { LazyMotion, domAnimation, motion, AnimatePresence } from 'motion/react';
import { TOOLS, Tool } from '@/constants/tools';
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
        case 'Saúde': return 'Heart';
        case 'IA': return 'Brain';
        default: return 'Box';
    }
};

const ToolCard = React.memo(({ tool, isMobile }: { tool: Tool, isMobile: boolean }) => {
    return (
        <Link href={`/${tool.categorySlug}/${tool.slug}`} scroll={false}>
            <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    "group bg-card-main p-5 lg:p-7 rounded-[26px] lg:rounded-[36px] border border-border-main shadow-sm transition-all duration-200 text-left flex flex-col relative overflow-hidden h-[190px] lg:h-[230px]",
                    "hover:shadow-xl cursor-pointer"
                )}
            >
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-text-main/5 rounded-xl lg:rounded-[22px] flex items-center justify-center text-text-main mb-6 group-hover:bg-text-main group-hover:text-bg-main transition-colors shrink-0">
                    <Icon name={tool.icon} className="w-5 h-5 lg:w-7 lg:h-7" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[7px] lg:text-[10px] font-black uppercase tracking-widest opacity-90 truncate">{tool.category}</span>
                            {!isMobile && <span className="text-[8px] lg:text-[10px] font-mono opacity-60">#{tool.id}</span>}
                        </div>
                        <h3 className="font-bold text-xs sm:text-sm lg:text-lg mb-1.5 line-clamp-1 leading-tight">{tool.name}</h3>
                        <p className="hidden sm:block text-[10px] lg:text-[11px] opacity-70 leading-relaxed line-clamp-2 pr-2">
                            {tool.description}
                        </p>
                    </div>

                    <div className="flex items-center font-bold text-[9px] lg:text-[11px] opacity-70 sm:opacity-0 group-hover:opacity-100 transition-opacity mt-auto">
                        <span>Abrir</span> <ChevronRight size={10} className="ml-1" />
                    </div>
                </div>
            </motion.div>
        </Link>
    );
});
ToolCard.displayName = 'ToolCard';

interface DashboardProps {
    initialTool?: Tool | null;
}

export function Dashboard({ initialTool }: DashboardProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedToolId, setSelectedToolId] = useState<string | null>(initialTool?.id || null);
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
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
    const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

    const CATEGORY_KEYWORDS: Record<string, string[]> = {
        'Dev': ['JSON', 'SQL', 'TypeScript', 'React', 'CSS', 'API', 'JWT', 'Regex', 'GitHub', 'Backend'],
        'Design': ['Cores', 'SVG', 'Layout', 'CSS', 'UI/UX', 'Figma', 'Imagens', 'Formatos'],
        'Produtividade': ['PDF', 'Texto', 'Markdown', 'Foco', 'Tempo', 'Organização', 'Documentos'],
        'Segurança': ['Criptografia', 'Senha', 'Hash', 'Privacidade', 'SSL', 'Validadores'],
        'Ciência': ['Matemática', 'Física', 'Biologia', 'Conversor', 'Algoritmos'],
        'Saúde': ['Bem-estar', 'Exercícios', 'Hidratação', 'Foco Mental', 'Ergonomia'],
        'Diversos': ['Jogos', 'RPG', 'Música', 'Memes', 'Geradores', 'Brasil'],
        'IA': ['OpenAI', 'Chat', 'GPT', 'Prompts', 'NLP', 'Imagens', 'Dev', 'Escrita']
    };


    const pixKey = "5904eb47-9c13-4ee1-b018-6acb40d8a154";

    const copyPix = () => {
        navigator.clipboard.writeText(pixKey);
        setPixCopied(true);
        setTimeout(() => setPixCopied(false), 2000);
    };

    useEffect(() => {
        const checkHash = () => {
            if (window.location.hash.startsWith('#/sdm/')) {
                setSelectedToolId('79');
                setIsSidebarOpen(false);
            }
        };
        checkHash();
        window.addEventListener('hashchange', checkHash);
        return () => window.removeEventListener('hashchange', checkHash);
    }, []);

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
        const formatField = (id: string, value: string) => {
            const len = value.length.toString().padStart(2, '0');
            return `${id}${len}${value}`;
        };

        const payloadFormat = formatField("00", "01");
        const pointOfInitiation = formatField("01", "11");
        const gui = formatField("00", "br.gov.bcb.pix");
        const key = formatField("01", pixKey);
        const merchantAccount = formatField("26", `${gui}${key}`);
        const mcc = formatField("52", "0000");
        const currency = formatField("53", "986");
        const country = formatField("58", "BR");
        const merchantName = formatField("59", "CANIVETE");
        const merchantCity = formatField("60", "SAO PAULO");
        const additionalData = formatField("62", formatField("05", "***"));
        const crcPlaceholder = "6304";

        const payload = `${payloadFormat}${pointOfInitiation}${merchantAccount}${mcc}${currency}${country}${merchantName}${merchantCity}${additionalData}${crcPlaceholder}`;

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

    const [visibleCount, setVisibleCount] = useState(isMobile ? 8 : 15);

    useEffect(() => {
        const loadRest = () => {
            if ('requestIdleCallback' in window) {
                (window as any).requestIdleCallback(() => setVisibleCount(TOOLS.length));
            } else {
                setTimeout(() => setVisibleCount(TOOLS.length), 1000);
            }
        };
        loadRest();

        const timer = setTimeout(() => {
            setIsDonationModalOpen(true);
        }, 15000);

        const initSecondaryLogic = () => {
            const lastTool = TOOLS[TOOLS.length - 1];
            const acknowledgedToolId = localStorage.getItem('last_seen_tool');

            if (lastTool && lastTool.id !== acknowledgedToolId) {
                setLastInsertedTool(lastTool);
                setHasUnreadNotifications(true);
                setTimeout(() => setShowUpdateNotification(true), 2000);
            }

            const tourCompleted = localStorage.getItem('has_completed_tour');
            if (!tourCompleted) {
                setTimeout(() => setIsTourOpen(true), 3000);
            }
        };

        if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(initSecondaryLogic);
        } else {
            setTimeout(initSecondaryLogic, 1000);
        }

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        setCurrentUrl(window.location.href);
    }, [selectedToolId]);


    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
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

    const categories = useMemo(() => {
        const cats = new Set(TOOLS.map(t => t.category));
        return Array.from(cats);
    }, []);

    const filteredTools = useMemo(() => {
        return TOOLS.filter(tool => {
            const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tool.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = !selectedCategory || tool.category === selectedCategory;
            
            // Intelligent Keyword Logic
            const matchesKeywords = selectedKeywords.length === 0 || 
                selectedKeywords.every(kw => 
                    tool.tags?.includes(kw) || 
                    tool.name.toLowerCase().includes(kw.toLowerCase()) ||
                    tool.description.toLowerCase().includes(kw.toLowerCase())
                );

            return matchesSearch && matchesCategory && matchesKeywords;
        });
    }, [searchQuery, selectedCategory, selectedKeywords]);

    // Reset keywords when category changes
    useEffect(() => {
        setSelectedKeywords([]);
    }, [selectedCategory]);

    const toggleKeyword = (kw: string) => {
        setSelectedKeywords(prev => 
            prev.includes(kw) ? prev.filter(k => k !== kw) : [...prev, kw]
        );
    };

    const selectedTool = useMemo(() =>
        TOOLS.find(t => t.id === selectedToolId),
        [selectedToolId]);

    const copyShareLink = () => {
        const url = window.location.href;
        const title = `Canivete Suíço - ${selectedTool?.name}`;
        const text = `${title}\n${selectedTool?.description}\n${url}`;

        navigator.clipboard.writeText(text);
        setShareStatus('copied');
        setTimeout(() => setShareStatus('idle'), 2000);
    };


    const handleCloseUpdateNotification = useCallback(() => {
        setShowUpdateNotification(false);
    }, []);

    const handleUpdateAction = useCallback(() => {
        if (lastInsertedTool) {
            setSelectedToolId(lastInsertedTool.id);
            setShowUpdateNotification(false);
            setIsSidebarOpen(false);
            router.push(`/${lastInsertedTool.categorySlug}/${lastInsertedTool.slug}`);
        }
    }, [lastInsertedTool, router]);

    const handleNextTourStep = useCallback(() => {
        setTourStep(prev => prev + 1);
    }, []);

    const handleCloseTour = useCallback(() => {
        localStorage.setItem('has_completed_tour', 'true');
        setIsTourOpen(false);
    }, []);

    // Sync state with prop
    useEffect(() => {
        if (initialTool) {
            setSelectedToolId(initialTool.id);
            setIsSidebarOpen(false);
        } else {
            setSelectedToolId(null);
            setIsSidebarOpen(!isMobile);
        }
    }, [initialTool, isMobile]);


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
                        <div className="bg-card-main/80 backdrop-blur-xl border border-white/10 rounded-[32px] p-2 shadow-2xl flex items-center justify-around gap-1">
                            <button
                                onClick={() => { setSelectedCategory(null); setSelectedToolId(null); router.push('/'); }}
                                aria-label="Ir para o Início"
                                className={cn(
                                    "flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-300 flex-1",
                                    !selectedCategory && !selectedToolId ? "bg-text-main text-bg-main shadow-lg scale-105" : "text-text-main/80"
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
                                <Link href="/" onClick={() => { setSelectedCategory(null); setSelectedToolId(null); if (isMobile) setIsSidebarOpen(false); }} className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-12 h-12 rounded-[20px] flex items-center justify-center shadow-lg transition-colors duration-300",
                                        theme === 'light' ? "bg-black text-white" : "bg-white text-black"
                                    )}>
                                        <Image
                                            src="/apple-touch-icon.png"
                                            alt="Canivete Logo"
                                            width={40}
                                            height={40}
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
                                </Link>
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
                                    onClick={() => { setSelectedCategory(null); setSelectedToolId(null); router.push('/'); if (isMobile) setIsSidebarOpen(false); }}
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
                                        onClick={() => { setSelectedCategory(cat); setSelectedToolId(null); router.push('/'); if (isMobile) setIsSidebarOpen(false); }}
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

                            <div className="p-6 border-t border-border-main/5">
                                <div className="bg-text-main/5 rounded-2xl p-4 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-[2px] opacity-40">Total de</span>
                                        <span className="text-lg font-black leading-tight">Ferramentas</span>
                                    </div>
                                    <div className="bg-text-main text-bg-main px-3 py-1.5 rounded-xl font-black text-sm shadow-lg">
                                        {TOOLS.length}
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

                        <div className="flex-1 bg-card-main/80 backdrop-blur-lg border border-border-main rounded-[24px] lg:rounded-[28px] p-2 pr-4 lg:p-3 lg:pr-6 notebook-nav-compact shadow-xl flex items-center justify-between gap-4">

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
                                                            <Link
                                                                key={tool.id}
                                                                href={`/${tool.categorySlug}/${tool.slug}`}
                                                                onClick={() => {
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
                                                            </Link>
                                                        ))}
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
                                    className="max-w-[1600px] mx-auto"
                                >
                                    <div className="mb-6 lg:mb-10 notebook-title-mb">
                                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-4">
                                            <div>
                                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2">
                                                    {selectedCategory || (
                                                        <>
                                                            <span className="inline lg:hidden">Ferramentas</span>
                                                            <span className="hidden lg:inline">Todas as Ferramentas</span>
                                                        </>
                                                    )}
                                                </h2>
                                                <p className="text-text-main/60 font-medium text-xs sm:text-sm lg:text-base">
                                                    {filteredTools.length} {filteredTools.length === 1 ? 'ferramenta encontrada' : 'ferramentas encontradas'}.
                                                </p>
                                            </div>

                                            {/* Smart Keyword Filter */}
                                            {selectedCategory && CATEGORY_KEYWORDS[selectedCategory] && (
                                                <div className="flex-1 lg:max-w-2xl">
                                                    <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-right-4 duration-500">
                                                        <div className="flex items-center gap-2 mr-2 py-2">
                                                            <Sparkles size={14} className="text-blue-500" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Keywords:</span>
                                                        </div>
                                                        {CATEGORY_KEYWORDS[selectedCategory].map(kw => (
                                                            <button
                                                                key={kw}
                                                                onClick={() => toggleKeyword(kw)}
                                                                className={cn(
                                                                    "px-4 py-1.5 rounded-full text-[10px] lg:text-[11px] font-bold transition-all border active:scale-95",
                                                                    selectedKeywords.includes(kw)
                                                                        ? "bg-text-main text-bg-main border-text-main shadow-md"
                                                                        : "bg-text-main/5 border-transparent hover:border-text-main/20"
                                                                )}
                                                            >
                                                                {kw}
                                                            </button>
                                                        ))}
                                                        {selectedKeywords.length > 0 && (
                                                            <button
                                                                onClick={() => setSelectedKeywords([])}
                                                                className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-colors"
                                                            >
                                                                Limpar
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div
                                        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6 min-h-[500px] items-stretch"
                                    >
                                        {filteredTools.slice(0, searchQuery ? undefined : visibleCount).map((tool) => (
                                            <ToolCard
                                                key={tool.id}
                                                tool={tool}
                                                isMobile={isMobile}
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
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 lg:mb-8 notebook-title-mb">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => {
                                                    setSelectedToolId(null);
                                                    setIsSidebarOpen(true);
                                                    setIsFullscreen(false);
                                                    router.push('/');
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
                                                <h2 className="text-xl lg:text-2xl font-bold truncate leading-tight pb-1">{selectedTool?.name}</h2>
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
                                                <Info size={14} /> Detalhes
                                            </button>
                                            <button
                                                onClick={() => setIsShareOpen(true)}
                                                className="flex-1 sm:flex-none px-3 py-2 bg-text-main text-bg-main rounded-xl text-[11px] lg:text-sm font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                            >
                                                <ExternalLink size={14} /> Compartilhar
                                            </button>

                                        </div>
                                    </div>

                                    <div className={cn(
                                        "flex-1 min-h-0 bg-card-main rounded-[24px] lg:rounded-[32px] border border-border-main shadow-2xl flex flex-col overflow-hidden backdrop-blur-sm transition-all duration-500",
                                        isFullscreen && "fixed inset-2 z-[100] rounded-[32px] sm:rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                                    )}>
                                        {isFullscreen && (
                                            <button
                                                onClick={() => setIsFullscreen(false)}
                                                className="absolute top-6 right-6 z-[110] p-3 bg-text-main text-bg-main rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center font-bold"
                                                aria-label="Sair da Tela Cheia"
                                            >
                                                <X size={20} />
                                            </button>
                                        )}
                                        <div className="flex-1 p-4 sm:p-6 lg:p-8 notebook-tool-p overflow-y-auto custom-scrollbar">
                                            <ToolRenderer toolId={selectedToolId} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </main>

                <Tour
                    isOpen={isTourOpen}
                    step={tourStep}
                    onNext={handleNextTourStep}
                    onClose={handleCloseTour}
                />
                <UpdateNotification
                    show={showUpdateNotification}
                    tool={lastInsertedTool}
                    onClose={handleCloseUpdateNotification}
                    onAction={handleUpdateAction}
                />
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
                                <div className="p-8 lg:p-10 notebook-tool-p text-center overflow-y-auto custom-scrollbar">
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
                                    <button
                                        onClick={() => setIsAboutOpen(false)}
                                        className="w-full py-4 bg-text-main text-bg-main rounded-2xl font-bold transition-all active:scale-95"
                                    >
                                        Fechar
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}

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
                                className={cn(
                                    "fixed bg-card-main border border-border-main shadow-2xl z-[110] overflow-hidden p-8",
                                    isMobile
                                        ? "inset-x-0 bottom-0 rounded-t-[40px]"
                                        : "inset-x-4 top-1/2 -translate-y-1/2 mx-auto max-w-md rounded-[40px]"
                                )}
                            >
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <ExternalLink size={20} /> Compartilhar Ferramenta
                                </h3>
                                <div className="space-y-4">
                                    <div className="bg-text-main/5 p-4 rounded-2xl border border-border-main/10">
                                        <p className="text-[10px] font-bold opacity-30 uppercase mb-2 tracking-widest">Link da Ferramenta</p>
                                        <div className="flex items-center gap-2">
                                            <input
                                                readOnly
                                                value={currentUrl}
                                                className="flex-1 bg-transparent border-none text-xs font-mono opacity-80 focus:ring-0"
                                            />
                                            <button
                                                onClick={copyShareLink}
                                                className="p-2 bg-text-main text-bg-main rounded-xl hover:scale-105 transition-all"
                                            >
                                                {shareStatus === 'copied' ? <Check size={16} /> : <Copy size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(currentUrl)}`, '_blank')}
                                            className="p-4 bg-[#25D366]/10 text-[#25D366] rounded-2xl font-bold text-xs flex flex-col items-center gap-2 transition-all hover:bg-[#25D366]/20"
                                        >
                                            <MessageSquarePlus size={20} /> WhatsApp
                                        </button>
                                        <button
                                            onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`, '_blank')}
                                            className="p-4 bg-sky-500/10 text-sky-500 rounded-2xl font-bold text-xs flex flex-col items-center gap-2 transition-all hover:bg-sky-500/20"
                                        >
                                            <Smartphone size={20} /> Twitter / X
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsShareOpen(false)}
                                    className="w-full mt-6 py-4 border border-border-main rounded-2xl font-bold text-sm hover:bg-text-main/5 transition-all"
                                >
                                    Fechar
                                </button>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </LazyMotion>

    );
}
