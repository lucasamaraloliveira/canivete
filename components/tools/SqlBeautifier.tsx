import React, { useState } from 'react';
import { format } from 'sql-formatter';
import { Database, Copy, Check, Sparkles } from 'lucide-react';
import { CodeBlock } from '../CodeBlock';

export function SqlBeautifier() {
  const [sql, setSql] = useState("SELECT * FROM users WHERE id = 1 AND status = 'active' GROUP BY department HAVING count(*) > 5 ORDER BY created_at DESC;");
  const [formatted, setFormatted] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    try {
      const result = format(sql, {
        language: 'sql',
        keywordCase: 'upper',
        indentStyle: 'tabularLeft',
      });
      setFormatted(result);
    } catch (e) {
      setFormatted('-- Erro ao formatar SQL. Verifique a sintaxe.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 sm:gap-8 h-full">
      <div className="flex flex-col gap-3 sm:gap-4 shrink-0 lg:shrink">
        <label className="text-[10px] sm:text-sm font-bold text-text-main/40 uppercase tracking-widest ml-1">SQL Bruto</label>
        <textarea
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          className="w-full h-40 lg:flex-1 p-4 font-mono text-sm bg-bg-main border border-border-main rounded-2xl focus:ring-2 focus:ring-text-main/10 outline-none resize-none transition-all"
          placeholder="SELECT * FROM table..."
        />
        <button
          onClick={handleFormat}
          className="w-full py-4 bg-text-main text-bg-main rounded-2xl font-black text-sm shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <Sparkles size={18} /> Formatar SQL
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:gap-4 flex-1 min-h-0">
        <div className="flex items-center justify-between ml-1">
          <label className="text-[10px] sm:text-sm font-bold text-text-main/40 uppercase tracking-widest">Resultado</label>
          {formatted && (
            <button
              onClick={copyToClipboard}
              className="px-3 py-1.5 bg-text-main/5 hover:bg-text-main/10 rounded-xl transition-all flex items-center gap-2 text-[10px] sm:text-xs font-bold"
            >
              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              {copied ? 'Copiado!' : 'Copiar Resultado'}
            </button>
          )}
        </div>
        <div className="flex-1 relative min-h-[200px] lg:min-h-0">
          <div className="absolute inset-0 bg-[#0D0D0D] rounded-2xl overflow-auto border border-border-main scrollbar-hide shadow-inner">
            <CodeBlock
              code={formatted || '-- O SQL formatado aparecerá aqui...'}
              language="sql"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
