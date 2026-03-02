import React, { useState, useCallback, useRef, useEffect } from 'react';
import { VolumeX, Play, Download, Sliders, Music, Zap, Trash2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface SoundParams {
    freq: number;
    attack: number;
    decay: number;
    sustain: number;
    release: number;
    sweep: number;
    noise: boolean;
    wave: OscillatorType;
}

const PRESETS: Record<string, SoundParams> = {
    'Jump': { freq: 150, attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.1, sweep: 500, noise: false, wave: 'square' },
    'Explosion': { freq: 40, attack: 0.05, decay: 0.5, sustain: 0.1, release: 0.5, sweep: -20, noise: true, wave: 'sawtooth' },
    'Power Up': { freq: 200, attack: 0.1, decay: 0.3, sustain: 0.4, release: 0.2, sweep: 800, noise: false, wave: 'sine' },
    'Shoot': { freq: 600, attack: 0, decay: 0.1, sustain: 0, release: 0.05, sweep: -400, noise: false, wave: 'square' },
    'Coin': { freq: 880, attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.1, sweep: 0, noise: false, wave: 'triangle' },
};

export function EightBitFxMaker() {
    const [params, setParams] = useState<SoundParams>(PRESETS['Jump']);
    const audioContext = useRef<AudioContext | null>(null);

    const playSound = useCallback(() => {
        if (!audioContext.current) {
            audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = audioContext.current;
        const now = ctx.currentTime;

        if (params.noise) {
            const bufferSize = 2 * ctx.sampleRate;
            const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
            const whiteNoise = ctx.createBufferSource();
            whiteNoise.buffer = noiseBuffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(params.freq, now);
            filter.frequency.exponentialRampToValueAtTime(Math.max(20, params.freq + params.sweep), now + params.decay);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.5, now + params.attack);
            gain.gain.exponentialRampToValueAtTime(params.sustain || 0.001, now + params.attack + params.decay);
            gain.gain.exponentialRampToValueAtTime(0.001, now + params.attack + params.decay + params.release);

            whiteNoise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            whiteNoise.start(now);
            whiteNoise.stop(now + params.attack + params.decay + params.release);
        } else {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = params.wave;
            osc.frequency.setValueAtTime(params.freq, now);
            osc.frequency.exponentialRampToValueAtTime(Math.max(20, params.freq + params.sweep), now + params.decay);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.5, now + params.attack);
            gain.gain.exponentialRampToValueAtTime(params.sustain || 0.001, now + params.attack + params.decay);
            gain.gain.exponentialRampToValueAtTime(0.001, now + params.attack + params.decay + params.release);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + params.attack + params.decay + params.release);
        }
    }, [params]);

    const updateParam = (key: keyof SoundParams, val: any) => {
        setParams(prev => ({ ...prev, [key]: val }));
    };

    useEffect(() => {
        return () => {
            if (audioContext.current && audioContext.current.state !== 'closed') {
                audioContext.current.close();
            }
        };
    }, []);

    return (
        <div className="flex flex-col items-center gap-12 p-8 max-w-6xl mx-auto h-full overflow-hidden">
            <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-text-main/5 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto text-text-main">
                    <VolumeX size={40} />
                </div>
                <h2 className="text-3xl font-black tracking-tight text-text-main leading-none">8-Bit FX Maker</h2>
                <p className="text-sm opacity-50 font-medium">Crie sons clássicos de videogame retro</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
                {/* Presets & Controls */}
                <div className="space-y-6">
                    <div className="bg-text-main/5 p-8 rounded-[40px] border border-border-main space-y-6 shadow-sm">
                        <h4 className="font-black text-xs uppercase tracking-[0.3em] opacity-30 text-text-main mb-6">Presets Clássicos</h4>
                        <div className="grid grid-cols-3 gap-3">
                            {Object.keys(PRESETS).map(key => (
                                <button
                                    key={key}
                                    onClick={() => { setParams(PRESETS[key]); setTimeout(playSound, 50); }}
                                    className={cn(
                                        "p-4 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all active:scale-95",
                                        JSON.stringify(params) === JSON.stringify(PRESETS[key])
                                            ? "bg-text-main text-bg-main border-text-main"
                                            : "bg-text-main/5 border-border-main hover:bg-text-main/10 text-text-main"
                                    )}
                                >
                                    {key}
                                </button>
                            ))}
                        </div>

                        <div className="pt-6">
                            <button
                                onClick={playSound}
                                className="w-full py-6 bg-text-main text-bg-main rounded-[24px] font-black text-xl flex items-center justify-center gap-4 shadow-2xl hover:opacity-90 active:scale-95 transition-all"
                            >
                                <Play size={24} /> ESCUTAR AGORA
                            </button>
                        </div>
                    </div>

                    <div className="bg-card-main dark:bg-[#0D0D0D]/40 p-8 rounded-[40px] border border-border-main shadow-2xl flex items-center justify-center min-h-[200px] relative overflow-hidden group">
                        <div className="flex gap-1 h-32 items-center">
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        height: [10, Math.random() * 80 + 10, 10],
                                        backgroundColor: ["var(--text-main)", "rgba(var(--text-main-rgb), 0.2)"]
                                    }}
                                    transition={{ repeat: Infinity, duration: 0.5 + Math.random(), delay: i * 0.05 }}
                                    className="w-1.5 rounded-full opacity-20"
                                />
                            ))}
                        </div>
                        <div className="absolute top-4 left-6 text-[10px] font-black uppercase tracking-widest text-text-main opacity-20">Osciloscópio Digital</div>
                    </div>
                </div>

                {/* Sliders Panel */}
                <div className="bg-text-main/5 p-10 rounded-[40px] border border-border-main space-y-8 shadow-sm h-fit">
                    <h4 className="font-black text-xs uppercase tracking-[0.3em] opacity-30 text-text-main flex items-center gap-2">
                        <Sliders size={14} /> Ajustes de Síntese
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Frequência Base ({params.freq}Hz)</p>
                            <input type="range" min="20" max="2000" value={params.freq} onChange={(e) => updateParam('freq', parseInt(e.target.value))} className="w-full accent-text-main opacity-60" />
                        </div>
                        <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Frequency Sweep ({params.sweep})</p>
                            <input type="range" min="-1000" max="1000" value={params.sweep} onChange={(e) => updateParam('sweep', parseInt(e.target.value))} className="w-full accent-text-main opacity-60" />
                        </div>
                        <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Ataque ({params.attack}s)</p>
                            <input type="range" min="0" max="0.5" step="0.01" value={params.attack} onChange={(e) => updateParam('attack', parseFloat(e.target.value))} className="w-full accent-text-main opacity-60" />
                        </div>
                        <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Decaimento ({params.decay}s)</p>
                            <input type="range" min="0" max="1" step="0.01" value={params.decay} onChange={(e) => updateParam('decay', parseFloat(e.target.value))} className="w-full accent-text-main opacity-60" />
                        </div>
                        <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Onda do Oscilador</p>
                            <div className="flex gap-2">
                                {['sine', 'square', 'sawtooth', 'triangle'].map(w => (
                                    <button
                                        key={w}
                                        onClick={() => updateParam('wave', w)}
                                        className={cn("p-2 px-3 border border-border-main rounded-xl text-[8px] font-black uppercase tracking-widest transition-all", params.wave === w ? "bg-text-main text-bg-main" : "hover:bg-text-main/10")}
                                    >
                                        {w}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Gerador de Ruído</p>
                            <button
                                onClick={() => updateParam('noise', !params.noise)}
                                className={cn("w-full py-2.5 border border-border-main rounded-xl font-black text-[10px] uppercase tracking-widest transition-all", params.noise ? "bg-red-500 text-white" : "hover:bg-text-main/10")}
                            >
                                {params.noise ? "ATIVADO (RUÍDO BRANCO)" : "DESATIVADO"}
                            </button>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-border-main flex gap-3">
                        <button className="flex-1 py-4 bg-text-main/5 border border-border-main rounded-2xl font-black text-xs uppercase tracking-widest opacity-30 cursor-not-allowed">
                            <Save size={16} className="mx-auto mb-1" /> Salvar Preset
                        </button>
                        <button className="flex-1 py-4 bg-text-main/5 border border-border-main rounded-2xl font-black text-xs uppercase tracking-widest opacity-30 cursor-not-allowed">
                            <Download size={16} className="mx-auto mb-1" /> Baixar .WAV
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
