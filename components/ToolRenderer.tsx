"use client";

import React from "react";
import dynamic from "next/dynamic";
import {
  Settings,
  RotateCcw,
  Search,
  Database,
  Table,
  Key,
  Clock,
  FileCode,
  FileDiff,
  Image as ImageIcon,
  Terminal,
  LayoutDashboard,
  Map,
  Sparkles,
  RefreshCw,
  Cpu,
  FileText,
  ShieldAlert,
  PenTool,
  GitBranch,
  Video,
  Palette,
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
  Timer,
  Hash,
  Dot,
  Zap,
  Lock,
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
  Atom,
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
  Code2,
  Trash2
} from "lucide-react";

// Tool Implementation Components
const JsonToZod = dynamic(() => import('@/components/tools/JsonToZod').then(mod => mod.JsonToZod));
const JwtDecoder = dynamic(() => import('@/components/tools/JwtDecoder').then(mod => mod.JwtDecoder));
const SqlBeautifier = dynamic(() => import('@/components/tools/SqlBeautifier').then(mod => mod.SqlBeautifier));
const QrCodeGenerator = dynamic(() => import('@/components/tools/QrCodeGenerator').then(mod => mod.QrCodeGenerator));
const PasswordStrength = dynamic(() => import('@/components/tools/PasswordStrength').then(mod => mod.PasswordStrength));
const Base64Preview = dynamic(() => import('@/components/tools/Base64Preview').then(mod => mod.Base64Preview));
const MarkdownPreview = dynamic(() => import('@/components/tools/MarkdownPreview').then(mod => mod.MarkdownPreview));
const UnitConverter = dynamic(() => import('@/components/tools/UnitConverter').then(mod => mod.UnitConverter));
const CsvToHtml = dynamic(() => import('@/components/tools/CsvToHtml').then(mod => mod.CsvToHtml));
const RegexVisualizer = dynamic(() => import('@/components/tools/RegexVisualizer').then(mod => mod.RegexVisualizer));
const CronVisualizer = dynamic(() => import('@/components/tools/CronVisualizer').then(mod => mod.CronVisualizer));
const HtmlEntityEncoder = dynamic(() => import('@/components/tools/HtmlEntityEncoder').then(mod => mod.HtmlEntityEncoder));
const EnvGenerator = dynamic(() => import('@/components/tools/EnvGenerator').then(mod => mod.EnvGenerator));
const DiffChecker = dynamic(() => import('@/components/tools/DiffChecker').then(mod => mod.DiffChecker));
const YamlToJson = dynamic(() => import('@/components/tools/YamlToJson').then(mod => mod.YamlToJson));
const CurlConverter = dynamic(() => import('@/components/tools/CurlConverter').then(mod => mod.CurlConverter));
const SitemapGenerator = dynamic(() => import('@/components/tools/SitemapGenerator').then(mod => mod.SitemapGenerator));
const GitHelper = dynamic(() => import('@/components/tools/GitHelper').then(mod => mod.GitHelper));
const SvgToJsx = dynamic(() => import('@/components/tools/SvgToJsx').then(mod => mod.SvgToJsx));
const ApiMocker = dynamic(() => import('@/components/tools/ApiMocker').then(mod => mod.ApiMocker));
const LogAnonymizer = dynamic(() => import('@/components/tools/LogAnonymizer').then(mod => mod.LogAnonymizer));
const BrowserPrettier = dynamic(() => import('@/components/tools/BrowserPrettier').then(mod => mod.BrowserPrettier));
const CaseConverter = dynamic(() => import('@/components/tools/CaseConverter').then(mod => mod.CaseConverter));
const VttToSrt = dynamic(() => import('@/components/tools/VttToSrt').then(mod => mod.VttToSrt));

