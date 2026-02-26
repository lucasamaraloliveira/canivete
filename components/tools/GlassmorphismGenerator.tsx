'use client';

import React, { useState } from 'react';
import { Layers, Copy, Check, Sliders, RefreshCw } from 'lucide-react';
import { CodeBlock } from '../CodeBlock';

export function GlassmorphismGenerator() {
    const [color, setColor] = useState('#ffffff');
    const [opacity, setOpacity] = useState(0.4);
    const [blur, setBlur] = useState(10);
    const [saturation, setSaturation] = useState(100);
    const [borderOpacity, setBorderOpacity] = useState(0.2);
    const [copied, setCopied] = useState(false);

    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 255, g: 255, b: 255 };
    };

    const rgb = hexToRgb(color);
    const cssCode = `/* Glassmorphism Effect */
background: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity});
backdrop-filter: blur(${blur}px) saturate(${saturation}%);
-webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
border: 1px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${borderOpacity});
border-radius: 24px;
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);`;

    const copyCode = () => {
        navigator.clipboard.writeText(cssCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-0">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Configurações do Vidro</label>
                    <button
                        onClick={() => {
                            setColor('#ffffff');
                            setOpacity(0.4);
                            setBlur(10);
                            setSaturation(100);
                            setBorderOpacity(0.2);
                        }}
                        className="p-2 hover:bg-text-main/5 rounded-xl transition-all text-text-main/40 hover:text-text-main"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>

                <div className="space-y-6 bg-card-main border border-border-main p-6 rounded-[32px] shadow-sm">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold uppercase tracking-widest opacity-40 text-text-main">Cor de Fundo</label>
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="w-10 h-10 border-none bg-transparent cursor-pointer"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold uppercase tracking-widest opacity-40 text-text-main">Opacidade ({Math.round(opacity * 100)}%)</label>
                            </div>
                            <input
                                type="range" min="0" max="1" step="0.01" value={opacity}
                                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold uppercase tracking-widest opacity-40 text-text-main">Blur Flexível ({blur}px)</label>
                            </div>
                            <input
                                type="range" min="0" max="40" step="1" value={blur}
                                onChange={(e) => setBlur(parseInt(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold uppercase tracking-widest opacity-40 text-text-main">Saturação ({saturation}%)</label>
                            </div>
                            <input
                                type="range" min="0" max="200" step="1" value={saturation}
                                onChange={(e) => setSaturation(parseInt(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold uppercase tracking-widest opacity-40 text-text-main">Borda ({Math.round(borderOpacity * 100)}%)</label>
                            </div>
                            <input
                                type="range" min="0" max="1" step="0.01" value={borderOpacity}
                                onChange={(e) => setBorderOpacity(parseFloat(e.target.value))}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Código CSS</label>
                    <div className="h-48 bg-[#1e1e1e] rounded-[32px] overflow-auto custom-scrollbar shadow-inner relative group">
                        <CodeBlock code={cssCode} language="css" className="w-full" />
                        <button
                            onClick={copyCode}
                            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-white transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2 text-xs font-bold"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? 'Copiado!' : 'Copiar'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Preview Visual</label>
                <div className="flex-1 min-h-[400px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-[40px] shadow-2xl relative flex items-center justify-center overflow-hidden p-12 overflow-hidden">
                    {/* Animated background elements for preview */}
                    <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-xl animate-pulse opacity-60" />
                    <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-300 rounded-full blur-2xl animate-bounce opacity-40" />
                    <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-green-300 rounded-full blur-lg opacity-30" />

                    <div
                        style={{
                            background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`,
                            backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
                            WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
                            border: `1px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${borderOpacity})`,
                            borderRadius: '24px',
                            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                        }}
                        className="w-full max-w-sm p-10 text-center relative z-10 animate-in zoom-in-95 duration-500 shadow-2xl"
                    >
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white border border-white/20 shadow-inner">
                            <Layers size={32} />
                        </div>
                        <h4 className="text-white text-2xl font-black mb-2 tracking-tight">Efeito Glass</h4>
                        <p className="text-white/70 text-sm font-medium leading-relaxed">
                            Mude os controles ao lado para ver este componente reagir em tempo real sob este fundo dinâmico.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
