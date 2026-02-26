'use client';

import React, { useState, useEffect } from 'react';
import { Code, Copy, Check, Info, FileCode, RotateCcw } from 'lucide-react';
import { CodeBlock } from '../CodeBlock';

export function SvgToJsx() {
    const [svg, setSvg] = useState(`<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="2" />\n</svg>`);
    const [jsx, setJsx] = useState('');
    const [copied, setCopied] = useState(false);

    const convertToJsx = (input: string) => {
        try {
            // 1. Remove XML declarations and comments
            let clean = input.replace(/<\?xml.*?\?>/g, '').replace(/<!--.*?-->/g, '').trim();

            // 2. Convert kebab-case attributes to camelCase
            const kebabAttributes = [
                'accent-height', 'alignment-baseline', 'arabic-form', 'baseline-shift', 'cap-height',
                'clip-path', 'clip-rule', 'color-interpolation', 'color-interpolation-filters',
                'color-profile', 'color-rendering', 'dominant-baseline', 'enable-background',
                'fill-opacity', 'fill-rule', 'flood-color', 'flood-opacity', 'font-family',
                'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant',
                'font-weight', 'glyph-name', 'glyph-orientation-horizontal', 'glyph-orientation-vertical',
                'horiz-adv-x', 'horiz-origin-x', 'image-rendering', 'letter-spacing', 'lighting-color',
                'marker-end', 'marker-mid', 'marker-start', 'overline-position', 'overline-thickness',
                'paint-order', 'panose-1', 'pointer-events', 'rendering-intent', 'shape-rendering',
                'stop-color', 'stop-opacity', 'strikethrough-position', 'strikethrough-thickness',
                'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin',
                'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'text-anchor', 'text-decoration',
                'text-rendering', 'underline-position', 'underline-thickness', 'unicode-bidi',
                'unicode-range', 'units-per-em', 'v-alphabetic', 'v-hanging', 'v-ideographic',
                'v-mathematical', 'vector-effect', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y',
                'word-spacing', 'writing-mode', 'x-height'
            ];

            kebabAttributes.forEach(attr => {
                const camel = attr.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                const regex = new RegExp(attr + '=', 'g');
                clean = clean.replace(regex, camel + '=');
            });

            // 3. Convert class to className
            clean = clean.replace(/class=/g, 'className=');

            // 4. Wrap in component structure
            const component = `export const MyIcon = (props) => (\n  ${clean.split('\n').join('\n  ')}\n);`;

            setJsx(component);
        } catch (e) {
            setJsx('// Erro ao processar SVG');
        }
    };

    useEffect(() => {
        if (svg) convertToJsx(svg);
        else setJsx('');
    }, [svg]);

    const copy = () => {
        navigator.clipboard.writeText(jsx);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider flex items-center gap-2">
                            <FileCode size={18} /> Código SVG
                        </label>
                        <button
                            onClick={() => setSvg('')}
                            className="p-2 hover:bg-text-main/5 rounded-xl text-text-main/40 hover:text-text-main transition-all"
                        >
                            <RotateCcw size={18} />
                        </button>
                    </div>
                    <textarea
                        value={svg}
                        onChange={(e) => setSvg(e.target.value)}
                        className="flex-1 p-6 font-mono text-xs bg-bg-main border border-border-main rounded-[32px] focus:ring-2 focus:ring-text-main/10 outline-none resize-none shadow-inner"
                        placeholder="Cole seu <svg> aqui..."
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider flex items-center gap-2">
                            <Code size={18} /> Componente JSX
                        </label>
                        {jsx && (
                            <button
                                onClick={copy}
                                className="p-2 hover:bg-text-main/5 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
                            >
                                {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                                {copied ? 'Copiado!' : 'Copiar JSX'}
                            </button>
                        )}
                    </div>
                    <div className="flex-1 relative group">
                        <div className="absolute inset-0 bg-text-main rounded-[40px] overflow-auto shadow-2xl border border-border-main/5 scrollbar-hide">
                            <CodeBlock
                                code={jsx || '// O componente JSX aparecerá aqui...'}
                                language="jsx"
                            />
                        </div>
                        <div className="absolute top-8 right-8 opacity-5">
                            <Code size={120} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-text-main/5 rounded-[24px] flex items-center gap-4 text-text-main/60 text-xs italic border border-border-main/5">
                <Info size={16} className="shrink-0" />
                <p>Converte automaticamente tags SVG para o formato de componentes React (JSX), tratando atributos kebab-case, classes e namespaces.</p>
            </div>
        </div>
    );
}
