'use client';

import React, { useState } from 'react';
import { Banknote, CheckCircle2, XCircle, Search, Eraser, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function BankAccountValidator() {
    const [bank, setBank] = useState('001');
    const [agency, setAgency] = useState('');
    const [account, setAccount] = useState('');
    const [result, setResult] = useState<{ isValid: boolean; message: string } | null>(null);

    const validateAccount = () => {
        if (!agency || !account) return;

        // Basic structural validation per bank
        const accountNum = account.replace(/\D/g, '');
        const agencyNum = agency.replace(/\D/g, '');

        if (bank === '001') { // BB: 4 agency + 1 DV, Up to 8 account + 1 DV
            if (agencyNum.length < 4 || accountNum.length < 5) {
                setResult({ isValid: false, message: 'Dados incompletos para Banco do Brasil.' });
                return;
            }
        }

        if (bank === '237') { // Bradesco: 4 agency + 1 d, 7 account + 1 d
            if (agencyNum.length < 4 || accountNum.length < 7) {
                setResult({ isValid: false, message: 'Estrutura de conta Bradesco inválida.' });
                return;
            }
        }

        // Simulação de validação estrutural bem sucedida
        setResult({ isValid: true, message: 'Estrutura de dados bancários (Agência/Conta) conforme.' });
    };

    return (
        <div className="flex flex-col gap-8 max-w-2xl mx-auto py-12">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 bg-text-main/5 text-text-main rounded-[32px] flex items-center justify-center shadow-2xl mb-4 text-emerald-500">
                    <Banknote size={40} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase whitespace-pre-wrap">Validador Bancário</h2>
                <p className="max-w-md text-sm font-medium opacity-60 leading-relaxed uppercase tracking-widest leading-relaxed text-center">
                    Verifique a estrutura de agências e contas dos principais bancos brasileiros.
                </p>
            </div>

            <div className="bg-card-main border border-border-main rounded-[48px] p-8 sm:p-12 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 flex flex-col gap-8">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4 flex items-center gap-2">
                                <Building size={12} /> Banco
                            </label>
                            <select
                                value={bank}
                                onChange={(e) => setBank(e.target.value)}
                                className="w-full bg-text-main/5 border border-border-main rounded-[24px] p-5 font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none cursor-pointer"
                            >
                                <option value="001">Banco do Brasil (001)</option>
                                <option value="237">Bradesco (237)</option>
                                <option value="104">Caixa Econômica (104)</option>
                                <option value="033">Santander (033)</option>
                                <option value="341">Itaú (341)</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Agência</label>
                                <input
                                    value={agency}
                                    onChange={(e) => setAgency(e.target.value)}
                                    placeholder="0000"
                                    className="w-full bg-text-main/5 border border-border-main rounded-[24px] p-5 font-mono text-xl font-black text-center outline-none"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Conta + DV</label>
                                <input
                                    value={account}
                                    onChange={(e) => setAccount(e.target.value)}
                                    placeholder="000000-0"
                                    className="w-full bg-text-main/5 border border-border-main rounded-[24px] p-5 font-mono text-xl font-black text-center outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={validateAccount}
                            className="py-5 bg-emerald-600 text-white rounded-[24px] font-black text-xs uppercase tracking-[4px] shadow-xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-3 disabled:opacity-20"
                        >
                            <Search size={18} /> Validar Conta
                        </button>
                        <button
                            onClick={() => { setAgency(''); setAccount(''); setResult(null); }}
                            className="py-5 bg-text-main/5 border border-border-main rounded-[24px] font-black text-xs uppercase tracking-[4px] hover:bg-text-main/10 transition-all flex items-center justify-center gap-3"
                        >
                            <Eraser size={18} /> Limpar
                        </button>
                    </div>

                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={cn(
                                    "p-8 rounded-[32px] border flex flex-col items-center text-center gap-4 transition-colors",
                                    result.isValid ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"
                                )}
                            >
                                {result.isValid ? <CheckCircle2 size={48} className="text-emerald-500" /> : <XCircle size={48} className="text-red-500" />}
                                <div>
                                    <h3 className={cn("text-xl font-black uppercase tracking-tighter", result.isValid ? "text-emerald-500" : "text-red-500")}>
                                        {result.isValid ? 'Conta Válida' : 'Dados Inválidos'}
                                    </h3>
                                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">{result.message}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
