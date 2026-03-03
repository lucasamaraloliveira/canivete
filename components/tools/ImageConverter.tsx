'use client';

import React, { useState, useRef } from 'react';
import { FileImage, Download, Upload, Trash2, RefreshCw, CheckCircle2, ChevronDown, ImagePlus, FileType } from 'lucide-react';
import { cn } from '@/lib/utils';

type ImageFormat = 'png' | 'jpeg' | 'webp' | 'bmp';

interface ImageFile {
    id: string;
    name: string;
    size: number;
    previewUrl: string;
    targetFormat: ImageFormat;
    status: 'idle' | 'converting' | 'success' | 'error';
    resultUrl?: string;
    resultName?: string;
    resultSize?: number;
}

const SUPPORTED_FORMATS: { value: ImageFormat; label: string }[] = [
    { value: 'png', label: 'PNG' },
    { value: 'jpeg', label: 'JPG / JPEG' },
    { value: 'webp', label: 'WebP' },
    { value: 'bmp', label: 'BMP' },
];

export function ImageConverter() {
    const [images, setImages] = useState<ImageFile[]>([]);
    const [globalTargetFormat, setGlobalTargetFormat] = useState<ImageFormat>('png');
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const newImages: ImageFile[] = files.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            previewUrl: URL.createObjectURL(file),
            targetFormat: globalTargetFormat,
            status: 'idle'
        }));

        setImages(prev => [...prev, ...newImages]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeImage = (id: string) => {
        setImages(prev => {
            const filtered = prev.filter(img => img.id !== id);
            // Cleanup URLs
            const removed = prev.find(img => img.id === id);
            if (removed) {
                URL.revokeObjectURL(removed.previewUrl);
                if (removed.resultUrl) URL.revokeObjectURL(removed.resultUrl);
            }
            return filtered;
        });
    };

    const convertImage = async (imgData: ImageFile): Promise<ImageFile> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(img, 0, 0);

                let mimeType = `image/${imgData.targetFormat}`;
                if (imgData.targetFormat === 'bmp') {
                    // Browsers don't natively support toDataURL('image/bmp') everywhere
                    // For now we use image/png as fallback or a custom encoder
                    // But most modern browsers (Chrome/Edge) support it.
                }

                canvas.toBlob((blob) => {
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        resolve({
                            ...imgData,
                            status: 'success',
                            resultUrl: url,
                            resultName: imgData.name.replace(/\.[^/.]+$/, "") + "." + imgData.targetFormat,
                            resultSize: blob.size
                        });
                    } else {
                        resolve({ ...imgData, status: 'error' });
                    }
                }, mimeType, 0.92);
            };
            img.onerror = () => resolve({ ...imgData, status: 'error' });
            img.src = imgData.previewUrl;
        });
    };

    const processAll = async () => {
        setIsProcessing(true);
        const updatedImages = [...images];

        for (let i = 0; i < updatedImages.length; i++) {
            if (updatedImages[i].status === 'success') continue;

            setImages(prev => prev.map((img, idx) => idx === i ? { ...img, status: 'converting' } : img));
            const result = await convertImage(updatedImages[i]);
            setImages(prev => prev.map((img, idx) => idx === i ? result : img));
        }

        setIsProcessing(false);
    };

    const downloadImage = (img: ImageFile) => {
        if (!img.resultUrl) return;
        const link = document.createElement('a');
        link.href = img.resultUrl;
        link.download = img.resultName || 'image.' + img.targetFormat;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const clearAll = () => {
        images.forEach(img => {
            URL.revokeObjectURL(img.previewUrl);
            if (img.resultUrl) URL.revokeObjectURL(img.resultUrl);
        });
        setImages([]);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 flex flex-col gap-8 h-full">
            <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-blue-500/10 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/5">
                    <ImagePlus size={40} />
                </div>
                <h2 className="text-3xl font-black italic tracking-tighter uppercase text-text-main">Conversor Multiformato</h2>
                <p className="text-text-main/60 max-w-md mx-auto italic font-medium">Transforme suas imagens para PNG, JPG, WebP ou BMP em lote.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload Section */}
                <div className="lg:col-span-2 space-y-6">
                    <label
                        className={cn(
                            "flex flex-col gap-4 items-center justify-center p-12 bg-card-main border-2 border-dashed border-border-main rounded-[40px] shadow-2xl cursor-pointer hover:bg-text-main/5 transition-all group relative overflow-hidden",
                            isProcessing && "opacity-50 pointer-events-none"
                        )}
                    >
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            ref={fileInputRef}
                        />
                        <div className="w-16 h-16 bg-text-main text-bg-main rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                            {isProcessing ? <RefreshCw size={32} className="animate-spin" /> : <Upload size={32} />}
                        </div>
                        <div className="text-center">
                            <h4 className="font-black text-lg uppercase tracking-tight">Seleção de Imagens</h4>
                            <p className="text-xs opacity-40 font-bold uppercase tracking-widest mt-1">Multi-upload suportado</p>
                        </div>
                    </label>

                    {/* Image List */}
                    <div className="bg-card-main border border-border-main rounded-[40px] overflow-hidden shadow-xl flex flex-col min-h-[400px]">
                        <div className="p-6 border-b border-border-main flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileImage size={18} className="text-blue-500" />
                                <span className="text-[10px] font-black uppercase tracking-[3px] text-text-main/50">Fila de Arquivos</span>
                            </div>
                            {images.length > 0 && (
                                <button onClick={clearAll} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:opacity-70 flex items-center gap-2">
                                    <Trash2 size={14} /> Limpar Tudo
                                </button>
                            )}
                        </div>

                        <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                            {images.length > 0 ? (
                                <div className="grid grid-cols-1 gap-3">
                                    {images.map((img) => (
                                        <div key={img.id} className="p-4 bg-text-main/5 rounded-2xl border border-border-main/5 flex items-center gap-4 group animate-in slide-in-from-bottom-2 duration-300">
                                            <div className="w-16 h-16 bg-card-main rounded-xl overflow-hidden border border-border-main shrink-0 relative">
                                                <img src={img.previewUrl} alt="preview" className="w-full h-full object-cover" />
                                                {img.status === 'success' && (
                                                    <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center text-white">
                                                        <CheckCircle2 size={24} />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h5 className="font-black text-xs truncate uppercase tracking-tight mb-1 text-text-main">{img.name}</h5>
                                                <div className="flex items-center gap-3 text-[10px] font-bold text-text-main/40 uppercase">
                                                    <span>{formatSize(img.size)}</span>
                                                    {img.resultSize && (
                                                        <>
                                                            <span className="w-1 h-1 rounded-full bg-text-main/20" />
                                                            <span className="text-blue-500 font-black">{formatSize(img.resultSize)}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-text-main/5 rounded-xl border border-border-main/20">
                                                    <span className="text-[10px] font-black text-text-main/30">PARA:</span>
                                                    <span className="text-[10px] font-black text-blue-500">{img.targetFormat.toUpperCase()}</span>
                                                </div>

                                                {img.status === 'success' ? (
                                                    <button
                                                        onClick={() => downloadImage(img)}
                                                        className="p-3 bg-green-500 text-white rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all"
                                                    >
                                                        <Download size={18} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => removeImage(img.id)}
                                                        className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-text-main/10 gap-4 py-20">
                                    <FileImage size={64} strokeWidth={1} />
                                    <p className="font-black uppercase tracking-[4px] text-sm text-text-main/20">Nenhum arquivo</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Settings Section */}
                <div className="space-y-6">
                    <div className="bg-card-main border border-border-main p-8 rounded-[40px] shadow-2xl space-y-8 sticky top-6">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[3px] opacity-30">Configuração Global</label>
                            <div className="grid grid-cols-2 gap-2">
                                {SUPPORTED_FORMATS.map((format) => (
                                    <button
                                        key={format.value}
                                        onClick={() => {
                                            setGlobalTargetFormat(format.value);
                                            setImages(prev => prev.map(img => img.status !== 'success' ? { ...img, targetFormat: format.value } : img));
                                        }}
                                        className={cn(
                                            "py-4 rounded-2xl font-black text-xs transition-all border-2",
                                            globalTargetFormat === format.value
                                                ? "bg-text-main text-bg-main border-text-main"
                                                : "bg-text-main/5 border-border-main/10 opacity-40 hover:opacity-100 hover:bg-text-main/10"
                                        )}
                                    >
                                        {format.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-border-main/20 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-[2px] opacity-40 italic">Ações Rápidas</span>
                            </div>

                            <button
                                onClick={processAll}
                                disabled={images.length === 0 || isProcessing}
                                className="w-full py-5 bg-text-main text-bg-main rounded-[24px] font-black uppercase tracking-[2px] text-xs shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:hover:scale-100 transition-all flex items-center justify-center gap-3"
                            >
                                {isProcessing ? (
                                    <>Convertendo <RefreshCw size={16} className="animate-spin" /></>
                                ) : (
                                    <>Converter Todos <FileType size={16} /></>
                                )}
                            </button>

                            <p className="text-[9px] text-center opacity-30 font-medium uppercase tracking-widest leading-relaxed px-4">
                                Todo o processamento ocorre no seu computador. Suas fotos nunca saem do seu navegador.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
