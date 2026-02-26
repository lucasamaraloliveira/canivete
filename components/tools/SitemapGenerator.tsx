'use client';

import React, { useState } from 'react';
import { Map, Plus, Trash2, Download, Copy, Check, ExternalLink, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '../CodeBlock';

interface SitemapURL {
    url: string;
    changefreq: string;
    priority: string;
}

function CustomSelect({
    value,
    onChange,
    options
}: {
    value: string;
    onChange: (val: string) => void;
    options: { label: string; value: string }[]
}) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedLabel = options.find(o => o.value === value)?.label || value;

    return (
        <div className="relative group/select">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full p-3 bg-bg-main border border-border-main rounded-xl text-[10px] font-black uppercase tracking-widest outline-none flex items-center justify-between transition-all hover:bg-text-main/5",
                    isOpen && "ring-2 ring-text-main/10 border-text-main/20"
                )}
            >
                <span className="truncate pr-2">{selectedLabel}</span>
                <ChevronDown size={14} className={cn("shrink-0 opacity-30 group-hover/select:opacity-100 transition-all", isOpen && "rotate-180 opacity-100")} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-card-main/90 backdrop-blur-xl border border-border-main rounded-2xl shadow-2xl z-20 overflow-hidden py-2"
                        >
                            {options.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest transition-all relative overflow-hidden",
                                        value === opt.value
                                            ? "bg-text-main text-bg-main"
                                            : "text-text-main/60 hover:bg-text-main/5 hover:text-text-main hover:pl-6"
                                    )}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
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
        setUrls(urls.filter((_: SitemapURL, i: number) => i !== index));
    };

    const generateSitemap = () => {
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
        urls.filter((u: SitemapURL) => u.url).forEach((u: SitemapURL) => {
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
                    {urls.map((u: SitemapURL, i: number) => (
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
                                    <CustomSelect
                                        value={u.changefreq}
                                        onChange={(val) => updateUrl(i, 'changefreq', val)}
                                        options={[
                                            { label: 'Sempre', value: 'always' },
                                            { label: 'Por Hora', value: 'hourly' },
                                            { label: 'Diário', value: 'daily' },
                                            { label: 'Semanal', value: 'weekly' },
                                            { label: 'Mensal', value: 'monthly' },
                                        ]}
                                    />
                                    <CustomSelect
                                        value={u.priority}
                                        onChange={(val) => updateUrl(i, 'priority', val)}
                                        options={[
                                            { label: '1.0 (Principal)', value: '1.0' },
                                            { label: '0.8 (Importante)', value: '0.8' },
                                            { label: '0.5 (Normal)', value: '0.5' },
                                            { label: '0.3 (Secundário)', value: '0.3' },
                                        ]}
                                    />
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
                <div className="flex-1 bg-text-main rounded-[40px] overflow-auto shadow-2xl border border-border-main/5 relative scrollbar-hide">
                    <CodeBlock code={generateSitemap()} language="xml" />
                    <div className="absolute top-8 right-8 opacity-5 pointer-events-none">
                        <Map size={100} />
                    </div>
                </div>
            </div>
        </div>
    );
}
