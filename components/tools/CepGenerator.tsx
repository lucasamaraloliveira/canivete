'use client';

import React, { useState } from 'react';
import { MapPin, Copy, Check, RefreshCw, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function CepGenerator() {
    const [cep, setCep] = useState('');
    const [address, setAddress] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    const states = ['SP', 'RJ', 'MG', 'ES', 'PR', 'SC', 'RS', 'DF', 'GO', 'BA', 'PE', 'CE'];

    const generateCEP = () => {
        const rnd = (max: number) => Math.floor(Math.random() * max).toString();
        const base = Array.from({ length: 5 }, () => rnd(10)).join('');
        const end = Array.from({ length: 3 }, () => rnd(10)).join('');
        const fullCep = `${base}-${end}`;

        setCep(fullCep);

        // Mock de endereço para contexto visual
        setAddress({
            rua: 'Rua das Flores, ' + (Math.floor(Math.random() * 999) + 1),
            bairro: 'Jardim das Américas',
            cidade: 'São Paulo',
            estado: states[Math.floor(Math.random() * states.length)]
        });
    };

    return (
        <div className="flex flex-col gap-8 max-w-2xl mx-auto py-12">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 bg-text-main/5 text-text-main rounded-[32px] flex items-center justify-center shadow-2xl mb-4 text-orange-500">
                    <MapPin size={40} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase">Gerador de CEP</h2>
                <p className="max-w-md text-sm font-medium opacity-60 leading-relaxed uppercase tracking-widest">
                    Gere códigos de endereçamento postal (CEP) válidos e dados de logradouros para testes de geolocalização.
                </p>
            </div>

            <div className="bg-card-main border border-border-main rounded-[48px] p-8 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 flex flex-col gap-6">
                    <div className="bg-text-main/5 border border-border-main rounded-[32px] p-8 flex flex-col items-center justify-center gap-4">
                        {cep ? (
                            <>
                                <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-black tracking-tight font-mono">
                                    {cep}
                                </motion.span>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[2px] opacity-40">{address.rua}</p>
                                    <p className="text-[11px] font-bold uppercase tracking-widest">{address.cidade} - {address.estado}</p>
                                </motion.div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-4 py-8 opacity-20">
                                <Navigation size={48} className="animate-pulse" />
                                <span className="text-sm font-bold uppercase tracking-[4px]">Aguardando Geração</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={generateCEP} className="py-5 bg-text-main text-bg-main rounded-[24px] font-black text-xs uppercase tracking-[4px] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                            <RefreshCw size={18} /> Novo Endereço
                        </button>
                        <button onClick={() => { navigator.clipboard.writeText(cep); setCopied(true); setTimeout(() => setCopied(false), 2000); }} disabled={!cep} className="py-5 bg-text-main/5 border border-border-main rounded-[24px] font-black text-xs uppercase tracking-[4px] hover:bg-text-main/10 transition-all flex items-center justify-center gap-3 disabled:opacity-20">
                            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                            {copied ? 'Copiado' : 'Copiar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
