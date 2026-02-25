'use client';

import React, { useState } from 'react';
import { Sparkles, Copy, Check, Info, Layout, Hash, FileCode, RotateCcw } from 'lucide-react';
import { format as formatSql } from 'sql-formatter';

type Lang = 'sql' | 'json' | 'js' | 'html' | 'css';

export function BrowserPrettier() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [lang, setLang] = useState<Lang>('json');
    const [copied, setCopied] = useState(false);

    const formatCode = () => {
        if (!input.trim()) return;

        try {
            let formatted = '';
            switch (lang) {
                case 'sql':
                    formatted = formatSql(input, { language: 'postgresql', keywordCase: 'upper' });
                    break;
                case 'json':
                    formatted = JSON.stringify(JSON.parse(input), null, 4);
                    break;
                case 'js':
                case 'html':
                case 'css':
                    // Basic indentation fallback for complex languages without library
                    formatted = input
                        .replace(/\s*([{};,])\s*/g, '$1\n') // basic line breaking
                        .split('\n')
                        .map(line => line.trim())
                        .filter(Boolean)
                        .join('\n');
                    break;
                default:
                    formatted = input;
            }
            setOutput(formatted);
        } catch (e) {
            setOutput(`// Erro na formatação: ${e instanceof Error ? e.message : 'Verifique a sintaxe.'}`);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-6 h-full min-h-0 overflow-y-auto sm:overflow-hidden custom-scrollbar">
            <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-text-main/5 rounded-2xl">
                        <Sparkles size={28} className="text-text-main" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold uppercase tracking-tight">Browser Prettier</h2>
                        <p className="text-xs opacity-50 font-medium">Formatação inteligente de código no navegador.</p>
                    </div>
                </div>
                <div className="flex bg-text-main/5 p-1 rounded-xl">
                    <button
                        onClick={() => setLang('json')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${lang === 'json' ? 'bg-text-main text-bg-main shadow-lg' : 'opacity-40 hover:opacity-100'}`}
                    >
                        JSON
                    </button>
                    <button
                        onClick={() => setLang('sql')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${lang === 'sql' ? 'bg-text-main text-bg-main shadow-lg' : 'opacity-40 hover:opacity-100'}`}
                    >
                        SQL
                    </button>
                    <button
                        onClick={() => setLang('js')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${lang === 'js' ? 'bg-text-main text-bg-main shadow-lg' : 'opacity-40 hover:opacity-100'}`}
                    >
                        JS/CSS
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1 min-h-0">
                <div className="flex flex-col gap-3 min-h-[250px] sm:min-h-0">
                    <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Entrada Raw</label>
                        <button onClick={() => setInput('')} className="p-1.5 hover:bg-text-main/5 rounded-lg transition-all opacity-30 hover:opacity-100">
                            <RotateCcw size={14} />
                        </button>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 p-6 bg-card-main border border-border-main rounded-[32px] font-mono text-xs focus:ring-4 focus:ring-text-main/5 outline-none transition-all resize-none shadow-sm"
                        placeholder={`Cole seu código ${lang.toUpperCase()} bagunçado aqui...`}
                    />
                </div>

                <div className="flex flex-col gap-3 min-h-[300px] sm:min-h-0">
                    <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">Código Formatado</label>
                        {output && (
                            <button onClick={copyToClipboard} className="p-2 hover:bg-text-main/5 rounded-lg transition-all text-text-main/40 hover:text-text-main flex items-center gap-2">
                                {copied ? <Check size={14} className="text-green-600" /> : <Copy size={13} />}
                                <span className="text-[10px] font-bold uppercase tracking-widest">{copied ? 'Copiado' : 'Copiar'}</span>
                            </button>
                        )}
                    </div>
                    <div className="flex-1 relative group overflow-hidden bg-text-main text-bg-main rounded-[32px] shadow-2xl border border-border-main/5">
                        <div className="absolute inset-0 p-6 sm:p-8 font-mono text-xs sm:text-sm overflow-auto custom-scrollbar">
                            <pre className="whitespace-pre">{output || '// Sua obra prima formatada aparecerá aqui...'}</pre>
                        </div>
                    </div>
                </div>
            </div>

            <div className="shrink-0 pt-4 flex flex-col sm:flex-row items-center gap-6">
                <button
                    onClick={formatCode}
                    className="w-full sm:w-auto px-10 py-5 bg-text-main text-bg-main rounded-[24px] font-bold shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                >
                    <Sparkles size={20} /> Formatar Código
                </button>
                <div className="flex items-center gap-3 text-text-main/40 px-4">
                    <Info size={16} />
                    <p className="text-[10px] sm:text-xs font-medium italic opacity-60 leading-tight">
                        Nota: Formatação de SQL e JSON é nativa. JS/HTML usa lógica simplificada.
                    </p>
                </div>
            </div>
        </div>
    );
}
