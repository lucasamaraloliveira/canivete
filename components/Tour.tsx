"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Compass, Grid, Search, Sparkles, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TourProps {
    isOpen: boolean;
    step: number;
    onNext: () => void;
    onClose: () => void;
}

export function Tour({ isOpen, step, onNext, onClose }: TourProps) {
    const steps = [
        {
            title: "Bem-vindo ao Canivete!",
            description: "Sua nova central de ferramentas avançadas. Tudo o que você precisa em um só lugar, rápido e elegante.",
            icon: <Compass size={32} className="animate-spin-slow" />
        },
        {
            title: "Categorias Inteligentes",
            description: "Explore seis categorias focadas: Dev, Design, Produtividade, Ciência, Segurança e Diversos individuais.",
            icon: <Grid size={32} />
        },
        {
            title: "Busca Instantânea",
            description: "Pressione '/' ou clique na busca para encontrar qualquer ferramenta por nome, categoria ou palavra-chave.",
            icon: <Search size={32} />
        },
        {
            title: "Sempre Atualizado",
            description: "Estamos sempre adicionando novas ferramentas. Fique de olho nas notificações para descobrir as novidades.",
            icon: <Sparkles size={32} />
        }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-card-main border border-border-main rounded-[40px] shadow-2xl overflow-hidden p-8 sm:p-10"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-text-main text-bg-main rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                                {steps[step].icon}
                            </div>

                            <div className="mb-8">
                                <p className="text-[10px] font-black text-text-main/40 uppercase tracking-[4px] mb-2">Tutorial {step + 1}/{steps.length}</p>
                                <h3 className="text-2xl font-black mb-3 italic tracking-tighter uppercase">
                                    {steps[step].title}
                                </h3>
                                <p className="text-sm font-medium opacity-70 leading-relaxed italic">
                                    {steps[step].description}
                                </p>
                            </div>

                            <div className="w-full flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                                >
                                    Pular
                                </button>
                                <button
                                    onClick={onNext}
                                    className="flex-3 py-4 bg-text-main text-bg-main rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                                >
                                    {step === steps.length - 1 ? (
                                        <><Check size={16} /> Começar Agora</>
                                    ) : (
                                        <><ArrowRight size={16} /> Próximo Passo</>
                                    )}
                                </button>
                            </div>

                            <div className="mt-8 flex gap-1.5">
                                {steps.map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "h-1 rounded-full transition-all duration-300",
                                            i === step ? "w-8 bg-text-main" : "w-2 bg-text-main/10"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
