import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Keyboard, Timer, Target, Award, RotateCcw, PlayCircle, Zap, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

const PASSAGES = [
    "No meio do caminho tinha uma pedra tinha uma pedra no meio do caminho tinha uma pedra.",
    "O rato roeu a roupa do rei de Roma o rei de Roma a roupa do rato roeu.",
    "Três pratos de trigo para três tigres tristes três tigres tristes para três pratos de trigo.",
    "O tempo voa como uma flecha a fruta voa como uma banana no jardim da esperança.",
    "A tecnologia é o fogo moderno que aquece nossas casas mas também queima se não tivermos cuidado.",
    "Programar é a arte de dizer a um computador o que fazer da maneira mais complicada possível.",
    "O amanhã pertence àqueles que se preparam hoje para as oportunidades que virão amanhã.",
    "Um pequeno passo para o homem um grande salto para a humanidade nas estrelas distantes.",
    "A vida é o que acontece enquanto você está ocupado fazendo outros planos para o futuro.",
    "O sucesso não é o final o fracasso não é fatal o que conta é a coragem de continuar.",
    "Penso, logo existo. A dúvida é o princípio da sabedoria no caminho da verdade absoluta.",
    "A educação é a arma mais poderosa que você pode usar para mudar o mundo inteiro.",
    "Tudo o que um sonho precisa para ser realizado é alguém que acredite que ele possa ser realizado.",
    "A persistência é o caminho do êxito e a coragem é a escada para as grandes conquistas."
];

type GameState = 'idle' | 'running' | 'finished';

