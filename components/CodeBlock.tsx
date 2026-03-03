'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

// Carregamento dinâmico do highlighter para não bloquear a renderização inicial
const SyntaxHighlighter = dynamic(
    () => import('react-syntax-highlighter').then(mod => mod.Prism),
    {
        ssr: false,
        loading: () => <pre className="p-6 text-sm text-text-main/50 animate-pulse">Carregando código...</pre>
    }
);

// Estilo carregado dinamicamente para reduzir o bundle inicial
const getStyle = async () => {
    const mod = await import('react-syntax-highlighter/dist/esm/styles/prism');
    return mod.vscDarkPlus;
};

interface CodeBlockProps {
    code: string;
    language: string;
    className?: string;
}

export function CodeBlock({ code, language, className }: CodeBlockProps) {
    const [style, setStyle] = React.useState<any>(null);

    React.useEffect(() => {
        getStyle().then(setStyle);
    }, []);

    return (
        <div className={cn("grid min-w-full font-mono", className)}>
            {style ? (
                <SyntaxHighlighter
                    language={language}
                    style={style}
                    wrapLongLines={false}
                    customStyle={{
                        margin: 0,
                        padding: '1.5rem',
                        fontSize: '0.875rem',
                        lineHeight: '1.5rem',
                        background: 'transparent',
                        overflow: 'visible',
                        width: '100%',
                    }}
                    codeTagProps={{
                        style: {
                            fontFamily: 'inherit',
                            display: 'inline-block',
                            minWidth: '100%',
                        }
                    }}
                >
                    {code}
                </SyntaxHighlighter>
            ) : (
                <pre className="p-6 text-sm text-text-main/50">
                    {code}
                </pre>
            )}
        </div>
    );
}
