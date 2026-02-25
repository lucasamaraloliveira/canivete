import React, { useState } from 'react';
import Papa from 'papaparse';
import { Table, Upload, Copy, Check, FileSpreadsheet } from 'lucide-react';

export function CsvToHtml() {
  const [csv, setCsv] = useState('Nome,Email,Cargo\nJoão Silva,joao@exemplo.com,Desenvolvedor\nMaria Souza,maria@exemplo.com,Designer\nPedro Santos,pedro@exemplo.com,Gerente');
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length > 0) {
          setHeaders(Object.keys(results.data[0] as any));
          setData(results.data);
        }
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data.length > 0) {
            setHeaders(Object.keys(results.data[0] as any));
            setData(results.data);
            // Also update the text area for visibility
            setCsv(Papa.unparse(results.data));
          }
        }
      });
    }
  };

  const generateHtml = () => {
    if (data.length === 0) return '';
    let html = '<table class="min-w-full divide-y divide-gray-200">\n';
    html += '  <thead class="bg-gray-50">\n    <tr>\n';
    headers.forEach(h => {
      html += `      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${h}</th>\n`;
    });
    html += '    </tr>\n  </thead>\n';
    html += '  <tbody class="bg-white divide-y divide-gray-200">\n';
    data.forEach(row => {
      html += '    <tr>\n';
      headers.forEach(h => {
        html += `      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${row[h]}</td>\n`;
      });
      html += '    </tr>\n';
    });
    html += '  </tbody>\n</table>';
    return html;
  };

  const copyHtml = () => {
    navigator.clipboard.writeText(generateHtml());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Dados CSV</label>
          <textarea
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            className="h-48 p-4 font-mono text-sm bg-bg-main border border-border-main rounded-2xl focus:ring-2 focus:ring-text-main/10 outline-none resize-none"
            placeholder="col1,col2,col3..."
          />
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center justify-center gap-2 py-4 bg-card-main border border-border-main text-text-main rounded-2xl font-bold cursor-pointer hover:bg-text-main/5 transition-all">
              <Upload size={20} /> Upload CSV
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>
            <button
              onClick={handleConvert}
              className="flex items-center justify-center gap-2 py-4 bg-text-main text-bg-main rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              <FileSpreadsheet size={20} /> Processar CSV
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Código HTML Gerado</label>
            {data.length > 0 && (
              <button
                onClick={copyHtml}
                className="p-2 hover:bg-text-main/5 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
              >
                {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                {copied ? 'Copiado!' : 'Copiar HTML'}
              </button>
            )}
          </div>
          <pre className="h-64 p-4 font-mono text-xs bg-text-main text-bg-main rounded-2xl overflow-auto">
            {generateHtml() || '// O código HTML aparecerá aqui...'}
          </pre>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="flex items-center gap-2 text-text-main/60">
          <Table size={18} />
          <span className="text-sm font-bold uppercase tracking-wider">Visualização da Tabela</span>
        </div>
        <div className="flex-1 bg-card-main border border-border-main rounded-[32px] overflow-auto shadow-inner">
          {data.length > 0 ? (
            <table className="min-w-full divide-y divide-border-main">
              <thead className="bg-text-main/5">
                <tr>
                  {headers.map(h => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-bold text-text-main/40 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main/5">
                {data.map((row, i) => (
                  <tr key={i} className="hover:bg-text-main/5 transition-colors">
                    {headers.map(h => (
                      <td key={h} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-main/70">{row[h]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="h-full flex items-center justify-center text-text-main/20 font-bold">
              Processe um CSV para visualizar a tabela
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
