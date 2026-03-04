export interface Supporter {
    id: string;
    name: string;
    tier: 'Diamond' | 'Gold' | 'Silver' | 'Bronze';
    date: string;
    message?: string;
}

export const SUPPORTERS: Supporter[] = [
    {
        id: '1',
        name: 'Lucas Amaral',
        tier: 'Diamond',
        date: 'Março 2026',
        message: 'Idealizador e Desenvolvedor principal do Canivete. 🚀'
    },
    {
        id: '2',
        name: 'Kelbis Vieira de Carvalho',
        tier: 'Gold',
        date: 'Março 2026',
        message: 'Pioneiro contribuindo para o desenvolvimento do Canivete. 🚀'
    },

];
