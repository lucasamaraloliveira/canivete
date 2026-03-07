'use client';

import React, { useState, useEffect } from 'react';
import {
    Youtube,
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
    Settings2
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function YoutubeTranscription() {
    const [url, setUrl] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [showApiKey, setShowApiKey] = useState(false);
    const [isExtracting, setIsExtracting] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [mediaUrl, setMediaUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    // Carregar chave da API do localStorage ao iniciar
    useEffect(() => {
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) setApiKey(savedKey);
    }, []);

    // Salvar chave da API ao digitar
    const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setApiKey(value);
        localStorage.setItem('gemini_api_key', value);
    };

    const handleExtract = async () => {
        if (!url || !url.includes('youtube.com') && !url.includes('youtu.be')) {
            setError('Por favor, insira um link válido do YouTube.');
            return;
        }

        setIsExtracting(true);
        setError(null);
        setMediaUrl(null);
        setTranscript('');

        try {
            // Usando o proxy interno otimizado para extração
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
                // Se houver múltiplos arquivos (como um vídeo com áudio separado), pegamos o primeiro vídeo
                const firstVideo = data.picker.find((item: any) => item.type === 'video') || data.picker[0];
                setMediaUrl(firstVideo.url);
            } else if (data.status === 'error') {
                throw new Error(data.text || 'Erro ao extrair vídeo do YouTube.');
            } else {
                throw new Error('Não foi possível obter o fluxo de vídeo.');
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
            setUrl(''); // Limpa a URL se escolheu arquivo
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

            // Verificar tamanho (limite Gemini é generoso, mas vamos avisar)
            if (videoBlob.size > 20 * 1024 * 1024) {
                console.warn('Vídeo grande, a transcrição pode demorar.');
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
                model: "gemini-2.5-flash", // Usando a versão estável 2.0
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
                                text: "Transcreva este vídeo na íntegra. Identifique os falantes se possível e mantenha a pontuação original. Se houver partes em outros idiomas, traduza para o Português."
                            }
                        ]
                    }
                ]
            });

            setProgress(90);

            const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text;

            if (responseText) {
                setTranscript(responseText);
                setProgress(100);
            } else {
                throw new Error('A IA não retornou texto. O vídeo pode estar mudo ou protegido.');
            }

        } catch (err: any) {
            setError(err.message || 'Erro durante a transcrição via IA.');
            console.error(err);
        } finally {
            setIsTranscribing(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(transcript);
    };

    const downloadTranscript = () => {
        const blob = new Blob([transcript], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transcricao-youtube-${new Date().getTime()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header com API Key */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                        <Youtube className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Transcrição de YouTube</h2>
                        <p className="text-sm text-zinc-400 font-medium">Extraia texto de qualquer vídeo via IA</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-zinc-800/50 p-1.5 rounded-lg border border-zinc-700/50 min-w-[300px]">
                    <Key className="w-4 h-4 text-zinc-500 ml-2" />
                    <input
                        type={showApiKey ? "text" : "password"}
                        value={apiKey}
                        onChange={handleApiKeyChange}
                        placeholder="Google Gemini API Key..."
                        className="bg-transparent border-none focus:ring-0 text-xs text-white placeholder:text-zinc-600 w-full"
                    />
                    <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="p-1 hover:bg-zinc-700 rounded transition-colors text-zinc-400"
                    >
                        {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 hover:bg-zinc-700 rounded transition-colors text-zinc-400 title='Obter Chave Grátis'"
                    >
                        <Settings2 size={14} />
                    </a>
                </div>
            </div>

            {/* Input de URL e Upload */}
            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 shadow-xl space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-300 ml-1">Extrair via Link</label>
                    <div className="flex gap-2">
                        <div className="relative flex-1 group">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <Youtube className="w-5 h-5 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Cole o link do vídeo do YouTube aqui..."
                                className="w-full bg-zinc-800/50 border-zinc-700/50 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:border-red-500/50 focus:ring-red-500/20 transition-all font-medium"
                            />
                        </div>
                        <button
                            onClick={handleExtract}
                            disabled={isExtracting || !url}
                            className="bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-red-900/10 active:scale-95 min-w-[140px] justify-center"
                        >
                            {isExtracting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Analisar'}
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
                        id="file-upload"
                        className="hidden"
                        accept="video/*,audio/*"
                        onChange={handleFileSelect}
                    />
                    <label
                        htmlFor="file-upload"
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
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                        >
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <div className="space-y-2">
                                <p className="text-sm text-red-200 font-medium">
                                    {error.includes('account to view')
                                        ? "Este vídeo exige login ou tem restrição de idade (bloqueado pelo YouTube)."
                                        : error}
                                </p>
                                {error.includes('account') && (
                                    <p className="text-xs text-red-300/80">
                                        Dica: Baixe o vídeo manualmente e faça o <b>Upload de Arquivo Local</b> acima para transcrever.
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Player e Ação de Transcrição */}
            <AnimatePresence>
                {mediaUrl && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid md:grid-cols-2 gap-6"
                    >
                        <div className="bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl relative aspect-video group">
                            <video
                                src={mediaUrl}
                                controls
                                className="w-full h-full object-contain"
                            />
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="bg-red-600 text-[10px] font-bold px-2 py-1 rounded text-white uppercase tracking-wider">
                                    HD Extract
                                </span>
                            </div>
                        </div>

                        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 flex flex-col justify-center items-center text-center space-y-6">
                            <div className="space-y-2">
                                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                                    <Youtube className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Vídeo Carregado</h3>
                                <p className="text-sm text-zinc-400">Tudo pronto para a transcrição via inteligência artificial.</p>
                            </div>

                            <div className="w-full space-y-4">
                                {isTranscribing ? (
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">
                                            <span>Processando com IA</span>
                                            <span>{progress}%</span>
                                        </div>
                                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700/50">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                className="h-full bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                                            />
                                        </div>
                                        <div className="flex items-center justify-center gap-2 text-red-400 text-xs font-medium animate-pulse">
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
                                {!apiKey && (
                                    <p className="text-[10px] text-red-400 font-bold uppercase tracking-tighter">
                                        * Insira sua Gemini API Key no topo para prosseguir
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Resultado da Transcrição */}
            <AnimatePresence>
                {transcript && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-zinc-900/50 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl"
                    >
                        <div className="p-4 bg-zinc-800/50 border-b border-zinc-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                <span className="font-bold text-white uppercase text-xs tracking-widest">Transcrição Completa</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={copyToClipboard}
                                    className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-400 transition-colors flex items-center gap-2 text-xs font-bold"
                                    title="Copiar texto"
                                >
                                    <Copy size={16} />
                                    COPIAR
                                </button>
                                <button
                                    onClick={downloadTranscript}
                                    className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-400 transition-colors flex items-center gap-2 text-xs font-bold"
                                    title="Baixar .txt"
                                >
                                    <Download size={16} />
                                    BAIXAR
                                </button>
                            </div>
                        </div>
                        <div className="p-8 max-h-[600px] overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-950/5 via-zinc-900/50 to-zinc-900/50">
                            <p className="text-zinc-200 leading-relaxed whitespace-pre-wrap font-medium selection:bg-red-500/30">
                                {transcript}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                <div className="text-sm text-blue-200/80 leading-relaxed">
                    <p className="font-bold text-blue-400 mb-1">Dica de Uso:</p>
                    Esta ferramenta usa o modelo **Gemini 2.0 Flash** para analisar o conteúdo visual e auditivo do vídeo. Se o vídeo possuir legendas oficiais do YouTube, recomendo usá-las para textos técnicos. O tempo de processamento varia conforme a duração do vídeo.
                </div>
            </div>
        </div>
    );
}
