"use client";

import React, { useState } from 'react';
import { Send, User, Bot, Sparkles, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function ChatGptClient({ apiKey }: { apiKey: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { role: 'user', content: input };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: newMessages
                })
            });

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message);
            }

            const assistantMsg: Message = {
                role: 'assistant',
                content: data.choices[0].message.content
            };
            setMessages(prev => [...prev, assistantMsg]);
        } catch (error: any) {
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: `Erro: ${error.message || 'Falha na comunicação com a OpenAI.'}` 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] bg-card-main border border-border-main rounded-[32px] overflow-hidden shadow-2xl">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40 space-y-4">
                        <Sparkles size={48} />
                        <p className="text-sm font-medium">Inicie uma conversa com a IA.<br/>Seu token está seguro e ativo.</p>
                    </div>
                ) : (
                    messages.map((msg, i) => (
                        <div key={i} className={cn(
                            "flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
                            msg.role === 'user' ? "flex-row-reverse" : ""
                        )}>
                            <div className={cn(
                                "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                                msg.role === 'user' ? "bg-text-main text-bg-main" : "bg-blue-500 text-white"
                            )}>
                                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                            </div>
                            <div className={cn(
                                "max-w-[80%] p-4 rounded-3xl text-sm leading-relaxed",
                                msg.role === 'user' 
                                    ? "bg-text-main/5 text-text-main rounded-tr-none" 
                                    : "bg-blue-500/10 text-text-main border border-blue-500/10 rounded-tl-none"
                            )}>
                                {msg.content}
                            </div>
                        </div>
                    ))
                )}
                {isLoading && (
                    <div className="flex gap-4 animate-pulse">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                            <Bot size={18} className="text-blue-500/40" />
                        </div>
                        <div className="bg-blue-500/5 h-12 w-24 rounded-3xl rounded-tl-none" />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-text-main/5 border-t border-border-main flex items-center gap-3">
                <button 
                    onClick={() => setMessages([])}
                    className="p-3 hover:bg-red-500/10 text-red-500 rounded-2xl transition-all"
                    title="Limpar conversa"
                >
                    <Trash2 size={20} />
                </button>
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Digite sua mensagem..."
                        className="w-full bg-bg-main border border-border-main rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-text-main text-bg-main rounded-xl disabled:opacity-30 transition-all hover:scale-105 active:scale-95"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
