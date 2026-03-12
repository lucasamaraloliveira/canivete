"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Settings, RotateCcw } from "lucide-react";
import { Icon } from "@/components/Icon";
import { AiToolWrapper } from "@/components/AiToolWrapper";
import { GenericAiTool } from "@/components/tools/GenericAiTool";

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
const RestClient = dynamic(() => import('@/components/tools/RestClient').then(mod => mod.RestClient));
const TestPlanManager = dynamic(() => import('@/components/tools/TestPlanManager').then(mod => mod.TestPlanManager));
const BugReporter = dynamic(() => import('@/components/tools/BugReporter').then(mod => mod.BugReporter));
const SupportersWall = dynamic(() => import('@/components/tools/SupportersWall').then(mod => mod.SupportersWall));
const WorkflowAutomator = dynamic(() => import('@/components/tools/WorkflowAutomator').then(mod => mod.WorkflowAutomator));

// Diversos & Generators (New)
const CpfGenerator = dynamic(() => import('@/components/tools/CpfGenerator').then(mod => mod.CpfGenerator));
const CnpjGenerator = dynamic(() => import('@/components/tools/CnpjGenerator').then(mod => mod.CnpjGenerator));
const RgGenerator = dynamic(() => import('@/components/tools/RgGenerator').then(mod => mod.RgGenerator));
const CnhGenerator = dynamic(() => import('@/components/tools/CnhGenerator').then(mod => mod.CnhGenerator));
const CepGenerator = dynamic(() => import('@/components/tools/CepGenerator').then(mod => mod.CepGenerator));
const PisGenerator = dynamic(() => import('@/components/tools/PisGenerator').then(mod => mod.PisGenerator));
const RenavamGenerator = dynamic(() => import('@/components/tools/RenavamGenerator').then(mod => mod.RenavamGenerator));
const StateInclusionGenerator = dynamic(() => import('@/components/tools/StateInclusionGenerator').then(mod => mod.StateInclusionGenerator));
const VoterTitleGenerator = dynamic(() => import('@/components/tools/VoterTitleGenerator').then(mod => mod.VoterTitleGenerator));
const CreditCardGenerator = dynamic(() => import('@/components/tools/CreditCardGenerator').then(mod => mod.CreditCardGenerator));
const BankAccountGenerator = dynamic(() => import('@/components/tools/BankAccountGenerator').then(mod => mod.BankAccountGenerator));
const PeopleGenerator = dynamic(() => import('@/components/tools/PeopleGenerator').then(mod => mod.PeopleGenerator));
const CompanyGenerator = dynamic(() => import('@/components/tools/CompanyGenerator').then(mod => mod.CompanyGenerator));
const VehicleGenerator = dynamic(() => import('@/components/tools/VehicleGenerator').then(mod => mod.VehicleGenerator));
const PlateGenerator = dynamic(() => import('@/components/tools/PlateGenerator').then(mod => mod.PlateGenerator));
const NameGenerator = dynamic(() => import('@/components/tools/NameGenerator').then(mod => mod.NameGenerator));
const NickGenerator = dynamic(() => import('@/components/tools/NickGenerator').then(mod => mod.NickGenerator));
const FancyTextGenerator = dynamic(() => import('@/components/tools/FancyTextGenerator').then(mod => mod.FancyTextGenerator));
const SymbolCopyTool = dynamic(() => import('@/components/tools/SymbolCopyTool').then(mod => mod.SymbolCopyTool));
const RandomNumberGenerator = dynamic(() => import('@/components/tools/RandomNumberGenerator').then(mod => mod.RandomNumberGenerator));
const PasswordGenerator = dynamic(() => import('@/components/tools/PasswordGenerator').then(mod => mod.PasswordGenerator));
const DocumentGenerator = dynamic(() => import('@/components/tools/DocumentGenerator').then(mod => mod.DocumentGenerator));
const ResumeGenerator = dynamic(() => import('@/components/tools/ResumeGenerator').then(mod => mod.ResumeGenerator));
const SpellChecker = dynamic(() => import('@/components/tools/SpellChecker').then(mod => mod.SpellChecker));
const CpfValidator = dynamic(() => import('@/components/tools/CpfValidator').then(mod => mod.CpfValidator));
const CnpjValidator = dynamic(() => import('@/components/tools/CnpjValidator').then(mod => mod.CnpjValidator));
const RgValidator = dynamic(() => import('@/components/tools/RgValidator').then(mod => mod.RgValidator));
const PisValidator = dynamic(() => import('@/components/tools/PisValidator').then(mod => mod.PisValidator));
const CnhValidator = dynamic(() => import('@/components/tools/CnhValidator').then(mod => mod.CnhValidator));
const VoterTitleValidator = dynamic(() => import('@/components/tools/VoterTitleValidator').then(mod => mod.VoterTitleValidator));
const RenavamValidator = dynamic(() => import('@/components/tools/RenavamValidator').then(mod => mod.RenavamValidator));
const CertidacaoValidator = dynamic(() => import('@/components/tools/CertidacaoValidator').then(mod => mod.CertidacaoValidator));
const BankAccountValidator = dynamic(() => import('@/components/tools/BankAccountValidator').then(mod => mod.BankAccountValidator));
const AreaCalculator = dynamic(() => import('@/components/tools/AreaCalculator').then(mod => mod.AreaCalculator));
const DateTools = dynamic(() => import('@/components/tools/DateTools').then(mod => mod.DateTools));

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
const PdfMerger = dynamic(() => import('@/components/tools/PdfMerger').then(mod => mod.PdfMerger));
const PdfSplitter = dynamic(() => import('@/components/tools/PdfSplitter').then(mod => mod.PdfSplitter));
const ImageToPdf = dynamic(() => import('@/components/tools/ImageToPdf').then(mod => mod.ImageToPdf));
const PdfToImage = dynamic(() => import('@/components/tools/PdfToImage').then(mod => mod.PdfToImage));
const PdfUnlocker = dynamic(() => import('@/components/tools/PdfUnlocker').then(mod => mod.PdfUnlocker));
const PdfProtector = dynamic(() => import('@/components/tools/PdfProtector').then(mod => mod.PdfProtector));
const PdfToWord = dynamic(() => import('@/components/tools/PdfToWord').then(mod => mod.PdfToWord));
const WordToPdf = dynamic(() => import('@/components/tools/WordToPdf').then(mod => mod.WordToPdf));
const ImageConverter = dynamic(() => import('@/components/tools/ImageConverter').then(mod => mod.ImageConverter));

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

