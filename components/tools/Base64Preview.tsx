import React, { useState, useRef } from 'react';
import { ImageIcon, Upload, Trash2, Copy, Check, Download, FileJson, FileImage, Info } from 'lucide-react';

export function Base64Preview() {
  const [base64, setBase64] = useState('');
  const [copied, setCopied] = useState(false);
  const [imageDetails, setImageDetails] = useState<{ width: number; height: number; size: number } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setBase64(result);
        setImageDetails(prev => ({ ...prev ? prev : { width: 0, height: 0, size: 0 }, size: file.size }));
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(base64);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadImage = () => {
    if (!base64) return;
    const link = document.createElement('a');
    link.href = base64;
    link.download = `canivete-base64-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImageLoad = () => {
    if (imgRef.current) {
      setImageDetails(prev => ({
        width: imgRef.current?.naturalWidth || 0,
        height: imgRef.current?.naturalHeight || 0,
        size: prev?.size || Math.round((base64.length * 3) / 4)
      }));
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const EXAMPLE_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEhSURBVHgB7d0xSgNBFIDh994pUuYIlgZ7TyC9p8hrpMhpUuYIloZ7TyC9p0iXIkXOEawM9p5Aek+R06TMESwN955Aek+RLkWKnCNYGe6fP7Aww8fAn0S6ZFlmEemSZZlFpEuWZRaxv6S7O70vSZZZRLpbcT59L0mWWUS6v8W16XtJsswi0uV4Nn0vSZZZRLof8Xf6XpIss4h0V/FH+l6SLLOIvSWX8UP6XpIss4j9JVX8mL6XJMssoySXiCQXiUhykYgkF4lIcpGIJBeJSHKRiCQXiUhykYgkF4lIcpGIJBeJSHKRiCQXiUhykYgkF4lIcpGIJBeJSHKRiCQXiUhykYgkF4lIcpGIJBeJSHKRiCQXiUhykYgkF4lIcpGIJBeJSHKRiCQXiUhykYgkF4mkS5ZlFpEvpLvLeEikS5ZlFtH7AZF8L8lVAm8XAAAAAElFTkSuQmCC';

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 h-full">
        {/* Lado Esquerdo: Input de String ou Upload */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileJson className="w-5 h-5 text-blue-500" />
              <label className="text-sm font-black text-text-main/60 uppercase tracking-wider">String Base64 / Imagem</label>
            </div>
            <button
              onClick={() => {
                setBase64(EXAMPLE_BASE64);
                setImageDetails(null);
              }}
              className="px-3 py-1 bg-text-main/5 hover:bg-text-main/10 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors"
            >
              Carregar Exemplo
            </button>
          </div>
          <div className="flex-1 flex flex-col gap-6 min-h-[400px]">
            <textarea
              value={base64}
              onChange={(e) => {
                setBase64(e.target.value);
                setImageDetails(null);
              }}
              className="flex-1 p-5 font-mono text-[11px] bg-bg-main border border-border-main rounded-[24px] focus:ring-2 focus:ring-text-main/10 outline-none resize-none custom-scrollbar shadow-inner"
              placeholder="Cole o código base64 aqui ou faça upload de uma imagem abaixo..."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
              <label className="flex items-center justify-center gap-3 py-4 bg-text-main text-bg-main rounded-[20px] font-black uppercase tracking-widest text-[11px] cursor-pointer hover:shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all active:scale-95 group">
                <Upload size={18} className="group-hover:bounce" /> Upload Imagem
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
              <button
                onClick={() => {
                  setBase64('');
                  setImageDetails(null);
                }}
                className="flex items-center justify-center gap-3 py-4 bg-card-main border border-border-main text-text-main rounded-[20px] font-black uppercase tracking-widest text-[11px] hover:bg-red-500/5 hover:text-red-500 hover:border-red-500/20 transition-all active:scale-95"
              >
                <Trash2 size={18} /> Limpar Tudo
              </button>
            </div>
          </div>
        </div>

        {/* Lado Direito: Preview e Metadados */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileImage className="w-5 h-5 text-green-500" />
              <label className="text-sm font-black text-text-main/60 uppercase tracking-wider">Resultado Visual</label>
            </div>
            <div className="flex gap-2">
              {base64 && (
                <>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-text-main/5 hover:bg-text-main/10 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all"
                  >
                    {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    {copied ? 'Copiado!' : 'Copiar Base64'}
                  </button>
                  <button
                    onClick={downloadImage}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Download size={14} /> Baixar
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="flex-1 bg-bg-main rounded-[30px] border border-border-main flex flex-col items-center justify-center relative overflow-hidden group/preview shadow-inner min-h-[400px]">
            {base64 ? (
              <>
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-text-main text-bg-main px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                    <Info size={12} /> Live Preview
                  </div>
                </div>
                <div className="p-8 w-full h-full flex items-center justify-center overflow-auto custom-scrollbar">
                  <img
                    ref={imgRef}
                    src={base64}
                    alt="Base64 Preview"
                    onLoad={handleImageLoad}
                    className="max-w-full max-h-full object-contain rounded-xl shadow-[0_20px_40px_-5px_rgba(0,0,0,0.3)]"
                  />
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 bg-text-main/5 rounded-3xl flex items-center justify-center mx-auto mb-6 text-text-main/20">
                  <ImageIcon size={40} />
                </div>
                <p className="text-sm font-black text-text-main/30 uppercase tracking-widest">Aguardando Imagem...</p>
              </div>
            )}
          </div>

          {/* Dados Adicionais */}
          {imageDetails && base64 && (
            <div className="grid grid-cols-3 gap-6 mt-4 text-text-main">
              <div className="bg-text-main/5 p-4 rounded-[20px] border border-border-main/5">
                <p className="text-[9px] font-black opacity-30 uppercase tracking-widest mb-1 text-center">Tamanho</p>
                <p className="text-xs font-black text-center truncate">{formatSize(imageDetails.size)}</p>
              </div>
              <div className="bg-text-main/5 p-4 rounded-[20px] border border-border-main/5 text-center">
                <p className="text-[9px] font-black opacity-30 uppercase tracking-widest mb-1">Largura</p>
                <p className="text-xs font-black">{imageDetails.width}px</p>
              </div>
              <div className="bg-text-main/5 p-4 rounded-[20px] border border-border-main/5 text-center">
                <p className="text-[9px] font-black opacity-30 uppercase tracking-widest mb-1">Altura</p>
                <p className="text-xs font-black">{imageDetails.height}px</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
