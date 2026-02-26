'use client';

import React, { useState, useEffect } from 'react';
import { Type, Upload, Grid, Search, Download, RefreshCw, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export function IconFontPreviewer() {
    const [fontLoaded, setFontLoaded] = useState(false);
    const [fontName, setFontName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [fontSize, setFontSize] = useState(32);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const arrayBuffer = event.target?.result as ArrayBuffer;
            const newFontName = `CustomFont_${Math.random().toString(36).substr(2, 5)}`;

            try {
                const fontFace = new FontFace(newFontName, arrayBuffer);
                const loadedFace = await fontFace.load();
                (document.fonts as any).add(loadedFace);
                setFontName(newFontName);
                setFontLoaded(true);
            } catch (err) {
                console.error("Error loading font", err);
                alert("Erro ao carregar a fonte. Verifique se o arquivo é .ttf ou .woff.");
            }
        };
        reader.readAsArrayBuffer(file);
    };

    // Standard ASCII characters to preview
    const characters = Array.from({ length: 95 }, (_, i) => String.fromCharCode(i + 32));
    const filteredChars = characters.filter(c =>
        c.toLowerCase().includes(searchQuery.toLowerCase()) || searchQuery === ''
    );

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Visualização de Glifos</label>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={14} />
                                <input
                                    type="text"
                                    placeholder="Filtrar caractere..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-card-main border border-border-main/5 rounded-xl py-1.5 pl-9 pr-4 text-xs focus:ring-2 focus:ring-text-main/10 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 bg-card-main border border-border-main rounded-[48px] shadow-inner overflow-hidden min-h-[500px] flex flex-col">
                        <div className="flex-1 overflow-auto custom-scrollbar p-10">
                            {!fontLoaded ? (
                                <div className="h-full flex flex-col items-center justify-center gap-8 group">
                                    <label className="flex flex-col items-center gap-6 cursor-pointer hover:scale-105 transition-all">
                                        <div className="w-24 h-24 bg-text-main text-bg-main rounded-[32px] flex items-center justify-center shadow-2xl rotate-6 group-hover:rotate-0 transition-transform">
                                            <Type size={48} />
                                        </div>
                                        <div className="text-center">
                                            <h4 className="font-black text-2xl">Carregar Arquivo de Fonte</h4>
                                            <p className="text-xs opacity-40 font-bold uppercase tracking-[3px] mt-3">TTF, WOFF ou WOFF2</p>
                                        </div>
                                        <input type="file" accept=".ttf,.woff,.woff2" onChange={handleUpload} className="hidden" />
                                    </label>
                                    <div className="max-w-xs text-center opacity-30">
                                        <p className="text-[10px] font-bold uppercase leading-relaxed tracking-widest">
                                            Arraste sua fonte para visualizar todos os caracteres e ícones mapeados.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
                                    {filteredChars.map((char, i) => (
                                        <div
                                            key={i}
                                            className="aspect-square bg-text-main/5 rounded-2xl flex flex-col items-center justify-center gap-2 group hover:bg-text-main hover:text-bg-main transition-all border border-border-main/5"
                                        >
                                            <span
                                                style={{ fontFamily: fontName, fontSize: `${fontSize}px` }}
                                                className="transition-transform group-hover:scale-125"
                                            >
                                                {char}
                                            </span>
                                            <span className="text-[8px] font-mono opacity-30 group-hover:opacity-100">
                                                U+{char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Painel de Controle</label>
                    <div className="bg-card-main border border-border-main p-8 rounded-[40px] flex flex-col gap-8 shadow-sm">
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Tamanho do Preview</label>
                                    <span className="text-sm font-black italic">{fontSize}px</span>
                                </div>
                                <input
                                    type="range" min="12" max="120" value={fontSize}
                                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                                    className="w-full accent-text-main h-2 bg-text-main/10 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <button
                                onClick={() => setFontLoaded(false)}
                                className="w-full py-4 border-2 border-text-main/10 hover:bg-text-main/5 text-text-main rounded-[24px] font-bold text-sm transition-all flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={18} /> Trocar Fonte
                            </button>
                        </div>
                    </div>

                    <div className="p-8 bg-yellow-500/5 rounded-[40px] border border-yellow-500/10 flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-yellow-600/60 uppercase tracking-widest font-black text-[10px]">
                            <Info size={14} /> Nota Legal
                        </div>
                        <p className="text-xs font-medium text-yellow-600/60 leading-relaxed uppercase tracking-wider">
                            Este visualizador carrega a fonte temporariamente na memória do navegador. Certifique-se de ter a licença apropriada p/ uso comercial.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
