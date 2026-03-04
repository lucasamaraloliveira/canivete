'use client';

import React, { useState } from 'react';
import { CreditCard, Copy, Check, RefreshCw, Disc, ShieldCheck, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function CreditCardGenerator() {
    const [card, setCard] = useState<any>(null);
    const [brand, setBrand] = useState('Visa');
    const [copied, setCopied] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const brands = [
        { name: 'Visa', prefix: '4', length: 16 },
        { name: 'Mastercard', prefix: '5', length: 16 },
        { name: 'American Express', prefix: '34', length: 15 },
        { name: 'Elo', prefix: '63', length: 16 }
    ];

    const generateCard = () => {
        const b = brands.find(br => br.name === brand) || brands[0];
        let num = b.prefix;
        while (num.length < b.length - 1) {
            num += Math.floor(Math.random() * 10).toString();
        }

        // Luhn Algorithm to find check digit
        const checkDigit = (number: string) => {
            let sum = 0;
            for (let i = 0; i < number.length; i++) {
                let digit = parseInt(number[number.length - 1 - i]);
                if (i % 2 === 0) {
                    digit *= 2;
                    if (digit > 9) digit -= 9;
                }
                sum += digit;
            }
            return (10 - (sum % 10)) % 10;
        };

        const d = checkDigit(num);
        const fullNum = num + d;

        setCard({
            number: fullNum.match(/.{1,4}/g)?.join(' '),
            expiry: (Math.floor(Math.random() * 12) + 1).toString().padStart(2, '0') + '/' + (new Date().getFullYear() + Math.floor(Math.random() * 5)).toString().slice(-2),
            cvv: Math.floor(Math.random() * 899 + 100).toString(),
            name: 'NOME DO TITULAR'
        });
    };

    return (
        <div className="flex flex-col gap-8 max-w-2xl mx-auto py-12">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 bg-text-main/5 text-text-main rounded-[32px] flex items-center justify-center shadow-2xl mb-4">
                    <CreditCard size={40} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase">Gerador de Cartão</h2>
                <p className="max-w-md text-sm font-medium opacity-60 leading-relaxed uppercase tracking-widest">
                    Gere números de cartão de crédito válidos estruturalmente (Luhn) para testes de fluxo de checkout.
                </p>
            </div>

            <div className="bg-card-main border border-border-main rounded-[48px] p-8 shadow-2xl flex flex-col gap-6 relative overflow-hidden group">
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full bg-text-main/5 border border-border-main rounded-2xl px-6 py-4 flex items-center justify-between text-xs font-black uppercase tracking-widest transition-all hover:bg-text-main/10"
                    >
                        <span>Bandeira: {brand}</span>
                        <Disc size={16} className={cn("transition-transform duration-300", isOpen && "rotate-180")} />
                    </button>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-card-main border border-border-main rounded-2xl shadow-2xl z-50 overflow-hidden"
                            >
                                {brands.map(b => (
                                    <button
                                        key={b.name}
                                        onClick={() => { setBrand(b.name); setIsOpen(false); }}
                                        className={cn(
                                            "w-full p-4 text-left text-[10px] font-bold uppercase tracking-widest border-b border-border-main/5 last:border-0 hover:bg-text-main/5",
                                            brand === b.name && "bg-text-main text-bg-main"
                                        )}
                                    >
                                        {b.name}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="relative aspect-[1.586/1] w-full max-w-[400px] mx-auto bg-gradient-to-br from-zinc-800 to-black rounded-[24px] p-8 shadow-2xl flex flex-col justify-between overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
                        <Smartphone size={160} />
                    </div>

                    <div className="flex justify-between items-start z-10">
                        <div className="w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-lg opacity-80" />
                        <span className="text-white/40 font-black italic tracking-widest text-[10px] uppercase">CANIVETE CARD</span>
                    </div>

                    <div className="space-y-4 z-10">
                        <div className="text-white text-2xl sm:text-3xl font-mono tracking-[4px] font-bold drop-shadow-lg">
                            {card?.number || '•••• •••• •••• ••••'}
                        </div>
                        <div className="flex gap-10 items-end">
                            <div className="flex flex-col">
                                <span className="text-[8px] text-white/40 font-bold uppercase tracking-widest">Validade</span>
                                <span className="text-white font-mono text-sm">{card?.expiry || '••/••'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[8px] text-white/40 font-bold uppercase tracking-widest">CVV</span>
                                <span className="text-white font-mono text-sm">{card?.cvv || '•••'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-end z-10">
                        <span className="text-white/60 font-bold tracking-widest text-[9px] uppercase">{card?.name}</span>
                        <div className="text-white font-black italic text-lg tracking-tighter opacity-80">{brand}</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button onClick={generateCard} className="py-5 bg-text-main text-bg-main rounded-[24px] font-black text-xs uppercase tracking-[4px] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                        <RefreshCw size={18} /> Novo Cartão
                    </button>
                    <button onClick={() => { navigator.clipboard.writeText(card?.number.replace(/\s/g, '')); setCopied(true); setTimeout(() => setCopied(false), 2000); }} disabled={!card} className="py-5 bg-text-main/5 border border-border-main rounded-[24px] font-black text-xs uppercase tracking-[4px] hover:bg-text-main/10 transition-all flex items-center justify-center gap-3 disabled:opacity-20">
                        {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                        {copied ? 'Copiado' : 'Copiar Número'}
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-3 bg-red-500/5 p-6 rounded-[32px] border border-red-500/20">
                <ShieldCheck size={24} className="text-red-500 shrink-0" />
                <p className="text-[10px] font-bold text-red-500/60 uppercase tracking-widest leading-relaxed italic">
                    Importante: Estes cartões funcionam apenas em ambiente de testes que utilizam o algoritmo de Luhn. Não suportam transações reais.
                </p>
            </div>
        </div>
    );
}
