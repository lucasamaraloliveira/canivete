'use client';

import React, { useState } from 'react';
import { Command, Copy, Check, Search, Sparkles, Heart, Star, Music, Zap, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function SymbolCopyTool() {
    const [searchTerm, setSearchTerm] = useState('');
    const [copied, setCopied] = useState<string | null>(null);

    const categories = [
        { name: 'Populares', icon: Sparkles, symbols: ['✨', '🔥', '💎', '🚀', '⭐', '❤️', '✅', '❌', '⚠️', '🔔', '📌', '💡'] },
        { name: 'Símbolos', icon: Command, symbols: ['⌘', '⌥', '⇧', '⌃', '℗', '©', '®', '™', '†', '‡', '§', '¶'] },
        { name: 'Setas', icon: Zap, symbols: ['←', '→', '↑', '↓', '↔', '↕', '↖', '↗', '↘', '↙', '↩', '↪'] },
        { name: 'Matemática', icon: Coffee, symbols: ['±', '×', '÷', '≈', '≠', '≤', '≥', '∞', '∑', '∏', '∂', '∆'] },
        { name: 'Estrelas', icon: Star, symbols: ['★', '☆', '✦', '✧', '🌠', '🌟', '✴', '✳', '✷', '✸', '✹', '✺'] },
        { name: 'Música/Mídia', icon: Music, symbols: ['♪', '♫', '♬', '♭', '♮', '♯', '▶', '■', '⏹', '⏪', '⏩', '⏸'] }
    ];

    const handleCopy = (sym: string) => {
        navigator.clipboard.writeText(sym);
        setCopied(sym);
        setTimeout(() => setCopied(null), 1500);
    };

    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto py-12">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 bg-text-main/5 text-text-main rounded-[32px] flex items-center justify-center shadow-2xl mb-4 text-emerald-400">
                    <Command size={40} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase">Símbolos P/ Copiar</h2>
                <p className="max-w-md text-sm font-medium opacity-60 leading-relaxed uppercase tracking-widest">
                    Milhares de símbolos, emojis e caracteres especiais prontos para copiar e colar onde quiser.
                </p>
            </div>

            <div className="bg-card-main border border-border-main rounded-[48px] p-8 shadow-2xl flex flex-col gap-10">
                <div className="space-y-12">
                    {categories.map((cat) => (
                        <div key={cat.name} className="flex flex-col gap-6">
                            <div className="flex items-center gap-4 px-2">
                                <div className="p-2 bg-text-main/5 rounded-xl text-text-main">
                                    <cat.icon size={18} />
                                </div>
                                <h3 className="text-[10px] font-black uppercase tracking-[4px] opacity-40">{cat.name}</h3>
                            </div>

                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3">
                                {cat.symbols.map((sym) => (
                                    <motion.button
                                        key={sym}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleCopy(sym)}
                                        className={cn(
                                            "aspect-square flex items-center justify-center text-2xl bg-text-main/5 border border-border-main/5 rounded-2xl transition-all relative group",
                                            copied === sym ? "bg-green-500 text-white scale-110" : "hover:bg-text-main hover:text-bg-main"
                                        )}
                                    >
                                        {sym}
                                        <AnimatePresence>
                                            {copied === sym && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -20 }}
                                                    animate={{ opacity: 1, y: -40 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute whitespace-nowrap bg-text-main text-bg-main px-2 py-1 rounded text-[8px] font-black uppercase tracking-[2px]"
                                                >
                                                    Copiado!
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
