import React, { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      <div className="flex flex-col gap-4">
        <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">JSON de Entrada</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-4 font-mono text-sm bg-bg-main border border-border-main rounded-2xl focus:ring-2 focus:ring-text-main/10 outline-none resize-none"
          placeholder='{"key": "value"}'
        />
        <button
          onClick={generateZod}
          className="py-4 bg-text-main text-bg-main rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <Code2 size={20} /> Gerar Schema Zod
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Schema Zod (TypeScript)</label>
          {output && (
            <button
              onClick={copyToClipboard}
              className="p-2 hover:bg-text-main/5 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
            >
              {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          )}
        </div>
        <div className="flex-1 relative">
          <pre className="absolute inset-0 p-4 font-mono text-sm bg-text-main text-bg-main rounded-2xl overflow-auto border border-border-main">
            {error ? (
              <span className="text-red-400">Erro: {error}</span>
            ) : (
              output || '// O schema gerado aparecerá aqui...'
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
