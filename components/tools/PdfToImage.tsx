'use client';

import React, { useState, useEffect } from 'react';
import { FileUp, ImageIcon, Trash2, CheckCircle2, RefreshCw, ShieldCheck, Download, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PdfToImage() {
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f && f.type === 'application/pdf') {
            setFile(f);
            setImages([]);
            setError(null);
        }
    };

    const runConversion = async () => {
        if (!file) return;
        setProcessing(true);
        setError(null);

        try {
            // We use a CDN to load PDF.js as we don't have it installed
            if (!(window as any).pdfjsLib) {
                await loadScript('https://unpkg.com/pdfjs-dist@5.5.207/legacy/build/pdf.min.js');
                (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@5.5.207/legacy/build/pdf.worker.min.js';
            }

            const pdfjsLib = (window as any).pdfjsLib;
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            const numPages = pdf.numPages;
            const newImages: string[] = [];

            for (let i = 1; i <= Math.min(numPages, 10); i++) { // Limit to 10 pages for performance
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 2.0 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport }).promise;
                newImages.push(canvas.toDataURL('image/jpeg', 0.8));
            }

            setImages(newImages);
            if (numPages > 10) {
                setError('Limitado às primeiras 10 páginas para desempenho local.');
            }
        } catch (err: any) {
            console.error(err);
            setError('Erro ao converter PDF. Certifique-se de que o arquivo não está protegido.');
        } finally {
            setProcessing(false);
        }
    };

    const loadScript = (src: string) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    };

    const downloadImage = (src: string, index: number) => {
        const a = document.createElement('a');
        a.href = src;
        a.download = `pagina_${index + 1}_${file?.name.replace('.pdf', '')}.jpg`;
        a.click();
    };

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">PDF para Imagem</h2>
                    <p className="opacity-40 text-sm font-medium">Converta páginas de um PDF em arquivos JPG de alta qualidade.</p>
                </div>
                <div className="flex items-center gap-3 px-6 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                    <ShieldCheck size={16} className="text-green-500" />
                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest leading-none">Privacidade Total</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className={cn(
                        "flex-1 bg-card-main border-4 border-dashed border-border-main/20 rounded-[48px] overflow-hidden flex flex-col items-center justify-center p-12 relative group transition-all hover:border-text-main/20",
                        file && "justify-start p-8"
                    )}>
                        {!file ? (
                            <>
                                <div className="w-24 h-24 bg-text-main/5 rounded-[32px] flex items-center justify-center mb-8 group-hover:scale-110 transition-all">
                                    <ImageIcon size={48} className="opacity-20" />
                                </div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Selecione o PDF</h3>
                                <p className="text-[10px] font-bold opacity-30 uppercase tracking-[3px] mb-8 text-center">Converteremos cada página em JPG</p>
                                <input
                                    type="file" accept=".pdf" onChange={handleFile}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <div className="px-8 py-3 bg-text-main text-bg-main rounded-2xl font-black uppercase tracking-widest shadow-xl">
                                    Carregar Documento
                                </div>
                            </>
                        ) : (
                            <div className="w-full h-full flex flex-col gap-6">
                                <div className="flex items-center gap-6 bg-text-main/5 p-6 rounded-3xl shrink-0">
                                    <div className="w-16 h-16 bg-red-500 text-white rounded-2xl flex items-center justify-center shrink-0">
                                        <FileText size={32} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-lg font-black uppercase tracking-tight truncate">{file.name}</h4>
                                        <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Aguardando Conversão</p>
                                    </div>
                                    <button onClick={() => setFile(null)} className="p-2 hover:bg-red-500/10 text-red-500 rounded-xl"><Trash2 size={20} /></button>
                                </div>

                                {images.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center gap-6">
                                        <button
                                            onClick={runConversion}
                                            disabled={processing}
                                            className={cn(
                                                "px-12 py-5 bg-text-main text-bg-main rounded-[24px] font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3",
                                                processing && "opacity-50 cursor-wait"
                                            )}
                                        >
                                            {processing ? <RefreshCw size={24} className="animate-spin" /> : <><ImageIcon size={24} /> Gerar JPGs Agora</>}
                                        </button>
                                        {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{error}</p>}
                                    </div>
                                ) : (
                                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {images.map((src, i) => (
                                                <div key={i} className="group relative aspect-[3/4] bg-bg-main rounded-2xl overflow-hidden border border-border-main/10 shadow-sm animate-in zoom-in-95 duration-200">
                                                    <img src={src} alt={`Página ${i + 1}`} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                                                        <span className="text-[10px] font-black text-white uppercase tracking-widest mb-2">Página {i + 1}</span>
                                                        <button
                                                            onClick={() => downloadImage(src, i)}
                                                            className="w-full py-2 bg-text-main text-bg-main rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-transform"
                                                        >
                                                            <Download size={14} /> Baixar
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {error && <p className="mt-4 text-center text-[10px] font-black opacity-40 uppercase tracking-widest">{error}</p>}
                                        <div className="mt-8 flex justify-center pb-4">
                                            <button
                                                onClick={() => { setFile(null); setImages([]); }}
                                                className="text-[10px] font-black opacity-30 hover:opacity-100 uppercase tracking-widest underline underline-offset-4"
                                            >
                                                Converter outro arquivo
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Como funciona?</label>
                    <div className="bg-card-main border border-border-main p-8 rounded-[40px] shadow-sm flex flex-col gap-6">
                        {[
                            { title: 'Renderização Local', desc: 'Usamos o PDF.js para desenhar cada página em um canvas e exportar como JPG.' },
                            { title: 'Alta Resolução', desc: 'As imagens são geradas com escala 2.0 para garantir nitidez nos textos.' },
                            { title: 'Foco em Performance', desc: 'Limitamos a 10 páginas simultâneas para não travar seu navegador.' }
                        ].map((item, i) => (
                            <div key={i} className="space-y-2">
                                <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-text-main" />
                                    {item.title}
                                </h4>
                                <p className="text-[10px] font-medium opacity-30 uppercase leading-relaxed tracking-wider ml-3 italic">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-[40px] flex gap-4">
                        <div className="w-10 h-10 bg-card-main text-blue-500 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                            <ShieldCheck size={20} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600/60">Privacidade</h4>
                            <p className="text-[10px] font-medium opacity-40 uppercase leading-relaxed tracking-wider">
                                Nenhum dado é enviado para servidores externos. Tudo acontece na RAM do seu dispositivo.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