// Design Tools
const GlassmorphismGenerator = dynamic(() => import('@/components/tools/GlassmorphismGenerator').then(mod => mod.GlassmorphismGenerator));
const GridFlexGenerator = dynamic(() => import('@/components/tools/GridFlexGenerator').then(mod => mod.GridFlexGenerator));
const WaveGenerator = dynamic(() => import('@/components/tools/WaveGenerator').then(mod => mod.WaveGenerator));
const NeumorphismGenerator = dynamic(() => import('@/components/tools/NeumorphismGenerator').then(mod => mod.NeumorphismGenerator));
const AspectRatioCalculator = dynamic(() => import('@/components/tools/AspectRatioCalculator').then(mod => mod.AspectRatioCalculator));
const CssFilterPlayground = dynamic(() => import('@/components/tools/CssFilterPlayground').then(mod => mod.CssFilterPlayground));
const PlaceholderGenerator = dynamic(() => import('@/components/tools/PlaceholderGenerator').then(mod => mod.PlaceholderGenerator));
const ColorPaletteExtractor = dynamic(() => import('@/components/tools/ColorPaletteExtractor').then(mod => mod.ColorPaletteExtractor));
const FontPairer = dynamic(() => import('@/components/tools/FontPairer').then(mod => mod.FontPairer));
const ImageToAscii = dynamic(() => import('@/components/tools/ImageToAscii').then(mod => mod.ImageToAscii));
const PixelArtCanvas = dynamic(() => import('@/components/tools/PixelArtCanvas').then(mod => mod.PixelArtCanvas));
const FaviconGenerator = dynamic(() => import('@/components/tools/FaviconGenerator').then(mod => mod.FaviconGenerator));
const SvgPathEditor = dynamic(() => import('@/components/tools/SvgPathEditor').then(mod => mod.SvgPathEditor));
const WebpConverter = dynamic(() => import('@/components/tools/WebpConverter').then(mod => mod.WebpConverter));
const SpriteSplitter = dynamic(() => import('@/components/tools/SpriteSplitter').then(mod => mod.SpriteSplitter));
const VideoTrimmer = dynamic(() => import('@/components/tools/VideoTrimmer').then(mod => mod.VideoTrimmer));
const DitherTool = dynamic(() => import('@/components/tools/DitherTool').then(mod => mod.DitherTool));
const GradientMeshBuilder = dynamic(() => import('@/components/tools/GradientMesh').then(mod => mod.GradientMeshBuilder));
const AudioWaveformGen = dynamic(() => import('@/components/tools/AudioWaveform').then(mod => mod.AudioWaveformGen));
const IconFontPreviewer = dynamic(() => import('@/components/tools/IconFontPreviewer').then(mod => mod.IconFontPreviewer));
const LottiePreviewer = dynamic(() => import('@/components/tools/LottiePreviewer').then(mod => mod.LottiePreviewer));
const PomodoroTimer = dynamic(() => import('@/components/tools/PomodoroTimer').then(mod => mod.PomodoroTimer));
const WordCounter = dynamic(() => import('@/components/tools/WordCounter').then(mod => mod.WordCounter));
const BrailleTranslator = dynamic(() => import('@/components/tools/BrailleTranslator').then(mod => mod.BrailleTranslator));
const MorseCodeFlasher = dynamic(() => import('@/components/tools/MorseFlasher').then(mod => mod.MorseCodeFlasher));
const NameRandomizer = dynamic(() => import('@/components/tools/NameRandomizer').then(mod => mod.NameRandomizer));
const TravelChecklist = dynamic(() => import('@/components/tools/TravelChecklist').then(mod => mod.TravelChecklist));
const StandupTimer = dynamic(() => import('@/components/tools/StandupTimer').then(mod => mod.StandupTimer));
const TtsTester = dynamic(() => import('@/components/tools/TtsTester').then(mod => mod.TtsTester));
const SttNotebook = dynamic(() => import('@/components/tools/SttNotebook').then(mod => mod.SttNotebook));
const LoremIpsumCustom = dynamic(() => import('@/components/tools/LoremIpsum').then(mod => mod.LoremIpsumCustom));
const ScreenRecorder = dynamic(() => import('@/components/tools/ScreenRecorder').then(mod => mod.ScreenRecorder));
const MarkdownToPdf = dynamic(() => import('@/components/tools/MarkdownToPdf').then(mod => mod.MarkdownToPdf));
const PrivacyGenerator = dynamic(() => import('@/components/tools/PrivacyGenerator').then(mod => mod.PrivacyGenerator));
const PdfCompressor = dynamic(() => import('@/components/tools/PdfCompressor').then(mod => mod.PdfCompressor));
const DebtPayoffCalc = dynamic(() => import('@/components/tools/DebtPayoffCalc').then(mod => mod.DebtPayoffCalc));
const Flashcards = dynamic(() => import('@/components/tools/Flashcards').then(mod => mod.Flashcards));
const AcronymCreator = dynamic(() => import('@/components/tools/AcronymCreator').then(mod => mod.AcronymCreator));
const EbookReader = dynamic(() => import('@/components/tools/EbookReader').then(mod => mod.EbookReader));
const PrintWebClipper = dynamic(() => import('@/components/tools/PrintWebClipper').then(mod => mod.PrintWebClipper));
const BarcodeReader = dynamic(() => import('@/components/tools/BarcodeReader').then(mod => mod.BarcodeReader));
const BurnerBudget = dynamic(() => import('@/components/tools/BurnerBudget').then(mod => mod.BurnerBudget));

