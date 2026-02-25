'use client';

import React, { useState, useEffect } from 'react';
import yaml from 'js-yaml';
import { RefreshCw, FileJson, FileCode, AlertCircle, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function YamlToJson() {
    const [input, setInput] = useState(`name: Canivete Suiço\nversion: 1.0.4\nfeatures:\n  - JSON to Zod\n  - SQL Beautifier\n  - YAML to JSON\nsettings:\n  theme: dark\n  notifications: true`);
    const [direction, setDirection] = useState<'yaml2json' | 'json2yaml'>('yaml2json');
    const [output, setOutput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        try {
            if (!input.trim()) {
                setOutput('');
                setError(null);
                return;
            }

            if (direction === 'yaml2json') {
                const obj = yaml.load(input);
                setOutput(JSON.stringify(obj, null, 2));
            } else {
                const obj = JSON.parse(input);
                setOutput(yaml.dump(obj));
            }
            setError(null);
        } catch (e: any) {
            setError(e.message);
            setOutput('');
        }
    }, [input, direction]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const toggleDirection = () => {
        setDirection(prev => prev === 'yaml2json' ? 'json2yaml' : 'yaml2json');
        setInput(output);
    };

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex items-center justify-center">
                <div className="bg-text-main/5 p-1 rounded-2xl flex gap-1 border border-border-main/5">
                    <button
                        onClick={() => { setDirection('yaml2json'); setInput(`name: Canivete Suiço\nversion: 1.0.4`); }}
                        className={cn("px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2", direction === 'yaml2json' ? "bg-card-main text-text-main shadow-sm" : "text-text-main/40")}
                    >
                        YAML <FileJson size={14} /> JSON
                    </button>
                    <button
                        onClick={toggleDirection}
                        className="w-10 h-10 flex items-center justify-center hover:bg-text-main/10 rounded-xl transition-colors text-text-main/40"
                        title="Inverter Direção"
                    >
                        <RefreshCw size={18} />
                    </button>
                    <button
                        onClick={() => { setDirection('json2yaml'); setInput(JSON.stringify({ name: "Canivete Suiço", version: "1.0.4" }, null, 2)); }}
                        className={cn("px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2", direction === 'json2yaml' ? "bg-card-main text-text-main shadow-sm" : "text-text-main/40")}
                    >
                        JSON <FileCode size={14} /> YAML
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
                <div className="flex flex-col gap-4">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">
                        {direction === 'yaml2json' ? 'Entrada YAML' : 'Entrada JSON'}
                    </label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 p-6 font-mono text-sm bg-bg-main border border-border-main rounded-[32px] focus:ring-2 focus:ring-text-main/10 outline-none resize-none shadow-inner"
                        placeholder={direction === 'yaml2json' ? 'chave: valor...' : '{"chave": "valor"}'}
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">
                            {direction === 'yaml2json' ? 'Saída JSON' : 'Saída YAML'}
                        </label>
                        {output && (
                            <button
                                onClick={copyToClipboard}
                                className="p-2 hover:bg-text-main/5 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
                            >
                                {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                                {copied ? 'Copiado!' : 'Copiar'}
                            </button>
                        )}
                    </div>
                    <div className="flex-1 relative">
                        <pre className="absolute inset-0 p-6 font-mono text-sm bg-text-main text-bg-main rounded-[32px] overflow-auto border border-border-main shadow-xl whitespace-pre-wrap">
                            {output || (error ? '' : 'O resultado aparecerá aqui...')}
                        </pre>
                        {error && (
                            <div className="absolute inset-x-4 bottom-4 p-4 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-500 text-xs">
                                <AlertCircle size={16} />
                                <p className="font-mono font-bold leading-tight">{error}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
