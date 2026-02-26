'use client';

import React, { useState } from 'react';
import { Layout, Copy, Check, Sliders, RefreshCw, Box, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CodeBlock } from '../CodeBlock';
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
                    "w-full p-2.5 bg-text-main/5 border border-border-main rounded-xl text-[10px] font-black uppercase tracking-widest outline-none flex items-center justify-between transition-all hover:bg-text-main/10",
                    isOpen && "ring-2 ring-text-main/10 border-text-main/20 bg-text-main/10"
                )}
            >
                <span className="truncate pr-2">{selectedLabel}</span>
                <ChevronDown size={14} className={cn("shrink-0 opacity-30 group-hover/select:opacity-100 transition-all", isOpen && "rotate-180 opacity-100")} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-card-main/90 backdrop-blur-xl border border-border-main rounded-2xl shadow-2xl z-20 overflow-hidden py-2 min-w-[160px]"
                        >
                            {options.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest transition-all relative overflow-hidden",
                                        value === opt.value
                                            ? "bg-text-main text-bg-main"
                                            : "text-text-main/60 hover:bg-text-main/5 hover:text-text-main hover:pl-6"
                                    )}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

export function GridFlexGenerator() {
    const [mode, setMode] = useState<'grid' | 'flex'>('grid');
    const [cols, setCols] = useState(3);
    const [rows, setRows] = useState(2);
    const [gap, setGap] = useState(16);
    const [justify, setJustify] = useState('center');
    const [align, setAlign] = useState('center');
    const [itemCount, setItemCount] = useState(6);
    const [copied, setCopied] = useState(false);

    const generateCss = () => {
        if (mode === 'grid') {
            return `.container {
    display: grid;
    grid-template-columns: repeat(${cols}, 1fr);
    grid-template-rows: repeat(${rows}, 1fr);
    gap: ${gap}px;
    justify-items: ${justify};
    align-items: ${align};
    width: 100%;
    min-height: 300px;
}`;
        }
        return `.container {
    display: flex;
    flex-wrap: wrap;
    gap: ${gap}px;
    justify-content: ${justify};
    align-items: ${align};
    width: 100%;
    min-height: 300px;
}`;
    };

    const copyCode = () => {
        navigator.clipboard.writeText(generateCss());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-0">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Configuração de Layout</label>
                    <div className="flex p-1 bg-text-main/5 rounded-xl border border-border-main/5">
                        <button
                            onClick={() => setMode('grid')}
                            className={cn(
                                "px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                                mode === 'grid' ? "bg-text-main text-bg-main shadow-lg" : "text-text-main/40 hover:text-text-main"
                            )}
                        >
                            Grid
                        </button>
                        <button
                            onClick={() => setMode('flex')}
                            className={cn(
                                "px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                                mode === 'flex' ? "bg-text-main text-bg-main shadow-lg" : "text-text-main/40 hover:text-text-main"
                            )}
                        >
                            Flex
                        </button>
                    </div>
                </div>

                <div className="space-y-6 bg-card-main border border-border-main p-6 rounded-[32px] shadow-sm">
                    {mode === 'grid' ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest opacity-30">Colunas ({cols})</label>
                                <input type="range" min="1" max="12" value={cols} onChange={(e) => setCols(parseInt(e.target.value))} className="w-full" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest opacity-30">Linhas ({rows})</label>
                                <input type="range" min="1" max="12" value={rows} onChange={(e) => setRows(parseInt(e.target.value))} className="w-full" />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-30">Número de Itens ({itemCount})</label>
                            <input type="range" min="1" max="20" value={itemCount} onChange={(e) => setItemCount(parseInt(e.target.value))} className="w-full" />
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-30">Espaçamento (Gap: {gap}px)</label>
                        <input type="range" min="0" max="100" value={gap} onChange={(e) => setGap(parseInt(e.target.value))} className="w-full" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-30">Justificar</label>
                            <CustomSelect
                                value={justify}
                                onChange={setJustify}
                                options={[
                                    { label: 'Start', value: 'start' },
                                    { label: 'Center', value: 'center' },
                                    { label: 'End', value: 'end' },
                                    { label: 'Stretch', value: 'stretch' },
                                    { label: 'Space Between', value: 'space-between' },
                                    { label: 'Space Around', value: 'space-around' },
                                ]}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-30">Alinhar</label>
                            <CustomSelect
                                value={align}
                                onChange={setAlign}
                                options={[
                                    { label: 'Start', value: 'start' },
                                    { label: 'Center', value: 'center' },
                                    { label: 'End', value: 'end' },
                                    { label: 'Stretch', value: 'stretch' },
                                ]}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Código CSS</label>
                    <div className="h-48 bg-[#1e1e1e] rounded-[32px] overflow-auto custom-scrollbar shadow-inner relative group">
                        <CodeBlock code={generateCss()} language="css" className="w-full" />
                        <button
                            onClick={copyCode}
                            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-white transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2 text-xs font-bold"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? 'Copiado' : 'Copiar'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Preview Dinâmico</label>
                <div className="flex-1 bg-text-main/5 border border-border-main border-dashed border-2 rounded-[40px] p-6 relative flex flex-col items-center justify-center overflow-auto custom-scrollbar shadow-inner bg-grid-pattern overflow-x-hidden">
                    <div
                        style={mode === 'grid' ? {
                            display: 'grid',
                            gridTemplateColumns: `repeat(${cols}, 1fr)`,
                            gridTemplateRows: `repeat(${rows}, 1fr)`,
                            gap: `${gap}px`,
                            justifyItems: justify,
                            alignItems: align,
                            width: '100%',
                            minHeight: '400px'
                        } : {
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: `${gap}px`,
                            justifyContent: justify,
                            alignItems: align,
                            width: '100%',
                            minHeight: '400px'
                        }}
                        className="bg-card-main/30 backdrop-blur-sm p-8 rounded-[32px] border border-border-main/10 shadow-lg animate-in fade-in duration-500"
                    >
                        {Array.from({ length: mode === 'grid' ? cols * rows : itemCount }).map((_, i) => (
                            <div
                                key={i}
                                className="w-16 h-16 sm:w-20 sm:h-20 bg-text-main text-bg-main rounded-2xl flex items-center justify-center font-black shadow-xl animate-in zoom-in-50 duration-300"
                                style={{
                                    transitionDelay: `${i * 30}ms`,
                                    background: `hsl(${(i * 45) % 360}, 70%, 50%)`
                                }}
                            >
                                {i + 1}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
