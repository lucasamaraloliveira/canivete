"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ChevronRight } from 'lucide-react';
import { Icon } from '@/components/Icon';
import { cn } from '@/lib/utils';

interface UpdateNotificationProps {
    show: boolean;
    tool: any;
    onClose: () => void;
    onAction: () => void;
}

export function UpdateNotification({ show, tool, onClose, onAction }: UpdateNotificationProps) {
    return (
        <AnimatePresence>
            {show && tool && (
                <motion.div
                    initial={{ x: 400, opacity: 0, scale: 0.9 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: 400, opacity: 0, scale: 0.9 }}
                    className="fixed bottom-6 right-6 z-[120] w-[320px] sm:w-[380px]"
                >
                    <div className="bg-text-main text-bg-main p-1 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden">
                        <div className="bg-bg-main text-text-main m-0.5 rounded-[30px] p-5 relative">
                            <button
                                onClick={onClose}
                                aria-label="Fechar notificação"
                                className="absolute top-4 right-4 p-1.5 hover:bg-text-main/5 rounded-full transition-colors"
                            >
                                <X size={16} />
                            </button>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-1 rounded-full flex items-center gap-1.5">
                                    <Sparkles size={12} className="fill-current" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-green-700 dark:text-green-300">Nova Ferramenta</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-14 h-14 bg-text-main text-bg-main rounded-[20px] flex items-center justify-center shrink-0 shadow-lg">
                                    <Icon name={tool.icon} className="w-7 h-7" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-black text-sm uppercase tracking-tight mb-1 truncate">{tool.name}</h4>
                                    <p className="text-[10px] font-medium opacity-60 leading-relaxed line-clamp-2 italic mb-3">
                                        {tool.description}
                                    </p>
                                    <button
                                        onClick={onAction}
                                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[2px] hover:translate-x-1 transition-transform"
                                    >
                                        Experimentar Agora <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
