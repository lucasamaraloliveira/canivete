'use client';

import React, { useState } from 'react';
import { Sliders, Copy, Check, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { CodeBlock } from '../CodeBlock';

export function CssFilterPlayground() {
    const [blur, setBlur] = useState(0);
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [grayscale, setGrayscale] = useState(0);
    const [hueRotate, setHueRotate] = useState(0);
    const [invert, setInvert] = useState(0);
    const [opacity, setOpacity] = useState(100);
    const [saturate, setSaturate] = useState(100);
    const [sepia, setSepia] = useState(0);
    const [copied, setCopied] = useState(false);

    const filterString = `blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%) hue-rotate(${hueRotate}deg) invert(${invert}%) opacity(${opacity}%) saturate(${saturate}%) sepia(${sepia}%)`;

    const cssCode = `.filtered-image {
  filter: ${filterString};
  -webkit-filter: ${filterString};
}`;

    const reset = () => {
        setBlur(0);
        setBrightness(100);
        setContrast(100);
        setGrayscale(0);
        setHueRotate(0);
        setInvert(0);
        setOpacity(100);
        setSaturate(100);
        setSepia(0);
    };

    const copyCode = () => {
        navigator.clipboard.writeText(cssCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-0">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Laboratório de Filtros</label>
                    <button
                        onClick={reset}
                        className="p-2 hover:bg-text-main/5 rounded-xl transition-all text-text-main/40 hover:text-text-main"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>

                <div className="space-y-4 bg-card-main border border-border-main p-6 rounded-[32px] shadow-sm overflow-y-auto custom-scrollbar max-h-[500px]">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-30">Blur ({blur}px)</label>
                            <input type="range" min="0" max="20" step="1" value={blur} onChange={(e) => setBlur(parseInt(e.target.value))} className="w-full" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-30">Brilho ({brightness}%)</label>
                            <input type="range" min="0" max="200" step="1" value={brightness} onChange={(e) => setBrightness(parseInt(e.target.value))} className="w-full" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-30">Contraste ({contrast}%)</label>
                            <input type="range" min="0" max="200" step="1" value={contrast} onChange={(e) => setContrast(parseInt(e.target.value))} className="w-full" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-30">Grayscale ({grayscale}%)</label>
                            <input type="range" min="0" max="100" step="1" value={grayscale} onChange={(e) => setGrayscale(parseInt(e.target.value))} className="w-full" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-30">Hue Rotate ({hueRotate}deg)</label>
                            <input type="range" min="0" max="360" step="1" value={hueRotate} onChange={(e) => setHueRotate(parseInt(e.target.value))} className="w-full" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-30">Inverter ({invert}%)</label>
                            <input type="range" min="0" max="100" step="1" value={invert} onChange={(e) => setInvert(parseInt(e.target.value))} className="w-full" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-30">Opacidade ({opacity}%)</label>
                            <input type="range" min="0" max="100" step="1" value={opacity} onChange={(e) => setOpacity(parseInt(e.target.value))} className="w-full" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-30">Saturação ({saturate}%)</label>
                            <input type="range" min="0" max="200" step="1" value={saturate} onChange={(e) => setSaturate(parseInt(e.target.value))} className="w-full" />
                        </div>
                        <div className="space-y-2 col-span-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-30">Sepia ({sepia}%)</label>
                            <input type="range" min="0" max="100" step="1" value={sepia} onChange={(e) => setSepia(parseInt(e.target.value))} className="w-full" />
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
                <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Preview Instantâneo</label>
                <div className="flex-1 min-h-[400px] bg-bg-main border border-border-main rounded-[40px] shadow-2xl relative flex items-center justify-center p-8 overflow-hidden">
                    <div className="w-full h-full relative group">
                        <div className="absolute inset-0 bg-text-main/5 flex items-center justify-center -z-10 text-text-main/10">
                            <ImageIcon size={120} />
                        </div>
                        <img
                            src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=60" // High impact abstract image
                            alt="Filter preview"
                            style={{ filter: filterString, WebkitFilter: filterString }}
                            className="w-full h-full object-cover rounded-[32px] shadow-2xl transition-all duration-300 animate-in fade-in"
                        />
                    </div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-20 text-center">Os filtros CSS são aplicados via hardware e mantêm a imagem original intacta.</p>
            </div>
        </div>
    );
}
