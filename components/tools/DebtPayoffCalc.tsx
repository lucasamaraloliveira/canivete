'use client';

import React, { useState, useMemo } from 'react';
import { DollarSign, Percent, Calendar, Calculator, RefreshCw, Layers, TrendingDown, ArrowRight, Wallet, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DebtPayoffCalc() {
    const [balance, setBalance] = useState(10000);
    const [interestRate, setInterestRate] = useState(12); // Annual %
    const [monthlyPayment, setMonthlyPayment] = useState(500);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const handleCurrencyChange = (value: string, setter: (val: number) => void) => {
        // Remove tudo que não é dígito
        const numericValue = value.replace(/\D/g, '');
        // Converte para decimal (dividindo por 100 para centavos)
        const decimalValue = numericValue ? parseFloat(numericValue) / 100 : 0;
        setter(decimalValue);
    };

    const results = useMemo(() => {
        const monthlyRate = (interestRate / 100) / 12;
        let currentBalance = balance;
        let months = 0;
        let totalInterest = 0;
        const schedule = [];

        // Protection against infinite loop
        if (monthlyPayment <= currentBalance * monthlyRate) {
            return { error: 'O pagamento mensal é menor que os juros. A dívida nunca será paga.' };
        }

        while (currentBalance > 0 && months < 360) { // Max 30 years
            const interest = currentBalance * monthlyRate;
            totalInterest += interest;
            const principal = monthlyPayment - interest;
            currentBalance -= principal;
            months++;

            if (months % 6 === 0 || currentBalance <= 0) {
                schedule.push({ month: months, remaining: Math.max(0, currentBalance), paid: totalInterest });
            }
        }

        return {
            months,
            years: (months / 12).toFixed(1),
            totalInterest,
            totalPaid: balance + totalInterest,
            schedule
        };
    }, [balance, interestRate, monthlyPayment]);

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Result Cards */}
                {!results.error ? (
                    <>
                        <div className="bg-card-main border border-border-main p-8 rounded-[40px] shadow-sm flex flex-col gap-2">
                            <p className="text-[10px] font-black opacity-30 uppercase tracking-[3px]">Tempo p/ Quitar</p>
                            <h3 className="text-4xl font-black italic tracking-tight text-text-main">
                                {results.months} <span className="text-xl uppercase not-italic opacity-40">Meses</span>
                            </h3>
                            <p className="text-xs font-bold opacity-30 uppercase tracking-widest">{results.years} Anos</p>
                        </div>
                        <div className="bg-card-main border border-border-main p-8 rounded-[40px] shadow-sm flex flex-col gap-2">
                            <p className="text-[10px] font-black opacity-30 uppercase tracking-[3px]">Total de Juros</p>
                            <h3 className="text-4xl font-black italic tracking-tight text-red-500">
                                {results.totalInterest?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </h3>
                        </div>
                        <div className="bg-card-main border border-border-main p-8 rounded-[40px] shadow-sm flex flex-col gap-2">
                            <p className="text-[10px] font-black opacity-30 uppercase tracking-[3px]">Montante Final</p>
                            <h3 className="text-4xl font-black italic tracking-tight text-text-main">
                                {results.totalPaid?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </h3>
                        </div>
                    </>
                ) : (
                    <div className="lg:col-span-3 bg-red-500/10 border-2 border-red-500/20 p-8 rounded-[40px] flex items-center gap-6 animate-in fade-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 bg-red-500 text-white rounded-3xl flex items-center justify-center shrink-0 shadow-lg">
                            <TrendingDown size={32} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-xl font-black uppercase italic tracking-tighter text-red-500">Atenção Crítica</h4>
                            <p className="text-sm font-bold opacity-60 uppercase tracking-wider">{results.error}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
                <div className="flex flex-col gap-6">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Parâmetros da Dívida</label>
                    <div className="bg-card-main border border-border-main p-8 rounded-[48px] shadow-2xl flex flex-col gap-8">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black opacity-30 uppercase tracking-widest flex items-center gap-2"><Wallet size={12} /> Saldo Devedor</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formatCurrency(balance)}
                                        onChange={e => handleCurrencyChange(e.target.value, setBalance)}
                                        className="w-full bg-text-main/5 border border-border-main/10 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-text-main/5 transition-all font-black text-2xl tabular-nums"
                                    />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black opacity-20 text-xl pointer-events-none">BRL</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center pr-1">
                                    <label className="text-[10px] font-black opacity-30 uppercase tracking-widest flex items-center gap-2"><Percent size={12} /> Taxa de Juros (Anual)</label>
                                    <span className="text-sm font-black italic">{interestRate}%</span>
                                </div>
                                <input
                                    type="range" min="1" max="100" step="0.5" value={interestRate}
                                    onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                                    className="w-full accent-text-main h-2 bg-text-main/10 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black opacity-30 uppercase tracking-widest flex items-center gap-2"><Calendar size={12} /> Pagamento Mensal</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formatCurrency(monthlyPayment)}
                                        onChange={e => handleCurrencyChange(e.target.value, setMonthlyPayment)}
                                        className="w-full bg-text-main/5 border border-border-main/10 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-text-main/5 transition-all font-black text-2xl text-blue-500 tabular-nums"
                                    />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black opacity-20 text-xl pointer-events-none">BRL</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-text-main/5 p-6 rounded-[32px] border border-border-main/10 flex gap-4">
                            <Info size={20} className="text-text-main/20 shrink-0" />
                            <p className="text-[10px] font-medium opacity-30 uppercase leading-relaxed tracking-wider">
                                Simulador baseado no sistema de amortização constante. Juros compostos calculados mensalmente.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 flex flex-col gap-6">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Amortização Estimada</label>
                    <div className="flex-1 bg-card-main border border-border-main rounded-[48px] overflow-hidden shadow-inner flex flex-col">
                        <div className="flex-1 overflow-auto p-10 custom-scrollbar space-y-4">
                            {!results.error ? (results.schedule as any[]).map((s) => (
                                <div key={s.month} className="flex items-center justify-between p-6 bg-text-main/5 rounded-3xl border border-border-main/5 hover:border-text-main/20 transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-2xl bg-text-main text-bg-main flex items-center justify-center font-black italic text-lg shadow-lg">
                                            {s.month}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-1">Mês de Pagamento</p>
                                            <p className="font-bold text-sm uppercase tracking-tight">Saldo Restante</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-black italic tabular-nums group-hover:scale-105 transition-all">
                                            {s.remaining.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </p>
                                        <p className="text-[10px] font-bold text-red-500/50 uppercase tracking-widest">
                                            {s.paid.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} em juros
                                        </p>
                                    </div>
                                </div>
                            )) : (
                                <div className="h-full flex flex-col items-center justify-center opacity-10 py-20 grayscale">
                                    <Calculator size={120} strokeWidth={1} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
