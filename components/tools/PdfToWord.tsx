import React, { useState } from 'react';
import { FileText, Upload, Download, Loader2, CheckCircle2, AlertCircle, FileType, Search } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { createWorker } from 'tesseract.js';

export function PdfToWord() {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
    const [progress, setProgress] = useState(0);
    const [progressText, setProgressText] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const loadPdfJs = async () => {
        if ((window as any).pdfjsLib) return (window as any).pdfjsLib;

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.onload = () => {
                const pdfjsLib = (window as any).pdfjsLib;
                // Usando o worker da mesma CDN e versão estável para evitar erros de importação dinâmica
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                resolve(pdfjsLib);
            };
            script.onerror = () => reject(new Error('Falha ao carregar o motor de PDF. Verifique sua conexão.'));
            document.head.appendChild(script);
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setStatus('idle');
            setProgress(0);
        } else {
            setErrorMessage('Por favor, selecione um arquivo PDF válido.');
            setStatus('error');
        }
    };

    const convertPdfToWord = async () => {
        if (!file) return;

        setStatus('processing');
        setProgress(0);
        setProgressText('Iniciando motor de PDF Estável...');

        let tesseractWorker: any = null;

        try {
            // 1. Carregar Motor PDF de forma robusta
            const pdfjsLib: any = await loadPdfJs();
            setProgress(10);

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
            const totalPages = pdf.numPages;
            const paragraphs: Paragraph[] = [];

            // 2. Preparar Tesseract apenas se necessário
            setProgressText('Preparando Inteligência Artificial (OCR)...');
            tesseractWorker = await createWorker('por+eng');
            setProgress(20);

            for (let i = 1; i <= totalPages; i++) {
                setProgressText(`Lendo página ${i} de ${totalPages}...`);
                const page = await pdf.getPage(i);

                // Tenta extração de texto nativa (rápida)
                const textContent = await page.getTextContent();
                let pageText = textContent.items.map((item: any) => item.str).join(' ');

                // 3. Se não houver texto selecionável, ativa OCR pesado
                if (!pageText.trim()) {
                    setProgressText(`Executando OCR na página ${i} (PDF de Imagem)...`);

                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    const viewport = page.getViewport({ scale: 2.0 }); // Resolução 2x para precisão no OCR

                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    if (context) {
                        await page.render({ canvasContext: context, viewport }).promise;
                        const { data: { text } } = await tesseractWorker.recognize(canvas);
                        pageText = text;
                    }
                }

                // Reconstrói parágrafos básicos
                const lines = pageText.split('\n');
                lines.forEach((line: string) => {
                    if (line.trim()) {
                        paragraphs.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: line,
                                        size: 24, // 12pt
                                    }),
                                ],
                            })
                        );
                    }
                });

                if (i < totalPages) {
                    paragraphs.push(new Paragraph({ children: [new TextRun({ break: 1 })] }));
                }

                setProgress(Math.round(20 + (i / totalPages) * 70));
            }

            setProgressText('Compilando Documento Word Final...');
            const doc = new Document({
                sections: [{
                    properties: {},
                    children: paragraphs,
                }],
            });

            const blob = await Packer.toBlob(doc);

            // MÉTODO NATIVO DE DOWNLOAD (Substitui file-saver para evitar erros de compilação)
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = file.name.replace(/\.pdf$/i, '.docx');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            if (tesseractWorker) await tesseractWorker.terminate();

            setProgress(100);
            setStatus('success');
        } catch (error: any) {
            console.error('Erro detalhado:', error);
            setErrorMessage('Erro de Conexão com o Motor: ' + (error.message || 'Falha ao carregar módulos remotos.'));
            setStatus('error');
            if (tesseractWorker) await tesseractWorker.terminate();
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 sm:p-10">
            <div className="text-center mb-10">
                <div className="w-20 h-20 bg-blue-500/10 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <FileText size={40} />
                </div>
                <h2 className="text-3xl font-black mb-3 italic tracking-tighter uppercase text-text-main">PDF para Word Pro + OCR</h2>
                <p className="text-text-main/60 max-w-md mx-auto italic font-medium">Reconhecimento de texto inteligente em ambiente estável.</p>
            </div>

            <div className="bg-card-main border border-border-main rounded-[40px] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-text-main/5">
                    <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>

                {status === 'idle' && (
                    <div className="flex flex-col items-center">
                        <label className="w-full max-w-md aspect-video border-2 border-dashed border-border-main rounded-[32px] flex flex-col items-center justify-center cursor-pointer hover:bg-text-main/5 transition-all">
                            <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                            <div className="bg-text-main/5 p-5 rounded-2xl mb-4">
                                <Upload size={32} className="text-text-main/40" />
                            </div>
                            <p className="font-black text-sm uppercase tracking-widest text-text-main/60 italic text-center px-4">
                                {file ? file.name : "Selecionar Documento PDF"}
                            </p>
                        </label>
                        {file && (
                            <button onClick={convertPdfToWord} className="mt-10 w-full max-w-sm py-5 bg-text-main text-bg-main rounded-[24px] font-black uppercase tracking-[3px] text-xs shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                                Iniciar Conversão Inteligente <FileType size={18} />
                            </button>
                        )}
                    </div>
                )}

                {status === 'processing' && (
                    <div className="py-12 flex flex-col items-center text-center">
                        <div className="relative mb-8">
                            <Loader2 size={64} className="text-blue-500 animate-spin mx-auto" />
                            <div className="mt-4 font-black text-blue-500 text-xl italic uppercase font-mono">{progress}%</div>
                        </div>
                        <h3 className="text-xl font-black uppercase italic tracking-wider mb-2 text-text-main">Processando...</h3>
                        <p className="text-sm opacity-60 italic text-text-main/60 font-medium">{progressText}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="py-12 flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
                        <CheckCircle2 size={64} className="text-green-500 mb-6 animate-bounce" />
                        <h3 className="text-2xl font-black uppercase italic mb-4 text-text-main tracking-tight">Sucesso Absoluto!</h3>
                        <p className="text-sm opacity-60 italic mb-10 text-text-main/80">O documento editável foi gerado com auxílio de OCR.</p>
                        <button onClick={() => setStatus('idle')} className="px-8 py-4 bg-text-main/5 hover:bg-text-main/10 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border border-border-main text-text-main">
                            Converter outro
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="py-12 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
                        <AlertCircle size={64} className="text-red-500 mb-6" />
                        <h3 className="text-xl font-black uppercase italic mb-2 tracking-tight text-text-main">Falha de Módulo</h3>
                        <p className="text-[10px] text-red-500/80 font-bold uppercase tracking-widest mb-8 px-4 italic border border-red-500/10 bg-red-500/5 py-4 rounded-2xl leading-relaxed">{errorMessage}</p>
                        <button onClick={() => setStatus('idle')} className="px-8 py-4 bg-text-main text-bg-main rounded-2xl font-black uppercase tracking-widest text-[10px] hover:brightness-125 transition-all">Tentar Novamente</button>
                    </div>
                )}
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-500/5 rounded-3xl p-6 border border-blue-500/10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
                            <Search size={20} />
                        </div>
                        <h4 className="font-black text-xs uppercase tracking-widest text-blue-600/70 italic">Motor Estável</h4>
                    </div>
                    <p className="text-[10px] leading-relaxed opacity-70 italic font-medium text-text-main/70">
                        Migramos para a versão 3.11 do motor Mozilla para garantir compatibilidade total com navegadores antigos e modernos.
                    </p>
                </div>
                <div className="bg-orange-500/5 rounded-3xl p-6 border border-orange-500/10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-orange-500/10 text-orange-500 rounded-xl">
                            <Loader2 size={20} />
                        </div>
                        <h4 className="font-black text-xs uppercase tracking-widest text-orange-600/70 italic">Fallback OCR</h4>
                    </div>
                    <p className="text-[10px] leading-relaxed opacity-70 italic font-medium text-text-main/70">
                        Se o PDF não possuir texto selecionável, o motor Tesseract entra em ação para ler o documento visualmente.
                    </p>
                </div>
            </div>
        </div>
    );
}
