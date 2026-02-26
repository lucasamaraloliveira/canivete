'use client';

import React, { useState, useRef } from 'react';
import { Globe, Download, Copy, Check, Upload, RefreshCw, FileCode } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '../CodeBlock';

export function FaviconGenerator() {
    const [image, setImage] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validação de tamanho de arquivo (10MB)
        if (file.size > 10 * 1024 * 1024) {
            setError('Arquivo muito grande! O limite é de 10MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            const img = new Image();
            img.onload = () => {
                // Validação de dimensões
                if (img.width < 32 || img.height < 32) {
                    setError('Resolução muito baixa! Mínimo de 32x32 pixels.');
                } else if (img.width > 4096 || img.height > 4096) {
                    setError('Resolução muito alta! Máximo de 4096x4096 pixels.');
                } else {
                    setError(null);
                    setImage(dataUrl);
                }
            };
            img.src = dataUrl;
        };
        reader.readAsDataURL(file);
    };

    const reset = () => {
        setImage(null);
        setError(null);
    };

    const downloadIcon = (size: number) => {
        if (!image) return;
        const img = new Image();
        img.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            canvas.width = size;
            canvas.height = size;
            ctx.drawImage(img, 0, 0, size, size);

            const link = document.createElement('a');
            link.download = `favicon-${size}x${size}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        };
        img.src = image;
    };

    const downloadManifest = () => {
        const manifest = {
            name: "My App",
            short_name: "App",
            icons: [192, 512].map(size => ({
                src: `/favicon-${size}x${size}.png`,
                sizes: `${size}x${size}`,
                type: "image/png"
            })),
            start_url: "/",
            display: "standalone",
            background_color: "#ffffff",
            theme_color: "#ffffff"
        };
        const element = document.createElement('a');
        const file = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
        element.href = URL.createObjectURL(file);
        element.download = 'manifest.json';
        element.click();
    };

    const htmlCode = `<!-- Favicon configuration -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-0">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Gerador de Favicon</label>
                    <button
                        onClick={reset}
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
                            <img src={image} alt="Uploaded" className="max-h-32 rounded-2xl shadow-xl" />
                        ) : (
                            <>
                                <div className="w-16 h-16 bg-text-main text-bg-main rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                                    <Upload size={32} />
                                </div>
                                <div className="text-center">
                                    <h4 className="font-black text-lg">Faça upload da imagem base</h4>
                                    <div className="mt-2 space-y-1">
                                        <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest">Resolução: 32px a 4096px</p>
                                        <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest">Peso: Máx 10MB</p>
                                    </div>
                                </div>
                            </>
                        )}
                        <input type="file" accept="image/png,image/jpeg" onChange={handleUpload} className="hidden" />
                    </label>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                            <p className="text-red-500 text-xs font-bold text-center uppercase tracking-wider">{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            disabled={!image}
                            onClick={() => downloadIcon(32)}
                            className="bg-card-main p-4 rounded-2xl border border-border-main hover:bg-text-main hover:text-bg-main transition-all flex items-center justify-between group disabled:opacity-20"
                        >
                            <span className="text-xs font-bold">Gerar 32x32</span>
                            <Download size={16} />
                        </button>
                        <button
                            disabled={!image}
                            onClick={() => downloadIcon(180)}
                            className="bg-card-main p-4 rounded-2xl border border-border-main hover:bg-text-main hover:text-bg-main transition-all flex items-center justify-between group disabled:opacity-20"
                        >
                            <span className="text-xs font-bold">Apple Touch</span>
                            <Download size={16} />
                        </button>
                        <button
                            disabled={!image}
                            onClick={() => downloadIcon(192)}
                            className="bg-card-main p-4 rounded-2xl border border-border-main hover:bg-text-main hover:text-bg-main transition-all flex items-center justify-between group disabled:opacity-20"
                        >
                            <span className="text-xs font-bold">Android 192x192</span>
                            <Download size={16} />
                        </button>
                        <button
                            disabled={!image}
                            onClick={downloadManifest}
                            className="bg-card-main p-4 rounded-2xl border border-border-main hover:bg-text-main hover:text-bg-main transition-all flex items-center justify-between group disabled:opacity-20"
                        >
                            <span className="text-xs font-bold">Web Manifest</span>
                            <FileCode size={16} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Snippet HTML</label>
                    <div className="h-48 bg-[#1e1e1e] rounded-[32px] overflow-auto custom-scrollbar shadow-inner relative group">
                        <CodeBlock code={htmlCode} language="html" className="w-full" />
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(htmlCode);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                            }}
                            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-white transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2 text-xs font-bold"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copiado!' : 'Copiar'}
                        </button>
                    </div>
                </div>
                <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="flex flex-col gap-6">
                <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Preview de Abas</label>
                <div className="flex-1 bg-gradient-to-br from-text-main/5 to-text-main/10 border border-border-main border-dashed border-2 rounded-[40px] p-8 flex flex-col gap-6 items-center justify-center relative overflow-hidden shadow-inner">
                    <div className="absolute top-0 left-0 p-8 opacity-5">
                        <Globe size={120} />
                    </div>

                    <div className="w-full max-w-sm space-y-4 animate-in slide-in-from-bottom-10 duration-700">
                        <div className="bg-card-main h-16 w-full rounded-2xl border border-border-main shadow-lg flex items-center p-4 gap-3 relative before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-blue-500 before:rounded-full">
                            {image ? (
                                <img src={image} className="w-6 h-6 rounded-md shadow-sm" alt="Favicon" />
                            ) : (
                                <div className="w-6 h-6 bg-text-main/5 animate-pulse rounded-md" />
                            )}
                            <div className="flex flex-col gap-0.5">
                                <div className="text-xs font-bold text-text-main truncate max-w-[150px]">Meu Incrível Web App</div>
                                <div className="text-[10px] font-medium opacity-30">localhost:3000</div>
                            </div>
                        </div>

                        <div className="bg-card-main/30 h-16 w-full rounded-2xl border border-border-main/5 flex items-center p-4 gap-3 opacity-50">
                            <div className="w-6 h-6 bg-text-main/10 rounded-md" />
                            <div className="flex flex-col gap-0.5">
                                <div className="text-xs font-bold text-text-main/40 truncate max-w-[150px]">Google Search</div>
                                <div className="text-[10px] font-medium opacity-10">google.com.br</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
