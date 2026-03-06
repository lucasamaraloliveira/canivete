"use client";

import React, { useState, useMemo } from 'react';
import { Package, AlertTriangle, Check, Info, ArrowUpRight, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Dependency {
    name: string;
    version: string;
    size: string;
    alternative?: { name: string, benefit: string };
    risk?: 'low' | 'medium' | 'high';
}

const KNOWLEDGE_BASE: Record<string, { size: string, alt?: string, altBenefit?: string }> = {
    'moment': { size: '280kB', alt: 'dayjs', altBenefit: 'Redução de 98% no tamanho (apenas 2kB)' },
    'lodash': { size: '70kB', alt: 'lodash-es', altBenefit: 'Melhor tree-shaking para bundles modernos' },
    'axios': { size: '30kB', alt: 'fetch', altBenefit: 'Nativo do navegador, zero dependências' },
    'jquery': { size: '30kB', alt: 'Vanilla JS', altBenefit: 'DOM APIs modernas substituem a maioria dos casos' },
    'react-syntax-highlighter': { size: '120kB', alt: 'shiki', altBenefit: 'Melhor performance e temas' },
};

export function PackageJsonAnalyzer() {
    const [json, setJson] = useState('{\n  "dependencies": {\n    "react": "^18.0.0",\n    "moment": "^2.29.0",\n    "lodash": "^4.17.21",\n    "axios": "^1.2.0"\n  }\n}');

    const analysis = useMemo(() => {
        try {
            const parsed = JSON.parse(json);
            const deps = { ...parsed.dependencies, ...parsed.devDependencies };
            const results: Dependency[] = [];

            for (const name in deps) {
                const info = KNOWLEDGE_BASE[name];
                results.push({
                    name,
                    version: deps[name],
                    size: info?.size || '~15kB',
                    alternative: info?.alt ? { name: info.alt, benefit: info.altBenefit! } : undefined,
                    risk: info?.alt ? 'medium' : 'low'
                });
            }
            return results;
        } catch (e) {
            return null;
        }
    }, [json]);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                        <Package size={14} /> Conteúdo do package.json
                    </label>
                    <textarea
                        value={json}
                        onChange={(e) => setJson(e.target.value)}
                        className="bg-text-main/5 border border-border-main rounded-[24px] p-6 font-mono text-sm resize-none outline-none focus:ring-2 focus:ring-text-main/10 transition-all shadow-inner h-[400px]"
                        placeholder="Cole seu package.json aqui..."
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                        <Search size={14} /> Resultados da Análise
                    </label>
                    <div className="h-[400px] bg-text-main/[0.02] border border-border-main border-dashed rounded-[32px] overflow-hidden">
                        <div className="h-full overflow-y-auto custom-scrollbar p-6 space-y-4 pr-4">
                            {!analysis ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-30 italic p-12 text-center">
                                    <AlertTriangle size={32} className="mb-2" />
                                    <p>JSON inválido ou aguardando entrada...</p>
                                </div>
                            ) : (
                                analysis.map(dep => (
                                    <div key={dep.name} className="p-6 bg-card-main border border-border-main rounded-[24px] shadow-sm group hover:shadow-md transition-all">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-black text-sm">{dep.name}</h4>
                                                <span className="text-[10px] font-mono opacity-40">{dep.version}</span>
                                            </div>
                                            <span className="text-[10px] font-black px-2 py-0.5 bg-text-main/5 rounded-full">{dep.size}</span>
                                        </div>

                                        {dep.alternative && (
                                            <div className="mt-4 p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl">
                                                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-1">
                                                    <AlertTriangle size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Otimização Sugerida</span>
                                                </div>
                                                <p className="text-xs font-bold">Considere trocar por <span className="underline">{dep.alternative.name}</span></p>
                                                <p className="text-[10px] opacity-60 italic mt-1">{dep.alternative.benefit}</p>
                                            </div>
                                        )}

                                        {!dep.alternative && (
                                            <div className="mt-4 flex items-center gap-2 text-green-500">
                                                <Check size={14} />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Nenhuma alternativa crítica encontrada</span>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-text-main text-bg-main rounded-[32px] flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Info size={24} />
                    <div>
                        <h4 className="font-bold text-sm">Privacidade Total</h4>
                        <p className="text-[10px] opacity-80 italic">O arquivo é analisado localmente. Seus dados nunca saem do navegador.</p>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest leading-tight">Total de</p>
                        <p className="text-lg font-black leading-tight">Sugestões</p>
                    </div>
                    <div className="text-4xl font-black">{analysis?.filter(d => d.alternative).length || 0}</div>
                </div>
            </div>
        </div>
    );
}
