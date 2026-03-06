"use client";

import React, { useState, useMemo } from 'react';
import { Wind, Code2, ArrowRight, Copy, Check, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';

const TAILWIND_MAP: Record<string, string> = {
    // Layout
    'flex': 'display: flex;',
    'grid': 'display: grid;',
    'hidden': 'display: none;',
    'block': 'display: block;',
    'inline-block': 'display: inline-block;',
    // Spacing
    'p-0': 'padding: 0px;',
    'p-1': 'padding: 0.25rem; /* 4px */',
    'p-2': 'padding: 0.5rem; /* 8px */',
    'p-4': 'padding: 1rem; /* 16px */',
    'p-8': 'padding: 2rem; /* 32px */',
    'm-0': 'margin: 0px;',
    'm-2': 'margin: 0.5rem;',
    'm-4': 'margin: 1rem;',
    // Colors
    'text-white': 'color: #ffffff;',
    'text-black': 'color: #000000;',
    'bg-white': 'background-color: #ffffff;',
    'bg-black': 'background-color: #000000;',
    // Flexbox
    'items-center': 'align-items: center;',
    'justify-center': 'justify-content: center;',
    'flex-col': 'flex-direction: column;',
    // Misc
    'rounded-xl': 'border-radius: 0.75rem;',
    'rounded-2xl': 'border-radius: 1rem;',
    'shadow-xl': 'box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);',
    'border': 'border-width: 1px;'
};

export function TailwindToCss() {
    const [input, setInput] = useState('flex items-center justify-center p-4 bg-white rounded-xl shadow-xl');
    const [copied, setCopied] = useState(false);

    const cssOutput = useMemo(() => {
        const classes = input.split(/\s+/);
        const rules = classes.map(cls => {
            if (TAILWIND_MAP[cls]) return `  ${TAILWIND_MAP[cls]}`;

            // Basic dynamic handling for colors like text-blue-500
            if (cls.startsWith('text-') || cls.startsWith('bg-')) {
                return `  /* Dynamic color ${cls} */`;
            }

            return `  /* Unknown: ${cls} */`;
        });
        return `.custom-class {\n${rules.join('\n')}\n}`;
    }, [input]);

    const handleCopy = () => {
        navigator.clipboard.writeText(cssOutput);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8 flex flex-col h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
                <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                        <Wind size={14} /> Classes Tailwind
                    </label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 bg-text-main/5 border border-border-main rounded-[24px] p-6 font-mono text-sm resize-none outline-none focus:ring-2 focus:ring-text-main/10 transition-all"
                        placeholder="Ex: flex items-center p-4 bg-blue-500..."
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                            <Code2 size={14} /> CSS Resultante
                        </label>
                        <button
                            onClick={handleCopy}
                            className="bg-text-main text-bg-main px-4 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-2"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? 'Copiado' : 'Copiar'}
                        </button>
                    </div>
                    <div className="flex-1 bg-text-main/[0.02] border border-border-main border-dashed rounded-[24px] overflow-hidden font-mono text-sm relative">
                        <SyntaxHighlighter
                            language="css"
                            style={vscDarkPlus}
                            customStyle={{
                                margin: 0,
                                padding: '24px',
                                height: '100%',
                                background: 'transparent'
                            }}
                        >
                            {cssOutput}
                        </SyntaxHighlighter>
                    </div>
                </div>
            </div>

            <div className="bg-text-main/5 p-6 rounded-[32px] border border-border-main/10 flex items-center gap-6">
                <div className="w-12 h-12 bg-text-main text-bg-main rounded-2xl flex items-center justify-center shrink-0">
                    <ArrowRight size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-sm">Tradução Instantânea</h4>
                    <p className="text-xs opacity-60 leading-relaxed italic">
                        Esta ferramenta mapeia classes do Tailwind para propriedades CSS tradicionais.
                        Ideal para quem está migrando projetos ou quer entender melhor como o Tailwind funciona por baixo do capô.
                    </p>
                </div>
            </div>
        </div>
    );
}
