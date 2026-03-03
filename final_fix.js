const fs = require('fs');

let pageContent = fs.readFileSync('d:/AlrionTech/Portifólio/canivete/app/page.tsx', 'utf8');
const lines = pageContent.split('\n');

const startRenderer = lines.findIndex(l => l.includes('// Tool Implementation Components'));
const endRenderer = lines.findIndex(l => l.includes('export default function Page() {'));

if (startRenderer !== -1 && endRenderer !== -1) {
    const rendererLines = lines.slice(startRenderer, endRenderer);
    const rendererContent = [
        '\"use client\";',
        '',
        'import React from \"react\";',
        'import dynamic from \"next/dynamic\";',
        'import { Settings, RotateCcw } from \"lucide-react\";',
        '',
        ...rendererLines,
        '',
        'export { ToolRenderer };'
    ].join('\n');
    fs.writeFileSync('d:/AlrionTech/Portifólio/canivete/components/ToolRenderer.tsx', rendererContent);

    // Remove the moved parts from page
    lines.splice(startRenderer, endRenderer - startRenderer, 'const ToolRenderer = dynamic(() => import(\'@/components/ToolRenderer\').then(mod => mod.ToolRenderer), { loading: () => <div className=\"p-12 text-center text-text-main/50\">Carregando otimizações...</div> });');
    pageContent = lines.join('\n');
}

// ACCESSIBILITY FIXES
// Buttons accessibility labels
pageContent = pageContent.replace(/<button\n\s+onClick={\(\) => { setSelectedCategory\(null\); setSelectedToolId\(null\); }}/g, '<button\n              aria-label=\"Ir para Dashboard\" \n              onClick={() => { setSelectedCategory(null); setSelectedToolId(null); }}');

pageContent = pageContent.replace(/<button\n\s+onClick={\(\) => setIsSidebarOpen\(true\)}/g, '<button\n              aria-label=\"Abrir Menu de Categorias\" \n              onClick={() => setIsSidebarOpen(true)}');

pageContent = pageContent.replace(/<button\n\s+onClick={toggleTheme}\n\s+className=\"flex flex-col items-center gap-1 p-3 rounded-2xl text-text-main\/70 flex-1 transition-all active:scale-90\"/g, '<button\n              aria-label=\"Alternar Tema\"\n              onClick={toggleTheme}\n              className=\"flex flex-col items-center gap-1 p-3 rounded-2xl text-text-main/70 flex-1 transition-all active:scale-90\"');

pageContent = pageContent.replace(/<button\n\s+onClick={\(\) => setIsSidebarOpen\(false\)}/g, '<button\n                aria-label=\"Fechar Menu\"\n                onClick={() => setIsSidebarOpen(false)}');

pageContent = pageContent.replace(/<button\n\s+onClick={\(\) => setIsSidebarOpen\(!isSidebarOpen\)}/g, '<button\n              aria-label={isSidebarOpen ? \"Fechar Menu\" : \"Abrir Menu\"}\n              onClick={() => setIsSidebarOpen(!isSidebarOpen)}');

pageContent = pageContent.replace(/<button\n\s+onClick={\(\) => setIsDonationModalOpen\(true\)}/g, '<button\n                aria-label=\"Apoiar o Projeto\"\n                onClick={() => setIsDonationModalOpen(true)}');

// Contrast fixes (opacity)
pageContent = pageContent.replace(/text-text-main\/60/g, 'text-text-main/80');
pageContent = pageContent.replace(/text-text-main\/30/g, 'text-text-main/70');
pageContent = pageContent.replace(/opacity-70/g, 'opacity-90');
pageContent = pageContent.replace(/opacity-60/g, 'opacity-85');

// Cleanup: replace motion.button with button in the tools list
pageContent = pageContent.replace(/<motion\.button\n\s+key={tool\.id}\n\s+whileHover={{ y: -4, scale: 1\.02 }}\n\s+whileTap={{ scale: 0\.98 }}/g, '<button\n                      key={tool.id}');
pageContent = pageContent.replace(/<\/motion\.button>/g, '</button>');
pageContent = pageContent.replace(/transition-all text-left flex flex-col h-full/g, 'transition-all hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] duration-200 text-left flex flex-col h-full');

fs.writeFileSync('d:/AlrionTech/Portifólio/canivete/app/page.tsx', pageContent);
console.log('Final fix applied.');
