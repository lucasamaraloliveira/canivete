'use client';

import React, { useState } from 'react';
import { Type, Copy, Check, Trash2, Info, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

const BRAILLE_MAP: Record<string, string> = {
    'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑', 'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
    'k': '⠇', 'l': '⠸', 'm': '⠵', 'n': '⠝', 'o': '⠕', 'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
    'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽', 'z': '⠵',
    '1': '⠼⠁', '2': '⠼⠃', '3': '⠼⠉', '4': '⠼⠙', '5': '⠼⠑', '6': '⠼⠋', '7': '⠼⠛', '8': '⠼⠓', '9': '⠼⠊', '0': '⠼⠚',
    ' ': ' ', '.': '⠲', ',': '⠂', ';': '⠆', ':': '⠒', '!': '⠖', '?': '⠦', '"': '⠦', '(': '⠦', ')': '⠴', '-': '⠤'
};

export function BrailleTranslator() {
    const [text, setText] = useState('');
    const [copied, setCopied] = useState(false);

    const translateToBraille = (input: string) => {
        return input.toLowerCase().split('').map(char => BRAILLE_MAP[char] || char).join('');
    };

    const braille = translateToBraille(text);

    const copyBraille = () => {
        navigator.clipboard.writeText(braille);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold mb-1">Tradutor de Braille</h3>
                    <p className="text-sm opacity-50 font-medium">Conversão instantânea de texto para o sistema Braille de 6 pontos.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[400px]">
                <div className="flex flex-col gap-4 min-h-[300px]">
                    <label className="text-[10px] font-black uppercase tracking-[3px] opacity-30 flex items-center gap-2">
                        <Type size={12} /> Texto Comum
                    </label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Digite aqui para traduzir..."
                        className="w-full h-full bg-text-main/5 border border-border-main p-8 rounded-[40px] shadow-inner outline-none focus:ring-4 focus:ring-text-main/5 transition-all resize-none text-xl font-medium placeholder:opacity-20 custom-scrollbar min-h-[200px]"
                    />
                </div>

                <div className="flex flex-col gap-4 min-h-[300px]">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black uppercase tracking-[3px] opacity-30 flex items-center gap-2">
                            <Eye size={12} /> Resultado em Braille
                        </label>
                        <button
                            onClick={copyBraille}
                            disabled={!braille}
                            className="p-3 bg-text-main/5 hover:bg-text-main hover:text-bg-main rounded-xl transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copiado' : 'Copiar'}
                        </button>
                    </div>
                    <div className="flex-1 bg-card-main border border-border-main p-8 rounded-[40px] shadow-sm relative overflow-hidden group min-h-[200px]">
                        <div className="h-full flex flex-col justify-center text-5xl leading-relaxed text-text-main font-mono overflow-auto custom-scrollbar break-all text-center">
                            {braille || <span className="opacity-0">⠃⠗⠁⠊⠇⠇⠑</span>}
                        </div>
                        {!text && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-text-main/5 pointer-events-none">
                                <span className="text-9xl">⠃⠗</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-text-main/5 border border-border-main/10 p-8 rounded-[40px] flex items-start gap-6">
                <div className="w-12 h-12 bg-text-main text-bg-main rounded-2xl flex items-center justify-center shrink-0">
                    <Info size={24} />
                </div>
                <div>
                    <h4 className="text-xs font-black uppercase tracking-widest mb-2">Sobre o Louis Braille</h4>
                    <p className="text-xs font-medium opacity-40 leading-relaxed uppercase tracking-wider">
                        Criado em 1824, o sistema usa células de 6 pontos em diferentes posições. Esta ferramenta mapeia caracteres latinos básicos para glifos Braille Unicode padrão.
                    </p>
                </div>
            </div>
        </div>
    );
}
