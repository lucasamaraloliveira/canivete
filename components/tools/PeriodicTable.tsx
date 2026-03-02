import React, { useState, useMemo } from 'react';
import { Atom, Info, X, Zap, Thermometer, Weight, Hash, Orbit } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface Element {
    symbol: string;
    name: string;
    number: number;
    weight: string;
    category: string;
    x: number;
    y: number;
    summary?: string;
    melt?: number;
    boil?: number;
    discovered_by?: string;
    phase?: 'Gas' | 'Solid' | 'Liquid';
}

const ELEMENTS: Element[] = [
    // Row 1
    { number: 1, symbol: "H", name: "Hidrogênio", weight: "1.008", category: "diatomic nonmetal", x: 1, y: 1, summary: "O elemento mais abundante no universo.", phase: 'Gas' },
    { number: 2, symbol: "He", name: "Hélio", weight: "4.0026", category: "noble gas", x: 18, y: 1, summary: "Gás inerte e segundo elemento mais leve.", phase: 'Gas' },
    // Row 2
    { number: 3, symbol: "Li", name: "Lítio", weight: "6.94", category: "alkali metal", x: 1, y: 2, summary: "Metal de baixa densidade usado em baterias.", phase: 'Solid' },
    { number: 4, symbol: "Be", name: "Berílio", weight: "9.0122", category: "alkaline earth metal", x: 2, y: 2, summary: "Metal raro e leve usado em ligas e radiografia.", phase: 'Solid' },
    { number: 5, symbol: "B", name: "Boro", weight: "10.81", category: "metalloid", x: 13, y: 2, summary: "Semimetal usado na fabricação de vidro borossilicato.", phase: 'Solid' },
    { number: 6, symbol: "C", name: "Carbono", weight: "12.011", category: "polyatomic nonmetal", x: 14, y: 2, summary: "A base da vida e de compostos orgânicos.", phase: 'Solid' },
    { number: 7, symbol: "N", name: "Nitrogênio", weight: "14.007", category: "diatomic nonmetal", x: 15, y: 2, summary: "Essencial para a vida e principal componente da atmosfera.", phase: 'Gas' },
    { number: 8, symbol: "O", name: "Oxigênio", weight: "15.999", category: "diatomic nonmetal", x: 16, y: 2, summary: "Necessário para a respiração celular e combustão.", phase: 'Gas' },
    { number: 9, symbol: "F", name: "Flúor", weight: "18.998", category: "diatomic nonmetal", x: 17, y: 2, summary: "O elemento mais eletronegativo da tabela.", phase: 'Gas' },
    { number: 10, symbol: "Ne", name: "Neônio", weight: "20.180", category: "noble gas", x: 18, y: 2, summary: "Famoso por seu brilho vermelho em lâmpadas de néon.", phase: 'Gas' },
    // Row 3
    { number: 11, symbol: "Na", name: "Sódio", weight: "22.990", category: "alkali metal", x: 1, y: 3, summary: "Metal altamente reativo encontrado no sal de cozinha.", phase: 'Solid' },
    { number: 12, symbol: "Mg", name: "Magnésio", weight: "24.305", category: "alkaline earth metal", x: 2, y: 3, summary: "Metal essencial para a fisiologia humana e fotossíntese.", phase: 'Solid' },
    { number: 13, symbol: "Al", name: "Alumínio", weight: "26.982", category: "post-transition metal", x: 13, y: 3, summary: "Metal leve e durável muito comum em embalagens.", phase: 'Solid' },
    { number: 14, symbol: "Si", name: "Silício", weight: "28.085", category: "metalloid", x: 14, y: 3, summary: "Base da tecnologia de semicondutores e microchips.", phase: 'Solid' },
    { number: 15, symbol: "P", name: "Fósforo", weight: "30.974", category: "polyatomic nonmetal", x: 15, y: 3, summary: "Essencial para ossos e síntese de DNA.", phase: 'Solid' },
    { number: 16, symbol: "S", name: "Enxofre", weight: "32.06", category: "polyatomic nonmetal", x: 16, y: 3, summary: "Elemento amarelo conhecido por seu cheiro característico.", phase: 'Solid' },
    { number: 17, symbol: "Cl", name: "Cloro", weight: "35.45", category: "diatomic nonmetal", x: 17, y: 3, summary: "Gás tóxico usado para purificação de água.", phase: 'Gas' },
    { number: 18, symbol: "Ar", name: "Argônio", weight: "39.948", category: "noble gas", x: 18, y: 3, summary: "Gás nobre usado em soldagem e conservação.", phase: 'Gas' },
    // Row 4
    { number: 19, symbol: "K", name: "Potássio", weight: "39.098", category: "alkali metal", x: 1, y: 4, summary: "Mineral vital para o equilíbrio hídrico celular.", phase: 'Solid' },
    { number: 20, symbol: "Ca", name: "Cálcio", weight: "40.078", category: "alkaline earth metal", x: 2, y: 4, summary: "Essencial para a formação de ossos e dentes.", phase: 'Solid' },
    { number: 21, symbol: "Sc", name: "Escândio", weight: "44.955", category: "transition metal", x: 3, y: 4, summary: "Usado em ligas aeroespaciais e lâmpadas de alta intensidade.", phase: 'Solid' },
    { number: 22, symbol: "Ti", name: "Titânio", weight: "47.867", category: "transition metal", x: 4, y: 4, summary: "Famoso por sua alta resistência e baixa densidade.", phase: 'Solid' },
    { number: 23, symbol: "V", name: "Vanádio", weight: "50.941", category: "transition metal", x: 5, y: 4, summary: "Usado para endurecer aços especiais.", phase: 'Solid' },
    { number: 24, symbol: "Cr", name: "Cromo", weight: "51.996", category: "transition metal", x: 6, y: 4, summary: "Principal componente do aço inoxidável e ferragens cromadas.", phase: 'Solid' },
    { number: 25, symbol: "Mn", name: "Manganês", weight: "54.938", category: "transition metal", x: 7, y: 4, summary: "Crucial para a produção de aço e ligas de alumínio.", phase: 'Solid' },
    { number: 26, symbol: "Fe", name: "Ferro", weight: "55.845", category: "transition metal", x: 8, y: 4, summary: "O metal mais usado no mundo e essencial no sangue.", phase: 'Solid' },
    { number: 27, symbol: "Co", name: "Cobalto", weight: "58.933", category: "transition metal", x: 9, y: 4, summary: "Usado em ímãs potentes e baterias de íon-lítio.", phase: 'Solid' },
    { number: 28, symbol: "Ni", name: "Níquel", weight: "58.693", category: "transition metal", x: 10, y: 4, summary: "Usado em moedas, baterias e revestimentos metálicos.", phase: 'Solid' },
    { number: 29, symbol: "Cu", name: "Cobre", weight: "63.546", category: "transition metal", x: 11, y: 4, summary: "Excelente condutor de eletricidade e calor.", phase: 'Solid' },
    { number: 30, symbol: "Zn", name: "Zinco", weight: "65.38", category: "transition metal", x: 12, y: 4, summary: "Usado em galvanização e prevenção de corrosão.", phase: 'Solid' },
    { number: 31, symbol: "Ga", name: "Gálio", weight: "69.723", category: "post-transition metal", x: 13, y: 4, summary: "Derrete na mão humana devido ao baixo ponto de fusão.", phase: 'Solid' },
    { number: 32, symbol: "Ge", name: "Germânio", weight: "72.63", category: "metalloid", x: 14, y: 4, summary: "Importante na fabricação de fibra óptica e infravermelhos.", phase: 'Solid' },
    { number: 33, symbol: "As", name: "Arsênio", weight: "74.921", category: "metalloid", x: 15, y: 4, summary: "Elemento famoso por sua toxicidade, usado em venenos.", phase: 'Solid' },
    { number: 34, symbol: "Se", name: "Selênio", weight: "78.971", category: "polyatomic nonmetal", x: 16, y: 4, summary: "Usado em células solares e eletrônica.", phase: 'Solid' },
    { number: 35, symbol: "Br", name: "Bromo", weight: "79.904", category: "diatomic nonmetal", x: 17, y: 4, summary: "O único não metal que permanece líquido em temperatura ambiente.", phase: 'Liquid' },
    { number: 36, symbol: "Kr", name: "Criptônio", weight: "83.798", category: "noble gas", x: 18, y: 4, summary: "Usado em lâmpadas de flash e laser de precisão.", phase: 'Gas' },
    // Row 5
    { number: 37, symbol: "Rb", name: "Rubídio", weight: "85.467", category: "alkali metal", x: 1, y: 5, summary: "Metal macio usado em relógios atômicos.", phase: 'Solid' },
    { number: 38, symbol: "Sr", name: "Estrôncio", weight: "87.62", category: "alkaline earth metal", x: 2, y: 5, summary: "Dá a cor vermelha brilhante aos fogos de artifício.", phase: 'Solid' },
    { number: 39, symbol: "Y", name: "Ítrio", weight: "88.905", category: "transition metal", x: 3, y: 5, summary: "Usado em supercondutores e lasers.", phase: 'Solid' },
    { number: 40, symbol: "Zr", name: "Zircônio", weight: "91.224", category: "transition metal", x: 4, y: 5, summary: "Usado em reatores nucleares e joalheria artificial.", phase: 'Solid' },
    { number: 41, symbol: "Nb", name: "Nióbio", weight: "92.906", category: "transition metal", x: 5, y: 5, summary: "Usado em ligas metálicas e aparelhos de ressonância.", phase: 'Solid' },
    { number: 42, symbol: "Mo", name: "Molibdênio", weight: "95.95", category: "transition metal", x: 6, y: 5, summary: "Aumenta a resistência e estabilidade de aços.", phase: 'Solid' },
    { number: 43, symbol: "Tc", name: "Tecnécio", weight: "98.906", category: "transition metal", x: 7, y: 5, summary: "Primeiro elemento artificialmente produzido.", phase: 'Solid' },
    { number: 44, symbol: "Ru", name: "Rutênio", weight: "101.07", category: "transition metal", x: 8, y: 5, summary: "Catalisador eficaz e usado em contatos elétricos.", phase: 'Solid' },
    { number: 45, symbol: "Rh", name: "Ródio", weight: "102.90", category: "transition metal", x: 9, y: 5, summary: "Um dos metais mais raros e valiosos do mundo.", phase: 'Solid' },
    { number: 46, symbol: "Pd", name: "Paládio", weight: "106.42", category: "transition metal", x: 10, y: 5, summary: "Crucial em catalisadores de automóveis modernos.", phase: 'Solid' },
    { number: 47, symbol: "Ag", name: "Prata", weight: "107.86", category: "transition metal", x: 11, y: 5, summary: "Metal precioso com maior condutividade elétrica.", phase: 'Solid' },
    { number: 48, symbol: "Cd", name: "Cádmio", weight: "112.41", category: "transition metal", x: 12, y: 5, summary: "Usado em baterias recarregáveis e pigmentos.", phase: 'Solid' },
    { number: 49, symbol: "In", name: "Índio", weight: "114.81", category: "post-transition metal", x: 13, y: 5, summary: "Metal macio usado em telas LCD (ITO).", phase: 'Solid' },
    { number: 50, symbol: "Sn", name: "Estanho", weight: "118.71", category: "post-transition metal", x: 14, y: 5, summary: "Usado em solda e revestimento de latas de comida.", phase: 'Solid' },
    { number: 51, symbol: "Sb", name: "Antimônio", weight: "121.76", category: "metalloid", x: 15, y: 5, summary: "Usado em semicondutores e retardantes de chama.", phase: 'Solid' },
    { number: 52, symbol: "Te", name: "Telúrio", weight: "127.60", category: "metalloid", x: 16, y: 5, summary: "Usado em metalurgia e painéis solares.", phase: 'Solid' },
    { number: 53, symbol: "I", name: "Iodo", weight: "126.90", category: "diatomic nonmetal", x: 17, y: 5, summary: "Crucial para a função da glândula tireoide.", phase: 'Solid' },
    { number: 54, symbol: "Xe", name: "Xenônio", weight: "131.29", category: "noble gas", x: 18, y: 5, summary: "Usado em lâmpadas de carro de alta intensidade.", phase: 'Gas' },
    // Row 6
    { number: 55, symbol: "Cs", name: "Césio", weight: "132.90", category: "alkali metal", x: 1, y: 6, summary: "Utilizado para definir a medida oficial do segundo.", phase: 'Solid' },
    { number: 56, symbol: "Ba", name: "Bário", weight: "137.32", category: "alkaline earth metal", x: 2, y: 6, summary: "Usado como contraste em exames de raio-X.", phase: 'Solid' },
    { number: 72, symbol: "Hf", name: "Háfnio", weight: "178.49", category: "transition metal", x: 4, y: 6, summary: "Usado em hastes de controle de reatores nucleares.", phase: 'Solid' },
    { number: 73, symbol: "Ta", name: "Tântalo", weight: "180.94", category: "transition metal", x: 5, y: 6, summary: "Altamente resistente à corrosão, usado em implantes.", phase: 'Solid' },
    { number: 74, symbol: "W", name: "Tungstênio", weight: "183.84", category: "transition metal", x: 6, y: 6, summary: "Possui o maior ponto de fusão entre todos os metais.", phase: 'Solid' },
    { number: 75, symbol: "Re", name: "Rênio", weight: "186.20", category: "transition metal", x: 7, y: 6, summary: "Usado em motores a jato e superligas.", phase: 'Solid' },
    { number: 76, symbol: "Os", name: "Ósmio", weight: "190.23", category: "transition metal", x: 8, y: 6, summary: "O elemento natural mais denso que existe.", phase: 'Solid' },
    { number: 77, symbol: "Ir", name: "Irídio", weight: "192.21", category: "transition metal", x: 9, y: 6, summary: "Elemento mais resistente à corrosão conhecido.", phase: 'Solid' },
    { number: 78, symbol: "Pt", name: "Platina", weight: "195.08", category: "transition metal", x: 10, y: 6, summary: "Metal nobre precioso usado em joias e catalisadores.", phase: 'Solid' },
    { number: 79, symbol: "Au", name: "Ouro", weight: "196.96", category: "transition metal", x: 11, y: 6, summary: "Símbolo histórico de riqueza e altamente condutivo.", phase: 'Solid' },
    { number: 80, symbol: "Hg", name: "Mercúrio", weight: "200.59", category: "transition metal", x: 12, y: 6, summary: "O único metal líquido em temperatura ambiente.", phase: 'Liquid' },
    { number: 81, symbol: "Tl", name: "Tálio", weight: "204.38", category: "post-transition metal", x: 13, y: 6, summary: "Famoso no passado como veneno difícil de detectar.", phase: 'Solid' },
    { number: 82, symbol: "Pb", name: "Chumbo", weight: "207.2", category: "post-transition metal", x: 14, y: 6, summary: "Metal denso usado em telas contra radiação.", phase: 'Solid' },
    { number: 83, symbol: "Bi", name: "Bismuto", weight: "208.98", category: "post-transition metal", x: 15, y: 6, summary: "Substância cristalina usada em remédios estomacais.", phase: 'Solid' },
    { number: 84, symbol: "Po", name: "Polônio", weight: "209", category: "post-transition metal", x: 16, y: 6, summary: "Elemento extremamente radioativo e tóxico.", phase: 'Solid' },
    { number: 85, symbol: "At", name: "Astato", weight: "210", category: "metalloid", x: 17, y: 6, summary: "O elemento natural mais raro da crosta terrestre.", phase: 'Solid' },
    { number: 86, symbol: "Rn", name: "Radônio", weight: "222", category: "noble gas", x: 18, y: 6, summary: "Gás radioativo natural que pode se acumular em casas.", phase: 'Gas' },
    // Row 7
    { number: 87, symbol: "Fr", name: "Frâncio", weight: "223", category: "alkali metal", x: 1, y: 7, summary: "Elemento extremamente radioativo e instável.", phase: 'Solid' },
    { number: 88, symbol: "Ra", name: "Rádio", weight: "226", category: "alkaline earth metal", x: 2, y: 7, summary: "Descoberto por Marie Curie, usado no passado em tintas.", phase: 'Solid' },
    { number: 104, symbol: "Rf", name: "Rutherfórdio", weight: "267", category: "transition metal", x: 4, y: 7, summary: "Elemento sintético e altamente radioativo.", phase: 'Solid' },
    { number: 105, symbol: "Db", name: "Dúbnio", weight: "268", category: "transition metal", x: 5, y: 7, summary: "Nomeado em homenagem ao centro de pesquisa em Dubna.", phase: 'Solid' },
    { number: 106, symbol: "Sg", name: "Seabórgio", weight: "271", category: "transition metal", x: 6, y: 7, summary: "Elemento sintético nomeado em vida para Glenn Seaborg.", phase: 'Solid' },
    { number: 107, symbol: "Bh", name: "Bóhrio", weight: "270", category: "transition metal", x: 7, y: 7, summary: "Nomeado em homenagem ao físico Niels Bohr.", phase: 'Solid' },
    { number: 108, symbol: "Hs", name: "Hássio", weight: "277", category: "transition metal", x: 8, y: 7, summary: "Elemento sintético produzido por colisão de íons.", phase: 'Solid' },
    { number: 109, symbol: "Mt", name: "Meitnério", weight: "276", category: "unknown", x: 9, y: 7, summary: "Homenagem à física Lise Meitner.", phase: 'Solid' },
    { number: 110, symbol: "Ds", name: "Darmstádio", weight: "281", category: "unknown", x: 10, y: 7, summary: "Produzido pela primeira vez em Darmstadt, Alemanha.", phase: 'Solid' },
    { number: 111, symbol: "Rg", name: "Roentgênio", weight: "280", category: "unknown", x: 11, y: 7, summary: "Homenagem ao descobridor dos Raios-X.", phase: 'Solid' },
    { number: 112, symbol: "Cn", name: "Copernício", weight: "285", category: "transition metal", x: 12, y: 7, summary: "Produzido por fusão de átomos de zinco e chumbo.", phase: 'Solid' },
    { number: 113, symbol: "Nh", name: "Nihônio", weight: "284", category: "unknown", x: 13, y: 7, summary: "Primeiro elemento descoberto por cientistas japoneses.", phase: 'Solid' },
    { number: 114, symbol: "Fl", name: "Fleróvio", weight: "289", category: "unknown", x: 14, y: 7, summary: "Sintético, descoberto no laboratório Flerov na Rússia.", phase: 'Solid' },
    { number: 115, symbol: "Mc", name: "Moscóvio", weight: "288", category: "unknown", x: 15, y: 7, summary: "Nomeado em homenagem à região de Moscou.", phase: 'Solid' },
    { number: 116, symbol: "Lv", name: "Livermório", weight: "293", category: "unknown", x: 16, y: 7, summary: "Colaboração entre centros russos e americanos.", phase: 'Solid' },
    { number: 117, symbol: "Ts", name: "Tennesso", weight: "294", category: "unknown", x: 17, y: 7, summary: "Nomeado em homenagem ao estado do Tennessee.", phase: 'Solid' },
    { number: 118, symbol: "Og", name: "Oganésson", weight: "294", category: "noble gas", x: 18, y: 7, summary: "O elemento mais pesado conhecido atualmente.", phase: 'Solid' },
    // Lanthanides (y=9 for display)
    { number: 57, symbol: "La", name: "Lantânio", weight: "138.90", category: "lanthanide", x: 4, y: 9 },
    { number: 58, symbol: "Ce", name: "Cério", weight: "140.11", category: "lanthanide", x: 5, y: 9 },
    { number: 59, symbol: "Pr", name: "Praseodímio", weight: "140.90", category: "lanthanide", x: 6, y: 9 },
    { number: 60, symbol: "Nd", name: "Neodímio", weight: "144.24", category: "lanthanide", x: 7, y: 9 },
    { number: 61, symbol: "Pm", name: "Promécio", weight: "145", category: "lanthanide", x: 8, y: 9 },
    { number: 62, symbol: "Sm", name: "Samário", weight: "150.36", category: "lanthanide", x: 9, y: 9 },
    { number: 63, symbol: "Eu", name: "Európio", weight: "151.96", category: "lanthanide", x: 10, y: 9 },
    { number: 64, symbol: "Gd", name: "Gadolínio", weight: "157.25", category: "lanthanide", x: 11, y: 9 },
    { number: 65, symbol: "Tb", name: "Térbio", weight: "158.92", category: "lanthanide", x: 12, y: 9 },
    { number: 66, symbol: "Dy", name: "Disprósio", weight: "162.50", category: "lanthanide", x: 13, y: 9 },
    { number: 67, symbol: "Ho", name: "Hólmio", weight: "164.93", category: "lanthanide", x: 14, y: 9 },
    { number: 68, symbol: "Er", name: "Érbio", weight: "167.25", category: "lanthanide", x: 15, y: 9 },
    { number: 69, symbol: "Tm", name: "Túlio", weight: "168.93", category: "lanthanide", x: 16, y: 9 },
    { number: 70, symbol: "Yb", name: "Itérbio", weight: "173.05", category: "lanthanide", x: 17, y: 9 },
    { number: 71, symbol: "Lu", name: "Lutécio", weight: "174.96", category: "lanthanide", x: 18, y: 9 },
    // Actinides (y=10 for display)
    { number: 89, symbol: "Ac", name: "Actínio", weight: "227", category: "actinide", x: 4, y: 10 },
    { number: 90, symbol: "Th", name: "Tório", weight: "232.03", category: "actinide", x: 5, y: 10 },
    { number: 91, symbol: "Pa", name: "Protactínio", weight: "231.03", category: "actinide", x: 6, y: 10 },
    { number: 92, symbol: "U", name: "Urânio", weight: "238.02", category: "actinide", x: 7, y: 10 },
    { number: 93, symbol: "Np", name: "Netúnio", weight: "237", category: "actinide", x: 8, y: 10 },
    { number: 94, symbol: "Pu", name: "Plutônio", weight: "244", category: "actinide", x: 9, y: 10 },
    { number: 95, symbol: "Am", name: "Amerício", weight: "243", category: "actinide", x: 10, y: 10 },
    { number: 96, symbol: "Cm", name: "Cúrio", weight: "247", category: "actinide", x: 11, y: 10 },
    { number: 97, symbol: "Bk", name: "Berquélio", weight: "247", category: "actinide", x: 12, y: 10 },
    { number: 98, symbol: "Cf", name: "Califórnio", weight: "251", category: "actinide", x: 13, y: 10 },
    { number: 99, symbol: "Es", name: "Einstênio", weight: "252", category: "actinide", x: 14, y: 10 },
    { number: 100, symbol: "Fm", name: "Férmio", weight: "257", category: "actinide", x: 15, y: 10 },
    { number: 101, symbol: "Md", name: "Mendelévio", weight: "258", category: "actinide", x: 16, y: 10 },
    { number: 102, symbol: "No", name: "Nobélio", weight: "259", category: "actinide", x: 17, y: 10 },
    { number: 103, symbol: "Lr", name: "Laurêncio", weight: "262", category: "actinide", x: 18, y: 10 },
];

