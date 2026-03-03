'use client';

import React, { useState } from 'react';
import { FileUp, Scissors, Trash2, CheckCircle2, RefreshCw, ShieldCheck, Download, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PDFDocument } from 'pdf-lib';

export function PdfSplitter() {
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [done, setDone] = useState(false);
    const [range, setRange] = useState('');
    const [splitBlobs, setSplitBlobs] = useState<Blob[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f && f.type === 'application/pdf') {
            setFile(f);
            setDone(false);
            setSplitBlobs([]);
            setError(null);
        }
    };

    const runSplit = async () => {
        if (!file || !range.trim()) return;
        setProcessing(true);
        setError(null);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const sourcePdf = await PDFDocument.load(arrayBuffer);
            const totalPages = sourcePdf.getPageCount();

            // Simple range parsing: "1-3, 5, 7-10"
            const pagesToExtract = parseRange(range, totalPages);
            if (pagesToExtract.length === 0) {
                throw new Error('Intervalo inválido ou fora do limite.');
            }

            const newPdf = await PDFDocument.create();
            const copiedPages = await newPdf.copyPages(sourcePdf, pagesToExtract.map(p => p - 1));
            copiedPages.forEach(page => newPdf.addPage(page));

            const pdfBytes = await newPdf.save();
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });

            setSplitBlobs([blob]);
            setDone(true);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Erro ao processar o PDF.');
        } finally {
            setProcessing(false);
        }
    };

    const parseRange = (input: string, max: number): number[] => {
        const result: number[] = [];
        const parts = input.split(',').map(p => p.trim());

        for (const part of parts) {
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(Number);
                if (!isNaN(start) && !isNaN(end)) {
                    for (let i = start; i <= end; i++) {
                        if (i >= 1 && i <= max) result.push(i);
                    }
                }
            } else {
                const num = Number(part);
                if (!isNaN(num) && num >= 1 && num <= max) result.push(num);
            }
        }
        return [...new Set(result)].sort((a, b) => a - b);
    };

    const download = () => {
        if (splitBlobs.length === 0) return;
        const url = URL.createObjectURL(splitBlobs[0]);
        const a = document.createElement('a');
        a.href = url;
        a.download = `extraido_${file?.name}`;
        a.click();
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + ['B', 'KB', 'MB', 'GB'][i];
    };

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">Dividir PDF</h2>
                    <p className="opacity-40 text-sm font-medium">Extraia páginas ou separe intervalos de um PDF localmente.</p>
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
                                    <FileUp size={48} className="opacity-20" />
                                </div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Selecione o PDF</h3>
                                <p className="text-[10px] font-bold opacity-30 uppercase tracking-[3px] mb-8">Arraste ou clique para carregar</p>
                                <input
                                    type="file" accept=".pdf" onChange={handleFile}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <div className="px-8 py-3 bg-text-main text-bg-main rounded-2xl font-black uppercase tracking-widest shadow-xl">
                                    Procurar Arquivo
                                </div>
                            </>
                        ) : (
                            <div className="w-full flex flex-col gap-8 animate-in zoom-in-95 duration-300">
                                <div className="flex items-center gap-6 bg-text-main/5 p-6 rounded-3xl">
                                    <div className="w-16 h-16 bg-red-500 text-white rounded-2xl flex items-center justify-center shrink-0">
                                        <FileText size={32} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-lg font-black uppercase tracking-tight truncate">{file.name}</h4>
                                        <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">{formatSize(file.size)}</p>
                                    </div>
                                    <button onClick={() => setFile(null)} className="p-2 hover:bg-red-500/10 text-red-500 rounded-xl"><Trash2 size={20} /></button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[3px] opacity-30 ml-2">Intervalo de Páginas</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: 1-5, 8, 11-15"
                                            value={range}
                                            onChange={(e) => setRange(e.target.value)}
                                            className="w-full mt-2 bg-bg-main/50 border-2 border-border-main/10 rounded-[24px] py-4 px-6 text-sm font-bold placeholder:opacity-20 outline-none focus:border-text-main/20 transition-all"
                                        />
                                    </div>

                                    {!done ? (
                                        <button
                                            onClick={runSplit}
                                            disabled={processing || !range.trim()}
                                            className={cn(
                                                "w-full py-5 bg-text-main text-bg-main rounded-[24px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3",
                                                (processing || !range.trim()) && "opacity-50 cursor-not-allowed"
                                            )}
                                        >
                                            {processing ? <RefreshCw size={24} className="animate-spin" /> : <><Scissors size={24} /> Extrair Páginas</>}
                                        </button>
                                    ) : (
                                        <div className="flex flex-col items-center gap-4 w-full">
                                            <div className="flex items-center gap-3 text-green-500 mb-4 animate-in fade-in slide-in-from-top-2">
                                                <CheckCircle2 size={24} />
                                                <span className="text-sm font-black uppercase tracking-widest">Extração Concluída!</span>
                                            </div>
                                            <button
                                                onClick={download}
                                                className="w-full py-5 bg-green-500 text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3"
                                            >
                                                <Download size={24} /> Baixar PDF Extraído
                                            </button>
                                            <button
                                                onClick={() => { setDone(false); setSplitBlobs([]); }}
                                                className="text-[10px] font-black opacity-30 hover:opacity-100 uppercase tracking-widest"
                                            >
                                                Extrair Outro Intervalo
                                            </button>
                                        </div>
                                    )}

                                    {error && (
                                        <p className="text-center text-xs font-bold text-red-500 uppercase tracking-wider">{error}</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Instruções</label>
                    <div className="bg-card-main border border-border-main p-8 rounded-[40px] shadow-sm flex flex-col gap-6">
                        {[
                            { title: 'Formato de Intervalo', desc: 'Use hífens para intervalos (1-5) e vírgulas para páginas soltas (1,3,7).' },
                            { title: 'Zero Perda de Qualidade', desc: 'As páginas são extraídas sem recomprimir imagens ou alterar fontes.' },
                            { title: 'Processamento Privado', desc: 'Diferente de sites online, o PDF nunca sai do seu computador.' }
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
