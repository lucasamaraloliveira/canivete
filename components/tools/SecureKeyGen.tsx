import React, { useState, useEffect } from 'react';
import { Key, RefreshCw, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SecureKeyGen() {
    const [keyLength, setKeyLength] = useState(32);
    const [format, setFormat] = useState<'hex' | 'base64' | 'raw'>('hex');
    const [generatedKey, setGeneratedKey] = useState('');
    const [copied, setCopied] = useState(false);

    const generateKey = () => {
        const array = new Uint8Array(keyLength);
        window.crypto.getRandomValues(array);

        let result = '';
        if (format === 'hex') {
            result = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
        } else if (format === 'base64') {
            result = btoa(String.fromCharCode(...array));
        } else {
            result = array.toString();
        }

        setGeneratedKey(result);
    };

    useEffect(() => {
        generateKey();
    }, [keyLength, format]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-2xl mx-auto flex flex-col gap-8 h-full justify-center">
            <div className="text-center">
                <div className="w-16 h-16 bg-text-main/5 rounded-2xl flex items-center justify-center text-text-main mx-auto mb-4">
                    <Key size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Secure Key Generator</h3>
                <p className="text-text-main/50">Gere chaves criptograficamente seguras para seus projetos.</p>
            </div>

            <div className="bg-bg-main p-6 rounded-3xl border border-border-main space-y-6">
                <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider opacity-40">Tamanho da Chave (Bytes)</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="8"
                                max="128"
                                step="8"
                                value={keyLength}
                                onChange={(e) => setKeyLength(parseInt(e.target.value))}
                                className="flex-1 accent-text-main"
                            />
                            <span className="font-mono font-bold w-12 text-center">{keyLength}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider opacity-40">Formato de Saída</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['hex', 'base64', 'raw'] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFormat(f)}
                                    className={cn(
                                        "py-2 rounded-xl text-sm font-bold transition-all border",
                                        format === f
                                            ? "bg-text-main text-bg-main border-text-main"
                                            : "bg-text-main/5 border-transparent hover:bg-text-main/10"
                                    )}
                                >
                                    {f.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative group">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider opacity-40">Chave Gerada</label>
                        <div className="bg-[#0D0D0D] p-4 rounded-2xl break-all font-mono text-sm border border-border-main min-h-[80px] flex items-center">
                            {generatedKey}
                        </div>
                    </div>
                    <div className="absolute top-8 right-2 flex gap-2">
                        <button
                            onClick={generateKey}
                            className="p-2 bg-text-main/10 hover:bg-text-main/20 rounded-lg transition-colors"
                            title="Regerar"
                        >
                            <RefreshCw size={18} />
                        </button>
                        <button
                            onClick={copyToClipboard}
                            className="p-2 bg-text-main text-bg-main rounded-lg transition-colors flex items-center gap-2"
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-text-main text-bg-main rounded-3xl">
                <h4 className="text-sm font-bold mb-2 uppercase tracking-wider opacity-40">Por que usar chaves seguras?</h4>
                <p className="text-sm leading-relaxed opacity-80">
                    Chaves geradas via `window.crypto` são adequadas para uso em criptografia (AES, HMAC) pois usam um gerador de números aleatórios de alta entropia, ao contrário de `Math.random()`.
                </p>
            </div>
        </div>
    );
}
