'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Video, Link as LinkIcon, Download, Copy, Check,
    RefreshCw, Play, Pause, FileText, Sparkles,
    Shield, AlertCircle, Info, Languages, Trash2,
    Settings, Key, Eye, EyeOff, Film, Clock
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
        if (!url) return;
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

    const handleTranscribe = async () => {
        if (!mediaUrl || !apiKey) {
            setError('Por favor, insira uma chave da API do Google Gemini para transcrever via IA.');
            return;
        }

        setIsTranscribing(true);
        setError(null);
        setProgress(0);

        try {
            const client = new GoogleGenAI({ apiKey: apiKey });

            setProgress(20);
            const response = await fetch(mediaUrl);
            const blob = await response.blob();
            setProgress(40);

            const reader = new FileReader();
            const base64Promise = new Promise<string>((resolve) => {
                reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
                reader.readAsDataURL(blob);
            });

            const base64Data = await base64Promise;
            setProgress(60);

            const result = await client.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [
                    {
                        role: 'user',
                        parts: [
                            {
                                inlineData: {
                                    mimeType: blob.type,
                                    data: base64Data
                                }
                            },
                            { text: "Por favor, transcreva o áudio deste vídeo. Retorne apenas a transcrição limpa, formatada em parágrafos se necessário." }
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
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[4px] opacity-40 mb-1">Multimídia</h3>
                    <h2 className="text-3xl font-black italic tracking-tighter">TRANSCRITOR SOCIAL</h2>
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
                        <Settings size={14} />
                    </a>
                </div>
            </div>

            {/* Main Input Area */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-text-main/20 group-focus-within:text-text-main transition-colors">
                    <LinkIcon size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Cole aqui o link do Instagram, TikTok, Facebook, YouTube..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-card-main border border-border-main rounded-[32px] py-6 pl-16 pr-44 text-sm font-bold shadow-2xl focus:ring-4 focus:ring-text-main/5 transition-all outline-none"
                />
                <button
                    onClick={handleExtract}
                    disabled={isExtracting || !url}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-text-main text-bg-main px-8 py-3.5 rounded-[24px] font-black text-xs uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all disabled:opacity-20 flex items-center gap-3 shadow-xl"
                >
                    {isExtracting ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    {isExtracting ? 'Extraindo...' : 'Extrair Vídeo'}
                </button>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold"
                >
                    <AlertCircle size={18} />
                    {error}
                </motion.div>
            )}

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
                                    <RefreshCw size={48} className="animate-spin text-white" />
                                    <Sparkles size={20} className="absolute -top-2 -right-2 text-yellow-500 animate-pulse" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-black text-xl italic tracking-tight">ANALISANDO MÍDIA...</h4>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Isso pode levar alguns segundos dependendo do tamanho</p>
                                </div>
                                <div className="w-full max-w-xs h-1 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-white"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {mediaUrl && (
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={handleTranscribe}
                                disabled={isTranscribing}
                                className="w-full py-6 bg-text-main text-bg-main rounded-[24px] font-black uppercase tracking-[4px] shadow-2xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-4 relative overflow-hidden group/btn"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                                <Languages size={20} /> Transcrever com IA (Gemini)
                            </button>
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
                                    <FileText size={48} className="mb-4" />
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
