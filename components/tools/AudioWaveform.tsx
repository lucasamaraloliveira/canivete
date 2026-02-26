'use client';

import React, { useState, useRef } from 'react';
import { Activity, Download, Upload, Sliders, RefreshCw, Music, Play, Pause, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AudioWaveformGen() {
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
    const [points, setPoints] = useState<number[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [color, setColor] = useState('#000000');
    const [barWidth, setBarWidth] = useState(2);
    const [gap, setGap] = useState(1);
    const [fileName, setFileName] = useState('');
    const svgRef = useRef<SVGSVGElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setIsProcessing(true);

        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const arrayBuffer = await file.arrayBuffer();

        try {
            const buffer = await audioCtx.decodeAudioData(arrayBuffer);
            setAudioBuffer(buffer);
            processAudio(buffer);
        } catch (err) {
            console.error("Error decoding audio data", err);
            alert("Erro ao decodificar áudio. Tente outro arquivo.");
        } finally {
            setIsProcessing(false);
        }
    };

    const processAudio = (buffer: AudioBuffer) => {
        const data = buffer.getChannelData(0);
        const samples = 120; // Number of bars
        const blockSize = Math.floor(data.length / samples);
        const filteredData: number[] = [];

        for (let i = 0; i < samples; i++) {
            let blockStart = blockSize * i;
            let sum = 0;
            for (let j = 0; j < blockSize; j++) {
                sum = sum + Math.abs(data[blockStart + j]);
            }
            filteredData.push(sum / blockSize);
        }

        const multiplier = Math.pow(Math.max(...filteredData), -1);
        setPoints(filteredData.map(n => n * multiplier));
    };

    const downloadSvg = () => {
        if (!svgRef.current) return;
        const svgData = new XMLSerializer().serializeToString(svgRef.current);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const svgUrl = URL.createObjectURL(svgBlob);
        const downloadLink = document.createElement("a");
        downloadLink.href = svgUrl;
        downloadLink.download = `${fileName.split('.')[0]}_waveform.svg`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Preview Waveform SVG</label>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black opacity-30 uppercase tracking-[2px]">{fileName || 'Nenhum arquivo'}</span>
                        </div>
                    </div>

                    <div className="relative bg-card-main border border-border-main rounded-[48px] shadow-2xl overflow-hidden min-h-[300px] flex items-center justify-center p-12 group">
                        {!audioBuffer ? (
                            <label className="flex flex-col items-center gap-6 cursor-pointer hover:scale-105 transition-all">
                                <div className="w-20 h-20 bg-text-main text-bg-main rounded-[28px] flex items-center justify-center shadow-2xl">
                                    <Music size={40} />
                                </div>
                                <div className="text-center">
                                    <h4 className="font-black text-xl">Upload de Áudio</h4>
                                    <p className="text-xs opacity-40 font-bold uppercase tracking-widest mt-2">MP3, WAV, OGG (Somete processamento local)</p>
                                </div>
                                <input type="file" accept="audio/*" onChange={handleUpload} className="hidden" />
                            </label>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <svg
                                    ref={svgRef}
                                    viewBox={`0 0 ${points.length * (barWidth + gap)} 100`}
                                    className="w-full h-64 overflow-visible scale-y-[-1]"
                                >
                                    {points.map((p, i) => (
                                        <rect
                                            key={i}
                                            x={i * (barWidth + gap)}
                                            y={50 - (p * 50)}
                                            width={barWidth}
                                            height={p * 100}
                                            fill={color}
                                            rx={barWidth / 2}
                                        />
                                    ))}
                                </svg>
                                {isProcessing && (
                                    <div className="absolute inset-0 bg-bg-main/40 backdrop-blur-sm flex items-center justify-center z-20">
                                        <RefreshCw size={48} className="text-text-main animate-spin" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Estilizador de Onda</label>
                    <div className="bg-card-main border border-border-main p-8 rounded-[40px] flex flex-col gap-8 shadow-sm">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Cor da Onda</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color" value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-none"
                                    />
                                    <input
                                        type="text" value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="flex-1 bg-text-main/5 border border-border-main/10 rounded-xl px-4 text-xs font-mono font-bold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center pr-1">
                                    <label className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Espessura (Barra)</label>
                                    <span className="text-sm font-black italic">{barWidth}px</span>
                                </div>
                                <input
                                    type="range" min="1" max="10" value={barWidth}
                                    onChange={(e) => setBarWidth(parseInt(e.target.value))}
                                    className="w-full accent-text-main h-2 bg-text-main/10 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center pr-1">
                                    <label className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Espaçamento (Gap)</label>
                                    <span className="text-sm font-black italic">{gap}px</span>
                                </div>
                                <input
                                    type="range" min="0" max="10" value={gap}
                                    onChange={(e) => setGap(parseInt(e.target.value))}
                                    className="w-full accent-text-main h-2 bg-text-main/10 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                disabled={!audioBuffer}
                                onClick={downloadSvg}
                                className="w-full py-5 bg-text-main text-bg-main rounded-[24px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center gap-3"
                            >
                                <Download size={20} /> Baixar SVG Onda
                            </button>
                            <button
                                onClick={() => { setAudioBuffer(null); setPoints([]); setFileName(''); }}
                                className="w-full py-4 border-2 border-text-main/10 hover:bg-red-500/10 hover:text-red-500 rounded-[24px] font-bold text-sm transition-all flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={18} /> Novo Áudio
                            </button>
                        </div>
                    </div>

                    <div className="p-8 bg-blue-500/5 rounded-[40px] border border-blue-500/10 flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-blue-600/60 uppercase tracking-widest font-black text-[10px]">
                            <Volume2 size={14} /> Detalhes Técnicos
                        </div>
                        <p className="text-xs font-medium text-blue-600/60 leading-relaxed uppercase tracking-wider">
                            O processamento é feito usando a Web Audio API diretamente no seu navegador. Arquivos grandes podem demorar alguns segundos p/ processar.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
