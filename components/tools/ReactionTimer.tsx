import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Zap, Timer, Award, RotateCcw, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

type GameState = 'idle' | 'waiting' | 'ready' | 'clicked-too-soon' | 'result';

export function ReactionTimer() {
    const [gameState, setGameState] = useState<GameState>('idle');
    const [reactionTime, setReactionTime] = useState<number | null>(null);
    const [bestTime, setBestTime] = useState<number | null>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('reaction-best');
            return saved ? parseInt(saved) : null;
        }
        return null;
    });

    const startTime = useRef<number>(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const startGame = useCallback(() => {
        setGameState('waiting');
        const delay = Math.floor(Math.random() * 3000) + 2000; // 2s to 5s delay
        timeoutRef.current = setTimeout(() => {
            setGameState('ready');
            startTime.current = performance.now();
        }, delay);
    }, []);

    const handleClick = useCallback(() => {
        if (gameState === 'waiting') {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setGameState('clicked-too-soon');
        } else if (gameState === 'ready') {
            const endTime = performance.now();
            const timeTaken = Math.round(endTime - startTime.current);
            setReactionTime(timeTaken);
            setGameState('result');

            if (!bestTime || timeTaken < bestTime) {
                setBestTime(timeTaken);
                localStorage.setItem('reaction-best', timeTaken.toString());
            }
        } else if (gameState === 'idle' || gameState === 'result' || gameState === 'clicked-too-soon') {
            startGame();
        }
    }, [gameState, bestTime, startGame]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto gap-8 p-6">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-text-main/5 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-text-main">
                    <Zap size={32} className={cn(gameState === 'ready' && "animate-pulse text-yellow-500")} />
                </div>
                <h2 className="text-3xl font-black tracking-tight text-text-main">Teste de Reação</h2>
                <p className="text-sm opacity-50 font-medium">Clique assim que a cor mudar!</p>
            </div>

            <motion.div
                onClick={handleClick}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={cn(
                    "w-full aspect-square md:aspect-video rounded-[40px] shadow-2xl flex flex-col items-center justify-center cursor-pointer transition-all border-4 select-none",
                    gameState === 'idle' && "bg-card-main dark:bg-[#0D0D0D]/40 border-border-main hover:scale-[1.02]",
                    gameState === 'waiting' && "bg-red-500/80 border-red-500 text-white",
                    gameState === 'ready' && "bg-green-500/80 border-green-500 text-white",
                    gameState === 'clicked-too-soon' && "bg-yellow-500/80 border-yellow-500 text-white",
                    gameState === 'result' && "bg-card-main dark:bg-[#0D0D0D]/40 border-border-main"
                )}
            >
                <AnimatePresence mode="wait">
                    {gameState === 'idle' && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-center space-y-4"
                        >
                            <PlayCircle size={64} className="mx-auto opacity-20" />
                            <p className="text-2xl font-black tracking-tighter opacity-50">CLIQUE PARA INICIAR</p>
                        </motion.div>
                    )}

                    {gameState === 'waiting' && (
                        <motion.div
                            key="waiting"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="text-center space-y-2"
                        >
                            <p className="text-4xl font-black tracking-tighter">ESPERE...</p>
                            <p className="text-sm font-bold opacity-60 uppercase tracking-widest">Aguarde pelo sinal verde</p>
                        </motion.div>
                    )}

                    {gameState === 'ready' && (
                        <motion.div
                            key="ready"
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            className="text-center"
                        >
                            <p className="text-7xl font-black tracking-tighter animate-bounce">CLIQUE AGORA!</p>
                        </motion.div>
                    )}

                    {gameState === 'clicked-too-soon' && (
                        <motion.div
                            key="too-soon"
                            className="text-center space-y-6"
                        >
                            <RotateCcw size={48} className="mx-auto" />
                            <div className="space-y-1">
                                <p className="text-3xl font-black tracking-tighter">MUITO CEDO!</p>
                                <p className="text-sm font-bold opacity-60 uppercase tracking-widest">Clique para tentar novamente</p>
                            </div>
                        </motion.div>
                    )}

                    {gameState === 'result' && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-8"
                        >
                            <div className="space-y-1">
                                <p className="text-8xl font-black tracking-tighter text-text-main">{reactionTime}ms</p>
                                <div className="flex items-center justify-center gap-2 text-text-main/40 uppercase font-black text-xs tracking-widest">
                                    <Timer size={14} /> Tempo de Reação
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="bg-text-main/5 p-4 py-3 rounded-2xl border border-border-main flex-1">
                                    <p className="text-[10px] font-black opacity-30 uppercase mb-1">Melhor Tempo</p>
                                    <p className="text-xl font-black text-text-main flex items-center justify-center gap-2">
                                        <Award size={18} className="text-yellow-500" /> {bestTime}ms
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); startGame(); }}
                                    className="bg-text-main p-4 py-3 rounded-2xl text-bg-main font-black uppercase text-sm tracking-widest hover:opacity-90 flex-1 flex items-center justify-center gap-2 shadow-xl"
                                >
                                    <RotateCcw size={18} /> Jogar
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="bg-text-main/5 p-5 rounded-3xl border border-border-main space-y-2">
                    <h4 className="font-black text-xs uppercase tracking-widest opacity-30">Médias Globais</h4>
                    <p className="text-sm font-medium leading-relaxed opacity-60">
                        A média humana é de cerca de <span className="text-text-main font-bold">250ms</span>.
                        Pilotos profissionais podem chegar a <span className="text-text-main font-bold">150ms</span>.
                    </p>
                </div>
                <div className="bg-text-main/5 p-5 rounded-3xl border border-border-main space-y-2">
                    <h4 className="font-black text-xs uppercase tracking-widest opacity-30">Instruções</h4>
                    <p className="text-sm font-medium leading-relaxed opacity-60">
                        Fique atento! A cor mudará de <span className="font-bold text-red-500">vermelho</span> para <span className="font-bold text-green-500">verde</span> aleatoriamente.
                    </p>
                </div>
            </div>
        </div>
    );
}
