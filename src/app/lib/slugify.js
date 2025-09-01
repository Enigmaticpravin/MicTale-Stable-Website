// lib/slugify.js
export function toSlug(str) {
  return String(str)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function poemSlug({ title, author, category }) {
  // e.g. main-tera-hoon-tahzeeb-hafi-ghazal
  return [title, author, category].map(toSlug).join('-')
}
