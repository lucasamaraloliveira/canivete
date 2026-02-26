'use client';

import React, { useState, useEffect } from 'react';
import { Maximize, Copy, Check, RefreshCw, Smartphone, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Preset {
    name: string;
    w: number;
    h: number;
}

const PRESETS: Preset[] = [
    { name: '16:9', w: 16, h: 9 },
    { name: '4:3', w: 4, h: 3 },
    { name: '1:1', w: 1, h: 1 },
    { name: '21:9', w: 21, h: 9 },
    { name: '9:16', w: 9, h: 16 },
    { name: '3:2', w: 3, h: 2 },
];

export function AspectRatioCalculator() {
    const [w, setW] = useState(1920);
    const [h, setH] = useState(1080);
    const [ratioW, setRatioW] = useState(16);
    const [ratioH, setRatioH] = useState(9);
    const [copied, setCopied] = useState(false);

    const gcd = (a: number, b: number): number => {
        return b ? gcd(b, a % b) : a;
    };

    const calculateRatioFromDimensions = (width: number, height: number) => {
        const common = gcd(width, height);
        setRatioW(width / common);
        setRatioH(height / common);
    };

    const calculateHeightFromWidth = (width: number, rw: number, rh: number) => {
        return Math.round((width * rh) / rw);
    };

    const calculateWidthFromHeight = (height: number, rw: number, rh: number) => {
        return Math.round((height * rw) / rh);
    };

    const handleWidthChange = (val: number) => {
        setW(val);
        setH(calculateHeightFromWidth(val, ratioW, ratioH));
    };

    const handleHeightChange = (val: number) => {
        setH(val);
        setW(calculateWidthFromHeight(val, ratioW, ratioH));
    };

    const handleRatioWChange = (val: number) => {
        setRatioW(val);
        setH(calculateHeightFromWidth(w, val, ratioH));
    };

    const handleRatioHChange = (val: number) => {
        setRatioH(val);
        setW(calculateWidthFromHeight(h, ratioW, val));
    };

    const applyPreset = (p: Preset) => {
        setRatioW(p.w);
        setRatioH(p.h);
        setH(calculateHeightFromWidth(w, p.w, p.h));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-0">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Calculadora de Proporção</label>
                    <button
                        onClick={() => { setW(1920); setH(1080); setRatioW(16); setRatioH(9); }}
                        className="p-2 hover:bg-text-main/5 rounded-xl transition-all text-text-main/40 hover:text-text-main"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>

                <div className="space-y-6 bg-card-main border border-border-main p-6 rounded-[32px] shadow-sm">
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest opacity-30">Largura (px)</label>
                                <input
                                    type="number" value={w} onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                                    className="w-full p-4 bg-text-main/5 border border-border-main rounded-2xl font-bold text-lg outline-none focus:ring-4 focus:ring-text-main/5"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest opacity-30">Altura (px)</label>
                                <input
                                    type="number" value={h} onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                                    className="w-full p-4 bg-text-main/5 border border-border-main rounded-2xl font-bold text-lg outline-none focus:ring-4 focus:ring-text-main/5"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-text-main/20">
                            <div className="h-px flex-1 bg-border-main" />
                            <Maximize size={16} />
                            <div className="h-px flex-1 bg-border-main" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest opacity-30">Ratio W</label>
                                <input
                                    type="number" value={ratioW} onChange={(e) => handleRatioWChange(parseInt(e.target.value) || 1)}
                                    className="w-full p-4 bg-text-main/5 border border-border-main rounded-2xl font-bold text-lg outline-none focus:ring-4 focus:ring-text-main/5"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest opacity-30">Ratio H</label>
                                <input
                                    type="number" value={ratioH} onChange={(e) => handleRatioHChange(parseInt(e.target.value) || 1)}
                                    className="w-full p-4 bg-text-main/5 border border-border-main rounded-2xl font-bold text-lg outline-none focus:ring-4 focus:ring-text-main/5"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            {PRESETS.map((p) => (
                                <button
                                    key={p.name}
                                    onClick={() => applyPreset(p)}
                                    className={cn(
                                        "py-3 rounded-xl text-xs font-black transition-all",
                                        ratioW === p.w && ratioH === p.h ? "bg-text-main text-bg-main shadow-lg" : "bg-text-main/5 hover:bg-text-main/10 text-text-main/40"
                                    )}
                                >
                                    {p.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-text-main/5 rounded-2xl text-[10px] font-medium opacity-50 uppercase tracking-widest text-center leading-relaxed">
                    Altere qualquer valor para recalcular automaticamente. <br /> Ideal para vídeos, imagens e grids.
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Preview de Proporção</label>
                <div className="flex-1 min-h-[400px] bg-bg-main border border-border-main border-dashed border-2 rounded-[40px] shadow-inner relative flex items-center justify-center p-8 overflow-hidden">
                    <div
                        style={{
                            aspectRatio: `${ratioW} / ${ratioH}`,
                            width: ratioW >= ratioH ? '100%' : 'auto',
                            height: ratioW < ratioH ? '100%' : 'auto',
                            maxHeight: '100%',
                            maxWidth: '100%'
                        }}
                        className="bg-text-main/5 border border-text-main shadow-2xl rounded-2xl flex flex-col items-center justify-center transition-all duration-500 animate-in zoom-in-95"
                    >
                        <div className="text-center p-6 grayscale">
                            <div className="flex items-center justify-center gap-2 mb-2 opacity-20">
                                {ratioW >= ratioH ? <Monitor size={48} /> : <Smartphone size={48} />}
                            </div>
                            <h4 className="text-2xl font-black text-text-main/10 uppercase tracking-widest">{ratioW}:{ratioH}</h4>
                            <p className="text-xs font-bold text-text-main/10 uppercase tracking-[2px] mt-1">{w}x{h} px</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