const categoryStyles: Record<string, { bg: string, text: string, border: string, light: string }> = {
    "diatomic nonmetal": { bg: "bg-blue-600", text: "text-blue-50", border: "border-blue-400", light: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    "noble gas": { bg: "bg-purple-600", text: "text-purple-50", border: "border-purple-400", light: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
    "alkali metal": { bg: "bg-red-600", text: "text-red-50", border: "border-red-400", light: "bg-red-500/10 text-red-500 border-red-500/20" },
    "alkaline earth metal": { bg: "bg-orange-600", text: "text-orange-50", border: "border-orange-400", light: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
    "metalloid": { bg: "bg-green-600", text: "text-green-50", border: "border-green-400", light: "bg-green-500/10 text-green-400 border-green-500/20" },
    "polyatomic nonmetal": { bg: "bg-cyan-600", text: "text-cyan-50", border: "border-cyan-400", light: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
    "post-transition metal": { bg: "bg-emerald-600", text: "text-emerald-50", border: "border-emerald-400", light: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    "transition metal": { bg: "bg-pink-600", text: "text-pink-50", border: "border-pink-400", light: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
    "lanthanide": { bg: "bg-indigo-600", text: "text-indigo-50", border: "border-indigo-400", light: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
    "actinide": { bg: "bg-amber-600", text: "text-amber-50", border: "border-amber-400", light: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    "unknown": { bg: "bg-gray-600", text: "text-gray-50", border: "border-gray-400", light: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
};

export function PeriodicTable() {
    const [selected, setSelected] = useState<Element | null>(null);
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    const categories = useMemo(() => Object.keys(categoryStyles), []);

    return (
        <div className="flex flex-col gap-8 h-full">
            {/* Header Legend */}
            <div className="flex flex-wrap items-center justify-center gap-2 p-4 bg-card-main/40 dark:bg-[#0D0D0D]/40 rounded-3xl border border-border-main backdrop-blur-md">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onMouseEnter={() => setHoveredCategory(cat)}
                        onMouseLeave={() => setHoveredCategory(null)}
                        className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border",
                            categoryStyles[cat].light,
                            hoveredCategory === cat ? "scale-105 shadow-lg border-text-main/40" : "opacity-60"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="relative flex-1 min-h-0 flex flex-col">
                {/* Main Table Container */}
                <div className="flex-1 overflow-auto custom-scrollbar p-1">
                    <div className="grid grid-cols-18 gap-1.5 min-w-[1300px] relative pb-12">
                        {/* Details Display - Desktop: Absolute Grid Position, Mobile: Responsive Bottom Sheet */}
                        <div className="hidden lg:block absolute top-0 left-[13.88%] w-[50%] h-[160px] z-20 pointer-events-none">
                            <AnimatePresence mode="wait">
                                {selected && (
                                    <motion.div
                                        key={selected.number}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        className="h-[160px] bg-card-main/95 dark:bg-[#0D0D0D]/90 border border-border-main dark:border-white/10 rounded-[32px] p-5 shadow-2xl backdrop-blur-xl pointer-events-auto flex items-center gap-6 group"
                                    >
                                        <div className={cn(
                                            "w-24 h-24 rounded-2xl flex flex-col items-center justify-center border-2 shadow-2xl transition-transform duration-500 hover:rotate-3 shrink-0",
                                            categoryStyles[selected.category].bg,
                                            categoryStyles[selected.category].text,
                                            categoryStyles[selected.category].border
                                        )}>
                                            <span className="text-3xl font-black tracking-tight drop-shadow-lg">{selected.symbol}</span>
                                            <div className="w-6 h-0.5 bg-current opacity-20 my-1 rounded-full" />
                                            <span className="text-[10px] font-bold opacity-60 uppercase">{selected.number}</span>
                                        </div>
                                        <div className="flex-1 min-w-0 space-y-2.5">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="min-w-0">
                                                    <h4 className="text-3xl font-black italic tracking-tighter text-text-main leading-none truncate">{selected.name}</h4>
                                                    <p className="text-[9px] font-black uppercase tracking-[2px] opacity-30 mt-1 truncate">{selected.category}</p>
                                                </div>
                                                <button
                                                    onClick={() => setSelected(null)}
                                                    className="w-8 h-8 flex items-center justify-center bg-text-main/5 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-all text-text-main/20 border border-border-main active:scale-90 shrink-0"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                <div className="bg-text-main/5 p-2 rounded-xl border border-border-main">
                                                    <p className="text-[7px] font-black opacity-30 uppercase tracking-widest flex items-center gap-1 mb-0.5 text-text-main"><Weight size={8} /> Peso</p>
                                                    <p className="text-xs font-bold text-text-main truncate">{selected.weight} <span className="text-[8px] opacity-40">u</span></p>
                                                </div>
                                                <div className="bg-text-main/5 p-2 rounded-xl border border-border-main">
                                                    <p className="text-[7px] font-black opacity-30 uppercase tracking-widest flex items-center gap-1 mb-0.5 text-text-main"><Zap size={8} /> Fase</p>
                                                    <p className="text-sm font-bold text-text-main truncate">{selected.phase || 'Sólido'}</p>
                                                </div>
                                                <div className="bg-text-main/5 p-2 rounded-xl border border-border-main">
                                                    <p className="text-[7px] font-black opacity-30 uppercase tracking-widest flex items-center gap-1 mb-0.5 text-text-main"><Orbit size={8} /> G|P</p>
                                                    <p className="text-sm font-bold text-text-main truncate">{selected.x} | {selected.y}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {[...Array(10 * 18)].map((_, i) => {
                            const x = (i % 18) + 1;
                            const y = Math.floor(i / 18) + 1;

                            // Special cases for Lanthanide/Actinide indicators
                            if (x === 3 && y === 6) return <div key={i} className="flex items-center justify-center text-[10px] font-black opacity-20 italic">57-71</div>;
                            if (x === 3 && y === 7) return <div key={i} className="flex items-center justify-center text-[10px] font-black opacity-20 italic">89-103</div>;
                            if (y === 8) return <div key={i} className="h-4" />;

                            const element = ELEMENTS.find(e => e.x === x && e.y === y);
                            const isSelected = selected?.number === element?.number;
                            const isDimmed = hoveredCategory && element && element.category !== hoveredCategory;

                            return (
                                <div
                                    key={i}
                                    className={cn(
                                        "aspect-square p-2 rounded-xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer relative group/atom",
                                        element ? categoryStyles[element.category].light : "border-transparent opacity-0 pointer-events-none",
                                        isSelected ? "ring-4 ring-text-main/50 scale-110 z-30 !bg-text-main !text-bg-main !border-text-main shadow-2xl" : "shadow-sm",
                                        element && !isSelected && "hover:scale-110 hover:z-20 hover:shadow-xl hover:border-text-main/50",
                                        isDimmed && "opacity-20 scale-90 blur-[1px]"
                                    )}
                                    onClick={() => element && setSelected(element)}
                                >
                                    {element && (
                                        <>
                                            <span className="text-[10px] font-black absolute top-1.5 left-2 opacity-30">{element.number}</span>
                                            <span className="text-2xl font-black tracking-tighter leading-none mb-1">{element.symbol}</span>
                                            <span className="text-[8px] font-bold opacity-40 uppercase tracking-tighter truncate w-full text-center px-1">{element.name}</span>

                                            {/* Mobile/Hover weight indicator */}
                                            <div className="absolute inset-x-0 bottom-0 py-0.5 bg-card-main/40 dark:bg-black/40 rounded-b-[10px] opacity-0 group-hover/atom:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-[7px] font-black text-text-main">{element.weight}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {selected && (
                    <div className="lg:hidden fixed inset-x-0 bottom-0 z-[100] p-4 animate-in slide-in-from-bottom duration-300">
                        <div
                            className="bg-card-main border border-border-main rounded-[32px] p-6 shadow-2xl backdrop-blur-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-12 h-1.5 bg-text-main/10 rounded-full mx-auto mb-6" />
                            <div className="flex items-center gap-6 mb-6">
                                <div className={cn(
                                    "w-20 h-20 rounded-2xl flex flex-col items-center justify-center border-2 shadow-lg",
                                    categoryStyles[selected.category].bg,
                                    categoryStyles[selected.category].text,
                                    categoryStyles[selected.category].border
                                )}>
                                    <span className="text-2xl font-black">{selected.symbol}</span>
                                    <span className="text-[8px] font-bold opacity-60">{selected.number}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-2xl font-black italic tracking-tighter text-text-main truncate">{selected.name}</h4>
                                    <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mt-1 truncate">{selected.category}</p>
                                </div>
                                <button
                                    onClick={() => setSelected(null)}
                                    className="w-10 h-10 bg-text-main/5 rounded-full flex items-center justify-center border border-border-main"
                                >
                                    <X size={16} className="opacity-40" />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="bg-text-main/5 p-3 rounded-2xl border border-border-main">
                                    <p className="text-[8px] font-black opacity-30 uppercase tracking-widest mb-1">Peso Atômico</p>
                                    <p className="text-sm font-bold text-text-main">{selected.weight} u</p>
                                </div>
                                <div className="bg-text-main/5 p-3 rounded-2xl border border-border-main">
                                    <p className="text-[8px] font-black opacity-30 uppercase tracking-widest mb-1">Fase Natural</p>
                                    <p className="text-sm font-bold text-text-main">{selected.phase || 'Sólido'}</p>
                                </div>
                            </div>
                            <p className="text-xs text-text-main/60 leading-relaxed italic mb-2">
                                {selected.summary || "Bloco fundamental de construção da matéria."}
                            </p>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .grid-cols-18 {
                    grid-template-columns: repeat(18, minmax(0, 1fr));
                }
                .custom-scrollbar::-webkit-scrollbar {
                    height: 6px;
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    @apply bg-text-main/10 rounded-full;
                }
            `}</style>
        </div>
    );
}
