import React, { useState } from 'react';
import { format } from 'sql-formatter';
import { Database, Copy, Check, Sparkles } from 'lucide-react';

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      <div className="flex flex-col gap-4">
        <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">SQL Bruto</label>
        <textarea
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          className="flex-1 p-4 font-mono text-sm bg-bg-main border border-border-main rounded-2xl focus:ring-2 focus:ring-text-main/10 outline-none resize-none"
          placeholder="SELECT * FROM table..."
        />
        <button
          onClick={handleFormat}
          className="py-4 bg-text-main text-bg-main rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <Sparkles size={20} /> Formatar SQL
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">SQL Formatado</label>
          {formatted && (
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
            {formatted || '-- O SQL formatado aparecerá aqui...'}
          </pre>
        </div>
      </div>
    </div>
  );
}
