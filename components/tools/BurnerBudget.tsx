'use client';

import React, { useState, useMemo } from 'react';
import { PieChart, Plus, Trash2, DollarSign, Wallet, ArrowUpCircle, ArrowDownCircle, RefreshCw, Layers, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Transaction {
    id: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
}

export function BurnerBudget() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [desc, setDesc] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('expense');

    const addTransaction = () => {
        if (!desc || !amount) return;
        const newTx: Transaction = {
            id: Math.random().toString(36).substr(2, 9),
            description: desc,
            amount: parseFloat(amount),
            type: type
        };
        setTransactions([newTx, ...transactions]);
        setDesc('');
        setAmount('');
    };

    const stats = useMemo(() => {
        const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
        return {
            total: income - expense,
            income,
            expense,
            percentage: income > 0 ? (expense / income) * 100 : 0
        };
    }, [transactions]);

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Summary Cards */}
                <div className="bg-card-main border border-border-main p-8 rounded-[40px] shadow-sm flex flex-col gap-2 group hover:border-text-main/20 transition-all">
                    <p className="text-[10px] font-black opacity-30 uppercase tracking-[3px]">Balanço Total</p>
                    <h3 className={cn("text-4xl font-black italic tabular-nums", stats.total >= 0 ? "text-text-main" : "text-red-500")}>
                        {stats.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </h3>
                </div>
                <div className="bg-card-main border border-border-main p-8 rounded-[40px] shadow-sm flex flex-col gap-2">
                    <p className="text-[10px] font-black opacity-30 uppercase tracking-[3px] flex items-center gap-2">
                        <ArrowUpCircle size={10} className="text-green-500" /> Entradas
                    </p>
                    <h3 className="text-4xl font-black italic tabular-nums text-green-500 group-hover:scale-105 transition-all">
                        {stats.income.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </h3>
                </div>
                <div className="bg-card-main border border-border-main p-8 rounded-[40px] shadow-sm flex flex-col gap-2">
                    <p className="text-[10px] font-black opacity-30 uppercase tracking-[3px] flex items-center gap-2">
                        <ArrowDownCircle size={10} className="text-red-500" /> Saídas
                    </p>
                    <h3 className="text-4xl font-black italic tabular-nums text-red-500">
                        {stats.expense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Nova Transação</label>
                    <div className="bg-card-main border border-border-main p-8 rounded-[48px] shadow-2xl flex flex-col gap-6">
                        <div className="space-y-4">
                            <div className="flex bg-text-main/5 p-1 rounded-2xl border border-border-main/5">
                                <button
                                    onClick={() => setType('income')}
                                    className={cn(
                                        "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                                        type === 'income' ? "bg-green-500 text-white shadow-lg" : "text-text-main/30 hover:text-text-main"
                                    )}
                                >
                                    <TrendingUp size={14} /> Entrada
                                </button>
                                <button
                                    onClick={() => setType('expense')}
                                    className={cn(
                                        "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                                        type === 'expense' ? "bg-red-500 text-white shadow-lg" : "text-text-main/30 hover:text-text-main"
                                    )}
                                >
                                    <TrendingDown size={14} /> Saída
                                </button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black opacity-30 uppercase tracking-widest">Descrição</label>
                                <input
                                    value={desc}
                                    onChange={e => setDesc(e.target.value)}
                                    placeholder="Ex: Aluguel, Mercado..."
                                    className="w-full bg-text-main/5 border border-border-main/10 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-text-main/5 transition-all font-bold"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black opacity-30 uppercase tracking-widest">Valor (R$)</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    placeholder="0,00"
                                    className="w-full bg-text-main/5 border border-border-main/10 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-text-main/5 transition-all font-mono font-black text-2xl"
                                />
                            </div>
                        </div>

                        <button
                            onClick={addTransaction}
                            className="w-full py-5 bg-text-main text-bg-main rounded-[24px] font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            <Plus size={20} /> Adicionar
                        </button>
                    </div>

                    <div className="p-8 bg-text-main/5 rounded-[40px] border border-border-main/10 flex gap-4">
                        <div className="w-10 h-10 bg-text-main text-bg-main rounded-2xl flex items-center justify-center shrink-0">
                            <Wallet size={20} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-black uppercase tracking-widest">Atenção</h4>
                            <p className="text-[10px] font-medium opacity-40 uppercase leading-relaxed tracking-wider">
                                Esta planilha é volátil. Ao atualizar a página, todos os dados serão apagados. Use para cálculos rápidos e pontuais.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Extrato Temporário</label>
                        <button
                            onClick={() => setTransactions([])}
                            className="text-[10px] font-black opacity-30 hover:opacity-100 uppercase tracking-widest flex items-center gap-2 transition-all"
                        >
                            <RefreshCw size={14} /> Limpar Tudo
                        </button>
                    </div>

                    <div className="flex-1 bg-card-main border border-border-main rounded-[48px] overflow-hidden shadow-inner flex flex-col">
                        <div className="flex-1 overflow-auto p-10 custom-scrollbar space-y-4">
                            {transactions.length > 0 ? transactions.map((t) => (
                                <div
                                    key={t.id}
                                    className="group flex items-center justify-between p-6 bg-text-main/5 rounded-3xl border border-border-main/5 hover:border-text-main/20 transition-all"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg",
                                            t.type === 'income' ? "bg-green-500" : "bg-red-500"
                                        )}>
                                            {t.type === 'income' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-1">{t.type === 'income' ? 'Entrada' : 'Saída'}</p>
                                            <p className="font-bold text-lg uppercase tracking-tight">{t.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <span className={cn("text-2xl font-black italic tabular-nums", t.type === 'income' ? "text-green-500" : "text-red-500")}>
                                            {t.type === 'income' ? '+' : '-'} {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </span>
                                        <button
                                            onClick={() => setTransactions(transactions.filter(tx => tx.id !== t.id))}
                                            className="p-3 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded-xl transition-all"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                                    <PieChart size={80} strokeWidth={1} className="mb-4" />
                                    <p className="font-black uppercase tracking-widest text-sm">Sem transações</p>
                                    <p className="text-[10px] font-bold mt-2">Comece a organizar suas finanças rápidas</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
