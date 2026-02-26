'use client';

import React, { useState, useMemo } from 'react';
import { ShieldAlert, Info, Copy, Check, Search, RotateCcw } from 'lucide-react';
import { CodeBlock } from '../CodeBlock';

export function LogAnonymizer() {
    const [logs, setLogs] = useState(`2024-02-25 16:30:44 [INFO] User login from IP: 192.168.1.1, email: lucas@example.com, phone: +55 (11) 99999-9999\n2024-02-25 16:32:10 [ERROR] Database connection failed for db_user_lucas and password123`);
    const [copied, setCopied] = useState(false);

    const anonymizedLogs = useMemo(() => {
        let result = logs;
        // Anonymize IPv4
        result = result.replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[IP_ANONIMIZADO]');
        // Anonymize Emails
        result = result.replace(/\b[\w.-]+@[\w.-]+\.\w{2,4}\b/g, '[EMAIL_ANONIMIZADO]');
        // Anonymize Phone numbers (generic pattern)
        result = result.replace(/\+?\(?\d{2}\)?\s?\d{4,5}-?\d{4}/g, '[TELEFONE_ANONIMIZADO]');
        // Anonymize Passwords (common log patterns like password=... or password: ...)
        result = result.replace(/(password|pass|senha|secret)[:=]\s?([^\s,]+)/gi, '$1=[PROTEGIDO]');

        return result;
    }, [logs]);

    const copy = () => {
        navigator.clipboard.writeText(anonymizedLogs);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider flex items-center gap-2">
                            <Search size={18} /> Logs Brutos
                        </label>
                        <button
                            onClick={() => setLogs('')}
                            className="p-2 hover:bg-text-main/5 rounded-xl text-text-main/40 hover:text-text-main transition-all"
                        >
                            <RotateCcw size={18} />
                        </button>
                    </div>
                    <textarea
                        value={logs}
                        onChange={(e) => setLogs(e.target.value)}
                        className="flex-1 p-6 font-mono text-xs bg-bg-main border border-border-main rounded-[32px] focus:ring-2 focus:ring-text-main/10 outline-none resize-none shadow-inner"
                        placeholder="Cole seus logs aqui..."
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider flex items-center gap-2">
                            <ShieldAlert size={18} /> Logs Anonimizados
                        </label>
                        {anonymizedLogs && (
                            <button
                                onClick={copy}
                                className="p-2 hover:bg-text-main/5 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
                            >
                                {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                                {copied ? 'Copiado!' : 'Copiar'}
                            </button>
                        )}
                    </div>
                    <div className="flex-1 relative group overflow-hidden rounded-[40px]">
                        <div className="absolute inset-0 bg-[#1e1e1e] overflow-auto custom-scrollbar shadow-2xl border border-border-main/5 grid">
                            <CodeBlock
                                code={anonymizedLogs || '// Os logs seguros aparecerão aqui...'}
                                language="log"
                                className="w-full"
                            />
                        </div>
                        <div className="absolute top-8 right-8 opacity-5">
                            <ShieldAlert size={120} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-red-500/5 rounded-[24px] flex items-center gap-4 text-red-600/60 text-xs italic border border-red-500/10">
                <Info size={16} className="shrink-0" />
                <p>Proteja seus dados sensíveis antes de compartilhar logs. Remove IPs, E-mails, Telefones e esconde senhas automaticamente via Regex no seu navegador.</p>
            </div>
        </div>
    );
}
