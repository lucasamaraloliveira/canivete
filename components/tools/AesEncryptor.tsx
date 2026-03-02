import React, { useState } from 'react';
import { Lock, Unlock, Copy, Check, ShieldCheck, Key } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AesEncryptor() {
    const [text, setText] = useState('');
    const [password, setPassword] = useState('');
    const [result, setResult] = useState('');
    const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const deriveKey = async (pw: string, salt: Uint8Array) => {
        const encoder = new TextEncoder();
        const pwKey = await crypto.subtle.importKey(
            'raw',
            encoder.encode(pw),
            'PBKDF2',
            false,
            ['deriveKey']
        );
        return crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt as any,
                iterations: 100000,
                hash: 'SHA-256',
            },
            pwKey,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    };

    const handleProcess = async () => {
        setError('');
        setResult('');

        if (!text || !password) {
            setError('Texto e senha são obrigatórios.');
            return;
        }

        try {
            if (mode === 'encrypt') {
                const salt = crypto.getRandomValues(new Uint8Array(16));
                const iv = crypto.getRandomValues(new Uint8Array(12));
                const key = await deriveKey(password, salt);

                const encoder = new TextEncoder();
                const encrypted = await crypto.subtle.encrypt(
                    { name: 'AES-GCM', iv },
                    key,
                    encoder.encode(text)
                );

                // Package: salt (16) + iv (12) + ciphertext
                const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
                combined.set(salt, 0);
                combined.set(iv, salt.length);
                combined.set(new Uint8Array(encrypted), salt.length + iv.length);

                // Convert to base64
                setResult(btoa(String.fromCharCode(...combined)));
            } else {
                const data = new Uint8Array(
                    atob(text).split('').map(c => c.charCodeAt(0))
                );

                const salt = data.slice(0, 16);
                const iv = data.slice(16, 16 + 12);
                const encrypted = data.slice(16 + 12);

                const key = await deriveKey(password, salt);
                const decrypted = await crypto.subtle.decrypt(
                    { name: 'AES-GCM', iv },
                    key,
                    encrypted
                );

                const decoder = new TextDecoder();
                setResult(decoder.decode(decrypted));
            }
        } catch (err) {
            setError('Falha no processamento. Verifique se a senha ou o código criptografado estão corretos.');
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <div className="text-center">
                <div className="w-16 h-16 bg-text-main/5 rounded-2xl flex items-center justify-center text-text-main mx-auto mb-4">
                    <ShieldCheck size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">AES-256 Encryptor</h3>
                <p className="text-text-main/50">Criptografia de grau militar (AES-GCM) processada 100% no seu navegador.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="flex bg-text-main/5 p-1 rounded-2xl">
                        <button
                            onClick={() => { setMode('encrypt'); setResult(''); setError(''); }}
                            className={cn(
                                "flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
                                mode === 'encrypt' ? "bg-text-main text-bg-main shadow-lg" : "opacity-50 hover:opacity-100"
                            )}
                        >
                            <Lock size={16} /> Criptografar
                        </button>
                        <button
                            onClick={() => { setMode('decrypt'); setResult(''); setError(''); }}
                            className={cn(
                                "flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
                                mode === 'decrypt' ? "bg-text-main text-bg-main shadow-lg" : "opacity-50 hover:opacity-100"
                            )}
                        >
                            <Unlock size={16} /> Descriptografar
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider opacity-40">
                                {mode === 'encrypt' ? 'Texto Original' : 'Código Criptografado (Base64)'}
                            </label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full p-4 h-32 font-mono text-sm bg-bg-main border border-border-main rounded-2xl focus:ring-2 focus:ring-text-main/10 outline-none resize-none"
                                placeholder={mode === 'encrypt' ? "Digite a mensagem secreta..." : "Cole o código base64 aqui..."}
                            />
                        </div>

                        <div className="flex flex-col gap-2 relative">
                            <label className="text-xs font-bold uppercase tracking-wider opacity-40">Chave de Segurança / Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-4 pl-12 font-mono text-sm bg-bg-main border border-border-main rounded-2xl focus:ring-2 focus:ring-text-main/10 outline-none"
                                    placeholder="Defina uma senha forte..."
                                />
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-text-main/20" size={18} />
                            </div>
                        </div>

                        <button
                            onClick={handleProcess}
                            className="w-full py-4 bg-text-main text-bg-main rounded-2xl font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            {mode === 'encrypt' ? 'Gerar Código Protegido' : 'Revelar Mensagem'}
                        </button>

                        {error && (
                            <p className="text-sm text-red-500 font-medium text-center">{error}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex-1 bg-text-main/5 border border-border-main rounded-[32px] p-6 lg:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                        {result ? (
                            <div className="w-full h-full flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-bold uppercase tracking-widest opacity-40">Resultado</span>
                                    <button
                                        onClick={copyToClipboard}
                                        className="p-2 bg-text-main text-bg-main rounded-xl flex items-center gap-2 text-xs font-bold"
                                    >
                                        {copied ? <Check size={16} /> : <Copy size={16} />}
                                        {copied ? 'Copiado' : 'Copiar'}
                                    </button>
                                </div>
                                <div className="flex-1 bg-[#0D0D0D] p-6 rounded-2xl font-mono text-sm break-all overflow-y-auto text-left">
                                    {result}
                                </div>
                            </div>
                        ) : (
                            <div className="opacity-20 flex flex-col items-center">
                                {mode === 'encrypt' ? <Lock size={64} className="mb-4" /> : <Unlock size={64} className="mb-4" />}
                                <p className="font-bold">Aguardando processamento</p>
                                <p className="text-xs">O resultado aparecerá aqui</p>
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-3xl text-sm">
                        <p className="font-bold mb-1">Aviso de Segurança</p>
                        <p className="opacity-70 leading-relaxed text-xs">
                            O Canivete Suíço não armazena suas chaves ou dados. Todo o processo acontece localmente.
                            Se você perder a senha usada para criptografar, **não há como recuperar os dados**.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
