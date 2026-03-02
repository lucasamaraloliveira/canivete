import React, { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';
import { CodeBlock } from '../CodeBlock';

export function JsonToZod() {
  const [input, setInput] = useState('{\n  "name": "John Doe",\n  "age": 30,\n  "isDeveloper": true,\n  "tags": ["react", "typescript"]\n}');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateZod = () => {
    try {
      setError(null);
      const json = JSON.parse(input);
      const schema = parseObject(json);
      setOutput(`import { z } from 'zod';\n\nconst schema = ${schema};`);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const parseObject = (obj: any): string => {
    if (Array.isArray(obj)) {
      if (obj.length === 0) return 'z.array(z.any())';
      return `z.array(${parseObject(obj[0])})`;
    }
    if (obj === null) return 'z.null()';
    const type = typeof obj;
    if (type === 'string') return 'z.string()';
    if (type === 'number') return 'z.number()';
    if (type === 'boolean') return 'z.boolean()';
    if (type === 'object') {
      const keys = Object.keys(obj);
      const props = keys.map(k => `  ${k}: ${parseObject(obj[k])}`).join(',\n');
      return `z.object({\n${props}\n})`;
    }
    return 'z.any()';
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 sm:gap-8 h-full">
      <div className="flex flex-col gap-3 sm:gap-4 shrink-0 lg:shrink">
        <label className="text-[10px] sm:text-sm font-bold text-text-main/40 uppercase tracking-widest ml-1">JSON de Entrada</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-48 lg:flex-1 p-4 font-mono text-sm bg-bg-main border border-border-main rounded-2xl focus:ring-2 focus:ring-text-main/10 outline-none resize-none transition-all"
          placeholder='{"key": "value"}'
        />
        <button
          onClick={generateZod}
          className="w-full py-4 bg-text-main text-bg-main rounded-2xl font-black text-sm shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <Code2 size={18} /> Gerar Schema Zod
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:gap-4 flex-1 min-h-0">
        <div className="flex items-center justify-between ml-1">
          <label className="text-[10px] sm:text-sm font-bold text-text-main/40 uppercase tracking-widest">Schema Zod (TypeScript)</label>
          {output && (
            <button
              onClick={copyToClipboard}
              className="px-3 py-1.5 bg-text-main/5 hover:bg-text-main/10 rounded-xl transition-all flex items-center gap-2 text-[10px] sm:text-xs font-bold"
            >
              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          )}
        </div>
        <div className="flex-1 relative min-h-[200px] lg:min-h-0">
          <div className="absolute inset-0 bg-[#0D0D0D] rounded-2xl overflow-auto border border-border-main scrollbar-hide shadow-inner">
            {error ? (
              <div className="p-4 text-red-400 font-mono text-xs">Erro: {error}</div>
            ) : (
              <CodeBlock
                code={output || '// O schema gerado aparecerá aqui...'}
                language="typescript"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
