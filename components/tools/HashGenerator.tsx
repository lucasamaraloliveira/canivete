import React, { useState } from 'react';
import { Fingerprint, Copy, Check, FileCode } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HashGenerator() {
    const [inputText, setInputText] = useState('');
    const [hashes, setHashes] = useState({
        'SHA-1': '',
        'SHA-256': '',
        'SHA-512': '',
        'MD5': 'Protocolo legível indisponível via Web Crypto' // Web Crypto doesn't support MD5
    });
    const [copied, setCopied] = useState<string | null>(null);

    const generateHashes = async (text: string) => {
        if (!text) {
            setHashes({ 'SHA-1': '', 'SHA-256': '', 'SHA-512': '', 'MD5': '' });
            return;
        }

        const encoder = new TextEncoder();
        const data = encoder.encode(text);

        const hashBufferToHex = (buffer: ArrayBuffer) => {
            const hashArray = Array.from(new Uint8Array(buffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        };

        const sha1Promise = crypto.subtle.digest('SHA-1', data);
        const sha256Promise = crypto.subtle.digest('SHA-256', data);
        const sha512Promise = crypto.subtle.digest('SHA-512', data);

        const [sha1, sha256, sha512] = await Promise.all([
            sha1Promise, sha256Promise, sha512Promise
        ]);

        setHashes({
            'SHA-1': hashBufferToHex(sha1),
            'SHA-256': hashBufferToHex(sha256),
            'SHA-512': hashBufferToHex(sha512),
            'MD5': 'MD5 não é suportado nativamente pelo Web Crypto por ser inseguro.'
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setInputText(text);
        generateHashes(text);
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <div className="text-center">
                <div className="w-16 h-16 bg-text-main/5 rounded-2xl flex items-center justify-center text-text-main mx-auto mb-4">
                    <Fingerprint size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Hash Generator</h3>
                <p className="text-text-main/50">Gere hashes SHA criptográficos instantaneamente no navegador.</p>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-40">Texto de Entrada</label>
                    <textarea
                        value={inputText}
                        onChange={handleInputChange}
                        className="w-full p-4 h-32 font-mono text-sm bg-bg-main border border-border-main rounded-2xl focus:ring-2 focus:ring-text-main/10 outline-none resize-none"
                        placeholder="Digite ou cole o texto para gerar o hash..."
                    />
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {Object.entries(hashes).map(([algo, hash]) => (
                        <div key={algo} className="bg-bg-main p-4 rounded-2xl border border-border-main flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-text-main/40">{algo}</span>
                                {hash && !hash.includes('não é suportado') && (
                                    <button
                                        onClick={() => copyToClipboard(hash, algo)}
                                        className="p-1.5 hover:bg-text-main/5 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold"
                                    >
                                        {copied === algo ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                        {copied === algo ? 'Copiado' : 'Copiar'}
                                    </button>
                                )}
                            </div>
                            <div className={cn(
                                "font-mono text-sm break-all",
                                hash.includes('não é suportado') ? "opacity-30 italic" : "text-text-main/80"
                            )}>
                                {hash || <span className="opacity-20">Aguardando entrada...</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-6 bg-text-main/5 border border-border-main rounded-3xl">
                <h4 className="text-sm font-bold mb-2 uppercase tracking-wider text-text-main/60 flex items-center gap-2">
                    <FileCode size={16} /> Nota sobre MD5
                </h4>
                <p className="text-xs leading-relaxed opacity-60">
                    A API `crypto.subtle` nativa dos navegadores modernos não suporta MD5 por ser considerado criptograficamente vulnerável.
                    Use SHA-256 ou superior para garantir a integridade e segurança dos dados.
                </p>
            </div>
        </div>
    );
}
