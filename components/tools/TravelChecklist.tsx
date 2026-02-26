'use client';

import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, Trash2, Luggage, Plane, Map, Briefcase, Camera, Heart, Shield, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChecklistItem {
    id: string;
    text: string;
    completed: boolean;
    category: string;
}

const DEFAULT_CATEGORIES = [
    { name: 'Documentos', icon: <Shield size={16} /> },
    { name: 'Roupas', icon: <Luggage size={16} /> },
    { name: 'Eletrônicos', icon: <Camera size={16} /> },
    { name: 'Higiene', icon: <Heart size={16} /> },
    { name: 'Diversos', icon: <Map size={16} /> }
];

export function TravelChecklist() {
    const [items, setItems] = useState<ChecklistItem[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Documentos');

    const addItem = () => {
        if (!inputValue.trim()) return;
        const newItem: ChecklistItem = {
            id: Math.random().toString(36).substr(2, 9),
            text: inputValue.trim(),
            completed: false,
            category: selectedCategory
        };
        setItems([...items, newItem]);
        setInputValue('');
    };

    const toggleComplete = (id: string) => {
        setItems(items.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
    };

    const deleteItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const progress = items.length > 0 ? (items.filter(i => i.completed).length / items.length) * 100 : 0;

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">Checklist de Viagem</h2>
                    <p className="opacity-40 text-sm font-medium">Prepare sua mala sem esquecer o essencial.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">Progresso</p>
                        <p className="text-xl font-black italic">{Math.round(progress)}%</p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-text-main/5 flex items-center justify-center relative overflow-hidden">
                        <div
                            className="absolute bottom-0 left-0 right-0 bg-text-main/10 transition-all duration-1000"
                            style={{ height: `${progress}%` }}
                        />
                        <Luggage size={24} className="relative z-10 opacity-40" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="bg-card-main border border-border-main p-8 rounded-[40px] shadow-sm flex flex-col gap-6">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addItem()}
                                placeholder="Adicionar item à lista..."
                                className="flex-1 bg-text-main/5 border border-border-main/10 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-text-main/5 transition-all font-medium"
                            />
                            <button
                                onClick={addItem}
                                className="px-8 bg-text-main text-bg-main rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-xl"
                            >
                                <Plus size={20} /> Adicionar
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {DEFAULT_CATEGORIES.map((cat) => (
                                <button
                                    key={cat.name}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2",
                                        selectedCategory === cat.name
                                            ? "bg-text-main text-bg-main border-transparent shadow-lg scale-105"
                                            : "bg-text-main/5 text-text-main/40 border-border-main/10 hover:bg-text-main/10"
                                    )}
                                >
                                    {cat.icon}
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 bg-card-main border border-border-main rounded-[48px] overflow-hidden shadow-inner flex flex-col">
                        <div className="flex-1 overflow-auto p-10 custom-scrollbar space-y-4">
                            {DEFAULT_CATEGORIES.map(cat => {
                                const catItems = items.filter(i => i.category === cat.name);
                                if (catItems.length === 0) return null;

                                return (
                                    <div key={cat.name} className="space-y-4">
                                        <div className="flex items-center gap-3 opacity-30 px-2 pb-2 border-b border-text-main/5">
                                            {cat.icon}
                                            <span className="text-[10px] font-black uppercase tracking-[3px]">{cat.name}</span>
                                        </div>
                                        <div className="space-y-2">
                                            {catItems.map(item => (
                                                <div
                                                    key={item.id}
                                                    className={cn(
                                                        "group flex items-center justify-between p-4 bg-text-main/5 rounded-2xl border border-border-main/5 hover:border-text-main/20 transition-all",
                                                        item.completed && "opacity-40"
                                                    )}
                                                >
                                                    <button
                                                        onClick={() => toggleComplete(item.id)}
                                                        className="flex items-center gap-4 flex-1 text-left"
                                                    >
                                                        <div className={cn(
                                                            "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                                                            item.completed ? "bg-text-main border-text-main text-bg-main" : "border-text-main/20"
                                                        )}>
                                                            {item.completed && <CheckSquare size={14} />}
                                                        </div>
                                                        <span className={cn("font-bold text-sm", item.completed && "line-through")}>
                                                            {item.text}
                                                        </span>
                                                    </button>
                                                    <button
                                                        onClick={() => deleteItem(item.id)}
                                                        className="p-2 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded-xl transition-all"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}

                            {items.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                                    <Plane size={64} className="mb-4 animate-bounce-slow" />
                                    <p className="font-black uppercase tracking-widest text-sm">Boa viagem!</p>
                                    <p className="text-[10px] font-bold mt-2">Adicione itens para começar seu planejamento</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Dicas de Bagagem</label>
                    <div className="bg-card-main border border-border-main p-8 rounded-[40px] flex flex-col gap-6 shadow-sm">
                        {[
                            { title: 'Regra dos 3-1-1', desc: 'Líquidos no máximo 100ml em frascos transparentes.' },
                            { title: 'Identificação', desc: 'Sempre coloque tags com seu contato em todas as malas.' },
                            { title: 'Digitalize', desc: 'Tenha cópias offline de passaportes e vouchers no celular.' }
                        ].map((dica, i) => (
                            <div key={i} className="space-y-2">
                                <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-text-main" />
                                    {dica.title}
                                </h4>
                                <p className="text-[10px] font-bold opacity-30 uppercase leading-relaxed tracking-wider ml-3">
                                    {dica.desc}
                                </p>
                            </div>
                        ))}
                        <button
                            onClick={() => setItems([])}
                            className="mt-4 w-full py-4 border-2 border-red-500/10 hover:bg-red-500/10 text-red-500 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={18} /> Resetar Lista
                        </button>
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0) rotate(0); }
                    50% { transform: translateY(-10px) rotate(5deg); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 4s ease-in-out infinite;
                }
            `}} />
        </div>
    );
}
