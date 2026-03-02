import React, { useState, useRef } from 'react';
import { Trash2, ShieldAlert, Upload, Download, RefreshCw, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FileShredder() {
    const [file, setFile] = useState<File | null>(null);
    const [shreddingProgress, setShreddingProgress] = useState(0);
    const [shreddedBlob, setShreddedBlob] = useState<Blob | null>(null);
    const [isShredding, setIsShredding] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setShreddedBlob(null);
            setShreddingProgress(0);
        }
    };

    const startShredding = async () => {
        if (!file) return;
        setIsShredding(true);
        setShreddingProgress(0);

        const fileSize = file.size;
        const passes = 3;

        for (let p = 1; p <= passes; p++) {
            // Simulate pass
            for (let i = 0; i <= 100; i += 10) {
                setShreddingProgress(((p - 1) * 100 + i) / passes);
                await new Promise(r => setTimeout(r, 50));
            }
        }

        // Create a dummy "shredded" blob filled with random data of same size
        const randomData = new Uint8Array(fileSize);
        const chunkSize = 65536; // Web Crypto limit is 64KB per call

        for (let i = 0; i < fileSize; i += chunkSize) {
            const currentChunkSize = Math.min(chunkSize, fileSize - i);
            window.crypto.getRandomValues(randomData.subarray(i, i + currentChunkSize));
        }

        const blob = new Blob([randomData], { type: 'application/octet-stream' });

        setShreddedBlob(blob);
        setIsShredding(false);
    };

    const downloadShredded = () => {
        if (!shreddedBlob || !file) return;
        const url = URL.createObjectURL(shreddedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `shredded_${file.name}.bin`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-2xl mx-auto flex flex-col gap-8 h-full justify-center">
            <div className="text-center">
                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Trash2 size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">File Shredder Simulator</h3>
                <p className="text-text-main/50">Simule a destruição de arquivos sobrescrevendo-os com dados aleatórios.</p>
            </div>

            <div className="bg-bg-main p-8 rounded-[40px] border border-border-main space-y-6">
                {!file ? (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full aspect-video border-2 border-dashed border-border-main rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-text-main/5 transition-all text-text-main/40"
                    >
                        <Upload size={40} className="mb-2" />
                        <p className="font-bold">Selecione um arquivo</p>
                        <p className="text-xs">O arquivo será lido apenas localmente</p>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="p-4 bg-text-main/5 rounded-2xl flex items-center justify-between border border-border-main">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-text-main text-bg-main rounded-lg flex items-center justify-center font-bold text-xs">
                                    {file.name.split('.').pop()?.toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-bold text-sm truncate max-w-[200px]">{file.name}</p>
                                    <p className="text-xs opacity-40">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                            </div>
                            <button onClick={() => setFile(null)} className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg">
                                <RefreshCw size={18} />
                            </button>
                        </div>

                        {isShredding ? (
                            <div className="space-y-4">
                                <div className="h-4 w-full bg-text-main/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-red-500 transition-all duration-300"
                                        style={{ width: `${shreddingProgress}%` }}
                                    />
                                </div>
                                <p className="text-center font-bold text-red-500 animate-pulse uppercase tracking-widest text-xs">
                                    Passo {Math.ceil((shreddingProgress / 100) * 3)}: Sobrescrevendo setores...
                                </p>
                            </div>
                        ) : shreddedBlob ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-600 text-sm font-bold flex items-center gap-2">
                                    <Check size={18} /> Arquivo desintegrado!
                                </div>
                                <button
                                    onClick={downloadShredded}
                                    className="w-full py-4 bg-text-main text-bg-main rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg"
                                >
                                    <Download size={20} /> Baixar Versão Destruída (.bin)
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={startShredding}
                                className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-red-600 shadow-xl transition-all"
                            >
                                <ShieldAlert size={20} /> Iniciar Shredding (3 Passos)
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-3xl">
                <h4 className="text-sm font-bold mb-2 uppercase tracking-wider text-red-500">O que é Shredding?</h4>
                <p className="text-[11px] leading-relaxed opacity-60 italic">
                    Simplesmente deletar um arquivo não o remove do disco; apenas marca o espaço como disponível.
                    O Shredding sobrescreve o conteúdo do arquivo várias vezes com dados aleatórios, tornando a recuperação impossível mesmo com ferramentas forenses.
                    *Nota: Em SSDs modernos, o shredding via software é menos eficaz que em HDDs devido ao Wear Leveling.*
                </p>
            </div>
        </div>
    );
}
