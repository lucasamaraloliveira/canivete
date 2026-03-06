"use client";

import React, { useState, useMemo } from 'react';
import { FolderTree, Folder, File, Copy, Check, Info, Trash2, ArrowUpRight, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

import { CodeBlock } from '../CodeBlock';

export function DirectoryTree() {
    const [input, setInput] = useState('src\n  components\n    Button.tsx\n    Input.tsx\n  pages\n    index.tsx\n    about.tsx\n  utils\n    index.ts');
    const [copied, setCopied] = useState(false);

    const parseTree = (text: string) => {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const treeLines: string[] = [];

        lines.forEach((line, index) => {
            const indent = line.search(/\S/);
            const content = line.trim();
            const isLast = index === lines.length - 1;

            // Simplified tree logic for visual generator
            if (indent === 0) {
                treeLines.push(content);
            } else {
                const prefix = '  '.repeat(indent / 2 - 1) + (isLast ? '└── ' : '├── ');
                treeLines.push(prefix + content);
            }
        });

        return treeLines.join('\n');
    };

    const treeOutput = useMemo(() => {
        const lines = input.split('\n').filter(line => line.trim());
        if (lines.length === 0) return '';

        const nodes: any[] = [];
        const stack: any[] = [{ level: -1, children: nodes }];

        lines.forEach(line => {
            const indent = line.search(/\S/);
            const name = line.trim();
            const node = { name, level: indent, children: [] };

            while (stack.length > 1 && stack[stack.length - 1].level >= indent) {
                stack.pop();
            }

            stack[stack.length - 1].children.push(node);
            stack.push(node);
        });

        const renderNode = (node: any, isLast: boolean, prefix: string): string => {
            const connector = isLast ? '└── ' : '├── ';
            const res = prefix + connector + node.name + '\n';
            const childPrefix = prefix + (isLast ? '    ' : '│   ');

            return res + node.children.map((child: any, idx: number) =>
                renderNode(child, idx === node.children.length - 1, childPrefix)
            ).join('');
        };

        return nodes.map((node, idx) =>
            renderNode(node, idx === nodes.length - 1, '')
        ).join('');
    }, [input]);

    const handleCopy = () => {
        navigator.clipboard.writeText(treeOutput);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8 h-full flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
                {/* Input Area */}
                <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2 px-2">
                        <FolderTree size={14} /> Estrutura de Pastas (Use Indentação)
                    </label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 bg-text-main/5 border border-border-main rounded-[32px] p-8 font-mono text-sm resize-none outline-none focus:ring-2 focus:ring-text-main/10 transition-all shadow-inner custom-scrollbar"
                        placeholder="src&#10;  components&#10;    Button.tsx"
                    />
                </div>

                {/* Output Area */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                            <Search size={14} /> Árvore Gerada
                        </label>
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 px-4 py-2 bg-text-main text-bg-main rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? 'Copiado!' : 'Copiar Árvore'}
                        </button>
                    </div>
                    <div className="flex-1 bg-[#0D0D0D] border border-border-main/5 rounded-[40px] overflow-hidden relative group shadow-2xl">
                        <div className="h-full overflow-auto scrollbar-hide">
                            {treeOutput ? (
                                <CodeBlock code={treeOutput} language="text" />
                            ) : (
                                <div className="h-full flex items-center justify-center opacity-10 italic">
                                    <p className="font-bold">A árvore aparecerá aqui...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hint Section */}
            <div className="p-8 bg-text-main text-bg-main rounded-[40px] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-5 transition-opacity" />
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-14 h-14 bg-bg-main text-text-main rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-all">
                        <FolderTree size={28} />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg leading-tight">Documentação Master</h4>
                        <p className="text-xs opacity-60 italic leading-snug">
                            Perfeito para README.md e documentação técnica. Gere estruturas visuais em segundos.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1 relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[3px] opacity-40 leading-tight">Organize seu</p>
                    <p className="text-3xl font-black leading-tight italic tracking-tighter uppercase">Projeto</p>
                </div>
            </div>
        </div>
    );
}
