'use client';

import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, FileText, Download, Globe, Mail, Building, RefreshCw, Send, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PrivacyGenerator() {
    const [formData, setFormData] = useState({
        siteName: 'Meu App Inc.',
        siteUrl: 'https://meuapp.com',
        contactEmail: 'privacidade@meuapp.com',
        companyName: 'Minha Empresa LTDA',
        location: 'São Paulo, Brasil',
        collectAnalytics: true,
        collectCookies: true,
        collectNewsletter: false
    });
    const [copied, setCopied] = useState(false);

    const generatePolicy = () => {
        const date = new Date().toLocaleDateString('pt-BR');
        return `
# Política de Privacidade - ${formData.siteName}

Última atualização: ${date}

Na ${formData.siteName}, operado por ${formData.companyName}, a privacidade de nossos visitantes é uma de nossas principais prioridades. Este documento de Política de Privacidade descreve os tipos de informações que são coletadas e registradas pela ${formData.siteName} e como as utilizamos.

## 1. Informações que Coletamos
Se você entrar em contato conosco diretamente, poderemos receber informações adicionais sobre você, como seu nome, endereço de e-mail (${formData.contactEmail}), número de telefone, o conteúdo da mensagem e/ou anexos que você nos enviar.

## 2. Como Usamos Suas Informações
Utilizamos as informações que coletamos de várias maneiras, incluindo:
* Fornecer, operar e manter nosso site;
* Melhorar, personalizar e expandir nosso site;
* Compreender e analisar como você usa nosso site ${formData.collectAnalytics ? '(Utilizamos ferramentas de Analytics)' : ''};
* Desenvolver novos produtos, serviços, recursos e funcionalidades.

${formData.collectCookies ? `## 3. Log Files e Cookies
A ${formData.siteName} segue um procedimento padrão de uso de arquivos de log. Estes arquivos registram os visitantes quando eles visitam websites. Todas as empresas de hospedagem fazem isso e uma parte da análise dos serviços de hospedagem.` : ''}

${formData.collectNewsletter ? `## 4. Newsletter e Marketing
Ao se cadastrar em nossa newsletter, você concorda em receber comunicações de marketing de nossa parte. Você pode cancelar a inscrição a qualquer momento através do link no rodapé de nossos emails.` : ''}

## 5. Seus Direitos de Privacidade (GDPR/LGPD)
Garantimos que você possa exercer seus direitos previstos na LGPD, incluindo o acesso, correção ou exclusão de seus dados pessoais sob nosso controle.

## 6. Contato
Se você tiver perguntas adicionais ou precisar de mais informações sobre nossa Política de Privacidade, não hesite em nos contatar através do e-mail: ${formData.contactEmail}.

Sediados em: ${formData.location}.
        `.trim();
    };

    const policy = generatePolicy();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(policy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
                <div className="flex flex-col gap-6">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Dados do Negócio</label>
                    <div className="bg-card-main border border-border-main p-8 rounded-[48px] shadow-2xl flex flex-col gap-6 custom-scrollbar overflow-auto">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black opacity-30 uppercase tracking-widest flex items-center gap-2"><Globe size={12} /> Nome do Site</label>
                                    <input
                                        value={formData.siteName}
                                        onChange={e => setFormData({ ...formData, siteName: e.target.value })}
                                        className="w-full bg-text-main/5 border border-border-main/10 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-text-main/5 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black opacity-30 uppercase tracking-widest flex items-center gap-2"><Building size={12} /> Razão Social</label>
                                    <input
                                        value={formData.companyName}
                                        onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                                        className="w-full bg-text-main/5 border border-border-main/10 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-text-main/5 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black opacity-30 uppercase tracking-widest flex items-center gap-2"><Mail size={12} /> Email de Contato</label>
                                <input
                                    value={formData.contactEmail}
                                    onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                                    className="w-full bg-text-main/5 border border-border-main/10 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-text-main/5 transition-all"
                                />
                            </div>

                            <div className="space-y-4 pt-4 border-t border-border-main/5">
                                <label className="text-[10px] font-black opacity-30 uppercase tracking-widest">Recursos Ativos</label>
                                <div className="space-y-3">
                                    {[
                                        { id: 'collectAnalytics', label: 'Coleta de Analytics (Google, etc)' },
                                        { id: 'collectCookies', label: 'Uso de Cookies de Sessão' },
                                        { id: 'collectNewsletter', label: 'Marketing via Newsletter' }
                                    ].map(feature => (
                                        <button
                                            key={feature.id}
                                            onClick={() => setFormData({ ...formData, [feature.id]: !formData[feature.id as keyof typeof formData] })}
                                            className={cn(
                                                "w-full flex items-center justify-between p-4 rounded-2xl border transition-all",
                                                formData[feature.id as keyof typeof formData]
                                                    ? "bg-text-main/5 border-text-main/20"
                                                    : "bg-transparent border-border-main/5 opacity-40 grayscale"
                                            )}
                                        >
                                            <span className="text-xs font-bold uppercase tracking-wider">{feature.label}</span>
                                            <div className={cn(
                                                "w-5 h-5 rounded-full flex items-center justify-center transition-all",
                                                formData[feature.id as keyof typeof formData] ? "bg-text-main text-bg-main" : "bg-text-main/10 text-white"
                                            )}>
                                                {formData[feature.id as keyof typeof formData] && <CheckCircle2 size={12} />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Draft Gerado (Markdown)</label>
                        <button
                            onClick={copyToClipboard}
                            className="bg-text-main text-bg-main px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copiado' : 'Copiar LGPD'}
                        </button>
                    </div>

                    <div className="flex-1 bg-card-main border border-border-main rounded-[48px] shadow-2xl overflow-hidden relative group">
                        <div className="absolute inset-0 p-10 text-sm font-mono leading-relaxed opacity-60 overflow-auto custom-scrollbar whitespace-pre-wrap select-all">
                            {policy}
                        </div>
                        <div className="absolute bottom-8 right-8 pointer-events-none opacity-5">
                            <ShieldCheck size={120} />
                        </div>
                    </div>

                    <div className="p-8 bg-green-500/5 border border-green-500/10 rounded-[40px] flex gap-4">
                        <div className="w-10 h-10 bg-card-main border border-green-500/10 text-green-500 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                            <ShieldCheck size={20} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-green-600/70">Aviso Legal</h4>
                            <p className="text-[10px] font-medium opacity-40 uppercase leading-relaxed tracking-wider">
                                Este rascunho é um ponto de partida para conformidade com a LGPD. Recomendamos a revisão por um advogado especializado.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
