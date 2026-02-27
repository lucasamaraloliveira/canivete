'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Menu,
  X,
  Code2,
  Palette,
  Timer,
  Atom,
  Lock,
  Gamepad2,
  ChevronRight,
  Moon,
  Sun,
  LayoutDashboard,
  Settings,
  Info,
  ExternalLink,
  Check,
  Copy,
  RotateCcw,
  Database,
  Table,
  Key,
  Clock,
  FileCode,
  FileDiff,
  Image as ImageIcon,
  Terminal,
  Map,
  Sparkles,
  RefreshCw,
  Cpu,
  FileText,
  ShieldAlert,
  PenTool,
  GitBranch,
  Video,
  Globe,
  Waves,
  FileDown,
  Layers,
  Type,
  Box,
  Play,
  Square,
  Scissors,
  Activity,
  Sliders,
  Maximize,
  Wind,
  FileImage,
  Grid,
  Hash,
  Dot,
  Zap,
  CheckSquare,
  Users,
  Ruler,
  QrCode,
  Volume2,
  Mic,
  DollarSign,
  Binary,
  Monitor,
  Music,
  ShieldCheck,
  Orbit,
  Dna,
  Network,
  CircuitBoard,
  PieChart,
  Shuffle,
  CreditCard,
  Scale,
  ArrowUpRight,
  Circle,
  MapPin,
  Keyboard,
  Fingerprint,
  EyeOff,
  Bomb,
  Shield,
  Smartphone,
  ImageOff,
  FileCheck,
  Laugh,
  Dice5,
  VolumeX,
  Grid3X3,
  BookOpen,
  Subtitles,
  Printer,
  Barcode,
  Code,
  Heart,
  Mail,
  MessageSquarePlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { TOOLS } from '@/constants/tools';
import { cn } from '@/lib/utils';

// Tool Implementation Components
import { JsonToZod } from '@/components/tools/JsonToZod';
import { JwtDecoder } from '@/components/tools/JwtDecoder';
import { SqlBeautifier } from '@/components/tools/SqlBeautifier';
import { QrCodeGenerator } from '@/components/tools/QrCodeGenerator';
import { PasswordStrength } from '@/components/tools/PasswordStrength';
import { Base64Preview } from '@/components/tools/Base64Preview';
import { MarkdownPreview } from '@/components/tools/MarkdownPreview';
import { UnitConverter } from '@/components/tools/UnitConverter';
import { CsvToHtml } from '@/components/tools/CsvToHtml';
import { RegexVisualizer } from '@/components/tools/RegexVisualizer';
import { CronVisualizer } from '@/components/tools/CronVisualizer';
import { HtmlEntityEncoder } from '@/components/tools/HtmlEntityEncoder';
import { EnvGenerator } from '@/components/tools/EnvGenerator';
import { DiffChecker } from '@/components/tools/DiffChecker';
import { YamlToJson } from '@/components/tools/YamlToJson';
import { CurlConverter } from '@/components/tools/CurlConverter';
import { SitemapGenerator } from '@/components/tools/SitemapGenerator';
import { GitHelper } from '@/components/tools/GitHelper';
import { SvgToJsx } from '@/components/tools/SvgToJsx';
import { ApiMocker } from '@/components/tools/ApiMocker';
import { LogAnonymizer } from '@/components/tools/LogAnonymizer';
import { BrowserPrettier } from '@/components/tools/BrowserPrettier';
import { CaseConverter } from '@/components/tools/CaseConverter';
import { VttToSrt } from '@/components/tools/VttToSrt';

