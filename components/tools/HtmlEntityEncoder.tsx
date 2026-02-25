'use client';

import React, { useState } from 'react';
import { FileCode, Copy, Check, Hash, Code } from 'lucide-react';

export function HtmlEntityEncoder() {
    const [input, setInput] = useState('<h1>Exemplo de texto com caracteres especiais: á, é, í, ó, ú, ñ, ©, ®, &</h1>');
    const [copied, setCopied] = useState(false);

    const encode = (str: string) => {
        return str.replace(/[\u00A0-\u9999<>&]/g, (i) => `&#${i.charCodeAt(0)};`);
    };

    const decode = (str: string) => {
        const doc = new DOMParser().parseFromString(str, 'text/html');
        return doc.documentElement.textContent || '';
    };

    const encoded = encode(input);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(encoded);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full">
            <div className="flex flex-col gap-4">
                <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider flex items-center gap-2">
                    <Code size={16} /> Texto Original
                </label>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 p-6 font-mono text-sm bg-bg-main border border-border-main rounded-[32px] focus:ring-2 focus:ring-text-main/10 outline-none resize-none"
                    placeholder="Digite seu texto aqui..."
                />
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider flex items-center gap-2">
                        <Hash size={16} /> Entidades HTML
                    </label>
                    <button
                        onClick={copyToClipboard}
                        className="p-2 hover:bg-text-main/5 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
                    >
                        {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                        {copied ? 'Copiado!' : 'Copiar'}
                    </button>
                </div>
                <div className="flex-1 relative group">
                    <div className="absolute inset-0 bg-text-main text-bg-main p-6 font-mono text-sm rounded-[32px] overflow-auto break-all shadow-xl select-all">
                        {encoded || <em className="opacity-20">As entidades aparecerão aqui...</em>}
                    </div>
                    <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FileCode size={120} />
                    </div>
                </div>
            </div>
        </div>
    );
}
