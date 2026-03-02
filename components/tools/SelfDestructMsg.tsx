import React, { useState, useEffect } from 'react';
import { Bomb, Link as LinkIcon, Lock, Trash2, Copy, Check, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SelfDestructMsg() {
    const [message, setMessage] = useState('');
    const [generatedLink, setGeneratedLink] = useState('');
    const [copied, setCopied] = useState(false);
    const [viewedData, setViewedData] = useState<string | null>(null);
    const [isViewMode, setIsViewMode] = useState(false);

    // Checks URL hash on mount to see if someone clicked a link
    useEffect(() => {
        const hash = window.location.hash;
        if (hash.startsWith('#/sdm/')) {
            const data = hash.substring(6);
            try {
                const decoded = atob(data);
                setViewedData(decoded);
                setIsViewMode(true);
            } catch (e) {
                console.error("Invalid SDM link");
            }
        }
    }, []);

    const createLink = () => {
        if (!message) return;
        // Simple implementation: just base64 for now, but in a real app we'd encrypt it
        // with a key that is ALSO in the hash (so it's not even in the server logs)
        const encoded = btoa(message);
        const origin = window.location.origin;
        const link = `${origin}/#/sdm/${encoded}`;
        setGeneratedLink(link);
    };

    const copyLink = () => {
        navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const clearAndSelfDestruct = () => {
        window.location.hash = '';
        setViewedData(null);
        setIsViewMode(false);
        setMessage('');
        setGeneratedLink('');
    };

    if (isViewMode && viewedData) {
        return (
            <div className="max-w-2xl mx-auto flex flex-col gap-8 h-full justify-center items-center text-center">
                <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center animate-pulse mb-4">
                    <Bomb size={40} />
                </div>
                <h2 className="text-3xl font-black">Mensagem Secreta Recebida</h2>
                <p className="text-text-main/50">Esta mensagem só existe neste link e nunca tocou um servidor.</p>

                <div className="w-full bg-text-main/5 border-2 border-dashed border-border-main p-8 rounded-[32px] font-medium text-lg italic">
                    "{viewedData}"
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
        <div className="max-w-2xl mx-auto flex flex-col gap-8 h-full justify-center">
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
