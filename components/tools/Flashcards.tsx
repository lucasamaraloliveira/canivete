'use client';

import React, { useState } from 'react';
import { CreditCard, Plus, Trash2, RotateCcw, ChevronLeft, ChevronRight, Eye, Layers, Zap, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface Flashcard {
    id: string;
    front: string;
    back: string;
}

export function Flashcards() {
    const [cards, setCards] = useState<Flashcard[]>([]);
    const [frontText, setFrontText] = useState('');
    const [backText, setBackText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showBack, setShowBack] = useState(false);
    const [isStudyMode, setIsStudyMode] = useState(false);

    const addCard = () => {
        if (!frontText || !backText) return;
        const newCard: Flashcard = {
            id: Math.random().toString(36).substr(2, 9),
            front: frontText,
            back: backText
        };
        setCards([...cards, newCard]);
        setFrontText('');
        setBackText('');
    };

    const deleteCard = (id: string) => {
        const newCards = cards.filter(c => c.id !== id);
        setCards(newCards);
        if (currentIndex >= newCards.length) setCurrentIndex(Math.max(0, newCards.length - 1));
    };

    const nextCard = () => {
        setShowBack(false);
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setCurrentIndex(0);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    };

    const prevCard = () => {
        setShowBack(false);
        setCurrentIndex(prev => prev > 0 ? prev - 1 : cards.length - 1);
    };

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">Single-Session Flashcards</h2>
                    <p className="opacity-40 text-sm font-medium">Estude rápido sem deixar rastros. Os dados somem ao fechar a página.</p>
                </div>
                <div className="flex bg-text-main/5 p-1 rounded-2xl border border-border-main/5">
                    <button
                        onClick={() => setIsStudyMode(false)}
                        className={cn(
                            "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            !isStudyMode ? "bg-text-main text-bg-main shadow-lg" : "text-text-main/30 hover:text-text-main"
                        )}
                    >
                        Criar
                    </button>
                    <button
                        onClick={() => { if (cards.length > 0) setIsStudyMode(true); }}
                        disabled={cards.length === 0}
                        className={cn(
                            "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            isStudyMode ? "bg-text-main text-bg-main shadow-lg" : "text-text-main/30 hover:text-text-main",
                            cards.length === 0 && "opacity-20 grayscale"
                        )}
                    >
                        Estudar
                    </button>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                {!isStudyMode ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                        <div className="flex flex-col gap-6">
                            <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Nova Carta</label>
                            <div className="bg-card-main border border-border-main p-8 rounded-[48px] shadow-2xl flex flex-col gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black opacity-30 uppercase tracking-widest">Frente (Pergunta)</label>
                                        <textarea
                                            value={frontText}
                                            onChange={e => setFrontText(e.target.value)}
                                            placeholder="Qual a capital da França?"
                                            className="w-full bg-text-main/5 border border-border-main/10 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-text-main/5 transition-all font-bold text-lg resize-none h-24 custom-scrollbar"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black opacity-30 uppercase tracking-widest">Verso (Resposta)</label>
                                        <textarea
                                            value={backText}
                                            onChange={e => setBackText(e.target.value)}
                                            placeholder="Paris"
                                            className="w-full bg-text-main/5 border border-border-main/10 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-text-main/5 transition-all font-bold text-lg resize-none h-24 custom-scrollbar"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={addCard}
                                    className="w-full py-5 bg-text-main text-bg-main rounded-[24px] font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                                >
                                    <Plus size={20} /> Adicionar Carta
                                </button>
                            </div>

                            <div className="bg-text-main/5 border border-border-main/10 p-8 rounded-[40px] flex gap-4 mt-auto">
                                <div className="w-10 h-10 bg-text-main text-bg-main rounded-2xl flex items-center justify-center shrink-0">
                                    <Zap size={20} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest">Dica Rápida</h4>
                                    <p className="text-[10px] font-medium opacity-40 uppercase leading-relaxed tracking-wider">
                                        Pressione "Estudar" após criar ao menos uma carta para iniciar o ciclo de memorização.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Suas Cartas ({cards.length})</label>
                            <div className="flex-1 bg-text-main/5 border border-border-main rounded-[48px] overflow-auto p-8 custom-scrollbar space-y-3">
                                {cards.map((card) => (
                                    <div key={card.id} className="group p-6 bg-card-main border border-border-main/5 rounded-3xl flex items-center justify-between transition-all hover:border-text-main/20">
                                        <div className="flex-1 min-w-0 pr-4">
                                            <p className="text-[10px] font-black opacity-20 uppercase tracking-widest mb-1">Pergunta</p>
                                            <p className="font-bold text-sm truncate uppercase tracking-tight">{card.front}</p>
                                        </div>
                                        <button
                                            onClick={() => deleteCard(card.id)}
                                            className="p-3 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded-xl transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                                {cards.length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-10 grayscale py-20">
                                        <CreditCard size={80} strokeWidth={1} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-12 max-w-2xl mx-auto">
                        <div className="w-full flex justify-between items-center text-[10px] font-black opacity-30 uppercase tracking-[4px]">
                            <span>Carta {currentIndex + 1} de {cards.length}</span>
                            <div className="flex gap-2">
                                <span className="px-2 py-0.5 bg-text-main text-bg-main rounded tracking-widest">Live Session</span>
                            </div>
                        </div>

                        <div
                            onClick={() => setShowBack(!showBack)}
                            className={cn(
                                "w-full aspect-[16/10] bg-card-main border-4 border-border-main rounded-[64px] shadow-2xl flex flex-col items-center justify-center p-12 text-center cursor-pointer transition-all duration-700 preserve-3d relative",
                                showBack ? "rotate-y-180" : ""
                            )}
                        >
                            <div className={cn("absolute inset-0 flex flex-col items-center justify-center p-12 backface-hidden", showBack && "hidden")}>
                                <p className="text-[10px] font-black opacity-20 uppercase tracking-[8px] mb-8">Pergunta</p>
                                <h3 className="text-4xl font-black text-text-main tracking-tighter uppercase leading-tight">
                                    {cards[currentIndex]?.front}
                                </h3>
                                <div className="mt-12 flex items-center gap-2 opacity-20 group">
                                    <Eye size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Clique p/ ver resposta</span>
                                </div>
                            </div>
                            <div className={cn("absolute inset-0 flex flex-col items-center justify-center p-12 backface-hidden rotate-y-180", !showBack && "hidden")}>
                                <p className="text-[10px] font-black opacity-20 uppercase tracking-[8px] mb-8">Resposta</p>
                                <h3 className="text-4xl font-black text-blue-500 tracking-tighter uppercase leading-tight italic">
                                    {cards[currentIndex]?.back}
                                </h3>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <button
                                onClick={prevCard}
                                className="w-16 h-16 bg-text-main/5 border border-border-main/10 rounded-full flex items-center justify-center hover:scale-110 active:scale-90 transition-all text-text-main/40 hover:text-text-main"
                            >
                                <ChevronLeft size={32} />
                            </button>
                            <div className="flex bg-text-main/5 p-1 rounded-3xl border border-border-main/10">
                                <button
                                    onClick={nextCard}
                                    className="px-10 py-5 bg-text-main text-bg-main rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                                >
                                    Entendi <Check size={20} />
                                </button>
                                <button
                                    onClick={nextCard}
                                    className="px-8 py-5 text-text-main/40 font-black uppercase tracking-widest hover:text-text-main transition-all flex items-center gap-3"
                                >
                                    Revisar <RotateCcw size={20} />
                                </button>
                            </div>
                            <button
                                onClick={nextCard}
                                className="w-16 h-16 bg-text-main/5 border border-border-main/10 rounded-full flex items-center justify-center hover:scale-110 active:scale-90 transition-all text-text-main/40 hover:text-text-main"
                            >
                                <ChevronRight size={32} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
                .rotate-y-0 { transform: rotateY(0deg); }
            `}} />
        </div>
    );
}
