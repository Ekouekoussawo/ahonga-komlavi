<?php
// Write correct .htaccess for /wp/
$path = $_SERVER['DOCUMENT_ROOT'] . '/wp/.htaccess';
echo "Target: $path<br>";
echo "Exists: " . (file_exists($path) ? 'YES' : 'NO') . "<br><br>";

// Read current
if (file_exists($path)) {
    $current = file_get_contents($path);
    echo "<h3>Current .htaccess:</h3>";
    echo "<pre>" . htmlspecialchars($current) . "</pre><br>";
}

// Write correct .htaccess
$correct = <<<HTACCESS
# BEGIN WordPress
RewriteEngine On
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /wp/index.php [L]
# END WordPress
HTACCESS;

file_put_contents($path, $correct);
echo "<h3>New .htaccess written:</h3>";
echo "<pre>" . htmlspecialchars($correct) . "</pre>";
echo "<br><span style='color:green'>Done! Test: <a href='/wp/'>/wp/</a> | <a href='/wp/wp-admin/'>/wp/wp-admin/</a> | <a href='/wp/wp-json/wp/v2/posts'>REST API</a></span>";
