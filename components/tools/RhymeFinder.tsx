import React, { useState, useCallback, useMemo } from 'react';
import { Music, Search, Trash2, Zap, Layout, Hash, Info, History } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface Result {
    word: string;
    type: 'perfect' | 'near';
}

export function RhymeFinder() {
    const [input, setInput] = useState('');
    const [results, setResults] = useState<Result[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Simplified local dictionary for the demo
    const PORTUGUESE_WORDS = useMemo(() => [
        "amor", "dor", "calor", "vapor", "temor", "clamor", "esplendor", "valor", "lugar", "mar", "estudar", "amar", "cantar", "sonhar", "dançar", "olhar", "pão", "mão", "chão", "coração", "razão", "atraso", "caso", "passo", "braço", "laço", "espaço", "vento", "tempo", "pensamento", "momento", "contentamento", "riso", "aviso", "juízo", "paraíso", "fogo", "jogo", "logo", "poco", "rogo", "alma", "calma", "palma", "drama", "lama", "trama", "luz", "reduz", "produz", "conduz", "seduz", "cruz"
    ], []);

    const findRhymes = useCallback(() => {
        if (!input.trim()) return;
        setIsSearching(true);
        setError(null);

        const target = input.toLowerCase();
        const lastThree = target.slice(-3);
        const lastTwo = target.slice(-2);

        // Simulate searching
        setTimeout(() => {
            const matches = PORTUGUESE_WORDS.filter(word => word !== target && (word.endsWith(lastThree) || word.endsWith(lastTwo)))
                .map(word => ({
                    word,
                    type: word.endsWith(lastThree) ? 'perfect' : 'near' as 'perfect' | 'near'
                }));

            setResults(matches);
            if (matches.length === 0) {
                setError("Nenhuma rima encontrada no dicionário local.");
            }
            setIsSearching(false);
        }, 600);
    }, [input, PORTUGUESE_WORDS]);

    const clear = () => {
        setInput('');
        setResults([]);
        setError(null);
    };

    return (
        <div className="flex flex-col items-center gap-12 p-8 max-w-4xl mx-auto h-full overflow-hidden">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-text-main/5 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-text-main">
                    <Music size={32} />
                </div>
                <h2 className="text-3xl font-black tracking-tight text-text-main leading-none">Dicionário de Rimas</h2>
                <p className="text-sm opacity-50 font-medium">Encontre a rima perfeita para sua próxima composição</p>
            </div>

            <div className="w-full flex flex-col md:flex-row gap-12 items-start">
                {/* Input Area */}
                <div className="flex-1 space-y-8 w-full order-1 md:order-1">
                    <div className="bg-card-main dark:bg-[#0D0D0D]/40 p-10 rounded-[40px] border border-border-main shadow-2xl backdrop-blur-xl space-y-8 group overflow-hidden relative">
                        <div className="space-y-4 text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 text-text-main">Qual a palavra base?</p>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && findRhymes()}
                                className="w-full bg-text-main/5 border border-border-main rounded-2xl p-6 font-black text-4xl tracking-tighter text-center outline-none focus:ring-4 focus:ring-text-main/10 transition-all uppercase"
                                placeholder="EX: AMOR"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={findRhymes}
                                disabled={isSearching || !input}
                                className={cn(
                                    "flex-1 py-5 rounded-[24px] font-black text-xl flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all outline-none",
                                    input ? "bg-text-main text-bg-main hover:opacity-90" : "bg-text-main/10 text-text-main/20 cursor-not-allowed"
                                )}
                            >
                                {isSearching ? <Search className="animate-spin" /> : <Search size={22} />}
                                BUSCAR RIMAS
                            </button>
                            <button
                                onClick={clear}
                                className="p-5 bg-text-main/5 border border-border-main rounded-[24px] hover:bg-red-500/10 hover:text-red-500 transition-all active:scale-95 outline-none"
                            >
                                <Trash2 size={24} />
                            </button>
                        </div>
                    </div>

                    <div className="bg-text-main/5 p-8 rounded-[32px] border border-border-main space-y-4 opacity-70">
                        <h4 className="font-black text-xs uppercase tracking-widest opacity-30 text-text-main flex items-center gap-2">
                            <Info size={14} /> Inspiração
                        </h4>
                        <p className="text-sm font-medium leading-relaxed opacity-60">
                            O editor busca rimas perfeitas (terminações de 3 letras) e rimas sutis (terminações de 2 letras) para ampliar seu vocabulário criativo.
                            <span className="block mt-2 font-black italic">Ex: DOR → AMOR, CALOR, VAPOR, VALOR</span>
                        </p>
                    </div>
                </div>

                {/* Results Area */}
                <div className="lg:w-96 w-full order-2 md:order-2">
                    <div className="bg-text-main/5 p-8 rounded-[40px] border border-border-main space-y-6 flex flex-col shadow-sm min-h-[400px]">
                        <div className="flex items-center justify-between">
                            <h4 className="font-black text-xs uppercase tracking-[0.3em] opacity-30 text-text-main flex items-center gap-2">
                                <Layout size={14} /> Resultados ({results.length})
                            </h4>
                        </div>

                        <div className="flex-1 overflow-auto custom-scrollbar space-y-3 pr-2 max-h-[500px]">
                            <AnimatePresence mode="wait">
                                {isSearching ? (
                                    <motion.div
                                        key="searching"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="h-full flex flex-col items-center justify-center gap-4 py-20"
                                    >
                                        <Search size={40} className="animate-spin opacity-10" />
                                        <p className="text-[10px] font-black opacity-20 uppercase tracking-widest">Consultando dicionário...</p>
                                    </motion.div>
                                ) : results.length > 0 ? (
                                    results.map((res, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="bg-card-main/40 p-4 border border-border-main rounded-2xl flex items-center justify-between group hover:border-text-main/20 transition-all shadow-sm"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    res.type === 'perfect' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-yellow-500'
                                                )} />
                                                <span className="text-xl font-black text-text-main uppercase tracking-tighter">{res.word}</span>
                                            </div>
                                            {res.type === 'perfect' && <Zap size={14} className="text-yellow-500 animate-pulse" />}
                                        </motion.div>
                                    ))
                                ) : error ? (
                                    <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-4 py-20 text-center">
                                        <History size={40} />
                                        <p className="font-black text-xs uppercase tracking-widest">{error}</p>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-4 py-20">
                                        <Search size={40} />
                                        <p className="font-black text-xs uppercase tracking-widest text-center">Palavra base vazia</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(128, 128, 128, 0.1);
          border-radius: 10px;
        }
      `}</style>
        </div>
    );
}
