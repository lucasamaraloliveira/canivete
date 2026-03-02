import React, { useState } from 'react';
import { FileCheck, Search, Copy, Check, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CsrDecoder() {
    const [csr, setCsr] = useState('');
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState('');

    const decodeCsr = () => {
        setError('');
        setData(null);

        const cleanCsr = csr
            .replace(/-----BEGIN CERTIFICATE REQUEST-----/, '')
            .replace(/-----END CERTIFICATE REQUEST-----/, '')
            .replace(/\s/g, '');

        try {
            const decoded = atob(cleanCsr);
            // In a real app we'd use a full ASN.1 parser like @fidm/asn1 or pkijs
            // For this "Canivete" we'll show the raw info and basic structure validation
            setData({
                length: decoded.length,
                base64Length: cleanCsr.length,
                header: csr.includes('BEGIN CERTIFICATE REQUEST'),
            });
        } catch (e) {
            setError('CSR inválido. Verifique se copiou o conteúdo completo, incluindo os cabeçalhos BEGIN/END.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <div className="text-center">
                <div className="w-16 h-16 bg-text-main/5 rounded-2xl flex items-center justify-center text-text-main mx-auto mb-4">
                    <FileCheck size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">CSR Decoder</h3>
                <p className="text-text-main/50">Visualize informações básicas de Certificate Signing Requests (CSR).</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider opacity-40">Cole seu CSR (PEM format)</label>
                        <textarea
                            value={csr}
                            onChange={(e) => setCsr(e.target.value)}
                            className="w-full p-4 h-64 font-mono text-[10px] bg-bg-main border border-border-main rounded-2xl focus:ring-2 focus:ring-text-main/10 outline-none resize-none"
                            placeholder="-----BEGIN CERTIFICATE REQUEST-----&#10;...&#10;-----END CERTIFICATE REQUEST-----"
                        />
                    </div>
                    <button
                        onClick={decodeCsr}
                        className="w-full py-4 bg-text-main text-bg-main rounded-2xl font-bold flex items-center justify-center gap-2"
                    >
                        <Search size={20} /> Decodificar CSR
                    </button>
                    {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
                </div>

                <div className="space-y-6">
                    <div className="bg-text-main/5 border border-border-main rounded-[32px] p-6 min-h-[300px]">
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-30 mb-6">Informações Extraídas</p>

                        {data ? (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-bg-main rounded-2xl border border-border-main">
                                        <p className="text-[10px] font-bold opacity-30 uppercase">Status</p>
                                        <p className="font-bold text-green-500 text-sm">Válido (Base64)</p>
                                    </div>
                                    <div className="p-4 bg-bg-main rounded-2xl border border-border-main">
                                        <p className="text-[10px] font-bold opacity-30 uppercase">Codificação</p>
                                        <p className="font-bold text-sm">PKCS#10 (PEM)</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold opacity-40 uppercase">Metadados Brutos</h4>
                                    <div className="font-mono text-[11px] space-y-1 opacity-80">
                                        <p>Tamanho do Blob: {data.length} bytes</p>
                                        <p>Tamanho Base64: {data.base64Length} chars</p>
                                        <p>Cabeçalhos PEM: {data.header ? 'Presentes' : 'Ausentes'}</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-600">
                                    <p className="text-xs leading-relaxed">
                                        <Info size={14} className="inline mr-1 mb-0.5" />
                                        Em versões futuras, adicionaremos suporte a parsing ASN.1 completo para extrair Common Name, Organização e Chave Pública.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-10 text-center">
                                <FileCheck size={64} className="mb-4" />
                                <p className="font-bold">Aguardando dados...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
