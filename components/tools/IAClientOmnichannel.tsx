"use client";

import React, { useState, useEffect } from 'react';
import { Send, User, Bot, Sparkles, Trash2, Cpu, Settings2, ShieldCheck, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CustomSelect } from '@/components/CustomSelect';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

type AIProvider = 'openai' | 'google' | 'anthropic';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ProviderConfig {
    name: string;
    icon: string;
    models: string[];
    baseUrl: string;
    getHeaders: (key: string) => Record<string, string>;
    formatBody: (model: string, messages: Message[]) => any;
    extractContent: (data: any) => string;
}

const PROVIDERS: Record<AIProvider, ProviderConfig> = {
    openai: {
        name: 'OpenAI',
        icon: 'Bot',
        models: ['gpt-3.5-turbo', 'gpt-4o', 'gpt-4-turbo'],
        baseUrl: 'https://api.openai.com/v1/chat/completions',
        getHeaders: (key) => ({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
        }),
        formatBody: (model, messages) => ({
            model,
            messages: messages.map(m => ({
                role: m.role,
                content: m.content
            }))
        }),
        extractContent: (data) => data.choices[0].message.content
    },
    google: {
        name: 'Gemini',
        icon: 'Sparkles',
        models: ['gemini-2.5-flash', 'gemini-2.5-pro'],
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/',
        getHeaders: () => ({ 'Content-Type': 'application/json' }),
        formatBody: (_, messages) => ({
            contents: messages.map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }]
            }))
        }),
        extractContent: (data) => data.candidates[0].content.parts[0].text
    },
    anthropic: {
        name: 'Claude',
        icon: 'Cpu',
        models: ['claude-3-5-sonnet-20240620', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'],
        baseUrl: 'https://api.anthropic.com/v1/messages',
        getHeaders: (key) => ({
            'Content-Type': 'application/json',
            'x-api-key': key,
            'anthropic-version': '2023-06-01',
            'dangerously-allow-browser': 'true'
        }),
        formatBody: (model, messages) => ({
            model,
            max_tokens: 1024,
            messages: messages.map(m => ({
                role: m.role,
                content: m.content
            }))
        }),
        extractContent: (data) => data.content[0].text
    }
};

