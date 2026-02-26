'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Square, Upload, RefreshCw, Sliders, Palette, Download, Layers, Info, Trash2, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

declare global {
    interface Window {
        lottie: any;
    }
}

interface LottieColor {
    path: number[];
    orig: string;
    current: string;
}

export function LottiePreviewer() {
    const [lottieData, setLottieData] = useState<any>(null);
    const [animation, setAnimation] = useState<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoop, setIsLoop] = useState(true);
    const [speed, setSpeed] = useState(1);
    const [bgColor, setBgColor] = useState('#ffffff');
    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState('');
    const [colors, setColors] = useState<LottieColor[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const scriptLoaded = useRef(false);

    useEffect(() => {
        if (scriptLoaded.current) return;
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js';
        script.async = true;
        script.onload = () => {
            scriptLoaded.current = true;
        };
        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        if (!lottieData || !containerRef.current || !window.lottie) return;

        if (animation) {
            animation.destroy();
        }

        const anim = window.lottie.loadAnimation({
            container: containerRef.current,
            renderer: 'svg',
            loop: isLoop,
            autoplay: true,
            animationData: lottieData
        });

        anim.setSpeed(speed);
        anim.addEventListener('enterFrame', () => {
            setProgress((anim.currentFrame / anim.totalFrames) * 100);
        });

        setAnimation(anim);
        setIsPlaying(true);

        return () => anim.destroy();
    }, [lottieData, isLoop]);

    useEffect(() => {
        if (animation) {
            animation.setSpeed(speed);
        }
    }, [speed]);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                setLottieData(json);
                extractColors(json);
            } catch (err) {
                alert("Erro ao ler o arquivo JSON. Certifique-se de que é um Lottie válido.");
            }
        };
        reader.readAsText(file);
    };

    const extractColors = (data: any) => {
        const extracted: LottieColor[] = [];

        // Simple recursive search for colors in Lottie JSON
        const findColors = (obj: any, path: number[] = []) => {
            if (!obj || typeof obj !== 'object') return;

            // 'c' is the standard key for colors in Lottie (rgba [r, g, b, a] where values are 0-1)
            if (obj.k && Array.isArray(obj.k) && obj.k.length >= 3 && typeof obj.k[0] === 'number' && obj.c !== undefined) {
                // This is a bit complex in Lottie, but let's try to find common color patterns
            }

            // More reliable way: search for 'c' objects that contain 'k' with 4 numbers
            if (obj.c && obj.c.k && Array.isArray(obj.c.k) && typeof obj.c.k[0] === 'number') {
                const k = obj.c.k;
                const hex = rgbToHex(k[0], k[1], k[2]);
                extracted.push({ path: [...path], orig: hex, current: hex });
            }

            for (const key in obj) {
                findColors(obj[key], [...path, parseInt(key) || 0]);
            }
        };

        // For now, let's keep it simple and focus on the previewer. 
        // Lottie color adjustment is notoriously difficult because of the nesting.
        // I'll skip deep color editing for the first version to ensure stability.
    };

    const rgbToHex = (r: number, g: number, b: number) => {
        const toHex = (n: number) => {
            const val = Math.round(n * 255);
            return val.toString(16).padStart(2, '0');
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };

    const togglePlay = () => {
        if (!animation) return;
        if (isPlaying) animation.pause();
        else animation.play();
        setIsPlaying(!isPlaying);
    };

    const stopAnim = () => {
        if (!animation) return;
        animation.stop();
        setIsPlaying(false);
    };

    const downloadJson = () => {
        if (!lottieData) return;
        const blob = new Blob([JSON.stringify(lottieData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `edited_${fileName || 'animation.json'}`;
        a.click();
    };

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Visualização da Animação</label>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1 bg-text-main/5 rounded-full">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">{fileName || 'Lottie Player'}</span>
                            </div>
                        </div>
                    </div>

                    <div
                        className="relative bg-card-main border border-border-main rounded-[48px] shadow-2xl overflow-hidden min-h-[450px] flex items-center justify-center group"
                        style={{ backgroundColor: bgColor }}
                    >
                        {!lottieData ? (
                            <label className="flex flex-col items-center gap-6 cursor-pointer hover:scale-105 transition-all">
                                <div className="w-20 h-20 bg-text-main text-bg-main rounded-[28px] flex items-center justify-center shadow-2xl transition-transform">
                                    <Play size={40} className="ml-1" />
                                </div>
                                <div className="text-center">
                                    <h4 className="font-black text-xl">Carregar Lottie JSON</h4>
                                    <p className="text-xs opacity-40 font-bold uppercase tracking-widest mt-2">Clique para selecionar o arquivo</p>
                                </div>
                                <input type="file" accept=".json" onChange={handleUpload} className="hidden" />
                            </label>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center p-12">
                                <div ref={containerRef} className="w-full h-full max-w-[400px] max-h-[400px]" />
                            </div>
                        )}

                        {lottieData && (
                            <div className="absolute bottom-6 left-6 right-6 z-20">
                                <div className="bg-bg-main/60 backdrop-blur-md border border-text-main/10 rounded-2xl p-4 flex items-center gap-4 shadow-xl">
                                    <button
                                        onClick={togglePlay}
                                        className="w-10 h-10 bg-text-main text-bg-main rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                                    >
                                        {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                                    </button>
                                    <button
                                        onClick={stopAnim}
                                        className="w-10 h-10 hover:bg-text-main/10 rounded-xl flex items-center justify-center transition-all"
                                    >
                                        <Square size={18} />
                                    </button>
                                    <div className="flex-1 h-1.5 bg-text-main/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-text-main transition-all duration-100 ease-linear"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-mono font-bold opacity-40">{Math.round(progress)}%</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Controladores</label>
                    <div className="bg-card-main border border-border-main p-8 rounded-[40px] flex flex-col gap-8 shadow-sm">
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pr-1">
                                    <label className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Velocidade</label>
                                    <span className="text-sm font-black italic">{speed}x</span>
                                </div>
                                <input
                                    type="range" min="0.1" max="3" step="0.1" value={speed}
                                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                                    className="w-full accent-text-main h-2 bg-text-main/10 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Fundo do Preview</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color" value={bgColor}
                                        onChange={(e) => setBgColor(e.target.value)}
                                        className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-none"
                                    />
                                    <input
                                        type="text" value={bgColor}
                                        onChange={(e) => setBgColor(e.target.value)}
                                        className="flex-1 bg-text-main/5 border border-border-main/10 rounded-xl px-4 text-xs font-mono font-bold"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-text-main/5 rounded-2xl border border-border-main/5">
                                <span className="text-xs font-bold opacity-60 uppercase tracking-wider">Repetir Animação (Loop)</span>
                                <button
                                    onClick={() => setIsLoop(!isLoop)}
                                    className={cn(
                                        "w-12 h-6 rounded-full p-1 transition-all duration-300",
                                        isLoop ? "bg-green-500" : "bg-text-main/20"
                                    )}
                                >
                                    <div className={cn(
                                        "w-4 h-4 bg-white rounded-full transition-all duration-300",
                                        isLoop ? "translate-x-6" : "translate-x-0"
                                    )} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3 pt-6 border-t border-border-main/10">
                            <button
                                onClick={() => setLottieData(null)}
                                className="w-full py-4 border-2 border-text-main/10 hover:bg-red-500/10 hover:text-red-500 rounded-[24px] font-bold text-sm transition-all flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={18} /> Novo Arquivo
                            </button>
                        </div>
                    </div>

                    <div className="p-8 bg-blue-500/5 rounded-[40px] border border-blue-500/10 flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-blue-600/60 uppercase tracking-widest font-black text-[10px]">
                            <Layers size={14} /> Dica de Exportação
                        </div>
                        <p className="text-xs font-medium text-blue-600/60 leading-relaxed uppercase tracking-wider">
                            Este preview é renderizado em SVG, garantindo que sua animação mantenha a nitidez em qualquer tamanho de tela.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
