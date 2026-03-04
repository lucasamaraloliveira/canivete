import React, { useState } from 'react';
import { Hash, ArrowRightLeft, Copy, Check } from 'lucide-react';

export function RomanNumeralConv() {
    const [input, setInput] = useState('');
    const [copied, setCopied] = useState(false);

    const toRoman = (num: number): string => {
        if (isNaN(num) || num <= 0 || num > 3999) return 'Número entre 1-3999';
        const map: [number, string][] = [
            [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
            [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
            [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
        ];
        let result = '';
        for (const [val, roman] of map) {
            while (num >= val) {
                result += roman;
                num -= val;
            }
        }
        return result;
    };

    const fromRoman = (roman: string): string => {
        roman = roman.toUpperCase();
        const map: Record<string, number> = {
            'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000
        };
        let num = 0;
        for (let i = 0; i < roman.length; i++) {
            const current = map[roman[i]];
            const next = map[roman[i + 1]];
            if (next > current) {
                num += (next - current);
                i++;
            } else {
                num += current;
            }
        }
        return isNaN(num) ? 'Invalido' : num.toString();
    };

    const isInputRoman = /^[IVXLCDM]+$/i.test(input);
    const result = isInputRoman ? fromRoman(input) : toRoman(parseInt(input));

    const handleCopy = () => {
        if (!result || result.includes('Número') || result === 'Invalido') return;
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-2xl mx-auto flex flex-col gap-8 py-10 lg:py-16">
            <div className="text-center">
                <div className="w-16 h-16 bg-text-main/5 rounded-2xl flex items-center justify-center text-text-main mx-auto mb-4">
                    <Hash size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Roman Numeral Conv</h3>
                <p className="text-text-main/50">Conversão bidirecional entre números arábicos e romanos.</p>
            </div>

            <div className="bg-bg-main p-8 rounded-[40px] border border-border-main space-y-6 shadow-xl">
                <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Entrada (Número ou Romano)</label>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full p-6 text-2xl font-bold bg-text-main/5 border border-border-main rounded-3xl focus:ring-2 focus:ring-text-main/10 outline-none transition-all placeholder:opacity-20"
                        placeholder="Ex: 2024 ou MMXXIV"
                    />
                </div>

                <div className="text-center relative py-4">
                    <div className="absolute left-0 right-0 top-1/2 h-px bg-border-main" />
                    <div className="relative inline-block px-4 bg-bg-main">
                        <ArrowRightLeft className="text-text-main/20" size={24} />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Resultado</label>
                    <div className="relative group">
                        <div className="w-full p-8 text-4xl font-black bg-text-main/5 border border-border-main rounded-[32px] text-center break-all">
                            {input ? result : <span className="opacity-10">---</span>}
                        </div>
                        {input && !result.includes('Número') && result !== 'Invalido' && (
                            <button
                                onClick={handleCopy}
                                className="absolute top-4 right-4 p-3 bg-text-main text-bg-main rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all"
                            >
                                {copied ? <Check size={20} /> : <Copy size={20} />}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
                {[
                    { l: 'I', v: 1 }, { l: 'V', v: 5 }, { l: 'X', v: 10 }, { l: 'L', v: 50 },
                    { l: 'C', v: 100 }, { l: 'D', v: 500 }, { l: 'M', v: 1000 }, { l: 'V', v: '...' }
                ].map((item, i) => (
                    <div key={i} className="p-3 bg-text-main/5 border border-border-main rounded-2xl text-center">
                        <p className="font-bold text-lg">{item.l}</p>
                        <p className="text-[10px] opacity-40 font-mono">{item.v}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
