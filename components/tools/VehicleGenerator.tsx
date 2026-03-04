'use client';

import React, { useState } from 'react';
import { Truck, Copy, Check, RefreshCw, Car, Hash, Disc, Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function VehicleGenerator() {
    const [vehicle, setVehicle] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    const generateVehicle = () => {
        const brands = ['Volkswagen', 'Toyota', 'Honda', 'Fiat', 'Ford', 'Chevrolet', 'Hyundai', 'Jeep'];
        const models = ['Gol', 'Corolla', 'Civic', 'Uno', 'EcoSport', 'Onix', 'HB20', 'Renegade', 'Nivus', 'Hilux'];
        const colors = ['Branco', 'Preto', 'Prata', 'Cinza', 'Vermelho', 'Azul'];

        const generateChassis = () => {
            const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
            return Array.from({ length: 17 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        };

        const generateRENAVAM = () => {
            const n = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10));
            const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
            const sum = n.reduce((a, v, i) => a + v * weights[i], 0);
            const d = (11 - (sum % 11)) % 11;
            return n.join('') + d;
        };

        setVehicle({
            brand: brands[Math.floor(Math.random() * brands.length)],
            model: models[Math.floor(Math.random() * models.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
            year: Math.floor(Math.random() * 15) + 2010,
            chassis: generateChassis(),
            renavam: generateRENAVAM(),
            plate: 'ABC-' + Math.floor(Math.random() * 8999 + 1000)
        });
    };

    return (
        <div className="flex flex-col gap-8 max-w-3xl mx-auto py-12">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 bg-text-main/5 text-text-main rounded-[32px] flex items-center justify-center shadow-2xl mb-4 text-orange-400">
                    <Truck size={40} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase">Gerador de Veículos</h2>
                <p className="max-w-md text-sm font-medium opacity-60 leading-relaxed uppercase tracking-widest">
                    Crie fichas técnicas completas de veículos incluindo Chassi, RENAVAM e Placa para testes de logísticas.
                </p>
            </div>

            <div className="bg-card-main border border-border-main rounded-[48px] p-8 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 flex flex-col gap-6 text-left">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-text-main/5 rounded-[24px] flex items-center justify-center">
                                <Car size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black">{vehicle?.brand || 'Marca'} {vehicle?.model || 'Modelo'}</h3>
                                <p className="text-[10px] font-black uppercase tracking-[3px] opacity-40">{vehicle?.year ? `Ano/Fab: ${vehicle.year}` : 'Aguardando Geração'}</p>
                            </div>
                        </div>
                        <button onClick={generateVehicle} className="p-5 bg-text-main text-bg-main rounded-[24px] hover:scale-105 transition-all shadow-xl">
                            <RefreshCw size={24} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { icon: Hash, label: 'Chassi (17 Caracteres)', value: vehicle?.chassis },
                            { icon: Disc, label: 'Código RENAVAM', value: vehicle?.renavam },
                            { icon: Palette, label: 'Cor Predominante', value: vehicle?.color },
                            { icon: Hash, label: 'Placa Identificadora', value: vehicle?.plate }
                        ].map((item, idx) => (
                            <div key={idx} className="p-5 bg-text-main/5 rounded-3xl border border-border-main/10 flex flex-col gap-2">
                                <div className="flex items-center gap-2 opacity-30">
                                    <item.icon size={12} />
                                    <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
                                </div>
                                <p className="font-mono font-bold text-sm tracking-widest">{item.value || '••••••••'}</p>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => {
                            const txt = `Veículo: ${vehicle.brand} ${vehicle.model}\nChassi: ${vehicle.chassis}\nRENAVAM: ${vehicle.renavam}\nPlaca: ${vehicle.plate}`;
                            navigator.clipboard.writeText(txt);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        }}
                        disabled={!vehicle}
                        className="w-full mt-4 py-5 bg-text-main text-bg-main rounded-[24px] font-black text-xs uppercase tracking-[4px] shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-20"
                    >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                        {copied ? 'FICHA COPIADA' : 'COPIAR FICHA TÉCNICA'}
                    </button>
                </div>
            </div>
        </div>
    );
}
