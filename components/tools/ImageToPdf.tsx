'use client';

import React, { useState } from 'react';
import { FileUp, FileImage, Trash2, CheckCircle2, RefreshCw, ShieldCheck, Download, Plus, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PDFDocument } from 'pdf-lib';

interface QueuedImage {
    id: string;
    file: File;
    preview: string;
}

export function ImageToPdf() {
    const [images, setImages] = useState<QueuedImage[]>([]);
    const [processing, setProcessing] = useState(false);
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

    const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
            .filter(f => f.type.startsWith('image/'));

        const newImages = files.map(f => ({
            id: Math.random().toString(36).substr(2, 9),
            file: f,
            preview: URL.createObjectURL(f)
        }));

        setImages(prev => [...prev, ...newImages]);
        setPdfBlob(null);
    };

    const removeImage = (id: string) => {
        setImages(prev => {
            const filtered = prev.filter(img => img.id !== id);
            // Clean up URL object
            const removed = prev.find(img => img.id === id);
            if (removed) URL.revokeObjectURL(removed.preview);
            return filtered;
        });
        setPdfBlob(null);
    };

    const runConversion = async () => {
        if (images.length === 0) return;
        setProcessing(true);
        try {
            const pdfDoc = await PDFDocument.create();

            for (const imgItem of images) {
                const imgBytes = await imgItem.file.arrayBuffer();
                let embeddedImg;

                if (imgItem.file.type === 'image/jpeg' || imgItem.file.type === 'image/jpg') {
                    embeddedImg = await pdfDoc.embedJpg(imgBytes);
                } else if (imgItem.file.type === 'image/png') {
                    embeddedImg = await pdfDoc.embedPng(imgBytes);
                } else {
                    // Try to convert other formats if needed, but for now focus on JPG/PNG
                    continue;
                }

                const page = pdfDoc.addPage([embeddedImg.width, embeddedImg.height]);
                page.drawImage(embeddedImg, {
                    x: 0,
                    y: 0,
                    width: embeddedImg.width,
                    height: embeddedImg.height,
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
            setPdfBlob(blob);
        } catch (err) {
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    const download = () => {
        if (!pdfBlob) return;
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `imagens_${new Date().getTime()}.pdf`;
        a.click();
    };

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">Imagem para PDF</h2>
                    <p className="opacity-40 text-sm font-medium">Converta fotos PNG/JPG em um arquivo PDF localmente.</p>
                </div>
                <div className="flex items-center gap-3 px-6 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                    <ShieldCheck size={16} className="text-green-500" />
                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest leading-none">Privacidade Total</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
                <div className="lg:col-span-2 flex flex-col gap-6 h-full">
                    <div className={cn(
                        "flex-1 bg-card-main border-4 border-dashed border-border-main/20 rounded-[48px] overflow-hidden flex flex-col p-6 min-h-[400px]",
                        images.length === 0 && "items-center justify-center p-12 relative group transition-all hover:border-text-main/20"
                    )}>
                        {images.length === 0 ? (
                            <>
                                <div className="w-24 h-24 bg-text-main/5 rounded-[32px] flex items-center justify-center mb-8 group-hover:scale-110 transition-all">
                                    <FileImage size={48} className="opacity-20" />
                                </div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2 text-center">Arraste as Imagens</h3>
                                <p className="text-[10px] font-bold opacity-30 uppercase tracking-[3px] mb-8 text-center">JPG ou PNG aceitos</p>
                                <input
                                    type="file" accept="image/png, image/jpeg" multiple onChange={handleImages}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <div className="px-8 py-3 bg-text-main text-bg-main rounded-2xl font-black uppercase tracking-widest shadow-xl">
                                    Procurar Imagens
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col h-full w-full">
                                <div className="flex items-center justify-between mb-6 px-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">Imagens na Fila ({images.length})</h4>
                                    <button
                                        onClick={() => setImages([])}
                                        className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline"
                                    >
                                        Limpar Tudo
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {images.map((img) => (
                                            <div key={img.id} className="group relative aspect-[3/4] bg-bg-main rounded-2xl overflow-hidden border border-border-main/10 shadow-sm animate-in zoom-in-95 duration-200">
                                                <img src={img.preview} alt="preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button
                                                        onClick={() => removeImage(img.id)}
                                                        className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 rounded-md">
                                                    <span className="text-[8px] font-black text-white uppercase tracking-widest">{img.file.type.split('/')[1]}</span>
                                                </div>
                                            </div>
                                        ))}

                                        <label className="aspect-[3/4] border-2 border-dashed border-border-main/10 rounded-2xl hover:border-text-main/20 transition-all cursor-pointer flex flex-col items-center justify-center group gap-2">
                                            <input type="file" accept="image/png, image/jpeg" multiple onChange={handleImages} className="hidden" />
                                            <Plus size={24} className="opacity-40 group-hover:scale-110 transition-transform" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Adicionar</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-border-main/5 flex flex-col items-center gap-4 shrink-0">
                                    {!pdfBlob ? (
                                        <button
                                            onClick={runConversion}
                                            disabled={processing || images.length === 0}
                                            className={cn(
                                                "px-12 py-5 bg-text-main text-bg-main rounded-[24px] font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 min-w-[240px] justify-center",
                                                (processing || images.length === 0) && "opacity-50 cursor-not-allowed"
                                            )}
                                        >
                                            {processing ? <RefreshCw size={24} className="animate-spin" /> : <><Plus size={24} /> Criar PDF Agora</>}
                                        </button>
                                    ) : (
                                        <div className="flex flex-col items-center gap-4 w-full">
                                            <div className="flex items-center gap-3 text-green-500 scale-in mb-2">
                                                <CheckCircle2 size={24} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Conversão Concluída! {images.length} fotos salvas</span>
                                            </div>
                                            <button
                                                onClick={download}
                                                className="w-full max-w-sm py-5 bg-green-500 text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                                            >
                                                <Download size={24} /> Baixar PDF das Fotos
                                            </button>
                                            <button
                                                onClick={() => { setImages([]); setPdfBlob(null); }}
                                                className="text-[10px] font-black opacity-30 hover:opacity-100 uppercase tracking-widest"
                                            >
                                                Nova Conversão
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Como funciona?</label>
                    <div className="bg-card-main border border-border-main p-8 rounded-[40px] shadow-sm flex flex-col gap-6">
                        {[
                            { title: 'Tamanho Adaptativo', desc: 'Cada página do PDF terá as dimensões exatas da imagem original.' },
                            { title: 'Alta Qualidade', desc: 'Nenhuma compressão extra é aplicada durante a criação do PDF.' },
                            { title: 'Múltiplas Fotos', desc: 'Você pode subir várias fotos para gerar um documento com várias páginas.' }
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
                </div>
            </div>
        </div>
    );
}
