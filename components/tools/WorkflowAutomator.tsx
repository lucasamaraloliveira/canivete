"use client";

import React, { useState, useEffect } from 'react';
import { 
    Play, Plus, Trash2, ArrowDown, Settings2, 
    ArrowRight, Box, Type, Code, Shield, Sparkles,
    Copy, Check, Save, Layers, Terminal
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CustomSelect } from '@/components/CustomSelect';

// --- TYPES ---
type StepType = 
    | 'text_input'
    | 'uppercase' 
    | 'lowercase' 
    | 'base64_encode' 
    | 'base64_decode'
    | 'url_encode'
    | 'url_decode'
    | 'sha256'
    | 'json_prettify'
    | 'ai_process'
    | 'copy_to_clipboard';

interface WorkflowStep {
    id: string;
    type: StepType;
    config: any;
    output?: string;
    error?: string;
}

const STEP_METADATA: Record<StepType, { label: string; icon: any; category: string; description: string }> = {
    text_input: { label: 'Entrada de Texto', icon: Type, category: 'Core', description: 'Define o texto inicial.' },
    uppercase: { label: 'MAIÚSCULAS', icon: Type, category: 'Texto', description: 'Converte tudo para maiúsculas.' },
    lowercase: { label: 'minúsculas', icon: Type, category: 'Texto', description: 'Converte tudo para minúsculas.' },
    base64_encode: { label: 'Base64 Encode', icon: Code, category: 'Codificação', description: 'Codifica para Base64.' },
    base64_decode: { label: 'Base64 Decode', icon: Code, category: 'Codificação', description: 'Decodifica de Base64.' },
    url_encode: { label: 'URL Encode', icon: Code, category: 'Codificação', description: 'Codifica para consulta URL.' },
    url_decode: { label: 'URL Decode', icon: Code, category: 'Codificação', description: 'Decodifica de consulta URL.' },
    sha256: { label: 'SHA-256 Hash', icon: Shield, category: 'Segurança', description: 'Gera um hash SHA-256.' },
    json_prettify: { label: 'JSON Prettify', icon: Code, category: 'Desenvolvedor', description: 'Formata JSON bagunçado.' },
    ai_process: { label: 'Processar com IA', icon: Sparkles, category: 'IA', description: 'Usa IA para transformar o texto.' },
    copy_to_clipboard: { label: 'Copiar para Clipboard', icon: Copy, category: 'Saída', description: 'Copia o resultado final.' }
};

