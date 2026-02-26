'use client';

import React, { useState, useMemo } from 'react';
import { GitBranch, Search, Copy, Check, Terminal, Info, ChevronRight } from 'lucide-react';

interface GitCommand {
    cmd: string;
    desc: string;
    category: string;
    longDesc?: string;
}

const GIT_COMMANDS: GitCommand[] = [
    { cmd: 'git init', desc: 'Inicializa um novo repositório local.', category: 'Setup' },
    { cmd: 'git clone <url>', desc: 'Copia um repositório remoto para sua máquina.', category: 'Setup' },
    { cmd: 'git status', desc: 'Mostra o estado atual das alterações.', category: 'Básico' },
    { cmd: 'git add .', desc: 'Adiciona todas as alterações para o commit.', category: 'Básico' },
    { cmd: 'git commit -m "mensagem"', desc: 'Salva as alterações no histórico.', category: 'Básico' },
    { cmd: 'git push origin <branch>', desc: 'Envia commits locais para o remoto.', category: 'Sync' },
    { cmd: 'git pull origin <branch>', desc: 'Busca e integra alterações remotas.', category: 'Sync' },
    { cmd: 'git branch', desc: 'Lista as branches locais.', category: 'Branch' },
    { cmd: 'git checkout -b <nome>', desc: 'Cria e muda para uma nova branch.', category: 'Branch' },
    { cmd: 'git merge <branch>', desc: 'Integra uma branch na branch atual.', category: 'Branch' },
    { cmd: 'git reset --hard HEAD~1', desc: 'Descarta o último commit permanentemente.', category: 'Avançado' },
    { cmd: 'git revert <commit-hash>', desc: 'Gera um commit que desfaz um commit anterior.', category: 'Avançado' },
    { cmd: 'git stash', desc: 'Guarda alterações temporariamente sem commit.', category: 'Avançado' },
    { cmd: 'git log --oneline', desc: 'Mostra o histórico de commits resumido.', category: 'Básico' },
    { cmd: 'git remote -v', desc: 'Lista os repositórios remotos configurados.', category: 'Setup' },
    { cmd: 'git diff', desc: 'Mostra diferenças entre working directory e stage.', category: 'Básico' },
    { cmd: 'git branch -d <nome>', desc: 'Deleta uma branch local.', category: 'Branch' },
    { cmd: 'git fetch origin', desc: 'Baixa metadados do remoto sem merge.', category: 'Sync' },
    { cmd: 'git cherry-pick <hash>', desc: 'Aplica um commit específico na branch atual.', category: 'Avançado' },
];

export function GitHelper() {
    const [search, setSearch] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const filtered = useMemo(() => {
        return GIT_COMMANDS.filter(c =>
            c.cmd.toLowerCase().includes(search.toLowerCase()) ||
            c.desc.toLowerCase().includes(search.toLowerCase()) ||
            c.category.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    const copy = (cmd: string) => {
        navigator.clipboard.writeText(cmd);
        setCopiedId(cmd);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const categories = Array.from(new Set(GIT_COMMANDS.map(c => c.category)));

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex flex-col gap-4">
                <div className="relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-main/20 group-focus-within:text-text-main transition-colors" size={20} />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-16 pr-6 py-4 bg-card-main border border-border-main rounded-2xl font-bold text-lg shadow-sm focus:ring-4 focus:ring-text-main/5 outline-none transition-all"
                        placeholder="O que você deseja fazer no Git?"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSearch(cat)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${search === cat ? "bg-text-main text-bg-main" : "bg-text-main/5 hover:bg-text-main/10 text-text-main/40"}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-auto pr-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-8 custom-scrollbar">
                {filtered.map((c, i) => (
                    <div
                        key={i}
                        className="bg-card-main border border-border-main p-6 rounded-[32px] flex flex-col justify-between hover:shadow-xl hover:border-text-main/20 transition-all group animate-in zoom-in-95 duration-300"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="px-2 py-1 bg-text-main/5 rounded-lg text-[8px] font-black uppercase tracking-widest text-text-main/30">{c.category}</span>
                                <Terminal size={14} className="opacity-10 group-hover:opacity-30 transition-opacity" />
                            </div>
                            <h4 className="font-mono text-sm font-bold bg-text-main/5 p-3 rounded-2xl mb-4 text-text-main group-hover:bg-text-main group-hover:text-bg-main transition-colors break-all">
                                {c.cmd}
                            </h4>
                            <p className="text-xs font-medium text-text-main/60 leading-relaxed italic">
                                {c.desc}
                            </p>
                        </div>

                        <button
                            onClick={() => copy(c.cmd)}
                            className="mt-6 w-full py-3 bg-text-main/5 hover:bg-text-main rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-text-main hover:text-bg-main flex items-center justify-center gap-2"
                        >
                            {copiedId === c.cmd ? <Check size={14} /> : <Copy size={14} />}
                            {copiedId === c.cmd ? 'Copiado!' : 'Copiar Comando'}
                        </button>
                    </div>
                ))}
            </div>

            <div className="p-4 sm:p-6 bg-text-main text-bg-main rounded-[24px] sm:rounded-[40px] flex items-center justify-between shadow-2xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-6 sm:p-8 opacity-10 rotate-12 group-hover:scale-110 transition-transform">
                    <GitBranch size={80} />
                </div>
                <div className="relative z-10 flex items-center gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-bg-main text-text-main rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                        <Info className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                        <h5 className="font-black text-xs sm:text-sm uppercase tracking-wider">Dica de mestre</h5>
                        <p className="text-[10px] sm:text-xs opacity-60 font-medium">Use <code className="bg-bg-main/20 px-1 rounded">git flow</code> para gerenciar branches profissionalmente.</p>
                    </div>
                </div>
                <ChevronRight size={24} className="opacity-20 hidden lg:block" />
            </div>
        </div>
    );
}
