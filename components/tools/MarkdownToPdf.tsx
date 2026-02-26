'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Edit3, Type, Settings2, FileDown, Layers, Layout, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { marked } from 'marked';

export function MarkdownToPdf() {
    const [markdown, setMarkdown] = useState('# Nova Documentação\n\nEste é um exemplo de documento formatado para exportação em PDF.\n\n### Características:\n* Renderização local\n* Estilos de impressão otimizados\n* Suporte a tabelas e listas\n\n| Item | Status |\n|---|---|\n| PDF | OK |\n| Design | Premium |\n\n> "A simplicidade é o último grau de sofisticação." - Leonardo da Vinci');
    const [html, setHtml] = useState('');
    const [fontSize, setFontSize] = useState(16);
    const [theme, setTheme] = useState('modern');

    useEffect(() => {
        const render = async () => {
            const parsed = await marked.parse(markdown);
            setHtml(parsed);
        };
        render();
    }, [markdown]);

    const handleExport = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(`
            <html>
                <head>
                    <title>Markdown Export</title>
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap" rel="stylesheet">
                    <style>
                        body { 
                            font-family: 'Inter', sans-serif; 
                            line-height: 1.6; 
                            padding: 2cm; 
                            max-width: 800px; 
                            margin: 0 auto;
                            color: #1a1a1a;
                            font-size: ${fontSize}px;
                        }
                        h1, h2, h3 { font-family: 'Playfair Display', serif; margin-top: 1.5em; }
                        h1 { border-bottom: 2px solid #eee; padding-bottom: 0.5em; }
                        blockquote { 
                            border-left: 4px solid #eee; 
                            margin: 1.5em 0; 
                            padding-left: 1em; 
                            font-style: italic; 
                            color: #666;
                        }
                        table { width: 100%; border-collapse: collapse; margin: 1.5em 0; }
                        th, td { border: 1px solid #eee; padding: 0.75em; text-align: left; }
                        th { bg-color: #f9f9f9; }
                        code { background: #f4f4f4; padding: 0.2em 0.4em; border-radius: 3px; font-family: monospace; }
                        img { max-width: 100%; }
                        @media print {
                            body { padding: 0; }
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    ${html}
                    <script>
                        window.onload = () => {
                            window.print();
                            window.onafterprint = () => window.close();
                        }
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider flex items-center gap-2">
                            <Edit3 size={16} /> Markdown Editor
                        </label>
                        <span className="text-[10px] font-black opacity-30 uppercase tracking-[2px]">{markdown.length} CHARS</span>
                    </div>
                    <div className="flex-1 bg-card-main border border-border-main rounded-[48px] shadow-2xl overflow-hidden flex flex-col relative group">
                        <textarea
                            value={markdown}
                            onChange={(e) => setMarkdown(e.target.value)}
                            placeholder="Escreva seu markdown aqui..."
                            className="flex-1 bg-transparent p-12 text-lg font-medium leading-relaxed placeholder:opacity-10 outline-none resize-none custom-scrollbar"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider flex items-center gap-2">
                            <Eye size={16} /> Preview p/ Impressão
                        </label>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleExport}
                                className="bg-text-main text-bg-main px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
                            >
                                <FileDown size={14} /> Exportar PDF
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 bg-white rounded-[48px] shadow-2xl overflow-hidden flex flex-col relative border-4 border-text-main/5 min-h-0">
                        <div className="absolute inset-x-0 top-0 h-12 bg-text-main/5 flex items-center px-8 border-b border-text-main/5">
                            <div className="flex gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-red-400" />
                                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                <div className="w-2 h-2 rounded-full bg-green-400" />
                            </div>
                        </div>
                        <div
                            className="flex-1 p-12 mt-12 overflow-auto custom-scrollbar prose prose-sm max-w-none text-slate-800"
                            style={{ fontSize: `${fontSize}px` }}
                            dangerouslySetInnerHTML={{ __html: html }}
                        />

                        {/* Control panel floating inside preview */}
                        <div className="absolute bottom-8 right-8 bg-card-main/80 backdrop-blur-xl border border-border-main p-6 rounded-[32px] shadow-2xl flex flex-col gap-4 min-w-[240px]">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-[10px] font-black opacity-30 uppercase tracking-widest">
                                    <span>Tamanho da Fonte</span>
                                    <span>{fontSize}px</span>
                                </div>
                                <input
                                    type="range" min="12" max="24" step="1" value={fontSize}
                                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                                    className="w-full accent-text-main h-1.5 bg-text-main/10 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                            <div className="h-px bg-text-main/5" />
                            <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest leading-relaxed">
                                O PDF será gerado com quebras de página automáticas.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
