'use client';

import React, { useState } from 'react';
import { Waves, Copy, Check, Sliders, RefreshCw, Palette } from 'lucide-react';
import { CodeBlock } from '../CodeBlock';

export function WaveGenerator() {
    const [color, setColor] = useState('#6366f1');
    const [height, setHeight] = useState(150);
    const [amplitude, setAmplitude] = useState(50);
    const [frequency, setFrequency] = useState(3);
    const [flipped, setFlipped] = useState(false);
    const [copied, setCopied] = useState(false);

    const generatePath = () => {
        const width = 1440;
        const baseHeight = 320;
        const waveHeight = height;
        const amp = amplitude;
        const freq = frequency;

        let path = `M 0,${baseHeight - waveHeight}`;

        for (let x = 0; x <= width; x += 10) {
            const y = baseHeight - waveHeight + Math.sin((x / width) * Math.PI * 2 * freq) * amp;
            path += ` L ${x},${y}`;
        }

        path += ` L ${width},${baseHeight} L 0,${baseHeight} Z`;

        if (flipped) {
            // Very basic vertical flip logic for preview
            return `M 0,0 L 1440,0 L 1440,${waveHeight} ` + path.replace(/M 0,[\d.]+/, '').replace(/L [\d.]+,320 L 0,320 Z/, 'Z');
        }

        return path;
    };

    const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
  <path fill="${color}" fill-opacity="1" d="${generatePath()}"></path>
</svg>`;

    const copyCode = () => {
        navigator.clipboard.writeText(svgCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-0">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Editor de Ondas</label>
                    <button
                        onClick={() => {
                            setColor('#6366f1');
                            setHeight(150);
                            setAmplitude(50);
                            setFrequency(3);
                            setFlipped(false);
                        }}
                        className="p-2 hover:bg-text-main/5 rounded-xl transition-all text-text-main/40 hover:text-text-main"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>

                <div className="space-y-6 bg-card-main border border-border-main p-6 rounded-[32px] shadow-sm">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold uppercase tracking-widest opacity-40">Cor da Onda</label>
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="w-10 h-10 border-none bg-transparent cursor-pointer"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest opacity-40">Altura ({height}px)</label>
                            <input type="range" min="50" max="300" value={height} onChange={(e) => setHeight(parseInt(e.target.value))} className="w-full" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest opacity-40">Amplitude ({amplitude}px)</label>
                            <input type="range" min="0" max="150" value={amplitude} onChange={(e) => setAmplitude(parseInt(e.target.value))} className="w-full" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest opacity-40">Frequência ({frequency})</label>
                            <input type="range" min="1" max="10" value={frequency} onChange={(e) => setFrequency(parseInt(e.target.value))} className="w-full" />
                        </div>

                        <button
                            onClick={() => setFlipped(!flipped)}
                            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${flipped ? "bg-text-main text-bg-main" : "bg-text-main/5 hover:bg-text-main/10"}`}
                        >
                            <RefreshCw size={18} className={flipped ? "rotate-180" : ""} /> Inverter Onda
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Código SVG</label>
                    <div className="h-48 bg-[#1e1e1e] rounded-[32px] overflow-auto custom-scrollbar shadow-inner relative group">
                        <CodeBlock code={svgCode} language="xml" className="w-full" />
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
                <div className="flex-1 min-h-[400px] bg-bg-main border border-border-main rounded-[40px] shadow-2xl relative flex flex-col justify-end overflow-hidden p-0 border-dashed border-2">
                    <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

                    <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center">
                        <Waves size={64} className="opacity-10 mb-4" />
                        <h4 className="text-lg font-bold opacity-30 uppercase tracking-[4px]">Wave Preview</h4>
                    </div>

                    <div
                        className="w-full group/preview transition-all duration-500 animate-in slide-in-from-bottom-10"
                        style={{ transform: flipped ? 'rotateX(180deg)' : 'none' }}
                        dangerouslySetInnerHTML={{ __html: svgCode }}
                    />
                </div>
            </div>
        </div>
    );
}
