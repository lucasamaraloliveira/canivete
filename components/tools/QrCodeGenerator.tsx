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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
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
            size={size}
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
          <button className="w-full py-4 bg-card-main border border-border-main text-text-main rounded-2xl font-bold hover:bg-text-main/5 transition-all flex items-center justify-center gap-2">
            <Share2 size={20} /> Compartilhar
          </button>
        </div>
      </div>
    </div>
  );
}
