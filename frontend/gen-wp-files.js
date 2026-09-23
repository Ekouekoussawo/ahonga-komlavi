const fs = require('fs');

// Create the correct WordPress .htaccess for /wp/ subdirectory
const wpHtaccess = `# BEGIN WordPress
RewriteEngine On
RewriteRule ^index\\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /wp/index.php [L]
# END WordPress
`;

const path = 'C:/Users/Oel/sites/ahonga-komlavi/frontend/wp-admin/.htaccess';
// Actually let's put it in a clear location
const outPath = 'C:/Users/Oel/sites/ahonga-komlavi/frontend/public/wp-.htaccess';
fs.writeFileSync(outPath, wpHtaccess, 'utf8');
console.log('Created WordPress .htaccess for /wp/ subdirectory at:', outPath);
console.log('Content:');
console.log(wpHtaccess);

// Also create a PHP info file for diagnostics
const phpInfo = "<?php phpinfo(); ?>";
const phpPath = 'C:/Users/Oel/sites/ahonga-komlavi/frontend/public/phpinfo-test.php';
fs.writeFileSync(phpPath, phpInfo, 'utf8');
console.log('Created PHP info file at:', phpPath);
console.log('Upload to /home4/zank/evangelisteahongankomlavi.com/wp/phptest.php temporarily');
