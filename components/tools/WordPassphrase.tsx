import React, { useState, useEffect } from 'react';
import { Shield, RefreshCw, Copy, Check, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const WORD_LIST = [
    "casa", "mesa", "livro", "tempo", "mundo", "agua", "fogo", "terra", "vento", "sol",
    "lua", "mar", "rio", "monte", "floresta", "animal", "planta", "fruta", "comida", "bebiba",
    "vida", "amor", "paz", "alegria", "corpo", "alma", "mente", "coracao", "olho", "mao",
    "pe", "cabeca", "roupa", "sapato", "carro", "trem", "aviao", "barco", "cidade", "rua",
    "estrada", "ponte", "predio", "escola", "trabalho", "dinheiro", "carta", "livro", "papel", "caneta",
    "brasil", "portugal", "angola", "mocambique", "verão", "inverno", "outono", "primavera", "noite", "dia",
    "manhã", "tarde", "azul", "verde", "amarelo", "vermelho", "branco", "preto", "cinza", "roxo",
    "veloz", "lento", "forte", "fraco", "grande", "pequeno", "novo", "velho", "claro", "escuro",
    "doce", "salgado", "amargo", "quente", "frio", "seco", "molhado", "duro", "mole", "limpo",
    "sujo", "bom", "mau", "justo", "certo", "errado", "fácil", "difícil", "aberto", "fechado"
];

export function WordPassphrase() {
    const [wordCount, setWordCount] = useState(4);
    const [separator, setSeparator] = useState('-');
    const [useNumbers, setUseNumbers] = useState(false);
    const [passphrase, setPassphrase] = useState('');
    const [copied, setCopied] = useState(false);

    const generatePassphrase = () => {
        const selectedWords: string[] = [];
        const array = new Uint32Array(wordCount);
        window.crypto.getRandomValues(array);

        for (let i = 0; i < wordCount; i++) {
            let word = WORD_LIST[array[i] % WORD_LIST.length];
            if (useNumbers) {
                word += (array[i] % 10).toString();
            }
            selectedWords.push(word);
        }

        setPassphrase(selectedWords.join(separator));
    };

    useEffect(() => {
        generatePassphrase();
    }, [wordCount, separator, useNumbers]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(passphrase);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-2xl mx-auto flex flex-col gap-8 h-full justify-center">
            <div className="text-center">
                <div className="w-16 h-16 bg-text-main/5 rounded-2xl flex items-center justify-center text-text-main mx-auto mb-4">
                    <Shield size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Word Passphrase Gen</h3>
                <p className="text-text-main/50">Crie senhas fáceis de lembrar e difíceis de quebrar (Diceware).</p>
            </div>

            <div className="bg-bg-main p-6 rounded-3xl border border-border-main space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider opacity-40">Quantidade de Palavras: {wordCount}</label>
                            <input
                                type="range"
                                min="3"
                                max="10"
                                value={wordCount}
                                onChange={(e) => setWordCount(parseInt(e.target.value))}
                                className="accent-text-main"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider opacity-40">Separador</label>
                            <div className="grid grid-cols-4 gap-2">
                                {['-', '.', '_', ' '].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setSeparator(s)}
                                        className={cn(
                                            "py-2 rounded-xl text-sm font-bold transition-all border",
                                            separator === s
                                                ? "bg-text-main text-bg-main border-text-main"
                                                : "bg-text-main/5 border-transparent hover:bg-text-main/10"
                                        )}
                                    >
                                        {s === ' ' ? 'Espaço' : s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-end">
                        <button
                            onClick={() => setUseNumbers(!useNumbers)}
                            className={cn(
                                "w-full flex items-center justify-between p-4 rounded-2xl border transition-all",
                                useNumbers
                                    ? "bg-text-main/10 border-text-main/20 text-text-main"
                                    : "bg-text-main/5 border-transparent opacity-60"
                            )}
                        >
                            <span className="font-bold text-sm">Incluir Números</span>
                            <div className={cn(
                                "w-10 h-6 rounded-full relative transition-colors",
                                useNumbers ? "bg-text-main" : "bg-text-main/20"
                            )}>
                                <div className={cn(
                                    "absolute top-1 w-4 h-4 bg-bg-main rounded-full transition-all",
                                    useNumbers ? "left-5" : "left-1"
                                )} />
                            </div>
                        </button>
                    </div>
                </div>

                <div className="relative group">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider opacity-40">Sua Passphrase</label>
                        <div className="bg-text-main/5 p-6 rounded-2xl text-center font-bold text-lg lg:text-xl border border-border-main min-h-[80px] flex items-center justify-center break-all">
                            {passphrase}
                        </div>
                    </div>
                    <div className="absolute top-8 right-2 flex gap-2">
                        <button
                            onClick={generatePassphrase}
                            className="p-2 bg-text-main/10 hover:bg-text-main/20 rounded-lg transition-colors"
                            title="Regerar"
                        >
                            <RefreshCw size={18} />
                        </button>
                        <button
                            onClick={copyToClipboard}
                            className="p-2 bg-text-main text-bg-main rounded-lg transition-colors flex items-center gap-2"
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-3xl text-blue-600">
                <h4 className="text-sm font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
                    <Info size={16} /> Entendendo a Segurança
                </h4>
                <p className="text-xs leading-relaxed">
                    Uma senha como `casa-mesa-livro-tempo` é muito mais resistente a ataques de força bruta do que `C4s4$!123`,
                    porque possui maior entropia e é significativamente mais fácil de ser memorizada por humanos.
                </p>
            </div>
        </div>
    );
}
