'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Crown, Heart, Calendar, MessageSquare, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SUPPORTERS, Supporter } from '@/constants/supporters';

export function SupportersWall() {
    return (
        <div className="flex flex-col gap-12 h-full pb-12 overflow-y-auto custom-scrollbar pr-4">
            {/* Hero Header */}
            <div className="flex flex-col items-center text-center gap-4 py-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-text-main text-bg-main rounded-[32px] flex items-center justify-center shadow-2xl mb-4"
                >
                    <Crown size={40} />
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase">Hall da Fama</h2>
                <p className="max-w-xl text-sm font-medium opacity-60 leading-relaxed uppercase tracking-widest">
                    Celebrando as mentes brilhantes que acreditam e impulsionam o ecossistema Canivete. <br /> Seu apoio transforma ideias em ferramentas reais.
                </p>
            </div>

            {/* Grid de Apoiadores */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
                {SUPPORTERS.map((s, i) => (
                    <SupporterCard key={s.id} supporter={s} index={i} />
                ))}
            </div>

            {/* Footer / CTA */}
            <div className="mt-auto pt-12 text-center">
                <div className="inline-flex items-center gap-4 bg-text-main/5 border border-border-main p-6 rounded-[32px]">
                    <Heart className="text-red-500 fill-red-500 animate-pulse" size={24} />
                    <p className="text-[10px] font-black uppercase tracking-[3px] max-w-xs text-left">
                        Quer ver seu nome aqui? <br />
                        <span className="opacity-40">Contribua com o projeto e faça parte da nossa história.</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

function SupporterCard({ supporter, index }: { supporter: Supporter, index: number }) {
    const tierConfig = {
        Diamond: { icon: <Award className="text-cyan-400" />, shadow: 'shadow-cyan-500/10', border: 'border-cyan-500/20' },
        Gold: { icon: <Trophy className="text-yellow-400" />, shadow: 'shadow-yellow-500/10', border: 'border-yellow-500/20' },
        Silver: { icon: <Star className="text-slate-400" />, shadow: 'shadow-slate-500/10', border: 'border-slate-500/20' },
        Bronze: { icon: <Star className="text-orange-400" />, shadow: 'shadow-orange-500/10', border: 'border-orange-500/20' }
    };

    const config = tierConfig[supporter.tier];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className={cn(
                "bg-card-main border p-8 rounded-[48px] relative overflow-hidden group shadow-xl transition-all",
                config.border,
                config.shadow
            )}
        >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-100 group-hover:scale-125 transition-all rotate-12">
                {config.icon}
            </div>

            <div className="flex flex-col gap-6 text-left relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-text-main/5 rounded-2xl flex items-center justify-center font-black text-lg">
                        {supporter.name.charAt(0)}
                    </div>
                    <div>
                        <h4 className="font-black text-lg uppercase tracking-tight truncate max-w-[150px]">{supporter.name}</h4>
                        <div className="flex items-center gap-2">
                            <span className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-text-main/5", config.icon)}>
                                {supporter.tier}
                            </span>
                        </div>
                    </div>
                </div>

                {supporter.message && (
                    <div className="bg-text-main/5 p-4 rounded-2xl italic text-[11px] opacity-80 leading-relaxed relative">
                        <MessageSquare size={12} className="absolute -top-1 -left-1 opacity-20" />
                        "{supporter.message}"
                    </div>
                )}

                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 opacity-30">
                        <Calendar size={12} />
                        <span className="text-[9px] font-black uppercase tracking-widest">{supporter.date}</span>
                    </div>
                    <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.8 }}
                        className="opacity-20 group-hover:opacity-100"
                    >
                        {config.icon}
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
