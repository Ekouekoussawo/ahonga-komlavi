const fs = require('fs');

const htaccess = fs.readFileSync('C:/Users/Oel/sites/ahonga-komlavi/frontend/out/.htaccess', 'utf8');
console.log('out/.htaccess content:');
console.log(htaccess);
console.log('\nHas WordPress rule:', htaccess.includes('RewriteCond %{REQUEST_URI} ^/wp/'));
