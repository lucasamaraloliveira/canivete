const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\Lucas\\Downloads\\canivete\\constants\\tools.ts';
const content = fs.readFileSync(filePath, 'utf8');

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
}

const categoryMapping = {
    'Dev': 'dev',
    'Design': 'design',
    'Produtividade': 'produtividade',
    'Ciência': 'ciencia',
    'Segurança': 'seguranca',
    'Diversos': 'diversos',
    'Comunidade': 'comunidade'
};

// Update interface
let newContent = content.replace(
    'export interface Tool {',
    'export interface Tool {\n  id: string;\n  name: string;\n  description: string;\n  category: string;\n  icon: string;\n  slug: string;\n  categorySlug: string;'
);

// We need to parse the TOOLS array and add slug/categorySlug to each object
const toolsRegex = /\{ id: '(\d+)', name: '(.*?)', description: '(.*?)', category: '(.*?)', icon: '(.*?)' \}/g;

newContent = newContent.replace(toolsRegex, (match, id, name, description, category, icon) => {
    const slug = slugify(name);
    const categorySlug = categoryMapping[category] || slugify(category);
    return `{ id: '${id}', name: '${name}', description: '${description}', category: '${category}', icon: '${icon}', slug: '${slug}', categorySlug: '${categorySlug}' }`;
});

fs.writeFileSync(filePath, newContent);
console.log('Successfully updated tools.ts with slugs.');
