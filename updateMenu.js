const fs = require('fs');
const path = require('path');

function getHtmlFiles(dir) {
  let files = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file === '.git' || file === 'backend' || file === 'admin' || file === 'dealer') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files = files.concat(getHtmlFiles(fullPath));
    } else if (fullPath.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = getHtmlFiles('.');

for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;
  
  // 1. Update <ul class="nav-links">
  content = content.replace(/<ul class=\"nav-links\">([\s\S]*?)<\/ul>/, (match, inner) => {
    if (inner.includes('warranty.html') || inner.includes('warranty-status.html')) return match;
    const pathPrefix = (f.includes('brands\\') || f.includes('brands/')) ? '../' : '';
    const newLi = `\n                <li><a href="${pathPrefix}warranty-status.html" class="nav-link" data-en="Warranty" data-ar="الضمان">Warranty</a></li>\n            `;
    changed = true;
    return `<ul class="nav-links">${inner.replace(/\s*$/, '')}${newLi}</ul>`;
  });

  // 2. Update Footer Quick Links (if exists)
  content = content.replace(/(<h5 data-en=\"Quick Links\"[^>]*>.*?<\/h5>\s*<ul>)([\s\S]*?)(<\/ul>)/, (match, prefix, inner, suffix) => {
    if (inner.includes('warranty.html') || inner.includes('warranty-status.html')) return match;
    const pathPrefix = (f.includes('brands\\') || f.includes('brands/')) ? '../' : '';
    const newLi = `\n          <li><a href="${pathPrefix}warranty-status.html" data-en="Warranty" data-ar="الضمان">Warranty</a></li>\n        `;
    changed = true;
    return `${prefix}${inner.replace(/\s*$/, '')}${newLi}${suffix}`;
  });

  if (changed) {
    fs.writeFileSync(f, content);
    console.log('Updated', f);
  }
}
