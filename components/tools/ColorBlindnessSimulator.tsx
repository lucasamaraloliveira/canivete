"use client";

import React, { useState, useRef } from 'react';
import { Upload, X, Eye, Info, Download, Maximize, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ColorBlindnessSimulator() {
    const [image, setImage] = useState<string | null>(null);
    const [type, setType] = useState('none');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImage(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const simTypes = [
        { id: 'none', name: 'Visão Normal', desc: 'Sem alterações.' },
        { id: 'protanopia', name: 'Protanopia', desc: 'Incapacidade de ver a cor vermelha.' },
        { id: 'deuteranopia', name: 'Deuteranopia', desc: 'Incapacidade de ver a cor verde.' },
        { id: 'tritanopia', name: 'Tritanopia', desc: 'Incapacidade de ver a cor azul.' },
        { id: 'achromatopsia', name: 'Acromatopsia', desc: 'Visão em tons de cinza (raro).' },
    ];

    // SVG Filter definitions for color blindness
    // Values from: https://github.com/mauricymeo/cvd-simulation-matrix
    const filters = (
        <svg style={{ position: 'absolute', height: 0, width: 0 }}>
            <defs>
                <filter id="protanopia">
                    <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0 0.558, 0.442, 0, 0, 0 0, 0.242, 0.758, 0, 0 0, 0, 0, 1, 0" />
                </filter>
                <filter id="deuteranopia">
                    <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0 0.7, 0.3, 0, 0, 0 0, 0.3, 0.7, 0, 0 0, 0, 0, 1, 0" />
                </filter>
                <filter id="tritanopia">
                    <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0 0, 0.433, 0.567, 0, 0 0, 0.475, 0.525, 0, 0 0, 0, 0, 1, 0" />
                </filter>
                <filter id="achromatopsia">
                    <feColorMatrix type="matrix" values="0.299, 0.587, 0.114, 0, 0 0.299, 0.587, 0.114, 0, 0 0.299, 0.587, 0.114, 0, 0 0, 0, 0, 1, 0" />
                </filter>
            </defs>
        </svg>
    );

    return (
        <div className="space-y-8 h-full flex flex-col">
            {filters}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
                <div className="lg:col-span-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                        <Eye size={14} /> Tipo de Simulação
                    </label>
                    <div className="space-y-2">
                        {simTypes.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setType(t.id)}
                                className={cn(
                                    "w-full p-4 rounded-2xl border text-left transition-all group",
                                    type === t.id ? "bg-text-main text-bg-main border-transparent shadow-xl" : "bg-text-main/5 border-border-main hover:bg-text-main/10"
                                )}
                            >
                                <p className="font-bold text-sm mb-1">{t.name}</p>
                                <p className="text-[10px] opacity-60 leading-tight italic">{t.desc}</p>
                            </button>
                        ))}
                    </div>

                    <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-[24px]">
                        <div className="flex items-center gap-2 mb-3 text-blue-500">
                            <Info size={16} />
                            <h4 className="font-bold text-xs uppercase tracking-widest">Atenção</h4>
                        </div>
                        <p className="text-[10px] opacity-70 leading-relaxed italic">
                            Esta ferramenta utiliza filtros matemáticos para aproximar a percepção visual. Não deve ser usada para fins médicos.
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-3 flex flex-col gap-4">
                    {!image ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 flex flex-col items-center justify-center p-12 border-2 border-dashed border-border-main rounded-[40px] bg-text-main/[0.02] cursor-pointer hover:bg-text-main/[0.05] transition-all group"
                        >
                            <div className="w-20 h-20 bg-text-main/5 rounded-3xl flex items-center justify-center text-text-main/20 mb-6 group-hover:scale-110 transition-transform">
                                <Upload size={40} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Upload de Imagem</h3>
                            <p className="text-sm opacity-60 text-center max-w-sm">
                                Selecione uma imagem para simular como ela é vista por diferentes condições visuais.
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleUpload}
                                className="hidden"
                            />
                        </div>
                    ) : (
                        <div className="flex-1 bg-text-main/5 rounded-[40px] p-6 flex flex-col items-center justify-center relative overflow-hidden group">
                            <div className="relative max-w-full max-h-full">
                                <img
                                    src={image}
                                    alt="Preview"
                                    className="max-h-[500px] rounded-2xl shadow-2xl transition-all duration-500"
                                    style={{ filter: type === 'none' ? 'none' : `url(#${type})` }}
                                />
                                <button
                                    onClick={() => setImage(null)}
                                    className="absolute -top-4 -right-4 bg-red-500 text-white p-3 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="mt-8 flex gap-3">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-6 py-3 bg-text-main/5 hover:bg-text-main/10 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all"
                                >
                                    <RotateCcw size={16} /> Trocar Imagem
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleUpload}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
