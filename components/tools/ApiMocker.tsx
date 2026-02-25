'use client';

import React, { useState } from 'react';
import { Cpu, Plus, Trash2, RefreshCw, Copy, Check, FileJson, Info } from 'lucide-react';

interface MockField {
    id: string;
    name: string;
    type: 'string' | 'number' | 'boolean' | 'uuid' | 'date' | 'email' | 'name';
}

export function ApiMocker() {
    const [fields, setFields] = useState<MockField[]>([
        { id: '1', name: 'id', type: 'uuid' },
        { id: '2', name: 'username', type: 'name' },
        { id: '3', name: 'email', type: 'email' },
        { id: '4', name: 'active', type: 'boolean' },
        { id: '5', name: 'created_at', type: 'date' },
    ]);
    const [count, setCount] = useState(3);
    const [copied, setCopied] = useState(false);

    const generateData = () => {
        const data = [];
        for (let i = 0; i < count; i++) {
            const item: any = {};
            fields.forEach(f => {
                switch (f.type) {
                    case 'uuid': item[f.name] = Math.random().toString(36).substring(2, 15); break;
                    case 'name': item[f.name] = ['Alice', 'Bob', 'Charlie', 'David'][Math.floor(Math.random() * 4)]; break;
                    case 'email': item[f.name] = `${item.username?.toLowerCase() || 'user'}@example.com`; break;
                    case 'boolean': item[f.name] = Math.random() > 0.5; break;
                    case 'number': item[f.name] = Math.floor(Math.random() * 1000); break;
                    case 'date': item[f.name] = new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(); break;
                    case 'string': item[f.name] = 'lorem ipsum'; break;
                }
            });
            data.push(item);
        }
        return JSON.stringify(data, null, 2);
    };

    const [mockOutput, setMockOutput] = useState(generateData());

    const addField = () => {
        setFields([...fields, { id: Date.now().toString(), name: 'new_field', type: 'string' }]);
    };

    const updateField = (id: string, updates: Partial<MockField>) => {
        setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const removeField = (id: string) => {
        setFields(fields.filter(f => f.id !== id));
    };

    const refresh = () => setMockOutput(generateData());

    const copy = () => {
        navigator.clipboard.writeText(mockOutput);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full min-h-0 overflow-hidden">
            <div className="flex flex-col gap-6 overflow-hidden">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Estrutura do Mock</label>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold opacity-30 uppercase">Itens:</span>
                        <input
                            type="number" value={count} onChange={(e) => setCount(Number(e.target.value))}
                            className="w-16 p-1.5 bg-text-main/5 border border-border-main rounded-lg text-xs font-bold text-center outline-none"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-auto pr-2 space-y-3">
                    {fields.map((f) => (
                        <div key={f.id} className="bg-card-main border border-border-main p-4 rounded-3xl shadow-sm flex items-center gap-3 animate-in fade-in slide-in-from-left-4">
                            <input
                                value={f.name}
                                onChange={(e) => updateField(f.id, { name: e.target.value })}
                                className="flex-1 p-2.5 bg-bg-main border border-border-main rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-text-main/10 outline-none"
                            />
                            <select
                                value={f.type}
                                onChange={(e) => updateField(f.id, { type: e.target.value as any })}
                                className="p-2.5 bg-bg-main border border-border-main rounded-xl text-[10px] font-black uppercase tracking-widest outline-none"
                            >
                                <option value="uuid">UUID/ID</option>
                                <option value="name">Nome</option>
                                <option value="email">E-mail</option>
                                <option value="string">String</option>
                                <option value="number">Número</option>
                                <option value="boolean">Boolean</option>
                                <option value="date">Data</option>
                            </select>
                            <button
                                onClick={() => removeField(f.id)}
                                className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addField}
                        className="w-full py-4 border-2 border-dashed border-border-main rounded-[32px] text-text-main/30 hover:text-text-main/60 hover:bg-text-main/5 transition-all flex items-center justify-center gap-2 font-bold text-sm"
                    >
                        <Plus size={20} /> Adicionar Atributo
                    </button>
                </div>

                <button
                    onClick={refresh}
                    className="w-full py-4 bg-text-main text-bg-main rounded-[32px] font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                    <RefreshCw size={20} /> Gerar Novos Dados
                </button>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Saída JSON</label>
                    <button
                        onClick={copy}
                        className="p-3 bg-card-main border border-border-main rounded-2xl hover:bg-text-main/5 transition-all flex items-center gap-2 text-xs font-bold"
                    >
                        {copied ? <Check size={16} className="text-green-600" /> : <Copy size={14} />}
                        {copied ? 'Copiado' : 'Copiar JSON'}
                    </button>
                </div>
                <div className="flex-1 bg-text-main text-bg-main p-6 sm:p-8 font-mono text-[10px] sm:text-xs rounded-[24px] sm:rounded-[40px] overflow-auto shadow-2xl border border-border-main/5 relative custom-scrollbar">
                    <pre className="whitespace-pre">
                        {mockOutput}
                    </pre>
                    <div className="absolute top-8 right-8 opacity-5">
                        <FileJson size={80} />
                    </div>
                </div>
            </div>
        </div>
    );
}
