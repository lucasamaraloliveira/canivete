'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Type, Copy, Check, Upload, RefreshCw, ZoomIn, ZoomOut, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ImageToAscii() {
    const [image, setImage] = useState<string | null>(null);
    const [ascii, setAscii] = useState<string>('');
    const [width, setWidth] = useState(100);
    const [contrast, setContrast] = useState(1);
    const [copied, setCopied] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const ASCII_CHARS = '@%#*+=-:. ';

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            setImage(dataUrl);
        };
        reader.readAsDataURL(file);
    };

    const convertToAscii = () => {
        if (!image) return;
        setIsProcessing(true);

        const img = new Image();
        img.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Maintain aspect ratio
            const height = Math.round((img.height / img.width) * width * 0.55); // 0.55 factor for character aspect ratio
            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);
            const imageData = ctx.getImageData(0, 0, width, height).data;

            let asciiResult = '';
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const i = (y * width + x) * 4;
                    const r = imageData[i];
                    const g = imageData[i + 1];
                    const b = imageData[i + 2];

                    // Simple grayscale with contrast
                    let avg = (r + g + b) / 3;
                    avg = (avg - 128) * contrast + 128; // Adjust contrast
                    avg = Math.min(255, Math.max(0, avg));

                    const charIndex = Math.floor((avg / 255) * (ASCII_CHARS.length - 1));
                    asciiResult += ASCII_CHARS[charIndex];
                }
                asciiResult += '\n';
            }
            setAscii(asciiResult);
            setIsProcessing(false);
        };
        img.src = image;
    };

    useEffect(() => {
        if (image) convertToAscii();
    }, [image, width, contrast]);

    const copyAscii = () => {
        navigator.clipboard.writeText(ascii);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadTxt = () => {
        const element = document.createElement('a');
        const file = new Blob([ascii], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = 'ascii-art.txt';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-0">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Editor de Arte ASCII</label>
                    <button
                        onClick={() => { setImage(null); setAscii(''); setWidth(100); setContrast(1); }}
                        className="p-2 hover:bg-text-main/5 rounded-xl transition-all text-text-main/40 hover:text-text-main"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>

                <div className="space-y-6">
                    <label
                        className={cn(
                            "flex flex-col gap-4 items-center justify-center p-8 bg-card-main border border-border-main border-dashed border-2 rounded-[40px] shadow-sm cursor-pointer hover:bg-text-main/5 transition-all text-text-main group",
                            image ? "p-4 shadow-inner" : ""
                        )}
                    >
                        {image ? (
                            <img src={image} alt="Uploaded" className="max-h-48 rounded-[32px] box-shadow-xl" />
                        ) : (
                            <>
                                <div className="w-16 h-16 bg-text-main text-bg-main rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                                    <Upload size={32} />
                                </div>
                                <div className="text-center">
                                    <h4 className="font-black text-lg">Faça upload de uma imagem</h4>
                                    <p className="text-sm opacity-40 font-medium tracking-wide">SVG, PNG ou JPG para converter</p>
                                </div>
                            </>
                        )}
                        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                    </label>

                    <div className="space-y-6 bg-card-main border border-border-main p-6 rounded-[32px] shadow-sm">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
                                <span>Resolução (Largura)</span>
                                <span>{width} chars</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <ZoomOut size={16} className="opacity-20" />
                                <input type="range" min="50" max="250" step="5" value={width} onChange={(e) => setWidth(parseInt(e.target.value))} className="flex-1" />
                                <ZoomIn size={16} className="opacity-20" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
                                <span>Contraste</span>
                                <span>{contrast.toFixed(1)}x</span>
                            </div>
                            <input type="range" min="0.5" max="3" step="0.1" value={contrast} onChange={(e) => setContrast(parseFloat(e.target.value))} className="w-full" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            disabled={!ascii}
                            onClick={copyAscii}
                            className="flex items-center justify-center gap-2 py-4 bg-text-main text-bg-main rounded-[24px] font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30"
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />} {copied ? 'Copiado!' : 'Copiar Texto'}
                        </button>
                        <button
                            disabled={!ascii}
                            onClick={downloadTxt}
                            className="flex items-center justify-center gap-2 py-4 bg-text-main/5 hover:bg-text-main/10 text-text-main rounded-[24px] font-bold text-sm border border-border-main transition-all disabled:opacity-30"
                        >
                            <Download size={18} /> Baixar .txt
                        </button>
                    </div>
                </div>
                <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="flex flex-col gap-6">
                <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Preview Arte ASCII</label>
                <div className="flex-1 bg-gradient-to-br from-text-main/5 to-text-main/10 border border-border-main border-dashed border-2 rounded-[40px] p-6 lg:p-8 relative flex flex-col items-center justify-center overflow-auto custom-scrollbar shadow-inner">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-12">
                        <Type size={320} />
                    </div>

                    {ascii ? (
                        <pre className="font-mono text-center leading-[0.5] text-text-main select-all animate-in zoom-in-95 duration-700 whitespace-pre overflow-visible">
                            <div style={{ fontSize: `${400 / width}px` }}>{ascii}</div>
                        </pre>
                    ) : (
                        <div className="text-center space-y-4 opacity-10">
                            <Upload size={80} className="mx-auto" />
                            <h4 className="text-2xl font-black uppercase tracking-[8px]">Aguardando Imagem</h4>
                        </div>
                    )}
                </div>
                {isProcessing && (
                    <div className="p-4 bg-text-main text-bg-main rounded-2xl flex items-center justify-center gap-3 animate-pulse">
                        <RefreshCw className="animate-spin" size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">Processando Pixels...</span>
                    </div>
                )}
            </div>
        </div>
    );
}
