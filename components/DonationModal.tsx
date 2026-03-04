"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, MessageSquarePlus, RefreshCw, Check, ShieldAlert, Mail, Copy, Smartphone, Monitor, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QRCodeSVG } from 'qrcode.react';

interface DonationModalProps {
    isOpen: boolean;
    onClose: () => void;
    isMobile: boolean;
    activePixTab: 'qrcode' | 'banks';
    setActivePixTab: (tab: 'qrcode' | 'banks') => void;
    selectedBank: any;
    setSelectedBank: (bank: any) => void;
    BANKS: any[];
    openBankApp: (bank: any) => void;
    pixPayload: string;
    pixCopied: boolean;
    setPixCopied: (v: boolean) => void;
    toolSuggestion: string;
    setToolSuggestion: (v: string) => void;
    isSendingSuggestion: boolean;
    sendSuggestion: () => void;
    suggestionStatus: 'idle' | 'success' | 'error';
}

export function DonationModal({
    isOpen,
    onClose,
    isMobile,
    activePixTab,
    setActivePixTab,
    selectedBank,
    setSelectedBank,
    BANKS,
    openBankApp,
    pixPayload,
    pixCopied,
    setPixCopied,
    toolSuggestion,
    setToolSuggestion,
    isSendingSuggestion,
    sendSuggestion,
    suggestionStatus
}: DonationModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-xl" />
                    <motion.div
                        initial={{ opacity: 0, scale: isMobile ? 1 : 0.95, y: isMobile ? '100%' : 20 }}
                        animate={{ opacity: 1, scale: 1, y: isMobile ? 0 : 0 }}
                        exit={{ opacity: 0, scale: isMobile ? 1 : 0.95, y: isMobile ? '100%' : 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className={cn(
                            "relative w-full bg-bg-main/80 backdrop-blur-2xl border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden",
                            isMobile ? "inset-x-0 bottom-0 rounded-t-[40px] max-h-[95vh]" : "max-w-[900px] max-h-[90vh] rounded-[40px]"
                        )}
                    >
                        {isMobile && <div className="w-12 h-1.5 bg-text-main/10 rounded-full mx-auto mt-4 mb-2 shrink-0" />}
                        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
                            <button onClick={onClose} aria-label="Fechar modal" className="p-2 sm:p-3 hover:bg-text-main/10 rounded-2xl transition-all text-text-main/70 hover:text-text-main"><X size={20} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 h-auto md:h-full">
                                <div className="p-6 sm:p-8 lg:p-10 notebook-p-compact border-b md:border-b-0 md:border-r border-white/5 flex flex-col items-center text-center">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-500/20 text-red-500 rounded-2xl sm:rounded-[24px] flex items-center justify-center mb-3 sm:mb-4 shadow-[0_0_30px_-5px_rgba(239,68,68,0.4)]"><Heart size={isMobile ? 24 : 28} className="fill-current" /></div>
                                    <h3 className="text-xl sm:text-2xl font-black mb-1 sm:mb-2 tracking-tight">Apoie o Projeto</h3>
                                    <p className="text-xs sm:text-sm text-text-main/90 leading-relaxed mb-4 sm:mb-5 max-w-[280px]">Ajude a manter as ferramentas gratuitas e sem anúncios.</p>

                                    <div className="w-full flex bg-text-main/5 rounded-2xl p-1 mb-4 sm:mb-5">
                                        <button
                                            onClick={() => setActivePixTab('banks')}
                                            className={cn("flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all", activePixTab === 'banks' ? "bg-text-main text-bg-main shadow-lg" : "opacity-40")}
                                        >
                                            Escolher Banco
                                        </button>
                                        <button
                                            onClick={() => setActivePixTab('qrcode')}
                                            className={cn("flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all", activePixTab === 'qrcode' ? "bg-text-main text-bg-main shadow-lg" : "opacity-40")}
                                        >
                                            QR Code Geral
                                        </button>
                                    </div>

                                    <div className="w-full space-y-4 sm:y-5 min-h-[240px] flex flex-col items-center justify-center">
                                        {selectedBank ? (
                                            <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                <div className="relative group">
                                                    <div className="absolute -inset-4 bg-text-main/5 rounded-[40px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <div className="relative mx-auto w-40 h-40 sm:w-48 sm:h-48 bg-white p-3 rounded-[32px] shadow-2xl flex items-center justify-center overflow-hidden">
                                                        <QRCodeSVG
                                                            value={pixPayload}
                                                            size={isMobile ? 140 : 160}
                                                            level="H"
                                                            includeMargin={false}
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                            <div className={cn("w-10 h-10 rounded-xl shadow-xl flex items-center justify-center p-1 text-center scale-110", selectedBank.color)}>
                                                                <span className="text-[8px] font-black text-white leading-tight">{selectedBank.name}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-[10px] font-black uppercase tracking-[2px] text-text-main/40 mb-1">QR Code Verificado</p>
                                                    <h4 className="text-sm font-bold flex items-center gap-2 justify-center">
                                                        <span className={cn("w-2 h-2 rounded-full", selectedBank.color)} />
                                                        Escaneie com o app do {selectedBank.name}
                                                    </h4>
                                                    <p className="text-[9px] opacity-40 mt-1 max-w-[200px] mx-auto italic">O scanner interno do banco reconhecerá o destino e permitirá definir o valor.</p>
                                                    <button
                                                        onClick={() => setSelectedBank(null)}
                                                        className="mt-4 text-[9px] font-black uppercase tracking-widest text-blue-500 hover:underline"
                                                    >
                                                        Voltar ao Padrão
                                                    </button>
                                                </div>
                                            </div>
                                        ) : activePixTab === 'qrcode' ? (
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="mx-auto w-36 h-36 sm:w-44 sm:h-44 bg-white p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl shadow-lg flex items-center justify-center group transition-transform hover:scale-105">
                                                    <QRCodeSVG value={pixPayload} size={isMobile ? 120 : 145} level="H" />
                                                </div>
                                                <p className="text-[9px] font-bold uppercase tracking-widest opacity-30">Padrão Universal (EMV)</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-2 w-full animate-in fade-in zoom-in duration-300">
                                                {BANKS.map(bank => (
                                                    <button
                                                        key={bank.name}
                                                        onClick={() => openBankApp(bank)}
                                                        className="group relative py-4 bg-text-main/5 hover:bg-text-main/10 border border-border-main rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 overflow-hidden"
                                                    >
                                                        <div className={cn("absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity", bank.color)} />
                                                        {bank.name}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        <div className="space-y-2 sm:space-y-3 text-left w-full mt-4">
                                            <label className="text-[9px] sm:text-[10px] font-bold text-text-main/90 uppercase tracking-[2px] ml-1">Chave PIX (Copia e Cola)</label>
                                            <div className="relative flex items-center gap-2 bg-text-main/5 border border-white/5 rounded-2xl p-1 pr-2">
                                                <div className="flex-1 px-3 sm:px-4 py-3 text-[10px] sm:text-xs font-mono font-medium truncate opacity-90">{pixPayload}</div>
                                                <button onClick={() => { navigator.clipboard.writeText(pixPayload); setPixCopied(true); setTimeout(() => setPixCopied(false), 2000); }} className={cn("px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-[9px] sm:text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-1.5 sm:gap-2 shrink-0", pixCopied ? "bg-green-500 text-white" : "bg-text-main text-bg-main hover:opacity-90 shadow-lg")}>{pixCopied ? <Check size={12} /> : <Copy size={12} />}{pixCopied ? 'Copiado' : 'Copiar'}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 sm:p-8 lg:p-10 notebook-p-compact flex flex-col bg-text-main/[0.02]">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500/20 text-blue-500 rounded-2xl sm:rounded-[24px] flex items-center justify-center mb-3 sm:mb-4 shadow-[0_0_30px_-5px_rgba(59,130,246,0.4)]"><MessageSquarePlus size={isMobile ? 24 : 28} /></div>
                                    <h3 className="text-xl sm:text-2xl font-black mb-1 sm:mb-2 tracking-tight">Sugira sua Ideia</h3>
                                    <p className="text-xs sm:text-sm text-text-main/90 leading-relaxed mb-4 sm:mb-6 max-w-[280px]">Qual ferramenta você sente falta? Envie sua sugestão diretamente.</p>
                                    <div className="flex-1 flex flex-col gap-3 sm:gap-4">
                                        <textarea placeholder="Descreva a ferramenta aqui..." value={toolSuggestion} onChange={(e) => setToolSuggestion(e.target.value)} className="w-full bg-text-main/5 border border-white/5 rounded-[20px] sm:rounded-[24px] p-4 sm:p-5 text-sm font-medium placeholder:opacity-30 focus:ring-2 focus:ring-text-main/10 outline-none resize-none transition-all min-h-[120px] sm:min-h-[160px]" />
                                        <button onClick={sendSuggestion} disabled={!toolSuggestion.trim() || isSendingSuggestion} className={cn("w-full py-4 rounded-[20px] font-black text-[10px] uppercase tracking-[2px] transition-all flex items-center justify-center gap-3 border shadow-xl active:scale-95 sm:mt-2", suggestionStatus === 'success' ? "bg-green-500 text-white border-green-400" : suggestionStatus === 'error' ? "bg-red-500 text-white border-red-400" : "bg-text-main text-bg-main hover:opacity-90 border-transparent shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)]")}>{isSendingSuggestion ? <><RefreshCw size={16} className="animate-spin" /> Processando...</> : suggestionStatus === 'success' ? <><Check size={16} /> Enviado com Sucesso!</> : suggestionStatus === 'error' ? <><ShieldAlert size={16} /> Houve um Erro</> : <><Mail size={16} /> Enviar Sugestão Agora</>}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
