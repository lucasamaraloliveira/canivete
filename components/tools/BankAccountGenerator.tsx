'use client';

import React, { useState } from 'react';
import { Banknote, Copy, Check, RefreshCw, Landmark, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function BankAccountGenerator() {
    const [account, setAccount] = useState<any>(null);
    const [bank, setBank] = useState('Banco do Brasil');
    const [copied, setCopied] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const banks = [
        { name: 'Banco do Brasil', code: '001', branchLen: 4, accLen: 8 },
        { name: 'Itaú', code: '341', branchLen: 4, accLen: 5 },
        { name: 'Bradesco', code: '237', branchLen: 4, accLen: 7 },
        { name: 'Santander', code: '033', branchLen: 4, accLen: 8 },
        { name: 'Caixa', code: '104', branchLen: 4, accLen: 12 }
    ];

    const generateAccount = () => {
        const b = banks.find(br => br.name === bank) || banks[0];
        const rnd = (len: number) => Array.from({ length: len }, () => Math.floor(Math.random() * 10)).join('');

        setAccount({
            branch: rnd(b.branchLen),
            account: rnd(b.accLen),
            digit: Math.floor(Math.random() * 10).toString(),
            type: Math.random() > 0.5 ? 'Corrente' : 'Poupança'
        });
    };

    return (
        <div className="flex flex-col gap-8 max-w-2xl mx-auto py-12">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 bg-text-main/5 text-text-main rounded-[32px] flex items-center justify-center shadow-2xl mb-4 text-yellow-600">
                    <Banknote size={40} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase">Conta Bancária</h2>
                <p className="max-w-md text-sm font-medium opacity-60 leading-relaxed uppercase tracking-widest">
                    Gere dados de contas bancárias fictícias para testes de integração com gateways de pagamento e ERPs.
                </p>
            </div>

            <div className="bg-card-main border border-border-main rounded-[48px] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Landmark size={120} />
                </div>

                <div className="relative z-10 flex flex-col gap-8">
                    <div className="relative">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-full bg-text-main/5 border border-border-main rounded-2xl px-6 py-4 flex items-center justify-between text-xs font-black uppercase tracking-widest transition-all hover:bg-text-main/10"
                        >
                            <span>Banco: {bank}</span>
                            <ChevronDown size={16} className={cn("transition-transform duration-300", isOpen && "rotate-180")} />
                        </button>

                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-card-main border border-border-main rounded-2xl shadow-2xl z-50 overflow-hidden"
                                >
                                    {banks.map(b => (
                                        <button
                                            key={b.code}
                                            onClick={() => { setBank(b.name); setIsOpen(false); }}
                                            className={cn(
                                                "w-full p-4 text-left text-[10px] font-bold uppercase tracking-widest border-b border-border-main/5 last:border-0 hover:bg-text-main/5",
                                                bank === b.name && "bg-text-main text-bg-main"
                                            )}
                                        >
                                            {b.name} ({b.code})
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-text-main/5 border border-border-main rounded-[32px] p-6 flex flex-col items-center">
                            <span className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-2">Agência</span>
                            <span className="text-3xl font-black font-mono tracking-widest">{account?.branch || '••••'}</span>
                        </div>
                        <div className="bg-text-main/5 border border-border-main rounded-[32px] p-6 flex flex-col items-center">
                            <span className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-2">Conta & DV</span>
                            <span className="text-3xl font-black font-mono tracking-widest">{account ? `${account.account}-${account.digit}` : '••••••••-•'}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={generateAccount} className="py-5 bg-text-main text-bg-main rounded-[24px] font-black text-xs uppercase tracking-[4px] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                            <RefreshCw size={18} /> Gerar Conta
                        </button>
                        <button onClick={() => {
                            const txt = `Banco: ${bank}\nAgência: ${account.branch}\nConta: ${account.account}-${account.digit}\nTipo: ${account.type}`;
                            navigator.clipboard.writeText(txt);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        }} disabled={!account} className="py-5 bg-text-main/5 border border-border-main rounded-[24px] font-black text-xs uppercase tracking-[4px] hover:bg-text-main/10 transition-all flex items-center justify-center gap-3 disabled:opacity-20">
                            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                            {copied ? 'Copiado' : 'Copiar Tudo'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