export function WorkflowAutomator() {
    const [steps, setSteps] = useState<WorkflowStep[]>([
        { id: '1', type: 'text_input', config: { value: 'Olá Mundo' } }
    ]);
    const [isRunning, setIsRunning] = useState(false);
    const [activeTab, setActiveTab] = useState<'edit' | 'run'>('edit');
    const [copied, setCopied] = useState(false);

    // --- LOGIC ENGINE ---
    const runWorkflow = async () => {
        setIsRunning(true);
        setActiveTab('run');
        
        let currentData = "";
        const updatedSteps = [...steps];

        try {
            for (let i = 0; i < updatedSteps.length; i++) {
                const step = updatedSteps[i];
                step.error = undefined;

                try {
                    switch (step.type) {
                        case 'text_input':
                            currentData = step.config.value || "";
                            break;
                        case 'uppercase':
                            currentData = currentData.toUpperCase();
                            break;
                        case 'lowercase':
                            currentData = currentData.toLowerCase();
                            break;
                        case 'base64_encode':
                            currentData = btoa(unescape(encodeURIComponent(currentData)));
                            break;
                        case 'base64_decode':
                            currentData = decodeURIComponent(escape(atob(currentData)));
                            break;
                        case 'url_encode':
                            currentData = encodeURIComponent(currentData);
                            break;
                        case 'url_decode':
                            currentData = decodeURIComponent(currentData);
                            break;
                        case 'json_prettify':
                            currentData = JSON.stringify(JSON.parse(currentData), null, 4);
                            break;
                        case 'sha256':
                            const msgBuffer = new TextEncoder().encode(currentData);
                            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
                            const hashArray = Array.from(new Uint8Array(hashBuffer));
                            currentData = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                            break;
                        case 'ai_process':
                            // Aqui usaríamos a chave do localStorage se existisse, por agora simulamos ou deixamos placeholder
                            currentData = `[IA Process]: ${currentData}`;
                            break;
                        case 'copy_to_clipboard':
                            navigator.clipboard.writeText(currentData);
                            break;
                    }
                    step.output = currentData;
                } catch (e: any) {
                    step.error = e.message;
                    break;
                }
            }
            setSteps(updatedSteps);
        } finally {
            setIsRunning(false);
        }
    };

    const addStep = (type: StepType) => {
        const newStep: WorkflowStep = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            config: type === 'text_input' ? { value: '' } : {}
        };
        setSteps([...steps, newStep]);
    };

    const removeStep = (id: string) => {
        setSteps(steps.filter(s => s.id !== id));
    };

    return (
        <div className="flex flex-col gap-8 max-w-5xl mx-auto py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-border-main pb-8">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-[24px] flex items-center justify-center shadow-2xl">
                        <Layers size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black tracking-tighter uppercase">Canivete Automator</h2>
                        <p className="text-[10px] font-black opacity-40 uppercase tracking-[4px]">Crie fluxos de trabalho personalizados</p>
                    </div>
                </div>

                <div className="flex gap-2 p-1 bg-text-main/5 rounded-2xl">
                    <button 
                        onClick={() => setActiveTab('edit')}
                        className={cn("px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all", activeTab === 'edit' ? "bg-card-main shadow-lg text-text-main" : "opacity-40 hover:opacity-100")}
                    >
                        Editor
                    </button>
                    <button 
                        onClick={() => setActiveTab('run')}
                        className={cn("px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all", activeTab === 'run' ? "bg-card-main shadow-lg text-text-main" : "opacity-40 hover:opacity-100")}
                    >
                        Execução
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Sidebar: Add Tools */}
                <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-8">
                    <div className="bg-card-main border border-border-main rounded-[40px] p-8 shadow-xl">
                        <h3 className="text-xs font-black uppercase tracking-[3px] opacity-40 mb-6 flex items-center gap-2">
                            <Plus size={14} /> Adicionar Etapa
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            {(Object.keys(STEP_METADATA) as StepType[]).map(type => {
                                const meta = STEP_METADATA[type];
                                return (
                                    <button
                                        key={type}
                                        onClick={() => addStep(type)}
                                        className="group flex items-center gap-4 p-4 bg-bg-main border border-border-main rounded-2xl hover:bg-text-main/5 transition-all text-left"
                                    >
                                        <div className="p-2 bg-text-main/5 rounded-xl group-hover:bg-text-main group-hover:text-bg-main transition-all">
                                            <meta.icon size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest">{meta.label}</p>
                                            <p className="text-[9px] opacity-40 font-bold">{meta.category}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <button
                        onClick={runWorkflow}
                        disabled={isRunning || steps.length === 0}
                        className="w-full py-6 bg-blue-600 text-white rounded-[32px] font-black uppercase tracking-[4px] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center gap-3"
                    >
                        <Play size={20} fill="currentColor" />
                        {isRunning ? 'Executando...' : 'Rodar Fluxo'}
                    </button>
                </div>

                {/* Workflow Canvas */}
                <div className="lg:col-span-2 space-y-6">
                    {activeTab === 'edit' ? (
                        <div className="relative pl-6 space-y-4">
                            {/* Vertical Line */}
                            <div className="absolute left-[34px] top-8 bottom-8 w-[2px] bg-gradient-to-b from-blue-600/50 via-border-main to-transparent" />
                            
                            <AnimatePresence initial={false}>
                                {steps.map((step, index) => {
                                    const meta = STEP_METADATA[step.type];
                                    return (
                                        <motion.div
                                            key={step.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="relative z-10"
                                        >
                                            <div className="flex gap-4">
                                                {/* Number Icon */}
                                                <div className="w-[18px] h-[18px] bg-bg-main border-2 border-blue-600 rounded-full flex items-center justify-center z-20 mt-6 shadow-glow shrink-0">
                                                    <span className="text-[8px] font-black">{index + 1}</span>
                                                </div>

                                                {/* Card */}
                                                <div className="flex-1 bg-card-main border border-border-main rounded-[32px] p-6 shadow-lg hover:border-blue-600/30 transition-all group">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-3 bg-text-main/5 rounded-2xl text-blue-600">
                                                                <meta.icon size={18} />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-black uppercase tracking-widest">{meta.label}</h4>
                                                                <p className="text-[9px] opacity-40 font-bold uppercase tracking-widest">{meta.description}</p>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={() => removeStep(step.id)}
                                                            className="p-2 hover:bg-red-500/10 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>

                                                    {/* Step Specific Config */}
                                                    {step.type === 'text_input' && (
                                                        <textarea 
                                                            value={step.config.value}
                                                            onChange={(e) => {
                                                                const newSteps = [...steps];
                                                                newSteps[index].config.value = e.target.value;
                                                                setSteps(newSteps);
                                                            }}
                                                            placeholder="Digite o texto de entrada..."
                                                            className="w-full h-24 bg-bg-main/50 border border-border-main rounded-xl p-4 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-600/20 transition-all resize-none"
                                                        />
                                                    )}
                                                    
                                                    {step.type === 'ai_process' && (
                                                        <p className="text-[10px] italic opacity-40">Usa a chave configurada no Omnichannel.</p>
                                                    )}

                                                    {/* Flow Arrow (Connector) */}
                                                    {index < steps.length - 1 && (
                                                        <div className="absolute left-[34px] -bottom-8 pointer-events-none translate-x-[-50%] text-blue-600/20">
                                                            <ArrowDown size={14} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>

                            {steps.length === 0 && (
                                <div className="p-12 border-2 border-dashed border-border-main rounded-[40px] text-center opacity-40 italic">
                                    Nenhuma etapa adicionada. Comece selecionando uma ferramenta ao lado.
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Execution Result Tab */
                        <div className="space-y-4">
                           {steps.map((step, index) => (
                               <div key={step.id} className="bg-card-main border border-border-main rounded-[24px] p-6 flex flex-col gap-3">
                                   <div className="flex items-center gap-2">
                                       <span className="text-[10px] font-black opacity-30">#{index + 1}</span>
                                       <span className="text-[10px] font-black uppercase tracking-widest">{STEP_METADATA[step.type].label}</span>
                                   </div>
                                   <div className={cn(
                                       "p-4 rounded-xl font-mono text-xs overflow-x-auto",
                                       step.error ? "bg-red-500/10 text-red-500" : "bg-bg-main shadow-inner text-text-main"
                                   )}>
                                       {step.error ? `Erro: ${step.error}` : (step.output || 'Aguardando execução...')}
                                   </div>
                               </div>
                           ))}

                           {steps.length > 0 && steps[steps.length-1].output && (
                               <div className="bg-text-main text-bg-main p-8 rounded-[40px] shadow-2xl space-y-4">
                                   <h3 className="text-xs font-black uppercase tracking-[4px] opacity-60">Resultado Final</h3>
                                   <p className="text-xl font-bold leading-relaxed">{steps[steps.length-1].output}</p>
                                   <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(steps[steps.length-1].output || "");
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 2000);
                                        }}
                                        className="py-3 px-6 bg-bg-main text-text-main rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all"
                                   >
                                       {copied ? <Check size={14} /> : <Copy size={14} />}
                                       {copied ? 'Copiado!' : 'Copiar Resultado'}
                                   </button>
                               </div>
                           )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
