"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Calculator, RefreshCw, Trash2, Info, ArrowUpRight, Maximize, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export function MathPlotter() {
    const [equation, setEquation] = useState('Math.sin(x)');
    const [rangeMin, setRangeMin] = useState(-10);
    const [rangeMax, setRangeMax] = useState(10);
    const [steps, setSteps] = useState(100);
    const [error, setError] = useState<string | null>(null);

    const chartData = useMemo(() => {
        const labels = [];
        const data = [];
        const stepSize = (rangeMax - rangeMin) / steps;

        setError(null);
        try {
            // Unsafe eval for a utility tool - should be sanitized or use a math-parser
            // But for a local tool, it's common practice for simplicity.
            const fn = new Function('x', `return ${equation}`);

            for (let x = rangeMin; x <= rangeMax; x += stepSize) {
                labels.push(x.toFixed(1));
                const y = fn(x);
                if (isNaN(y) || !isFinite(y)) data.push(null);
                else data.push(y);
            }

            return {
                labels,
                datasets: [
                    {
                        label: `y = ${equation}`,
                        data: data,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 3,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                    },
                ],
            };
        } catch (err) {
            setError('Equação inválida. Use sintaxe JS (ex: Math.sin(x), x * x)');
            return null;
        }
    }, [equation, rangeMin, rangeMax, steps]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: { size: 12, weight: 'bold' as 'bold' },
                bodyFont: { size: 10 },
                cornerRadius: 12,
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                    drawBorder: false,
                },
                ticks: {
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 10,
                    font: { size: 10, weight: 'bold' as 'bold' },
                    color: 'rgba(0,0,0,0.3)'
                }
            },
            y: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                    drawBorder: false,
                },
                ticks: {
                    font: { size: 10, weight: 'bold' as 'bold' },
                    color: 'rgba(0,0,0,0.3)'
                }
            }
        }
    };

    return (
        <div className="space-y-8 flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Controls Sidebar */}
                <div className="lg:col-span-1 h-[600px] border border-border-main/5 bg-text-main/5 rounded-[40px] p-8 space-y-8 overflow-y-auto custom-scrollbar shadow-inner">
                    <div className="space-y-6">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                            <Settings2 size={14} /> Ajustes Cartesianos
                        </label>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Função y = f(x)</span>
                                <input
                                    type="text" value={equation}
                                    onChange={(e) => setEquation(e.target.value)}
                                    className="w-full bg-text-main/5 border border-border-main/20 p-4 rounded-2xl text-sm font-mono font-bold outline-none focus:ring-4 focus:ring-text-main/5 transition-all shadow-sm"
                                    placeholder="Math.sin(x)"
                                />
                                {error && <p className="text-[9px] text-red-500 font-bold uppercase tracking-tighter italic">{error}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black opacity-40 uppercase tracking-widest pl-1">X Mínimo</p>
                                    <input
                                        type="number" value={rangeMin}
                                        onChange={(e) => setRangeMin(parseInt(e.target.value) || 0)}
                                        className="w-full bg-text-main/5 border border-border-main/20 p-3 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-text-main/10 transition-all font-mono"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black opacity-40 uppercase tracking-widest pl-1">X Máximo</p>
                                    <input
                                        type="number" value={rangeMax}
                                        onChange={(e) => setRangeMax(parseInt(e.target.value) || 0)}
                                        className="w-full bg-text-main/5 border border-border-main/20 p-3 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-text-main/10 transition-all font-mono"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                                    <span className="opacity-40">Precisão (Pontos): {steps}</span>
                                </div>
                                <input
                                    type="range" min="10" max="500" value={steps}
                                    onChange={(e) => setSteps(parseInt(e.target.value))}
                                    className="w-full h-1 bg-text-main/10 rounded-lg appearance-none cursor-pointer accent-text-main"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Plot Area */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <div className="h-[600px] bg-white dark:bg-zinc-950 border border-border-main border-dashed rounded-[56px] p-12 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-text-main/[0.01] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:40px_40px] opacity-20" />
                        <div className="w-full h-full relative z-10">
                            {chartData ? (
                                <Line data={chartData} options={options} />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center opacity-10 gap-4">
                                    <LineChart size={64} />
                                    <p className="font-bold text-lg uppercase tracking-widest italic">Aguardando Equação...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hint Section */}
            <div className="p-8 bg-text-main text-bg-main rounded-[40px] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-14 h-14 bg-bg-main text-text-main rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-all">
                        <Calculator size={28} />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg leading-tight uppercase tracking-tight italic">Matemática Visual</h4>
                        <p className="text-xs opacity-60 italic leading-snug tracking-tighter">
                            Explore funções senoidais, exponenciais ou polinomiais. Use Math.sin, Math.cos, Math.pow(x, 2) e outras funções do JavaScript.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1 relative z-10 text-right">
                    <p className="text-[10px] font-black uppercase tracking-[3px] opacity-40 leading-tight">Visualização de</p>
                    <p className="text-3xl font-black leading-tight italic tracking-tighter uppercase whitespace-nowrap">PLANO CARTESIANO</p>
                </div>
            </div>
        </div>
    );
}
