'use client';

import React, { useState, useRef } from 'react';
import { ScrollText, Plus, Trash2, Download, Eye, Briefcase, GraduationCap, User, Mail, MapPin, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function ResumeGenerator() {
    const [data, setData] = useState({
        name: 'Seu Nome Completo',
        email: 'seu@email.com',
        phone: '(00) 00000-0000',
        location: 'Cidade, Estado',
        summary: 'Breve resumo sobre sua carreira e objetivos profissionais.',
        experience: [{ id: '1', title: 'Cargo', company: 'Empresa', period: '2020 - Presente', description: 'Atividades realizadas.' }],
        education: [{ id: '1', degree: 'Curso', school: 'Instituição', year: '2019' }],
        skills: ['JavaScript', 'React', 'TypeScript']
    });

    const [view, setView] = useState<'edit' | 'preview'>('edit');
    const resumeRef = useRef<HTMLDivElement>(null);

    const updateExperience = (id: string, field: string, value: string) => {
        setData({
            ...data,
            experience: data.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
        });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex flex-col gap-8 max-w-5xl mx-auto py-8">
            <div className="flex flex-col items-center text-center gap-4 mb-4">
                <div className="w-16 h-16 bg-text-main/5 text-text-main rounded-2xl flex items-center justify-center">
                    <ScrollText size={32} />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tighter">Gerador de Currículo</h2>
                <div className="flex bg-text-main/5 p-1 rounded-xl mt-4">
                    <button onClick={() => setView('edit')} className={cn("px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all", view === 'edit' ? "bg-text-main text-bg-main" : "opacity-40")}>Editar</button>
                    <button onClick={() => setView('preview')} className={cn("px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all", view === 'preview' ? "bg-text-main text-bg-main" : "opacity-40")}>Visualizar</button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 overflow-hidden">
                <AnimatePresence mode="wait">
                    {view === 'edit' ? (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 space-y-8 print:hidden">
                            {/* Infos Básicas */}
                            <div className="bg-card-main border border-border-main rounded-[32px] p-8 space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-[3px] opacity-40 mb-4 flex items-center gap-2">
                                    <User size={14} /> Dados Pessoais
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} placeholder="Nome Completo" className="bg-text-main/5 border border-border-main/10 rounded-xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-text-main/10" />
                                    <input value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} placeholder="Email" className="bg-text-main/5 border border-border-main/10 rounded-xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-text-main/10" />
                                    <input value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} placeholder="Telefone" className="bg-text-main/5 border border-border-main/10 rounded-xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-text-main/10" />
                                    <input value={data.location} onChange={(e) => setData({ ...data, location: e.target.value })} placeholder="Localização" className="bg-text-main/5 border border-border-main/10 rounded-xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-text-main/10" />
                                </div>
                                <textarea value={data.summary} onChange={(e) => setData({ ...data, summary: e.target.value })} placeholder="Resumo Profissional" className="w-full bg-text-main/5 border border-border-main/10 rounded-xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-text-main/10 h-24 resize-none" />
                            </div>

                            {/* Experiência */}
                            <div className="bg-card-main border border-border-main rounded-[32px] p-8 space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xs font-black uppercase tracking-[3px] opacity-40 flex items-center gap-2">
                                        <Briefcase size={14} /> Experiência
                                    </h3>
                                    <button onClick={() => setData({ ...data, experience: [...data.experience, { id: Date.now().toString(), title: '', company: '', period: '', description: '' }] })} className="p-2 bg-text-main/5 hover:bg-text-main/10 rounded-lg"><Plus size={16} /></button>
                                </div>
                                {data.experience.map(exp => (
                                    <div key={exp.id} className="p-6 bg-text-main/5 rounded-2xl border border-border-main/5 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <input value={exp.title} onChange={(e) => updateExperience(exp.id, 'title', e.target.value)} placeholder="Cargo" className="bg-transparent border-b border-border-main/20 p-2 text-xs font-bold outline-none" />
                                            <input value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} placeholder="Empresa" className="bg-transparent border-b border-border-main/20 p-2 text-xs font-bold outline-none" />
                                        </div>
                                        <textarea value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} placeholder="Descrição" className="w-full bg-transparent p-2 text-xs font-medium outline-none h-16 resize-none" />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 bg-white text-black p-12 sm:p-20 shadow-2xl rounded-sm min-h-[1100px] border border-black/10 origin-top">
                            <div className="max-w-3xl mx-auto space-y-12 h-full flex flex-col">
                                <header className="border-b-4 border-black pb-8">
                                    <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">{data.name}</h1>
                                    <div className="flex flex-wrap gap-6 text-sm font-bold uppercase tracking-widest opacity-60">
                                        <span className="flex items-center gap-2"><Mail size={14} /> {data.email}</span>
                                        <span className="flex items-center gap-2"><MapPin size={14} /> {data.location}</span>
                                        <span>{data.phone}</span>
                                    </div>
                                </header>

                                <section>
                                    <h2 className="text-xs font-black uppercase tracking-[5px] mb-6 opacity-40">Resumo</h2>
                                    <p className="text-lg font-medium leading-relaxed">{data.summary}</p>
                                </section>

                                <section className="flex-1">
                                    <h2 className="text-xs font-black uppercase tracking-[5px] mb-8 opacity-40">Experiência Profissional</h2>
                                    <div className="space-y-10">
                                        {data.experience.map(exp => (
                                            <div key={exp.id}>
                                                <div className="flex justify-between items-baseline mb-2">
                                                    <h3 className="text-xl font-black uppercase">{exp.title}</h3>
                                                    <span className="text-xs font-bold opacity-40 uppercase tracking-widest">{exp.period}</span>
                                                </div>
                                                <p className="text-sm font-bold mb-3 italic opacity-60">{exp.company}</p>
                                                <p className="text-sm font-medium leading-relaxed opacity-80">{exp.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <footer className="pt-12 border-t border-black/10">
                                    <div className="flex justify-between items-center no-print">
                                        <span className="text-[10px] font-black uppercase tracking-[3px] opacity-20 italic">Curriculum Vitae • Canivete Suíço</span>
                                        <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-bold hover:scale-105 transition-all">
                                            <Printer size={18} /> Imprimir / PDF
                                        </button>
                                    </div>
                                </footer>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
