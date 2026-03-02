import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Sun, Moon, ChevronLeft, ChevronRight, FileText, Layers, RefreshCw, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import ePub, { Rendition } from 'epubjs';

export function EbookReader() {
    const [content, setContent] = useState<string | ArrayBuffer | null>(null);
    const [isEpub, setIsEpub] = useState(false);
    const [fileName, setFileName] = useState('');
    const [theme, setTheme] = useState<'light' | 'dark' | 'sepia'>('dark');
    const [fontSize, setFontSize] = useState(100); // 100% for epub
    const [lineHeight, setLineHeight] = useState(1.6);
    const [isLoading, setIsLoading] = useState(false);

    const viewerRef = useRef<HTMLDivElement>(null);
    const bookRef = useRef<any>(null);
    const renditionRef = useRef<Rendition | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsLoading(true);
            setFileName(file.name);
            const isEpubFile = file.name.endsWith('.epub');
            setIsEpub(isEpubFile);

            const reader = new FileReader();
            reader.onload = async (ev) => {
                const result = ev.target?.result;
                if (result) {
                    setContent(result as string);
                }
                setIsLoading(false);
            };

            if (isEpubFile) {
                reader.readAsArrayBuffer(file);
            } else {
                reader.readAsText(file);
            }
        }
    };

    useEffect(() => {
        if (isEpub && content && viewerRef.current) {
            viewerRef.current.innerHTML = '';
            const book = ePub(content as ArrayBuffer);
            bookRef.current = book;

            const rendition = book.renderTo(viewerRef.current, {
                width: '100%',
                height: '100%',
                flow: 'paginated',
                manager: 'default'
            });

            renditionRef.current = rendition;
            rendition.display();

            updateEpubStyles(rendition, theme, fontSize);

            return () => {
                if (bookRef.current) {
                    bookRef.current.destroy();
                }
            };
        }
    }, [content, isEpub, theme]); // theme here ensures it updates on change

    useEffect(() => {
        if (renditionRef.current && isEpub) {
            updateEpubStyles(renditionRef.current, theme, fontSize);
        }
    }, [theme, fontSize, isEpub]);

    const updateEpubStyles = (rendition: Rendition, currentTheme: string, currentSize: number) => {
        const colors = {
            dark: { bg: '#020617', text: '#e2e8f0' },
            sepia: { bg: '#f4ecd8', text: '#451a03' },
            light: { bg: '#ffffff', text: '#0f172a' }
        }[currentTheme as 'dark' | 'sepia' | 'light'];

        rendition.themes.register('custom', {
            body: {
                'background': 'transparent !important',
                'color': `${colors.text} !important`,
                'font-family': 'serif !important',
                'font-size': `${currentSize}% !important`,
                'line-height': `${lineHeight} !important`,
                'padding': '0 40px !important'
            }
        });
        rendition.themes.select('custom');
    };

    const nextChapter = () => renditionRef.current?.next();
    const prevChapter = () => renditionRef.current?.prev();

    const reset = () => {
        setContent(null);
        setFileName('');
        setIsEpub(false);
    };

    return (
        <div className="flex flex-col h-full transition-all duration-500 text-text-main">
            {!content ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 border-4 border-dashed border-text-main/10 rounded-[64px] group hover:border-text-main/20 transition-all">
                    <div className="w-32 h-32 bg-text-main/5 rounded-[48px] flex items-center justify-center mb-10 group-hover:scale-110 transition-all duration-500">
                        {isLoading ? <RefreshCw className="animate-spin text-text-main" size={48} /> : <BookOpen size={64} className="opacity-20 text-text-main" />}
                    </div>
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4 text-text-main">Ebook Reader</h2>
                    <p className="text-[10px] font-bold opacity-30 uppercase tracking-[4px] mb-12 text-center">Arraste ou carregue um arquivo .epub, .txt ou .md</p>
                    <div className="relative">
                        <input type="file" accept=".epub,.txt,.md" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                        <button className="px-12 py-5 bg-text-main text-bg-main rounded-[24px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
                            Abrir Livro
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-6 h-full animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <header className="flex items-center justify-between bg-card-main/30 backdrop-blur-md p-4 rounded-3xl border border-border-main/5">
                        <div className="flex items-center gap-4">
                            <button onClick={reset} className="p-2 hover:bg-text-main/10 rounded-xl transition-all">
                                <X size={20} className="opacity-50" />
                            </button>
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black uppercase tracking-[2px] opacity-30">Lendo agora</span>
                                <h3 className="text-xs font-bold truncate max-w-[200px]">{fileName}</h3>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {isEpub && (
                                <div className="flex bg-text-main/5 rounded-xl p-1 mr-2">
                                    <button onClick={prevChapter} className="p-2 hover:bg-text-main/10 rounded-lg"><ChevronLeft size={16} /></button>
                                    <button onClick={nextChapter} className="p-2 hover:bg-text-main/10 rounded-lg"><ChevronRight size={16} /></button>
                                </div>
                            )}

                            <div className="flex bg-text-main/5 p-1 rounded-2xl border border-border-main/5">
                                {[
                                    { id: 'light', icon: <Sun size={14} />, label: 'Claro' },
                                    { id: 'sepia', icon: <Layers size={14} />, label: 'Sépia' },
                                    { id: 'dark', icon: <Moon size={14} />, label: 'Escuro' }
                                ].map((t) => (
                                    <button
                                        key={t.id} onClick={() => setTheme(t.id as any)}
                                        className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                            theme === t.id ? "bg-text-main text-bg-main shadow-lg" : "hover:bg-text-main/10"
                                        )}
                                        title={t.label}
                                    >
                                        {t.icon}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
                        <div className={cn(
                            "lg:col-span-3 rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden relative border-2 transition-all duration-700 flex flex-col",
                            theme === 'dark' ? "bg-slate-950 border-white/5" : theme === 'sepia' ? "bg-[#f4ecd8] border-amber-900/10" : "bg-white border-slate-200"
                        )}>
                            {isEpub ? (
                                <div ref={viewerRef} className="flex-1 w-full h-full" />
                            ) : (
                                <div
                                    className="flex-1 p-12 sm:p-20 overflow-auto custom-scrollbar font-serif select-text outline-none whitespace-pre-wrap selection:bg-text-main selection:text-bg-main"
                                    style={{
                                        fontSize: `${isEpub ? fontSize : fontSize / 5}px`, // Adjust scale for TXT
                                        lineHeight: lineHeight,
                                        maxWidth: '850px',
                                        margin: '0 auto',
                                        color: theme === 'dark' ? '#e2e8f0' : theme === 'sepia' ? '#451a03' : '#0f172a'
                                    }}
                                >
                                    {content as string}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="bg-card-main/30 backdrop-blur-sm border border-border-main/5 p-8 rounded-[40px] shadow-sm flex flex-col gap-8">
                                <span className="text-[10px] font-black opacity-30 uppercase tracking-[3px]">Ajustes de Leitura</span>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-black opacity-30 uppercase tracking-widest">
                                        <span>Zoom / Escala</span>
                                        <span>{fontSize}%</span>
                                    </div>
                                    <input
                                        type="range" min="50" max="250" value={fontSize} onChange={e => setFontSize(parseInt(e.target.value))}
                                        className="w-full accent-text-main h-1.5 bg-text-main/10 rounded-full appearance-none cursor-pointer"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-black opacity-30 uppercase tracking-widest">
                                        <span>Espaçamento</span>
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
                                    Modo de leitura otimizado para o seu conforto.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
