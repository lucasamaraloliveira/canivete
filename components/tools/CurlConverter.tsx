'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, Copy, Check, Info, Code2, Zap } from 'lucide-react';

export function CurlConverter() {
    const [curl, setCurl] = useState(`curl -X POST https://api.example.com/v1/users \\\n  -H "Authorization: Bearer YOUR_TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d '{"name": "John Doe", "email": "john@example.com"}'`);
    const [output, setOutput] = useState('');
    const [method, setMethod] = useState<'fetch' | 'axios'>('fetch');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        try {
            if (!curl.trim()) {
                setOutput('');
                return;
            }

            // Very basic curl parser
            const urlMatch = curl.match(/curl\s+(?:-X\s+\w+\s+)?['"]?(https?:\/\/[^\s'"]+)['"]?/);
            const url = urlMatch ? urlMatch[1] : 'https://api.example.com';

            const methodMatch = curl.match(/-X\s+(\w+)/);
            const httpMethod = methodMatch ? methodMatch[1].toUpperCase() : (curl.includes('-d') || curl.includes('--data') ? 'POST' : 'GET');

            const headers: Record<string, string> = {};
            const headerMatches = curl.matchAll(/-H\s+['"]([^'"]+)['"]/g);
            for (const match of headerMatches) {
                const [key, value] = match[1].split(/:\s+/);
                if (key && value) headers[key] = value;
            }

            const bodyMatch = curl.match(/(?:-d|--data|--data-raw)\s+['"]?({[^'"]+})['"]?/);
            const body = bodyMatch ? bodyMatch[1] : null;

            if (method === 'fetch') {
                let code = `fetch("${url}", {\n`;
                code += `  method: "${httpMethod}",\n`;
                if (Object.keys(headers).length > 0) {
                    code += `  headers: {\n`;
                    Object.entries(headers).forEach(([k, v]) => {
                        code += `    "${k}": "${v}",\n`;
                    });
                    code += `  },\n`;
                }
                if (body) {
                    code += `  body: JSON.stringify(${body})\n`;
                }
                code += `})\n.then(res => res.json())\n.then(console.log);`;
                setOutput(code);
            } else {
                let code = `axios({\n`;
                code += `  method: "${httpMethod.toLowerCase()}",\n`;
                code += `  url: "${url}",\n`;
                if (Object.keys(headers).length > 0) {
                    code += `  headers: {\n`;
                    Object.entries(headers).forEach(([k, v]) => {
                        code += `    "${k}": "${v}",\n`;
                    });
                    code += `  },\n`;
                }
                if (body) {
                    code += `  data: ${body}\n`;
                }
                code += `}).then(console.log);`;
                setOutput(code);
            }
        } catch (e) {
            setOutput('// Erro ao processar comando cURL');
        }
    }, [curl, method]);

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider flex items-center gap-2">
                    <Terminal size={18} /> Comando cURL
                </label>
                <div className="bg-text-main/5 p-1 rounded-xl flex gap-1">
                    <button
                        onClick={() => setMethod('fetch')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${method === 'fetch' ? "bg-card-main text-text-main shadow-sm" : "text-text-main/40"}`}
                    >
                        Fetch API
                    </button>
                    <button
                        onClick={() => setMethod('axios')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${method === 'axios' ? "bg-card-main text-text-main shadow-sm" : "text-text-main/40"}`}
                    >
                        Axios
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
                <textarea
                    value={curl}
                    onChange={(e) => setCurl(e.target.value)}
                    className="p-6 font-mono text-sm bg-bg-main border border-border-main rounded-[32px] focus:ring-2 focus:ring-text-main/10 outline-none resize-none shadow-inner"
                    placeholder="curl -X GET..."
                />

                <div className="relative flex flex-col gap-4 min-h-0">
                    <div className="absolute top-4 right-4 z-10">
                        <button
                            onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                            className="p-3 bg-card-main/80 backdrop-blur-md border border-border-main rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all text-text-main flex items-center gap-2 text-xs font-bold"
                        >
                            {copied ? <Check size={16} className="text-green-500" /> : <Code2 size={16} />}
                            {copied ? 'Copiado!' : 'Copiar Código'}
                        </button>
                    </div>
                    <div className="flex-1 bg-text-main text-bg-main p-8 font-mono text-sm rounded-[32px] overflow-auto shadow-2xl border border-border-main/10">
                        <pre className="whitespace-pre-wrap">{output}</pre>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-text-main/5 rounded-2xl flex items-center gap-4 text-text-main/60 text-xs italic">
                <Info size={16} className="shrink-0" />
                <p>Converte comandos cURL básicos em código JavaScript pronto para uso. Suporta headers (-H), métodos (-X) e corpo JSON (-d).</p>
            </div>
        </div>
    );
}