// Design Tools
import { GlassmorphismGenerator } from '@/components/tools/GlassmorphismGenerator';
import { GridFlexGenerator } from '@/components/tools/GridFlexGenerator';
import { WaveGenerator } from '@/components/tools/WaveGenerator';
import { NeumorphismGenerator } from '@/components/tools/NeumorphismGenerator';
import { AspectRatioCalculator } from '@/components/tools/AspectRatioCalculator';
import { CssFilterPlayground } from '@/components/tools/CssFilterPlayground';
import { PlaceholderGenerator } from '@/components/tools/PlaceholderGenerator';
import { ColorPaletteExtractor } from '@/components/tools/ColorPaletteExtractor';
import { FontPairer } from '@/components/tools/FontPairer';
import { ImageToAscii } from '@/components/tools/ImageToAscii';
import { PixelArtCanvas } from '@/components/tools/PixelArtCanvas';
import { FaviconGenerator } from '@/components/tools/FaviconGenerator';
import { SvgPathEditor } from '@/components/tools/SvgPathEditor';
import { WebpConverter } from '@/components/tools/WebpConverter';
import { SpriteSplitter } from '@/components/tools/SpriteSplitter';
import { VideoTrimmer } from '@/components/tools/VideoTrimmer';
import { DitherTool } from '@/components/tools/DitherTool';
import { GradientMeshBuilder } from '@/components/tools/GradientMesh';
import { AudioWaveformGen } from '@/components/tools/AudioWaveform';
import { IconFontPreviewer } from '@/components/tools/IconFontPreviewer';
import { LottiePreviewer } from '@/components/tools/LottiePreviewer';
import { PomodoroTimer } from '@/components/tools/PomodoroTimer';
import { WordCounter } from '@/components/tools/WordCounter';
import { BrailleTranslator } from '@/components/tools/BrailleTranslator';
import { MorseCodeFlasher } from '@/components/tools/MorseFlasher';
import { NameRandomizer } from '@/components/tools/NameRandomizer';
import { TravelChecklist } from '@/components/tools/TravelChecklist';
import { StandupTimer } from '@/components/tools/StandupTimer';
import { TtsTester } from '@/components/tools/TtsTester';
import { SttNotebook } from '@/components/tools/SttNotebook';
import { LoremIpsumCustom } from '@/components/tools/LoremIpsum';
import { ScreenRecorder } from '@/components/tools/ScreenRecorder';
import { MarkdownToPdf } from '@/components/tools/MarkdownToPdf';
import { PrivacyGenerator } from '@/components/tools/PrivacyGenerator';
import { PdfCompressor } from '@/components/tools/PdfCompressor';
import { DebtPayoffCalc } from '@/components/tools/DebtPayoffCalc';
import { Flashcards } from '@/components/tools/Flashcards';
import { AcronymCreator } from '@/components/tools/AcronymCreator';
import { EbookReader } from '@/components/tools/EbookReader';
import { PrintWebClipper } from '@/components/tools/PrintWebClipper';
import { BarcodeReader } from '@/components/tools/BarcodeReader';
import { BurnerBudget } from '@/components/tools/BurnerBudget';

// Dynamic Icon Component
const Icon = ({ name, className }: { name: string; className?: string }) => {
  const icons: Record<string, any> = {
    Code2, Search, Database, Table, Key, Clock, FileCode, Settings, FileDiff,
    Image: ImageIcon, Terminal, Layout: LayoutDashboard, Map, Sparkles, RefreshCw,
    Cpu, FileText, ShieldAlert, PenTool, GitBranch, Video, Palette, Globe,
    Waves, FileDown, Layers, Type, Box, Play, Square, Scissors, Activity,
    Sliders, Maximize, Wind, FileImage, Grid, Timer, Hash, Dot, Zap, Lock,
    CheckSquare, Users, Ruler, QrCode, Volume2, Mic, DollarSign, Binary, Monitor,
    Music, ShieldCheck, Atom, Orbit, Dna, Network, CircuitBoard, PieChart,
    Shuffle, CreditCard, Scale, ArrowUpRight, Circle, MapPin, Keyboard,
    Fingerprint, EyeOff, Bomb, Shield, Smartphone, ImageOff, FileCheck, Laugh,
    Dice5, VolumeX, Grid3X3, BookOpen, Subtitles, Printer, Barcode, Code
  };
  const LucideIcon = icons[name] || icons[name.replace('Code', 'Code2')] || Code2;
  return <LucideIcon className={className} />;
};

