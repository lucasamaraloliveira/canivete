"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface Option {
    label: string;
    value: string;
}

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    className?: string;
    placeholder?: string;
}

export function CustomSelect({
    value,
    onChange,
    options,
    className,
    placeholder = "Selecione..."
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(o => o.value === value);
    const label = selectedOption ? selectedOption.label : placeholder;

    return (
        <div className={cn("relative group/select w-full", className)}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full px-5 py-3.5 bg-bg-main border border-border-main rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none flex items-center justify-between transition-all hover:bg-text-main/5",
                    isOpen && "ring-4 ring-text-main/5 border-text-main/20"
                )}
            >
                <span className="truncate pr-2">{label}</span>
                <ChevronDown size={14} className={cn("shrink-0 opacity-30 group-hover/select:opacity-100 transition-all", isOpen && "rotate-180 opacity-100")} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-[60]"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-card-main/90 backdrop-blur-xl border border-border-main rounded-[24px] shadow-2xl z-[70] overflow-hidden py-3"
                        >
                            <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                {options.map((opt) => (
                                    <button
                                        type="button"
                                        key={opt.value}
                                        onClick={() => {
                                            onChange(opt.value);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "w-full px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest transition-all relative overflow-hidden",
                                            value === opt.value
                                                ? "bg-text-main text-bg-main"
                                                : "text-text-main/60 hover:bg-text-main/5 hover:text-text-main hover:pl-8"
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
