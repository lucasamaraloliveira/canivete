'use client';

import React, { useState } from 'react';
import { Zap, Copy, Check, Type, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function FancyTextGenerator() {
    const [text, setText] = useState('');
    const [copied, setCopied] = useState<string | null>(null);

    const normal = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const styles = [
        {
            name: "Bold Sans",
            map: "𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵"
        },
        {
            name: "Italic Serif",
            map: "𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍0123456789"
        },
        {
            name: "Script",
            map: "𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏𝒜𝐵𝒞𝒟𝐸𝐹𝒢𝐻𝐼𝒥𝒦𝐿𝑀𝒩𝒪𝒫𝒬𝑅𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵0123456789"
        },
        {
            name: "Gothic",
            map: "𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔚𝔛𝔜ℨ0123456789"
        },
        {
            name: "Monospace",
            map: "𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿"
        },
        {
            name: "Double Struck",
            map: "𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡"
        }
    ];

    const transformText = (styleMap: string) => {
        if (!text) return "";
        // Nota: O mapeamento unicode requer cuidado com surrogate pairs, 
        // mas para fins de display rápido no frontend, vamos usar uma lógica simplificada.
        // Como o JS lida com unicode de forma complexa, vamos mapear caracter a caracter.
        let result = "";
        for (let char of text) {
            const idx = normal.indexOf(char);
            if (idx !== -1) {
                // Cada caractere unicode "estilizado" geralmente ocupa 2 posições na string do map
                // Mas aqui estamos usando strings que podem conter caracteres multi-byte.
                // Vamos converter o map em um array de caracteres reais (spread syntax)
                const charArray = [...styleMap];
                result += charArray[idx] || char;
            } else {
                result += char;
            }
        }
        return result;
    };

    const handleCopy = (t: string, name: string) => {
        navigator.clipboard.writeText(t);
        setCopied(name);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="flex flex-col gap-8 max-w-3xl mx-auto py-12">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 bg-text-main/5 text-text-main rounded-[32px] flex items-center justify-center shadow-2xl mb-4 text-pink-500">
                    <Zap size={40} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase whitespace-pre-wrap">Letras Diferentes</h2>
                <p className="max-w-md text-sm font-medium opacity-60 leading-relaxed uppercase tracking-widest">
                    Transforme seu texto em fontes incríveis e estilosas para bio de Instagram, Twitter e conversas.
                </p>
            </div>

            <div className="bg-card-main border border-border-main rounded-[48px] p-8 shadow-2xl flex flex-col gap-8">
                <div className="relative group">
                    <div className="absolute inset-0 bg-pink-500/5 blur-2xl rounded-[32px] opacity-0 group-focus-within:opacity-100 transition-opacity" />
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Digite seu texto aqui..."
                        className="relative w-full bg-text-main/5 border border-border-main rounded-[32px] p-8 font-bold text-xl resize-none outline-none focus:ring-4 focus:ring-pink-500/10 transition-all min-h-[120px]"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {styles.map((style) => {
                        const transformed = transformText(style.map);
                        return (
                            <div
                                key={style.name}
                                className="p-6 bg-text-main/5 rounded-[32px] border border-border-main/5 flex flex-col gap-4 group hover:bg-text-main/10 transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black uppercase tracking-widest opacity-30">{style.name}</span>
                                    <button
                                        onClick={() => handleCopy(transformed || text, style.name)}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                                            copied === style.name ? "bg-green-500 text-white" : "bg-text-main/10 hover:bg-text-main hover:text-bg-main"
                                        )}
                                    >
                                        {copied === style.name ? <Check size={12} /> : <Copy size={12} />}
                                        {copied === style.name ? 'Copiado' : 'Copiar'}
                                    </button>
                                </div>
                                <div className="font-bold text-lg break-words min-h-[1.5rem]">
                                    {transformed || <span className="opacity-10 italic">Exemplo Texto</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