function getCategoryIcon(category: string) {
  switch (category) {
    case 'Dev': return 'Code2';
    case 'Design': return 'Palette';
    case 'Produtividade': return 'Timer';
    case 'Ciência': return 'Atom';
    case 'Segurança': return 'Lock';
    case 'Diversos': return 'Gamepad2';
    default: return 'Code2';
  }
}

function ToolRenderer({ toolId }: { toolId: string }) {
  switch (toolId) {
    case '01': return <JsonToZod />;
    case '02': return <RegexVisualizer />;
    case '03': return <SqlBeautifier />;
    case '04': return <CsvToHtml />;
    case '05': return <JwtDecoder />;
    case '06': return <CronVisualizer />;
    case '07': return <HtmlEntityEncoder />;
    case '08': return <EnvGenerator />;
    case '09': return <DiffChecker />;
    case '10': return <Base64Preview />;
    case '11': return <CurlConverter />;
    case '13': return <SitemapGenerator />;
    case '15': return <YamlToJson />;
    case '16': return <ApiMocker />;
    case '17': return <MarkdownPreview />;
    case '18': return <LogAnonymizer />;
    case '20': return <GitHelper />;
    case '14': return <BrowserPrettier />;
    case '32': return <SvgToJsx />;
    case '56': return <CaseConverter />;
    case '97': return <VttToSrt />;
    case '45': return <PasswordStrength />;
    case '49': return <UnitConverter />;
    case '50': return <QrCodeGenerator />;

    // Design
    case '12': return <GridFlexGenerator />;
    case '26': return <GlassmorphismGenerator />;
    case '24': return <WaveGenerator />;
    case '29': return <NeumorphismGenerator />;
    case '36': return <AspectRatioCalculator />;
    case '35': return <CssFilterPlayground />;
    case '31': return <PlaceholderGenerator />;
    case '22': return <ColorPaletteExtractor />;
    case '28': return <FontPairer />;
    case '27': return <ImageToAscii />;
    case '91': return <PixelArtCanvas />;
    case '23': return <FaviconGenerator />;
    case '19': return <SvgPathEditor />;
    case '39': return <WebpConverter />;
    case '33': return <SpriteSplitter />;
    case '21': return <VideoTrimmer />;
    case '40': return <DitherTool />;
    case '37': return <GradientMeshBuilder />;
    case '34': return <AudioWaveformGen />;
    case '38': return <IconFontPreviewer />;
    case '30': return <LottiePreviewer />;
    case '41': return <PomodoroTimer />;
    case '42': return <WordCounter />;
    case '43': return <BrailleTranslator />;
    case '44': return <MorseCodeFlasher />;
    case '68': return <NameRandomizer />;
    case '47': return <TravelChecklist />;
    case '48': return <StandupTimer />;
    case '51': return <TtsTester />;
    case '52': return <SttNotebook />;
    case '55': return <LoremIpsumCustom />;
    case '57': return <ScreenRecorder />;
    case '59': return <MarkdownToPdf />;
    case '60': return <PrivacyGenerator />;
    case '25': return <PdfCompressor />;
    case '53': return <DebtPayoffCalc />;
    case '69': return <Flashcards />;
    case '95': return <AcronymCreator />;
    case '96': return <EbookReader />;
    case '98': return <PrintWebClipper />;
    case '99': return <BarcodeReader />;
    case '100': return <BurnerBudget />;
    default:
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-12">
          <div className="w-20 h-20 bg-text-main/5 rounded-3xl flex items-center justify-center text-text-main/20 mb-6">
            <Settings size={40} className="animate-spin-slow" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Em Construção</h3>
          <p className="opacity-50 max-w-md mx-auto">
            Esta ferramenta está sendo implementada. Como este é um "Canivete Suíço" de 100 ferramentas, estamos liberando as funcionalidades em lotes.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-8 px-6 py-3 bg-text-main text-bg-main rounded-2xl font-bold flex items-center gap-2"
          >
            <RotateCcw size={18} /> Tentar Novamente
          </button>
        </div>
      );
  }
}

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

  useEffect(() => {
    // Abre o modal de doação discretamente após 2 segundos do carregamento inicial
    const timer = setTimeout(() => {
      setIsDonationModalOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

  // Responsive detection
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

  // Theme logic
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

  const handleShare = () => {
    setIsShareOpen(true);
  };

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

  return (
    <div className="flex h-screen bg-bg-main text-text-main font-sans overflow-hidden transition-colors duration-300">
      {/* Sidebar Backdrop for Mobile */}
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

      {/* Floating Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              "fixed bg-card-main border border-border-main shadow-2xl flex flex-col overflow-hidden z-[70]",
              isMobile
                ? "inset-y-0 left-0 w-80 rounded-r-[32px]"
                : "inset-y-3 left-3 w-64 xl:w-72 rounded-[24px] xl:rounded-[32px]"
            )}
          >
            <div className="p-6 border-b border-border-main flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-text-main text-bg-main rounded-xl flex items-center justify-center">
                  <Code2 size={24} />
                </div>
                <div>
                  <h1 className="font-bold text-lg leading-tight">Canivete Suíço</h1>
                  <p className="text-xs opacity-50 uppercase tracking-widest font-semibold">Dev Edition</p>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 hover:bg-text-main/5 rounded-xl transition-colors lg:hidden"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              <button
                onClick={() => { setSelectedCategory(null); setSelectedToolId(null); if (isMobile) setIsSidebarOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200",
                  !selectedCategory && !selectedToolId
                    ? "bg-text-main text-bg-main shadow-lg"
                    : "hover:bg-text-main/5"
                )}
              >
                <LayoutDashboard size={20} />
                <span className="font-medium">Dashboard</span>
              </button>

              <div className="pt-4 pb-2 px-4">
                <p className="text-[10px] font-bold text-text-main/40 uppercase tracking-widest">Categorias</p>
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
                <p className="text-xs font-medium opacity-60 mb-2">Total de Ferramentas</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold">100</span>
                  <span className="text-sm font-semibold opacity-40 mb-1">/ 100</span>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>


      {/* Main Content */}
      <main className={cn(
        "flex-1 flex flex-col relative overflow-hidden transition-all duration-500 bg-bg-main",
        isSidebarOpen && !isMobile ? "lg:pl-72 xl:pl-80" : "pl-0"
      )}>
        {/* Header */}
        <header className={cn(
          "fixed top-3 right-3 z-40 transition-all duration-500",
          isSidebarOpen && !isMobile ? "left-[284px] xl:left-[320px]" : isMobile ? "left-3" : "left-20"
        )}>
          <div className="bg-card-main/80 backdrop-blur-xl border border-border-main rounded-[24px] lg:rounded-[28px] p-2 pr-4 lg:p-3 lg:pr-6 shadow-xl flex items-center justify-between gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-3 hover:bg-text-main/5 rounded-2xl transition-colors flex items-center justify-center shrink-0"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isSidebarOpen ? 'close' : 'menu'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </motion.div>
              </AnimatePresence>
            </button>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={18} />
              <input
                type="text"
                placeholder="Buscar ferramenta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-bg-main border-none rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-text-main/10 transition-all text-sm"
              />
            </div>

            <div className="flex items-center gap-1 sm:gap-2 border-l border-border-main pl-4 ml-2">
              <button
                onClick={() => setIsDonationModalOpen(true)}
                className="p-2 hover:bg-text-main/5 text-text-main rounded-xl transition-colors hidden sm:flex items-center gap-1 group/donate"
                title="Apoie o Projeto"
              >
                <DollarSign size={20} className="group-hover/donate:scale-110 transition-transform" />
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-text-main/5 rounded-xl transition-colors"
                title="Alternar Tema"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 pt-20 sm:pt-28 lg:pt-32">
          <AnimatePresence mode="wait">
            {!selectedToolId ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-7xl mx-auto"
              >
                <div className="mb-6 lg:mb-10">
                  <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2">
                    {selectedCategory || "Todas as Ferramentas"}
                  </h2>
                  <p className="opacity-50 font-medium text-sm lg:text-base">
                    {filteredTools.length} ferramentas encontradas.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
                  {filteredTools.map((tool) => (
                    <motion.button
                      key={tool.id}
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedToolId(tool.id)}
                      className="group bg-card-main p-5 lg:p-6 rounded-[24px] lg:rounded-[32px] border border-border-main shadow-sm hover:shadow-xl transition-all text-left flex flex-col h-full"
                    >
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-text-main/5 rounded-2xl flex items-center justify-center text-text-main mb-4 group-hover:bg-text-main group-hover:text-bg-main transition-colors">
                        <Icon name={tool.icon} className="w-5 h-5 lg:w-6 lg:h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest opacity-40">{tool.category}</span>
                          <span className="text-[9px] lg:text-[10px] font-mono opacity-30">#{tool.id}</span>
                        </div>
                        <h3 className="font-bold text-base lg:text-lg mb-2">{tool.name}</h3>
                        <p className="text-xs lg:text-sm opacity-60 leading-relaxed line-clamp-2">
                          {tool.description}
                        </p>
                      </div>
                      <div className="mt-4 lg:mt-6 flex items-center font-bold text-xs lg:text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        Abrir Ferramenta <ChevronRight size={14} className="ml-1" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="tool-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-6xl mx-auto h-full flex flex-col"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSelectedToolId(null)}
                      className="p-2 hover:bg-text-main/5 rounded-xl transition-colors"
                    >
                      <X size={24} />
                    </button>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">{selectedTool?.category}</span>
                        <span className="w-1 h-1 rounded-full bg-text-main/20" />
                        <span className="text-[10px] font-mono opacity-30">#{selectedTool?.id}</span>
                      </div>
                      <h2 className="text-xl lg:text-2xl font-bold">{selectedTool?.name}</h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAboutOpen(true)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-text-main/5 hover:bg-text-main/10 rounded-xl text-xs lg:text-sm font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <Info size={16} /> Sobre
                    </button>
                    <button
                      onClick={() => setIsShareOpen(true)} // Changed to open share modal
                      className="flex-1 sm:flex-none px-4 py-2 bg-text-main text-bg-main rounded-xl text-xs lg:text-sm font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      <ExternalLink size={16} /> Compartilhar
                    </button>
                  </div>
                </div>

                <div className="flex-1 min-h-0 bg-card-main rounded-[24px] lg:rounded-[32px] border border-border-main shadow-2xl flex flex-col overflow-hidden">
                  <div className="flex-1 p-4 lg:p-8 overflow-y-auto custom-scrollbar">
                    <ToolRenderer toolId={selectedToolId} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Modal Sobre */}
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
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 mx-auto max-w-lg bg-card-main border border-border-main rounded-[40px] shadow-2xl z-[110] overflow-hidden"
            >
              <div className="p-8 lg:p-10 text-center">
                <div className="w-20 h-20 bg-text-main text-bg-main rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Icon name={selectedTool?.icon || 'Code2'} className="w-10 h-10" />
                </div>
                <div className="mb-8">
                  <p className="text-[10px] font-bold text-text-main/40 uppercase tracking-[4px] mb-2">{selectedTool?.category}</p>
                  <h3 className="text-3xl font-black mb-4">{selectedTool?.name}</h3>
                  <p className="text-text-main/60 leading-relaxed">
                    {selectedTool?.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-text-main/5 p-4 rounded-2xl text-left border border-border-main/5">
                    <p className="text-[10px] font-bold opacity-30 uppercase mb-1">Status</p>
                    <p className="text-sm font-bold text-green-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Funcional
                    </p>
                  </div>
                  <div className="bg-text-main/5 p-4 rounded-2xl text-left border border-border-main/5">
                    <p className="text-[10px] font-bold opacity-30 uppercase mb-1">Versão</p>
                    <p className="text-sm font-bold opacity-80">v1.0.4</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setIsAboutOpen(false)}
                    className="w-full py-4 bg-text-main text-bg-main rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    Fechar
                  </button>
                  <p className="text-[10px] font-medium opacity-20 uppercase tracking-widest">Canivete Suíço Dev Edition 2026</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal Compartilhar */}
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
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 mx-auto max-w-lg bg-card-main border border-border-main rounded-[40px] shadow-2xl z-[110] overflow-hidden"
            >
              <div className="p-8 lg:p-10">
                <div className="text-center mb-10">
                  <div className="w-20 h-20 bg-text-main/5 text-text-main rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <ExternalLink size={36} />
                  </div>
                  <h3 className="text-3xl font-black mb-2 text-text-main">Compartilhar</h3>
                  <p className="text-text-main/50">Envie esta ferramenta para seu time de dev.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-main/40 uppercase tracking-widest ml-1">Link de Acesso</label>
                    <div className="relative group">
                      <input
                        readOnly
                        value={window.location.href}
                        className="w-full bg-text-main/5 border border-border-main rounded-2xl py-4 pl-4 pr-16 text-sm font-mono text-text-main/80 focus:ring-2 focus:ring-text-main/10 outline-none"
                      />
                      <button
                        onClick={copyShareLink}
                        className="absolute right-2 top-2 bottom-2 px-4 bg-text-main text-bg-main rounded-xl font-bold text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                      >
                        {shareStatus === 'copied' ? <Check size={14} /> : <Copy size={14} />}
                        {shareStatus === 'copied' ? 'Copiado' : 'Copiar'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Checkout this tool: ${selectedTool?.name} - ${window.location.href}`)}`)}
                      className="py-4 bg-green-500/10 hover:bg-green-500/20 text-green-600 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                    >
                      WhatsApp
                    </button>
                    <button
                      onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Checkout this tool: ${selectedTool?.name}`)}&url=${encodeURIComponent(window.location.href)}`)}
                      className="py-4 bg-blue-400/10 hover:bg-blue-400/20 text-blue-500 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                    >
                      Twitter
                    </button>
                  </div>

                  <button
                    onClick={() => setIsShareOpen(false)}
                    className="w-full py-4 text-text-main/40 font-bold hover:text-text-main transition-colors"
                  >
                    Talvez depois
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
      {/* Donation & Suggestion Modal */}
      <AnimatePresence>
        {isDonationModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDonationModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-[900px] max-h-[90vh] bg-bg-main/80 backdrop-blur-2xl border border-white/10 rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
            >
              {/* Header with Close Button */}
              <div className="absolute top-6 right-6 z-10">
                <button
                  onClick={() => setIsDonationModalOpen(false)}
                  className="p-3 hover:bg-text-main/10 rounded-2xl transition-all text-text-main/50 hover:text-text-main"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 h-full">

                  {/* Left Column: Donation */}
                  <div className="p-8 sm:p-12 border-b md:border-b-0 md:border-r border-white/5 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_30px_-5px_rgba(239,68,68,0.4)]">
                      <Heart size={32} className="fill-current" />
                    </div>

                    <h3 className="text-2xl font-black mb-3 tracking-tight">Apoie o Projeto</h3>
                    <p className="text-sm text-text-main/60 leading-relaxed mb-8 max-w-[280px]">
                      Ajude a manter as ferramentas gratuitas e sem anúncios.
                    </p>

                    <div className="w-full space-y-6">
                      <div className="mx-auto w-44 h-44 bg-white p-3 rounded-3xl shadow-[0_20px_40px_-10px_rgba(255,255,255,0.1)] flex items-center justify-center group transition-transform hover:scale-105">
                        <QRCodeSVG value={pixKey} size={145} level="H" />
                      </div>

                      <div className="space-y-3 text-left">
                        <label className="text-[10px] font-bold text-text-main/30 uppercase tracking-[2px] ml-1">Chave PIX</label>
                        <div className="relative flex items-center gap-2 bg-text-main/5 border border-white/5 rounded-2xl p-1 pr-2 group">
                          <div className="flex-1 px-4 py-3 text-xs font-mono font-medium truncate opacity-70">
                            {pixKey}
                          </div>
                          <button
                            onClick={copyPix}
                            className={cn(
                              "px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 shrink-0",
                              pixCopied ? "bg-green-500 text-white" : "bg-text-main text-bg-main hover:opacity-90 shadow-lg"
                            )}
                          >
                            {pixCopied ? <Check size={14} /> : <Copy size={13} />}
                            {pixCopied ? 'Copiado' : 'Copiar'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Suggestion */}
                  <div className="p-8 sm:p-12 flex flex-col bg-text-main/[0.02]">
                    <div className="w-16 h-16 bg-blue-500/20 text-blue-500 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_30px_-5px_rgba(59,130,246,0.4)]">
                      <MessageSquarePlus size={32} />
                    </div>

                    <h3 className="text-2xl font-black mb-3 tracking-tight">Sugira sua Ideia</h3>
                    <p className="text-sm text-text-main/60 leading-relaxed mb-8 max-w-[280px]">
                      Qual ferramenta você sente falta? Envie sua sugestão diretamente para o desenvolvedor.
                    </p>

                    <div className="flex-1 flex flex-col gap-4">
                      <textarea
                        placeholder="Descreva a ferramenta aqui..."
                        value={toolSuggestion}
                        onChange={(e) => setToolSuggestion(e.target.value)}
                        className="flex-1 w-full bg-text-main/5 border border-white/5 rounded-[24px] p-5 text-sm font-medium placeholder:opacity-30 focus:ring-2 focus:ring-text-main/10 outline-none resize-none transition-all min-h-[160px]"
                      />

                      <button
                        onClick={sendSuggestion}
                        disabled={!toolSuggestion.trim() || isSendingSuggestion}
                        className={cn(
                          "w-full py-4 rounded-[20px] font-black text-[10px] uppercase tracking-[2px] transition-all flex items-center justify-center gap-3 border shadow-xl active:scale-95 sm:mt-2",
                          suggestionStatus === 'success'
                            ? "bg-green-500 text-white border-green-400"
                            : suggestionStatus === 'error'
                              ? "bg-red-500 text-white border-red-400"
                              : "bg-text-main text-bg-main hover:opacity-90 border-transparent shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)]"
                        )}
                      >
                        {isSendingSuggestion ? (
                          <>
                            <RefreshCw size={16} className="animate-spin" />
                            Processando...
                          </>
                        ) : suggestionStatus === 'success' ? (
                          <>
                            <Check size={16} />
                            Enviado com Sucesso!
                          </>
                        ) : suggestionStatus === 'error' ? (
                          <>
                            <ShieldAlert size={16} />
                            Houve um Erro
                          </>
                        ) : (
                          <>
                            <Mail size={16} />
                            Enviar Sugestão Agora
                          </>
                        )}
                      </button>

                      {suggestionStatus === 'success' && (
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[10px] text-green-500 font-bold text-center mt-2 flex items-center justify-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          Valeu! Vou analisar sua sugestão logo.
                        </motion.p>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
