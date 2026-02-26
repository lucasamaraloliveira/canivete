'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Grid, Download, Upload, Sliders, RefreshCw, Layers, Zap, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DitherTool() {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [ditheredImage, setDitheredImage] = useState<string | null>(null);
    const [threshold, setThreshold] = useState(128);
    const [contrast, setContrast] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => setOriginalImage(event.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const applyDither = () => {
        if (!originalImage || !canvasRef.current) return;
        setIsProcessing(true);

        const img = new Image();
        img.onload = () => {
            const canvas = canvasRef.current!;
            const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Simple Floyd-Steinberg Dithering
            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    const i = (y * canvas.width + x) * 4;

                    // Convert to grayscale first with contrast adjustment
                    let oldR = data[i];
                    let oldG = data[i + 1];
                    let oldB = data[i + 2];

                    let gray = (0.299 * oldR + 0.587 * oldG + 0.114 * oldB);
                    gray = Math.min(255, Math.max(0, (gray - 128) * contrast + 128));

                    const newPixel = gray < threshold ? 0 : 255;
                    const err = gray - newPixel;

                    data[i] = data[i + 1] = data[i + 2] = newPixel;

                    // Distribute error
                    if (x + 1 < canvas.width) {
                        const ni = i + 4;
                        data[ni] = data[ni] + err * 7 / 16;
                    }
                    if (y + 1 < canvas.height) {
                        if (x > 0) {
                            const ni = i + (canvas.width - 1) * 4;
                            data[ni] = data[ni] + err * 3 / 16;
                        }
                        const ni = i + canvas.width * 4;
                        data[ni] = data[ni] + err * 5 / 16;
                        if (x + 1 < canvas.width) {
                            const ni = i + (canvas.width + 1) * 4;
                            data[ni] = data[ni] + err * 1 / 16;
                        }
                    }
                }
            }

            ctx.putImageData(imageData, 0, 0);
            setDitheredImage(canvas.toDataURL());
            setIsProcessing(false);
        };
        img.src = originalImage;
    };

    useEffect(() => {
        if (originalImage) {
            const timer = setTimeout(applyDither, 300);
            return () => clearTimeout(timer);
        }
    }, [originalImage, threshold, contrast]);

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Visualização do Efeito</label>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black opacity-30 uppercase tracking-[2px]">Floyd-Steinberg Algorithm</span>
                        </div>
                    </div>

                    <div className="relative bg-card-main border border-border-main rounded-[48px] shadow-2xl overflow-hidden min-h-[500px] flex items-center justify-center group">
                        {!originalImage ? (
                            <label className="flex flex-col items-center gap-6 cursor-pointer hover:scale-105 transition-all">
                                <div className="w-20 h-20 bg-text-main text-bg-main rounded-[28px] flex items-center justify-center shadow-2xl rotate-3 group-hover:rotate-0 transition-transform">
                                    <ImageIcon size={40} />
                                </div>
                                <div className="text-center">
                                    <h4 className="font-black text-xl">Upload da Imagem</h4>
                                    <p className="text-xs opacity-40 font-bold uppercase tracking-widest mt-2">Arraste ou clique aqui</p>
                                </div>
                                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                            </label>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center p-8 bg-text-main/[0.02]">
                                <img
                                    src={ditheredImage || originalImage}
                                    alt="Dithered Result"
                                    className="max-w-full max-h-[600px] shadow-2xl rounded-2xl image-render-pixel object-contain"
                                />
                                {isProcessing && (
                                    <div className="absolute inset-0 bg-bg-main/40 backdrop-blur-sm flex items-center justify-center z-20">
                                        <RefreshCw size={48} className="text-text-main animate-spin" />
                                    </div>
                                )}
                            </div>
                        )}
                        <canvas ref={canvasRef} className="hidden" />
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Parâmetros Retrô</label>
                    <div className="bg-card-main border border-border-main p-8 rounded-[40px] flex flex-col gap-8 shadow-sm">
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pr-1">
                                    <label className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Limiar (Threshold)</label>
                                    <span className="text-sm font-black italic">{threshold}</span>
                                </div>
                                <input
                                    type="range" min="0" max="255" value={threshold}
                                    onChange={(e) => setThreshold(parseInt(e.target.value))}
                                    className="w-full accent-text-main h-2 bg-text-main/10 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center pr-1">
                                    <label className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Contraste</label>
                                    <span className="text-sm font-black italic">{contrast.toFixed(1)}x</span>
                                </div>
                                <input
                                    type="range" min="0.1" max="3" step="0.1" value={contrast}
                                    onChange={(e) => setContrast(parseFloat(e.target.value))}
                                    className="w-full accent-text-main h-2 bg-text-main/10 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                disabled={!ditheredImage}
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.download = 'pixel-art-dither.png';
                                    link.href = ditheredImage!;
                                    link.click();
                                }}
                                className="w-full py-5 bg-text-main text-bg-main rounded-[24px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center gap-3"
                            >
                                <Download size={20} /> Baixar Resultado
                            </button>
                            <button
                                onClick={() => setOriginalImage(null)}
                                className="w-full py-4 border-2 border-text-main/10 hover:bg-red-500/10 hover:text-red-500 rounded-[24px] font-bold text-sm transition-all flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={18} /> Resetar Imagem
                            </button>
                        </div>
                    </div>

                    <div className="p-8 bg-text-main/5 rounded-[40px] border border-border-main/10 flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-text-main/40 uppercase tracking-widest font-black text-[10px]">
                            <Zap size={14} /> Dica de Estilo
                        </div>
                        <p className="text-xs font-medium opacity-50 leading-relaxed uppercase tracking-wider">
                            Para um efeito GameBoy autêntico, use baixo contraste e limiar médio. Ótimo para ícones e backgrounds minimalistas.
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .image-render-pixel {
                    image-rendering: pixelated;
                    image-rendering: crisp-edges;
                }
            `}</style>
        </div>
    );
}
