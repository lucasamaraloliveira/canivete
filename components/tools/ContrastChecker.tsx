"use client";

import React, { useState, useMemo } from 'react';
import { Check, X, Info, RotateCcw, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ContrastChecker() {
    const [foreground, setForeground] = useState('#ffffff');
    const [background, setBackground] = useState('#4f46e5');

    const hexToRgb = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return [r, g, b].map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
    };

    const getLuminance = (rgb: number[]) => 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];

    const contrastRatio = useMemo(() => {
        const l1 = getLuminance(hexToRgb(foreground));
        const l2 = getLuminance(hexToRgb(background));
        const brightest = Math.max(l1, l2);
        const darkest = Math.min(l1, l2);
        return (brightest + 0.05) / (darkest + 0.05);
    }, [foreground, background]);

    const results = {
        aaNormal: contrastRatio >= 4.5,
        aaLarge: contrastRatio >= 3,
        aaaNormal: contrastRatio >= 7,
        aaaLarge: contrastRatio >= 4.5
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <label className="block text-sm font-bold uppercase tracking-widest opacity-60">Cor do Texto</label>
                    <div className="flex gap-3">
                        <input
                            type="color"
                            value={foreground}
                            onChange={(e) => setForeground(e.target.value)}
                            className="w-16 h-16 rounded-2xl cursor-pointer border-none bg-transparent"
                        />
                        <input
                            type="text"
                            value={foreground}
                            onChange={(e) => setForeground(e.target.value)}
                            className="flex-1 bg-text-main/5 border border-border-main rounded-2xl px-6 font-mono font-bold"
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    <label className="block text-sm font-bold uppercase tracking-widest opacity-60">Cor do Fundo</label>
                    <div className="flex gap-3">
                        <input
                            type="color"
                            value={background}
                            onChange={(e) => setBackground(e.target.value)}
                            className="w-16 h-16 rounded-2xl cursor-pointer border-none bg-transparent"
                        />
                        <input
                            type="text"
                            value={background}
                            onChange={(e) => setBackground(e.target.value)}
                            className="flex-1 bg-text-main/5 border border-border-main rounded-2xl px-6 font-mono font-bold"
                        />
                    </div>
                </div>
            </div>

            <div
                className="p-12 rounded-[32px] border border-border-main flex flex-col items-center justify-center text-center transition-colors duration-300 min-h-[250px]"
                style={{ backgroundColor: background, color: foreground }}
            >
                <h3 className="text-4xl font-black mb-4">Exemplo de Texto</h3>
                <p className="max-w-md text-lg font-medium opacity-90">
                    Este é um exemplo de como o texto aparece sobre o fundo selecionado.
                    O contraste atual é de <strong>{contrastRatio.toFixed(2)}:1</strong>.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'AA Normal', pass: results.aaNormal, desc: 'Mínimo 4.5:1' },
                    { label: 'AA Large', pass: results.aaLarge, desc: 'Mínimo 3.0:1' },
                    { label: 'AAA Normal', pass: results.aaaNormal, desc: 'Mínimo 7.0:1' },
                    { label: 'AAA Large', pass: results.aaaLarge, desc: 'Mínimo 4.5:1' },
                ].map((item) => (
                    <div key={item.label} className={cn(
                        "p-6 rounded-[24px] border transition-all",
                        item.pass ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400" : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
                    )}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                            {item.pass ? <Check size={16} /> : <X size={16} />}
                        </div>
                        <p className="text-sm font-bold">{item.pass ? 'APROVADO' : 'REPROVADO'}</p>
                        <p className="text-[10px] opacity-60 mt-1">{item.desc}</p>
                    </div>
                ))}
            </div>

            <div className="bg-text-main/5 p-6 rounded-[24px] border border-border-main/10">
                <div className="flex items-center gap-3 mb-4">
                    <Info size={18} className="text-blue-500" />
                    <h4 className="font-bold">O que é WCAG?</h4>
                </div>
                <p className="text-xs opacity-70 leading-relaxed">
                    As Diretrizes de Acessibilidade para Conteúdo Web (WCAG) definem como tornar o conteúdo da web mais acessível a pessoas com deficiência.
                    <strong>AA</strong> é o nível de conformidade padrão mundial, enquanto <strong>AAA</strong> é o nível mais rigoroso.
                </p>
            </div>
        </div>
    );
}
