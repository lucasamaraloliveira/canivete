'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Share2,
    FileText,
    Download,
    Copy,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Key,
    ExternalLink,
    Eye,
    EyeOff,
    Settings2,
    Check, // Still used for copy confirmation
    Play, // Still used for video player
    Pause, // Still used for video player
    Film, // Still used for no video loaded state
    Clock, // Still used for time display
    Info, // Still used for Gemini note
    Shield, // Still used for privacy section
    Trash2 // Still used for clearing transcript
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GoogleGenAI } from '@google/genai';

interface ExtractionResult {
    url: string;
    filename?: string;
}

export function VideoTranscription() {
    const [url, setUrl] = useState('');
    const [isExtracting, setIsExtracting] = useState(false);
    const [mediaUrl, setMediaUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [transcript, setTranscript] = useState('');
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);

    // Persistence for API Key
    useEffect(() => {
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) setApiKey(savedKey);
    }, []);

    const saveKey = (key: string) => {
        setApiKey(key);
        localStorage.setItem('gemini_api_key', key);
    };

    const handleExtract = async () => {
        if (!url) {
            setError('Por favor, insira um link de vídeo.');
            return;
        }

        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            setError('Para vídeos do YouTube, utilize a ferramenta específica de Transcrição de YouTube.');
            return;
        }
        setIsExtracting(true);
        setError(null);
        setMediaUrl(null);
        setTranscript('');

        try {
            // Usando proxy interno com URL absoluta para evitar problemas de roteamento no navegador
            const response = await fetch(`${window.location.origin}/api/proxy/cobalt`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: url
                })
            });

            const data = await response.json();

            if (data.status === 'stream' || data.status === 'redirect' || data.status === 'tunnel') {
                setMediaUrl(data.url);
            } else if (data.status === 'picker') {
                // Se houver múltiplos arquivos (como um carrossel do Instagram), pegamos o primeiro vídeo
                const firstVideo = data.picker.find((item: any) => item.type === 'video') || data.picker[0];
                setMediaUrl(firstVideo.url);
            } else if (data.status === 'error') {
                throw new Error(data.text || 'Erro ao extrair vídeo.');
            } else {
                throw new Error('Formato de resposta inesperado.');
            }
        } catch (err: any) {
            setError(err.message || 'Falha ao conectar com o serviço de extração.');
            console.error(err);
        } finally {
            setIsExtracting(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setMediaUrl(URL.createObjectURL(file));
            setError(null);
            setTranscript('');
            setUrl('');
        }
    };

    const handleTranscribe = async () => {
        if ((!mediaUrl && !selectedFile) || !apiKey) {
            setError('Chave API do Gemini e um vídeo são necessários.');
            return;
        }

        setIsTranscribing(true);
        setError(null);
        setProgress(0);

        try {
            const client = new GoogleGenAI({ apiKey: apiKey });
            setProgress(10);

            let videoBlob: Blob;
            let mimeType: string;

            if (selectedFile) {
                videoBlob = selectedFile;
                mimeType = selectedFile.type;
            } else {
                const videoResp = await fetch(mediaUrl!);
                videoBlob = await videoResp.blob();
                mimeType = videoBlob.type || 'video/mp4';
            }

            setProgress(30);

            // Converter para Base64
            const reader = new FileReader();
            const base64Promise = new Promise<string>((resolve) => {
                reader.onloadend = () => {
                    const base64 = (reader.result as string).split(',')[1];
                    resolve(base64);
                };
            });
            reader.readAsDataURL(videoBlob);
            const base64Data = await base64Promise;

            setProgress(60);

            const result = await client.models.generateContent({
                model: "gemini-2.0-flash",
                contents: [
                    {
                        role: 'user',
                        parts: [
                            {
                                inlineData: {
                                    mimeType: mimeType || 'video/mp4',
                                    data: base64Data
                                }
                            },
                            {
                                text: "Transcreva este vídeo de rede social na íntegra. Identifique falas importantes e mantenha a pontuação original. Se houver partes em outros idiomas, traduza para o Português."
                            }
                        ]
                    }
                ]
            });

            setProgress(90);
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "Não foi possível gerar a transcrição.";
            setTranscript(text);
            setProgress(100);
        } catch (err: any) {
            setError('Erro na transcrição: ' + (err.message || 'Verifique sua chave ou o tamanho do arquivo.'));
            console.error(err);
        } finally {
            setIsTranscribing(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(transcript);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadTranscript = () => {
        const blob = new Blob([transcript], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transcricao_${new Date().getTime()}.txt`;
        a.click();
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col gap-8 h-full">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Share2 className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Transcrição de Redes Sociais</h2>
                            <p className="text-sm text-zinc-400 font-medium">Extraia texto de vídeos do Instagram, TikTok e Facebook</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-text-main/5 p-2 rounded-2xl border border-border-main/10 backdrop-blur-sm">
                    <div className="p-2 text-text-main/40">
                        <Key size={16} />
                    </div>
                    <div className="relative">
                        <input
                            type={showKey ? "text" : "password"}
                            placeholder="Gemini API Key"
                            value={apiKey}
                            onChange={(e) => saveKey(e.target.value)}
                            className="bg-transparent border-none outline-none text-[10px] font-mono font-bold w-40 lg:w-64 placeholder:opacity-20"
                        />
                        <button
                            onClick={() => setShowKey(!showKey)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 p-1 opacity-20 hover:opacity-100 transition-opacity"
                        >
                            {showKey ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                    </div>
                    <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-text-main text-bg-main rounded-xl hover:scale-105 transition-all"
                        title="Obter chave gratuita"
                    >
                        <Settings2 size={14} />
                    </a>
                </div>
            </div>

            {/* Main Input Area */}
            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 shadow-xl space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-300 ml-1">Extrair via Link</label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <Share2 className="w-5 h-5 text-zinc-500 group-focus-within:text-purple-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Cole o link do Instagram, TikTok ou Facebook aqui..."
                                className="w-full bg-zinc-800/50 border-zinc-700/50 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all font-medium"
                            />
                        </div>
                        <button
                            onClick={handleExtract}
                            disabled={isExtracting || !url}
                            className="bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-purple-900/10 active:scale-95 min-w-[140px] justify-center"
                        >
                            {isExtracting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ExternalLink className="w-5 h-5" />}
                            {isExtracting ? 'Extraindo...' : 'Extrair Vídeo'}
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-zinc-800" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-[#09090b] px-2 text-zinc-500 font-bold tracking-widest">OU</span>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-colors bg-zinc-800/20 group">
                    <input
                        type="file"
                        id="video-upload"
                        className="hidden"
                        accept="video/*,audio/*"
                        onChange={handleFileSelect}
                    />
                    <label
                        htmlFor="video-upload"
                        className="flex flex-col items-center cursor-pointer"
                    >
                        <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Download className="w-6 h-6 text-zinc-400 rotate-180" />
                        </div>
                        <span className="text-sm font-bold text-zinc-300">Escolher arquivo local</span>
                        <span className="text-xs text-zinc-500 mt-1">MP4, MOV, MKV ou áudio (Max 50MB recomendado)</span>
                    </label>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-start gap-3"
                        >
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-sm text-red-200 font-bold tracking-tight">
                                    {error.includes('account to view') || error.includes('auth') || error.includes('jwt')
                                        ? "Acesso bloqueado pela rede social."
                                        : error}
                                </p>
                                <p className="text-xs text-red-300/60 leading-tight">
                                    Dica: Baixe o vídeo manualmente e use a opção <b>Escolher arquivo local</b> acima.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
                {/* Video Player Section */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Visualização do Vídeo</label>
                        {mediaUrl && (
                            <div className="flex items-center gap-2 text-[10px] font-black opacity-30 italic">
                                <Clock size={12} /> {formatTime(currentTime)} / {formatTime(duration)}
                            </div>
                        )}
                    </div>

                    <div className="bg-black rounded-[48px] shadow-2xl overflow-hidden aspect-video relative flex items-center justify-center group ring-1 ring-white/5">
                        {mediaUrl ? (
                            <>
                                <video
                                    ref={videoRef}
                                    src={mediaUrl}
                                    className="w-full h-full object-contain"
                                    onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                                    onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                />
                                <button
                                    onClick={() => isPlaying ? videoRef.current?.pause() : videoRef.current?.play()}
                                    className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                >
                                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                                        {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                                    </div>
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-4 opacity-10">
                                <Film size={64} />
                                <p className="text-xs font-black uppercase tracking-[4px]">Nenhum vídeo carregado</p>
                            </div>
                        )}

                        {isTranscribing && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-6 p-12 text-center text-white">
                                <div className="relative">
                                    <Loader2 size={48} className="animate-spin text-white" />
                                    <CheckCircle2 size={20} className="absolute -top-2 -right-2 text-green-500 animate-pulse" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-black text-xl italic tracking-tight">ANALISANDO MÍDIA...</h4>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Isso pode levar alguns segundos dependendo do tamanho</p>
                                </div>
                                <div className="w-full max-w-xs h-1 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-purple-600 to-purple-400 shadow-[0_0_10px_rgba(147,51,234,0.5)]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-center gap-2 text-purple-400 text-xs font-medium animate-pulse">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Analisando áudio e gerando texto...
                                </div>
                            </div>
                        )}
                    </div>

                    {mediaUrl && (
                        <div className="flex flex-col gap-4">
                            {isTranscribing ? (
                                <div className="w-full py-4 bg-zinc-800/50 rounded-xl flex flex-col items-center justify-center gap-3">
                                    <div className="w-full max-w-xs h-1 bg-zinc-700 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-purple-600 to-purple-400 shadow-[0_0_10px_rgba(147,51,234,0.5)]"
                                        />
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-purple-400 text-xs font-medium animate-pulse">
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        Analisando áudio e gerando texto...
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={handleTranscribe}
                                    disabled={!apiKey}
                                    className="w-full py-4 bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-xl font-black text-lg transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-3"
                                >
                                    <FileText className="w-6 h-6" />
                                    INICIAR TRANSCRIÇÃO
                                </button>
                            )}
                            <div className="p-6 bg-blue-500/5 rounded-[32px] border border-blue-500/10 flex items-start gap-4">
                                <Info size={18} className="text-blue-500 shrink-0 mt-1" />
                                <p className="text-[10px] font-bold text-blue-500/80 uppercase leading-relaxed tracking-wider italic">
                                    Nota: A transcrição via Gemini 1.5 Flash suporta vídeos de longa duração e múltiplos idiomas.
                                    Os dados são processados pela Google AI Studio.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Transcription Section */}
                <div className="flex flex-col gap-6 min-h-0">
                    <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Texto Transcrito</label>
                        <div className="flex gap-2">
                            {transcript && (
                                <>
                                    <button
                                        onClick={handleCopy}
                                        className="p-2.5 bg-text-main/5 hover:bg-text-main/10 rounded-xl transition-all text-text-main"
                                        title="Copiar texto"
                                    >
                                        {copied ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                    <button
                                        onClick={downloadTranscript}
                                        className="p-2.5 bg-text-main/5 hover:bg-text-main/10 rounded-xl transition-all text-text-main"
                                        title="Baixar .txt"
                                    >
                                        <Download size={16} />
                                    </button>
                                    <button
                                        onClick={() => setTranscript('')}
                                        className="p-2.5 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-all text-red-500"
                                        title="Limpar"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 bg-card-main border border-border-main rounded-[48px] shadow-sm flex flex-col overflow-hidden relative group/trans">
                        <div className="absolute inset-0 bg-text-main/[0.01] pointer-events-none" />
                        <div className="flex-1 p-10 overflow-auto custom-scrollbar">
                            {transcript ? (
                                <p className="text-sm font-bold leading-relaxed whitespace-pre-wrap opacity-80 animate-in fade-in slide-in-from-bottom-2">
                                    {transcript}
                                </p>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-10">
                                    <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto">
                                        <Share2 className="w-8 h-8 text-purple-500" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                                        Carregue um vídeo e clique em <br /> Transcrever para ver o resultado aqui.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-6 bg-text-main/5 rounded-[32px] border border-border-main/5 flex gap-4">
                        <div className="w-10 h-10 bg-text-main text-bg-main rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                            <Shield size={20} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-black uppercase tracking-widest">Privacidade</h4>
                            <p className="text-[10px] font-medium opacity-40 uppercase leading-relaxed tracking-wider">
                                Sua chave da API é armazenada localmente. O conteúdo do vídeo é processado apenas para gerar a transcrição e não é armazenado permanentemente por nossa ferramenta.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(var(--text-main-rgb), 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(var(--text-main-rgb), 0.2);
                }
            `}</style>
        </div>
    );
}
