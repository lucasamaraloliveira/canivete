'use client';

import React, { useState } from 'react';
import { Key, Copy, Check, RefreshCw, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function PasswordGenerator() {
    const [length, setLength] = useState(16);
    const [password, setPassword] = useState('');
    const [options, setOptions] = useState({
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true
    });
    const [copied, setCopied] = useState(false);

    const generatePassword = () => {
        let chars = '';
        if (options.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (options.lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
        if (options.numbers) chars += '0123456789';
        if (options.symbols) chars += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

        if (!chars) return setPassword('');

        let res = '';
        const array = new Uint32Array(length);
        window.crypto.getRandomValues(array);

        for (let i = 0; i < length; i++) {
            res += chars[array[i] % chars.length];
        }
        setPassword(res);
    };

    const getStrength = () => {
        if (password.length < 8) return { label: 'Fraca', color: 'bg-red-500' };
        if (password.length < 12) return { label: 'Média', color: 'bg-yellow-500' };
        if (password.length < 16) return { label: 'Forte', color: 'bg-green-500' };
        return { label: 'Ultra', color: 'bg-blue-500' };
    };

    return (
        <div className="flex flex-col gap-8 max-w-2xl mx-auto py-12">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 bg-text-main/5 text-text-main rounded-[32px] flex items-center justify-center shadow-2xl mb-4 text-amber-500">
                    <Key size={40} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase whitespace-pre-wrap">Gerador de Senha</h2>
                <p className="max-w-md text-sm font-medium opacity-60 leading-relaxed uppercase tracking-widest">
                    Crie senhas ultra-seguras utilizando algoritmos de entropia criptográfica nativos.
                </p>
            </div>

            <div className="bg-card-main border border-border-main rounded-[48px] p-8 shadow-2xl flex flex-col gap-8">
                <div className="relative group/field">
                    <div className="absolute inset-0 bg-text-main/5 rounded-[32px] blur-2xl opacity-0 group-hover/field:opacity-100 transition-opacity" />
                    <div className="relative bg-text-main/5 border border-border-main rounded-[32px] p-10 flex flex-col items-center gap-4">
                        {password ? (
                            <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-2xl sm:text-3xl font-mono font-bold break-all text-center">
                                {password}
                            </motion.span>
                        ) : (
                            <span className="text-sm font-black uppercase tracking-[4px] opacity-10">Pressione Gerar</span>
                        )}

                        {password && (
                            <div className="flex items-center gap-2 mt-4">
                                <div className={cn("h-1.5 w-24 rounded-full overflow-hidden bg-white/5")}>
                                    <div className={cn("h-full transition-all duration-1000", getStrength().color)} style={{ width: `${(length / 32) * 100}%` }} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{getStrength().label}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center px-4">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Comprimento: {length}</span>
                        </div>
                        <input
                            type="range" min="4" max="64" value={length} onChange={(e) => setLength(parseInt(e.target.value))}
                            className="w-full accent-text-main"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {Object.entries(options).map(([key, val]) => (
                            <button
                                key={key}
                                onClick={() => setOptions({ ...options, [key]: !val })}
                                className={cn(
                                    "p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all text-left flex items-center justify-between",
                                    val ? "bg-text-main text-bg-main border-text-main" : "bg-text-main/5 border-transparent opacity-40 hover:opacity-100"
                                )}
                            >
                                {key === 'uppercase' ? 'Maiúsculas' : key === 'lowercase' ? 'Minúsculas' : key === 'numbers' ? 'Números' : 'Símbolos'}
                                {val && <Zap size={12} fill="currentColor" />}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button onClick={generatePassword} className="py-5 bg-text-main text-bg-main rounded-[24px] font-black text-xs uppercase tracking-[4px] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                        <RefreshCw size={18} /> Gerar Senha
                    </button>
                    <button
                        onClick={() => { navigator.clipboard.writeText(password); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                        disabled={!password}
                        className="py-5 bg-text-main/5 border border-border-main rounded-[24px] font-black text-xs uppercase tracking-[4px] hover:bg-text-main/10 transition-all flex items-center justify-center gap-3 disabled:opacity-20"
                    >
                        {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                        {copied ? 'Copiado' : 'Copiar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
