'use client';

import React, { useState } from 'react';
import { Map, Plus, Trash2, Download, Copy, Check, ExternalLink } from 'lucide-react';

interface SitemapURL {
    url: string;
    changefreq: string;
    priority: string;
}

export function SitemapGenerator() {
    const [urls, setUrls] = useState<SitemapURL[]>([
        { url: 'https://exemplo.com/', changefreq: 'daily', priority: '1.0' },
        { url: 'https://exemplo.com/sobre', changefreq: 'monthly', priority: '0.8' },
    ]);
    const [copied, setCopied] = useState(false);

    const addUrl = () => {
        setUrls([...urls, { url: '', changefreq: 'weekly', priority: '0.5' }]);
    };

    const updateUrl = (index: number, field: keyof SitemapURL, value: string) => {
        const newUrls = [...urls];
        newUrls[index] = { ...newUrls[index], [field]: value };
        setUrls(newUrls);
    };

    const removeUrl = (index: number) => {
        setUrls(urls.filter((_, i) => i !== index));
    };

    const generateSitemap = () => {
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
        urls.filter(u => u.url).forEach(u => {
            xml += `  <url>\n`;
            xml += `    <loc>${u.url}</loc>\n`;
            xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
            xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
            xml += `    <priority>${u.priority}</priority>\n`;
            xml += `  </url>\n`;
        });
        xml += `</urlset>`;
        return xml;
    };

    const downloadSitemap = () => {
        const blob = new Blob([generateSitemap()], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sitemap.xml';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            <div className="flex flex-col gap-6 overflow-hidden">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">URLs do Sitemap</label>
                </div>

                <div className="flex-1 overflow-auto pr-2 space-y-4">
                    {urls.map((u, i) => (
                        <div key={i} className="bg-card-main border border-border-main p-4 rounded-3xl shadow-sm relative group">
                            <button
                                onClick={() => removeUrl(i)}
                                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                            >
                                <Trash2 size={14} />
                            </button>

                            <div className="flex flex-col gap-3">
                                <input
                                    value={u.url}
                                    onChange={(e) => updateUrl(i, 'url', e.target.value)}
                                    className="w-full p-3 bg-bg-main border border-border-main rounded-xl text-sm font-bold focus:ring-2 focus:ring-text-main/10 outline-none"
                                    placeholder="https://sua-url.com"
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <select
                                        value={u.changefreq}
                                        onChange={(e) => updateUrl(i, 'changefreq', e.target.value)}
                                        className="p-2 bg-text-main/5 border border-border-main rounded-lg text-xs font-bold outline-none"
                                    >
                                        <option value="always">Sempre</option>
                                        <option value="hourly">Por Hora</option>
                                        <option value="daily">Diário</option>
                                        <option value="weekly">Semanal</option>
                                        <option value="monthly">Mensal</option>
                                    </select>
                                    <select
                                        value={u.priority}
                                        onChange={(e) => updateUrl(i, 'priority', e.target.value)}
                                        className="p-2 bg-text-main/5 border border-border-main rounded-lg text-xs font-bold outline-none"
                                    >
                                        <option value="1.0">1.0 (Principal)</option>
                                        <option value="0.8">0.8 (Importante)</option>
                                        <option value="0.5">0.5 (Normal)</option>
                                        <option value="0.3">0.3 (Secundário)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={addUrl}
                        className="w-full py-4 border-2 border-dashed border-border-main rounded-3xl text-text-main/30 hover:text-text-main/60 hover:bg-text-main/5 transition-all flex items-center justify-center gap-2 font-bold text-sm"
                    >
                        <Plus size={20} /> Adicionar URL
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Resultado XML</label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => { navigator.clipboard.writeText(generateSitemap()); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                            className="p-3 bg-card-main border border-border-main rounded-2xl hover:bg-text-main/5 transition-all flex items-center gap-2 text-xs font-bold"
                        >
                            {copied ? <Check size={16} className="text-green-600" /> : <Copy size={14} />}
                            {copied ? 'Copiado' : 'Copiar'}
                        </button>
                        <button
                            onClick={downloadSitemap}
                            className="p-3 bg-text-main text-bg-main rounded-2xl hover:opacity-90 transition-all flex items-center gap-2 text-xs font-bold shadow-lg"
                        >
                            <Download size={14} /> Download XML
                        </button>
                    </div>
                </div>
                <div className="flex-1 bg-text-main text-bg-main p-8 font-mono text-xs rounded-[40px] overflow-auto shadow-2xl border border-border-main/5 relative custom-scrollbar">
                    <pre className="whitespace-pre">
                        {generateSitemap()}
                    </pre>
                    <div className="absolute top-8 right-8 opacity-5">
                        <Map size={100} />
                    </div>
                </div>
            </div>
        </div>
    );
}