// Novas Ferramentas Sugeridas
const ContrastChecker = dynamic(() => import('@/components/tools/ContrastChecker').then(mod => mod.ContrastChecker));
const JsonToTypescript = dynamic(() => import('@/components/tools/JsonToTypescript').then(mod => mod.JsonToTypescript));
const CarbonSnippet = dynamic(() => import('@/components/tools/CarbonSnippet').then(mod => mod.CarbonSnippet));
const EisenhowerMatrix = dynamic(() => import('@/components/tools/EisenhowerMatrix').then(mod => mod.EisenhowerMatrix));
const RadixVisualizer = dynamic(() => import('@/components/tools/RadixVisualizer').then(mod => mod.RadixVisualizer));
const ColorBlindnessSimulator = dynamic(() => import('@/components/tools/ColorBlindnessSimulator').then(mod => mod.ColorBlindnessSimulator));
const WorldTimePlanner = dynamic(() => import('@/components/tools/WorldTimePlanner').then(mod => mod.WorldTimePlanner));
const TailwindToCss = dynamic(() => import('@/components/tools/TailwindToCss').then(mod => mod.TailwindToCss));
const PackageJsonAnalyzer = dynamic(() => import('@/components/tools/PackageJsonAnalyzer').then(mod => mod.PackageJsonAnalyzer));
const VoiceTranscription = dynamic(() => import('@/components/tools/VoiceTranscription').then(mod => mod.VoiceTranscription));
const MermaidEditor = dynamic(() => import('./tools/MermaidEditor').then(mod => mod.MermaidEditor));
const DirectoryTree = dynamic(() => import('./tools/DirectoryTree').then(mod => mod.DirectoryTree));
const FlexboxSim = dynamic(() => import('./tools/FlexboxSim').then(mod => mod.FlexboxSim));
const SvgOptimizer = dynamic(() => import('./tools/SvgOptimizer').then(mod => mod.SvgOptimizer));
const SmoothShadows = dynamic(() => import('./tools/SmoothShadows').then(mod => mod.SmoothShadows));
const ResponsiveType = dynamic(() => import('./tools/ResponsiveType').then(mod => mod.ResponsiveType));
const OcrReader = dynamic(() => import('./tools/OcrReader').then(mod => mod.OcrReader));
const BusinessMetrics = dynamic(() => import('./tools/BusinessMetrics').then(mod => mod.BusinessMetrics));
const VisualJson = dynamic(() => import('./tools/VisualJson').then(mod => mod.VisualJson));
const MathPlotter = dynamic(() => import('./tools/MathPlotter').then(mod => mod.MathPlotter));
const BreathWork = dynamic(() => import('@/components/tools/BreathWork').then(mod => mod.BreathWork));
const EyeGuard = dynamic(() => import('@/components/tools/EyeGuard').then(mod => mod.EyeGuard));
const WaterReminder = dynamic(() => import('@/components/tools/WaterReminder').then(mod => mod.WaterReminder));
const VideoTranscription = dynamic(() => import('@/components/tools/VideoTranscription').then(mod => mod.VideoTranscription));
const YoutubeTranscription = dynamic(() => import('@/components/tools/YoutubeTranscription').then(mod => mod.YoutubeTranscription));
const SqlConverter = dynamic(() => import('@/components/tools/SqlConverter').then(mod => mod.SqlConverter));
const IAClientOmnichannel = dynamic(() => import('@/components/tools/IAClientOmnichannel').then(mod => mod.IAClientOmnichannel));


