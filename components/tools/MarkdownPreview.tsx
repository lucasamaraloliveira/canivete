import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FileText, Eye, Code, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export function MarkdownPreview() {
  const [markdown, setMarkdown] = useState('# Bem-vindo ao Editor Markdown\n\nVocê pode escrever seu texto aqui e ver o resultado ao lado.\n\n## Funcionalidades:\n- **Negrito**\n- *Itálico*\n- [Links](https://google.com)\n- `Código inline`\n\n```javascript\nconsole.log("Hello World");\n```\n\n> Citações também funcionam!');
  const [view, setView] = useState<'split' | 'edit' | 'preview'>('split');

  const downloadMarkdown = () => {
    const element = document.createElement("a");
    const file = new Blob([markdown], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "documento.md";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 p-1 bg-text-main/5 rounded-2xl w-fit">
          <button
            onClick={() => setView('edit')}
            className={cn("px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2", view === 'edit' ? "bg-card-main shadow-sm text-text-main" : "text-text-main/50")}
          >
            <Code size={16} /> Editor
          </button>
          <button
            onClick={() => setView('split')}
            className={cn("px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2", view === 'split' ? "bg-card-main shadow-sm text-text-main" : "text-text-main/50")}
          >
            <FileText size={16} /> Split
          </button>
          <button
            onClick={() => setView('preview')}
            className={cn("px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2", view === 'preview' ? "bg-card-main shadow-sm text-text-main" : "text-text-main/50")}
          >
            <Eye size={16} /> Preview
          </button>
        </div>
        <button
          onClick={downloadMarkdown}
          className="px-4 py-2 bg-text-main text-bg-main rounded-xl text-sm font-bold flex items-center gap-2"
        >
          <Download size={16} /> Exportar .md
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-hidden">
        {(view === 'edit' || view === 'split') && (
          <div className={cn("flex flex-col gap-4", view === 'edit' ? "lg:col-span-2" : "")}>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="flex-1 p-6 font-mono text-sm bg-bg-main border border-border-main rounded-[32px] focus:ring-2 focus:ring-text-main/10 outline-none resize-none"
              placeholder="# Título..."
            />
          </div>
        )}

        {(view === 'preview' || view === 'split') && (
          <div className={cn("flex flex-col gap-4 overflow-hidden", view === 'preview' ? "lg:col-span-2" : "")}>
            <div className="flex-1 bg-card-main border border-border-main rounded-[32px] p-8 overflow-y-auto prose prose-slate dark:prose-invert max-w-none markdown-body">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {markdown}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
