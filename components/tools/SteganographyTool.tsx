import React, { useState, useRef } from 'react';
import { EyeOff, Eye, Upload, Download, Lock, Unlock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SteganographyTool() {
    const [image, setImage] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [decodedMessage, setDecodedMessage] = useState('');
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target?.result as string);
                setResultImage(null);
                setDecodedMessage('');
            };
            reader.readAsDataURL(file);
        }
    };

    const encodeMessage = () => {
        if (!image || !message) return;
        setIsProcessing(true);

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Simple LSB encoding
            const binaryMessage = message.split('').map(char =>
                char.charCodeAt(0).toString(2).padStart(8, '0')
            ).join('') + '00000000'; // Null terminator

            if (binaryMessage.length > data.length / 4 * 3) {
                alert("Mensagem muito longa para esta imagem!");
                setIsProcessing(false);
                return;
            }

            for (let i = 0; i < binaryMessage.length; i++) {
                // Only use RGB channels (skip Alpha)
                const pixelIndex = Math.floor(i / 3) * 4 + (i % 3);
                data[pixelIndex] = (data[pixelIndex] & 0xFE) | parseInt(binaryMessage[i]);
            }

            ctx.putImageData(imageData, 0, 0);
            setResultImage(canvas.toDataURL());
            setIsProcessing(false);
        };
        img.src = image;
    };

    const decodeMessage = () => {
        if (!image) return;
        setIsProcessing(true);

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            let binaryMessage = '';
            for (let i = 0; i < data.length; i++) {
                if ((i + 1) % 4 === 0) continue; // Skip Alpha
                binaryMessage += (data[i] & 1).toString();
            }

            const chars = [];
            for (let i = 0; i < binaryMessage.length; i += 8) {
                const byte = binaryMessage.slice(i, i + 8);
                const charCode = parseInt(byte, 2);
                if (charCode === 0) break; // Null terminator
                chars.push(String.fromCharCode(charCode));
            }

            setDecodedMessage(chars.join(''));
            setIsProcessing(false);
        };
        img.src = image;
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <div className="text-center">
                <div className="w-16 h-16 bg-text-main/5 rounded-2xl flex items-center justify-center text-text-main mx-auto mb-4">
                    <EyeOff size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Steganography Tool</h3>
                <p className="text-text-main/50">Esconda mensagens secretas dentro de pixels de imagens sem alterar sua aparência.</p>
            </div>

            <div className="flex bg-text-main/5 p-1 rounded-2xl w-full max-w-md mx-auto">
                <button
                    onClick={() => setMode('encode')}
                    className={cn(
                        "flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
                        mode === 'encode' ? "bg-text-main text-bg-main shadow-lg" : "opacity-50 hover:opacity-100"
                    )}
                >
                    <Lock size={16} /> Esconder
                </button>
                <button
                    onClick={() => setMode('decode')}
                    className={cn(
                        "flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
                        mode === 'decode' ? "bg-text-main text-bg-main shadow-lg" : "opacity-50 hover:opacity-100"
                    )}
                >
                    <Unlock size={16} /> Revelar
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-video rounded-3xl border-2 border-dashed border-border-main flex flex-col items-center justify-center cursor-pointer hover:bg-text-main/5 transition-all overflow-hidden relative"
                    >
                        {image ? (
                            <img src={image} className="w-full h-full object-contain" alt="Target" />
                        ) : (
                            <div className="text-center">
                                <Upload size={32} className="mx-auto mb-2 opacity-20" />
                                <p className="text-sm font-bold opacity-40">Carregar Imagem</p>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png" />
                    </div>

                    {mode === 'encode' && (
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Digite a mensagem secreta aqui..."
                            className="w-full p-4 h-32 bg-bg-main border border-border-main rounded-2xl focus:ring-2 focus:ring-text-main/10 outline-none resize-none text-sm"
                        />
                    )}

                    <button
                        onClick={mode === 'encode' ? encodeMessage : decodeMessage}
                        disabled={!image || (mode === 'encode' && !message) || isProcessing}
                        className="w-full py-4 bg-text-main text-bg-main rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-30"
                    >
                        {isProcessing ? "Processando..." : mode === 'encode' ? "Esconder Mensagem" : "Revelar Mensagem"}
                    </button>
                </div>

                <div className="space-y-4">
                    {mode === 'encode' ? (
                        <div className="aspect-video rounded-3xl border border-border-main bg-text-main/5 flex flex-col items-center justify-center relative overflow-hidden">
                            {resultImage ? (
                                <>
                                    <img src={resultImage} className="w-full h-full object-contain" alt="Result" />
                                    <div className="absolute inset-x-0 bottom-4 flex justify-center">
                                        <a
                                            href={resultImage}
                                            download="secret_image.png"
                                            className="px-6 py-2 bg-text-main text-bg-main rounded-xl font-bold flex items-center gap-2 text-sm shadow-xl"
                                        >
                                            <Download size={16} /> Baixar Imagem (PNG)
                                        </a>
                                    </div>
                                </>
                            ) : (
                                <p className="text-xs opacity-20 font-bold uppercase tracking-widest">Resultado aparecerá aqui</p>
                            )}
                        </div>
                    ) : (
                        <div className="h-full min-h-[200px] p-6 bg-text-main/5 border border-border-main rounded-3xl">
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-30 mb-4">Mensagem Revelada</p>
                            {decodedMessage ? (
                                <div className="font-medium text-lg animate-in fade-in slide-in-from-top-2 break-all whitespace-pre-wrap">
                                    {decodedMessage}
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center opacity-10">
                                    <Eye size={48} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6 bg-yellow-500/5 border border-yellow-500/10 rounded-3xl text-[11px] leading-relaxed opacity-60">
                <p className="font-bold mb-1">Dica técnica:</p>
                <p>
                    Sempre use formatos **sem perdas** (como PNG) para esteganografia. Formatos como JPEG utilizam compressão que altera os valores dos pixels,
                    o que destruiria a mensagem escondida nos bits menos significativos.
                </p>
            </div>
        </div>
    );
}
