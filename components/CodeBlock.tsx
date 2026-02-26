'use client';

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
    code: string;
    language: string;
    className?: string;
}

export function CodeBlock({ code, language, className }: CodeBlockProps) {
    return (
        <div className={cn("grid min-w-full", className)}>
            <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
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
                        fontFamily: 'var(--font-mono)',
                        display: 'inline-block',
                        minWidth: '100%',
                    }
                }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
}
