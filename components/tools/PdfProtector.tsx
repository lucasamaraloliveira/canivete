'use client';

import React, { useState } from 'react';
import { FileUp, LockKeyhole, Trash2, CheckCircle2, RefreshCw, ShieldCheck, Download, Key, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PdfProtector() {
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f && f.type === 'application/pdf') {
            setFile(f);
            setDone(false);
            setError(null);
        }
    };

    const runProtect = async () => {
        if (!file || !password) return;
        setProcessing(true);
        setError(null);

        try {
            // Carregamento dinâmico ignorando o bundler para evitar erro de 'fs'
            const qpdfModuleName = '/wasm/qpdf.js';
            const initQpdf = (await import(/* webpackIgnore: true */ qpdfModuleName)).default;

            const Module = await initQpdf({
                locateFile: (path: string) => {
                    if (path.endsWith('.wasm')) {
                        return '/wasm/qpdf.wasm';
                    }
                    return path;
                }
            } as any);

            const arrayBuffer = await file.arrayBuffer();
            const inputData = new Uint8Array(arrayBuffer);

            // Grava o arquivo no sistema de arquivos virtual do WASM
            (Module as any).FS.writeFile('input.pdf', inputData);

            // Executa o comando qpdf para criptografar
            // Argumentos: input.pdf --encrypt user_pw owner_pw 256 -- output.pdf
            // Usamos a mesma senha para usuário e dono para simplicidade, permitindo abertura direta
            (Module as any).callMain([
                'input.pdf',
                '--encrypt', password, password, '256',
                '--',
                'output.pdf'
            ]);

            // Lê o resultado do sistema de arquivos virtual
            const outputData = (Module as any).FS.readFile('output.pdf');

            // Cria o blob e faz o download
            const blob = new Blob([outputData as any], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${file.name.replace('.pdf', '')}_protegido.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setDone(true);
        } catch (err: any) {
            console.error('Erro no QPDF:', err);
            setError('Erro ao processar a criptografia. Verifique se o arquivo é válido.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">Proteger PDF</h2>
                    <p className="opacity-40 text-sm font-medium">Adicione senhas e restrinja o acesso aos seus documentos.</p>
                </div>
                <div className="flex items-center gap-3 px-6 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                    <ShieldCheck size={16} className="text-green-500" />
                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest leading-none">Privacidade Total</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className={cn(
                        "flex-1 bg-card-main border-4 border-dashed border-border-main/20 rounded-[48px] overflow-hidden flex flex-col items-center justify-center p-12 relative group transition-all hover:border-text-main/20",
                        file && "justify-start p-8"
                    )}>
                        {!file ? (
                            <>
                                <div className="w-24 h-24 bg-text-main/5 rounded-[32px] flex items-center justify-center mb-8 group-hover:scale-110 transition-all">
                                    <LockKeyhole size={48} className="opacity-20" />
                                </div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Selecione o PDF</h3>
                                <p className="text-[10px] font-bold opacity-30 uppercase tracking-[3px] mb-8 text-center">Defina uma senha mestre para bloquear o documento</p>
                                <input
                                    type="file" accept=".pdf" onChange={handleFile}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <div className="px-8 py-3 bg-text-main text-bg-main rounded-2xl font-black uppercase tracking-widest shadow-xl">
                                    Procurar Arquivo
                                </div>
                            </>
                        ) : (
                            <div className="w-full flex flex-col gap-8 animate-in zoom-in-95 duration-300">
                                <div className="flex items-center gap-6 bg-text-main/5 p-6 rounded-3xl shrink-0">
                                    <div className="w-16 h-16 bg-blue-500 text-white rounded-2xl flex items-center justify-center shrink-0">
                                        <LockKeyhole size={32} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-lg font-black uppercase tracking-tight truncate">{file.name}</h4>
                                        <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Aguardando definição de senha</p>
                                    </div>
                                    <button onClick={() => setFile(null)} className="p-2 hover:bg-red-500/10 text-red-500 rounded-xl"><Trash2 size={20} /></button>
                                </div>

                                <div className="space-y-4">
                                    <div className="relative">
                                        <label className="text-[10px] font-black uppercase tracking-[3px] opacity-30 ml-2">Nova Senha de Proteção</label>
                                        <div className="relative mt-2">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Crie uma senha forte..."
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-bg-main/50 border-2 border-border-main/10 rounded-[24px] py-4 px-6 pr-14 text-sm font-bold placeholder:opacity-20 outline-none focus:border-text-main/20 transition-all"
                                            />
                                            <button
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-5 top-1/2 -translate-y-1/2 text-text-main/30 hover:text-text-main transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                    {!done ? (
                                        <button
                                            onClick={runProtect}
                                            disabled={processing || !password}
                                            className={cn(
                                                "w-full py-5 bg-text-main text-bg-main rounded-[24px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3",
                                                (processing || !password) && "opacity-50 cursor-wait"
                                            )}
                                        >
                                            {processing ? <RefreshCw size={24} className="animate-spin" /> : <><ShieldCheck size={24} /> Aplicar Proteção</>}
                                        </button>
                                    ) : (
                                        <div className="flex flex-col items-center gap-4 w-full">
                                            <div className="flex items-center gap-3 text-green-500 mb-4 scale-in text-center">
                                                <CheckCircle2 size={24} />
                                                <span className="text-sm font-black uppercase tracking-widest">PDF Protegido com Sucesso!</span>
                                            </div>
                                            <button
                                                onClick={() => { setDone(false); setPassword(''); }}
                                                className="text-[10px] font-black opacity-30 hover:opacity-100 uppercase tracking-widest"
                                            >
                                                Proteger Outro
                                            </button>
                                        </div>
                                    )}

                                    {error && (
                                        <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-3 text-blue-600/60">
                                            <AlertCircle size={20} className="shrink-0" />
                                            <p className="text-[10px] font-bold uppercase tracking-wider leading-relaxed">{error}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Segurança</label>
                    <div className="bg-card-main border border-border-main p-8 rounded-[40px] shadow-sm flex flex-col gap-6">
                        {[
                            { title: 'Criptografia Forte', desc: 'Utilizamos o padrão industrial AES-256 para garantir que ninguém abra seu arquivo sem a senha.' },
                            { title: 'Privacidade de Senhas', desc: 'Suas senhas nunca são enviadas ao servidor ou armazenadas em logs.' },
                            { title: 'Processamento Local', desc: 'Tudo ocorre diretamente no seu dispositivo, sem upload de arquivos.' }
                        ].map((item, i) => (
                            <div key={i} className="space-y-2">
                                <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-text-main" />
                                    {item.title}
                                </h4>
                                <p className="text-[10px] font-medium opacity-30 uppercase leading-relaxed tracking-wider ml-3 italic">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
