import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Download, Share2, Link, Wifi, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

export function QrCodeGenerator() {
  const [value, setValue] = useState('https://google.com');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('L');
  const [type, setType] = useState<'link' | 'wifi' | 'email'>('link');

  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'qrcode.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const [showShareModal, setShowShareModal] = useState(false);
  const [tempQrImage, setTempQrImage] = useState<string | null>(null);

  const shareQR = async () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = async () => {
      canvas.width = size;
      canvas.height = size;
      ctx?.drawImage(img, 0, 0);

      const pngData = canvas.toDataURL('image/png');
      setTempQrImage(pngData);

      try {
        setShowShareModal(true);
      } catch (err) {
        console.error('Erro ao abrir modal:', err);
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const copyImageToClipboard = async () => {
    if (!tempQrImage) return;
    try {
      const response = await fetch(tempQrImage);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      alert('Imagem copiada para a área de transferência!');
      setShowShareModal(false);
    } catch (err) {
      alert('Erro ao copiar imagem.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full relative">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="flex gap-2 p-1 bg-text-main/5 rounded-2xl w-fit">
          <button
            onClick={() => setType('link')}
            className={cn("px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2", type === 'link' ? "bg-card-main shadow-sm text-text-main" : "text-text-main/50")}
          >
            <Link size={16} /> Link
          </button>
          <button
            onClick={() => setType('wifi')}
            className={cn("px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2", type === 'wifi' ? "bg-card-main shadow-sm text-text-main" : "text-text-main/50")}
          >
            <Wifi size={16} /> Wi-Fi
          </button>
          <button
            onClick={() => setType('email')}
            className={cn("px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2", type === 'email' ? "bg-card-main shadow-sm text-text-main" : "text-text-main/50")}
          >
            <Mail size={16} /> E-mail
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Conteúdo do QR Code</label>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full h-32 p-4 font-mono text-sm bg-bg-main border border-border-main rounded-2xl focus:ring-2 focus:ring-text-main/10 outline-none resize-none"
            placeholder={type === 'link' ? "https://exemplo.com" : type === 'wifi' ? "WIFI:S:SSID;T:WPA;P:PASSWORD;;" : "mailto:email@exemplo.com"}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-main/40 uppercase">Cor do QR</label>
            <input
              type="color"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="w-full h-12 rounded-xl cursor-pointer border-none p-0"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-main/40 uppercase">Cor de Fundo</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-full h-12 rounded-xl cursor-pointer border-none p-0"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-8 bg-bg-main rounded-[32px] p-8 border border-border-main">
        <div className="bg-white p-6 rounded-3xl shadow-2xl border border-border-main">
          <QRCodeSVG
            id="qr-code-svg"
            value={value}
            size={Math.min(size, 220)}
            level={level}
            fgColor={fgColor}
            bgColor={bgColor}
            includeMargin={true}
          />
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={downloadQR}
            className="w-full py-4 bg-text-main text-bg-main rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Download size={20} /> Baixar PNG
          </button>
          <button
            onClick={shareQR}
            className="w-full py-4 bg-card-main border border-border-main text-text-main rounded-2xl font-bold hover:bg-text-main/5 transition-all flex items-center justify-center gap-2"
          >
            <Share2 size={20} /> Compartilhar
          </button>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
          <div
            className="absolute inset-0 bg-bg-main/60 backdrop-blur-md"
            onClick={() => setShowShareModal(false)}
          />
          <div className="bg-card-main border border-border-main rounded-[40px] p-8 sm:p-12 w-full max-w-lg relative shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col items-center text-center gap-8">
            <div className="w-16 h-16 bg-text-main/5 rounded-2xl flex items-center justify-center">
              <Share2 size={32} className="opacity-20 translate-x-0.5" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">Pronto para Compartilhar</h3>
              <p className="text-[10px] font-bold opacity-30 uppercase tracking-[3px]">Sua imagem foi gerada com sucesso</p>
            </div>

            {tempQrImage && (
              <div className="bg-white p-4 rounded-[32px] shadow-inner border border-border-main/10 ring-8 ring-text-main/5 flex items-center justify-center w-64 h-64 sm:w-72 sm:h-72">
                <img src={tempQrImage} alt="QR Code Preview" className="w-full h-full object-contain" />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <button
                onClick={copyImageToClipboard}
                className="py-5 bg-text-main text-bg-main rounded-[24px] font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <Download size={20} className="rotate-180" /> Copiar
              </button>
              <button
                onClick={() => { downloadQR(); setShowShareModal(false); }}
                className="py-5 bg-card-main border-2 border-border-main text-text-main rounded-[24px] font-black uppercase tracking-widest hover:bg-text-main/5 transition-all flex items-center justify-center gap-3"
              >
                <Download size={20} /> Salvar
              </button>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="text-[10px] font-black opacity-20 hover:opacity-100 uppercase tracking-widest transition-all"
            >
              Fechar Visualização
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
