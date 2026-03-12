"use client";

import { useEffect } from 'react';

export function SecurityShield() {
    useEffect(() => {
        // 1. Bloquear Clique Direito
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            return false;
        };

        // 2. Bloquear Atalhos de Inspeção (F12, Ctrl+Shift+I, Ctrl+U, etc.)
        const handleKeyDown = (e: KeyboardEvent) => {
            // Bloquear F12
            if (e.key === 'F12') {
                e.preventDefault();
                return false;
            }

            // Bloquear Ctrl+Shift+I (Inspecionar)
            if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
                e.preventDefault();
                return false;
            }

            // Bloquear Ctrl+Shift+J (Console)
            if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
                e.preventDefault();
                return false;
            }

            // Bloquear Ctrl+Shift+C (Inspecionar Elemento)
            if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
                e.preventDefault();
                return false;
            }

            // Bloquear Ctrl+U (Ver Código Fonte)
            if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
                e.preventDefault();
                return false;
            }

            // Bloquear Ctrl+S (Salvar Página)
            if (e.ctrlKey && (e.key === 'S' || e.key === 's')) {
                e.preventDefault();
                return false;
            }
        };

        // 3. "Anti-Debugger" - Cria um loop que pausa o script se o DevTools for aberto
        const preventInspection = () => {
            const check = () => {
                const start = new Date().getTime();
                debugger;
                const end = new Date().getTime();
                if (end - start > 100) {
                    console.clear();
                    // Opcional: Redirecionar ou mostrar mensagem
                }
            };
            
            const interval = setInterval(check, 2000);
            return () => clearInterval(interval);
        };

        if (process.env.NODE_ENV === 'production') {
            document.addEventListener('contextmenu', handleContextMenu);
            document.addEventListener('keydown', handleKeyDown);

            const cleanupDebugger = preventInspection();
            
            return () => {
                document.removeEventListener('contextmenu', handleContextMenu);
                document.removeEventListener('keydown', handleKeyDown);
                cleanupDebugger();
            };
        }

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return null;
}
