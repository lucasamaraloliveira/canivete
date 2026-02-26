'use client';

import React, { useState } from 'react';
import { Subtitles, Copy, Check, Info, ArrowLeftRight, Download, RotateCcw } from 'lucide-react';
import { CodeBlock } from '../CodeBlock';

export function VttToSrt() {
    const [vttContent, setVttContent] = useState('WEBVTT\n\n1\n00:00:01.000 --> 00:00:04.000\nOlá, este é um exemplo de legenda VTT.\n\n2\n00:00:05.000 --> 00:00:09.000\nO Canivete Suíço converte isso para SRT facilmente.');
    const [srtContent, setSrtContent] = useState('');
    const [copied, setCopied] = useState(false);

    const convertVttToSrt = () => {
        let srt = vttContent
            .replace(/WEBVTT\n+/g, '') // Remove header
            .replace(/(\d{2}:\d{2}:\d{2})\.(\d{3})/g, '$1,$2') // Convert decimal to comma for timestamp
            .trim();

        setSrtContent(srt);
    };

    const downloadSrt = () => {
        const element = document.createElement("a");
        const file = new Blob([srtContent || ''], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "legendas.srt";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(srtContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-6 h-full min-h-0 overflow-y-auto sm:overflow-hidden custom-scrollbar">
            <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-text-main/5 rounded-2xl">
                        <Subtitles size={28} className="text-text-main" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold uppercase tracking-tight">VTT to SRT Converter</h2>
                        <p className="text-xs opacity-50 font-medium">Converta legendas WebVTT para o formato SubRip (SRT) localmente.</p>
                    </div>
                </div>
                <button
                    onClick={() => { setVttContent(''); setSrtContent(''); }}
                    className="p-3 hover:bg-text-main/5 rounded-2xl transition-all opacity-40 hover:opacity-100"
                >
                    <RotateCcw size={20} />
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1 min-h-0">
                <div className="flex flex-col gap-3 min-h-[300px] sm:min-h-0">
                    <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">WebVTT Content</label>
                    </div>
                    <textarea
                        value={vttContent}
                        onChange={(e) => setVttContent(e.target.value)}
                        className="flex-1 p-6 bg-card-main border border-border-main rounded-[32px] font-mono text-sm focus:ring-4 focus:ring-text-main/5 outline-none transition-all resize-none shadow-sm"
                        placeholder="Cole seu código VTT aqui..."
                    />
                </div>

                <div className="flex flex-col gap-3 min-h-[300px] sm:min-h-0">
                    <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">SRT Output</label>
                        <div className="flex gap-2">
                            {srtContent && (
                                <>
                                    <button onClick={copyToClipboard} className="p-2 hover:bg-text-main/5 rounded-lg transition-all text-text-main/40 hover:text-text-main">
                                        {copied ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                    <button onClick={downloadSrt} className="p-2 hover:bg-text-main/5 rounded-lg transition-all text-text-main/40 hover:text-text-main">
                                        <Download size={16} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 relative group">
                        <div className="absolute inset-0 bg-text-main rounded-[32px] overflow-auto shadow-2xl border border-border-main/5 scrollbar-hide">
                            <CodeBlock
                                code={srtContent || '// O resultado da conversão aparecerá aqui...'}
                                language="log"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="shrink-0 pt-4 border-t border-border-main/5 flex flex-col sm:flex-row items-center gap-6">
                <button
                    onClick={convertVttToSrt}
                    className="w-full sm:w-auto px-10 py-5 bg-text-main text-bg-main rounded-[24px] font-bold shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                >
                    <ArrowLeftRight size={20} /> Converter Legendas
                </button>
                <div className="flex items-center gap-3 text-text-main/40 px-4">
                    <Info size={16} />
                    <p className="text-[10px] sm:text-xs font-medium italic opacity-60">
                        Processamento 100% offline. Seus arquivos de legenda não saem do seu computador.
                    </p>
                </div>
            </div>
        </div>
    );
}
