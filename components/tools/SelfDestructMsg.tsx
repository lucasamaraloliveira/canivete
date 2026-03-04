import React, { useState, useEffect } from 'react';
import { Bomb, Link as LinkIcon, Lock, Trash2, Copy, Check, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SelfDestructMsg() {
    const [message, setMessage] = useState('');
    const [generatedLink, setGeneratedLink] = useState('');
    const [copied, setCopied] = useState(false);
    const [viewedData, setViewedData] = useState<string | null>(null);
    const [isViewMode, setIsViewMode] = useState(false);

    const [timeLeft, setTimeLeft] = useState(60);

    const [isExpired, setIsExpired] = useState(false);

    // Checks URL hash on mount to see if someone clicked a link
    useEffect(() => {
        const hash = window.location.hash;
        if (hash.startsWith('#/sdm/')) {
            const data = hash.substring(6);

            // Check if this specific hash was already "burned" in this browser
            const burnedHashes = JSON.parse(localStorage.getItem('canivete_burned_sdm') || '[]');
            if (burnedHashes.includes(data)) {
                setIsExpired(true);
                setIsViewMode(true);
                return;
            }

            try {
                const decoded = atob(data);
                setViewedData(decoded);
                setIsViewMode(true);
            } catch (e) {
                console.error("Invalid SDM link");
            }
        }
    }, []);

    // Timer effect for auto-destruction
    useEffect(() => {
        if (isViewMode && viewedData && timeLeft > 0 && !isExpired) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (isViewMode && viewedData && timeLeft === 0 && !isExpired) {
            burnCurrentHash();
        }
    }, [isViewMode, viewedData, timeLeft, isExpired]);

    const burnCurrentHash = () => {
        const hash = window.location.hash;
        if (hash.startsWith('#/sdm/')) {
            const data = hash.substring(6);
            const burnedHashes = JSON.parse(localStorage.getItem('canivete_burned_sdm') || '[]');
            if (!burnedHashes.includes(data)) {
                burnedHashes.push(data);
                localStorage.setItem('canivete_burned_sdm', JSON.stringify(burnedHashes));
            }
        }
        setIsExpired(true);
        window.location.hash = '';
    };

    const createLink = () => {
        if (!message) return;
        const encoded = btoa(message);
        const origin = "https://canivete.vercel.app";
        const link = `${origin}/#/sdm/${encoded}`;
        setGeneratedLink(link);
    };

    const copyLink = () => {
        navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const clearAndSelfDestruct = () => {
        burnCurrentHash();
        setViewedData(null);
        setIsViewMode(false);
        setMessage('');
        setGeneratedLink('');
        setTimeLeft(60);
        setIsExpired(false);
    };

    if (isViewMode && isExpired) {
        return (
            <div className="max-w-2xl mx-auto flex flex-col gap-8 py-10 lg:py-16 items-center text-center animate-in fade-in duration-700">
                <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-[40px] flex items-center justify-center mb-4">
                    <Trash2 size={48} />
                </div>
                <h2 className="text-4xl font-black text-red-500">Link Indisponível</h2>
                <p className="text-text-main/60 max-w-sm">Esta mensagem foi auto-destruída e não pode mais ser acessada neste dispositivo.</p>
                <button
                    onClick={() => {
                        window.location.hash = '';
                        window.location.reload();
                    }}
                    className="mt-6 px-8 py-4 bg-text-main text-bg-main rounded-2xl font-bold"
                >
                    Voltar ao Início
                </button>
            </div>
        );
    }

    if (isViewMode && viewedData) {
        return (
            <div className="max-w-2xl mx-auto flex flex-col gap-8 py-10 lg:py-16 items-center text-center">
                <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center animate-pulse mb-4 relative">
                    <Bomb size={40} />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-xs">
                        {timeLeft}
                    </div>
                </div>
                <h2 className="text-3xl font-black">Mensagem Secreta Recebida</h2>
                <p className="text-text-main/50">Esta mensagem se auto-destruirá em {timeLeft} segundos.</p>

                <div className="w-full bg-text-main/5 border-2 border-dashed border-border-main p-8 rounded-[32px] font-medium text-lg italic animate-in fade-in zoom-in-95 duration-500">
                    "{viewedData}"
                </div>

                <div className="w-full bg-red-500/5 h-2 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-red-500 transition-all duration-1000 ease-linear"
                        style={{ width: `${(timeLeft / 60) * 100}%` }}
                    />
                </div>

                <button
                    onClick={clearAndSelfDestruct}
                    className="px-8 py-4 bg-red-500 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-red-600 transition-colors"
                >
                    <Trash2 size={20} /> Destruir Agora
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto flex flex-col gap-8 py-10 lg:py-16">
            <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Bomb size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Self-Destruct Message</h3>
                <p className="text-text-main/50">Crie links que contém a mensagem criptografada diretamente na URL Hash.</p>
            </div>

            <div className="bg-bg-main p-8 rounded-[40px] border border-border-main space-y-6 shadow-xl">
                <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider opacity-40">Sua Mensagem Secreta</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full p-6 text-lg bg-text-main/5 border border-border-main rounded-3xl focus:ring-2 focus:ring-text-main/10 outline-none resize-none min-h-[150px]"
                            placeholder="Escreva algo confidencial..."
                        />
                    </div>

                    {!generatedLink ? (
                        <button
                            onClick={createLink}
                            disabled={!message}
                            className="w-full py-4 bg-text-main text-bg-main rounded-2xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-30"
                        >
                            <Lock size={20} /> Gerar Link Seguro
                        </button>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-wider opacity-40">Link Gerado (Envie para o destinatário)</label>
                                <div className="flex gap-2">
                                    <div className="flex-1 bg-text-main/5 p-4 rounded-xl font-mono text-sm break-all border border-border-main truncate">
                                        {generatedLink}
                                    </div>
                                    <button
                                        onClick={copyLink}
                                        className="px-4 bg-text-main text-bg-main rounded-xl font-bold flex items-center gap-2"
                                    >
                                        {copied ? <Check size={18} /> : <Copy size={18} />}
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => setGeneratedLink('')}
                                className="w-full py-3 text-sm font-bold opacity-40 hover:opacity-100 transition-opacity"
                            >
                                Criar outra mensagem
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6 bg-text-main/5 border border-border-main rounded-3xl">
                <h4 className="text-sm font-bold mb-2 uppercase tracking-wider opacity-60">Privacidade Total</h4>
                <p className="text-xs leading-relaxed opacity-50">
                    As mensagens são armazenadas no fragmento da URL (`#`). Os navegadores não enviam essa parte para o servidor,
                    o que significa que o host do site nunca sabe o que você escreveu. O link é a única chave.
                </p>
            </div>
        </div>
    );
}
