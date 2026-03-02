import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Key, AlertCircle, Clock, Shield, User } from 'lucide-react';
import { CodeBlock } from '../CodeBlock';

export function JwtDecoder() {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState<any>(null);
  const [header, setHeader] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setDecoded(null);
      setHeader(null);
      setError(null);
      return;
    }

    try {
      const payload = jwtDecode(token);
      const head = jwtDecode(token, { header: true });
      setDecoded(payload);
      setHeader(head);
      setError(null);
    } catch (e: any) {
      setError('Token JWT inválido ou malformado.');
      setDecoded(null);
      setHeader(null);
    }
  }, [token]);

  return (
    <div className="flex flex-col gap-6 sm:gap-8 h-full">
      <div className="flex flex-col gap-3 sm:gap-4 shrink-0">
        <label className="text-[10px] sm:text-sm font-bold text-text-main/40 uppercase tracking-widest ml-1">Token JWT</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full h-32 sm:h-40 p-4 font-mono text-sm bg-bg-main border border-border-main rounded-2xl focus:ring-2 focus:ring-text-main/10 outline-none resize-none transition-all"
          placeholder="Cole seu token JWT aqui..."
        />
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400">
          <AlertCircle size={18} />
          <p className="text-xs sm:text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 min-h-0 flex-1">
        <div className="flex flex-col gap-3 sm:gap-4 min-h-[150px] lg:min-h-0">
          <div className="flex items-center gap-2 text-text-main/40 ml-1">
            <Shield size={16} />
            <span className="text-[10px] sm:text-sm font-bold uppercase tracking-widest">Header</span>
          </div>
          <div className="flex-1 bg-[#0D0D0D] rounded-2xl overflow-auto border border-border-main scrollbar-hide shadow-inner">
            <CodeBlock
              code={header ? JSON.stringify(header, null, 2) : '// Header aparecerá aqui'}
              language="json"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4 min-h-[200px] lg:min-h-0">
          <div className="flex items-center gap-2 text-text-main/40 ml-1">
            <User size={16} />
            <span className="text-[10px] sm:text-sm font-bold uppercase tracking-widest">Payload</span>
          </div>
          <div className="flex-1 bg-[#0D0D0D] rounded-2xl overflow-auto border border-border-main scrollbar-hide shadow-inner">
            <CodeBlock
              code={decoded ? JSON.stringify(decoded, null, 2) : '// Payload aparecerá aqui'}
              language="json"
            />
          </div>
        </div>
      </div>

      {decoded && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 shrink-0">
          <div className="p-3 sm:p-4 bg-text-main/5 rounded-2xl border border-border-main">
            <div className="flex items-center gap-2 text-text-main/40 mb-1">
              <Clock size={12} />
              <span className="text-[9px] font-bold uppercase tracking-tighter">Expiração (exp)</span>
            </div>
            <p className="font-mono text-xs sm:text-sm opacity-80 truncate">
              {decoded.exp ? new Date(decoded.exp * 1000).toLocaleString() : 'N/A'}
            </p>
          </div>
          <div className="p-3 sm:p-4 bg-text-main/5 rounded-2xl border border-border-main">
            <div className="flex items-center gap-2 text-text-main/40 mb-1">
              <Key size={12} />
              <span className="text-[9px] font-bold uppercase tracking-tighter">Algoritmo (alg)</span>
            </div>
            <p className="font-mono text-xs sm:text-sm opacity-80 truncate">{header?.alg || 'N/A'}</p>
          </div>
          <div className="p-3 sm:p-4 bg-text-main/5 rounded-2xl border border-border-main">
            <div className="flex items-center gap-2 text-text-main/40 mb-1">
              <User size={12} />
              <span className="text-[9px] font-bold uppercase tracking-tighter">Subject (sub)</span>
            </div>
            <p className="font-mono text-xs sm:text-sm opacity-80 truncate">{decoded.sub || 'N/A'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
