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
  let newContent = content.replace(/warranty-status\.html/g, 'warranty.html');
  if (content !== newContent) {
    fs.writeFileSync(f, newContent);
    console.log('Fixed link in', f);
  }
}
