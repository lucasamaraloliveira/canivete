import React, { useState } from 'react';
import { Dna, RefreshCw, Copy, Check, Search, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const CODON_TABLE: Record<string, string> = {
    'TTT': 'Phe', 'TTC': 'Phe', 'TTA': 'Leu', 'TTG': 'Leu',
    'CTT': 'Leu', 'CTC': 'Leu', 'CTA': 'Leu', 'CTG': 'Leu',
    'ATT': 'Ile', 'ATC': 'Ile', 'ATA': 'Ile', 'ATG': 'Met (Start)',
    'GTT': 'Val', 'GTC': 'Val', 'GTA': 'Val', 'GTG': 'Val',
    'TCT': 'Ser', 'TCC': 'Ser', 'TCA': 'Ser', 'TCG': 'Ser',
    'CCT': 'Pro', 'CCC': 'Pro', 'CCA': 'Pro', 'CCG': 'Pro',
    'ACT': 'Thr', 'ACC': 'Thr', 'ACA': 'Thr', 'ACG': 'Thr',
    'GCT': 'Ala', 'GCC': 'Ala', 'GCA': 'Ala', 'GCG': 'Ala',
    'TAT': 'Tyr', 'TAC': 'Tyr', 'TAA': 'STOP', 'TAG': 'STOP',
    'CAT': 'His', 'CAC': 'His', 'CAA': 'Gln', 'CAG': 'Gln',
    'AAT': 'Asn', 'AAC': 'Asn', 'AAA': 'Lys', 'AAG': 'Lys',
    'GAT': 'Asp', 'GAC': 'Asp', 'GAA': 'Glu', 'GAG': 'Glu',
    'TGT': 'Cys', 'TGC': 'Cys', 'TGA': 'STOP', 'TGG': 'Trp',
    'CGT': 'Arg', 'CGC': 'Arg', 'CGA': 'Arg', 'CGG': 'Arg',
    'AGT': 'Ser', 'AGC': 'Ser', 'AGA': 'Arg', 'AGG': 'Arg',
    'GGT': 'Gly', 'GGC': 'Gly', 'GGA': 'Gly', 'GGG': 'Gly',
};

export function GeneticTranslator() {
    const [dna, setDna] = useState('');
    const [copied, setCopied] = useState(false);

    const cleanDna = dna.toUpperCase().replace(/[^ATCG]/g, '');

    const translate = () => {
        const protein = [];
        for (let i = 0; i < cleanDna.length - 2; i += 3) {
            const codon = cleanDna.substring(i, i + 3);
            protein.push(CODON_TABLE[codon] || '???');
        }
        return protein;
    };

    const protein = translate();

    const handleCopy = () => {
        if (protein.length === 0) return;
        navigator.clipboard.writeText(protein.join('-'));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <div className="text-center">
                <div className="w-16 h-16 bg-text-main/5 rounded-2xl flex items-center justify-center text-text-main mx-auto mb-4">
                    <Dna size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Genetic Translator</h3>
                <p className="text-text-main/50">Converte sequências de DNA em cadeias de aminoácidos (proteínas).</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider opacity-40">Sequência de DNA (A, T, C, G)</label>
                        <textarea
                            value={dna}
                            onChange={(e) => setDna(e.target.value)}
                            className="w-full h-48 p-4 font-mono text-lg bg-text-main/5 border border-border-main rounded-3xl focus:ring-2 focus:ring-text-main/10 outline-none resize-none"
                            placeholder="Ex: ATGGCCATT..."
                        />
                        <div className="flex justify-between text-[10px] font-bold opacity-30 px-1">
                            <span>{cleanDna.length} Bases</span>
                            <span>{Math.floor(cleanDna.length / 3)} Codons</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        {['A', 'T', 'G', 'C'].map(base => (
                            <button
                                key={base}
                                onClick={() => setDna(prev => prev + base)}
                                className="py-3 bg-text-main/10 hover:bg-text-main text-text-main hover:text-bg-main rounded-xl font-bold transition-all"
                            >
                                {base}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setDna('')}
                        className="w-full py-3 bg-red-500/10 text-red-500 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={16} /> Limpar Sequência
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="bg-bg-main p-6 rounded-[32px] border border-border-main min-h-[300px] flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-30">Cadeia de Proteínas</p>
                            {protein.length > 0 && (
                                <button onClick={handleCopy} className="p-2 hover:bg-text-main/5 rounded-lg transition-colors">
                                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="opacity-40" />}
                                </button>
                            )}
                        </div>

                        {protein.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {protein.map((aa, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all animate-in fade-in slide-in-from-top-1",
                                            aa === 'STOP' ? "bg-red-500/10 border-red-500/20 text-red-600" :
                                                aa === 'Met (Start)' ? "bg-green-500/10 border-green-500/20 text-green-600" :
                                                    "bg-text-main/5 border-border-main/50"
                                        )}
                                        style={{ animationDelay: `${i * 30}ms` }}
                                    >
                                        {aa}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center opacity-10 text-center">
                                <Search size={48} className="mb-2" />
                                <p className="font-bold">Aguardando DNA...</p>
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-text-main text-bg-main rounded-2xl flex items-start gap-3">
                        <Info size={20} className="shrink-0 mt-0.5 opacity-40" />
                        <p className="text-[11px] leading-relaxed opacity-80">
                            <strong>Dogma Central:</strong> A tradução genética é o processo onde a informação no DNA (via mRNA) é convertida em proteínas. Cada grupo de 3 bases (codon) codifica um aminoácido específico.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
