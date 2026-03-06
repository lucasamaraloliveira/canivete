"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, GripVertical, Info, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { CustomSelect } from '../CustomSelect';

type Priority = 'urgent-important' | 'not-urgent-important' | 'urgent-not-important' | 'not-urgent-not-important';

interface Task {
    id: string;
    text: string;
    priority: Priority;
    completed: boolean;
}

export function EisenhowerMatrix() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState('');
    const [selectedPriority, setSelectedPriority] = useState<Priority>('urgent-important');

    useEffect(() => {
        const saved = localStorage.getItem('eisenhower_tasks');
        if (saved) setTasks(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem('eisenhower_tasks', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newTask.trim()) return;
        const task: Task = {
            id: Math.random().toString(36).substr(2, 9),
            text: newTask,
            priority: selectedPriority,
            completed: false
        };
        setTasks([task, ...tasks]);
        setNewTask('');
    };

    const toggleTask = (id: string) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const quadrants = [
        { id: 'urgent-important', label: 'Fazer Relevante', color: 'bg-red-500', desc: 'Urgente e Importante' },
        { id: 'not-urgent-important', label: 'Agendar', color: 'bg-blue-500', desc: 'Importante, não Urgente' },
        { id: 'urgent-not-important', label: 'Delegar', color: 'bg-orange-500', desc: 'Urgente, não Importante' },
        { id: 'not-urgent-not-important', label: 'Eliminar', color: 'bg-gray-500', desc: 'Nem Urgente, nem Importante' },
    ];

    return (
        <div className="space-y-8 flex flex-col h-[700px]">
            <form onSubmit={addTask} className="flex flex-col sm:flex-row gap-4 p-6 bg-text-main/5 border border-border-main rounded-[32px]">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Adicionar nova tarefa..."
                    className="flex-1 bg-bg-main border border-border-main rounded-2xl px-6 py-4 font-medium outline-none focus:ring-2 focus:ring-text-main/10 transition-all"
                />
                <CustomSelect
                    value={selectedPriority}
                    onChange={(val) => setSelectedPriority(val as Priority)}
                    options={quadrants.map(q => ({ label: q.label, value: q.id }))}
                />
                <button
                    type="submit"
                    className="bg-text-main text-bg-main px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                    <Plus size={18} /> Adicionar
                </button>
            </form>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                {quadrants.map(q => (
                    <div
                        key={q.id}
                        className="bg-card-main border border-border-main rounded-[32px] overflow-hidden flex flex-col"
                    >
                        <div className={cn("px-6 py-4 flex items-center justify-between text-white", q.color)}>
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-[3px]">{q.label}</h3>
                                <p className="text-[10px] opacity-80 italic font-medium">{q.desc}</p>
                            </div>
                            <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black">
                                {tasks.filter(t => t.priority === q.id).length}
                            </span>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-2">
                            {tasks.filter(t => t.priority === q.id).length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-20 py-10">
                                    <Check size={32} className="mb-2" />
                                    <p className="text-xs font-bold uppercase tracking-widest text-center">Nenhuma tarefa</p>
                                </div>
                            ) : (
                                tasks.filter(t => t.priority === q.id).map(task => (
                                    <div
                                        key={task.id}
                                        className={cn(
                                            "group p-4 bg-text-main/5 border border-border-main/5 rounded-2xl flex items-center gap-3 transition-all hover:bg-text-main/10",
                                            task.completed && "opacity-50"
                                        )}
                                    >
                                        <button
                                            onClick={() => toggleTask(task.id)}
                                            className={cn(
                                                "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                                                task.completed ? "bg-green-500 border-green-500 text-white" : "border-text-main/10 hover:border-text-main/30"
                                            )}
                                        >
                                            {task.completed && <Check size={14} />}
                                        </button>
                                        <span className={cn("flex-1 text-sm font-medium", task.completed && "line-through")}>
                                            {task.text}
                                        </span>
                                        <button
                                            onClick={() => deleteTask(task.id)}
                                            className="p-2 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-3 px-6 py-4 bg-blue-500/5 text-blue-600 dark:text-blue-400 rounded-2xl border border-blue-500/10">
                <Info size={16} />
                <p className="text-[10px] font-bold uppercase tracking-wider">
                    Dica: Foque no quadrante "Fazer Relevante" e tente eliminar o que está no quadrante "Eliminar".
                </p>
            </div>
        </div>
    );
}
