import React, { useState, useRef, useCallback } from 'react';
import { Laugh, Download, Image as ImageIcon, Type, Trash2, Sliders, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export function MemeGenExpress() {
    const [image, setImage] = useState<string | null>(null);
    const [topText, setTopText] = useState('TEXTO SUPERIOR');
    const [bottomText, setBottomText] = useState('TEXTO INFERIOR');
    const [fontSize, setFontSize] = useState(40);
    const [textColor, setTextColor] = useState('#FFFFFF');
    const [fontFamily, setFontFamily] = useState('Impact');

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => setImage(event.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const drawMeme = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !image) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = image;
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const fSize = (fontSize * canvas.width) / 500;
            ctx.font = `bold ${fSize}px ${fontFamily}`;
            ctx.fillStyle = textColor;
            ctx.strokeStyle = 'black';
            ctx.lineWidth = fSize / 15;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';

            // Top text
            ctx.strokeText(topText.toUpperCase(), canvas.width / 2, 20);
            ctx.fillText(topText.toUpperCase(), canvas.width / 2, 20);

            // Bottom text
            ctx.textBaseline = 'bottom';
            ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
            ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
        };
    }, [image, topText, bottomText, fontSize, textColor, fontFamily]);

    const downloadMeme = () => {
        drawMeme();
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = 'meme-canivete.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    return (
        <div className="flex flex-col items-center gap-12 p-8 max-w-6xl mx-auto h-full">
            <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-text-main/5 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto text-text-main">
                    <Laugh size={40} />
                </div>
                <h2 className="text-3xl font-black tracking-tight text-text-main">Meme Gen Express</h2>
                <p className="text-sm opacity-50 font-medium">Crie memes virais em segundos</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
                {/* Preview Panel */}
                <div className="bg-card-main dark:bg-[#0D0D0D]/40 border border-border-main rounded-[40px] p-8 shadow-2xl flex flex-col items-center justify-center relative min-h-[500px] group">
                    <AnimatePresence mode="wait">
                        {!image ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center space-y-6"
                            >
                                <div className="w-24 h-24 bg-text-main/5 rounded-full flex items-center justify-center mx-auto text-text-main/20">
                                    <ImageIcon size={40} />
                                </div>
                                <label className="block p-6 border-2 border-dashed border-border-main rounded-3xl hover:bg-text-main/5 transition-all cursor-pointer">
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    <p className="font-black text-sm uppercase tracking-widest text-text-main opacity-50">Upload de Imagem</p>
                                </label>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="meme"
                                className="relative w-full h-full flex items-center justify-center"
                            >
                                <div className="relative max-w-full max-h-[600px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 group">
                                    <img src={image} className="max-w-full h-auto" alt="Preview" />

                                    {/* Meme Overlay View */}
                                    <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none">
                                        <h3 className="text-center font-black uppercase text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] leading-tight" style={{ fontSize: `${fontSize}px`, fontFamily, color: textColor, WebkitTextStroke: '2px black' }}>
                                            {topText}
                                        </h3>
                                        <h3 className="text-center font-black uppercase text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] leading-tight" style={{ fontSize: `${fontSize}px`, fontFamily, color: textColor, WebkitTextStroke: '2px black' }}>
                                            {bottomText}
                                        </h3>
                                    </div>

                                    <button
                                        onClick={() => setImage(null)}
                                        className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <canvas ref={canvasRef} className="hidden" />
                </div>

                {/* Editor Panel */}
                <div className="space-y-6">
                    <div className="bg-text-main/5 p-8 rounded-[40px] border border-border-main space-y-8 shadow-sm backdrop-blur-md">
                        <h4 className="font-black text-xs uppercase tracking-[0.3em] opacity-30 text-text-main flex items-center gap-2">
                            <Sliders size={14} /> Customização do Meme
                        </h4>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Texto Superior</p>
                                <input
                                    type="text"
                                    value={topText}
                                    onChange={(e) => setTopText(e.target.value)}
                                    className="w-full bg-text-main/5 border border-border-main rounded-2xl p-4 font-bold text-lg outline-none focus:ring-2 focus:ring-text-main/10 transition-all"
                                    placeholder="TEXTO DO TOPO"
                                />
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Texto Inferior</p>
                                <input
                                    type="text"
                                    value={bottomText}
                                    onChange={(e) => setBottomText(e.target.value)}
                                    className="w-full bg-text-main/5 border border-border-main rounded-2xl p-4 font-bold text-lg outline-none focus:ring-2 focus:ring-text-main/10 transition-all"
                                    placeholder="TEXTO DA BASE"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Tamanho da Fonte</p>
                                    <div className="flex items-center gap-4 bg-text-main/5 p-2 px-4 border border-border-main rounded-2xl">
                                        <button onClick={() => setFontSize(prev => Math.max(10, prev - 5))} className="p-2 hover:bg-text-main/10 rounded-xl"><ChevronDown size={14} /></button>
                                        <span className="font-black text-lg flex-1 text-center">{fontSize}</span>
                                        <button onClick={() => setFontSize(prev => Math.min(100, prev + 5))} className="p-2 hover:bg-text-main/10 rounded-xl"><ChevronUp size={14} /></button>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Cor do Texto</p>
                                    <input
                                        type="color"
                                        value={textColor}
                                        onChange={(e) => setTextColor(e.target.value)}
                                        className="w-full h-[52px] bg-text-main/5 p-1 border border-border-main rounded-2xl cursor-pointer"
                                    />
                                </div>
                            </div>

                            <button
                                disabled={!image}
                                onClick={downloadMeme}
                                className={cn(
                                    "w-full py-5 rounded-[24px] font-black text-xl flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95",
                                    image ? "bg-text-main text-bg-main hover:opacity-90" : "bg-text-main/10 text-text-main/20 cursor-not-allowed"
                                )}
                            >
                                <Download size={24} /> DESCARREGAR MEME
                            </button>
                        </div>
                    </div>

                    <div className="bg-text-main/5 p-6 rounded-[32px] border border-border-main space-y-4">
                        <h4 className="font-black text-xs uppercase tracking-widest opacity-30 text-text-main">Dica Rápida</h4>
                        <p className="text-sm font-medium leading-relaxed opacity-60 italic">
                            "Para melhores resultados, use imagens com contraste alto e fundos limpos. O texto Impact é o padrão clássico da internet!"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
