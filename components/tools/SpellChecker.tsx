'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Type, Copy, Check, Trash2, Languages, Sparkles, AlertCircle, BarChart3, Clock, Eraser } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Error {
    message: string;
    shortMessage: string;
    offset: number;
    length: number;
    replacements: { value: string }[];
    rule: { issueType: string; category: { name: string } };
}

export function SpellChecker() {
    const [text, setText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [errors, setErrors] = useState<Error[]>([]);
    const [copied, setCopied] = useState(false);
    const [language, setLanguage] = useState('pt-BR');
    const [stats, setStats] = useState({ words: 0, chars: 0, readingTime: 0 });

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setText(value);

        // Basic Stats
        const words = value.trim() ? value.trim().split(/\s+/).length : 0;
        const chars = value.length;
        const readingTime = Math.ceil(words / 200); // Average 200 wpm
        setStats({ words, chars, readingTime });
    };

    const analyzeText = async () => {
        if (!text.trim()) return;
        setIsAnalyzing(true);
        setErrors([]);

        try {
            const params = new URLSearchParams();
            params.append('text', text);
            params.append('language', language);

            const response = await fetch('https://api.languagetool.org/v2/check', {
                method: 'POST',
                body: params
            });

            const data = await response.json();
            setErrors(data.matches || []);
        } catch (err) {
            console.error('Erro ao analisar texto:', err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const applyFix = (replacement: string, offset: number, length: number) => {
        const newText = text.substring(0, offset) + replacement + text.substring(offset + length);
        setText(newText);
        // Refresh errors after fix
        setErrors(errors.filter(e => e.offset !== offset));
    };

    const smartFix = () => {
        let fixed = text
            .replace(/\s+/g, ' ') // Espaços duplos
            .replace(/\s+([.,!?;:])/g, '$1') // Espaço antes da pontuação
            .replace(/([.,!?;:])(?!\s)/g, '$1 ') // Falta de espaço após pontuação
            .replace(/([.,!?;:])\1+/g, '$1') // Pontuação duplicada (ex: ,, -> ,)
            .replace(/\?{2,}/g, '??'); // Mantém no máximo ?? para tom expressivo
        !fixed.includes('...') && (fixed = fixed.replace(/\.{2,}/g, '...')); // Normaliza reticências
        fixed = fixed.trim();
        setText(fixed);
    };

    const clearText = () => {
        setText('');
        setErrors([]);
        setStats({ words: 0, chars: 0, readingTime: 0 });
    };

    const getErrorCategory = (category: string) => {
        const cat = category.toLowerCase();
        if (cat.includes('punctuation') || cat.includes('typography')) return { label: 'Pontuação', color: 'bg-amber-500/20 text-amber-500' };
        if (cat.includes('grammar')) return { label: 'Gramática', color: 'bg-blue-500/20 text-blue-500' };
        if (cat.includes('misspelling') || cat.includes('typo')) return { label: 'Acentuação', color: 'bg-purple-500/20 text-purple-500' };
        return { label: 'Ortografia', color: 'bg-red-500/20 text-red-500' };
    };

    return (
        <div className="flex flex-col gap-8 max-w-5xl mx-auto py-12 px-4 sm:px-0">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 bg-text-main/5 text-text-main rounded-[32px] flex items-center justify-center shadow-2xl mb-4 text-blue-500">
                    <Languages size={40} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase whitespace-pre-wrap">Corretor Gramatical</h2>
                <p className="max-w-md text-sm font-medium opacity-60 leading-relaxed uppercase tracking-widest">
                    Análise completa de letras, acentuação, gramática e pontuação com IA.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Editor Area */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-card-main border border-border-main rounded-[40px] p-2 shadow-2xl overflow-hidden focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                        <div className="flex items-center justify-between p-4 border-b border-border-main/5">
                            <div className="flex bg-text-main/5 p-1 rounded-xl">
                                {['pt-BR', 'en-US', 'es', 'fr'].map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => setLanguage(lang)}
                                        className={cn(
                                            "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                            language === lang ? "bg-text-main text-bg-main shadow-lg" : "opacity-40 hover:opacity-100"
                                        )}
                                    >
                                        {lang.split('-')[0]}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <button onClick={clearText} className="p-2 hover:bg-red-500/10 text-red-500 rounded-xl transition-all" title="Limpar">
                                    <Trash2 size={18} />
                                </button>
                                <button
                                    onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                                    className="p-2 hover:bg-text-main/10 rounded-xl transition-all"
                                >
                                    {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                </button>
                            </div>
                        </div>
                        <textarea
                            value={text}
                            onChange={handleTextChange}
                            spellCheck="false"
                            placeholder="Cole ou digite seu texto aqui para análise de letras, acentos e pontuação..."
                            className="w-full h-[400px] bg-transparent p-8 outline-none resize-none font-medium text-lg border-none placeholder:opacity-20 custom-scrollbar"
                        />
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={analyzeText}
                            disabled={isAnalyzing || !text.trim()}
                            className="flex-1 py-5 bg-blue-600 text-white rounded-[24px] font-black text-xs uppercase tracking-[4px] shadow-xl hover:bg-blue-500 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-20"
                        >
                            {isAnalyzing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles size={18} />}
                            {isAnalyzing ? 'Analisando...' : 'Analisar Texto Completo'}
                        </button>
                        <button
                            onClick={smartFix}
                            disabled={!text.trim()}
                            className="px-8 py-5 bg-text-main/5 border border-border-main rounded-[24px] font-black text-xs uppercase tracking-[4px] hover:bg-text-main/10 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-20"
                            title="Corrige espaços e pontuações básicas automaticamente"
                        >
                            <Eraser size={18} /> Limpar Texto
                        </button>
                    </div>
                </div>

                {/* Sidebar Stats & Issues */}
                <div className="space-y-6">
                    {/* Stats Card */}
                    <div className="bg-card-main border border-border-main rounded-[32px] p-6 shadow-xl space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[4px] opacity-40 flex items-center gap-2">
                            <BarChart3 size={14} /> Estatísticas
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <p className="text-2xl font-black">{stats.words}</p>
                                <p className="text-[8px] font-black uppercase opacity-40">Palavras</p>
                            </div>
                            <div className="text-center border-x border-border-main/10">
                                <p className="text-2xl font-black">{stats.chars}</p>
                                <p className="text-[8px] font-black uppercase opacity-40">Caracteres</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-black">{stats.readingTime}m</p>
                                <p className="text-[8px] font-black uppercase opacity-40">Leitura</p>
                            </div>
                        </div>
                    </div>

                    {/* Analysis Card */}
                    <div className="bg-card-main border border-border-main rounded-[32px] p-6 shadow-xl flex flex-col min-h-[300px]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[4px] opacity-40 flex items-center gap-2">
                                <AlertCircle size={14} /> Sugestões {errors.length > 0 && `(${errors.length})`}
                            </h3>
                        </div>

                        <div className="flex-1 space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                            <AnimatePresence mode="popLayout">
                                {errors.length > 0 ? (
                                    errors.map((error, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="p-4 bg-text-main/5 border border-border-main/10 rounded-2xl gap-3 flex flex-col"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                                                    getErrorCategory(error.rule.category.name).color
                                                )}>
                                                    {getErrorCategory(error.rule.category.name).label}
                                                </span>
                                            </div>
                                            <div className="flex gap-2 items-start">
                                                <div className="p-1 bg-red-500 text-white rounded-md shrink-0">
                                                    <AlertCircle size={10} />
                                                </div>
                                                <p className="text-xs font-bold leading-tight">{error.message}</p>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {error.replacements.slice(0, 3).map((rep, ridx) => (
                                                    <button
                                                        key={ridx}
                                                        onClick={() => applyFix(rep.value, error.offset, error.length)}
                                                        className="px-3 py-1.5 bg-text-main/5 hover:bg-blue-500 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-border-main/10"
                                                    >
                                                        {rep.value}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center py-12 text-center space-y-4 opacity-20">
                                        <Clock size={40} />
                                        <p className="text-[10px] font-black uppercase tracking-[3px]">
                                            {isAnalyzing ? 'Aguarde a análise...' : 'Nenhum problema encontrado'}
                                        </p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-blue-500/5 p-6 rounded-[32px] border border-blue-500/20 text-center">
                <p className="text-[10px] font-bold text-blue-500/60 uppercase tracking-widest leading-relaxed italic">
                    Utilizamos a API LanguageTool para análises avançadas. Seus dados são processados de forma segura e não são armazenados.
                </p>
            </div>
        </div>
    );
}
