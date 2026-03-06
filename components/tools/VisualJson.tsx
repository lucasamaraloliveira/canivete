"use client";

import React, { useState, useCallback } from 'react';
import { Braces, Copy, Check, Info, Trash2, ArrowUpRight, Search, Plus, Minus, Edit3, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function VisualJson() {
    const [json, setJson] = useState('{\n  "id": 1,\n  "name": "Canivete App",\n  "active": true,\n  "features": [\n    "Dev Tools",\n    "Design Tools",\n    "Security"\n  ],\n  "settings": {\n    "theme": "dark",\n    "notifications": false\n  }\n}');
    const [copied, setCopied] = useState(false);
    const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['root']));

    const toggleExpand = (path: string) => {
        const next = new Set(expandedPaths);
        if (next.has(path)) next.delete(path);
        else next.add(path);
        setExpandedPaths(next);
    };

    const renderTree = (data: any, path: string = 'root'): React.ReactNode => {
        const isExpanded = expandedPaths.has(path);
        const type = Array.isArray(data) ? 'array' : typeof data;

        if (data !== null && typeof data === 'object') {
            const keys = Object.keys(data);
            return (
                <div key={path} className="ml-4 space-y-1">
                    <div
                        onClick={() => toggleExpand(path)}
                        className="flex items-center gap-1 cursor-pointer hover:bg-text-main/5 px-2 py-0.5 rounded-lg transition-all group"
                    >
                        {isExpanded ? <ChevronDown size={14} className="opacity-40" /> : <ChevronRight size={14} className="opacity-40" />}
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-30">{Array.isArray(data) ? 'Array' : 'Object'} [{keys.length}]</span>
                    </div>
                    {isExpanded && (
                        <div className="border-l border-border-main/20 ml-2 space-y-1 animate-in fade-in slide-in-from-left-2 duration-300">
                            {keys.map(key => (
                                <div key={`${path}-${key}`} className="ml-4">
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-bold text-sm text-blue-500">{key}:</span>
                                        {renderTree(data[key], `${path}-${key}`)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        const valueColor =
            type === 'string' ? 'text-green-600 dark:text-green-400' :
                type === 'number' ? 'text-orange-600 dark:text-orange-400' :
                    type === 'boolean' ? 'text-purple-600 dark:text-purple-400' :
                        'text-gray-500';

        return (
            <span className={cn("font-mono text-sm leading-6 break-all", valueColor)}>
                {type === 'string' ? `"${data}"` : String(data)}
            </span>
        );
    };

    let parsed: any = null;
    let error: string | null = null;
    try {
        parsed = JSON.parse(json);
    } catch (e) {
        error = 'JSON Inválido';
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(json);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8 flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                {/* Editor Area */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                            <Braces size={14} /> Editor de JSON
                        </label>
                        <button
                            onClick={handleCopy}
                            className="p-2 bg-text-main/5 hover:bg-text-main/10 rounded-xl transition-all shadow-inner"
                        >
                            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                        </button>
                    </div>
                    <textarea
                        value={json}
                        onChange={(e) => setJson(e.target.value)}
                        className="h-[500px] bg-text-main/5 border border-border-main rounded-[32px] p-8 font-mono text-sm resize-none outline-none focus:ring-2 focus:ring-text-main/10 transition-all shadow-inner custom-scrollbar"
                        placeholder="Cole seu JSON aqui..."
                    />
                </div>

                {/* Tree Area */}
                <div className="flex flex-col gap-4 relative">
                    <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                            <Search size={14} /> Visualização em Árvore
                        </label>
                        {error && (
                            <span className="text-[10px] font-black bg-red-500/10 text-red-500 px-3 py-1 rounded-full uppercase tracking-widest shadow-xl italic animate-bounce">
                                {error}
                            </span>
                        )}
                    </div>
                    <div className="h-[500px] bg-text-main/[0.02] border border-border-main border-dashed rounded-[40px] p-8 overflow-hidden relative group shadow-inner">
                        <div className="h-full overflow-y-auto custom-scrollbar">
                            {parsed ? renderTree(parsed) : (
                                <div className="h-full flex items-center justify-center opacity-10">
                                    <p className="text-xl font-black uppercase tracking-widest">Aguardando entrada válida...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hint Section */}
            <div className="p-8 bg-text-main text-bg-main rounded-[40px] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-14 h-14 bg-bg-main text-text-main rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-all">
                        <ArrowUpRight size={28} />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg leading-tight uppercase tracking-tight italic">Navegação Estruturada</h4>
                        <p className="text-xs opacity-60 italic leading-snug tracking-tighter">
                            Explore objetos JSON aninhados com facilidade. Clique nos nós para expandir ou recolher a visualização.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1 relative z-10 text-right">
                    <p className="text-[10px] font-black uppercase tracking-[3px] opacity-40 leading-tight">Visualização de</p>
                    <p className="text-3xl font-black leading-tight italic tracking-tighter uppercase whitespace-nowrap">DADOS BRUTOS</p>
                </div>
            </div>
        </div>
    );
}
