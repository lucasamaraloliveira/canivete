'use client';

import React, { useState, useRef } from 'react';
import { FileImage, Download, Check, Upload, Trash2, RefreshCw, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConvertedImage {
    id: string;
    originalName: string;
    originalSize: number;
    webpName: string;
    webpSize: number;
    webpDataUrl: string;
    status: 'converting' | 'completed' | 'error';
    quality: number;
}

export function WebpConverter() {
    const [files, setFiles] = useState<ConvertedImage[]>([]);
    const [quality, setQuality] = useState(0.8);
    const [isConverting, setIsConverting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const convertToWebp = async (file: File, targetQuality: number): Promise<ConvertedImage> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d')!;
                    ctx.drawImage(img, 0, 0);

                    const webpDataUrl = canvas.toDataURL('image/webp', targetQuality);
                    const base64Length = webpDataUrl.split(',')[1].length;
                    const webpSize = Math.floor(base64Length * 0.75); // Rough estimate of binary size from base64

                    resolve({
                        id: Math.random().toString(36).substr(2, 9),
                        originalName: file.name,
                        originalSize: file.size,
                        webpName: file.name.replace(/\.[^/.]+$/, "") + ".webp",
                        webpSize: webpSize,
                        webpDataUrl: webpDataUrl,
                        status: 'completed',
                        quality: targetQuality
                    });
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFiles = Array.from(e.target.files || []);
        if (uploadedFiles.length === 0) return;

        setIsConverting(true);
        const newConvertedFiles: ConvertedImage[] = [];

        for (const file of uploadedFiles) {
            const converted = await convertToWebp(file, quality);
            newConvertedFiles.push(converted);
        }

        setFiles(prev => [...prev, ...newConvertedFiles]);
        setIsConverting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const downloadAll = () => {
        files.forEach((file, index) => {
            setTimeout(() => {
                const link = document.createElement('a');
                link.href = file.webpDataUrl;
                link.download = file.webpName;
                link.click();
            }, index * 200); // Small delay to prevent browser blocking multiple downloads
        });
    };

    const clearAll = () => {
        setFiles([]);
    };

    const totalSavings = files.reduce((acc, f) => acc + (f.originalSize - f.webpSize), 0);

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold mb-1">WebP Bulk Converter</h3>
                        <p className="text-sm opacity-50">Converta imagens para WebP em lote para otimizar seu site.</p>
                    </div>
                    {files.length > 0 && (
                        <button
                            onClick={clearAll}
                            className="p-2 hover:bg-red-500/10 text-red-500 rounded-xl transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                        >
                            <Trash2 size={16} /> Limpar Tudo
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <label
                            className={cn(
                                "flex flex-col gap-4 items-center justify-center p-12 bg-card-main border border-border-main border-dashed border-2 rounded-[40px] shadow-sm cursor-pointer hover:bg-text-main/5 transition-all text-text-main group relative overflow-hidden",
                                isConverting && "pointer-events-none opacity-50"
                            )}
                        >
                            <div className="w-16 h-16 bg-text-main text-bg-main rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                                {isConverting ? <RefreshCw size={32} className="animate-spin" /> : <Upload size={32} />}
                            </div>
                            <div className="text-center">
                                <h4 className="font-black text-lg">{isConverting ? 'Convertendo...' : 'Clique ou arraste imagens'}</h4>
                                <p className="text-sm opacity-40 font-medium tracking-wide">PNG, JPG, HEIC, etc. (Máx 20 arquivos)</p>
                            </div>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                                ref={fileInputRef}
                            />
                        </label>
                    </div>

                    <div className="bg-card-main border border-border-main p-8 rounded-[40px] flex flex-col gap-6 shadow-sm">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pr-1">
                                <label className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Qualidade WebP</label>
                                <span className="text-xs font-black italic">{Math.round(quality * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0.1"
                                max="1"
                                step="0.05"
                                value={quality}
                                onChange={(e) => setQuality(parseFloat(e.target.value))}
                                className="w-full accent-text-main h-2 bg-text-main/10 rounded-lg appearance-none cursor-pointer"
                            />
                            <p className="text-[10px] opacity-40 font-medium leading-relaxed uppercase tracking-wider">
                                Qualidades menores resultam em arquivos menores, mas com menos detalhes.
                            </p>
                        </div>

                        {files.length > 0 && (
                            <div className="pt-6 border-t border-border-main/10 space-y-4">
                                <div className="p-4 bg-green-500/5 rounded-2xl border border-green-500/10">
                                    <p className="text-[10px] font-bold text-green-600/60 uppercase tracking-widest mb-1">Espaço Economizado</p>
                                    <p className="text-2xl font-black text-green-600">{formatSize(totalSavings)}</p>
                                </div>
                                <button
                                    onClick={downloadAll}
                                    className="w-full py-4 bg-text-main text-bg-main rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                >
                                    <Download size={18} /> Baixar Todas ({files.length})
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-0 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-text-main/60">
                    <FileImage size={18} />
                    <span className="text-sm font-bold uppercase tracking-wider">Fila de Conversão</span>
                </div>
                <div className="flex-1 bg-card-main border border-border-main rounded-[40px] overflow-hidden shadow-inner flex flex-col">
                    <div className="flex-1 overflow-auto custom-scrollbar p-6">
                        {files.length > 0 ? (
                            <div className="grid grid-cols-1 gap-3">
                                {files.map((file) => (
                                    <div key={file.id} className="p-4 bg-text-main/5 rounded-2xl border border-border-main/5 flex items-center gap-4 group hover:bg-text-main/10 transition-all animate-in fade-in slide-in-from-left-4 duration-300">
                                        <div className="w-12 h-12 bg-card-main rounded-xl overflow-hidden flex items-center justify-center border border-border-main shadow-sm shrink-0">
                                            <img src={file.webpDataUrl} alt="preview" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h5 className="font-bold text-sm truncate">{file.webpName}</h5>
                                                <span className="px-2 py-0.5 bg-green-500/10 text-green-600 text-[8px] font-black uppercase rounded-full">WebP</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-[10px] font-bold opacity-30">
                                                <span>{formatSize(file.originalSize)}</span>
                                                <span className="w-1 h-1 rounded-full bg-text-main/20" />
                                                <span className="text-green-600/80">{formatSize(file.webpSize)}</span>
                                                <span className="w-1 h-1 rounded-full bg-text-main/20" />
                                                <span className="text-blue-500/80">-{Math.round((1 - file.webpSize / file.originalSize) * 100)}%</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <a
                                                href={file.webpDataUrl}
                                                download={file.webpName}
                                                className="p-3 bg-text-main text-bg-main rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all"
                                            >
                                                <Download size={16} />
                                            </a>
                                            <button
                                                onClick={() => removeFile(file.id)}
                                                className="p-3 hover:bg-red-500/10 text-red-500 rounded-xl transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-text-main/20 gap-4">
                                <FileImage size={48} className="opacity-10" />
                                <p className="font-bold text-lg">Nenhuma imagem carregada</p>
                                <p className="text-sm font-medium max-w-[200px] text-center opacity-50 uppercase tracking-widest">Aparecerão aqui após o upload</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
