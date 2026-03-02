'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Scissors, Download, Upload, Grid, RefreshCw, Layers, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpriteTile {
    id: string;
    dataUrl: string;
    col: number;
    row: number;
}

export function SpriteSplitter() {
    const [image, setImage] = useState<string | null>(null);
    const [rows, setRows] = useState(4);
    const [cols, setCols] = useState(4);
    const [tiles, setTiles] = useState<SpriteTile[]>([]);
    const [isSplitting, setIsSplitting] = useState(false);
    const [zoom, setZoom] = useState(1);
    const imageRef = useRef<HTMLImageElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => setImage(event.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const splitSprite = () => {
        if (!image || !imageRef.current) return;
        setIsSplitting(true);

        const img = imageRef.current;
        const tileWidth = img.naturalWidth / cols;
        const tileHeight = img.naturalHeight / rows;
        const newTiles: SpriteTile[] = [];

        const canvas = document.createElement('canvas');
        canvas.width = tileWidth;
        canvas.height = tileHeight;
        const ctx = canvas.getContext('2d')!;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                ctx.clearRect(0, 0, tileWidth, tileHeight);
                ctx.drawImage(
                    img,
                    c * tileWidth, r * tileHeight, tileWidth, tileHeight,
                    0, 0, tileWidth, tileHeight
                );
                newTiles.push({
                    id: `${r}-${c}`,
                    dataUrl: canvas.toDataURL(),
                    row: r,
                    col: c
                });
            }
        }

        setTiles(newTiles);
        setIsSplitting(false);
    };

    const downloadTile = (tile: SpriteTile) => {
        const link = document.createElement('a');
        link.download = `tile_${tile.row}_${tile.col}.png`;
        link.href = tile.dataUrl;
        link.click();
    };

    const downloadAll = () => {
        tiles.forEach((tile, index) => {
            setTimeout(() => downloadTile(tile), index * 100);
        });
    };

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Sprite Sheet Base</label>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setZoom(z => Math.max(0.2, z - 0.1))} className="p-2 hover:bg-text-main/5 rounded-lg transition-all"><ZoomOut size={18} /></button>
                            <span className="text-xs font-mono font-bold opacity-40">{Math.round(zoom * 100)}%</span>
                            <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-2 hover:bg-text-main/5 rounded-lg transition-all"><ZoomIn size={18} /></button>
                        </div>
                    </div>

                    <div className="relative bg-card-main border border-border-main border-dashed border-2 rounded-[40px] shadow-inner overflow-hidden min-h-[400px] flex items-center justify-center group/canvas">
                        {!image ? (
                            <label className="flex flex-col items-center gap-4 cursor-pointer hover:scale-105 transition-all">
                                <div className="w-16 h-16 bg-text-main text-bg-main rounded-2xl flex items-center justify-center shadow-xl">
                                    <Upload size={32} />
                                </div>
                                <div className="text-center">
                                    <h4 className="font-black text-lg">Upload Sprite Sheet</h4>
                                    <p className="text-sm opacity-40 font-medium">PNG ou JPG com fundo transparente/sólido</p>
                                </div>
                                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                            </label>
                        ) : (
                            <div className="relative" style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
                                <img
                                    ref={imageRef}
                                    src={image}
                                    alt="Sprite Sheet"
                                    className="max-w-none shadow-2xl"
                                />
                                {/* Overlay Grid */}
                                <div
                                    className="absolute inset-0 pointer-events-none border border-blue-500/30"
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: `repeat(${cols}, 1fr)`,
                                        gridTemplateRows: `repeat(${rows}, 1fr)`
                                    }}
                                >
                                    {Array.from({ length: rows * cols }).map((_, i) => (
                                        <div key={i} className="border border-blue-500/20" />
                                    ))}
                                </div>
                            </div>
                        )}
                        {image && (
                            <button
                                onClick={() => setImage(null)}
                                className="absolute top-6 right-6 p-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-lg opacity-0 group-hover/canvas:opacity-100"
                            >
                                <RefreshCw size={20} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Configurações de Corte</label>
                    <div className="bg-card-main border border-border-main p-8 rounded-[40px] flex flex-col gap-8 shadow-sm">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Colunas (X)</label>
                                    <span className="text-sm font-black italic">{cols}</span>
                                </div>
                                <input
                                    type="range" min="1" max="25" value={cols}
                                    onChange={(e) => setCols(parseInt(e.target.value))}
                                    className="w-full accent-text-main h-2 bg-text-main/10 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Linhas (Y)</label>
                                    <span className="text-sm font-black italic">{rows}</span>
                                </div>
                                <input
                                    type="range" min="1" max="25" value={rows}
                                    onChange={(e) => setRows(parseInt(e.target.value))}
                                    className="w-full accent-text-main h-2 bg-text-main/10 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        </div>

                        <button
                            disabled={!image}
                            onClick={splitSprite}
                            className="w-full py-5 bg-text-main text-bg-main rounded-[24px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center gap-3"
                        >
                            {isSplitting ? <RefreshCw className="animate-spin" /> : <Scissors size={20} />}
                            Cortar Sprite Sheet
                        </button>

                        {tiles.length > 0 && (
                            <button
                                onClick={downloadAll}
                                className="w-full py-4 border-2 border-text-main/10 hover:bg-text-main/5 text-text-main rounded-[24px] font-bold text-sm transition-all flex items-center justify-center gap-2"
                            >
                                <Download size={18} /> Baixar Todos ({tiles.length})
                            </button>
                        )}
                    </div>

                    <div className="p-6 bg-blue-500/5 rounded-[32px] border border-blue-500/10 flex items-center gap-4">
                        <div className="w-10 h-10 bg-card-main rounded-xl flex items-center justify-center shadow-sm text-blue-500">
                            <Grid size={20} />
                        </div>
                        <p className="text-[10px] font-medium text-blue-600/60 leading-relaxed uppercase tracking-wider">
                            Ajuste as guias azuis sobre a imagem para garantir o corte perfeito.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-0 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-text-main/60">
                        <Layers size={18} />
                        <span className="text-sm font-bold uppercase tracking-wider">Sprites Gerados</span>
                    </div>
                    <span className="text-[10px] font-black opacity-20 uppercase">{tiles.length} ITENS</span>
                </div>

                <div className="flex-1 bg-card-main border border-border-main rounded-[48px] overflow-hidden shadow-inner flex flex-col">
                    <div className="flex-1 overflow-auto custom-scrollbar p-10">
                        {tiles.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
                                {tiles.map((tile) => (
                                    <div key={tile.id} className="group relative aspect-square bg-text-main/5 border border-border-main/5 rounded-2xl overflow-hidden flex items-center justify-center hover:bg-text-main/10 transition-all p-2 animate-in zoom-in-50 duration-300">
                                        <img src={tile.dataUrl} alt={`tile ${tile.id}`} className="max-w-full max-h-full image-render-pixel" />
                                        <div className="absolute inset-0 bg-text-main/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => downloadTile(tile)}
                                                className="p-2 bg-card-main text-text-main rounded-lg hover:scale(1.1) transition-all"
                                            >
                                                <Download size={14} />
                                            </button>
                                        </div>
                                        <div className="absolute bottom-1 right-1 px-1 bg-text-main/20 rounded text-[6px] font-mono text-text-main opacity-40">
                                            {tile.id}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-text-main/20 gap-4 grayscale opacity-40">
                                <Scissors size={64} className="animate-bounce-slow" />
                                <div className="text-center">
                                    <p className="font-black text-xl uppercase tracking-tighter">Aguardando Processamento</p>
                                    <p className="text-xs font-bold opacity-50">Os frames individuais aparecerão aqui</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .image-render-pixel {
                    image-rendering: pixelated;
                    image-rendering: crisp-edges;
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
