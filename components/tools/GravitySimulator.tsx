import React, { useState, useEffect, useRef } from 'react';
import { Orbit, Play, RefreshCw, Plus, Minus } from 'lucide-react';

export function GravitySimulator() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [running, setRunning] = useState(false);
    const bodiesRef = useRef([{ x: 300, y: 200, vx: 0, vy: 0, mass: 1000, fixed: true }, { x: 300, y: 100, vx: 3, vy: 0, mass: 1, fixed: false }]);

    useEffect(() => {
        if (!running) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let frameId: number;
        const G = 0.5;

        const loop = () => {
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const bodies = bodiesRef.current;
            for (let i = 0; i < bodies.length; i++) {
                const b1 = bodies[i];
                if (!b1.fixed) {
                    for (let j = 0; j < bodies.length; j++) {
                        if (i === j) continue;
                        const b2 = bodies[j];
                        const dx = b2.x - b1.x;
                        const dy = b2.y - b1.y;
                        const distSq = dx * dx + dy * dy;
                        const dist = Math.sqrt(distSq);
                        const force = (G * b1.mass * b2.mass) / Math.max(distSq, 100);
                        b1.vx += (force * dx) / dist / b1.mass;
                        b1.vy += (force * dy) / dist / b1.mass;
                    }
                    b1.x += b1.vx;
                    b1.y += b1.vy;
                }

                ctx.fillStyle = b1.fixed ? '#FFD700' : '#4FC3F7';
                ctx.beginPath();
                ctx.arc(b1.x, b1.y, b1.fixed ? 15 : 4, 0, Math.PI * 2);
                ctx.fill();
            }

            frameId = requestAnimationFrame(loop);
        };

        loop();
        return () => cancelAnimationFrame(frameId);
    }, [running]);

    const reset = () => {
        bodiesRef.current = [
            { x: 300, y: 200, vx: 0, vy: 0, mass: 1000, fixed: true },
            { x: 300, y: 100, vx: 3, vy: 0, mass: 1, fixed: false },
            { x: 300, y: 350, vx: -2.2, vy: 0.2, mass: 1, fixed: false }
        ];
        setRunning(false);
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, 600, 400);
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8 h-full items-center">
            <div className="text-center">
                <div className="w-16 h-16 bg-text-main/5 rounded-2xl flex items-center justify-center text-text-main mx-auto mb-4">
                    <Orbit size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Gravity Simulator</h3>
                <p className="text-text-main/50">Sandbox orbital 2D para observar as leis de Newton em ação.</p>
            </div>

            <div className="bg-black rounded-[40px] border border-border-main p-4 shadow-2xl relative overflow-hidden ring-4 ring-text-main/5">
                <canvas
                    ref={canvasRef}
                    width={600}
                    height={400}
                    className="rounded-[32px] cursor-crosshair"
                />

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
                    <button
                        onClick={() => setRunning(!running)}
                        className="px-6 py-2 bg-text-main text-bg-main rounded-xl font-bold transition-all hover:scale-105"
                    >
                        {running ? 'Pausar' : 'Iniciar'}
                    </button>
                    <button
                        onClick={reset}
                        className="p-2 hover:bg-white/10 text-white rounded-xl transition-colors"
                    >
                        <RefreshCw size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div className="p-4 bg-text-main/5 border border-border-main rounded-2xl flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <p className="text-xs font-bold opacity-60">Estrela (Massa Fixa)</p>
                </div>
                <div className="p-4 bg-text-main/5 border border-border-main rounded-2xl flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-400" />
                    <p className="text-xs font-bold opacity-60">Planeta (Velocidade Orbital)</p>
                </div>
                <div className="p-4 bg-text-main/5 border border-border-main rounded-2xl">
                    <p className="text-[10px] uppercase font-bold opacity-30">Nota Técnica</p>
                    <p className="text-[11px] opacity-40 italic leading-tight">Simulação de N-corpos usando Integração de Euler simplificada.</p>
                </div>
            </div>
        </div>
    );
}
