"use client";

import React, { useState, useRef } from 'react';
import { Camera, Download, RotateCcw, Monitor, Smartphone, Maximize, Palette, Type, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toPng } from 'html-to-image';
import { cn } from '@/lib/utils';

function CustomSelect({
    value,
    onChange,
    options
}: {
    value: string;
    onChange: (val: string) => void;
    options: { label: string; value: string }[]
}) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedLabel = options.find(o => o.value === value)?.label || value;

    return (
        <div className="relative group/select">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full p-4 bg-text-main/5 border border-border-main/10 rounded-xl text-xs font-bold outline-none flex items-center justify-between transition-all hover:bg-text-main/10",
                    isOpen && "ring-4 ring-text-main/5 border-text-main/20"
                )}
            >
                <span className="truncate pr-2">{selectedLabel}</span>
                <ChevronDown size={14} className={cn("shrink-0 opacity-30 group-hover/select:opacity-100 transition-all", isOpen && "rotate-180 opacity-100")} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-[60]"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-card-main/90 backdrop-blur-xl border border-border-main rounded-[24px] shadow-2xl z-[70] overflow-hidden py-3"
                        >
                            <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                {options.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => {
                                            onChange(opt.value);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "w-full px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest transition-all relative overflow-hidden",
                                            value === opt.value
                                                ? "bg-text-main text-bg-main"
                                                : "text-text-main/60 hover:bg-text-main/5 hover:text-text-main hover:pl-8"
                                        )}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

export function CarbonSnippet() {
    const [code, setCode] = useState('function helloWorld() {\n  console.log("Olá, Canivete!");\n}\n\nhelloWorld();');
    const [language, setLanguage] = useState('javascript');
    const [theme, setTheme] = useState('dark');
    const [background, setBackground] = useState('linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
    const [padding, setPadding] = useState(48);
    const [showWindowControls, setShowWindowControls] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    const downloadImage = async () => {
        if (!containerRef.current) return;

        try {
            const dataUrl = await toPng(containerRef.current, {
                pixelRatio: 2,
                cacheBust: true,
            });

            const link = document.createElement('a');
            link.download = `snippet-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Erro ao gerar imagem:', err);
        }
    };

    const backgrounds = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
        'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
        'linear-gradient(to top, #30cfd0 0%, #330867 100%)',
        'linear-gradient(to right, #434343 0%, black 100%)',
        'linear-gradient(45deg, #ee9ca7 0%, #ffdde1 100%)',
        '#1a1b26',
        '#ffffff'
    ];

    return (
        <div className="space-y-8 h-full flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
                {/* Configurações */}
                <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                            <Palette size={14} /> Fundo
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {backgrounds.map(bg => (
                                <button
                                    key={bg}
                                    onClick={() => setBackground(bg)}
                                    className={cn(
                                        "w-8 h-8 rounded-lg border-2 transition-all",
                                        background === bg ? "border-text-main scale-110 shadow-lg" : "border-transparent"
                                    )}
                                    style={{ background: bg }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                            <Type size={14} /> Linguagem
                        </label>
                        <CustomSelect
                            value={language}
                            onChange={setLanguage}
                            options={[
                                { label: 'JavaScript', value: 'javascript' },
                                { label: 'TypeScript', value: 'typescript' },
                                { label: 'React (JSX)', value: 'jsx' },
                                { label: 'React (TSX)', value: 'tsx' },
                                { label: 'CSS', value: 'css' },
                                { label: 'Python', value: 'python' },
                                { label: 'Rust', value: 'rust' },
                                { label: 'Go', value: 'go' },
                            ]}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                            <Monitor size={14} /> Tema
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setTheme('dark')}
                                className={cn(
                                    "py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all",
                                    theme === 'dark' ? "bg-text-main text-bg-main border-transparent" : "bg-text-main/5 border-border-main"
                                )}
                            >
                                Escuro
                            </button>
                            <button
                                onClick={() => setTheme('light')}
                                className={cn(
                                    "py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all",
                                    theme === 'light' ? "bg-text-main text-bg-main border-transparent" : "bg-text-main/5 border-border-main"
                                )}
                            >
                                Claro
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                            <Maximize size={14} /> Espaçamento ({padding}px)
                        </label>
                        <input
                            type="range"
                            min="16"
                            max="128"
                            value={padding}
                            onChange={(e) => setPadding(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-text-main/10 rounded-lg appearance-none cursor-pointer accent-text-main"
                        />
                    </div>
                </div>

                {/* Preview e Editor */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <div className="flex-1 bg-text-main/5 rounded-[32px] p-8 border border-border-main border-dashed flex items-center justify-center overflow-auto custom-scrollbar">
                        <div
                            ref={containerRef}
                            className="transition-all duration-300 shadow-2xl overflow-hidden"
                            style={{ background, padding: `${padding}px` }}
                        >
                            <div className={cn(
                                "rounded-xl overflow-hidden shadow-2xl min-w-[300px] lg:min-w-[500px]",
                                theme === 'dark' ? "bg-[#1e1e1e]" : "bg-white"
                            )}>
                                {showWindowControls && (
                                    <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5 bg-black/5">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                    </div>
                                )}
                                <SyntaxHighlighter
                                    language={language}
                                    style={theme === 'dark' ? vscDarkPlus : prism}
                                    customStyle={{
                                        margin: 0,
                                        padding: '24px',
                                        fontSize: '14px',
                                        background: 'transparent'
                                    }}
                                >
                                    {code}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    </div>

                    <div className="h-40 relative">
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full h-full bg-text-main/5 border border-border-main rounded-[24px] p-6 font-mono text-sm resize-none outline-none focus:ring-2 focus:ring-text-main/10"
                            placeholder="Insira seu código aqui..."
                        />
                        <button
                            onClick={downloadImage}
                            className="absolute bottom-4 right-4 bg-text-main text-bg-main px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
                        >
                            <Camera size={16} /> Tirar Foto
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
