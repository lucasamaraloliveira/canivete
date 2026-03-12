"use client";

import React, { useState, useEffect } from 'react';
import { Key, ShieldCheck, Brain, AlertCircle, Save, Eye, EyeOff, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/Icon';

export type AIProvider = 'openai' | 'google' | 'anthropic';

interface AiToolWrapperProps {
    title: string;
    description: string;
    children: (config: { provider: AIProvider, apiKey: string }) => React.ReactNode;
    defaultProvider?: AIProvider;
}

const PROVIDER_INFO = {
    openai: { name: 'OpenAI', label: 'OpenAI API Key', color: 'blue', link: 'https://platform.openai.com/api-keys' },
    google: { name: 'Gemini', label: 'Gemini API Key', color: 'orange', link: 'https://aistudio.google.com/app/apikey' },
    anthropic: { name: 'Claude', label: 'Anthropic API Key', color: 'purple', link: 'https://console.anthropic.com/settings/keys' }
};

export function AiToolWrapper({ title, description, children, defaultProvider = 'openai' }: AiToolWrapperProps) {
    const [activeProvider, setActiveProvider] = useState<AIProvider>(defaultProvider);
    const [keys, setKeys] = useState<Record<AIProvider, string>>({
        openai: '',
        google: '',
        anthropic: ''
    });
    const [tempKey, setTempKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [isConfigOpen, setIsConfigOpen] = useState(false);

    // Load keys from localStorage
    useEffect(() => {
        const loadedKeys: Record<AIProvider, string> = {
            openai: localStorage.getItem('ai_api_key_openai') || '',
            google: localStorage.getItem('ai_api_key_google') || '',
            anthropic: localStorage.getItem('ai_api_key_anthropic') || ''
        };
        setKeys(loadedKeys);
        setTempKey(loadedKeys[activeProvider]);
        
        // If the default provider has no key, but another one has, switch to it
        if (!loadedKeys[activeProvider]) {
            const found = (Object.keys(loadedKeys) as AIProvider[]).find(k => loadedKeys[k]);
            if (found) setActiveProvider(found);
        }
    }, [activeProvider]);

    const handleSave = () => {
        localStorage.setItem(`ai_api_key_${activeProvider}`, tempKey);
        setKeys(prev => ({ ...prev, [activeProvider]: tempKey }));
        setIsConfigOpen(false);
    };

    const hasActiveKey = !!keys[activeProvider];
    const info = PROVIDER_INFO[activeProvider];

    return (
        <div className="flex flex-col h-full bg-bg-main p-4 lg:p-8 overflow-y-auto custom-scrollbar">
            <div className="max-w-4xl mx-auto w-full space-y-8 pb-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-text-main/5 rounded-xl text-text-main shadow-inner">
                                <Brain size={24} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[3px] opacity-40">Ferramenta Inteligente</span>
                        </div>
                        <h2 className="text-3xl font-black tracking-tight">{title}</h2>
                        <p className="text-sm opacity-60 max-w-xl mt-2">{description}</p>
                    </div>

                    <div className="flex flex-col gap-3 shrink-0 min-w-[200px]">
                        <button 
                            onClick={() => setIsConfigOpen(!isConfigOpen)}
                            className={cn(
                                "w-full p-4 rounded-3xl border-2 transition-all flex items-center justify-between group",
                                hasActiveKey 
                                    ? "bg-text-main/5 border-border-main hover:border-text-main/20" 
                                    : "bg-blue-500/5 border-blue-500/30 animate-pulse-subtle"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-lg",
                                    activeProvider === 'openai' ? "bg-emerald-600" : 
                                    activeProvider === 'google' ? "bg-blue-500" : "bg-purple-600"
                                )}>
                                    <Key size={16} />
                                </div>
                                <div className="text-left">
                                    <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Motor de IA</p>
                                    <p className="text-xs font-bold">{info.name}</p>
                                </div>
                            </div>
                            <ChevronDown size={16} className={cn("transition-transform", isConfigOpen && "rotate-180")} />
                        </button>
                    </div>
                </div>

                {/* API Configuration Panel */}
                {isConfigOpen && (
                    <div className="bg-card-main border border-border-main rounded-[32px] p-6 lg:p-8 shadow-2xl animate-in slide-in-from-top-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
                            {(Object.keys(PROVIDER_INFO) as AIProvider[]).map(p => (
                                <button
                                    key={p}
                                    onClick={() => {
                                        setActiveProvider(p);
                                        setTempKey(keys[p]);
                                    }}
                                    className={cn(
                                        "p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 text-center",
                                        activeProvider === p 
                                            ? "bg-text-main text-bg-main border-transparent shadow-xl scale-105" 
                                            : "bg-text-main/5 border-border-main hover:bg-text-main/10"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest">{PROVIDER_INFO[p].name}</span>
                                        {keys[p] && <Check size={12} className={activeProvider === p ? "text-bg-main" : "text-emerald-500"} />}
                                    </div>
                                    {p === 'openai' && <div className="text-[8px] opacity-60">GPT-4, GPT-3.5</div>}
                                    {p === 'google' && <div className="text-[8px] opacity-60">Gemini 2.5</div>}
                                    {p === 'anthropic' && <div className="text-[8px] opacity-60">Claude 3.5</div>}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-sm uppercase tracking-widest">Configurar {info.name}</h3>
                                <a href={info.link} target="_blank" className="text-[10px] font-black underline opacity-40 hover:opacity-100 transition-opacity">Obter Chave</a>
                            </div>
                            
                            <div className="relative">
                                <input
                                    type={showKey ? "text" : "password"}
                                    value={tempKey}
                                    onChange={(e) => setTempKey(e.target.value)}
                                    placeholder={`Cole sua ${info.label} aqui...`}
                                    className="w-full bg-bg-main border border-border-main rounded-2xl py-4 pl-5 pr-12 text-sm focus:ring-2 focus:ring-text-main/10 transition-all font-mono"
                                />
                                <button
                                    onClick={() => setShowKey(!showKey)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity"
                                >
                                    <Icon name={showKey ? 'EyeOff' : 'Eye'} className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button
                                    onClick={handleSave}
                                    className="flex-1 px-6 py-4 bg-text-main text-bg-main rounded-2xl font-black text-sm shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    Salvar e Usar {info.name}
                                </button>
                                <button
                                    onClick={() => setIsConfigOpen(false)}
                                    className="px-6 py-4 border border-border-main rounded-2xl font-bold text-sm hover:bg-text-main/5 transition-all text-text-main/60"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tool Content Area */}
                <div className={cn(
                    "transition-all duration-500",
                    hasActiveKey ? "opacity-100 translate-y-0" : "opacity-30 pointer-events-none translate-y-4 blur-md"
                )}>
                    {hasActiveKey ? children({ provider: activeProvider, apiKey: keys[activeProvider] }) : (
                        <div className="bg-card-main border border-border-main p-12 rounded-[40px] text-center space-y-6">
                            <div className="w-20 h-20 bg-blue-500/10 text-blue-500 rounded-[32px] mx-auto flex items-center justify-center animate-bounce-slow">
                                <ShieldCheck size={40} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xl font-black">Motor de IA Requerido</h4>
                                <p className="text-sm opacity-60 max-w-sm mx-auto leading-relaxed">
                                    Esta ferramenta utiliza inteligência artificial avançada. Escolha um motor (OpenAI, Gemini ou Claude) acima e configure sua chave para começar.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsConfigOpen(true)}
                                className="px-8 py-4 bg-text-main text-bg-main rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-2xl"
                            >
                                Configurar Motor agora
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
