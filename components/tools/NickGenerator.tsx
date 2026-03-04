'use client';

import React, { useState } from 'react';
import { Ghost, Copy, Check, RefreshCw, Zap, Sparkles, Sword } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function NickGenerator() {
    const [nicks, setNicks] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);

    const generateNicks = () => {
        const prefixes = ['Dark', 'Shadow', 'Iron', 'Golden', 'Mystic', 'Ultra', 'Cyber', 'Neon', 'Arctic', 'Vortex', 'Savage', 'Zen'];
        const words = ['Hunter', 'Knight', 'Wolf', 'Dragon', 'Phantom', 'Ghost', 'Blade', 'Storm', 'Raven', 'Titan', 'Specter', 'Ninja'];
        const suffixes = ['99', 'x', 'Pro', 'Elite', 'King', 'Master', 'Zero', 'Gamer', 'v1', 'Prime'];

        const newNicks = [];
        for (let i = 0; i < 12; i++) {
            const mode = Math.floor(Math.random() * 3);
            let nick = '';
            if (mode === 0) nick = prefixes[Math.floor(Math.random() * prefixes.length)] + words[Math.floor(Math.random() * words.length)];
            else if (mode === 1) nick = words[Math.floor(Math.random() * words.length)] + suffixes[Math.floor(Math.random() * suffixes.length)];
            else nick = prefixes[Math.floor(Math.random() * prefixes.length)] + words[Math.floor(Math.random() * words.length)] + suffixes[Math.floor(Math.random() * suffixes.length)];

            if (Math.random() > 0.7) nick = nick.toLowerCase().replace(/a/g, '4').replace(/e/g, '3').replace(/i/g, '1').replace(/o/g, '0');
            newNicks.push(nick);
        }
        setNicks(newNicks);
    };

    return (
        <div className="flex flex-col gap-8 max-w-2xl mx-auto py-12">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 bg-text-main/5 text-text-main rounded-[32px] flex items-center justify-center shadow-2xl mb-4 text-indigo-500">
                    <Ghost size={40} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase text-indigo-500">Gerador de Nicks</h2>
                <p className="max-w-md text-sm font-medium opacity-60 leading-relaxed uppercase tracking-widest">
                    Ideias épicas e criativas para o seu próximo nickname em jogos, redes sociais ou Discord.
                </p>
            </div>

            <div className="bg-card-main border border-border-main rounded-[48px] p-8 shadow-2xl flex flex-col gap-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                    <Sword size={120} />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <AnimatePresence mode="popLayout">
                        {nicks.length > 0 ? nicks.map((nick, idx) => (
                            <motion.button
                                key={nick + idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.03 }}
                                onClick={() => { navigator.clipboard.writeText(nick); }}
                                className="group relative p-4 bg-text-main/5 border border-border-main/5 rounded-2xl hover:bg-text-main hover:text-bg-main transition-all text-center overflow-hidden"
                            >
                                <span className="text-[11px] font-black uppercase tracking-wider relative z-10">{nick}</span>
                                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-20 transition-opacity">
                                    <Zap size={10} />
                                </div>
                            </motion.button>
                        )) : (
                            <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-10">
                                <Sparkles size={64} className="mb-4" />
                                <span className="text-xs font-black uppercase tracking-[4px]">Pressione o botão</span>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-4 relative z-10">
                    <button onClick={generateNicks} className="py-6 bg-indigo-600 text-white rounded-[24px] font-black text-xs uppercase tracking-[6px] shadow-xl hover:bg-indigo-500 active:scale-95 transition-all flex items-center justify-center gap-4">
                        <RefreshCw size={20} /> SURPREENDA-ME
                    </button>
                </div>
            </div>
        </div>
    );
}
