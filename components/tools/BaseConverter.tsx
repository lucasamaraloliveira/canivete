import React, { useState } from 'react';
import { Binary, ArrowRightLeft, Copy, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

function CustomSelect({
    value,
    onChange,
    options
}: {
    value: number;
    onChange: (val: number) => void;
    options: { label: string; value: number }[]
}) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedLabel = options.find(o => o.value === value)?.label || value;

    return (
        <div className="relative group/select w-40 flex flex-col">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex-1 p-4 bg-text-main/5 border border-border-main rounded-2xl text-base font-bold shadow-sm outline-none flex items-center justify-between transition-all hover:bg-text-main/10",
                    isOpen && "ring-2 ring-text-main/10 border-text-main/20"
                )}
            >
                <span className="truncate pr-2 capitalize">{selectedLabel}</span>
                <ChevronDown size={14} className={cn("shrink-0 opacity-30 group-hover/select:opacity-100 transition-all", isOpen && "rotate-180 opacity-100")} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-bg-main border border-border-main rounded-2xl shadow-2xl z-20 overflow-hidden py-2"
                        >
                            <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                {options.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => {
                                            onChange(opt.value);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "w-full px-4 py-3 text-left text-xs font-bold capitalize transition-all relative overflow-hidden",
                                            value === opt.value
                                                ? "bg-text-main text-bg-main"
                                                : "text-text-main/60 hover:bg-text-main/5 hover:text-text-main hover:pl-6"
                                        )}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

export function BaseConverter() {
    const [value, setValue] = useState('');
    const [fromBase, setFromBase] = useState(10);
    const [toCustomBase, setToCustomBase] = useState(32);
    const [copied, setCopied] = useState<number | string | null>(null);

    const convert = (val: string, fBase: number, tBase: number) => {
        if (!val) return '';
        try {
            const decimal = parseInt(val, fBase);
            if (isNaN(decimal)) return 'Inválido';
            return decimal.toString(tBase).toUpperCase();
        } catch (e) {
            return 'Erro';
        }
    };

    const bases = [
        { label: 'Binário (2)', value: 2 },
        { label: 'Octal (8)', value: 8 },
        { label: 'Decimal (10)', value: 10 },
        { label: 'Hexadecimal (16)', value: 16 },
    ];

    const copyToClipboard = (text: string, id: number | string) => {
        if (!text || text === 'Inválido' || text === 'Erro') return;
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="max-w-2xl mx-auto flex flex-col gap-8 h-full justify-center">
            <div className="text-center">
                <div className="w-16 h-16 bg-text-main/5 rounded-2xl flex items-center justify-center text-text-main mx-auto mb-4">
                    <Binary size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Base Converter</h3>
                <p className="text-text-main/50">Conversão instantânea entre sistemas numéricos.</p>
            </div>

            <div className="space-y-6">
                <div className="bg-bg-main p-6 rounded-3xl border border-border-main space-y-4 shadow-xl">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider opacity-40">Entrada</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    className="flex-1 p-4 font-mono text-lg bg-text-main/5 border border-border-main rounded-2xl focus:ring-2 focus:ring-text-main/10 outline-none"
                                    placeholder="Digite o número..."
                                />
                                <CustomSelect
                                    value={fromBase}
                                    onChange={setFromBase}
                                    options={[...bases, { label: 'Outro...', value: fromBase > 16 || ![2, 8, 10, 16].includes(fromBase) ? fromBase : 0 }]}
                                />
                            </div>
                        </div>

                        {(![2, 8, 10, 16].includes(fromBase)) && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="flex items-center gap-4 p-4 bg-text-main/5 rounded-2xl border border-dashed border-border-main"
                            >
                                <span className="text-xs font-bold whitespace-nowrap opacity-40 uppercase">Definir Base de Entrada:</span>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={fromBase}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        if (val !== '') {
                                            const num = Math.max(2, Math.min(36, parseInt(val)));
                                            setFromBase(num);
                                        } else {
                                            setFromBase(2);
                                        }
                                    }}
                                    className="w-20 p-2 bg-bg-main border border-border-main rounded-lg font-mono font-bold text-center outline-none focus:ring-2 focus:ring-text-main/10"
                                />
                            </motion.div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-3 mt-8">
                        {bases.map((b) => (
                            <div key={b.value} className="flex items-center justify-between p-4 bg-text-main/5 rounded-2xl border border-border-main group hover:border-text-main/20 transition-all">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">{b.label}</p>
                                    <p className="font-mono font-bold text-lg">{convert(value, fromBase, b.value) || '0'}</p>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(convert(value, fromBase, b.value), b.value)}
                                    className="p-2 hover:bg-text-main/10 rounded-xl transition-colors"
                                >
                                    {copied === b.value ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="opacity-40" />}
                                </button>
                            </div>
                        ))}

                        {/* Custom Output Base */}
                        <div className="flex items-center justify-between p-4 bg-text-main/5 rounded-2xl border border-text-main/10 border-dashed group relative overflow-hidden">
                            <div className="absolute inset-0 bg-text-main/[0.02] pointer-events-none" />
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Base Personalizada</p>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={toCustomBase}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            if (val !== '') {
                                                const num = Math.max(2, Math.min(36, parseInt(val)));
                                                setToCustomBase(num);
                                            } else {
                                                setToCustomBase(2);
                                            }
                                        }}
                                        className="w-12 p-0.5 bg-text-main/10 border border-transparent rounded text-[10px] font-black text-center outline-none focus:border-text-main/20"
                                    />
                                </div>
                                <p className="font-mono font-bold text-lg text-text-main/80">{convert(value, fromBase, toCustomBase) || '0'}</p>
                            </div>
                            <button
                                onClick={() => copyToClipboard(convert(value, fromBase, toCustomBase), 'custom')}
                                className="p-2 hover:bg-text-main/10 rounded-xl transition-colors"
                            >
                                {copied === 'custom' ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="opacity-40" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-text-main/5 border border-border-main rounded-3xl">
                <p className="text-xs leading-relaxed opacity-60">
                    <ArrowRightLeft size={14} className="inline mr-2" />
                    <strong>Nota:</strong> JavaScript suporta conversões nativas (toString) até a base 36. Bases maiores que 10 utilizam letras do alfabeto (A=10, B=11, ..., Z=35).
                </p>
            </div>
        </div>
    );
}
