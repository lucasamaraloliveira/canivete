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
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                return false;
            }

            // Bloquear Ctrl+Shift+J (Console)
            if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                e.preventDefault();
                return false;
            }

            // Bloquear Ctrl+U (Ver Código Fonte)
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                return false;
            }

            // Bloquear Ctrl+S (Salvar Página)
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                return false;
            }
        };

        // 3. "Anti-Debugger" - Cria um loop que pausa o script se o DevTools for aberto
        const preventInspection = () => {
            setInterval(() => {
                (function () {
                    const start = new Date().getTime();
                    debugger;
                    const end = new Date().getTime();
                    if (end - start > 100) {
                        // Se demorar mais que 100ms entre o debugger e o próximo passo, 
                        // provavelmente o DevTools está aberto e pausou aqui.
                        console.clear();
                    }
                })();
            }, 1000);
        };

        if (process.env.NODE_ENV === 'production') {
            document.addEventListener('contextmenu', handleContextMenu);
            document.addEventListener('keydown', handleKeyDown);
            preventInspection();
        }

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return null;
}
