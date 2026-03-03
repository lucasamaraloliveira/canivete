import React, { useState } from 'react';
import { FileType, Upload, Download, Loader2, CheckCircle2, AlertCircle, FileText, Info } from 'lucide-react';
import mammoth from 'mammoth';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export function WordToPdf() {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
    const [progress, setProgress] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && (selectedFile.name.endsWith('.docx') || selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
            setFile(selectedFile);
            setStatus('idle');
            setProgress(0);
        } else {
            setErrorMessage('Por favor, selecione um arquivo Word (.docx) válido.');
            setStatus('error');
        }
    };

    const convertWordToPdf = async () => {
        if (!file) return;

        setStatus('processing');
        setProgress(10);

        const container = document.createElement('div');
        container.className = 'word-conversion-container';

        try {
            const arrayBuffer = await file.arrayBuffer();
            setProgress(30);

            // Mammoth extrai o HTML com suporte a imagens
            const result = await mammoth.convertToHtml({
                arrayBuffer,
                convertImage: mammoth.images.inline((element: any) => {
                    return element.read("base64").then((imageBuffer: any) => {
                        return {
                            src: "data:" + element.contentType + ";base64," + imageBuffer
                        };
                    });
                })
            });

            const html = result.value;
            if (!html || html.trim() === "") {
                throw new Error("O arquivo Word parece estar vazio ou não pôde ser lido.");
            }

            setProgress(50);

            // Montamos o container de renderização com estilos de alta fidelidade
            container.innerHTML = `
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
                    .word-conversion-container {
                        position: absolute;
                        left: -9999px;
                        top: 0;
                        width: 800px; /* Largura fixa para consistência */
                        background: white !important;
                        color: black !important;
                        font-family: 'Inter', 'Arial', sans-serif !important;
                        padding: 60px !important;
                        box-sizing: border-box !important;
                    }
                    .word-conversion-container * {
                        color: black !important;
                        background-color: transparent !important;
                        word-wrap: break-word !important;
                    }
                    .word-conversion-container img {
                        max-width: 100% !important;
                        height: auto !important;
                        display: block !important;
                        margin: 20px auto !important;
                    }
                    .word-conversion-container p {
                        margin-bottom: 12pt !important;
                        line-height: 1.6 !important;
                        font-size: 14px !important;
                    }
                    .word-conversion-container h1, .word-conversion-container h2, .word-conversion-container h3 {
                        margin: 20pt 0 10pt 0 !important;
                        font-weight: bold !important;
                    }
                    .word-conversion-container table {
                        width: 100% !important;
                        border-collapse: collapse !important;
                        margin-bottom: 20px !important;
                    }
                    .word-conversion-container td, .word-conversion-container th {
                        border: 1px solid #ccc !important;
                        padding: 8px !important;
                    }
                </style>
                <div class="content-wrapper">${html}</div>
            `;

            document.body.appendChild(container);

            // Esperar carregamento de imagens
            const images = Array.from(container.getElementsByTagName('img'));
            await Promise.all(images.map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(resolve => {
                    img.onload = resolve;
                    img.onerror = resolve;
                });
            }));

            setProgress(70);
            await new Promise(resolve => setTimeout(resolve, 1500)); // Delay para garantir renderização das fontes

            // Captura de tela do container
            const canvas = await html2canvas(container, {
                scale: 2, // Alta qualidade
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                windowWidth: 800
            });

            setProgress(90);

            // Criar PDF a partir da imagem do canvas (fidelidade visual 100%)
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'px',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgProps = pdf.getImageProperties(imgData);
            const ratio = imgProps.width / imgProps.height;
            const finalImgHeight = pdfWidth / ratio;

            // Gerenciar múltiplas páginas se o conteúdo for longo
            let heightLeft = finalImgHeight;
            let position = 0;

            pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, finalImgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft >= 0) {
                position = heightLeft - finalImgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, finalImgHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save(file.name.replace('.docx', '.pdf'));

            setProgress(100);
            setStatus('success');
        } catch (error: any) {
            console.error('Erro detalhado:', error);
            setErrorMessage(error.message || 'Falha ao converter o documento. Tente simplificar o arquivo.');
            setStatus('error');
        } finally {
            if (document.body.contains(container)) {
                document.body.removeChild(container);
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 sm:p-10">
            <div className="text-center mb-10">
                <div className="w-20 h-20 bg-orange-500/10 text-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/5">
                    <FileType size={40} />
                </div>
                <h2 className="text-3xl font-black mb-3 italic tracking-tighter uppercase">Word para PDF Pro</h2>
                <p className="text-text-main/60 max-w-md mx-auto italic font-medium">
                    Conversão de alta fidelidade visual para documentos com imagens e prints.
                </p>
            </div>

            <div className="bg-card-main border border-border-main rounded-[40px] p-8 sm:p-12 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-2 bg-text-main/5">
                    <div
                        className="h-full bg-orange-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {status === 'idle' && (
                    <div className="flex flex-col items-center">
                        <label className="w-full max-w-md aspect-video border-2 border-dashed border-border-main rounded-[32px] flex flex-col items-center justify-center cursor-pointer hover:bg-text-main/5 hover:border-text-main/20 transition-all group/upload relative overflow-hidden">
                            <input type="file" accept=".docx" onChange={handleFileChange} className="hidden" />
                            <div className="bg-text-main/5 p-5 rounded-2xl mb-4 group-hover/upload:scale-110 transition-transform">
                                <Upload size={32} className="text-text-main/40" />
                            </div>
                            <p className="font-black text-sm uppercase tracking-widest text-text-main/60">
                                {file ? file.name : "Selecionar Documento Word"}
                            </p>
                            <p className="text-[10px] uppercase tracking-[3px] font-bold mt-2 opacity-30 italic">Padrão .docx com imagens</p>
                        </label>

                        {file && (
                            <button
                                onClick={convertWordToPdf}
                                className="mt-10 w-full max-w-sm py-5 bg-text-main text-bg-main rounded-[24px] font-black uppercase tracking-[3px] text-xs shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                            >
                                Converter em Alta Definição <FileText size={18} />
                            </button>
                        )}
                    </div>
                )}

                {status === 'processing' && (
                    <div className="py-12 flex flex-col items-center">
                        <div className="relative mb-8 text-center">
                            <Loader2 size={64} className="text-orange-500 animate-spin mx-auto" />
                            <div className="mt-4 font-black text-orange-500 text-xl tracking-tighter italic uppercase">{progress}%</div>
                        </div>
                        <h3 className="text-xl font-black uppercase italic tracking-wider mb-2 text-center text-text-main">
                            {progress < 70 ? 'Lendo Documento...' : 'Gerando Visual de Alta Fidelidade...'}
                        </h3>
                        <p className="text-[10px] opacity-40 italic text-center max-w-[280px] font-bold uppercase tracking-widest">
                            Processando imagens e prints pesados. Não feche esta janela.
                        </p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="py-12 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-3xl flex items-center justify-center mb-8 animate-bounce">
                            <CheckCircle2 size={40} />
                        </div>
                        <h3 className="text-2xl font-black uppercase italic mb-4 tracking-tight text-text-main">Conversão de Elite Concluída!</h3>
                        <p className="text-sm opacity-60 italic mb-10 max-w-xs text-text-main/80 font-medium leading-relaxed">O PDF foi gerado fielmente ao conteúdo original e o download começou.</p>
                        <button
                            onClick={() => setStatus('idle')}
                            className="px-8 py-4 bg-text-main/5 hover:bg-text-main/10 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all text-text-main border border-border-main"
                        >
                            Converter outro
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="py-12 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-3xl flex items-center justify-center mb-8">
                            <AlertCircle size={40} />
                        </div>
                        <h3 className="text-xl font-black uppercase italic mb-2 tracking-tight">Falha Técnica</h3>
                        <p className="text-[10px] text-red-500/80 font-bold uppercase tracking-[2px] mb-8 italic px-4 leading-relaxed">{errorMessage}</p>
                        <button
                            onClick={() => setStatus('idle')}
                            className="px-8 py-4 bg-text-main text-bg-main rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg"
                        >
                            Tentar Novamente
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-12 bg-orange-500/5 rounded-[32px] p-8 border border-orange-500/10 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 text-orange-500 rounded-xl">
                        <Info size={20} />
                    </div>
                    <h4 className="font-black text-xs uppercase tracking-widest text-orange-600/70">
                        Tecnologia de Alta Fidelidade
                    </h4>
                </div>
                <p className="text-xs leading-relaxed opacity-70 italic font-medium text-text-main/60">
                    Diferente de conversores comuns, este motor utiliza renderização por imagem de alta definição para garantir que prints, tutoriais e esquemas visuais complexos sejam preservados exatamente como no Word original. Processamento 100% privado no seu navegador.
                </p>
            </div>
        </div>
    );
}
