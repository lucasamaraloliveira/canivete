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
    <div className="flex flex-col gap-8 h-full">
      <div className="flex flex-col gap-4">
        <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Token JWT</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full h-32 p-4 font-mono text-sm bg-bg-main border border-border-main rounded-2xl focus:ring-2 focus:ring-text-main/10 outline-none resize-none"
          placeholder="Cole seu token JWT aqui..."
        />
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 overflow-hidden">
        <div className="flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center gap-2 text-text-main/60">
            <Shield size={18} />
            <span className="text-sm font-bold uppercase tracking-wider">Header</span>
          </div>
          <div className="flex-1 bg-text-main rounded-2xl overflow-auto border border-border-main scrollbar-hide">
            <CodeBlock
              code={header ? JSON.stringify(header, null, 2) : '// Header aparecerá aqui'}
              language="json"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center gap-2 text-text-main/60">
            <User size={18} />
            <span className="text-sm font-bold uppercase tracking-wider">Payload</span>
          </div>
          <div className="flex-1 bg-text-main rounded-2xl overflow-auto border border-border-main scrollbar-hide">
            <CodeBlock
              code={decoded ? JSON.stringify(decoded, null, 2) : '// Payload aparecerá aqui'}
              language="json"
            />
          </div>
        </div>
      </div>

      {decoded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-text-main/5 rounded-2xl border border-border-main">
            <div className="flex items-center gap-2 text-text-main/40 mb-1">
              <Clock size={14} />
              <span className="text-[10px] font-bold uppercase">Expiração (exp)</span>
            </div>
            <p className="font-mono text-sm">
              {decoded.exp ? new Date(decoded.exp * 1000).toLocaleString() : 'N/A'}
            </p>
          </div>
          <div className="p-4 bg-text-main/5 rounded-2xl border border-border-main">
            <div className="flex items-center gap-2 text-text-main/40 mb-1">
              <Key size={14} />
              <span className="text-[10px] font-bold uppercase">Algoritmo (alg)</span>
            </div>
            <p className="font-mono text-sm">{header?.alg || 'N/A'}</p>
          </div>
          <div className="p-4 bg-text-main/5 rounded-2xl border border-border-main">
            <div className="flex items-center gap-2 text-text-main/40 mb-1">
              <User size={14} />
              <span className="text-[10px] font-bold uppercase">Subject (sub)</span>
            </div>
            <p className="font-mono text-sm">{decoded.sub || 'N/A'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
