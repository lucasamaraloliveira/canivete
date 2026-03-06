"use client";

import React, { useState, useMemo } from 'react';
import { TrendingUp, DollarSign, Users, Clock, RotateCcw, Info, ArrowUpRight, BarChart3, Calculator, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BusinessMetrics() {
    const [roiCost, setRoiCost] = useState(1000);
    const [roiRev, setRoiRev] = useState(2500);

    const [cacSpend, setCacSpend] = useState(5000);
    const [cacUsers, setCacUsers] = useState(100);

    const [ltvArpu, setLtvArpu] = useState(50);
    const [ltvChurn, setLtvChurn] = useState(5);

    const metrics = useMemo(() => {
        const roi = ((roiRev - roiCost) / roiCost * 100).toFixed(1);
        const cac = (cacSpend / cacUsers);
        const ltv = (ltvArpu / (ltvChurn / 100));
        const ltvCac = (ltv / cac).toFixed(2);

        return {
            roi: parseFloat(roi),
            cac: cac,
            ltv: ltv,
            ltvCac: parseFloat(ltvCac)
        };
    }, [roiCost, roiRev, cacSpend, cacUsers, ltvArpu, ltvChurn]);

    const formatBRL = (val: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(val);
    };

    return (
        <div className="space-y-8 h-full flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ROI Section */}
                <div className="bg-text-main/5 border border-border-main p-6 rounded-[40px] space-y-4 shadow-inner group hover:shadow-2xl transition-all duration-500">
                    <div className="flex items-center justify-between">
                        <label className="text-[9px] font-black uppercase tracking-[2px] opacity-40 flex items-center gap-2 italic">
                            <TrendingUp size={12} /> Retorno (ROI)
                        </label>
                        <div className="w-8 h-8 bg-text-main/5 rounded-xl flex items-center justify-center text-text-main/20">
                            <Calculator size={16} />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <span className="text-[9px] font-bold opacity-30 uppercase tracking-widest pl-1">Custo Total</span>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black opacity-20">R$</span>
                                <input
                                    type="text" inputMode="numeric"
                                    value={roiCost.toLocaleString('pt-BR')}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value.replace(/\D/g, '')) || 0;
                                        setRoiCost(val);
                                    }}
                                    className="w-full bg-text-main/5 border border-border-main/20 p-4 pl-10 rounded-[20px] text-lg font-black outline-none focus:ring-4 focus:ring-text-main/5 transition-all shadow-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[9px] font-bold opacity-30 uppercase tracking-widest pl-1">Ganho Total</span>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black opacity-20">R$</span>
                                <input
                                    type="text" inputMode="numeric"
                                    value={roiRev.toLocaleString('pt-BR')}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value.replace(/\D/g, '')) || 0;
                                        setRoiRev(val);
                                    }}
                                    className="w-full bg-text-main/5 border border-border-main/20 p-4 pl-10 rounded-[20px] text-lg font-black outline-none focus:ring-4 focus:ring-text-main/5 transition-all shadow-sm"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-border-main border-dashed">
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-0.5">ROI Calculado</p>
                        <p className={cn(
                            "text-3xl font-black tracking-tighter italic",
                            metrics.roi > 0 ? "text-green-500" : "text-red-500"
                        )}>
                            {metrics.roi}%
                        </p>
                    </div>
                </div>

                {/* CAC Section */}
                <div className="bg-text-main/5 border border-border-main p-6 rounded-[40px] space-y-4 shadow-inner group hover:shadow-2xl transition-all duration-500">
                    <div className="flex items-center justify-between">
                        <label className="text-[9px] font-black uppercase tracking-[2px] opacity-40 flex items-center gap-2 italic">
                            <Users size={12} /> Aquisição (CAC)
                        </label>
                        <div className="w-8 h-8 bg-text-main/5 rounded-xl flex items-center justify-center text-text-main/20">
                            <BarChart3 size={16} />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <span className="text-[9px] font-bold opacity-30 uppercase tracking-widest pl-1">Gasto em Ads</span>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black opacity-20">R$</span>
                                <input
                                    type="text" inputMode="numeric"
                                    value={cacSpend.toLocaleString('pt-BR')}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value.replace(/\D/g, '')) || 0;
                                        setCacSpend(val);
                                    }}
                                    className="w-full bg-text-main/5 border border-border-main/20 p-4 pl-10 rounded-[20px] text-lg font-black outline-none focus:ring-4 focus:ring-text-main/5 transition-all shadow-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[9px] font-bold opacity-30 uppercase tracking-widest pl-1">Novos Clientes</span>
                            <input
                                type="text" inputMode="numeric"
                                value={cacUsers.toLocaleString('pt-BR')}
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value.replace(/\D/g, '')) || 0;
                                    setCacUsers(val);
                                }}
                                className="w-full bg-text-main/5 border border-border-main/20 p-4 rounded-[20px] text-lg font-black outline-none focus:ring-4 focus:ring-text-main/5 transition-all shadow-sm"
                            />
                        </div>
                    </div>
                    <div className="pt-4 border-t border-border-main border-dashed">
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-0.5">Custo Por Cliente</p>
                        <p className="text-3xl font-black tracking-tighter italic text-text-main">
                            {formatBRL(metrics.cac)}
                        </p>
                    </div>
                </div>

                {/* LTV Section */}
                <div className="bg-text-main/5 border border-border-main p-6 rounded-[40px] space-y-4 shadow-inner group hover:shadow-2xl transition-all duration-500">
                    <div className="flex items-center justify-between">
                        <label className="text-[9px] font-black uppercase tracking-[2px] opacity-40 flex items-center gap-2 italic">
                            <Clock size={12} /> Vida Útil (LTV)
                        </label>
                        <div className="w-8 h-8 bg-text-main/5 rounded-xl flex items-center justify-center text-text-main/20">
                            <Rocket size={16} />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <span className="text-[9px] font-bold opacity-30 uppercase tracking-widest pl-1">Receita Mensal (ARPU)</span>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black opacity-20">R$</span>
                                <input
                                    type="text" inputMode="numeric"
                                    value={ltvArpu.toLocaleString('pt-BR')}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value.replace(/\D/g, '')) || 0;
                                        setLtvArpu(val);
                                    }}
                                    className="w-full bg-text-main/5 border border-border-main/20 p-4 pl-10 rounded-[20px] text-lg font-black outline-none focus:ring-4 focus:ring-text-main/5 transition-all shadow-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[9px] font-bold opacity-30 uppercase tracking-widest pl-1">Churn Rate Mensal</span>
                            <div className="relative">
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black opacity-20">%</span>
                                <input
                                    type="text" inputMode="numeric"
                                    value={ltvChurn.toLocaleString('pt-BR')}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value.replace(/\D/g, '')) || 0;
                                        setLtvChurn(val);
                                    }}
                                    className="w-full bg-text-main/5 border border-border-main/20 p-4 pr-10 rounded-[20px] text-lg font-black outline-none focus:ring-4 focus:ring-text-main/5 transition-all shadow-sm"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-border-main border-dashed">
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-0.5">Valor Vitalício (LTV)</p>
                        <p className="text-3xl font-black tracking-tighter italic text-text-main">
                            {formatBRL(metrics.ltv)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Final Outcome */}
            <div className="p-10 bg-text-main text-bg-main rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl -mr-16 -mt-16 rounded-full transform group-hover:scale-125 transition-transform duration-1000" />
                <div className="space-y-1 relative z-10 max-w-lg">
                    <h3 className="text-xl font-black tracking-tighter uppercase italic leading-none">Relação LTV/CAC</h3>
                    <p className="text-[11px] opacity-60 leading-relaxed font-bold italic tracking-tight uppercase">
                        O benchmark ideal é 3:1 ou superior.
                        Este valor indica o quão saudável e escalável é o seu negócio.
                    </p>
                </div>
                <div className="flex flex-col items-center md:items-end gap-1.5 relative z-10">
                    <p className="text-5xl font-black tracking-tighter italic leading-none animate-in slide-in-from-right duration-700">
                        {metrics.ltvCac}x
                    </p>
                    <div className={cn(
                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl",
                        metrics.ltvCac >= 3 ? "bg-green-500 text-white" : "bg-red-500 text-white"
                    )}>
                        {metrics.ltvCac >= 3 ? "Saudável / Escalável" : "Atenção: CAC Alto"}
                    </div>
                </div>
            </div>
        </div>
    );
}
