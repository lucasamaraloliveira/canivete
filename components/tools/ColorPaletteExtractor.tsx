'use client';

import React, { useState, useRef } from 'react';
import { Palette, Copy, Check, Upload, RefreshCw, Smartphone, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ColorPaletteExtractor() {
    const [image, setImage] = useState<string | null>(null);
    const [colors, setColors] = useState<string[]>([]);
    const [copiedColor, setCopiedColor] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            setImage(dataUrl);
            extractColors(dataUrl);
        };
        reader.readAsDataURL(file);
    };

    const extractColors = (dataUrl: string) => {
        const img = new Image();
        img.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Resize canvas to extract colors from a smaller version for better performance
            canvas.width = 100;
            canvas.height = 100;
            ctx.drawImage(img, 0, 0, 100, 100);

            const imageData = ctx.getImageData(0, 0, 100, 100).data;
            const colorMap: Record<string, number> = {};

            for (let i = 0; i < imageData.length; i += 4) {
                // Round colors to group similar values
                const r = Math.round(imageData[i] / 10) * 10;
                const g = Math.round(imageData[i + 1] / 10) * 10;
                const b = Math.round(imageData[i + 2] / 10) * 10;
                const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
                colorMap[hex] = (colorMap[hex] || 0) + 1;
            }

            // Get top colors
            const sortedColors = Object.entries(colorMap)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 12)
                .map(([hex]) => hex);

            setColors(sortedColors);
        };
        img.src = dataUrl;
    };

    const copyColor = (hex: string) => {
        navigator.clipboard.writeText(hex);
        setCopiedColor(hex);
        setTimeout(() => setCopiedColor(null), 2000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-0">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Extrator de Cores</label>
                    <button
                        onClick={() => { setImage(null); setColors([]); }}
                        className="p-2 hover:bg-text-main/5 rounded-xl transition-all text-text-main/40 hover:text-text-main"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>

                <div className="space-y-6">
                    <label
                        className={cn(
                            "flex flex-col gap-4 items-center justify-center py-12 px-6 bg-card-main border border-border-main border-dashed border-2 rounded-[40px] shadow-sm cursor-pointer hover:bg-text-main/5 transition-all text-text-main group",
                            image ? "p-4 py-8 shadow-inner bg-bg-main" : ""
                        )}
                    >
                        {image ? (
                            <img src={image} alt="Uploaded" className="max-h-48 w-full object-cover rounded-[32px] box-shadow-xl" />
                        ) : (
                            <>
                                <div className="w-16 h-16 bg-text-main text-bg-main rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                                    <Upload size={32} />
                                </div>
                                <div className="text-center">
                                    <h4 className="font-black text-lg">Faça upload de uma imagem</h4>
                                    <p className="text-sm opacity-40 font-medium tracking-wide">SVG, PNG ou JPG para extrair a paleta</p>
                                </div>
                            </>
                        )}
                        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                    </label>

                    {colors.length > 0 && (
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold text-text-main/40 uppercase tracking-widest ml-1">Paleta Extraída ({colors.length} cores)</label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {colors.map((hex) => (
                                    <button
                                        key={hex}
                                        onClick={() => copyColor(hex)}
                                        className="group relative flex flex-col gap-2 animate-in zoom-in-95 duration-300"
                                    >
                                        <div
                                            style={{ backgroundColor: hex }}
                                            className="w-full aspect-square rounded-2xl border border-border-main/20 shadow-lg group-hover:scale-105 transition-all duration-300"
                                        />
                                        <div className="text-[10px] font-mono font-bold opacity-40 group-hover:opacity-100 uppercase transition-opacity flex items-center justify-between px-1">
                                            {hex}
                                            {copiedColor === hex && <Check size={10} className="text-green-500" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="flex flex-col gap-6">
                <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Aplicação Visual (Preview)</label>
                <div className="flex-1 bg-gradient-to-br from-text-main/5 to-text-main/10 rounded-[40px] p-8 flex flex-col gap-6 items-center justify-center relative overflow-hidden shadow-2xl transition-all duration-700">
                    <div className="absolute inset-0 bg-grid-pattern opacity-10" />

                    {colors.length > 0 ? (
                        <div className="w-full max-w-sm flex flex-col gap-6 animate-in slide-in-from-bottom-10 duration-700">
                            {/* Card 1 */}
                            <div className="bg-card-main p-8 rounded-[32px] box-shadow-xl border border-border-main flex flex-col gap-4">
                                <div
                                    style={{ backgroundColor: colors[0] }}
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-bg-main shadow-xl"
                                >
                                    <Palette size={32} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xl font-black italic uppercase tracking-tighter" style={{ color: colors[0] }}>Dominante</h4>
                                    <p className="text-xs font-medium opacity-50">Esta cor é a mais frequente na imagem carregada.</p>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 rounded-[28px] flex flex-col gap-3 shadow-lg" style={{ backgroundColor: colors[1], color: '#fff' }}>
                                    <div className="text-[8px] font-black uppercase tracking-widest opacity-60">Secundária</div>
                                    <div className="text-lg font-black truncate">{colors[1]}</div>
                                </div>
                                <div className="p-6 rounded-[28px] border border-border-main/10 shadow-lg flex flex-col gap-3" style={{ backgroundColor: colors[2], color: '#fff' }}>
                                    <div className="text-[8px] font-black uppercase tracking-widest opacity-60">Acentuação</div>
                                    <div className="text-lg font-black truncate">{colors[2]}</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-4 opacity-10">
                            <Palette size={80} className="mx-auto" />
                            <h4 className="text-2xl font-black uppercase tracking-[8px]">Sem Dados</h4>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