// Security Tools (New)
const SecureKeyGen = dynamic(() => import('@/components/tools/SecureKeyGen').then(mod => mod.SecureKeyGen));
const AesEncryptor = dynamic(() => import('@/components/tools/AesEncryptor').then(mod => mod.AesEncryptor));
const HashGenerator = dynamic(() => import('@/components/tools/HashGenerator').then(mod => mod.HashGenerator));
const SteganographyTool = dynamic(() => import('@/components/tools/SteganographyTool').then(mod => mod.SteganographyTool));
const SelfDestructMsg = dynamic(() => import('@/components/tools/SelfDestructMsg').then(mod => mod.SelfDestructMsg));
const WordPassphrase = dynamic(() => import('@/components/tools/WordPassphrase').then(mod => mod.WordPassphrase));
const TotpAuthenticator = dynamic(() => import('@/components/tools/TotpAuthenticator').then(mod => mod.TotpAuthenticator));
const SshKeyGen = dynamic(() => import('@/components/tools/SshKeyGen').then(mod => mod.SshKeyGen));
const ExifRemover = dynamic(() => import('@/components/tools/ExifRemover').then(mod => mod.ExifRemover));
const FileShredder = dynamic(() => import('@/components/tools/FileShredder').then(mod => mod.FileShredder));
const CsrDecoder = dynamic(() => import('@/components/tools/CsrDecoder').then(mod => mod.CsrDecoder));

// Science Tools (New)
const BaseConverter = dynamic(() => import('@/components/tools/BaseConverter').then(mod => mod.BaseConverter));
const PeriodicTable = dynamic(() => import('@/components/tools/PeriodicTable').then(mod => mod.PeriodicTable));
const GravitySimulator = dynamic(() => import('@/components/tools/GravitySimulator').then(mod => mod.GravitySimulator));
const GeneticTranslator = dynamic(() => import('@/components/tools/GeneticTranslator').then(mod => mod.GeneticTranslator));
const GraphSandbox = dynamic(() => import('@/components/tools/GraphSandbox').then(mod => mod.GraphSandbox));
const LogicGateSim = dynamic(() => import('@/components/tools/LogicGateSim').then(mod => mod.LogicGateSim));
const FractionVisualizer = dynamic(() => import('@/components/tools/FractionVisualizer').then(mod => mod.FractionVisualizer));
const RomanNumeralConv = dynamic(() => import('@/components/tools/RomanNumeralConv').then(mod => mod.RomanNumeralConv));
const BmiCalculator = dynamic(() => import('@/components/tools/BmiCalculator').then(mod => mod.BmiCalculator));
const ProjectileSimulator = dynamic(() => import('@/components/tools/ProjectileSimulator').then(mod => mod.ProjectileSimulator));
const AtomVisualizer = dynamic(() => import('@/components/tools/AtomVisualizer').then(mod => mod.AtomVisualizer));
const MapDistancer = dynamic(() => import('@/components/tools/MapDistancer').then(mod => mod.MapDistancer));

