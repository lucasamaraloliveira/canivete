"use client";

import React, { useState } from 'react';
import { Layout, Copy, Check, Info, ArrowRight, ArrowDown, Maximize, Minimize, Settings2, Box } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CustomSelect } from '../CustomSelect';

const FLEX_DIRECTIONS = [
    { value: 'row', label: 'Row (Horizontal)' },
    { value: 'row-reverse', label: 'Row Reverse' },
    { value: 'column', label: 'Column (Vertical)' },
    { value: 'column-reverse', label: 'Column Reverse' },
];

const JUSTIFY_CONTENT = [
    { value: 'flex-start', label: 'Flex Start' },
    { value: 'center', label: 'Center' },
    { value: 'flex-end', label: 'Flex End' },
    { value: 'space-between', label: 'Space Between' },
    { value: 'space-around', label: 'Space Around' },
    { value: 'space-evenly', label: 'Space Evenly' },
];

const ALIGN_ITEMS = [
    { value: 'flex-start', label: 'Flex Start' },
    { value: 'center', label: 'Center' },
    { value: 'flex-end', label: 'Flex End' },
    { value: 'stretch', label: 'Stretch' },
    { value: 'baseline', label: 'Baseline' },
];

const FLEX_WRAP = [
    { value: 'nowrap', label: 'No Wrap' },
    { value: 'wrap', label: 'Wrap' },
    { value: 'wrap-reverse', label: 'Wrap Reverse' },
];

export function FlexboxSim() {
    const [direction, setDirection] = useState('row');
    const [justify, setJustify] = useState('flex-start');
    const [align, setAlign] = useState('flex-start');
    const [wrap, setWrap] = useState('nowrap');
    const [gap, setGap] = useState(16);
    const [itemCount, setItemCount] = useState(4);
    const [copied, setCopied] = useState(false);

    const cssCode = `.container {
  display: flex;
  flex-direction: ${direction};
  justify-content: ${justify};
  align-items: ${align};
  flex-wrap: ${wrap};
  gap: ${gap}px;
}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(cssCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8 flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
                {/* Controls Sidebar */}
                <div className="lg:col-span-1 border border-border-main/5 bg-text-main/5 rounded-[40px] p-8 space-y-8 overflow-y-auto custom-scrollbar shadow-inner max-h-[700px]">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                            <Settings2 size={14} /> Propriedades do Container
                        </label>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <span className="text-[10px] font-bold opacity-40 uppercase tracking-wider">Flex Direction</span>
                                <CustomSelect
                                    value={direction}
                                    onChange={setDirection}
                                    options={FLEX_DIRECTIONS}
                                />
                            </div>

                            <div className="space-y-2">
                                <span className="text-[10px] font-bold opacity-40 uppercase tracking-wider">Justify Content</span>
                                <CustomSelect
                                    value={justify}
                                    onChange={setJustify}
                                    options={JUSTIFY_CONTENT}
                                />
                            </div>

                            <div className="space-y-2">
                                <span className="text-[10px] font-bold opacity-40 uppercase tracking-wider">Align Items</span>
                                <CustomSelect
                                    value={align}
                                    onChange={setAlign}
                                    options={ALIGN_ITEMS}
                                />
                            </div>

                            <div className="space-y-2">
                                <span className="text-[10px] font-bold opacity-40 uppercase tracking-wider">Flex Wrap</span>
                                <CustomSelect
                                    value={wrap}
                                    onChange={setWrap}
                                    options={FLEX_WRAP}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                                    <span className="opacity-40">Gap: {gap}px</span>
                                </div>
                                <input
                                    type="range" min="0" max="64" value={gap}
                                    onChange={(e) => setGap(parseInt(e.target.value))}
                                    className="w-full h-1 bg-text-main/10 rounded-lg appearance-none cursor-pointer accent-text-main"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                                    <span className="opacity-40">Items: {itemCount}</span>
                                </div>
                                <input
                                    type="range" min="1" max="12" value={itemCount}
                                    onChange={(e) => setItemCount(parseInt(e.target.value))}
                                    className="w-full h-1 bg-text-main/10 rounded-lg appearance-none cursor-pointer accent-text-main"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview Area */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <div className="h-[400px] bg-text-main/[0.02] border border-border-main border-dashed rounded-[56px] p-8 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-40" />
                        <div
                            className="w-full h-full flex flex-wrap gap-4 items-center justify-center overflow-auto custom-scrollbar relative z-10 p-4"
                            style={{
                                display: 'flex',
                                flexDirection: direction as any,
                                justifyContent: justify,
                                alignItems: align,
                                flexWrap: wrap as any,
                                gap: `${gap}px`
                            }}
                        >
                            {Array.from({ length: itemCount }).map((_, i) => (
                                <div
                                    key={i}
                                    className="w-24 h-24 bg-text-main text-bg-main rounded-3xl flex items-center justify-center font-black text-2xl shadow-2xl transform hover:scale-110 transition-all cursor-default select-none border border-bg-main/20"
                                >
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Output Code */}
                    <div className="p-8 bg-card-main border border-border-main rounded-[40px] shadow-sm relative group">
                        <button
                            onClick={handleCopy}
                            className="absolute top-8 right-8 p-3 bg-text-main text-bg-main rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl z-20"
                        >
                            {copied ? <Check size={20} /> : <Copy size={20} />}
                        </button>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                                <Box size={14} /> CSS Gerado
                            </label>
                            <pre className="font-mono text-sm leading-relaxed opacity-90 p-4 bg-text-main/5 rounded-2xl overflow-x-auto custom-scrollbar">
                                {cssCode}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tip Section */}
            <div className="p-6 bg-purple-500/5 border border-purple-500/10 rounded-[32px] flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center shrink-0">
                    <Layout size={20} />
                </div>
                <div className="space-y-0.5">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-purple-500">Design Tip</h4>
                    <p className="text-[10px] font-medium opacity-60 uppercase leading-relaxed tracking-[0.5px]">
                        Use justify-content para alinhar itens no eixo principal e align-items para o eixo transversal. Flexbox é ideal para layouts unidimensionais.
                    </p>
                </div>
            </div>
        </div>
    );
}
