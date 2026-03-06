"use client";

import React, { useState, useCallback } from 'react';
import { FileCode, Download, Trash2, Copy, Check, Upload, AlertCircle, RefreshCw, Zap, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

import { CodeBlock } from '../CodeBlock';

export function SvgOptimizer() {
    const [original, setOriginal] = useState('');
    const [optimized, setOptimized] = useState('');
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const optimizeSvg = (svg: string) => {
        setIsOptimizing(true);
        setError(null);

        try {
            let result = svg;

            // Remove comments
            result = result.replace(/<!--[\s\S]*?-->/g, '');
            // Remove metadata
            result = result.replace(/<metadata[\s\S]*?<\/metadata>/g, '');
            // Remove title/desc
            result = result.replace(/<(title|desc)[\s\S]*?<\/\1>/g, '');
            // Remove namespaces and proprietary attributes
            result = result.replace(/\sxmlns:[\w-]+="[^"]*"/g, '');
            result = result.replace(/\s(inkscape|sodipodi):[\w-]+="[^"]*"/g, '');
            result = result.replace(/\s(sketch|adobe):[\w-]+="[^"]*"/g, '');
            // Remove unnecessary IDs and classes (careful here)
            // result = result.replace(/\sid="[^"]*"/g, '');
            // Remove empty groups
            result = result.replace(/<g[^>]*>\s*<\/g>/g, '');
            // Remove leading/trailing whitespace
            result = result.trim();
            // Collapse whitespace
            result = result.replace(/\s+/g, ' ');
            // Remove space before closing tag
            result = result.replace(/\s+\/>/g, '/>');

            setOptimized(result);
        } catch (err) {
            setError('Falha ao processar o SVG. Certifique-se de que é um formato válido.');
        } finally {
            setIsOptimizing(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            setOriginal(content);
            optimizeSvg(content);
        };
        reader.readAsText(file);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(optimized);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadSvg = () => {
        const blob = new Blob([optimized], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'optimized.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const savings = original.length > 0 ? (((original.length - optimized.length) / original.length) * 100).toFixed(1) : 0;

    return (
        <div className="space-y-8 flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
                {/* Input Area */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                            <Upload size={14} /> Entrada SVG
                        </label>
                        <input
                            type="file"
                            accept=".svg"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="svg-upload"
                        />
                        <label
                            htmlFor="svg-upload"
                            className="px-4 py-2 bg-text-main/5 hover:bg-text-main/10 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all border border-border-main/20"
                        >
                            Carregar Arquivo
                        </label>
                    </div>
                    <textarea
                        value={original}
                        onChange={(e) => {
                            setOriginal(e.target.value);
                            optimizeSvg(e.target.value);
                        }}
                        className="flex-1 min-h-[400px] bg-text-main/5 border border-border-main rounded-[32px] p-8 font-mono text-sm resize-none outline-none focus:ring-2 focus:ring-text-main/10 transition-all shadow-inner custom-scrollbar"
                        placeholder="Cole o código SVG aqui..."
                    />
                </div>

                {/* Output Area */}
                <div className="flex flex-col gap-4 relative">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                                <Zap size={14} /> Resultado Otimizado
                            </label>
                            {Number(savings) > 0 && (
                                <div className="px-3 py-1 bg-green-500 text-white rounded-full text-[10px] font-black animate-in zoom-in-50 duration-500">
                                    -{savings}% ECONOMIA
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            {optimized && (
                                <>
                                    <button
                                        onClick={handleCopy}
                                        className="p-3 bg-text-main/5 hover:bg-text-main/10 rounded-2xl transition-all"
                                        title="Copiar Código"
                                    >
                                        {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                    </button>
                                    <button
                                        onClick={downloadSvg}
                                        className="flex items-center gap-2 px-6 py-2 bg-text-main text-bg-main rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
                                    >
                                        <Download size={14} /> Baixar
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 min-h-[400px] bg-[#0D0D0D] border border-border-main/5 rounded-[40px] overflow-hidden relative group shadow-2xl">
                        <div className="h-full overflow-auto custom-scrollbar">
                            {optimized ? (
                                <CodeBlock code={optimized} language="xml" />
                            ) : (
                                <div className="h-full flex items-center justify-center opacity-10 italic">
                                    <p className="font-bold">O código otimizado aparecerá aqui...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className="p-8 bg-text-main text-bg-main rounded-[40px] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-14 h-14 bg-bg-main text-text-main rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-all">
                        <Zap size={28} />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg leading-tight">Limpeza de Código</h4>
                        <p className="text-xs opacity-60 italic leading-snug">
                            Remove metadados de editores como Illustrator e Inkscape sem perder a qualidade visual.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1 relative z-10 text-right">
                    <p className="text-[10px] font-black uppercase tracking-[3px] opacity-40 leading-tight">Performance e</p>
                    <p className="text-3xl font-black leading-tight italic tracking-tighter uppercase whitespace-nowrap">Velocidade</p>
                </div>
            </div>
        </div>
    );
}
