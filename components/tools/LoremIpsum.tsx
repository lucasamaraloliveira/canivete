'use client';

import React, { useState } from 'react';
import { FileText, Copy, Check, RefreshCw, Sliders, Type, Layers, AlignLeft, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

const THEMES: Record<string, string[]> = {
    'Clássico': ['Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua'],
    'Tech': ['Cloud', 'Serverless', 'Framework', 'Frontend', 'Backend', 'API', 'Database', 'Docker', 'Kubernetes', 'Component', 'Interface', 'UX', 'Responsive', 'Agile', 'Sprint', 'Git', 'Deploy'],
    'Café': ['Espresso', 'Latte', 'Cappuccino', 'Mocha', 'Arabica', 'Robusta', 'Grinder', 'Brew', 'Roast', 'Aroma', 'Steam', 'Barista', 'Caffeine', 'Cup', 'Filter', 'Morning', 'Shot'],
    'Chef': ['Sauté', 'Braise', 'Garnish', 'Umami', 'Sous-vide', 'Reduction', 'Seasoning', 'Knife', 'Kitchen', 'Flavour', 'Aromatic', 'Gourmet', 'Plating', 'Fresh', 'Savory', 'Zest']
};

export function LoremIpsumCustom() {
    const [theme, setTheme] = useState('Clássico');
    const [paragraphs, setParagraphs] = useState(3);
    const [sentencesPerPara, setSentencesPerPara] = useState(5);
    const [copied, setCopied] = useState(false);
    const [result, setResult] = useState('');

    const generate = () => {
        let output = [];
        const words = THEMES[theme];

        for (let p = 0; p < paragraphs; p++) {
            let paragraph = [];
            for (let s = 0; s < sentencesPerPara; s++) {
                let sentence = [];
                const sentenceLength = Math.floor(Math.random() * 8) + 8;
                for (let w = 0; w < sentenceLength; w++) {
                    sentence.push(words[Math.floor(Math.random() * words.length)]);
                }
                let sentenceStr = sentence.join(' ');
                paragraph.push(sentenceStr.charAt(0).toUpperCase() + sentenceStr.slice(1) + '.');
            }
            output.push(paragraph.join(' '));
        }
        setResult(output.join('\n\n'));
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Initial generate
    React.useEffect(() => {
        generate();
    }, [theme, paragraphs, sentencesPerPara]);

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Resultado Gerado</label>
                        <button
                            onClick={copyToClipboard}
                            disabled={!result}
                            className="bg-text-main/5 hover:bg-text-main hover:text-bg-main px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-2"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copiado' : 'Copiar Tudo'}
                        </button>
                    </div>

                    <div className="flex-1 bg-card-main border border-border-main rounded-[48px] shadow-2xl overflow-hidden relative group">
                        <div className="absolute inset-0 p-12 text-lg font-medium leading-relaxed opacity-80 overflow-auto custom-scrollbar select-all">
                            {result.split('\n\n').map((p, i) => (
                                <p key={i} className="mb-6">{p}</p>
                            ))}
                        </div>
                        <div className="absolute top-6 right-6 opacity-5 pointer-events-none">
                            <FileText size={160} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Configurações</label>
                    <div className="bg-card-main border border-border-main p-8 rounded-[40px] flex flex-col gap-8 shadow-sm">

                        <div className="space-y-4">
                            <label className="text-[10px] font-black opacity-30 uppercase tracking-widest">Tema das Palavras</label>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.keys(THEMES).map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTheme(t)}
                                        className={cn(
                                            "py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all",
                                            theme === t
                                                ? "bg-text-main text-bg-main border-transparent shadow-lg"
                                                : "bg-text-main/5 text-text-main/40 border-border-main/5 hover:bg-text-main/10"
                                        )}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pr-1">
                                    <label className="text-[10px] font-bold opacity-30 uppercase tracking-widest flex items-center gap-2">
                                        <Layers size={12} /> Parágrafos
                                    </label>
                                    <span className="text-sm font-black italic">{paragraphs}</span>
                                </div>
                                <input
                                    type="range" min="1" max="10" step="1" value={paragraphs}
                                    onChange={(e) => setParagraphs(parseInt(e.target.value))}
                                    className="w-full accent-text-main h-2 bg-text-main/10 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center pr-1">
                                    <label className="text-[10px] font-black opacity-30 uppercase tracking-widest flex items-center gap-2">
                                        <Hash size={12} /> Frases por Parágrafo
                                    </label>
                                    <span className="text-sm font-black italic">{sentencesPerPara}</span>
                                </div>
                                <input
                                    type="range" min="2" max="15" step="1" value={sentencesPerPara}
                                    onChange={(e) => setSentencesPerPara(parseInt(e.target.value))}
                                    className="w-full accent-text-main h-2 bg-text-main/10 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        </div>

                        <button
                            onClick={generate}
                            className="w-full py-5 bg-text-main text-bg-main rounded-[24px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            <RefreshCw size={20} /> Regenerar Texto
                        </button>
                    </div>

                    <div className="p-8 bg-text-main/5 rounded-[40px] border border-border-main/10 flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-[10px] font-black opacity-30 uppercase tracking-widest">
                            <Type size={14} /> Dica de Design
                        </div>
                        <p className="text-[10px] font-medium opacity-40 leading-relaxed uppercase tracking-wider">
                            Use temas variados para testar como o seu layout reage a diferentes densidades visuais de palavras (ex: palavras técnicas curtas vs clássicas longas).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
