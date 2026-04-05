const fs = require('fs');
const path = require('path');
const adminDir = path.join(__dirname, 'admin');

const files = ['orders.html', 'products.html', 'articles.html', 'settings.html'];
const insertion = `
                <a href="dealers.html" class="sidebar-link">
                    <span class="icon"><i class="fa fa-users"></i></span>
                    <span data-en="Manage Dealers" data-ar="إدارة الوكلاء">Manage Dealers</span>
                </a>`;

files.forEach(file => {
    const filePath = path.join(adminDir, file);
    if(fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        if (!content.includes('dealers.html')) {
            content = content.replace(/(<span data-en="Overview" data-ar="نظرة عامة">Overview<\/span>\s*<\/a>)/g, '$1' + insertion);
            fs.writeFileSync(filePath, content);
            console.log('Updated ' + file);
        }
    }
});
