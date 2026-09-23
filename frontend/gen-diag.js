const fs = require('fs');

// 1. Create a diagnostic PHP file that shows errors and tests WordPress
const diagnostic = `<?php
// Enable all error reporting
error_reporting(E_ALL);
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');

echo "<h2>PHP Diagnostics</h2>";
echo "<p>PHP Version: " . PHP_VERSION . "</p>";
echo "<p>PHP SAPI: " . PHP_SAPI . "</p>";

// Test database connection
echo "<h3>Database Connection Test</h3>";
\$db_host = 'localhost';
\$db_name = 'zank_ahonga';
\$db_user = 'zank_ahonga';
\$db_pass = 'csdFVM5sAIonVoO8UCwE5J4o';

try {
    \$pdo = new PDO("mysql:host=\$db_host;dbname=\$db_name;charset=utf8mb4", \$db_user, \$db_pass);
    \$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "<p style='color:green'>Database connection: SUCCESS</p>";
    
    // Test query
    \$stmt = \$pdo->query("SELECT COUNT(*) as cnt FROM wp_posts");
    \$row = \$stmt->fetch(PDO::FETCH_ASSOC);
    echo "<p>wp_posts count: " . \$row['cnt'] . "</p>";
    
    \$stmt2 = \$pdo->query("SELECT post_title, post_date FROM wp_posts WHERE post_status='publish' ORDER BY post_date DESC LIMIT 5");
    echo "<h4>Recent posts:</h4><ul>";
    while (\$r = \$stmt2->fetch(PDO::FETCH_ASSOC)) {
        echo "<li>" . htmlspecialchars(\$r['post_title']) . " - " . \$r['post_date'] . "</li>";
    }
    echo "</ul>";
} catch (PDOException \$e) {
    echo "<p style='color:red'>Database connection: FAILED</p>";
    echo "<p>Error: " . \$e->getMessage() . "</p>";
}

// Test WordPress loading
echo "<h3>WordPress Loading Test</h3>";
\$wp_config = \$_SERVER['DOCUMENT_ROOT'] . '/wp/wp-config.php';
echo "<p>wp-config path: \$wp_config</p>";
echo "<p>wp-config exists: " . (file_exists(\$wp_config) ? 'YES' : 'NO') . "</p>";

if (file_exists(\$wp_config)) {
    // Check for WP_HOME and WP_SITEURL
    \$config = file_get_contents(\$wp_config);
    if (strpos(\$config, 'WP_HOME') !== false) {
        echo "<p>WP_HOME defined: YES</p>";
        preg_match("/define\\('WP_HOME',\\s*'([^']+)'\\)/", \$config, \$m);
        if (isset(\$m[1])) echo "<p>WP_HOME = " . \$m[1] . "</p>";
        preg_match("/define\\('WP_SITEURL',\\s*'([^']+)'\\)/", \$config, \$m2);
        if (isset(\$m2[1])) echo "<p>WP_SITEURL = " . \$m2[1] . "</p>";
    } else {
        echo "<p>WP_HOME defined: NO</p>";
    }
}

echo "<hr><p><a href='/wp/wp-admin/'>Try WordPress Admin</a></p>";
`;

fs.writeFileSync('C:/Users/Oel/sites/ahonga-komlavi/frontend/public/wp-diag.php', diagnostic, 'utf8');
console.log('Created wp-diag.php');

// 2. Also create the correct WordPress .htaccess for /wp/
const wpHtaccess = `# BEGIN WordPress
RewriteEngine On
RewriteRule ^index\\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /wp/index.php [L]
# END WordPress
`;
fs.writeFileSync('C:/Users/Oel/sites/ahonga-komlavi/frontend/public/wp-admin/.htaccess', wpHtaccess, 'utf8');
console.log('Created /wp/.htaccess');
console.log(wpHtaccess);
