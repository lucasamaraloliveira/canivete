'use client';

import React, { useState } from 'react';
import { Building2, Copy, Check, RefreshCw, Briefcase, MapPin, Globe, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function CompanyGenerator() {
    const [company, setCompany] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    const generateCompany = () => {
        const adjs = ['Nova', 'Global', 'Digital', 'Prime', 'Smart', 'Nexus', 'Elite', 'Master', 'Omega', 'Vortex'];
        const types = ['Tecnologia', 'Logística', 'Serviços', 'Indústria', 'Varejo', 'Consultoria', 'Marketing', 'Saúde'];
        const suffixes = ['S.A.', 'LTDA', 'Eireli', 'Group', 'Inc.'];

        const name = `${adjs[Math.floor(Math.random() * adjs.length)]} ${types[Math.floor(Math.random() * types.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;

        const generateCNPJ = () => {
            const r = () => Math.floor(Math.random() * 9);
            const n = Array.from({ length: 12 }, (v, i) => i < 8 ? r() : (i === 11 ? 1 : 0));
            const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
            const d1 = (11 - (n.reduce((a, v, i) => a + v * w1[i], 0) % 11)) % 11;
            const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
            const d2 = (11 - ([...n, d1].reduce((a, v, i) => a + v * w2[i], 0) % 11)) % 11;
            return [...n, d1, d2].join('').replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        };

        setCompany({
            name,
            cnpj: generateCNPJ(),
            ie: Math.floor(Math.random() * 899999999 + 100000000).toString(),
            phone: `(11) ${Math.floor(Math.random() * 1000 + 3000)}-${Math.floor(Math.random() * 8999 + 1000)}`,
            email: 'contato@' + name.split(' ')[0].toLowerCase() + '.com.br',
            site: 'www.' + name.split(' ')[0].toLowerCase() + '.com.br',
            address: 'Av. Paulista, ' + (Math.floor(Math.random() * 3000) + 100) + ', São Paulo - SP'
        });
    };

    return (
        <div className="flex flex-col gap-8 max-w-3xl mx-auto py-12">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 bg-text-main/5 text-text-main rounded-[32px] flex items-center justify-center shadow-2xl mb-4 text-cyan-500">
                    <Building2 size={40} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase">Gerador Empresa</h2>
                <p className="max-w-md text-sm font-medium opacity-60 leading-relaxed uppercase tracking-widest">
                    Crie perfis empresariais brasileiros completos com CNPJ, IE e dados de contato.
                </p>
            </div>

            <div className="bg-card-main border border-border-main rounded-[48px] p-8 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 flex flex-col gap-6 text-left">
                    <div className="flex justify-between items-start gap-4 mb-4">
                        <div className="flex-1">
                            <h3 className="text-2xl font-black truncate">{company?.name || 'Razão Social'}</h3>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-[10px] font-black bg-text-main/10 px-2 py-1 rounded uppercase tracking-[2px]">{company?.cnpj || 'CNPJ ••••'}</span>
                                <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">IE: {company?.ie || '••••'}</span>
                            </div>
                        </div>
                        <button onClick={generateCompany} className="p-5 bg-text-main text-bg-main rounded-[24px] shadow-xl hover:scale-105 active:scale-95 transition-all">
                            <RefreshCw size={24} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { icon: MapPin, label: 'Sede Administrativa', value: company?.address },
                            { icon: Phone, label: 'Telefone Corporativo', value: company?.phone },
                            { icon: Globe, label: 'Site / E-mail', value: company?.site },
                            { icon: Briefcase, label: 'Ramo de Atividade', value: 'Serviços Financeiros' }
                        ].map((item, idx) => (
                            <div key={idx} className="p-5 bg-text-main/5 rounded-3xl border border-border-main/5 hover:border-text-main/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-text-main/5 text-text-main rounded-2xl">
                                        <item.icon size={18} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[8px] font-black uppercase tracking-widest opacity-30">{item.label}</p>
                                        <p className="font-bold text-[11px] truncate">{item.value || '••••••••'}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => {
                            const txt = `Empresa: ${company.name}\nCNPJ: ${company.cnpj}\nIE: ${company.ie}\nSite: ${company.site}\nEnd: ${company.address}`;
                            navigator.clipboard.writeText(txt);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        }}
                        disabled={!company}
                        className="w-full mt-4 py-5 bg-text-main text-bg-main rounded-[24px] font-black text-xs uppercase tracking-[4px] shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-20"
                    >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                        {copied ? 'DADOS EMPRESARIAIS COPIADOS' : 'COPIAR PERFIL CORPORATIVO'}
                    </button>
                </div>
            </div>
        </div>
    );
}
