'use client';

import React, { useState } from 'react';
import { FileUp, Files, Trash2, CheckCircle2, RefreshCw, ShieldCheck, Download, Plus, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PDFDocument } from 'pdf-lib';

interface QueuedFile {
    id: string;
    file: File;
    status: 'idle' | 'processing' | 'done' | 'error';
}

export function PdfMerger() {
    const [files, setFiles] = useState<QueuedFile[]>([]);
    const [processing, setProcessing] = useState(false);
    const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);

    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || [])
            .filter(f => f.type === 'application/pdf')
            .map(f => ({
                id: Math.random().toString(36).substr(2, 9),
                file: f,
                status: 'idle' as const
            }));

        setFiles(prev => [...prev, ...newFiles]);
        setMergedBlob(null);
    };

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
        setMergedBlob(null);
    };

    const runMerge = async () => {
        if (files.length < 2) return;
        setProcessing(true);
        try {
            const mergedPdf = await PDFDocument.create();

            for (const queuedItem of files) {
                const arrayBuffer = await queuedItem.file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const pdfBytes = await mergedPdf.save();
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
            setMergedBlob(blob);
        } catch (err) {
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    const download = () => {
        if (!mergedBlob) return;
        const url = URL.createObjectURL(mergedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mesclado_${new Date().getTime()}.pdf`;
        a.click();
    };

    const totalSize = files.reduce((acc, f) => acc + f.file.size, 0);

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">Juntar PDF</h2>
                    <p className="opacity-40 text-sm font-medium">Combine vários arquivos PDF em um só documento localmente.</p>
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
                        files.length === 0 && "items-center justify-center p-12 relative group transition-all hover:border-text-main/20"
                    )}>
                        {files.length === 0 ? (
                            <>
                                <div className="w-24 h-24 bg-text-main/5 rounded-[32px] flex items-center justify-center mb-8 group-hover:scale-110 transition-all">
                                    <Files size={48} className="opacity-20" />
                                </div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2 text-center">Selecione os PDFs</h3>
                                <p className="text-[10px] font-bold opacity-30 uppercase tracking-[3px] mb-8 text-center">Arraste ou clique para carregar</p>
                                <input
                                    type="file" accept=".pdf" multiple onChange={handleFiles}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <div className="px-8 py-3 bg-text-main text-bg-main rounded-2xl font-black uppercase tracking-widest shadow-xl">
                                    Procurar Arquivos
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col h-full w-full">
                                <div className="flex items-center justify-between mb-6 px-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">Fila de Arquivos ({files.length})</h4>
                                    <button
                                        onClick={() => setFiles([])}
                                        className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline"
                                    >
                                        Limpar Tudo
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                                    {files.map((queued) => (
                                        <div
                                            key={queued.id}
                                            className="group bg-bg-main/50 border border-border-main/10 p-4 rounded-3xl flex items-center gap-4 animate-in slide-in-from-bottom-2 duration-300"
                                        >
                                            <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                                                <Files size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold truncate tracking-tight">{queued.file.name}</p>
                                                <p className="text-[9px] font-black opacity-30 uppercase tracking-widest">{formatSize(queued.file.size)}</p>
                                            </div>
                                            <button
                                                onClick={() => removeFile(queued.id)}
                                                className="p-2 hover:bg-red-500/10 text-red-500 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}

                                    <label className="block p-4 border-2 border-dashed border-border-main/10 rounded-3xl hover:border-text-main/20 transition-all cursor-pointer text-center group">
                                        <input type="file" accept=".pdf" multiple onChange={handleFiles} className="hidden" />
                                        <div className="flex items-center justify-center gap-2">
                                            <Plus size={16} className="opacity-40 group-hover:scale-110 transition-transform" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Adicionar mais</span>
                                        </div>
                                    </label>
                                </div>

                                <div className="mt-8 pt-8 border-t border-border-main/5 flex flex-col items-center gap-4">
                                    {!mergedBlob ? (
                                        <button
                                            onClick={runMerge}
                                            disabled={processing || files.length < 2}
                                            className={cn(
                                                "px-12 py-5 bg-text-main text-bg-main rounded-[24px] font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 min-w-[240px] justify-center",
                                                (processing || files.length < 2) && "opacity-50 cursor-not-allowed"
                                            )}
                                        >
                                            {processing ? <RefreshCw size={24} className="animate-spin" /> : <><Plus size={24} /> Mesclar Documentos</>}
                                        </button>
                                    ) : (
                                        <div className="flex flex-col items-center gap-4 w-full">
                                            <div className="flex items-center gap-3 text-green-500 scale-in mb-2">
                                                <CheckCircle2 size={24} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Tudo Pronto! {files.length} PDFs combinados</span>
                                            </div>
                                            <button
                                                onClick={download}
                                                className="w-full max-w-sm py-5 bg-green-500 text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                                            >
                                                <Download size={24} /> Baixar PDF Final
                                            </button>
                                            <button
                                                onClick={() => { setFiles([]); setMergedBlob(null); }}
                                                className="text-[10px] font-black opacity-30 hover:opacity-100 uppercase tracking-widest"
                                            >
                                                Começar de Novo
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
                            { title: 'Merge Sequencial', desc: 'Os arquivos são combinados na ordem em que aparecem na lista.' },
                            { title: 'Preservação de Layout', desc: 'Mantém fontes, imagens e hiperlinks originais dos documentos.' },
                            { title: 'Segurança Local', desc: 'O processamento ocorre inteiramente no seu navegador via pdf-lib.' }
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
                            <Plus size={20} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600/60">Dica</h4>
                            <p className="text-[10px] font-medium opacity-40 uppercase leading-relaxed tracking-wider">
                                Você precisa de pelo menos 2 arquivos para realizar a mesclagem.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scale-in {
                    0% { transform: scale(0.9); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .scale-in { animation: scale-in 0.3s ease-out forwards; }
            `}} />
        </div>
    );
}
