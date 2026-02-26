'use client';

import React, { useState } from 'react';
import { Scissors, FileText, Printer, Trash2, Eye, Layout, Type, Settings2, Sparkles, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PrintWebClipper() {
    const [htmlInput, setHtmlInput] = useState('');
    const [cleanHtml, setCleanHtml] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    const cleanContent = () => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlInput, 'text/html');

        // Items to remove
        const selectorsToRemove = [
            'script', 'style', 'iframe', 'ads', '.ads', '#ads', 'nav', 'footer', 'header',
            'aside', '.sidebar', '#sidebar', '.comment', '#comment', 'button', 'input'
        ];

        selectorsToRemove.forEach(s => {
            doc.querySelectorAll(s).forEach(el => el.remove());
        });

        // Simplified content extraction
        const main = doc.querySelector('main') || doc.querySelector('article') || doc.body;
        setCleanHtml(main.innerHTML);
        setShowPreview(true);
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;
        printWindow.document.write(`
            <html>
                <head>
                    <title>Clipped Content</title>
                    <style>
                        body { font-family: sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; color: #1a1a1a; }
                        img { max-width: 100%; height: auto; }
                        @media print { body { margin: 0; } }
                    </style>
                </head>
                <body>${cleanHtml}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
                <div className="flex flex-col gap-6">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider flex items-center gap-2">
                        <Scissors size={16} /> Código-Fonte (HTML)
                    </label>
                    <div className="flex-1 bg-card-main border border-border-main rounded-[48px] shadow-2xl overflow-hidden flex flex-col relative">
                        <textarea
                            value={htmlInput}
                            onChange={(e) => setHtmlInput(e.target.value)}
                            placeholder="Inspecione o elemento no site desejado, clique com botão direito 'Copy outerHTML' e cole aqui..."
                            className="flex-1 bg-transparent p-12 text-sm font-mono leading-relaxed placeholder:opacity-10 outline-none resize-none custom-scrollbar"
                        />
                        <div className="p-8 pt-0">
                            <button
                                onClick={cleanContent}
                                disabled={!htmlInput}
                                className="w-full py-5 bg-text-main text-bg-main rounded-3xl font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-20"
                            >
                                <Sparkles size={24} /> Limpar e Formatar
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider flex items-center gap-2">
                            <Eye size={16} /> Resultado Limpo
                        </label>
                        <button
                            onClick={handlePrint}
                            disabled={!cleanHtml}
                            className="bg-blue-500 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2 disabled:opacity-0"
                        >
                            <Printer size={14} /> Imprimir PDF
                        </button>
                    </div>

                    <div className="flex-1 bg-white rounded-[48px] shadow-2xl overflow-hidden flex flex-col relative border-4 border-text-main/5">
                        {cleanHtml ? (
                            <div
                                className="flex-1 p-12 overflow-auto custom-scrollbar prose prose-sm max-w-none text-slate-800"
                                dangerouslySetInnerHTML={{ __html: cleanHtml }}
                            />
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center opacity-10 text-center p-12">
                                <FileText size={80} strokeWidth={1} />
                                <p className="mt-4 font-black uppercase tracking-widest">Aguardando Processamento</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-text-main/5 border border-border-main/10 p-8 rounded-[40px] flex gap-4">
                        <div className="w-10 h-10 bg-text-main text-bg-main rounded-2xl flex items-center justify-center shrink-0">
                            <Layout size={20} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-black uppercase tracking-widest">Como usar?</h4>
                            <p className="text-[10px] font-medium opacity-40 uppercase leading-relaxed tracking-wider">
                                Use o 'Inspecionar elemento' do seu navegador no artigo que quer salvar, copie o HTML e cole aqui para remover propagandas e scripts.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
