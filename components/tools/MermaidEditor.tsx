"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Share2, Play, Download, Copy, Check, Search, AlertTriangle, Code } from 'lucide-react';
import { cn } from '@/lib/utils';
import mermaid from 'mermaid';

// Initialize mermaid
mermaid.initialize({
    startOnLoad: true,
    theme: 'dark',
    securityLevel: 'loose',
    fontFamily: 'Inter, sans-serif',
});

const DEFAULT_CODE = `graph TD
    A[Início] --> B{Decisão}
    B -- Sim --> C[Resultado A]
    B -- Não --> D[Resultado B]
    C --> E[Fim]
    D --> E`;

export function MermaidEditor() {
    const [code, setCode] = useState(DEFAULT_CODE);
    const [svg, setSvg] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);

    const renderDiagram = async (text: string) => {
        if (!text.trim()) {
            setSvg('');
            setError(null);
            return;
        }

        try {
            const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
            const { svg: renderedSvg } = await mermaid.render(id, text);
            setSvg(renderedSvg);
            setError(null);
        } catch (err: any) {
            console.error('Mermaid Render Error:', err);
            // Don't clear SVG on error to keep showing last valid state
            setError('Sintaxe inválida ou diagrama não suportado.');
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            renderDiagram(code);
        }, 500);

        return () => clearTimeout(timer);
    }, [code]);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadSvg = () => {
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'diagrama-mermaid.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-8 h-full flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
                {/* Editor Area */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                            <Code size={14} /> Definição do Diagrama
                        </label>
                        <div className="flex gap-2">
                            <button
                                onClick={handleCopy}
                                className="p-2 bg-text-main/5 hover:bg-text-main/10 rounded-xl transition-all"
                                title="Copiar Código"
                            >
                                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-1 bg-text-main/5 border border-border-main rounded-[32px] p-8 font-mono text-sm resize-none outline-none focus:ring-2 focus:ring-text-main/10 transition-all shadow-inner custom-scrollbar"
                        placeholder="Escreva seu código Mermaid aqui..."
                    />
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 animate-in fade-in slide-in-from-top-2">
                            <AlertTriangle size={18} />
                            <p className="text-xs font-bold leading-tight uppercase tracking-tight">{error}</p>
                        </div>
                    )}
                </div>

                {/* Preview Area */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                            <Search size={14} /> Prévia do Diagrama
                        </label>
                        {svg && (
                            <button
                                onClick={downloadSvg}
                                className="flex items-center gap-2 px-4 py-2 bg-text-main text-bg-main rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
                            >
                                <Download size={14} /> Exportar SVG
                            </button>
                        )}
                    </div>
                    <div className="flex-1 bg-white dark:bg-zinc-950 border border-border-main border-dashed rounded-[40px] flex items-center justify-center overflow-hidden p-8 relative">
                        <div
                            ref={previewRef}
                            className="w-full h-full flex items-center justify-center overflow-auto custom-scrollbar"
                            dangerouslySetInnerHTML={{ __html: svg }}
                        />
                        {!svg && !error && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-10 italic">
                                <Share2 size={64} className="mb-4" />
                                <p className="font-bold">Aguardando definição...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-[32px] flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
                    <Share2 size={20} />
                </div>
                <div className="space-y-0.5">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500">Dica Pro</h4>
                    <p className="text-[10px] font-medium opacity-60 uppercase leading-relaxed tracking-[0.5px]">
                        Você pode usar Mermaid para Fluxogramas, Sequências, Gantt, Diagramas de Classe e muito mais. Tudo renderizado instantaneamente localmente.
                    </p>
                </div>
            </div>
        </div>
    );
}
