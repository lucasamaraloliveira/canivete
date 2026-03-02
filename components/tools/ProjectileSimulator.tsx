import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Play, RefreshCw, Sliders } from 'lucide-react';

export function ProjectileSimulator() {
    const [velocity, setVelocity] = useState(50);
    const [angle, setAngle] = useState(45);
    const [gravity, setGravity] = useState(9.8);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const scale = 5; // Pixels per meter

        ctx.clearRect(0, 0, width, height);

        // Ground
        ctx.strokeStyle = '#333';
        ctx.beginPath();
        ctx.moveTo(0, height - 20);
        ctx.lineTo(width, height - 20);
        ctx.stroke();

        // Trajectory
        const rad = angle * (Math.PI / 180);
        const vx = velocity * Math.cos(rad);
        const vy = velocity * Math.sin(rad);
        const tf = (2 * vy) / gravity;

        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.beginPath();
        for (let t = 0; t <= tf; t += 0.1) {
            const x = vx * t * scale;
            const y = height - 20 - (vy * t - 0.5 * gravity * t * t) * scale;
            if (t === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Final stats
        const range = (velocity ** 2 * Math.sin(2 * rad)) / gravity;
        const maxHeight = (vy ** 2) / (2 * gravity);

        return { range, maxHeight, time: tf };
    };

    const stats = draw();

    useEffect(() => {
        draw();
    }, [velocity, angle, gravity]);

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <div className="text-center">
                <div className="w-16 h-16 bg-text-main/5 rounded-2xl flex items-center justify-center text-text-main mx-auto mb-4">
                    <ArrowUpRight size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Projectile Simulator</h3>
                <p className="text-text-main/50">Simule trajetórias balísticas e calcule alcance e altura máxima.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-bg-main rounded-[40px] border border-border-main p-6 shadow-2xl relative overflow-hidden flex flex-col items-center">
                    <canvas
                        ref={canvasRef}
                        width={600}
                        height={400}
                        className="w-full h-auto opacity-80"
                    />

                    <div className="grid grid-cols-3 gap-4 w-full mt-6">
                        <div className="p-4 bg-text-main/5 rounded-2xl border border-border-main text-center">
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">Alcance</p>
                            <p className="text-lg font-black">{stats?.range.toFixed(1)}m</p>
                        </div>
                        <div className="p-4 bg-text-main/5 rounded-2xl border border-border-main text-center">
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">H. Máxima</p>
                            <p className="text-lg font-black">{stats?.maxHeight.toFixed(1)}m</p>
                        </div>
                        <div className="p-4 bg-text-main/5 rounded-2xl border border-border-main text-center">
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">Tempo Voo</p>
                            <p className="text-lg font-black">{stats?.time.toFixed(1)}s</p>
                        </div>
                    </div>
                </div>

                <div className="bg-bg-main p-8 rounded-[40px] border border-border-main shadow-xl flex flex-col gap-8">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-40">
                        <Sliders size={16} /> Parâmetros
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs font-bold">
                                <span>Velocidade</span>
                                <span className="text-text-main">{velocity} m/s</span>
                            </div>
                            <input
                                type="range" min="1" max="100" value={velocity}
                                onChange={(e) => setVelocity(parseInt(e.target.value))}
                                className="w-full h-2 bg-text-main/10 rounded-lg appearance-none cursor-pointer accent-text-main"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-xs font-bold">
                                <span>Ângulo</span>
                                <span className="text-text-main">{angle}°</span>
                            </div>
                            <input
                                type="range" min="0" max="90" value={angle}
                                onChange={(e) => setAngle(parseInt(e.target.value))}
                                className="w-full h-2 bg-text-main/10 rounded-lg appearance-none cursor-pointer accent-text-main"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-xs font-bold">
                                <span>Gravidade</span>
                                <span className="text-text-main">{gravity} m/s²</span>
                            </div>
                            <input
                                type="range" min="1" max="30" step="0.1" value={gravity}
                                onChange={(e) => setGravity(parseFloat(e.target.value))}
                                className="w-full h-2 bg-text-main/10 rounded-lg appearance-none cursor-pointer accent-text-main"
                            />
                        </div>
                    </div>

                    <div className="mt-4 p-4 bg-text-main/5 border border-dashed border-border-main rounded-2xl flex items-center justify-around opacity-40 italic text-[10px]">
                        <span>45° = Alcance Máx.</span>
                        <div className="w-px h-4 bg-border-main" />
                        <span>90° = Altura Máx.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
