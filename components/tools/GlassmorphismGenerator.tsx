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
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 sm:gap-8 h-full">
            {/* Preview first on mobile */}
            <div className="flex flex-col gap-3 sm:gap-4 order-first lg:order-last">
                <label className="text-[10px] sm:text-sm font-bold text-text-main/40 uppercase tracking-widest ml-1">Preview Visual</label>
                <div className="flex-1 min-h-[300px] lg:min-h-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-[32px] sm:rounded-[40px] shadow-2xl relative flex items-center justify-center overflow-hidden p-6 sm:p-12 overflow-hidden">
                    <div className="absolute top-10 left-10 w-24 h-24 bg-yellow-400 rounded-full blur-xl animate-pulse opacity-40" />
                    <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-300 rounded-full blur-2xl animate-bounce opacity-30" />

                    <div
                        style={{
                            background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`,
                            backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
                            WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
                            border: `1px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${borderOpacity})`,
                            borderRadius: '24px',
                            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                        }}
                        className="w-full max-w-[280px] sm:max-w-sm p-6 sm:p-10 text-center relative z-10 animate-in zoom-in-95 duration-500 shadow-2xl"
                    >
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-white border border-white/20 shadow-inner">
                            <Layers size={24} />
                        </div>
                        <h4 className="text-white text-xl font-black mb-1">Efeito Glass</h4>
                        <p className="text-white/70 text-[10px] sm:text-xs font-medium leading-relaxed">
                            Os controles abaixo ajustam este componente em tempo real.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6 overflow-y-auto lg:overflow-visible custom-scrollbar pr-0 lg:pr-2">
                <div className="flex items-center justify-between ml-1 leading-none">
                    <label className="text-[10px] sm:text-sm font-bold text-text-main/40 uppercase tracking-widest">Configurações</label>
                    <button
                        onClick={() => {
                            setColor('#ffffff');
                            setOpacity(0.4);
                            setBlur(10);
                            setSaturation(100);
                            setBorderOpacity(0.2);
                        }}
                        className="p-2 bg-text-main/5 hover:bg-text-main/10 rounded-xl transition-all text-text-main/40"
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>

                <div className="space-y-5 bg-card-main border border-border-main p-5 rounded-[32px] shadow-sm">
                    <div className="space-y-5">
                        <div className="flex justify-between items-center group/color">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 text-text-main">Cor de Fundo</label>
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="w-10 h-10 border-none bg-transparent cursor-pointer hover:scale-110 transition-transform"
                            />
                        </div>

                        {[
                            { label: 'Opacidade', value: opacity, setter: setOpacity, min: 0, max: 1, step: 0.01, unit: '%' },
                            { label: 'Blur', value: blur, setter: setBlur, min: 0, max: 40, step: 1, unit: 'px' },
                            { label: 'Saturação', value: saturation, setter: setSaturation, min: 0, max: 200, step: 1, unit: '%' },
                            { label: 'Borda', value: borderOpacity, setter: setBorderOpacity, min: 0, max: 1, step: 0.01, unit: '%' },
                        ].map((prop) => (
                            <div key={prop.label} className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 text-text-main">
                                        {prop.label} ({prop.unit === '%' ? Math.round(prop.value * (prop.min === 0 && prop.max === 200 ? 1 : 100)) : prop.value}{prop.unit})
                                    </label>
                                </div>
                                <input
                                    type="range" min={prop.min} max={prop.max} step={prop.step} value={prop.value}
                                    onChange={(e) => prop.setter(parseFloat(e.target.value))}
                                    className="w-full accent-text-main h-1.5 bg-text-main/10 rounded-full appearance-none cursor-pointer"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between ml-1 leading-none">
                        <label className="text-[10px] sm:text-sm font-bold text-text-main/40 uppercase tracking-widest">Código CSS</label>
                        <button
                            onClick={copyCode}
                            className="px-3 py-1.5 bg-text-main/5 hover:bg-text-main text-text-main/40 hover:text-bg-main rounded-xl transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                        >
                            {copied ? <Check size={12} /> : <Copy size={12} />}
                            {copied ? 'Copiado' : 'Copiar'}
                        </button>
                    </div>
                    <div className="h-40 bg-[#0D0D0D] rounded-3xl overflow-auto custom-scrollbar shadow-inner">
                        <CodeBlock code={cssCode} language="css" className="w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
