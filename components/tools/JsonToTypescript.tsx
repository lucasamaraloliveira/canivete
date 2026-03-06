"use client";

import React, { useState, useCallback } from 'react';
import { Copy, Check, RotateCcw, AlertTriangle, Braces } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';

export function JsonToTypescript() {
    const [json, setJson] = useState('{\n  "id": 1,\n  "name": "João Silva",\n  "active": true,\n  "roles": ["admin", "user"],\n  "metadata": {\n    "lastLogin": "2024-03-01T10:00:00Z"\n  }\n}');
    const [output, setOutput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const generateTypes = useCallback(() => {
        try {
            setError(null);
            const obj = JSON.parse(json);

            const processObject = (val: any, name: string = 'RootObject'): string => {
                if (Array.isArray(val)) {
                    if (val.length === 0) return 'any[]';
                    const types = new Set(val.map(item => {
                        const type = typeof item;
                        if (type === 'object' && item !== null) return processObject(item, 'Item');
                        return type;
                    }));
                    return `${Array.from(types).join(' | ')}[]`;
                }

                if (typeof val === 'object' && val !== null) {
                    let res = '{\n';
                    for (const key in val) {
                        const type = typeof val[key];
                        if (type === 'object' && val[key] !== null) {
                            res += `  ${key}: ${processObject(val[key], key.charAt(0).toUpperCase() + key.slice(1))};\n`;
                        } else {
                            res += `  ${key}: ${type};\n`;
                        }
                    }
                    res += '}';
                    return res;
                }

                return typeof val;
            };

            let finalOutput = `export interface RootObject ${processObject(obj)}`;
            setOutput(finalOutput);
        } catch (e: any) {
            setError(e.message);
        }
    }, [json]);

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6 flex flex-col h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
                <div className="flex flex-col gap-4 h-full">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                            <Braces size={14} /> Entrada JSON
                        </label>
                        <button
                            onClick={() => setJson('')}
                            className="p-1.5 hover:bg-text-main/5 rounded-lg transition-colors"
                        >
                            <RotateCcw size={14} />
                        </button>
                    </div>
                    <textarea
                        value={json}
                        onChange={(e) => setJson(e.target.value)}
                        placeholder='Cole seu JSON aqui...'
                        className="flex-1 bg-text-main/5 border border-border-main rounded-[24px] p-6 font-mono text-sm resize-none outline-none focus:ring-2 focus:ring-text-main/10 transition-all min-h-[300px]"
                    />
                </div>

                <div className="flex flex-col gap-4 h-full">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Saída TypeScript</label>
                        {output && (
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-2 px-4 py-1.5 bg-text-main text-bg-main rounded-xl text-xs font-bold transition-all active:scale-95"
                            >
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                {copied ? 'Copiado' : 'Copiar'}
                            </button>
                        )}
                    </div>
                    <div className="flex-1 bg-text-main/[0.02] border border-border-main border-dashed rounded-[24px] overflow-hidden font-mono text-sm relative">
                        {error ? (
                            <div className="flex flex-col items-center justify-center h-full text-red-500 p-6 gap-3">
                                <AlertTriangle size={32} />
                                <p className="font-bold text-center">{error}</p>
                            </div>
                        ) : output ? (
                            <SyntaxHighlighter
                                language="typescript"
                                style={vscDarkPlus}
                                customStyle={{
                                    margin: 0,
                                    padding: '24px',
                                    height: '100%',
                                    background: 'transparent'
                                }}
                            >
                                {output}
                            </SyntaxHighlighter>
                        ) : (
                            <div className="flex items-center justify-center h-full opacity-30 italic p-6">
                                A saída aparecerá aqui...
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <button
                onClick={generateTypes}
                className="w-full py-6 bg-text-main text-bg-main rounded-[24px] font-black uppercase tracking-[4px] text-sm shadow-xl active:scale-95 transition-all"
            >
                Gerar Interfaces TypeScript
            </button>
        </div>
    );
}
