'use client';

import React, { useState, useMemo } from 'react';
import * as diff from 'diff';
import { FileDiff, ArrowRight, RotateCcw } from 'lucide-react';

export function DiffChecker() {
    const [text1, setText1] = useState('{\n  "name": "canivete",\n  "version": "1.0.0",\n  "status": "active"\n}');
    const [text2, setText2] = useState('{\n  "name": "canivete-suico",\n  "version": "1.0.4",\n  "status": "ready",\n  "new_feature": true\n}');

    const changes = useMemo(() => {
        return diff.diffLines(text1, text2);
    }, [text1, text2]);

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[40%]">
                <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-main/40 ml-4">Texto Original</label>
                    <textarea
                        value={text1}
                        onChange={(e) => setText1(e.target.value)}
                        className="flex-1 p-6 font-mono text-xs bg-bg-main border border-border-main rounded-[28px] focus:ring-2 focus:ring-text-main/10 outline-none resize-none"
                        placeholder="Cole o texto original aqui..."
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-main/40 ml-4">Texto Modificado</label>
                    <textarea
                        value={text2}
                        onChange={(e) => setText2(e.target.value)}
                        className="flex-1 p-6 font-mono text-xs bg-bg-main border border-border-main rounded-[28px] focus:ring-2 focus:ring-text-main/10 outline-none resize-none"
                        placeholder="Cole o novo texto aqui..."
                    />
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-4 min-h-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 px-4 py-2 bg-text-main/5 rounded-xl border border-border-main/5 text-text-main/60">
                        <FileDiff size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Análise de Diferenças</span>
                    </div>
                    <button
                        onClick={() => { setText1(''); setText2(''); }}
                        className="p-2 hover:bg-text-main/5 rounded-xl text-text-main/40 hover:text-text-main transition-all"
                    >
                        <RotateCcw size={18} />
                    </button>
                </div>

                <div className="flex-1 bg-card-main border border-border-main rounded-[32px] overflow-auto p-8 shadow-inner">
                    <div className="font-mono text-sm space-y-0.5 min-w-full">
                        {changes.map((part, index) => {
                            const colorClass = part.added
                                ? 'bg-green-500/20 text-green-700 dark:text-green-400 border-l-4 border-green-500'
                                : part.removed
                                    ? 'bg-red-500/20 text-red-700 dark:text-red-400 border-l-4 border-red-500 line-through opacity-60'
                                    : 'text-text-main/60 opacity-40';

                            const prefix = part.added ? '+ ' : part.removed ? '- ' : '  ';

                            return (
                                <div
                                    key={index}
                                    className={`px-4 py-1 rounded-sm whitespace-pre-wrap ${colorClass}`}
                                >
                                    {part.value.split('\n').filter(line => line.length > 0 || part.value.includes('\n')).map((line, li) => (
                                        <div key={li} className="flex gap-4">
                                            <span className="w-4 shrink-0 opacity-40 select-none">{prefix}</span>
                                            <span>{line}</span>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
