'use client';

import React, { useState } from 'react';
import { Type, Copy, Check, Info, ArrowRight, RotateCcw } from 'lucide-react';

export function CaseConverter() {
    const [input, setInput] = useState('');
    const [copied, setCopied] = useState(false);

    const convert = (type: 'camel' | 'snake' | 'pascal' | 'kebab' | 'upper' | 'lower' | 'title') => {
        if (!input) return;

        let result = '';
        const words = input.trim().split(/[\s_-]+|(?=[A-Z])/).filter(Boolean).map(w => w.toLowerCase());

        switch (type) {
            case 'camel':
                result = words.map((w, i) => i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)).join('');
                break;
            case 'snake':
                result = words.join('_');
                break;
            case 'pascal':
                result = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
                break;
            case 'kebab':
                result = words.join('-');
                break;
            case 'upper':
                result = input.toUpperCase();
                break;
            case 'lower':
                result = input.toLowerCase();
                break;
            case 'title':
                result = input.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
                break;
        }

        setInput(result);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(input);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8 h-full">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-text-main/5 rounded-2xl">
                            <Type size={24} className="text-text-main" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold uppercase tracking-tight">Case Converter</h2>
                            <p className="text-xs opacity-50 font-medium">Transforme a capitalização de strings instantaneamente.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setInput('')}
                        className="p-3 hover:bg-text-main/5 rounded-2xl transition-all opacity-40 hover:opacity-100"
                        title="Limpar"
                    >
                        <RotateCcw size={20} />
                    </button>
                </div>

                <div className="relative group">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Cole seu texto aqui..."
                        className="w-full h-48 p-6 bg-card-main border border-border-main rounded-[32px] font-mono text-lg focus:ring-4 focus:ring-text-main/5 outline-none transition-all resize-none shadow-sm"
                    />
                    <button
                        onClick={copyToClipboard}
                        className="absolute bottom-6 right-6 p-4 bg-text-main text-bg-main rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-2 font-bold text-xs"
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? 'Copiado' : 'Copiar'}
                    </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button onClick={() => convert('camel')} className="p-4 bg-bg-main border border-border-main rounded-2xl hover:bg-text-main hover:text-bg-main transition-all font-bold text-xs uppercase tracking-widest shadow-sm">
                        camelCase
                    </button>
                    <button onClick={() => convert('pascal')} className="p-4 bg-bg-main border border-border-main rounded-2xl hover:bg-text-main hover:text-bg-main transition-all font-bold text-xs uppercase tracking-widest shadow-sm">
                        PascalCase
                    </button>
                    <button onClick={() => convert('snake')} className="p-4 bg-bg-main border border-border-main rounded-2xl hover:bg-text-main hover:text-bg-main transition-all font-bold text-xs uppercase tracking-widest shadow-sm">
                        snake_case
                    </button>
                    <button onClick={() => convert('kebab')} className="p-4 bg-bg-main border border-border-main rounded-2xl hover:bg-text-main hover:text-bg-main transition-all font-bold text-xs uppercase tracking-widest shadow-sm">
                        kebab-case
                    </button>
                    <button onClick={() => convert('upper')} className="p-4 bg-bg-main border border-border-main rounded-2xl hover:bg-text-main hover:text-bg-main transition-all font-bold text-xs uppercase tracking-widest shadow-sm">
                        UPPERCASE
                    </button>
                    <button onClick={() => convert('lower')} className="p-4 bg-bg-main border border-border-main rounded-2xl hover:bg-text-main hover:text-bg-main transition-all font-bold text-xs uppercase tracking-widest shadow-sm">
                        lowercase
                    </button>
                    <button onClick={() => convert('title')} className="p-4 bg-bg-main border border-border-main rounded-2xl hover:bg-text-main hover:text-bg-main transition-all font-bold text-xs uppercase tracking-widest shadow-sm">
                        Title Case
                    </button>
                </div>
            </div>

            <div className="p-6 bg-text-main/5 rounded-[32px] border border-border-main/5 flex items-start gap-4">
                <Info className="text-text-main/40 shrink-0 mt-1" size={20} />
                <div className="space-y-2">
                    <p className="text-sm font-medium leading-relaxed opacity-60">
                        O **Case Converter** detecta automaticamente separadores como espaços, underlines e hifens, além de CamelCase, para normalizar e converter seu texto para diversos padrões de programação e escrita.
                    </p>
                </div>
            </div>
        </div>
    );
}
