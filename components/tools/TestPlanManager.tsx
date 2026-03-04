'use client';

import React, { useState } from 'react';
import {
    Bug, Play, CheckCircle2, XCircle, Clock,
    Plus, Trash2, Download, Upload, Copy,
    Check, ListChecks, FileText, AlertCircle,
    Hash, ArrowRight, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TestCase {
    id: string;
    title: string;
    preconditions: string;
    steps: string[];
    expectedResult: string;
    priority: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
    status: 'Não Executados' | 'Passou' | 'Falhou' | 'Bloqueado';
}

export function TestPlanManager() {
    const [testCases, setTestCases] = useState<TestCase[]>([
        {
            id: 'TC-001',
            title: 'Login com Sucesso',
            preconditions: 'Usuário deve ter conta ativa.',
            steps: ['Acessar página de login', 'Inserir credenciais válidas', 'Clicar em entrar'],
            expectedResult: 'Redirecionar para o dashboard.',
            priority: 'Alta',
            status: 'Não Executados'
        }
    ]);

    const [activeTab, setActiveTab] = useState<'editor' | 'execution'>('editor');
    const [copied, setCopied] = useState(false);

    const addTestCase = () => {
        const newId = `TC-${(testCases.length + 1).toString().padStart(3, '0')}`;
        setTestCases([...testCases, {
            id: newId,
            title: 'Novo Caso de Teste',
            preconditions: '',
            steps: [''],
            expectedResult: '',
            priority: 'Média',
            status: 'Não Executados'
        }]);
    };

    const updateTestCase = (id: string, updates: Partial<TestCase>) => {
        setTestCases(prev => prev.map(tc => tc.id === id ? { ...tc, ...updates } : tc));
    };

    const deleteTestCase = (id: string) => {
        setTestCases(testCases.filter(tc => tc.id !== id));
    };

    const addStep = (tcId: string) => {
        setTestCases(prev => prev.map(tc => {
            if (tc.id === tcId) return { ...tc, steps: [...tc.steps, ''] };
            return tc;
        }));
    };

    const updateStep = (tcId: string, stepIndex: number, value: string) => {
        setTestCases(prev => prev.map(tc => {
            if (tc.id === tcId) {
                const newSteps = [...tc.steps];
                newSteps[stepIndex] = value;
                return { ...tc, steps: newSteps };
            }
            return tc;
        }));
    };

    const removeStep = (tcId: string, stepIndex: number) => {
        setTestCases(prev => prev.map(tc => {
            if (tc.id === tcId) {
                const newSteps = tc.steps.filter((_, i) => i !== stepIndex);
                return { ...tc, steps: newSteps.length ? newSteps : [''] };
            }
            return tc;
        }));
    };

    const exportMarkdown = () => {
        let md = "# Plano de Teste - Canivete\n\n";
        testCases.forEach(tc => {
            md += `## ${tc.id}: ${tc.title}\n`;
            md += `**Prioridade:** ${tc.priority} | **Status:** ${tc.status}\n\n`;
            md += `### Pré-condições\n${tc.preconditions || 'Nenhuma'}\n\n`;
            md += `### Passos\n`;
            tc.steps.forEach((step, i) => md += `${i + 1}. ${step}\n`);
            md += `\n### Resultado Esperado\n${tc.expectedResult}\n\n---\n\n`;
        });

        navigator.clipboard.writeText(md);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const statistics = {
        total: testCases.length,
        passed: testCases.filter(tc => tc.status === 'Passou').length,
        failed: testCases.filter(tc => tc.status === 'Falhou').length,
        pending: testCases.filter(tc => tc.status === 'Não Executados').length
    };

    return (
        <div className="flex flex-col gap-6 h-full pb-8">
            {/* Header com Estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total" icon={<ListChecks size={16} />} value={statistics.total} color="bg-text-main/5" />
                <StatCard label="Passou" icon={<CheckCircle2 size={16} />} value={statistics.passed} color="bg-green-500/10 text-green-500" />
                <StatCard label="Falhou" icon={<XCircle size={16} />} value={statistics.failed} color="bg-red-500/10 text-red-500" />
                <StatCard label="Pendente" icon={<Clock size={16} />} value={statistics.pending} color="bg-yellow-500/10 text-yellow-500" />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 p-1 bg-text-main/5 rounded-2xl self-start">
                <button
                    onClick={() => setActiveTab('editor')}
                    className={cn(
                        "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        activeTab === 'editor' ? "bg-text-main text-bg-main shadow-lg" : "opacity-40 hover:opacity-100"
                    )}
                >
                    Editor de Casos
                </button>
                <button
                    onClick={() => setActiveTab('execution')}
                    className={cn(
                        "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        activeTab === 'execution' ? "bg-text-main text-bg-main shadow-lg" : "opacity-40 hover:opacity-100"
                    )}
                >
                    Modo de Execução
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                {activeTab === 'editor' ? (
                    <>
                        {testCases.map((tc) => (
                            <TestCaseEditor
                                key={tc.id}
                                tc={tc}
                                onUpdate={(updates) => updateTestCase(tc.id, updates)}
                                onDelete={() => deleteTestCase(tc.id)}
                                onAddStep={() => addStep(tc.id)}
                                onUpdateStep={(idx, val) => updateStep(tc.id, idx, val)}
                                onRemoveStep={(idx) => removeStep(tc.id, idx)}
                            />
                        ))}
                        <button
                            onClick={addTestCase}
                            className="w-full py-8 border-2 border-dashed border-border-main rounded-[40px] text-text-main/20 hover:text-text-main/60 hover:bg-text-main/5 transition-all flex flex-col items-center justify-center gap-2"
                        >
                            <Plus size={32} />
                            <span className="font-black text-[10px] uppercase tracking-[4px]">Adicionar Novo Caso de Teste</span>
                        </button>
                    </>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {testCases.map((tc) => (
                            <TestCaseExecuter
                                key={tc.id}
                                tc={tc}
                                onStatusChange={(status) => updateTestCase(tc.id, { status })}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-border-main">
                <p className="text-[10px] font-bold opacity-30 uppercase tracking-[2px]">Os dados são limpos ao fechar a ferramenta</p>
                <button
                    onClick={exportMarkdown}
                    className="px-8 py-4 bg-text-main text-bg-main rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                    {copied ? <Check size={18} /> : <FileText size={18} />}
                    {copied ? 'Copiado para Clipboard' : 'Exportar como Documento MarkDown'}
                </button>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, color }: any) {
    return (
        <div className={cn("p-4 rounded-3xl border border-border-main flex items-center justify-between", color)}>
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{label}</span>
                <span className="text-2xl font-black">{value}</span>
            </div>
            <div className="opacity-40">{icon}</div>
        </div>
    );
}

function CustomSelect({
    value,
    onChange,
    options
}: {
    value: string;
    onChange: (val: string) => void;
    options: { label: string; value: string }[]
}) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedLabel = options.find(o => o.value === value)?.label || value;

    return (
        <div className="relative group/select">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full px-4 py-2 bg-text-main/5 border border-border-main/10 rounded-xl text-[10px] font-black uppercase outline-none flex items-center justify-between transition-all hover:bg-text-main/10 min-w-[110px]",
                    isOpen && "ring-4 ring-text-main/5 border-text-main/20"
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

function TestCaseEditor({ tc, onUpdate, onDelete, onAddStep, onUpdateStep, onRemoveStep }: {
    tc: TestCase,
    onUpdate: (u: Partial<TestCase>) => void,
    onDelete: () => void,
    onAddStep: () => void,
    onUpdateStep: (idx: number, val: string) => void,
    onRemoveStep: (idx: number) => void
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card-main border border-border-main rounded-[40px] p-8 shadow-sm group relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-text-main/10 group-hover:bg-text-main transition-colors" />

            <div className="flex flex-col gap-6 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="bg-text-main text-bg-main px-3 py-1 rounded-xl text-[10px] font-black shrink-0 whitespace-nowrap min-w-[60px] text-center">{tc.id}</span>
                        <input
                            value={tc.title}
                            onChange={(e) => onUpdate({ title: e.target.value })}
                            className="text-lg font-black bg-transparent border-none outline-none focus:ring-2 focus:ring-text-main/5 rounded-xl px-2 w-full truncate"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <CustomSelect
                            value={tc.priority}
                            onChange={(val) => onUpdate({ priority: val as any })}
                            options={[
                                { label: 'Baixa', value: 'Baixa' },
                                { label: 'Média', value: 'Média' },
                                { label: 'Alta', value: 'Alta' },
                                { label: 'Crítica', value: 'Crítica' }
                            ]}
                        />
                        <button
                            onClick={onDelete}
                            className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-all shrink-0"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2 block">Pré-condições</label>
                            <textarea
                                value={tc.preconditions}
                                onChange={(e) => onUpdate({ preconditions: e.target.value })}
                                className="w-full bg-text-main/[0.02] border border-border-main rounded-2xl p-4 text-xs font-medium resize-none outline-none focus:ring-2 focus:ring-text-main/10 h-24"
                                placeholder="Ex: Usuário logado no sistema..."
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2 block">Resultado Esperado</label>
                            <textarea
                                value={tc.expectedResult}
                                onChange={(e) => onUpdate({ expectedResult: e.target.value })}
                                className="w-full bg-text-main/[0.02] border border-border-main rounded-2xl p-4 text-xs font-medium resize-none outline-none focus:ring-2 focus:ring-text-main/10 h-24 italic"
                                placeholder="Ex: O botão deve ficar verde..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2 block">Passos de Execução</label>
                        <div className="space-y-2">
                            {tc.steps.map((step: string, i: number) => (
                                <div key={i} className="flex gap-2 group/step">
                                    <div className="w-6 h-10 bg-text-main/5 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0">{i + 1}</div>
                                    <input
                                        value={step}
                                        onChange={(e) => onUpdateStep(i, e.target.value)}
                                        className="flex-1 bg-text-main/[0.02] border border-border-main rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-text-main/10"
                                        placeholder="Próximo passo..."
                                    />
                                    <button
                                        onClick={() => onRemoveStep(i)}
                                        className="opacity-0 group-hover/step:opacity-40 hover:!opacity-100 p-2 text-red-500"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={onAddStep}
                                className="w-full py-2 bg-text-main/5 rounded-xl text-[9px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all italic"
                            >
                                + Adicionar Passo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function TestCaseExecuter({ tc, onStatusChange }: {
    tc: TestCase,
    onStatusChange: (status: TestCase['status']) => void
}) {
    return (
        <div className="bg-card-main border border-border-main rounded-3xl p-6 flex flex-col gap-4 text-left shadow-sm relative overflow-hidden">
            <div className={cn(
                "absolute top-0 right-0 px-4 py-1 text-[8px] font-black uppercase tracking-widest rounded-bl-xl",
                tc.status === 'Passou' ? "bg-green-500 text-white" :
                    tc.status === 'Falhou' ? "bg-red-500 text-white" :
                        tc.status === 'Bloqueado' ? "bg-blue-500 text-white" :
                            "bg-text-main/10"
            )}>
                {tc.status}
            </div>

            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black opacity-30">{tc.id}</span>
                    <h4 className="font-bold text-sm truncate">{tc.title}</h4>
                </div>
                <p className="text-[11px] opacity-60 line-clamp-2 italic">{tc.expectedResult}</p>
            </div>

            <div className="space-y-1 bg-text-main/[0.02] p-3 rounded-2xl">
                {tc.steps.map((step: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] font-medium opacity-80">
                        <span className="opacity-30">{i + 1}.</span>
                        <span className="truncate">{step}</span>
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => onStatusChange('Passou')}
                    className={cn(
                        "flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all",
                        tc.status === 'Passou' ? "bg-green-500 text-white" : "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                    )}
                >
                    <CheckCircle2 size={14} /> Passou
                </button>
                <button
                    onClick={() => onStatusChange('Falhou')}
                    className={cn(
                        "flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all",
                        tc.status === 'Falhou' ? "bg-red-500 text-white" : "bg-red-500/10 text-red-600 hover:bg-red-500/20"
                    )}
                >
                    <XCircle size={14} /> Falhou
                </button>
                <button
                    onClick={() => onStatusChange('Bloqueado')}
                    className={cn(
                        "p-3 rounded-xl flex items-center justify-center transition-all",
                        tc.status === 'Bloqueado' ? "bg-blue-500 text-white" : "bg-text-main/5 text-text-main/40 hover:bg-text-main/10"
                    )}
                    title="Bloqueado"
                >
                    <AlertCircle size={14} />
                </button>
            </div>
        </div>
    );
}
