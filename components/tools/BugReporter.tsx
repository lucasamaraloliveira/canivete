'use client';

import React, { useState } from 'react';
import {
    Bug, Plus, Trash2, Camera, Download,
    ChevronRight, AlertCircle, CheckCircle2,
    Layers, Monitor, Laptop,
    ExternalLink, Copy, Check, FileImage,
    Type, MessageSquare, Smartphone, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BugReport {
    id: string;
    title: string;
    severity: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
    environment: 'Produção' | 'Staging' | 'Desenvolvimento';
    device: 'Desktop' | 'Mobile' | 'Tablet';
    steps: string[];
    actualResult: string;
    expectedResult: string;
}

export function BugReporter() {
    const [report, setReport] = useState<BugReport>({
        id: `BUG-${Math.floor(Math.random() * 10000)}`,
        title: '',
        severity: 'Média',
        environment: 'Produção',
        device: 'Desktop',
        steps: [''],
        actualResult: '',
        expectedResult: ''
    });

    const [copied, setCopied] = useState(false);

    const updateReport = (updates: Partial<BugReport>) => {
        setReport(prev => ({ ...prev, ...updates }));
    };

    const addStep = () => {
        setReport(prev => ({ ...prev, steps: [...prev.steps, ''] }));
    };

    const updateStep = (index: number, value: string) => {
        const newSteps = [...report.steps];
        newSteps[index] = value;
        updateReport({ steps: newSteps });
    };

    const removeStep = (index: number) => {
        const newSteps = report.steps.filter((_, i) => i !== index);
        updateReport({ steps: newSteps.length ? newSteps : [''] });
    };

    const generateReport = () => {
        let text = `🐞 BUG REPORT: ${report.id}\n`;
        text += `====================================\n`;
        text += `Título: ${report.title || 'Sem título'}\n`;
        text += `Gravidade: ${report.severity}\n`;
        text += `Ambiente: ${report.environment}\n`;
        text += `Dispositivo: ${report.device}\n\n`;
        text += `Passos para Reproduzir:\n`;
        report.steps.forEach((s, i) => text += `${i + 1}. ${s}\n`);
        text += `\nResultado Atual: ${report.actualResult}\n`;
        text += `Resultado Esperado: ${report.expectedResult}\n`;

        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full scrollbar-hide">
            {/* Formulário */}
            <div className="flex flex-col gap-6 text-left">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-xl text-[10px] font-black">{report.id}</span>
                        <h3 className="text-sm font-black uppercase tracking-widest opacity-40 italic">Gerador de Bug Report</h3>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Título */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Título do Bug</label>
                        <input
                            value={report.title}
                            onChange={(e) => updateReport({ title: e.target.value })}
                            placeholder="Ex: Botão de checkout não responde no Safari"
                            className="w-full bg-text-main/5 border border-border-main rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-red-500/10 transition-all"
                        />
                    </div>

                    {/* Configurações Rápidas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <SelectGroup
                            label="Gravidade"
                            value={report.severity}
                            options={['Baixa', 'Média', 'Alta', 'Crítica']}
                            onChange={(v: string) => updateReport({ severity: v as any })}
                            color="text-red-500"
                        />
                        <SelectGroup
                            label="Ambiente"
                            value={report.environment}
                            options={['Produção', 'Staging', 'Desenvolvimento']}
                            onChange={(v: string) => updateReport({ environment: v as any })}
                            color="text-blue-500"
                        />
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Dispositivo</label>
                            <div className="flex gap-1 p-1 bg-text-main/5 rounded-xl">
                                {[
                                    { id: 'Desktop', icon: <Monitor size={14} /> },
                                    { id: 'Mobile', icon: <Smartphone size={14} /> }
                                ].map(d => (
                                    <button
                                        key={d.id}
                                        onClick={() => updateReport({ device: d.id as any })}
                                        className={cn(
                                            "flex-1 py-1.5 flex items-center justify-center rounded-lg transition-all",
                                            report.device === d.id ? "bg-text-main text-bg-main shadow-md" : "opacity-30 hover:opacity-100"
                                        )}
                                    >
                                        {d.icon}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Passos */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Passos para Reproduzir</label>
                        <div className="space-y-2">
                            {report.steps.map((step, i) => (
                                <div key={i} className="flex gap-2 group">
                                    <div className="w-8 h-10 bg-text-main/5 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0">{i + 1}</div>
                                    <input
                                        value={step}
                                        onChange={(e) => updateStep(i, e.target.value)}
                                        placeholder="Descreva a ação..."
                                        className="flex-1 bg-text-main/5 border border-border-main rounded-xl px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-text-main/10"
                                    />
                                    <button onClick={() => removeStep(i)} className="opacity-0 group-hover:opacity-100 p-2 text-red-500 transition-all"><Trash2 size={16} /></button>
                                </div>
                            ))}
                            <button
                                onClick={addStep}
                                className="w-full py-2.5 border-2 border-dashed border-border-main rounded-xl text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 hover:bg-text-main/5 transition-all italic"
                            >
                                + Adicionar Próximo Passo
                            </button>
                        </div>
                    </div>

                    {/* Resultados */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 text-red-500">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2 italic"><XCircleIcon /> Resultado Atual</label>
                            <textarea
                                value={report.actualResult}
                                onChange={(e) => updateReport({ actualResult: e.target.value })}
                                className="w-full bg-red-500/[0.03] border border-red-500/10 rounded-2xl p-4 text-xs font-medium resize-none outline-none focus:ring-2 focus:ring-red-500/20 h-24"
                                placeholder="O que está acontecendo?"
                            />
                        </div>
                        <div className="space-y-2 text-green-500">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2 italic"><CheckCircleIcon /> Resultado Esperado</label>
                            <textarea
                                value={report.expectedResult}
                                onChange={(e) => updateReport({ expectedResult: e.target.value })}
                                className="w-full bg-green-500/[0.03] border border-green-500/10 rounded-2xl p-4 text-xs font-medium resize-none outline-none focus:ring-2 focus:ring-green-500/20 h-24"
                                placeholder="O que deveria acontecer?"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview e Ações */}
            <div className="flex flex-col gap-6">
                <div className="flex-1 bg-card-main border border-border-main text-text-main p-8 rounded-[40px] shadow-2xl relative overflow-hidden group/card min-h-[400px]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover/card:bg-red-500/20 transition-all" />

                    <div className="relative z-10 space-y-8 text-left h-full flex flex-col">
                        <div className="flex items-center gap-3">
                            <Bug size={32} className="text-red-500" />
                            <h4 className="text-2xl font-black italic uppercase tracking-tighter">PRÉVIA DO REPORT</h4>
                        </div>

                        <div className="flex-1 font-mono text-xs space-y-4 opacity-80 overflow-y-auto custom-scrollbar pr-4">
                            <p><span className="text-text-main/40">TITLE:</span> {report.title || '...'}</p>
                            <p><span className="text-text-main/40">SEVERITY:</span> {report.severity}</p>
                            <p><span className="text-text-main/40">STEPS:</span></p>
                            <div className="pl-4 border-l border-border-main space-y-2">
                                {report.steps.map((s, i) => <p key={i}>{i + 1}. {s || '...'}</p>)}
                            </div>
                            <p className="text-red-500"><span className="text-text-main/40">ACTUAL:</span> {report.actualResult || '...'}</p>
                            <p className="text-green-500"><span className="text-text-main/40">EXPECTED:</span> {report.expectedResult || '...'}</p>
                        </div>

                        <button
                            onClick={generateReport}
                            className="w-full py-5 bg-text-main text-bg-main rounded-[24px] font-black text-xs uppercase tracking-[4px] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                        >
                            {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                            {copied ? 'Copiado para o Slack/Jira' : 'Copiar Report Estruturado'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-card-main border border-border-main p-4 rounded-3xl flex items-center gap-3">
                        <div className="p-2 bg-text-main/5 rounded-xl"><AlertCircle size={20} className="text-red-500" /></div>
                        <div className="text-left"><p className="text-[10px] font-black opacity-30 uppercase">Urgência</p><p className="text-xs font-bold">{report.severity === 'Crítica' ? 'IMEDIATA' : 'NORMAL'}</p></div>
                    </div>
                    <div className="bg-card-main border border-border-main p-4 rounded-3xl flex items-center gap-3">
                        <div className="p-2 bg-text-main/5 rounded-xl"><Smartphone size={20} className="text-blue-500" /></div>
                        <div className="text-left"><p className="text-[10px] font-black opacity-30 uppercase">Escopo</p><p className="text-xs font-bold">{report.device}</p></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CustomSelect({
    value,
    onChange,
    options,
    color
}: {
    value: string;
    onChange: (val: string) => void;
    options: { label: string; value: string }[],
    color?: string
}) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedLabel = options.find(o => o.value === value)?.label || value;

    return (
        <div className="relative group/select">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full px-4 py-3 bg-text-main/5 border border-border-main/10 rounded-2xl text-[10px] font-black uppercase outline-none flex items-center justify-between transition-all hover:bg-text-main/10 font-bold",
                    isOpen && "ring-4 ring-text-main/5 border-text-main/20",
                    color
                )}
            >
                <span className="truncate pr-2">{selectedLabel}</span>
                <ChevronDown size={14} className={cn("shrink-0 opacity-30 group-hover/select:opacity-100 transition-all", isOpen && "rotate-180 opacity-100")} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-[60]"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-card-main/90 backdrop-blur-xl border border-border-main rounded-[24px] shadow-2xl z-[70] overflow-hidden py-3"
                        >
                            <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                {options.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => {
                                            onChange(opt.value);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "w-full px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest transition-all relative overflow-hidden",
                                            value === opt.value
                                                ? "bg-text-main text-bg-main"
                                                : "text-text-main/60 hover:bg-text-main/5 hover:text-text-main hover:pl-8"
                                        )}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

function SelectGroup({ label, value, options, onChange, color }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</label>
            <CustomSelect
                value={value}
                onChange={onChange}
                options={options.map((o: string) => ({ label: o, value: o }))}
                color={color}
            />
        </div>
    );
}

function XCircleIcon() { return <AlertCircle size={14} />; }
function CheckCircleIcon() { return <CheckCircle2 size={14} />; }
