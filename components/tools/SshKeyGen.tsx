import React, { useState } from 'react';
import { Key, Download, Copy, Check, RefreshCw, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SshKeyGen() {
    const [keyType, setKeyType] = useState<'RSA' | 'ECDSA'>('RSA');
    const [keys, setKeys] = useState<{ public: string; private: string } | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState<'pub' | 'priv' | null>(null);

    const generateKeys = async () => {
        setIsGenerating(true);
        setKeys(null);
        try {
            const algorithm = keyType === 'RSA'
                ? {
                    name: "RSASSA-PKCS1-v1_5",
                    modulusLength: 2048,
                    publicExponent: new Uint8Array([1, 0, 1]),
                    hash: "SHA-256",
                }
                : {
                    name: "ECDSA",
                    namedCurve: "P-256",
                };

            const keyPair = await window.crypto.subtle.generateKey(
                algorithm,
                true,
                ["sign", "verify"]
            );

            const pubExport = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
            const privExport = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

            const toPem = (buffer: ArrayBuffer, type: string) => {
                const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
                const lines = base64.match(/.{1,64}/g) || [];
                return `-----BEGIN ${type}-----\n${lines.join('\n')}\n-----END ${type}-----`;
            };

            setKeys({
                public: toPem(pubExport, "PUBLIC KEY"),
                private: toPem(privExport, "PRIVATE KEY")
            });
        } catch (e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = (text: string, id: 'pub' | 'priv') => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const downloadKey = (text: string, filename: string) => {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <div className="text-center">
                <div className="w-16 h-16 bg-text-main/5 rounded-2xl flex items-center justify-center text-text-main mx-auto mb-4">
                    <Key size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">SSH Key Generator</h3>
                <p className="text-text-main/50">Crie pares de chaves pública/privada de forma segura e offline.</p>
            </div>

            <div className="bg-bg-main p-6 rounded-[32px] border border-border-main space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex bg-text-main/5 p-1 rounded-xl flex-1 w-full">
                        {(['RSA', 'ECDSA'] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setKeyType(t)}
                                className={cn(
                                    "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
                                    keyType === t ? "bg-text-main text-bg-main shadow-md" : "opacity-50 hover:opacity-100"
                                )}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={generateKeys}
                        disabled={isGenerating}
                        className="w-full sm:w-auto px-8 py-3 bg-text-main text-bg-main rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all disabled:opacity-50"
                    >
                        {isGenerating ? <RefreshCw className="animate-spin" size={20} /> : <Shield size={20} />}
                        {isGenerating ? 'Gerando...' : 'Gerar Novo Par'}
                    </button>
                </div>

                {keys && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between px-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Chave Pública</span>
                                <div className="flex gap-2">
                                    <button onClick={() => downloadKey(keys.public, 'id_rsa.pub')} className="p-1.5 hover:bg-text-main/5 rounded-lg text-text-main/60"><Download size={16} /></button>
                                    <button onClick={() => copyToClipboard(keys.public, 'pub')} className="p-1.5 hover:bg-text-main/5 rounded-lg">
                                        {copied === 'pub' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                    </button>
                                </div>
                            </div>
                            <pre className="p-4 bg-[#0D0D0D] border border-border-main rounded-2xl text-[10px] font-mono overflow-auto h-48 whitespace-pre-wrap break-all">
                                {keys.public}
                            </pre>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between px-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 text-red-500">Chave Privada (SECRETA)</span>
                                <div className="flex gap-2">
                                    <button onClick={() => downloadKey(keys.private, 'id_rsa')} className="p-1.5 hover:bg-text-main/5 rounded-lg text-text-main/60"><Download size={16} /></button>
                                    <button onClick={() => copyToClipboard(keys.private, 'priv')} className="p-1.5 hover:bg-text-main/5 rounded-lg">
                                        {copied === 'priv' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                    </button>
                                </div>
                            </div>
                            <pre className="p-4 bg-[#0D0D0D] border border-border-main rounded-2xl text-[10px] font-mono overflow-auto h-48 whitespace-pre-wrap break-all">
                                {keys.private}
                            </pre>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-3xl">
                <h4 className="text-sm font-bold mb-2 uppercase tracking-wider text-red-500 flex items-center gap-2">
                    Aviso Crítico
                </h4>
                <p className="text-xs leading-relaxed opacity-60">
                    Nunca compartilhe sua **Chave Privada**. A chave pública é a que você adiciona ao GitHub, GitLab ou Servidor.
                    A chave privada deve permanecer apenas no seu computador.
                </p>
            </div>
        </div>
    );
}
