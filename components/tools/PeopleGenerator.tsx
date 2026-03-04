'use client';

import React, { useState } from 'react';
import { UserPlus, Copy, Check, RefreshCw, Smartphone, CreditCard, MapPin, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function PeopleGenerator() {
    const [person, setPerson] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    const generatePerson = () => {
        const firstNames = ['Lucas', 'Mateus', 'Gabriel', 'Ana', 'Julia', 'Beatriz', 'Felipe', 'Mariana', 'Vinicius', 'Larissa'];
        const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes'];

        const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;

        const generateCPF = () => {
            const r = () => Math.floor(Math.random() * 9);
            const n = Array.from({ length: 9 }, r);
            const d1 = n.reduce((a, v, i) => a + v * (10 - i), 0) % 11;
            const r1 = d1 < 2 ? 0 : 11 - d1;
            const d2 = ([...n, r1].reduce((a, v, i) => a + v * (11 - i), 0)) % 11;
            const r2 = d2 < 2 ? 0 : 11 - d2;
            return [...n, r1, r2].join('').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        };

        setPerson({
            name,
            age: Math.floor(Math.random() * 50) + 18,
            cpf: generateCPF(),
            email: name.toLowerCase().replace(/\s/g, '.') + '@exemplo.com',
            phone: `(11) 9${Math.floor(Math.random() * 89999999 + 10000000)}`,
            address: 'Rua das Flores, ' + (Math.floor(Math.random() * 999) + 1) + ', São Paulo - SP',
            cep: `${Math.floor(Math.random() * 89999 + 10000)}-${Math.floor(Math.random() * 899 + 100)}`
        });
    };

    return (
        <div className="flex flex-col gap-8 max-w-3xl mx-auto py-12">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 bg-text-main/5 text-text-main rounded-[32px] flex items-center justify-center shadow-2xl mb-4 text-pink-500">
                    <UserPlus size={40} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase">Gerador de Pessoas</h2>
                <p className="max-w-md text-sm font-medium opacity-60 leading-relaxed uppercase tracking-widest">
                    Crie identidades completas e realistas para testes de onboarding e KYC.
                </p>
            </div>

            <div className="bg-card-main border border-border-main rounded-[48px] p-8 sm:p-12 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 flex flex-col gap-6">
                    <div className="bg-text-main/5 border border-border-main rounded-[32px] overflow-hidden">
                        <div className="p-8 border-b border-border-main/10 flex items-center justify-between bg-text-main/[0.02]">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-text-main rounded-2xl flex items-center justify-center text-bg-main text-2xl font-black italic">
                                    {person?.name?.[0] || '?'}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{person?.name || 'Aguardando...'}</h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{person?.age ? `${person.age} anos` : 'Gerar Dados'}</p>
                                </div>
                            </div>
                            <button onClick={generatePerson} className="p-4 bg-text-main text-bg-main rounded-2xl hover:scale-105 transition-all shadow-lg active:scale-95">
                                <RefreshCw size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 p-4 gap-4">
                            {[
                                { icon: Fingerprint, label: 'CPF', value: person?.cpf },
                                { icon: Smartphone, label: 'Telefone', value: person?.phone },
                                { icon: MapPin, label: 'Endereço', value: person?.address },
                                { icon: CreditCard, label: 'E-mail', value: person?.email }
                            ].map((item, idx) => (
                                <div key={idx} className="p-4 bg-text-main/5 rounded-2xl flex items-center gap-4 group/item hover:bg-text-main/10 transition-colors">
                                    <div className="p-3 bg-text-main/5 rounded-xl text-text-main group-hover/item:bg-text-main group-hover/item:text-bg-main transition-colors">
                                        <item.icon size={18} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[8px] font-black uppercase tracking-widest opacity-30">{item.label}</p>
                                        <p className="font-bold text-xs truncate">{item.value || '••••••••'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            const txt = `Nome: ${person.name}\nCPF: ${person.cpf}\nEmail: ${person.email}\nTel: ${person.phone}\nEnd: ${person.address}`;
                            navigator.clipboard.writeText(txt);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        }}
                        disabled={!person}
                        className="w-full py-5 bg-text-main text-bg-main rounded-[24px] font-black text-xs uppercase tracking-[4px] shadow-xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-20"
                    >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                        {copied ? 'DADOS COPIADOS' : 'COPIAR PERFIL COMPLETO'}
                    </button>
                </div>
            </div>
        </div>
    );
}