export function TypingSpeedTest() {
    const [gameState, setGameState] = useState<GameState>('idle');
    const [passage, setPassage] = useState('');
    const [userInput, setUserInput] = useState('');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [timer, setTimer] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [totalMistakes, setTotalMistakes] = useState(0);
    const [totalTyped, setTotalTyped] = useState(0);

    const [bestWpm, setBestWpm] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('typing-best-wpm');
            return saved ? parseInt(saved) : 0;
        }
        return 0;
    });

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const startTest = useCallback(() => {
        const randomPassage = PASSAGES[Math.floor(Math.random() * PASSAGES.length)];
        setPassage(randomPassage);
        setUserInput('');
        setGameState('running');
        setStartTime(null);
        setTimer(0);
        setWpm(0);
        setTotalMistakes(0);
        setTotalTyped(0);
        setTimeout(() => inputRef.current?.focus(), 100);
    }, []);

    const finishTest = useCallback((finalWpm: number) => {
        if (timerRef.current) clearInterval(timerRef.current);
        setGameState('finished');
        if (finalWpm > bestWpm) {
            setBestWpm(finalWpm);
            localStorage.setItem('typing-best-wpm', finalWpm.toString());
        }
    }, [bestWpm]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (gameState !== 'running') return;

        // Start timer on first char
        if (!startTime) {
            const now = performance.now();
            setStartTime(now);
            timerRef.current = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        }

        // Detect if it's an addition or a backspace
        if (val.length > userInput.length) {
            const charTyped = val[val.length - 1];
            const targetChar = passage[userInput.length];

            setTotalTyped(prev => prev + 1);
            if (charTyped !== targetChar) {
                setTotalMistakes(prev => prev + 1);
            }
        }

        setUserInput(val);

        // Calculate real-time WPM
        if (startTime) {
            const timeElapsed = (performance.now() - startTime) / 60000; // minutes
            if (timeElapsed > 0) {
                const currentWpm = Math.round((val.length / 5) / timeElapsed);
                setWpm(currentWpm);
            }
        }

        if (val === passage) {
            const finalTimeInMin = (performance.now() - (startTime || performance.now())) / 60000;
            const finalWpm = Math.round((val.length / 5) / (finalTimeInMin || 0.01));
            setWpm(finalWpm);
            finishTest(finalWpm);
        }
    };

    const accuracy = useMemo(() => {
        if (totalTyped === 0) return 100;
        const acc = Math.max(0, Math.round(((totalTyped - totalMistakes) / totalTyped) * 100));
        return acc;
    }, [totalTyped, totalMistakes]);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const renderPassage = useMemo(() => {
        return passage.split('').map((char, i) => {
            let status: 'pending' | 'correct' | 'wrong' | 'current' = 'pending';

            if (i < userInput.length) {
                status = userInput[i] === char ? 'correct' : 'wrong';
            } else if (i === userInput.length && gameState === 'running') {
                status = 'current';
            }

            return (
                <span
                    key={i}
                    className={cn(
                        "relative transition-all duration-100",
                        status === 'pending' && "text-text-main/20",
                        status === 'correct' && "text-text-main font-bold",
                        status === 'wrong' && "text-red-500 font-bold bg-red-500/10 rounded-sm",
                        status === 'current' && "text-text-main/40 underline decoration-text-main/30 underline-offset-4"
                    )}
                >
                    {char}
                    {status === 'current' && (
                        <motion.span
                            layoutId="cursor"
                            className="absolute -left-0.5 top-1 bottom-1 w-0.5 bg-text-main/50 animate-pulse"
                        />
                    )}
                </span>
            );
        });
    }, [passage, userInput, gameState]);

    return (
        <div className="flex flex-col items-center justify-center max-w-5xl mx-auto gap-8 p-6 h-full font-sans">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-text-main/5 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-text-main">
                    <Keyboard size={32} />
                </div>
                <h2 className="text-3xl font-black tracking-tight text-text-main">Typing Speed Pro</h2>
                <p className="text-sm opacity-50 font-medium">Teste sua velocidade e precisão de digitação</p>
            </div>

            <div className="w-full space-y-6">
                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'WPM', value: wpm, icon: Zap, color: 'text-yellow-500' },
                        { label: 'Precisão', value: `${accuracy}%`, icon: Target, color: 'text-green-500' },
                        { label: 'Tempo', value: `${timer}s`, icon: Timer, color: 'text-blue-500' },
                        { label: 'Melhor', value: bestWpm, icon: Award, color: 'text-purple-500' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-card-main/30 dark:bg-[#0D0D0D]/20 p-5 rounded-[24px] border border-border-main/50 text-center space-y-1 backdrop-blur-sm shadow-sm transition-all hover:border-border-main">
                            <p className="text-[10px] font-black opacity-30 uppercase tracking-widest flex items-center justify-center gap-1">
                                <stat.icon size={10} className={stat.color} /> {stat.label}
                            </p>
                            <p className="text-2xl font-black text-text-main tracking-tighter">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Display Area */}
                <div
                    className="w-full bg-card-main dark:bg-[#0D0D0D]/40 border border-border-main rounded-[40px] p-8 md:p-16 shadow-2xl space-y-8 min-h-[350px] flex flex-col justify-center relative overflow-hidden group cursor-text"
                    onClick={() => inputRef.current?.focus()}
                >
                    <AnimatePresence mode="wait">
                        {gameState === 'idle' ? (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="text-center space-y-8"
                            >
                                <PlayCircle size={80} className="mx-auto text-text-main opacity-5 group-hover:scale-110 transition-transform duration-700" />
                                <div className="space-y-3">
                                    <h3 className="text-3xl font-black tracking-tight text-text-main opacity-60">Pronto para a pista?</h3>
                                    <p className="text-sm font-bold opacity-30 uppercase tracking-[0.4em]">O cronômetro inicia com o primeiro toque.</p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); startTest(); }}
                                    className="px-10 py-5 bg-text-main text-bg-main rounded-[24px] font-black uppercase text-sm tracking-[0.2em] shadow-2xl active:scale-95 transition-all hover:shadow-text-main/20"
                                >
                                    Iniciar Desafio
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="running"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative"
                            >
                                <div className="text-2xl md:text-3xl font-medium leading-[1.6] tracking-tight select-none font-mono">
                                    {renderPassage}
                                </div>

                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={userInput}
                                    onChange={handleInput}
                                    className="absolute inset-0 opacity-0 cursor-default"
                                    autoFocus
                                    autoComplete="off"
                                    autoCapitalize="off"
                                    spellCheck={false}
                                />

                                <AnimatePresence>
                                    {gameState === 'finished' && (
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                            animate={{ scale: 1, opacity: 1, y: 0 }}
                                            className="absolute inset-0 flex flex-col items-center justify-center bg-card-main/90 dark:bg-bg-main/95 backdrop-blur-xl rounded-[32px] z-20 p-10 text-center space-y-6 shadow-2xl border border-border-main"
                                        >
                                            <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto border-4 border-green-500/20">
                                                <Award size={48} />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-5xl font-black italic tracking-tighter text-text-main">RESULTADO FINAL</h3>
                                                <div className="flex gap-8 justify-center mt-4">
                                                    <div>
                                                        <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">Velocidade</p>
                                                        <p className="text-3xl font-black text-text-main">{wpm} WPM</p>
                                                    </div>
                                                    <div className="w-px bg-border-main" />
                                                    <div>
                                                        <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">Precisão</p>
                                                        <p className="text-3xl font-black text-text-main">{accuracy}%</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); startTest(); }}
                                                className="mt-4 px-10 py-5 bg-text-main text-bg-main rounded-[24px] font-black uppercase text-sm tracking-widest shadow-xl flex items-center gap-3 hover:scale-105 transition-all"
                                            >
                                                <RotateCcw size={20} /> Tentar Novamente
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Focus Warning */}
                    {gameState === 'running' && (
                        <div className="absolute top-4 right-8 flex items-center gap-2 opacity-20 group-hover:opacity-40 transition-opacity">
                            <ShieldCheck size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Foco Ativo</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-text-main/5 p-6 rounded-[32px] border border-border-main opacity-50 flex items-center gap-6">
                <div className="flex -space-x-2">
                    {['text-green-500', 'text-yellow-500', 'text-blue-500'].map((c, i) => (
                        <div key={i} className={cn("w-3 h-3 rounded-full border border-bg-main", c)} />
                    ))}
                </div>
                <p className="text-xs font-medium leading-relaxed">
                    Sua precisão é calculada com base em todos os toques, incluindo correções. Foque em manter um ritmo constante para um melhor WPM.
                </p>
            </div>
        </div>
    );
}
