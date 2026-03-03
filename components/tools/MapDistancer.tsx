import React, { useState } from 'react';
import { Map as MapIcon, Navigation, Ruler, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MapDistancer() {
    const [p1, setP1] = useState({ x: 100, y: 100 });
    const [p2, setP2] = useState({ x: 300, y: 300 });
    const [activePoint, setActivePoint] = useState<1 | 2 | null>(null);

    const containerRef = React.useRef<HTMLDivElement>(null);
    const rectRef = React.useRef<DOMRect | null>(null);

    const distance = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);

    // Scale: 1px = 1km (for simulation)
    const realDist = distance;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!activePoint || !rectRef.current) return;
        const rect = rectRef.current;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (activePoint === 1) setP1({ x, y });
        else setP2({ x, y });
    };

    const handleMouseDown = (point: 1 | 2) => {
        if (containerRef.current) {
            rectRef.current = containerRef.current.getBoundingClientRect();
        }
        setActivePoint(point);
    };

    const handleMouseUp = () => {
        setActivePoint(null);
        rectRef.current = null;
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8 h-full">
            <div className="text-center">
                <div className="w-16 h-16 bg-text-main/5 rounded-2xl flex items-center justify-center text-text-main mx-auto mb-4">
                    <MapIcon size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Map Distancer</h3>
                <p className="text-text-main/50">Calcule distâncias entre coordenadas em um plano cartesiano.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div
                    ref={containerRef}
                    className="lg:col-span-2 aspect-[4/3] bg-bg-main rounded-[40px] border border-border-main shadow-2xl relative overflow-hidden cursor-crosshair group"
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                    {/* Line */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <line
                            x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                            stroke="currentColor" strokeWidth="2" strokeDasharray="8 4"
                            className="text-text-main opacity-20"
                        />
                    </svg>

                    {/* Point 1 */}
                    <div
                        onMouseDown={() => handleMouseDown(1)}
                        className={cn(
                            "absolute w-10 h-10 -ml-5 -mt-5 rounded-full flex items-center justify-center transition-transform active:scale-90",
                            activePoint === 1 ? "z-20" : "z-10"
                        )}
                        style={{ left: p1.x, top: p1.y }}
                    >
                        <div className="w-4 h-4 bg-blue-500 rounded-full ring-8 ring-blue-500/20" />
                        <span className="absolute -top-6 text-[10px] font-bold text-blue-500">PONTO A</span>
                    </div>

                    {/* Point 2 */}
                    <div
                        onMouseDown={() => handleMouseDown(2)}
                        className={cn(
                            "absolute w-10 h-10 -ml-5 -mt-5 rounded-full flex items-center justify-center transition-transform active:scale-90",
                            activePoint === 2 ? "z-20" : "z-10"
                        )}
                        style={{ left: p2.x, top: p2.y }}
                    >
                        <div className="w-4 h-4 bg-red-500 rounded-full ring-8 ring-red-500/20" />
                        <span className="absolute -top-6 text-[10px] font-bold text-red-500">PONTO B</span>
                    </div>

                    <div className="absolute top-6 left-6 px-4 py-2 bg-text-main/10 backdrop-blur-md rounded-xl text-xs font-bold opacity-40">
                        Arraste os pontos para medir
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-8 bg-text-main border border-border-main rounded-[40px] text-bg-main shadow-2xl flex flex-col items-center justify-center text-center">
                        <p className="text-[10px] font-bold uppercase tracking-[4px] opacity-40 mb-2">Distância Total</p>
                        <h2 className="text-5xl font-black mb-2">{realDist.toFixed(1)}</h2>
                        <p className="text-xl font-bold opacity-60">unidades</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="p-4 bg-text-main/5 border border-border-main rounded-2xl">
                            <div className="flex items-center gap-2 mb-2">
                                <Navigation size={14} className="text-blue-500" />
                                <span className="text-[10px] font-bold opacity-40 uppercase">Coordenadas A</span>
                            </div>
                            <p className="font-mono text-sm font-bold">X: {Math.round(p1.x)}, Y: {Math.round(p1.y)}</p>
                        </div>
                        <div className="p-4 bg-text-main/5 border border-border-main rounded-2xl">
                            <div className="flex items-center gap-2 mb-2">
                                <Target size={14} className="text-red-500" />
                                <span className="text-[10px] font-bold opacity-40 uppercase">Coordenadas B</span>
                            </div>
                            <p className="font-mono text-sm font-bold">X: {Math.round(p2.x)}, Y: {Math.round(p2.y)}</p>
                        </div>
                    </div>

                    <div className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-3xl flex items-start gap-3">
                        <Ruler size={18} className="shrink-0 mt-0.5 text-yellow-600" />
                        <p className="text-[11px] leading-relaxed text-yellow-700">
                            <strong>Teorema de Pitágoras:</strong> A distância é calculada usando d = √((x2-x1)² + (y2-y1)²). Útil para cartografia básica e geometria plana.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
