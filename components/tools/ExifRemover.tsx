import React, { useState, useRef } from 'react';
import { ImageOff, Upload, Download, Check, ShieldCheck, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ExifRemover() {
    const [image, setImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target?.result as string);
                setResult(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeExif = () => {
        if (!image) return;
        setIsProcessing(true);

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Drawing on canvas strips all metadata natively
                ctx.drawImage(img, 0, 0);
                const cleanImage = canvas.toDataURL('image/jpeg', 0.9);
                setResult(cleanImage);
            }
            setIsProcessing(false);
        };
        img.src = image;
    };

    const downloadImage = () => {
        if (!result) return;
        const link = document.createElement('a');
        link.href = result;
        link.download = 'clean_image.jpg';
        link.click();
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <div className="text-center">
                <div className="w-16 h-16 bg-text-main/5 rounded-2xl flex items-center justify-center text-text-main mx-auto mb-4">
                    <ImageOff size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Exif Data Remover</h3>
                <p className="text-text-main/50">Remova localização, data e informações da câmera de suas fotos antes de postar.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-4">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                            "aspect-square rounded-[40px] border-2 border-dashed border-border-main flex flex-col items-center justify-center cursor-pointer hover:bg-text-main/5 transition-all relative overflow-hidden",
                            image && "border-solid"
                        )}
                    >
                        {image ? (
                            <img src={image} className="w-full h-full object-cover" alt="Original" />
                        ) : (
                            <>
                                <Upload size={48} className="opacity-20 mb-4" />
                                <p className="font-bold opacity-40">Clique para carregar</p>
                                <p className="text-xs opacity-30 mt-1">JPG, PNG ou WEBP</p>
                            </>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>
                    {image && (
                        <button
                            onClick={removeExif}
                            disabled={isProcessing}
                            className="w-full py-4 bg-text-main text-bg-main rounded-2xl font-bold flex items-center justify-center gap-2"
                        >
                            {isProcessing ? "Limpando..." : "Limpar Metadados"}
                        </button>
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    <div className="aspect-square rounded-[40px] border-2 border-border-main bg-text-main/5 flex flex-col items-center justify-center relative overflow-hidden">
                        {result ? (
                            <>
                                <img src={result} className="w-full h-full object-cover" alt="Clean" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={downloadImage}
                                        className="px-6 py-3 bg-white text-black rounded-xl font-bold flex items-center gap-2"
                                    >
                                        <Download size={18} /> Baixar Versão Limpa
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center opacity-20 px-8">
                                <ShieldCheck size={48} className="mx-auto mb-4" />
                                <p className="font-bold">Prévia da imagem limpa</p>
                                <p className="text-xs">Aparecerá aqui após o processamento</p>
                            </div>
                        )}
                    </div>

                    {result && (
                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-600 text-sm font-medium flex items-center gap-3">
                            <Check size={20} /> Metadados removidos com sucesso!
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl text-xs space-y-2">
                <p className="font-bold opacity-60 uppercase tracking-widest">Como funciona?</p>
                <p className="opacity-60 leading-relaxed">
                    Quando você carrega uma imagem, desenhamos ela em um elemento `canvas` e a exportamos novamente.
                    Como o `canvas` armazena apenas os pixels e não o arquivo original, todas as informações EXIF (como coordenadas GPS, modelo do celular e configurações da lente) são descartadas automaticamente.
                </p>
            </div>
        </div>
    );
}
