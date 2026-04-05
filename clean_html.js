const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory() && !fullPath.includes('node_modules') && !fullPath.includes('.git')) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // We use a regex that matches the exact redundant block
            const regex = /let currentLang = localStorage\.getItem\('lang'\) \|\| 'en';\s*function setLang\(lang\) \{[\s\S]*?el\.innerHTML = t;\s*\}\);\s*\}/g;
            
            if (regex.test(content)) {
                content = content.replace(regex, '');
                
                // Some files might have `const searchInput = ...` inside setLang that makes the block longer, let's just make a smarter, safer replacement.
                fs.writeFileSync(fullPath, content);
                console.log(`Cleaned ${fullPath}`);
            } else {
                // Secondary fallback for longer blocks
                const regex2 = /let currentLang = localStorage\.getItem\('lang'\) \|\| 'en';\s*function setLang\(lang\) \{[\s\S]*?(?:searchInput\.placeholder[^}]*\}|\}\);\s*\})/g;
                if (regex2.test(content)) {
                     content = content.replace(regex2, '');
                     fs.writeFileSync(fullPath, content);
                     console.log(`Cleaned (Regex 2) ${fullPath}`);
                }
            }
        }
    }
}

// Ensure we don't break shared.js, we only touch HTML files
processDir(__dirname);
console.log('Cleanup complete!');
