const { TOOLS } = require('./constants/tools');

const slugs = TOOLS.map(t => `${t.categorySlug}/${t.slug}`);
const duplicates = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);

if (duplicates.length > 0) {
    console.log('Duplicate slugs found:', duplicates);
} else {
    console.log('No duplicate slugs found.');
}
