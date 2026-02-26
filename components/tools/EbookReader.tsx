'use client';

import React, { useState, useRef } from 'react';
import { BookOpen, Type, Sun, Moon, Maximize2, Settings2, Sliders, ChevronLeft, ChevronRight, FileText, Upload, MousePointer2, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

export function EbookReader() {
    const [content, setContent] = useState<string>('');
    const [fileName, setFileName] = useState('');
    const [theme, setTheme] = useState<'light' | 'dark' | 'sepia'>('sepia');
    const [fontSize, setFontSize] = useState(18);
    const [lineHeight, setLineHeight] = useState(1.6);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (ev) => {
                setContent(ev.target?.result as string);
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className={cn(
            "flex flex-col gap-8 h-full transition-colors duration-500",
            theme === 'dark' ? "text-slate-200" : theme === 'sepia' ? "text-amber-900" : "text-slate-800"
        )}>
            {!content ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 border-4 border-dashed border-text-main/10 rounded-[64px] group hover:border-text-main/20 transition-all">
                    <div className="w-32 h-32 bg-text-main/5 rounded-[48px] flex items-center justify-center mb-10 group-hover:scale-110 transition-all duration-500">
                        <BookOpen size={64} className="opacity-20" />
                    </div>
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4">Seu próximo capítulo</h2>
                    <p className="text-[10px] font-bold opacity-30 uppercase tracking-[4px] mb-12">Carregue um arquivo .txt ou .md para começar</p>
                    <div className="relative">
                        <input type="file" accept=".txt,.md,.js,.css,.html" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                        <button className="px-12 py-5 bg-text-main text-bg-main rounded-[24px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
                            Abrir Livro
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-8 h-full animate-in fade-in duration-500">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setContent('')} className="p-2 hover:bg-text-main/5 rounded-xl transition-all opacity-40 hover:opacity-100">
                                <ChevronLeft size={20} />
                            </button>
                            <h3 className="text-sm font-black uppercase tracking-widest opacity-40 truncate max-w-xs">{fileName}</h3>
                        </div>
                        <div className="flex items-center gap-2 bg-text-main/5 p-1 rounded-2xl border border-border-main/5">
                            {[
                                { id: 'light', icon: <Sun size={14} />, bg: 'bg-white' },
                                { id: 'sepia', icon: <Layers size={14} />, bg: 'bg-[#f4ecd8]' },
                                { id: 'dark', icon: <Moon size={14} />, bg: 'bg-slate-900' }
                            ].map((t) => (
                                <button
                                    key={t.id} onClick={() => setTheme(t.id as any)}
                                    className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                        theme === t.id ? "bg-text-main text-bg-main shadow-lg" : "hover:bg-text-main/10"
                                    )}
                                >
                                    {t.icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 min-h-0">
                        <div className={cn(
                            "lg:col-span-3 rounded-[48px] shadow-2xl overflow-hidden relative border-4 transition-all duration-500",
                            theme === 'dark' ? "bg-slate-950 border-white/5" : theme === 'sepia' ? "bg-[#f4ecd8] border-amber-900/10" : "bg-white border-slate-200"
                        )}>
                            <div
                                className="h-full p-16 overflow-auto custom-scrollbar font-serif select-text outline-none whitespace-pre-wrap"
                                style={{
                                    fontSize: `${fontSize}px`,
                                    lineHeight: lineHeight,
                                    maxWidth: '800px',
                                    margin: '0 auto'
                                }}
                            >
                                {content}
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <label className="text-sm font-bold opacity-40 uppercase tracking-wider">Tipografia</label>
                            <div className="bg-card-main border border-border-main p-8 rounded-[40px] shadow-sm flex flex-col gap-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-black opacity-30 uppercase tracking-widest">
                                        <span>Tamanho do Texto</span>
                                        <span>{fontSize}px</span>
                                    </div>
                                    <input
                                        type="range" min="12" max="32" value={fontSize} onChange={e => setFontSize(parseInt(e.target.value))}
                                        className="w-full accent-text-main h-1.5 bg-text-main/10 rounded-full appearance-none cursor-pointer"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-black opacity-30 uppercase tracking-widest">
                                        <span>Entrelinha</span>
                                        <span>{lineHeight.toFixed(1)}</span>
                                    </div>
                                    <input
                                        type="range" min="1" max="2.5" step="0.1" value={lineHeight} onChange={e => setLineHeight(parseFloat(e.target.value))}
                                        className="w-full accent-text-main h-1.5 bg-text-main/10 rounded-full appearance-none cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="p-8 bg-text-main/5 rounded-[40px] border border-border-main/10 flex flex-col gap-4 mt-auto">
                                <div className="flex items-center gap-3 text-[10px] font-black opacity-30 uppercase tracking-widest">
                                    <FileText size={14} /> Foco Total
                                </div>
                                <p className="text-[10px] font-medium opacity-30 uppercase leading-relaxed tracking-wider">
                                    Interface limpa projetada para leitura prolongada e redução de fadiga ocular.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
