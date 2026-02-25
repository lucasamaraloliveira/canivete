'use client';

import React, { useState, useMemo } from 'react';
import { Search, Info, AlertCircle } from 'lucide-react';

export function RegexVisualizer() {
    const [regex, setRegex] = useState('([a-z0-9_.-]+)@([\\da-z.-]+)\\.([a-z.]{2,6})');
    const [flags, setFlags] = useState('g');
    const [testText, setTestText] = useState('Contact us at support@example.com or news@tech-blog.org');
    const [error, setError] = useState<string | null>(null);

    const matches = useMemo(() => {
        if (!regex) return [];
        try {
            setError(null);
            const re = new RegExp(regex, flags);
            const results = [];
            let match;

            if (flags.includes('g')) {
                while ((match = re.exec(testText)) !== null) {
                    results.push({
                        text: match[0],
                        index: match.index,
                        groups: match.slice(1)
                    });
                    if (match.index === re.lastIndex) re.lastIndex++; // Avoid infinite loops
                }
            } else {
                match = re.exec(testText);
                if (match) {
                    results.push({
                        text: match[0],
                        index: match.index,
                        groups: match.slice(1)
                    });
                }
            }
            return results;
        } catch (e: any) {
            setError(e.message);
            return [];
        }
    }, [regex, flags, testText]);

    const highlightedText = useMemo(() => {
        if (!regex || error || matches.length === 0) return testText;

        let result = [];
        let lastIndex = 0;

        // Sort matches by index just in case
        const sortedMatches = [...matches].sort((a, b) => a.index - b.index);

        sortedMatches.forEach((match, i) => {
            // Text before match
            result.push(testText.substring(lastIndex, match.index));
            // The match itself
            result.push(
                <span key={i} className="bg-yellow-400/30 dark:bg-yellow-400/20 text-yellow-700 dark:text-yellow-400 px-0.5 rounded border border-yellow-400/30 font-bold decoration-wavy underline">
                    {match.text}
                </span>
            );
            lastIndex = match.index + match.text.length;
        });

        result.push(testText.substring(lastIndex));
        return result;
    }, [testText, matches, regex, error]);

    return (
        <div className="flex flex-col gap-6 h-full max-h-full overflow-hidden">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 shrink-0">
                <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-bold text-text-main/40 uppercase tracking-widest ml-1">Expressão Regular</label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-main/30 font-mono">/</span>
                            <input
                                value={regex}
                                onChange={(e) => setRegex(e.target.value)}
                                className="w-full py-3.5 pl-8 pr-4 font-mono text-sm bg-bg-main border border-border-main rounded-2xl focus:ring-2 focus:ring-text-main/10 outline-none"
                                placeholder="expressão..."
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-main/30 font-mono">/</span>
                        </div>
                        <input
                            value={flags}
                            onChange={(e) => setFlags(e.target.value)}
                            className="w-20 py-3.5 px-4 font-mono text-sm bg-bg-main border border-border-main rounded-2xl focus:ring-2 focus:ring-text-main/10 outline-none text-center"
                            placeholder="gim"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-bold text-text-main/40 uppercase tracking-widest ml-1">Texto de Teste</label>
                    <textarea
                        value={testText}
                        onChange={(e) => setTestText(e.target.value)}
                        className="w-full h-[110px] p-4 font-mono text-xs bg-bg-main border border-border-main rounded-2xl focus:ring-2 focus:ring-text-main/10 outline-none resize-none"
                        placeholder="Insira o texto para testar..."
                    />
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-hidden">
                <div className="flex items-center gap-2 text-text-main/40 ml-1">
                    <Search size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Visualização de Matches ({matches.length})</span>
                </div>

                <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-0 overflow-hidden">
                    <div className="bg-card-main border border-border-main rounded-[32px] p-6 lg:p-8 overflow-auto font-mono text-sm leading-relaxed whitespace-pre-wrap shadow-inner relative group custom-scrollbar">
                        {highlightedText}
                    </div>

                    <div className="bg-bg-main border border-border-main rounded-[32px] overflow-hidden flex flex-col">
                        <div className="p-3 border-b border-border-main bg-text-main/5 px-6">
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Grupos de Captura</span>
                        </div>
                        <div className="flex-1 overflow-auto p-4 space-y-3 custom-scrollbar">
                            {matches.length > 0 ? matches.map((m, i) => (
                                <div key={i} className="bg-card-main border border-border-main rounded-2xl p-4 shadow-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[9px] font-bold text-text-main/40 uppercase">Match {i + 1}</span>
                                        <span className="text-[9px] font-mono text-text-main/40">pos: {m.index}</span>
                                    </div>
                                    <p className="font-bold text-xs text-text-main mb-2 break-all">"{m.text}"</p>
                                    {m.groups.length > 0 && (
                                        <div className="space-y-1.5 pt-2 border-t border-border-main/5">
                                            {m.groups.map((group, gi) => (
                                                <div key={gi} className="flex items-start gap-2 text-[10px]">
                                                    <span className="px-1.5 py-0.5 bg-text-main/5 rounded text-[8px] font-black opacity-40 mt-0.5">${gi + 1}</span>
                                                    <span className="font-mono text-text-main/60 break-all">{group || <em className="opacity-30 italic">null</em>}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )) : (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                                    <Info size={32} className="mb-2" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest">Nenhum match</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
