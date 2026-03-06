"use client";

import React, { useState, useCallback, useRef } from 'react';
import { ScanText, Upload, Copy, Check, Info, RefreshCw, Zap, Image as ImageIcon, Search, Trash2, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createWorker } from 'tesseract.js';

export function OcrReader() {
    const [image, setImage] = useState<string | null>(null);
    const [text, setText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processImage = async (imageSrc: string) => {
        setIsProcessing(true);
        setProgress(0);
        setText('');

        try {
            const worker = await createWorker('por');

            // To track progress if needed (optional with this version of tesseract.js)
            // But let's keep it simple for now as per library docs.

            const { data: { text: resultText } } = await worker.recognize(imageSrc);
            setText(resultText);
            await worker.terminate();
        } catch (err) {
            console.error('OCR Error:', err);
            setText('Erro ao processar imagem. Tente carregar uma imagem mais clara.');
        } finally {
            setIsProcessing(false);
            setProgress(100);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            setImage(content);
            processImage(content);
        };
        reader.readAsDataURL(file);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const clearAll = () => {
        setImage(null);
        setText('');
        setProgress(0);
    };

    return (
        <div className="space-y-8 flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                {/* Upload & Preview Area */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                            <ImageIcon size={14} /> Imagem de Origem
                        </label>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-text-main text-bg-main rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
                        >
                            Selecionar Imagem
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            ref={fileInputRef}
                        />
                    </div>
                    <div className="h-[400px] bg-text-main/5 border border-border-main rounded-[40px] flex items-center justify-center overflow-hidden relative group shadow-inner">
                        {image ? (
                            <img src={image} alt="Original" className="max-w-full max-h-full object-contain p-8 group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                            <div className="flex flex-col items-center justify-center opacity-10 gap-4">
                                <Camera size={64} />
                                <p className="font-bold text-lg uppercase tracking-widest leading-tight italic">Nenhuma imagem carregada</p>
                            </div>
                        )}
                        {isProcessing && (
                            <div className="absolute inset-0 bg-text-main/80 backdrop-blur-sm flex flex-col items-center justify-center gap-6 z-20 text-bg-main animate-in fade-in duration-300">
                                <RefreshCw size={48} className="animate-spin" />
                                <div className="text-center space-y-2">
                                    <p className="text-xl font-black uppercase tracking-widest italic tracking-tighter">Lendo Caracteres...</p>
                                    <p className="text-[10px] font-bold opacity-60 uppercase tracking-[4px]">Processamento Local (100% Seguro)</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Text Result Area */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                            <ScanText size={14} /> Texto Extraído
                        </label>
                        <div className="flex gap-2">
                            {text && (
                                <button
                                    onClick={handleCopy}
                                    className="p-3 bg-text-main/5 hover:bg-text-main/10 rounded-2xl transition-all shadow-inner"
                                    title="Copiar Texto"
                                >
                                    {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                </button>
                            )}
                            <button
                                onClick={clearAll}
                                className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-2xl transition-all text-red-500 shadow-inner"
                                title="Limpar Tudo"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                    <div className="h-[400px] bg-text-main/[0.02] border border-border-main border-dashed rounded-[40px] p-8 overflow-y-auto custom-scrollbar relative shadow-inner">
                        <div className="max-w-3xl mx-auto space-y-4">
                            <p className="text-lg font-medium leading-relaxed opacity-90 whitespace-pre-wrap selection:bg-text-main selection:text-bg-main tracking-tight italic">
                                {text || (
                                    <span className="opacity-10 italic">O texto extraído da imagem aparecerá aqui...</span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Privacy Section */}
            <div className="p-8 bg-text-main text-bg-main rounded-[40px] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-14 h-14 bg-bg-main text-text-main rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-all">
                        <Zap size={28} />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg leading-tight uppercase tracking-tight italic">Privacidade Total</h4>
                        <p className="text-xs opacity-60 italic leading-snug tracking-tighter">
                            O processamento OCR (Optical Character Recognition) ocorre inteiramente no seu navegador usando Tesseract.js.
                            Sua imagem nunca sai do computador.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1 relative z-10 text-right">
                    <p className="text-[10px] font-black uppercase tracking-[3px] opacity-40 leading-tight">Extração de</p>
                    <p className="text-3xl font-black leading-tight italic tracking-tighter uppercase whitespace-nowrap">TEXTO LOCAL</p>
                </div>
            </div>
        </div>
    );
}
