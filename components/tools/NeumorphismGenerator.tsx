'use client';

import React, { useState } from 'react';
import { Box, Copy, Check, Sliders, RefreshCw, Palette } from 'lucide-react';
import { CodeBlock } from '../CodeBlock';

export function NeumorphismGenerator() {
    const [color, setColor] = useState('#e0e0e0');
    const [size, setSize] = useState(200);
    const [radius, setRadius] = useState(40);
    const [distance, setDistance] = useState(20);
    const [blur, setBlur] = useState(40);
    const [intensity, setIntensity] = useState(0.15);
    const [shape, setShape] = useState<'flat' | 'concave' | 'convex' | 'pressed'>('flat');
    const [copied, setCopied] = useState(false);

    // Color manipulation helper
    const adjustColor = (hex: string, amt: number) => {
        let col = hex.replace(/^#/, '');
        if (col.length === 3) col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2];
        const num = parseInt(col, 16);
        let r = (num >> 16) + amt;
        let g = ((num >> 8) & 0x00FF) + amt;
        let b = (num & 0x0000FF) + amt;
        const clamp = (v: number) => Math.min(255, Math.max(0, v));
        return `#${(0x1000000 + clamp(r) * 0x10000 + clamp(g) * 0x100 + clamp(b)).toString(16).slice(1)}`;
    };

    const lightColor = adjustColor(color, intensity * 255);
    const darkColor = adjustColor(color, -intensity * 255);

    const getBackground = () => {
        if (shape === 'concave') return `linear-gradient(145deg, ${darkColor}, ${lightColor})`;
        if (shape === 'convex') return `linear-gradient(145deg, ${lightColor}, ${darkColor})`;
        if (shape === 'pressed') return color;
        return color;
    };

    const getShadow = () => {
        const shadow1 = `${distance}px ${distance}px ${blur}px ${darkColor}`;
        const shadow2 = `-${distance}px -${distance}px ${blur}px ${lightColor}`;
        if (shape === 'pressed') return `inset ${shadow1}, inset ${shadow2}`;
        return `${shadow1}, ${shadow2}`;
    };

    const cssCode = `/* Neumorphic Shape */
border-radius: ${radius}px;
background: ${getBackground()};
box-shadow: ${getShadow()};`;

    const copyCode = () => {
        navigator.clipboard.writeText(cssCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-0">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Configuração Neumórfica</label>
                    <button
                        onClick={() => {
                            setColor('#e0e0e0');
                            setSize(200);
                            setRadius(40);
                            setDistance(20);
                            setBlur(40);
                            setIntensity(0.15);
                            setShape('flat');
                        }}
                        className="p-2 hover:bg-text-main/5 rounded-xl transition-all text-text-main/40 hover:text-text-main"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>

                <div className="space-y-6 bg-card-main border border-border-main p-6 rounded-[32px] shadow-sm">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold uppercase tracking-widest opacity-40">Cor Base</label>
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="w-10 h-10 border-none bg-transparent cursor-pointer"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest opacity-40">Distância ({distance}px)</label>
                                <input type="range" min="1" max="50" value={distance} onChange={(e) => setDistance(parseInt(e.target.value))} className="w-full" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest opacity-40">Blur ({blur}px)</label>
                                <input type="range" min="1" max="100" value={blur} onChange={(e) => setBlur(parseInt(e.target.value))} className="w-full" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest opacity-40">Intensidade ({Math.round(intensity * 100)}%)</label>
                                <input type="range" min="0.01" max="0.5" step="0.01" value={intensity} onChange={(e) => setIntensity(parseFloat(e.target.value))} className="w-full" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest opacity-40">Radius ({radius}px)</label>
                                <input type="range" min="0" max="100" value={radius} onChange={(e) => setRadius(parseInt(e.target.value))} className="w-full" />
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            {(['flat', 'concave', 'convex', 'pressed'] as const).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setShape(s)}
                                    className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${shape === s ? "bg-text-main text-bg-main" : "bg-text-main/5 hover:bg-text-main/10 text-text-main/40 hover:text-text-main"}`}
                                >
                                    {s}
                                </button>
                            ))}
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
                <div
                    style={{ backgroundColor: color }}
                    className="flex-1 min-h-[400px] border border-border-main rounded-[40px] shadow-2xl relative flex items-center justify-center p-12 transition-all duration-300"
                >
                    <div
                        style={{
                            width: `${size}px`,
                            height: `${size}px`,
                            borderRadius: `${radius}px`,
                            background: getBackground(),
                            boxShadow: getShadow(),
                        }}
                        className="flex items-center justify-center transition-all duration-300 animate-in zoom-in-95"
                    >
                        <Box size={48} className="opacity-20 stroke-[3px]" />
                    </div>
                </div>
            </div>
        </div>
    );
}
