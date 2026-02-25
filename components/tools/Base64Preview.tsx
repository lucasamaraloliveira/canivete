import React, { useState } from 'react';
import { ImageIcon, Upload, Trash2, Copy, Check } from 'lucide-react';

export function Base64Preview() {
  const [base64, setBase64] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(base64);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      <div className="flex flex-col gap-4">
        <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">String Base64 ou Upload</label>
        <div className="flex-1 flex flex-col gap-4">
          <textarea
            value={base64}
            onChange={(e) => setBase64(e.target.value)}
            className="flex-1 p-4 font-mono text-xs bg-bg-main border border-border-main rounded-2xl focus:ring-2 focus:ring-text-main/10 outline-none resize-none"
            placeholder="data:image/png;base64,..."
          />
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center justify-center gap-2 py-4 bg-text-main text-bg-main rounded-2xl font-bold cursor-pointer hover:shadow-lg transition-all">
              <Upload size={20} /> Upload Imagem
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
            <button
              onClick={() => setBase64('')}
              className="flex items-center justify-center gap-2 py-4 bg-card-main border border-border-main text-text-main rounded-2xl font-bold hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 hover:border-red-100 transition-all"
            >
              <Trash2 size={20} /> Limpar
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Preview da Imagem</label>
          {base64 && (
            <button
              onClick={copyToClipboard}
              className="p-2 hover:bg-text-main/5 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
            >
              {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
              {copied ? 'Copiado!' : 'Copiar Base64'}
            </button>
          )}
        </div>
        <div className="flex-1 bg-bg-main rounded-[32px] border border-border-main flex items-center justify-center overflow-hidden p-8">
          {base64 ? (
            <img
              src={base64}
              alt="Base64 Preview"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              onError={() => { }}
            />
          ) : (
            <div className="text-center text-text-main/20">
              <ImageIcon size={64} className="mx-auto mb-4" />
              <p className="font-bold">Nenhuma imagem para exibir</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