// Diversos Tools (New)
const VirtualMetronome = dynamic(() => import('@/components/tools/VirtualMetronome').then(mod => mod.VirtualMetronome));
const ReactionTimer = dynamic(() => import('@/components/tools/ReactionTimer').then(mod => mod.ReactionTimer));
const TypingSpeedTest = dynamic(() => import('@/components/tools/TypingSpeedTest').then(mod => mod.TypingSpeedTest));
const SudokuSolver = dynamic(() => import('@/components/tools/SudokuSolver').then(mod => mod.SudokuSolver));
const KeyboardPiano = dynamic(() => import('@/components/tools/KeyboardPiano').then(mod => mod.KeyboardPiano));
const MemeGenExpress = dynamic(() => import('@/components/tools/MemeGenExpress').then(mod => mod.MemeGenExpress));
const DiceRollerRPG = dynamic(() => import('@/components/tools/DiceRollerRPG').then(mod => mod.DiceRollerRPG));
const EightBitFxMaker = dynamic(() => import('@/components/tools/EightBitFxMaker').then(mod => mod.EightBitFxMaker));
const MazeGenerator = dynamic(() => import('@/components/tools/MazeGenerator').then(mod => mod.MazeGenerator));
const AnagramSolver = dynamic(() => import('@/components/tools/AnagramSolver').then(mod => mod.AnagramSolver));
const RhymeFinder = dynamic(() => import('@/components/tools/RhymeFinder').then(mod => mod.RhymeFinder));

// Dynamic Icon Component
const Icon = ({ name, className }: { name: string; className?: string }) => {
  const icons: Record<string, any> = {
    Code2, Search, Database, Table, Key, Clock, FileCode, Settings, FileDiff,
    ImageIcon, Terminal, LayoutDashboard, Map, Sparkles, RefreshCw,
    Cpu, FileText, ShieldAlert, PenTool, GitBranch, Video, Palette, Globe,
    Waves, FileDown, Layers, Type, Box, Play, Square, Scissors, Activity,
    Sliders, Maximize, Wind, FileImage, Grid, Timer, Hash, Dot, Zap, Lock,
    CheckSquare, Users, Ruler, QrCode, Volume2, Mic, DollarSign, Binary, Monitor,
    Music, ShieldCheck, Atom, Orbit, Dna, Network, CircuitBoard, PieChart,
    Shuffle, CreditCard, Scale, ArrowUpRight, Circle, MapPin, Keyboard,
    Fingerprint, EyeOff, Bomb, Shield, Smartphone, ImageOff, FileCheck, Laugh,
    Dice5, VolumeX, Grid3X3, BookOpen, Subtitles, Printer, Barcode, Code, Trash2,
    Image: ImageIcon, Layout: LayoutDashboard
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
    case '46': return <SecureKeyGen />;
    case '49': return <UnitConverter />;
    case '50': return <QrCodeGenerator />;
    case '54': return <BaseConverter />;
    case '61': return <PeriodicTable />;
    case '62': return <GravitySimulator />;
    case '63': return <GeneticTranslator />;
    case '64': return <GraphSandbox />;
    case '65': return <LogicGateSim />;
    case '66': return <FractionVisualizer />;
    case '67': return <RomanNumeralConv />;
    case '70': return <BmiCalculator />;
    case '71': return <ProjectileSimulator />;
    case '72': return <AtomVisualizer />;
    case '74': return <MapDistancer />;
    case '76': return <AesEncryptor />;
    case '77': return <HashGenerator />;
    case '78': return <SteganographyTool />;
    case '79': return <SelfDestructMsg />;
    case '80': return <WordPassphrase />;
    case '81': return <TotpAuthenticator />;
    case '82': return <SshKeyGen />;
    case '83': return <ExifRemover />;
    case '84': return <FileShredder />;
    case '85': return <CsrDecoder />;

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

    // Diversos
    case '58': return <VirtualMetronome />;
    case '73': return <ReactionTimer />;
    case '75': return <TypingSpeedTest />;
    case '86': return <SudokuSolver />;
    case '87': return <KeyboardPiano />;
    case '88': return <MemeGenExpress />;
    case '89': return <DiceRollerRPG />;
    case '90': return <EightBitFxMaker />;
    case '92': return <MazeGenerator />;
    case '93': return <AnagramSolver />;
    case '94': return <RhymeFinder />;
    default:
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-12">
          <div className="w-20 h-20 bg-text-main/5 rounded-3xl flex items-center justify-center text-text-main/40 mb-6">
            <Settings size={40} className="animate-spin-slow" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Em Construção</h3>
          <p className="opacity-80 max-w-md mx-auto">
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

export { ToolRenderer };