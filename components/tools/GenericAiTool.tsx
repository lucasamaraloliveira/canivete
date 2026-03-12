"use client";

import React, { useState } from 'react';
import { Sparkles, Copy, Check, RotateCcw, Send, Settings, Terminal, MessageSquare, Languages, Brain, Search, Code2, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIProvider } from '@/components/AiToolWrapper';
import { CustomSelect } from '@/components/CustomSelect';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface GenericAiToolProps {
    provider: AIProvider;
    apiKey: string;
    title: string;
    instruction: string;
    inputPlaceholder: string;
    inputLabel?: string;
    outputLabel?: string;
    isCode?: boolean;
    options?: { label: string; value: string }[];
}

export function GenericAiTool({ 
    provider, 
    apiKey, 
    title, 
    instruction, 
    inputPlaceholder, 
    inputLabel = "Entrada",
    outputLabel = "Resultado da IA",
    isCode = false,
    options
}: GenericAiToolProps) {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [selectedOption, setSelectedOption] = useState(options?.[0]?.value || '');

    const handleGenerate = async () => {
        if (!input.trim() || isLoading) return;
        setIsLoading(true);
        setOutput('');

        try {
            const prompt = `${instruction} ${selectedOption ? `(Opção selecionada: ${selectedOption})` : ''}\n\nEntrada do usuário:\n${input}`;
            
            // Reutilizando a lógica de chamada de API compatível com os 3 provedores
            let response;
            if (provider === 'openai') {
                response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        messages: [{ role: 'system', content: instruction }, { role: 'user', content: input }]
                    })
                });
            } else if (provider === 'google') {
                response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ role: 'user', parts: [{ text: prompt }] }]
                    })
                });
            } else { // Anthropic
                response = await fetch('https://api.anthropic.com/v1/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': apiKey,
                        'anthropic-version': '2023-06-01',
                        'dangerously-allow-browser': 'true'
                    },
                    body: JSON.stringify({
                        model: 'claude-3-haiku-20240307',
                        max_tokens: 1024,
                        messages: [{ role: 'user', content: prompt }]
                    })
                });
            }

            const data = await response.json();
            if (!response.ok) throw new Error(data.error?.message || 'Erro na API');

            let content = '';
            if (provider === 'openai') content = data.choices[0].message.content;
            else if (provider === 'google') content = data.candidates[0].content.parts[0].text;
            else content = data.content[0].text;

            setOutput(content);
        } catch (error: any) {
            setOutput(`Erro: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Side */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">{inputLabel}</label>
                        {options && (
                            <CustomSelect 
                                value={selectedOption}
                                onChange={(value) => setSelectedOption(value)}
                                options={options}
                                className="w-32"
                            />
                        )}
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={inputPlaceholder}
                        className="w-full h-[300px] bg-card-main border border-border-main rounded-[24px] p-6 text-sm focus:ring-2 focus:ring-text-main/10 transition-all outline-none resize-none shadow-inner"
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={!input.trim() || isLoading}
                        className="w-full py-4 bg-text-main text-bg-main rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-30"
                    >
                        {isLoading ? (
                            <RotateCcw className="animate-spin" size={18} />
                        ) : (
                            <Sparkles size={18} />
                        )}
                        {isLoading ? 'Processando...' : 'Gerar com IA'}
                    </button>
                </div>

                {/* Output Side */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">{outputLabel}</label>
                        {output && (
                            <button
                                onClick={copyToClipboard}
                                className="p-2 hover:bg-text-main/5 rounded-lg transition-all"
                            >
                                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                            </button>
                        )}
                    </div>
                    <div className={cn(
                        "w-full h-[300px] bg-bg-main border border-border-main rounded-[24px] overflow-hidden relative",
                        !output && "flex items-center justify-center italic opacity-30 text-sm"
                    )}>
                        {output ? (
                            <div className={cn(
                                "w-full h-full p-6 overflow-y-auto custom-scrollbar prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed",
                                isCode && "font-mono bg-black/5"
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
                                                <code className={cn("bg-text-main/10 px-1.5 py-0.5 rounded text-sm", className)} {...props}>
                                                    {children}
                                                </code>
                                            );
                                        },
                                        p: ({children}) => <p className="mb-4 last:mb-0">{children}</p>,
                                        ul: ({children}) => <ul className="list-disc ml-4 mb-4 space-y-2">{children}</ul>,
                                        ol: ({children}) => <ol className="list-decimal ml-4 mb-4 space-y-2">{children}</ol>,
                                        li: ({children}) => <li className="text-sm">{children}</li>,
                                        h1: ({children}) => <h1 className="text-xl font-black mb-4">{children}</h1>,
                                        h2: ({children}) => <h2 className="text-lg font-bold mb-3">{children}</h2>,
                                        h3: ({children}) => <h3 className="text-md font-bold mb-2">{children}</h3>,
                                    }}
                                >
                                    {output}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <Brain size={32} className="opacity-20" />
                                <span>Aguardando geração...</span>
                            </div>
                        )}
                    </div>
                    {output && (
                        <div className="flex gap-2">
                             <button
                                onClick={() => setOutput('')}
                                className="flex-1 py-4 border border-border-main rounded-2xl font-bold text-xs hover:bg-red-500/5 hover:text-red-500 transition-all"
                            >
                                Limpar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