function getCategoryIcon(category: string) {
  switch (category) {
    case 'Dev': return 'Code2';
    case 'Design': return 'Palette';
    case 'Produtividade': return 'Timer';
    case 'Ciência': return 'Atom';
    case 'Segurança': return 'Lock';
    case 'Diversos': return 'Gamepad2';
    case 'Saúde': return 'Heart';
    case 'IA': return 'Brain';
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
    case '105': return <PdfUnlocker />;
    case '106': return <PdfProtector />;
    case '107': return <PdfToWord />;
    case '108': return <WordToPdf />;
    case '109': return <ImageConverter />;
    case '110': return <RestClient />;
    case '111': return <TestPlanManager />;
    case '112': return <BugReporter />;
    case '113': return <CpfGenerator />;
    case '114': return <CnpjGenerator />;
    case '115': return <RgGenerator />;
    case '116': return <CnhGenerator />;
    case '117': return <CepGenerator />;
    case '118': return <PisGenerator />;
    case '119': return <RenavamGenerator />;
    case '120': return <StateInclusionGenerator />;
    case '121': return <VoterTitleGenerator />;
    case '122': return <CreditCardGenerator />;
    case '123': return <BankAccountGenerator />;
    case '124': return <PeopleGenerator />;
    case '125': return <CompanyGenerator />;
    case '126': return <VehicleGenerator />;
    case '127': return <PlateGenerator />;
    case '128': return <NameGenerator />;
    case '129': return <NickGenerator />;
    case '130': return <FancyTextGenerator />;
    case '131': return <SymbolCopyTool />;
    case '132': return <RandomNumberGenerator />;
    case '133': return <PasswordGenerator />;
    case '134': return <DocumentGenerator />;
    case '135': return <ResumeGenerator />;
    case '136': return <SpellChecker />;
    case '137': return <CpfValidator />;
    case '138': return <CnpjValidator />;
    case '139': return <RgValidator />;
    case '140': return <PisValidator />;
    case '141': return <CnhValidator />;
    case '142': return <VoterTitleValidator />;
    case '143': return <RenavamValidator />;
    case '144': return <CertidacaoValidator />;
    case '145': return <BankAccountValidator />;
    case '146': return <AreaCalculator />;
    case '147': return <DateTools />;
    case '148': return <ContrastChecker />;
    case '149': return <JsonToTypescript />;
    case '150': return <CarbonSnippet />;
    case '151': return <EisenhowerMatrix />;
    case '152': return <ColorBlindnessSimulator />;
    case '153': return <WorldTimePlanner />;
    case '154': return <TailwindToCss />;
    case '155': return <PackageJsonAnalyzer />;
    case '156': return <VoiceTranscription />;
    case '157': return <RadixVisualizer />;
    case '158': return <MermaidEditor />;
    case '159': return <DirectoryTree />;
    case '160': return <FlexboxSim />;
    case '161': return <SvgOptimizer />;
    case '162': return <SmoothShadows />;
    case '163': return <ResponsiveType />;
    case '164': return <OcrReader />;
    case '165': return <BusinessMetrics />;
    case '166': return <VisualJson />;
    case '167': return <MathPlotter />;
    case '168': return <BreathWork />;
    case '169': return <EyeGuard />;
    case '170': return <WaterReminder />;
    case '173':
      return <SqlConverter />;

    // --- IA TOOLS ---
    case '174': return <AiToolWrapper title="IA Client Omnichannel" description="Chat universal compatível com OpenAI, Google Gemini e Anthropic Claude.">{(config) => <IAClientOmnichannel initialProvider={config.provider} initialKey={config.apiKey} />}</AiToolWrapper>;
    case '175': return <AiToolWrapper title="Escritor de Emails IA" description="Gera rascunhos de emails profissionais baseados em contextos rápidos.">{(config) => <GenericAiTool {...config} title="Escritor" instruction="Você é um assistente de escrita de emails profissionais. Escreva um email claro, conciso e com tom adequado." inputPlaceholder="Ex: Pedir aumento ao chefe / Responder convite de palestra..." options={[{label: 'Formal', value: 'formal'}, {label: 'Casual', value: 'casual'}, {label: 'Urgente', value: 'urgent'}]} />}</AiToolWrapper>;
    case '176': return <AiToolWrapper title="Resumidor de Textos" description="Transforma textos longos em resumos concisos e tópicos principais.">{(config) => <GenericAiTool {...config} title="Resumidor" instruction="Resuma o texto a seguir em tópicos principais e um parágrafo de conclusão. Seja direto." inputPlaceholder="Cole o texto longo aqui..." />}</AiToolWrapper>;
    case '177': return <AiToolWrapper title="Gerador de Código IA" description="Gera snippets de código em diversas linguagens a partir de descrições.">{(config) => <GenericAiTool {...config} title="Gerador de Código" isCode instruction="Gera código de alta qualidade baseado na descrição. Retorne APENAS o código." inputPlaceholder="Ex: Uma função em React para ler o localStorage..." options={[{label: 'React', value: 'react'}, {label: 'Python', value: 'python'}, {label: 'TypeScript', value: 'typescript'}]} />}</AiToolWrapper>;
    case '178': return <AiToolWrapper title="Tradutor Inteligente" description="Tradução de alta precisão com ajuste de tom e contexto cultural.">{(config) => <GenericAiTool {...config} title="Tradutor" instruction="Traduza o texto para o idioma selecionado mantendo o contexto." inputPlaceholder="Digite o texto para traduzir..." options={[{label: 'Inglês', value: 'english'}, {label: 'Espanhol', value: 'spanish'}, {label: 'Alemão', value: 'german'}]} />}</AiToolWrapper>;
    case '179': return <AiToolWrapper title="Analisador de Sentimento" description="Detecta o tom emocional de textos (Positivo, Negativo, Neutro).">{(config) => <GenericAiTool {...config} title="Analisador" instruction="Analise o sentimento do texto a seguir. Responda com uma nota de 1 a 10 e uma breve explicação." inputPlaceholder="Cole um feedback ou mensagem aqui..." />}</AiToolWrapper>;
    case '180': return <AiToolWrapper title="SEO Keyword Generator" description="Sugere palavras-chave e otimizações de SEO para seu conteúdo.">{(config) => <GenericAiTool {...config} title="SEO" instruction="Gere uma lista de palavras-chave de cauda longa e estratégias de SEO para o tema." inputPlaceholder="Ex: Loja de sapatos online / Blog de culinária..." />}</AiToolWrapper>;
    case '181': return <AiToolWrapper title="Revisão Gramatical IA" description="Melhora a escrita, corrigindo gramática e sugerindo melhorias de estilo.">{(config) => <GenericAiTool {...config} title="Revisor" instruction="Revise o texto gramaticalmente e sugira 3 melhorias de estilo/fluidez." inputPlaceholder="Cole seu rascunho aqui..." />}</AiToolWrapper>;
    case '182': return <AiToolWrapper title="Gerador de Prompts Art" description="Cria prompts detalhados para ferramentas de IA generativa de imagens.">{(config) => <GenericAiTool {...config} title="Prompts Art" instruction="Transforme a ideia simples do usuário em um prompt detalhado e otimizado especificamente para a ferramenta selecionada. Retorne APENAS o texto do prompt final pronto para uso, sem qualquer introdução, explicação ou formatação extra." inputPlaceholder="Ex: Um astronauta medieval em Marte..." options={[{label: 'Midjourney', value: 'midjourney'}, {label: 'DALL-E 3', value: 'dalle'}, {label: 'Stable Diffusion', value: 'stable-diffusion'}, {label: 'Nano Banana', value: 'nano-banana'}]} />}</AiToolWrapper>;
    case '183': return <AiToolWrapper title="Extrator de Insights" description="Identifica entidades, datas e pontos chave em documentos complexos.">{(config) => <GenericAiTool {...config} title="Extrator" instruction="Extraia nomes, datas, valores monetários e decisões principais deste texto." inputPlaceholder="Cole o conteúdo do documento aqui..." />}</AiToolWrapper>;
    case '184': return <AiToolWrapper title="Gerador de Títulos" description="Cria títulos chamativos para blogs, vídeos e redes sociais.">{(config) => <GenericAiTool {...config} title="Títulos" instruction="Crie 10 opções de títulos chamativos (clickbait ético) para o tema." inputPlaceholder="Assunto do conteúdo..." />}</AiToolWrapper>;
    case '185': return <AiToolWrapper title="Brainstorming Partner" description="Gera ideias criativas e expande conceitos iniciais de projetos.">{(config) => <GenericAiTool {...config} title="Brainstorming" instruction="Seja um parceiro criativo. Pegue a ideia inicial e sugira 5 expansões inovadoras." inputPlaceholder="Ideia do projeto..." />}</AiToolWrapper>;
    case '186': return <AiToolWrapper title="Python Script Helper" description="Ajuda a criar e debugar scripts Python com explicações detalhadas.">{(config) => <GenericAiTool {...config} title="Python Helper" isCode instruction="Ajude com scripts Python. Explique o que o código faz." inputPlaceholder="Descreva o script ou cole o código com erro..." />}</AiToolWrapper>;
    case '187': return <AiToolWrapper title="SQL Query Assistant" description="Transforma perguntas em linguagem natural em queries SQL válidas.">{(config) => <GenericAiTool {...config} title="SQL Assistant" isCode instruction="Transforme a pergunta em uma query SQL válida. Assuma nomes de tabelas padrão se não informados." inputPlaceholder="Ex: Selecionar todos os usuários que compraram no último mês..." />}</AiToolWrapper>;
    case '188': return <AiToolWrapper title="Gerador de RegEx IA" description="Cria expressões regulares complexas a partir de descrições simples.">{(config) => <GenericAiTool {...config} title="Regex IA" isCode instruction="Cria uma RegEx para o padrão descrito e forneça uma breve explicação da lógica." inputPlaceholder="Ex: Validar uma senha com 8 dígitos e um símbolo..." />}</AiToolWrapper>;
    case '189': return <AiToolWrapper title="Explicador de Conceitos" description="Explica temas complexos de forma simples (estilo ELI5).">{(config) => <GenericAiTool {...config} title="ELI5" instruction="Explique este conceito para uma criança de 5 anos (ELI5), use analogias simples." inputPlaceholder="Ex: Como funciona a computação quântica?" />}</AiToolWrapper>;
    case '190': return <AiToolWrapper title="Analisador de Código" description="Revisa seu código em busca de bugs e oportunidades de otimização.">{(config) => <GenericAiTool {...config} title="Analisador" instruction="Revise o código em busca de vulnerabilidades, bugs e problemas de performance." inputPlaceholder="Cole o código aqui..." />}</AiToolWrapper>;
    case '191': return <AiToolWrapper title="Gerador de User Stories" description="Cria histórias de usuário completas para o desenvolvimento ágil.">{(config) => <GenericAiTool {...config} title="Agile" instruction="Crie User Stories no formato 'Como um [papel], eu quero [objetivo] para [benefício]'." inputPlaceholder="Funcionalidade do sistema..." />}</AiToolWrapper>;
    case '192': return <AiToolWrapper title="IA Regex Debugger" description="Explica o que uma expressão regular faz e sugere correções.">{(config) => <GenericAiTool {...config} title="Regex Debug" instruction="Explique o funcionamento da RegEx fornecida e aponte possíveis erros." inputPlaceholder="Cole a RegEx aqui..." />}</AiToolWrapper>;
    case '193': return <AiToolWrapper title="Commit Message IA" description="Gera mensagens de commit seguindo o padrão Conventional Commits.">{(config) => <GenericAiTool {...config} title="Git Commits" instruction="Gere uma mensagem de commit clara seguindo o padrão Conventional Commits baseado no resumo." inputPlaceholder="O que você mudou no código?..." />}</AiToolWrapper>;
    case '194': return <AiToolWrapper title="Readme Generator IA" description="Cria documentação técnica completa para seus repositórios.">{(config) => <GenericAiTool {...config} title="README" instruction="Gere um README.md completo e profissional em Markdown para o projeto." inputPlaceholder="Nome e descrição rápida do projeto..." />}</AiToolWrapper>;
    case '195': return <AiToolWrapper title="Unit Test Generator" description="Sugere casos de teste unitário baseados na lógica do seu código.">{(config) => <GenericAiTool {...config} title="Testes" isCode instruction="Gere casos de teste unitário para o código fornecido. Use Jest/Vitest como padrão." inputPlaceholder="Cole a função ou componente aqui..." />}</AiToolWrapper>;
    case '196': return <WorkflowAutomator />;

    case '999': return <SupportersWall />;

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
    case '101': return <PdfMerger />;
    case '102': return <PdfSplitter />;
    case '103': return <ImageToPdf />;
    case '104': return <PdfToImage />;

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