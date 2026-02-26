'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Video, Scissors, Download, Upload, RefreshCw, Layers, Play, Pause, Clock, Film } from 'lucide-react';
import { cn } from '@/lib/utils';

export function VideoTrimmer() {
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [duration, setDuration] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processedUrl, setProcessedUrl] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setVideoSrc(url);
            setProcessedUrl(null);
        }
    };

    const onLoadedMetadata = () => {
        if (videoRef.current) {
            const dur = videoRef.current.duration;
            setDuration(dur);
            setEndTime(dur);
            setStartTime(0);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
            if (videoRef.current.currentTime >= endTime) {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 100);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    };

    const processVideo = async () => {
        if (!videoRef.current || !videoSrc) return;
        setIsProcessing(true);

        const video = videoRef.current;
        const stream = (video as any).captureStream ? (video as any).captureStream() : (video as any).mozCaptureStream();
        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
        const chunks: Blob[] = [];

        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            setProcessedUrl(url);
            setIsProcessing(false);
            video.pause();
        };

        // Preparation
        video.pause();
        video.currentTime = startTime;

        // Start recording when seeking is done
        const onSeeked = () => {
            video.removeEventListener('seeked', onSeeked);
            recorder.start();
            video.play();
            setIsPlaying(true);

            const checkEnd = () => {
                if (video.currentTime >= endTime) {
                    video.removeEventListener('timeupdate', checkEnd);
                    recorder.stop();
                    video.pause();
                    setIsPlaying(false);
                } else {
                    requestAnimationFrame(checkEnd);
                }
            };
            requestAnimationFrame(checkEnd);
        };

        video.addEventListener('seeked', onSeeked);
    };

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) videoRef.current.pause();
        else {
            if (videoRef.current.currentTime >= endTime) {
                videoRef.current.currentTime = startTime;
            }
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Editor de Vídeo</label>
                        {videoSrc && (
                            <div className="flex items-center gap-3 text-[10px] font-black opacity-30 uppercase tracking-[2px]">
                                <Clock size={12} /> {formatTime(duration)}
                            </div>
                        )}
                    </div>

                    <div className="relative bg-black rounded-[48px] shadow-2xl overflow-hidden aspect-video flex items-center justify-center group">
                        {!videoSrc ? (
                            <label className="flex flex-col items-center gap-6 cursor-pointer hover:scale-105 transition-all text-white">
                                <div className="w-20 h-20 bg-white text-black rounded-[28px] flex items-center justify-center shadow-2xl transition-transform">
                                    <Film size={40} />
                                </div>
                                <div className="text-center">
                                    <h4 className="font-black text-xl">Upload de Vídeo</h4>
                                    <p className="text-xs opacity-40 font-bold uppercase tracking-widest mt-2">MP4, WebM ou OGG (Local only)</p>
                                </div>
                                <input type="file" accept="video/*" onChange={handleUpload} className="hidden" />
                            </label>
                        ) : (
                            <>
                                <video
                                    ref={videoRef}
                                    src={videoSrc}
                                    className="w-full h-full object-contain"
                                    onLoadedMetadata={onLoadedMetadata}
                                    onTimeUpdate={handleTimeUpdate}
                                />
                                {isProcessing && (
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-50 text-white">
                                        <RefreshCw size={48} className="animate-spin mb-4" />
                                        <p className="font-black uppercase tracking-widest text-sm">Gravando Segmento...</p>
                                        <p className="text-[10px] opacity-50 mt-2">Aguarde o vídeo rodar até o ponto final</p>
                                    </div>
                                )}
                                <button
                                    onClick={togglePlay}
                                    className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                >
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                                        {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                                    </div>
                                </button>
                            </>
                        )}
                    </div>

                    {videoSrc && (
                        <div className="bg-card-main border border-border-main p-8 rounded-[40px] shadow-sm space-y-8">
                            <div className="space-y-6">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-1">Intervalo de Corte</p>
                                        <p className="text-xl font-black italic">
                                            {formatTime(startTime)} <span className="mx-2 opacity-20">—</span> {formatTime(endTime)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-1">Duração Final</p>
                                        <p className="text-lg font-bold text-text-main/60">{formatTime(endTime - startTime)}</p>
                                    </div>
                                </div>

                                <div className="relative h-12 flex items-center">
                                    {/* Track */}
                                    <div className="absolute inset-x-0 h-2 bg-text-main/5 rounded-full" />
                                    {/* Selection Range */}
                                    <div
                                        className="absolute h-2 bg-text-main/20 rounded-full"
                                        style={{
                                            left: `${(startTime / duration) * 100}%`,
                                            right: `${100 - (endTime / duration) * 100}%`
                                        }}
                                    />
                                    {/* Start Handle */}
                                    <input
                                        type="range"
                                        min="0"
                                        max={duration}
                                        step="0.01"
                                        value={startTime}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            setStartTime(Math.min(val, endTime - 0.1));
                                            if (videoRef.current) videoRef.current.currentTime = val;
                                        }}
                                        className="absolute w-full appearance-none bg-transparent pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-text-main [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:transition-transform"
                                    />
                                    {/* End Handle */}
                                    <input
                                        type="range"
                                        min="0"
                                        max={duration}
                                        step="0.01"
                                        value={endTime}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            setEndTime(Math.max(val, startTime + 0.1));
                                            if (videoRef.current) videoRef.current.currentTime = val;
                                        }}
                                        className="absolute w-full appearance-none bg-transparent pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-text-main [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-bg-main [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:transition-transform"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-6">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Exportação</label>
                    <div className="bg-card-main border border-border-main p-8 rounded-[40px] flex flex-col gap-8 shadow-sm">
                        <div className="space-y-4">
                            <button
                                disabled={!videoSrc || isProcessing}
                                onClick={processVideo}
                                className="w-full py-5 bg-text-main text-bg-main rounded-[24px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center gap-3"
                            >
                                <Scissors size={20} /> Processar Corte
                            </button>

                            {processedUrl && (
                                <button
                                    onClick={() => {
                                        const a = document.createElement('a');
                                        a.href = processedUrl;
                                        a.download = `trimmed_video.webm`;
                                        a.click();
                                    }}
                                    className="w-full py-5 bg-green-500 text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 animate-in zoom-in-95 duration-300"
                                >
                                    <Download size={20} /> Baixar Vídeo (.webm)
                                </button>
                            )}
                        </div>

                        {videoSrc && (
                            <button
                                onClick={() => {
                                    setVideoSrc(null);
                                    setProcessedUrl(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="w-full py-4 border-2 border-text-main/10 hover:bg-red-500/10 hover:text-red-500 rounded-[24px] font-bold text-sm transition-all flex items-center justify-center gap-2 mt-4"
                            >
                                <RefreshCw size={18} /> Novo Vídeo
                            </button>
                        )}
                    </div>

                    <div className="p-8 bg-blue-500/5 rounded-[40px] border border-blue-500/10 flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-blue-600/60 uppercase tracking-widest font-black text-[10px]">
                            <Layers size={14} /> Nota de Performance
                        </div>
                        <p className="text-xs font-medium text-blue-600/60 leading-relaxed uppercase tracking-wider">
                            Este cortador utiliza a API MediaRecorder. Para processar, o vídeo será reproduzido em tempo real entre os pontos de início e fim. Não feche a aba durante o processamento.
                        </p>
                    </div>
                </div>
            </div>
            <style jsx global>{`
                input[type='range']::-webkit-slider-thumb {
                    -webkit-appearance: none;
                }
                input[type='range']::-moz-range-thumb {
                    border: none;
                }
            `}</style>
        </div>
    );
}
