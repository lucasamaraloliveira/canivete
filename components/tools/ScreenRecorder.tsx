'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Monitor, Video, Square, Download, Trash2, Play, Circle, Settings2, Mic, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ScreenRecorder() {
    const [recording, setRecording] = useState(false);
    const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
    const [timer, setTimer] = useState(0);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const previewRef = useRef<HTMLVideoElement | null>(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: audioEnabled
            });

            // If audio enabled, merge with mic if wanted, but simpler to just use display audio for now
            // or we could use navigator.mediaDevices.getUserMedia for mic and merge. 
            // Keeping it simple with display media first.

            if (previewRef.current) {
                previewRef.current.srcObject = stream;
            }

            const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            mediaRecorderRef.current = recorder;
            chunksRef.current = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                setVideoBlob(blob);
                setRecording(false);
                setTimer(0);
                if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
                if (previewRef.current) previewRef.current.srcObject = null;
            };

            recorder.start();
            setRecording(true);
            setVideoBlob(null);

            setTimer(0);
            timerIntervalRef.current = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error("Error accessing display media:", err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && recording) {
            mediaRecorderRef.current.stop();
        }
    };

    const downloadVideo = () => {
        if (!videoBlob) return;
        const url = URL.createObjectURL(videoBlob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `recording_${new Date().getTime()}.webm`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 min-h-0">
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-3 h-3 rounded-full transition-all",
                                recording ? "bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-text-main/20"
                            )} />
                            <h3 className="text-xl font-black uppercase tracking-tight">
                                {recording ? 'Gravando Agora' : 'Pronto para Gravar'}
                            </h3>
                        </div>
                        {recording && (
                            <div className="px-6 py-2 bg-text-main/5 border border-border-main/10 rounded-full font-mono text-2xl font-black italic">
                                {formatTime(timer)}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 bg-black rounded-[48px] shadow-2xl overflow-hidden relative group border-4 border-text-main/5 min-h-[400px] flex items-center justify-center">
                        <video
                            ref={previewRef}
                            autoPlay
                            muted
                            className={cn("w-full h-full object-contain", !recording && "hidden")}
                        />

                        {!recording && !videoBlob && (
                            <div className="flex flex-col items-center gap-6 opacity-30 group-hover:opacity-100 transition-all">
                                <Monitor size={80} strokeWidth={1} />
                                <button
                                    onClick={startRecording}
                                    className="px-12 py-5 bg-text-main text-bg-main rounded-3xl font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all"
                                >
                                    Iniciar Captura
                                </button>
                            </div>
                        )}

                        {videoBlob && !recording && (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-8 bg-text-main/5 backdrop-blur-sm p-12">
                                <div className="p-8 bg-card-main rounded-[40px] shadow-2xl border border-border-main/10 flex flex-col items-center gap-6">
                                    <div className="w-24 h-24 bg-green-500 text-white rounded-[32px] flex items-center justify-center shadow-xl">
                                        <Video size={48} />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <h4 className="text-xl font-black uppercase italic tracking-tighter">Gravação Concluída</h4>
                                        <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Arquivo WebM pronto para download</p>
                                    </div>
                                    <div className="flex gap-4 w-full">
                                        <button
                                            onClick={downloadVideo}
                                            className="flex-1 py-4 bg-text-main text-bg-main rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-102 transition-all"
                                        >
                                            <Download size={20} /> Baixar
                                        </button>
                                        <button
                                            onClick={() => setVideoBlob(null)}
                                            className="px-6 py-4 bg-red-500/10 text-red-500 rounded-2xl font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {recording && (
                            <button
                                onClick={stopRecording}
                                className="absolute bottom-12 left-1/2 -translate-x-1/2 px-12 py-5 bg-red-500 text-white rounded-3xl font-black uppercase tracking-widest shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-3 animate-bounce-slow"
                            >
                                <Square size={24} fill="currentColor" /> Parar Gravação
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Ajustes</label>
                    <div className="bg-card-main border border-border-main p-8 rounded-[40px] flex flex-col gap-8 shadow-sm">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-text-main/5 rounded-2xl border border-border-main/5">
                                <div className="flex items-center gap-3">
                                    <Volume2 size={16} className="opacity-40" />
                                    <span className="text-xs font-bold opacity-60 uppercase tracking-wider">Áudio do Sistema</span>
                                </div>
                                <button
                                    onClick={() => setAudioEnabled(!audioEnabled)}
                                    disabled={recording}
                                    className={cn(
                                        "w-12 h-6 rounded-full p-1 transition-all duration-300 disabled:opacity-20",
                                        audioEnabled ? "bg-blue-500" : "bg-text-main/20"
                                    )}
                                >
                                    <div className={cn(
                                        "w-4 h-4 bg-white rounded-full transition-all duration-300",
                                        audioEnabled ? "translate-x-6" : "translate-x-0"
                                    )} />
                                </button>
                            </div>

                            <div className="p-6 bg-yellow-500/5 border border-yellow-500/10 rounded-3xl space-y-3">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-yellow-600/60 tracking-widest">
                                    <Settings2 size={14} /> Dica Importante
                                </div>
                                <p className="text-[10px] font-medium opacity-50 uppercase leading-relaxed tracking-wider">
                                    Ao clicar em capturar, selecione 'Aba do Navegador' ou 'Tela Inteira' e lembre-se de marcar 'Compartilhar Áudio' se precisar do som.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto bg-text-main/5 p-8 rounded-[40px] border border-border-main/10 flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-[10px] font-black opacity-30 uppercase tracking-widest">
                            <Circle size={10} className="fill-red-500 text-red-500" /> WebCodecs ready
                        </div>
                        <p className="text-[10px] font-medium opacity-30 uppercase leading-relaxed tracking-wider leading-relaxed">
                            A gravação é processada inteiramente no seu navegador via MediaStream API. Nenhum dado é enviado para a nuvem.
                        </p>
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes bounce-slow {
                    0%, 100% { transform: translate(-50%, 0); }
                    50% { transform: translate(-50%, -5px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 2s ease-in-out infinite;
                }
            `}} />
        </div>
    );
}
