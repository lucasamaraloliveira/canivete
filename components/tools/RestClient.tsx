'use client';

import React, { useState, useEffect } from 'react';
import {
    Globe, Send, Plus, Trash2, Download, Upload,
    Settings, ChevronRight, Play, Save, FileJson,
    Search, Code2, Clock, Zap, Database, Copy, Check, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CodeBlock } from '../CodeBlock';

interface RequestModel {
    id: string;
    name: string;
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers: { key: string; value: string; id: string }[];
    body: string;
    params: { key: string; value: string; id: string }[];
}

interface ResponseModel {
    status: number;
    statusText: string;
    time: number;
    size: string;
    body: any;
    headers: Record<string, string>;
}

export function RestClient() {
    const [requests, setRequests] = useState<RequestModel[]>([
        {
            id: '1',
            name: 'Exemplo JSONPlaceholder',
            url: 'https://jsonplaceholder.typicode.com/posts/1',
            method: 'GET',
            headers: [{ key: 'Content-Type', value: 'application/json', id: 'h1' }],
            body: '',
            params: []
        }
    ]);

    const [activeRequestId, setActiveRequestId] = useState<string>('1');
    const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body'>('params');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<ResponseModel | null>(null);
    const [copied, setCopied] = useState(false);

    const activeRequest = requests.find(r => r.id === activeRequestId) || requests[0];

    const updateActiveRequest = (updates: Partial<RequestModel>) => {
        setRequests(prev => prev.map(r => r.id === activeRequestId ? { ...r, ...updates } : r));
    };

    const handleSend = async () => {
        setLoading(true);
        setResponse(null);
        const startTime = Date.now();

        try {
            const urlWithParams = new URL(activeRequest.url);
            activeRequest.params.forEach(p => {
                if (p.key) urlWithParams.searchParams.append(p.key, p.value);
            });

            const headers: Record<string, string> = {};
            activeRequest.headers.forEach(h => {
                if (h.key) headers[h.key] = h.value;
            });

            const options: RequestInit = {
                method: activeRequest.method,
                headers,
            };

            if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(activeRequest.method) && activeRequest.body) {
                options.body = activeRequest.body;
            }

            const res = await fetch(urlWithParams.toString(), options);
            const endTime = Date.now();

            const body = await res.json().catch(() => res.text());
            const resHeaders: Record<string, string> = {};
            res.headers.forEach((v, k) => { resHeaders[k] = v; });

            setResponse({
                status: res.status,
                statusText: res.statusText,
                time: endTime - startTime,
                size: (JSON.stringify(body).length / 1024).toFixed(2) + ' KB',
                body,
                headers: resHeaders
            });
        } catch (err: any) {
            setResponse({
                status: 0,
                statusText: 'Error',
                time: Date.now() - startTime,
                size: '0 KB',
                body: { error: err.message || 'Falha na requisição. Verifique o CORS.' },
                headers: {}
            });
        } finally {
            setLoading(false);
        }
    };

    const addNewRequest = () => {
        const newId = Date.now().toString();
        const newReq: RequestModel = {
            id: newId,
            name: 'Nova Requisição',
            url: 'https://',
            method: 'GET',
            headers: [],
            body: '',
            params: []
        };
        setRequests([...requests, newReq]);
        setActiveRequestId(newId);
    };

    const deleteRequest = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (requests.length === 1) return;
        const newRequests = requests.filter(r => r.id !== id);
        setRequests(newRequests);
        if (activeRequestId === id) setActiveRequestId(newRequests[0].id);
    };

    const downloadCollection = () => {
        const data = JSON.stringify(requests, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `canivete-collection-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    };

    const handleCopy = () => {
        if (!response) return;
        navigator.clipboard.writeText(JSON.stringify(response.body, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col lg:flex-row h-full gap-6 overflow-hidden">
            {/* Sidebar de Requisições */}
            <div className="w-full lg:w-72 flex flex-col gap-4 shrink-0">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[10px] font-black uppercase tracking-[3px] opacity-40">Coleção Local</h4>
                    <button
                        onClick={addNewRequest}
                        className="p-2 bg-text-main text-bg-main rounded-xl hover:scale-105 transition-all shadow-lg"
                    >
                        <Plus size={14} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2 pr-1">
                    {requests.map(req => (
                        <div
                            key={req.id}
                            onClick={() => setActiveRequestId(req.id)}
                            className={cn(
                                "group w-full p-3 rounded-2xl border text-left transition-all flex items-center gap-3 relative overflow-hidden cursor-pointer",
                                activeRequestId === req.id
                                    ? "bg-text-main/5 border-text-main/20 ring-1 ring-text-main/10"
                                    : "bg-card-main border-border-main hover:bg-text-main/[0.02]"
                            )}
                        >
                            <div className={cn(
                                "text-[8px] font-black px-1.5 py-0.5 rounded-md min-w-[40px] text-center",
                                req.method === 'GET' ? "bg-green-500/10 text-green-500" :
                                    req.method === 'POST' ? "bg-yellow-500/10 text-yellow-500" :
                                        "bg-blue-500/10 text-blue-500"
                            )}>
                                {req.method}
                            </div>
                            <span className="text-xs font-bold truncate flex-1">{req.name}</span>
                            <button
                                onClick={(e) => deleteRequest(req.id, e)}
                                className="opacity-0 group-hover:opacity-40 hover:!opacity-100 p-1 hover:text-red-500 transition-all"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    onClick={downloadCollection}
                    className="mt-2 w-full py-4 bg-text-main text-bg-main rounded-[24px] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:opacity-90 transition-all active:scale-95"
                >
                    <Download size={16} /> Exportar Coleção
                </button>
            </div>

            {/* Área Principal */}
            <div className="flex-1 flex flex-col min-w-0 gap-6 overflow-y-auto lg:overflow-visible custom-scrollbar">
                {/* URL e Método */}
                <div className="bg-card-main border border-border-main rounded-[32px] p-2 flex flex-col sm:flex-row items-stretch gap-2 shadow-sm">
                    <select
                        value={activeRequest.method}
                        onChange={(e) => updateActiveRequest({ method: e.target.value as any })}
                        className="bg-text-main/5 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest outline-none border-none cursor-pointer hover:bg-text-main/10 transition-colors"
                    >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="PATCH">PATCH</option>
                        <option value="DELETE">DELETE</option>
                    </select>
                    <div className="flex-1 relative flex items-center">
                        <div className="absolute left-4 text-text-main/20">
                            <Globe size={16} />
                        </div>
                        <input
                            value={activeRequest.url}
                            onChange={(e) => updateActiveRequest({ url: e.target.value })}
                            placeholder="https://api.exemplo.com/v1/users"
                            className="w-full bg-text-main/5 border-none rounded-2xl pl-12 pr-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-text-main/10 transition-all"
                        />
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className="bg-text-main text-bg-main px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[2px] transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-3 shadow-lg"
                    >
                        {loading ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
                        {loading ? 'Enviando...' : 'Enviar'}
                    </button>
                </div>

                {/* Editor de Requisição */}
                <div className="flex-1 flex flex-col min-h-0 bg-card-main border border-border-main rounded-[40px] overflow-hidden shadow-sm">
                    <div className="flex border-b border-border-main p-2 gap-1 bg-text-main/[0.02]">
                        {(['params', 'headers', 'body'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all italic",
                                    activeTab === tab ? "bg-text-main text-bg-main shadow-md" : "opacity-40 hover:opacity-100"
                                )}
                            >
                                {tab === 'params' ? 'Query Params' : tab === 'headers' ? 'Headers' : 'Request Body'}
                            </button>
                        ))}
                        <div className="ml-auto flex items-center px-4">
                            <input
                                value={activeRequest.name}
                                onChange={(e) => updateActiveRequest({ name: e.target.value })}
                                className="bg-transparent border-none text-right text-[10px] font-bold uppercase tracking-widest border-b border-transparent focus:border-text-main/20 outline-none w-40 opacity-40 focus:opacity-100"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar text-left">
                        {activeTab === 'params' && (
                            <KVEditor
                                items={activeRequest.params}
                                onChange={(items) => updateActiveRequest({ params: items })}
                                placeholder="key=value"
                            />
                        )}
                        {activeTab === 'headers' && (
                            <KVEditor
                                items={activeRequest.headers}
                                onChange={(items) => updateActiveRequest({ headers: items })}
                                placeholder="Header-Name: Value"
                            />
                        )}
                        {activeTab === 'body' && (
                            <div className="h-full flex flex-col gap-4">
                                <textarea
                                    value={activeRequest.body}
                                    onChange={(e) => updateActiveRequest({ body: e.target.value })}
                                    placeholder='{ "key": "value" }'
                                    className="flex-1 w-full bg-text-main/5 border border-border-main rounded-3xl p-6 font-mono text-sm resize-none outline-none focus:ring-2 focus:ring-text-main/10 min-h-[150px]"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Resposta */}
                <div className="flex-1 flex flex-col min-h-0 bg-[#0D0D0D] text-white rounded-[40px] overflow-hidden shadow-2xl relative">
                    <div className="flex items-center justify-between p-6 border-b border-white/5">
                        <div className="flex items-center gap-6">
                            {response && (
                                <>
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            "w-2 h-2 rounded-full animate-pulse",
                                            response.status >= 200 && response.status < 300 ? "bg-green-500" : "bg-red-500"
                                        )} />
                                        <span className="text-xs font-black uppercase tracking-widest">{response.status} {response.statusText}</span>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-4 text-[10px] opacity-40 font-bold uppercase tracking-widest">
                                        <span className="flex items-center gap-1.5"><Clock size={12} /> {response.time}ms</span>
                                        <span className="flex items-center gap-1.5"><Zap size={12} /> {response.size}</span>
                                    </div>
                                </>
                            )}
                            {!response && !loading && (
                                <span className="text-xs font-black uppercase tracking-widest opacity-20 italic">Aguardando Requisição...</span>
                            )}
                        </div>
                        {response && (
                            <button
                                onClick={handleCopy}
                                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-white/5"
                            >
                                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                                {copied ? 'Copiado' : 'Copiar JSON'}
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-auto custom-scrollbar p-0">
                        {response ? (
                            <CodeBlock code={typeof response.body === 'string' ? response.body : JSON.stringify(response.body, null, 2)} language="json" />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-10">
                                <Database size={64} className="mb-4" />
                                <p className="text-xs font-bold uppercase tracking-[4px]">No Response Data</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function KVEditor({
    items,
    onChange,
    placeholder
}: {
    items: { key: string; value: string; id: string }[],
    onChange: (items: { key: string; value: string; id: string }[]) => void,
    placeholder: string
}) {
    const addRow = () => onChange([...items, { key: '', value: '', id: Date.now().toString() }]);
    const updateRow = (id: string, updates: any) => onChange(items.map(i => i.id === id ? { ...i, ...updates } : i));
    const deleteRow = (id: string) => onChange(items.filter(i => i.id !== id));

    return (
        <div className="space-y-3">
            {items.map(item => (
                <div key={item.id} className="flex items-center gap-2 group animate-in fade-in slide-in-from-left-2 transition-all">
                    <input
                        placeholder="Key"
                        value={item.key}
                        onChange={(e) => updateRow(item.id, { key: e.target.value })}
                        className="flex-1 bg-text-main/5 border border-border-main rounded-xl px-4 py-2.5 text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-text-main/10"
                    />
                    <input
                        placeholder="Value"
                        value={item.value}
                        onChange={(e) => updateRow(item.id, { value: e.target.value })}
                        className="flex-1 bg-text-main/5 border border-border-main rounded-xl px-4 py-2.5 text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-text-main/10"
                    />
                    <button
                        onClick={() => deleteRow(item.id)}
                        className="p-2.5 text-red-500 opacity-20 group-hover:opacity-100 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ))}
            <button
                onClick={addRow}
                className="w-full py-3 border-2 border-dashed border-border-main rounded-2xl text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 hover:bg-text-main/5 transition-all italic"
            >
                + Adicionar Campo
            </button>
        </div>
    );
}