export function IAClientOmnichannel({ initialProvider, initialKey }: { initialProvider?: AIProvider, initialKey?: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<AIProvider>(initialProvider || 'openai');
    const [selectedModel, setSelectedModel] = useState('');
    const [keys, setKeys] = useState<Record<string, string>>({
        openai: '',
        google: '',
        anthropic: ''
    });

    useEffect(() => {
        const savedKeys: Record<string, string> = {
            openai: localStorage.getItem('ai_api_key_openai') || '',
            google: localStorage.getItem('ai_api_key_google') || '',
            anthropic: localStorage.getItem('ai_api_key_anthropic') || '',
        };
        setKeys(savedKeys);
        
        // Se o pai mudou o provedor, atualizamos aqui também
        if (initialProvider) {
            setSelectedProvider(initialProvider);
        }
    }, [initialProvider, initialKey]);

    useEffect(() => {
        setSelectedModel(PROVIDERS[selectedProvider].models[0]);
    }, [selectedProvider]);

    const activeKey = keys[selectedProvider];

    const handleSend = async () => {
        if (!input.trim() || isLoading || !activeKey) return;

        const userMsg: Message = { role: 'user', content: input };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        const config = PROVIDERS[selectedProvider];

        try {
            let url = config.baseUrl;
            if (selectedProvider === 'google') {
                url += `${selectedModel}:generateContent?key=${activeKey}`;
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: config.getHeaders(activeKey),
                body: JSON.stringify(config.formatBody(selectedModel, newMessages))
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error?.message || data.error || 'Erro na API');
            }

            const content = config.extractContent(data);
            setMessages(prev => [...prev, { role: 'assistant', content }]);
        } catch (error: any) {
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: `Erro (${config.name}): ${error.message}` 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[700px] bg-bg-main border border-border-main rounded-[40px] overflow-hidden shadow-2xl relative group/client">
            {/* Header / Config Area */}
            <div className="p-6 bg-card-main border-b border-border-main flex flex-wrap items-center justify-between gap-4 z-10">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-text-main text-bg-main rounded-2xl shadow-lg">
                        <Globe size={20} />
                    </div>
                    <div>
                        <h3 className="font-black text-sm uppercase tracking-wider">IA Client</h3>
                        <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest">Multi-Provider Mode</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-bg-main/50 p-1.5 rounded-2xl border border-border-main">
                    {(Object.keys(PROVIDERS) as AIProvider[]).map(p => (
                        <button
                            key={p}
                            onClick={() => setSelectedProvider(p)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2",
                                selectedProvider === p 
                                    ? "bg-text-main text-bg-main shadow-md scale-105" 
                                    : "opacity-40 hover:opacity-100"
                            )}
                        >
                            {PROVIDERS[p].name}
                            {!keys[p] && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                        </button>
                    ))}
                </div>

                <CustomSelect 
                    value={selectedModel}
                    onChange={(value) => setSelectedModel(value)}
                    options={PROVIDERS[selectedProvider].models.map(m => ({ label: m, value: m }))}
                    className="w-48"
                />
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-dots-grid">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30 px-12">
                        <div className="w-24 h-24 bg-text-main/5 rounded-[40px] flex items-center justify-center">
                            <Cpu size={48} />
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-black uppercase tracking-[4px]">Omnichannel Active</p>
                            <p className="text-xs leading-relaxed max-w-xs">
                                Selecione um provedor acima e certifique-se de ter a chave configurada no painel principal da ferramenta.
                            </p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, i) => (
                        <div key={i} className={cn(
                            "flex gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500",
                            msg.role === 'user' ? "flex-row-reverse" : ""
                        )}>
                            <div className={cn(
                                "w-12 h-12 rounded-[20px] flex items-center justify-center shrink-0 shadow-2xl transition-all",
                                msg.role === 'user' 
                                    ? "bg-text-main text-bg-main" 
                                    : "bg-blue-600 text-white"
                            )}>
                                {msg.role === 'user' ? <User size={22} /> : <Bot size={22} />}
                            </div>
                            <div className={cn(
                                "max-w-[75%] p-6 rounded-[32px] text-sm leading-relaxed shadow-sm",
                                msg.role === 'user' 
                                    ? "bg-text-main/5 border border-border-main/5 text-text-main rounded-tr-none" 
                                    : "bg-blue-600/5 text-text-main border border-blue-600/10 rounded-tl-none font-medium"
                            )}>
                                <ReactMarkdown
                                    components={{
                                        code({ node, inline, className, children, ...props }: any) {
                                            const match = /language-(\w+)/.exec(className || '');
                                            return !inline && match ? (
                                                <SyntaxHighlighter
                                                    style={vscDarkPlus}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    className="rounded-xl overflow-hidden my-4"
                                                    {...props}
                                                >
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            ) : (
                                                <code className={cn("bg-text-main/10 px-1.5 py-0.5 rounded text-sm font-mono", className)} {...props}>
                                                    {children}
                                                </code>
                                            );
                                        },
                                        p: ({children}) => <p className="mb-4 last:mb-0">{children}</p>,
                                        ul: ({children}) => <ul className="list-disc ml-4 mb-4 space-y-2">{children}</ul>,
                                        ol: ({children}) => <ol className="list-decimal ml-4 mb-4 space-y-2">{children}</ol>,
                                        li: ({children}) => <li className="text-sm">{children}</li>,
                                    }}
                                >
                                    {msg.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    ))
                )}
                {isLoading && (
                    <div className="flex gap-5 animate-pulse">
                        <div className="w-12 h-12 bg-blue-600/20 rounded-[20px] shadow-inner" />
                        <div className="bg-blue-600/5 h-16 w-32 rounded-[32px] rounded-tl-none border border-blue-600/5" />
                    </div>
                )}
            </div>

            {/* Privacy Shield - Só mostra se não houver NENHUMA chave em nenhum lugar (fallback) */}
            {(!activeKey && !initialKey) && (
                <div className="absolute inset-0 bg-bg-main/60 backdrop-blur-md z-20 flex items-center justify-center p-8">
                    <div className="bg-card-main border border-border-main p-8 rounded-[40px] shadow-2xl max-w-sm text-center space-y-6 animate-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-3xl mx-auto flex items-center justify-center">
                            <ShieldCheck size={32} />
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-black text-lg">Chave Ausente</h4>
                            <p className="text-xs opacity-60 leading-relaxed">
                                Você precisa configurar a chave de API para o <b>{PROVIDERS[selectedProvider].name}</b> na seção superior da ferramenta para habilitar o chat.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className="p-8 bg-card-main/80 backdrop-blur-xl border-t border-border-main flex items-center gap-4">
                <button 
                    onClick={() => setMessages([])}
                    disabled={messages.length === 0}
                    className="p-4 hover:bg-red-500/10 text-red-500 rounded-2xl transition-all disabled:opacity-20 shrink-0"
                    title="Limpar conversa"
                >
                    <Trash2 size={24} />
                </button>
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={`Pergunte algo ao ${PROVIDERS[selectedProvider].name}...`}
                        className="w-full bg-bg-main border border-border-main rounded-[24px] py-5 px-8 text-sm focus:ring-4 focus:ring-blue-500/5 transition-all outline-none pr-20 shadow-inner"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading || !activeKey}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-text-main text-bg-main rounded-2xl disabled:opacity-10 transition-all hover:scale-105 active:scale-95 shadow-lg group-hover/client:bg-blue-600 group-hover/client:text-white"
                    >
                        <Send size={20} />
                    </button>
                </div>
                <button className="p-4 hover:bg-text-main/5 rounded-2xl transition-all shrink-0">
                    <Settings2 size={24} className="opacity-40" />
                </button>
            </div>
        </div>
    );
}
