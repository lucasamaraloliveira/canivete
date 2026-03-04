'use client';

import React, { useState, useEffect } from 'react';
import {
    Circle, Square, Box, Triangle, Hexagon, Pentagon,
    Diamond, Layers, Activity, Radius, Ruler, Calculator,
    ChevronRight, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type Shape =
    | 'circle' | 'square' | 'rectangle' | 'triangle'
    | 'pentagon' | 'hexagon' | 'polygon' | 'rhombus'
    | 'trapezoid' | 'parallelogram' | 'ellipse'
    | 'crown' | 'sector';

interface ShapeData {
    id: Shape;
    name: string;
    icon: any;
    inputs: { id: string; label: string; placeholder: string; unit: string }[];
    formula: string;
}

const SHAPES: ShapeData[] = [
    {
        id: 'circle', name: 'Círculo', icon: Circle,
        inputs: [{ id: 'r', label: 'Raio (r)', placeholder: '0.00', unit: 'cm' }],
        formula: 'A = π · r²'
    },
    {
        id: 'square', name: 'Quadrado', icon: Square,
        inputs: [{ id: 'l', label: 'Lado (l)', placeholder: '0.00', unit: 'cm' }],
        formula: 'A = l²'
    },
    {
        id: 'rectangle', name: 'Retângulo', icon: Box,
        inputs: [
            { id: 'b', label: 'Base (b)', placeholder: '0.00', unit: 'cm' },
            { id: 'h', label: 'Altura (h)', placeholder: '0.00', unit: 'cm' }
        ],
        formula: 'A = b · h'
    },
    {
        id: 'triangle', name: 'Triângulo', icon: Triangle,
        inputs: [
            { id: 'b', label: 'Base (b)', placeholder: '0.00', unit: 'cm' },
            { id: 'h', label: 'Altura (h)', placeholder: '0.00', unit: 'cm' }
        ],
        formula: 'A = (b · h) / 2'
    },
    {
        id: 'rhombus', name: 'Losango', icon: Diamond,
        inputs: [
            { id: 'D', label: 'Diagonal Maior (D)', placeholder: '0.00', unit: 'cm' },
            { id: 'd', label: 'Diagonal Menor (d)', placeholder: '0.00', unit: 'cm' }
        ],
        formula: 'A = (D · d) / 2'
    },
    {
        id: 'trapezoid', name: 'Trapézio', icon: Layers,
        inputs: [
            { id: 'B', label: 'Base Maior (B)', placeholder: '0.00', unit: 'cm' },
            { id: 'b', label: 'Base Menor (b)', placeholder: '0.00', unit: 'cm' },
            { id: 'h', label: 'Altura (h)', placeholder: '0.00', unit: 'cm' }
        ],
        formula: 'A = ((B + b) · h) / 2'
    },
    {
        id: 'parallelogram', name: 'Paralelogramo', icon: Activity,
        inputs: [
            { id: 'b', label: 'Base (b)', placeholder: '0.00', unit: 'cm' },
            { id: 'h', label: 'Altura (h)', placeholder: '0.00', unit: 'cm' }
        ],
        formula: 'A = b · h'
    },
    {
        id: 'pentagon', name: 'Pentágono Reg.', icon: Pentagon,
        inputs: [{ id: 'l', label: 'Lado (l)', placeholder: '0.00', unit: 'cm' }],
        formula: 'A ≈ 1.72 · l²'
    },
    {
        id: 'hexagon', name: 'Hexágono Reg.', icon: Hexagon,
        inputs: [{ id: 'l', label: 'Lado (l)', placeholder: '0.00', unit: 'cm' }],
        formula: 'A = (3√3 / 2) · l²'
    },
    {
        id: 'polygon', name: 'Polígono Reg.', icon: Hexagon,
        inputs: [
            { id: 'n', label: 'Nº de Lados (n)', placeholder: '5', unit: 'lados' },
            { id: 'l', label: 'Lado (l)', placeholder: '0.00', unit: 'cm' }
        ],
        formula: 'A = (n · l²) / (4 · tan(π/n))'
    },
    {
        id: 'ellipse', name: 'Elipse', icon: Radius,
        inputs: [
            { id: 'a', label: 'Semi-eixo Maior (a)', placeholder: '0.00', unit: 'cm' },
            { id: 'b', label: 'Semi-eixo Menor (b)', placeholder: '0.00', unit: 'cm' }
        ],
        formula: 'A = π · a · b'
    },
    {
        id: 'crown', name: 'Coroa Circular', icon: Circle,
        inputs: [
            { id: 'R', label: 'Raio Maior (R)', placeholder: '0.00', unit: 'cm' },
            { id: 'r', label: 'Raio Menor (r)', placeholder: '0.00', unit: 'cm' }
        ],
        formula: 'A = π · (R² - r²)'
    },
    {
        id: 'sector', name: 'Setor Circular', icon: Circle,
        inputs: [
            { id: 'r', label: 'Raio (r)', placeholder: '0.00', unit: 'cm' },
            { id: 'a', label: 'Ângulo (α)', placeholder: '45', unit: '°' }
        ],
        formula: 'A = (α / 360) · π · r²'
    }
];

export function AreaCalculator() {
    const [selectedShape, setSelectedShape] = useState<Shape>('circle');
    const [values, setValues] = useState<Record<string, string>>({});
    const [result, setResult] = useState<number | null>(null);

    const currentShape = SHAPES.find(s => s.id === selectedShape)!;

    const calculate = () => {
        const v = (id: string) => parseFloat(values[id] || '0');
        let area = 0;

        switch (selectedShape) {
            case 'circle': area = Math.PI * Math.pow(v('r'), 2); break;
            case 'square': area = Math.pow(v('l'), 2); break;
            case 'rectangle': area = v('b') * v('h'); break;
            case 'triangle': area = (v('b') * v('h')) / 2; break;
            case 'rhombus': area = (v('D') * v('d')) / 2; break;
            case 'trapezoid': area = ((v('B') + v('b')) * v('h')) / 2; break;
            case 'parallelogram': area = v('b') * v('h'); break;
            case 'pentagon': area = 1.720477 * Math.pow(v('l'), 2); break;
            case 'hexagon': area = (3 * Math.sqrt(3) / 2) * Math.pow(v('l'), 2); break;
            case 'polygon':
                const n = v('n');
                const l = v('l');
                area = (n * Math.pow(l, 2)) / (4 * Math.tan(Math.PI / n));
                break;
            case 'ellipse': area = Math.PI * v('a') * v('b'); break;
            case 'crown': area = Math.PI * (Math.pow(v('R'), 2) - Math.pow(v('r'), 2)); break;
            case 'sector': area = (v('a') / 360) * Math.PI * Math.pow(v('r'), 2); break;
        }

        setResult(isNaN(area) || area < 0 ? 0 : area);
    };

    useEffect(() => {
        calculate();
    }, [values, selectedShape]);

    return (
        <div className="flex flex-col gap-8 max-w-6xl mx-auto py-12 px-4">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 bg-text-main/5 text-text-main rounded-[32px] flex items-center justify-center shadow-2xl mb-4 text-indigo-500">
                    <Calculator size={40} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase">Calculadora de Áreas</h2>
                <p className="max-w-md text-sm font-medium opacity-60 leading-relaxed uppercase tracking-widest leading-relaxed">
                    Ferramenta matemática completa para cálculo de áreas de superfícies geométricas.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Shape Selector */}
                <div className="lg:col-span-4 bg-card-main border border-border-main rounded-[40px] p-4 shadow-xl overflow-hidden">
                    <div className="space-y-1 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {SHAPES.map((shape) => (
                            <button
                                key={shape.id}
                                onClick={() => { setSelectedShape(shape.id); setValues({}); setResult(null); }}
                                className={cn(
                                    "w-full flex items-center gap-4 p-4 rounded-3xl transition-all group",
                                    selectedShape === shape.id
                                        ? "bg-text-main text-bg-main shadow-lg"
                                        : "hover:bg-text-main/5"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-2xl flex items-center justify-center transition-colors",
                                    selectedShape === shape.id ? "bg-bg-main/20" : "bg-text-main/5 group-hover:bg-text-main/10"
                                )}>
                                    <shape.icon size={20} />
                                </div>
                                <span className="font-bold text-sm uppercase tracking-widest">{shape.name}</span>
                                <ChevronRight size={16} className={cn("ml-auto opacity-20", selectedShape === shape.id && "opacity-60")} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Calculator Area */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    <div className="bg-card-main border border-border-main rounded-[48px] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedShape}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col gap-10"
                            >
                                <div className="flex items-center justify-between border-b border-border-main/5 pb-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-text-main/5 rounded-[24px] flex items-center justify-center text-indigo-500">
                                            <currentShape.icon size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black uppercase tracking-tighter">{currentShape.name}</h3>
                                            <code className="text-[10px] font-black opacity-40 uppercase tracking-[4px]">{currentShape.formula}</code>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                                        <Info size={16} className="text-indigo-500" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    {currentShape.inputs.map((input) => (
                                        <div key={input.id} className="flex flex-col gap-4">
                                            <label className="text-[10px] font-black uppercase tracking-[3px] opacity-40 ml-4">{input.label}</label>
                                            <div className="relative group/field">
                                                <input
                                                    type="text"
                                                    value={values[input.id] || ''}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/,/g, '.');
                                                        if (/^-?\d*\.?\d*$/.test(val) || val === '') {
                                                            setValues({ ...values, [input.id]: val });
                                                        }
                                                    }}
                                                    placeholder={input.placeholder}
                                                    className="w-full bg-text-main/5 border border-border-main rounded-3xl p-6 text-2xl font-black outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:opacity-10"
                                                />
                                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest opacity-20 pointer-events-none">
                                                    {input.unit}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 p-10 bg-indigo-500 text-white rounded-[40px] shadow-2xl shadow-indigo-500/20 flex flex-col items-center justify-center gap-2 relative overflow-hidden group/result">
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                                    <p className="text-[10px] font-black uppercase tracking-[5px] opacity-60">Área Calculada</p>
                                    <h4 className="text-5xl font-black tracking-tighter sm:text-6xl">
                                        {result?.toLocaleString(undefined, { maximumFractionDigits: 4 }) || '0'}
                                        <span className="text-2xl ml-2 opacity-50">u²</span>
                                    </h4>
                                    <div className="absolute bottom-4 right-8 opacity-20 group-hover/result:opacity-40 transition-opacity">
                                        <Calculator size={40} />
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="bg-indigo-500/5 border border-indigo-500/20 p-6 rounded-[32px] flex items-center gap-6">
                        <div className="w-12 h-12 bg-indigo-500 text-white rounded-2xl flex items-center justify-center shrink-0">
                            <Ruler size={24} />
                        </div>
                        <p className="text-[10px] font-bold text-indigo-500/80 uppercase tracking-widest leading-relaxed">
                            O resultado é exibido em unidades quadradas (u²). Certifique-se de que todas as medidas inseridas estejam na mesma unidade para um cálculo preciso.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
