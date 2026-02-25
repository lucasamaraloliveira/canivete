'use client';

import React, { useState } from 'react';
import { Settings, Plus, Trash2, Download, Copy, Check, Lock, Globe, Database, Key } from 'lucide-react';

interface EnvVar {
    id: string;
    key: string;
    value: string;
    comment: string;
}

export function EnvGenerator() {
    const [vars, setVars] = useState<EnvVar[]>([
        { id: '1', key: 'DATABASE_URL', value: 'postgresql://user:pass@localhost:5432/db', comment: 'Connection string' },
        { id: '2', key: 'API_KEY', value: 'sk_test_123456789', comment: 'Secret key for API' },
        { id: '3', key: 'PORT', value: '3000', comment: 'App port' },
    ]);
    const [copied, setCopied] = useState(false);

    const addVar = () => {
        setVars([...vars, { id: Date.now().toString(), key: '', value: '', comment: '' }]);
    };

    const updateVar = (id: string, field: keyof EnvVar, value: string) => {
        setVars(vars.map(v => v.id === id ? { ...v, [field]: value } : v));
    };

    const removeVar = (id: string) => {
        setVars(vars.filter(v => v.id !== id));
    };

    const generateContent = () => {
        return vars
            .map(v => `${v.comment ? `# ${v.comment}\n` : ''}${v.key}=${v.value}`)
            .join('\n\n');
    };

    const downloadEnv = () => {
        const blob = new Blob([generateContent()], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '.env';
        a.click();
        URL.revokeObjectURL(url);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generateContent());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const templates = [
        { name: 'Database', icon: <Database size={14} />, key: 'DATABASE_URL', val: 'postgresql://localhost:5432' },
        { name: 'Secret', icon: <Lock size={14} />, key: 'JWT_SECRET', val: 'my-super-secret' },
        { name: 'URL', icon: <Globe size={14} />, key: 'NEXT_PUBLIC_API_URL', val: 'https://api.example.com' },
        { name: 'Port', icon: <Settings size={14} />, key: 'PORT', val: '3000' },
    ];

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full min-h-0 overflow-hidden">
            <div className="flex flex-col gap-6 overflow-hidden">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Variáveis</label>
                    <div className="flex gap-2">
                        {templates.map(t => (
                            <button
                                key={t.name}
                                onClick={() => setVars([...vars, { id: Date.now().toString(), key: t.key, value: t.val, comment: '' }])}
                                className="px-3 py-1.5 bg-text-main/5 hover:bg-text-main/10 rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition-all"
                            >
                                {t.icon} {t.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-auto pr-2 space-y-4 custom-scrollbar">
                    {vars.map((v) => (
                        <div key={v.id} className="bg-card-main border border-border-main p-4 rounded-3xl shadow-sm relative group animate-in fade-in slide-in-from-left-4">
                            <button
                                onClick={() => removeVar(v.id)}
                                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                            >
                                <Trash2 size={14} />
                            </button>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest ml-1">Chave</span>
                                        <input
                                            value={v.key}
                                            onChange={(e) => updateVar(v.id, 'key', e.target.value)}
                                            className="w-full p-3 bg-bg-main border border-border-main rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-text-main/10 outline-none"
                                            placeholder="CHAVE_VAR"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest ml-1">Valor</span>
                                        <input
                                            value={v.value}
                                            onChange={(e) => updateVar(v.id, 'value', e.target.value)}
                                            className="w-full p-3 bg-bg-main border border-border-main rounded-xl text-xs font-mono focus:ring-2 focus:ring-text-main/10 outline-none"
                                            placeholder="valor"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest ml-1">Comentário</span>
                                    <input
                                        value={v.comment}
                                        onChange={(e) => updateVar(v.id, 'comment', e.target.value)}
                                        className="w-full p-3 bg-bg-main border border-border-main rounded-xl text-[11px] italic opacity-60 focus:ring-2 focus:ring-text-main/10 outline-none"
                                        placeholder="Explicação curta..."
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={addVar}
                        className="w-full py-4 border-2 border-dashed border-border-main rounded-3xl text-text-main/30 hover:text-text-main/60 hover:bg-text-main/5 transition-all flex items-center justify-center gap-2 font-bold text-sm"
                    >
                        <Plus size={20} /> Adicionar Variável
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Visualização .env</label>
                    <div className="flex gap-2">
                        <button
                            onClick={copyToClipboard}
                            className="p-3 bg-card-main border border-border-main rounded-2xl hover:bg-text-main/5 transition-all flex items-center gap-2 text-xs font-bold"
                        >
                            {copied ? <Check size={16} className="text-green-600" /> : <Copy size={14} />}
                            {copied ? 'Copiado' : 'Copiar'}
                        </button>
                        <button
                            onClick={downloadEnv}
                            className="p-3 bg-text-main text-bg-main rounded-2xl hover:opacity-90 transition-all flex items-center gap-2 text-xs font-bold shadow-lg"
                        >
                            <Download size={14} /> Download .env
                        </button>
                    </div>
                </div>
                <div className="flex-1 bg-text-main text-bg-main p-8 font-mono text-sm rounded-[40px] overflow-auto shadow-2xl relative custom-scrollbar">
                    <pre className="whitespace-pre-wrap">{generateContent() || '# Seu arquivo .env aparecerá aqui...'}</pre>
                    <div className="absolute top-8 right-8 opacity-5">
                        <Key size={100} />
                    </div>
                </div>
            </div>
        </div>
    );
}
