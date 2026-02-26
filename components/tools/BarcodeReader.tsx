'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Camera, Upload, QrCode, Clipboard, Check, History, Trash2, Maximize2, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Html5Qrcode } from 'html5-qrcode';

export function BarcodeReader() {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [history, setHistory] = useState<{ id: string, text: string, time: string }[]>([]);
    const [copied, setCopied] = useState(false);
    const qrRef = useRef<Html5Qrcode | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const startScanner = async () => {
        if (!containerRef.current) return;
        setIsScanning(true);
        qrRef.current = new Html5Qrcode("reader");
        try {
            await qrRef.current.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText) => {
                    handleSuccess(decodedText);
                },
                (errorMessage) => {
                    // console.log(errorMessage);
                }
            );
        } catch (err) {
            console.error(err);
            setIsScanning(false);
        }
    };

    const stopScanner = async () => {
        if (qrRef.current && isScanning) {
            await qrRef.current.stop();
            setIsScanning(false);
        }
    };

    const handleSuccess = (text: string) => {
        setScanResult(text);
        setHistory(prev => [{
            id: Math.random().toString(36).substr(2, 9),
            text,
            time: new Date().toLocaleTimeString()
        }, ...prev]);
        stopScanner();
    };

    const copyToClipboard = () => {
        if (scanResult) {
            navigator.clipboard.writeText(scanResult);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const html5QrCode = new Html5Qrcode("reader");
        try {
            const decodedText = await html5QrCode.scanFile(file, true);
            handleSuccess(decodedText);
        } catch (err) {
            alert("Não foi possível detectar um código nesta imagem.");
        }
    };

    useEffect(() => {
        return () => {
            if (qrRef.current) qrRef.current.stop();
        };
    }, []);

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
                <div className="flex flex-col gap-6">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider flex items-center gap-2">
                        <Camera size={16} /> Decodificação
                    </label>
                    <div className="flex-1 bg-black rounded-[48px] shadow-2xl overflow-hidden relative flex flex-col items-center justify-center border-4 border-text-main/5 min-h-[400px]">
                        <div id="reader" className="w-full h-full" />

                        {!isScanning && !scanResult && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 bg-card-main/10 backdrop-blur-3xl p-12">
                                <QrCode size={120} strokeWidth={1} className="opacity-10 animate-pulse" />
                                <div className="flex gap-4">
                                    <button
                                        onClick={startScanner}
                                        className="px-8 py-4 bg-text-main text-bg-main rounded-[24px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center gap-3"
                                    >
                                        <Camera size={20} /> Iniciar Câmera
                                    </button>
                                    <div className="relative">
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        <button className="px-8 py-4 bg-text-main/5 border-2 border-text-main text-text-main rounded-[24px] font-black uppercase tracking-widest hover:bg-text-main hover:text-bg-main transition-all flex items-center gap-3">
                                            <Upload size={20} /> Upload Imagem
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {scanResult && !isScanning && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 bg-text-main text-bg-main p-12 text-center animate-in zoom-in-95 duration-300">
                                <div className="w-24 h-24 bg-bg-main text-text-main rounded-[32px] flex items-center justify-center shadow-2xl">
                                    <Check size={48} />
                                </div>
                                <div className="space-y-2 max-w-sm">
                                    <h4 className="text-2xl font-black uppercase italic tracking-tighter">Código Detectado</h4>
                                    <p className="bg-bg-main/10 p-4 rounded-2xl font-mono text-sm break-all select-all">{scanResult}</p>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={copyToClipboard}
                                        className="px-8 py-4 bg-bg-main text-text-main rounded-2xl font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all"
                                    >
                                        {copied ? <Check size={20} /> : <Clipboard size={20} />} {copied ? 'Copiado' : 'Copiar'}
                                    </button>
                                    <button
                                        onClick={() => setScanResult(null)}
                                        className="px-8 py-4 bg-bg-main/20 text-bg-main rounded-2xl font-black uppercase tracking-widest hover:bg-bg-main hover:text-text-main transition-all"
                                    >
                                        <RefreshCw size={20} /> Novo Scan
                                    </button>
                                </div>
                            </div>
                        )}

                        {isScanning && (
                            <button
                                onClick={stopScanner}
                                className="absolute bottom-8 left-1/2 -translate-x-1/2 px-10 py-4 bg-red-500 text-white rounded-full font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all animate-bounce-slow"
                            >
                                Parar Câmera
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider flex items-center justify-between">
                        <span>Histórico</span>
                        <button onClick={() => setHistory([])} className="text-[10px] font-black opacity-30 hover:opacity-100 uppercase tracking-widest flex items-center gap-1 transition-all">
                            <Trash2 size={10} /> Limpar
                        </button>
                    </label>
                    <div className="flex-1 bg-card-main border border-border-main rounded-[48px] shadow-sm flex flex-col overflow-hidden">
                        <div className="p-8 flex-1 overflow-auto custom-scrollbar space-y-4">
                            {history.length > 0 ? history.map((item) => (
                                <div key={item.id} className="group p-6 bg-text-main/5 rounded-[32px] border border-border-main/5 hover:border-text-main/20 transition-all flex items-center justify-between">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-[10px] font-black opacity-20 uppercase tracking-widest">{item.time}</p>
                                        </div>
                                        <p className="font-bold text-sm truncate uppercase tracking-tight">{item.text}</p>
                                    </div>
                                    <button
                                        onClick={() => { navigator.clipboard.writeText(item.text); alert('Copiado!'); }}
                                        className="p-3 bg-text-main text-bg-main rounded-xl opacity-0 group-hover:opacity-100 hover:scale-110 transition-all shadow-lg"
                                    >
                                        <Clipboard size={16} />
                                    </button>
                                </div>
                            )) : (
                                <div className="h-full flex flex-col items-center justify-center opacity-10 text-center py-20 grayscale">
                                    <QrCode size={120} strokeWidth={1} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-8 bg-green-500/5 border border-green-500/10 rounded-[40px] flex gap-4">
                        <div className="w-10 h-10 bg-text-main text-bg-main rounded-2xl flex items-center justify-center shrink-0">
                            <ShieldCheck size={20} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-green-600/70">Processamento Local</h4>
                            <p className="text-[10px] font-medium opacity-40 uppercase leading-relaxed tracking-wider">
                                A imagem da sua câmera é processada inteiramente no seu dispositivo. Nenhum dado visual é enviado para servidores.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes bounce-slow {
                    0%, 100% { transform: translate(-50%, 0); }
                    50% { transform: translate(-50%, -10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 2s ease-in-out infinite;
                }
            `}} />
        </div>
    );
}
