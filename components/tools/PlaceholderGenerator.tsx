'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Square, Copy, Check, Download, RefreshCw, Type, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PlaceholderGenerator() {
    const [width, setWidth] = useState(800);
    const [height, setHeight] = useState(450);
    const [text, setText] = useState('');
    const [bgColor, setBgColor] = useState('#2563eb');
    const [textColor, setTextColor] = useState('#ffffff');
    const [fontSize, setFontSize] = useState(48);
    const [copied, setCopied] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set dimensions
        canvas.width = width;
        canvas.height = height;

        // Background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);

        // Text
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;

        const displayText = text || `${width} x ${height}`;
        ctx.fillText(displayText, width / 2, height / 2);
    };

    useEffect(() => {
        draw();
    }, [width, height, text, bgColor, textColor, fontSize]);

    const download = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `placeholder-${width}x${height}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    const copyAsBase64 = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        navigator.clipboard.writeText(canvas.toDataURL('image/png'));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-0">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Configuração do Placeholder</label>
                    <button
                        onClick={() => {
                            setWidth(800); setHeight(450); setText(''); setBgColor('#2563eb'); setTextColor('#ffffff'); setFontSize(48);
                        }}
                        className="p-2 hover:bg-text-main/5 rounded-xl transition-all text-text-main/40 hover:text-text-main"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>

                <div className="space-y-4 bg-card-main border border-border-main p-6 rounded-[32px] shadow-sm overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-30">Largura (px)</label>
                            <input type="number" value={width} onChange={(e) => setWidth(parseInt(e.target.value) || 0)} className="w-full p-3 bg-text-main/5 border border-border-main rounded-xl font-bold outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-30">Altura (px)</label>
                            <input type="number" value={height} onChange={(e) => setHeight(parseInt(e.target.value) || 0)} className="w-full p-3 bg-text-main/5 border border-border-main rounded-xl font-bold outline-none" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-30">Texto Customizado</label>
                        <input
                            type="text" value={text} onChange={(e) => setText(e.target.value)}
                            placeholder={`${width} x ${height}`}
                            className="w-full p-3 bg-text-main/5 border border-border-main rounded-xl font-bold outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-30">Cor de Fundo</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 border-none bg-transparent cursor-pointer" />
                                <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="flex-1 p-2 bg-text-main/5 border border-border-main rounded-lg font-mono text-xs" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-30">Cor do Texto</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-10 h-10 border-none bg-transparent cursor-pointer" />
                                <input type="text" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="flex-1 p-2 bg-text-main/5 border border-border-main rounded-lg font-mono text-xs" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-30">Tamanho da Fonte ({fontSize}px)</label>
                        <input type="range" min="10" max="200" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={copyAsBase64}
                        className="flex items-center justify-center gap-2 py-4 bg-text-main/5 hover:bg-text-main/10 rounded-2xl font-bold text-sm transition-all text-text-main"
                    >
                        {copied ? <Check size={18} /> : <Copy size={18} />} {copied ? 'Copiado!' : 'Copiar Base64'}
                    </button>
                    <button
                        onClick={download}
                        className="flex items-center justify-center gap-2 py-4 bg-text-main text-bg-main rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all"
                    >
                        <Download size={18} /> Baixar PNG
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Preview da Imagem</label>
                <div className="flex-1 min-h-[400px] bg-bg-main border border-border-main border-dashed border-2 rounded-[40px] shadow-inner relative flex items-center justify-center p-8 overflow-hidden bg-grid-pattern">
                    <div className="max-w-full max-h-full shadow-2xl rounded-lg overflow-hidden animate-in zoom-in-95 duration-500">
                        <canvas ref={canvasRef} className="max-w-full h-auto block" />
                    </div>
                </div>
                <div className="p-4 bg-blue-500/5 rounded-[24px] flex items-center gap-4 text-blue-600/60 text-xs italic border border-blue-500/10">
                    <Square size={16} className="shrink-0" />
                    <p>Gerado localmente no seu navegador usando Canvas API. Sem requisições externas para serviços como placeholder.com.</p>
                </div>
            </div>
        </div>
    );
}
