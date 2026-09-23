<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

echo "<h1>WordPress Fixer</h1>";

// 1. Fix .htaccess
$htaccess = $_SERVER['DOCUMENT_ROOT'] . '/wp/.htaccess';
echo "<h2>1. .htaccess Fix</h2>";
echo "File: $htaccess<br>";
echo "Exists: " . (file_exists($htaccess) ? 'YES' : 'NO') . "<br><br>";

if (file_exists($htaccess)) {
    $current = file_get_contents($htaccess);
    echo "<h3>Current content:</h3>";
    echo "<pre>" . htmlspecialchars($current) . "</pre><br>";
}

$newHtaccess = "# BEGIN WordPress
RewriteEngine On
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /wp/index.php [L]
# END WordPress
";
file_put_contents($htaccess, $newHtaccess);
echo "<h3>New .htaccess written:</h3>";
echo "<pre>" . htmlspecialchars($newHtaccess) . "</pre>";
echo "<span style='color:green'>.htaccess fixed!</span><br><br>";

// 2. Fix wp-config.php
$config = $_SERVER['DOCUMENT_ROOT'] . '/wp/wp-config.php';
echo "<h2>2. wp-config.php Fix</h2>";
echo "File: $config<br>";
echo "Exists: " . (file_exists($config) ? 'YES' : 'NO') . "<br><br>";

if (file_exists($config)) {
    $content = file_get_contents($config);
    
    // Fix table prefix
    $content = str_replace("'wp_'", "'eak_'", $content);
    
    // Fix DB charset to utf8mb4
    $content = str_replace("define('DB_CHARSET', 'utf8');", "define('DB_CHARSET', 'utf8mb4');", $content);
    
    // Fix DB_HOST
    $content = str_replace("define('DB_HOST', '127.0.0.1:10007');", "define('DB_HOST', 'localhost');", $content);
    
    // Fix DB credentials
    $content = str_replace("define('DB_NAME', 'local');", "define('DB_NAME', 'zank_ahonga');", $content);
    $content = str_replace("define('DB_USER', 'root');", "define('DB_USER', 'zank_ahonga');", $content);
    $content = str_replace("define('DB_PASSWORD', 'root');", "define('DB_PASSWORD', 'csdFVM5sAIonVoO8UCwE5J4o');", $content);
    
    // Fix environment type
    $content = str_replace("define('WP_ENVIRONMENT_TYPE', 'local');", "define('WP_ENVIRONMENT_TYPE', 'production');", $content);
    
    // Save backup
    copy($config, $config . '.bak_config');
    file_put_contents($config, $content);
    
    echo "<h3>Changes made:</h3>";
    echo "- $table_prefix: wp_ -> eak_<br>";
    echo "- DB_CHARSET: utf8 -> utf8mb4<br>";
    echo "- DB_HOST: 127.0.0.1:10007 -> localhost<br>";
    echo "- DB_NAME: local -> zank_ahonga<br>";
    echo "- DB_USER: root -> zank_ahonga<br>";
    echo "- DB_PASSWORD: changed<br>";
    echo "- WP_ENVIRONMENT_TYPE: local -> production<br>";
    echo "<span style='color:green'>wp-config.php fixed! Backup saved as wp-config.php.bak_config</span><br>";
} else {
    echo "<p style='color:red'>Config file not found!</p>";
}

echo "<hr>";
echo "<h3>Test Links:</h3>";
echo "<a href='/wp/'>/wp/</a> | <a href='/wp/wp-admin/'>/wp/wp-admin/</a> | <a href='/wp/wp-json/wp/v2/posts'>REST API</a>";
