"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Clock, Plus, Trash2, Info, ChevronRight, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, addHours, startOfHour } from 'date-fns';

const toZonedTime = (date: Date, timeZone: string) => {
    const zonedDate = new Date(date.toLocaleString('en-US', { timeZone }));
    return zonedDate;
};

interface Location {
    id: string;
    city: string;
    tz: string;
}

export function WorldTimePlanner() {
    const [selectedTime, setSelectedTime] = useState(startOfHour(new Date()));
    const [locations, setLocations] = useState<Location[]>([
        { id: '1', city: 'São Paulo', tz: 'America/Sao_Paulo' },
        { id: '2', city: 'Nova York', tz: 'America/New_York' },
        { id: '3', city: 'Londres', tz: 'Europe/London' },
        { id: '4', city: 'Tóquio', tz: 'Asia/Tokyo' }
    ]);

    const timeRange = useMemo(() => {
        return Array.from({ length: 24 }).map((_, i) => addHours(selectedTime, i - 12));
    }, [selectedTime]);

    const getStatusColor = (hour: number) => {
        if (hour >= 9 && hour < 18) return 'bg-green-500/20 text-green-600 dark:text-green-400'; // Work hours
        if (hour >= 18 && hour < 22) return 'bg-orange-500/20 text-orange-600 dark:text-orange-400'; // Personal hours
        return 'bg-red-500/20 text-red-600 dark:text-red-400'; // Sleeping
    };

    return (
        <div className="space-y-8 flex flex-col h-full overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 bg-text-main/5 border border-border-main rounded-[32px]">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-text-main text-bg-main rounded-[20px] flex items-center justify-center shadow-lg">
                        <Clock size={28} />
                    </div>
                    <div>
                        <h3 className="font-black text-xl leading-tight">Planejador Global</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Arraste para ajustar o horário base</p>
                    </div>
                </div>
                <input
                    type="datetime-local"
                    value={format(selectedTime, "yyyy-MM-dd'T'HH:mm")}
                    onChange={(e) => setSelectedTime(new Date(e.target.value))}
                    className="bg-bg-main border border-border-main rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-text-main/10"
                />
            </div>

            <div className="flex-1 overflow-x-auto custom-scrollbar pb-6">
                <div className="min-w-[1200px] space-y-4">
                    {locations.map((loc) => (
                        <div key={loc.id} className="flex items-center gap-4 group">
                            <div className="w-48 shrink-0 bg-card-main border border-border-main p-4 rounded-2xl shadow-sm">
                                <h4 className="font-bold text-sm truncate">{loc.city}</h4>
                                <p className="text-[10px] opacity-40 italic">{loc.tz.split('/')[1].replace('_', ' ')}</p>
                                <p className="text-xl font-black mt-2">
                                    {format(toZonedTime(selectedTime, loc.tz), 'HH:mm')}
                                </p>
                            </div>

                            <div className="flex-1 flex gap-1 h-20 items-center">
                                {timeRange.map((dt, idx) => {
                                    const zoned = toZonedTime(dt, loc.tz);
                                    const hour = zoned.getHours();
                                    const isTarget = format(dt, 'HH') === format(selectedTime, 'HH');

                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => setSelectedTime(dt)}
                                            className={cn(
                                                "flex-1 h-14 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer hover:scale-105",
                                                getStatusColor(hour),
                                                isTarget && "ring-2 ring-text-main scale-110 shadow-xl z-10"
                                            )}
                                        >
                                            <span className="text-[10px] font-black">{hour.toString().padStart(2, '0')}</span>
                                            {hour === 0 && <Globe size={10} className="mt-1 opacity-40" />}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 px-4 py-3 bg-green-500/10 text-green-600 rounded-2xl border border-green-500/5">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Horário Comercial (9:00 - 18:00)</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 bg-orange-500/10 text-orange-600 rounded-2xl border border-orange-500/5">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Horário Pessoal</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 text-red-600 rounded-2xl border border-red-500/5">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#991b1b]">Madrugada / Sono</span>
                </div>
            </div>
        </div>
    );
}
