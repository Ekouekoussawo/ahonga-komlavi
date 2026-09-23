<?php
// Direct fix with full output for debugging
error_reporting(E_ALL);
ini_set('display_errors', '1');

echo "<h1>WordPress Direct Fix</h1>";

// Fix .htaccess
$htaccess = $_SERVER['DOCUMENT_ROOT'] . '/wp/.htaccess';
echo "<h2>.htaccess</h2>";
echo "Path: $htaccess<br>";
echo "Exists: " . (file_exists($htaccess) ? 'YES' : 'NO') . "<br>";
echo "Writable: " . (is_writable($htaccess) ? 'YES' : 'NO') . "<br>";

if (file_exists($htaccess)) {
    echo "Current size: " . filesize($htaccess) . " bytes<br>";
    $current = file_get_contents($htaccess);
    echo "Current has 'Deny from all': " . (strpos($current, 'Deny from all') !== false ? 'YES' : 'NO') . "<br>";
    echo "Current has 'RewriteBase /': " . (strpos($current, 'RewriteBase /') !== false ? 'YES' : 'NO') . "<br>";
}

$newContent = "# BEGIN WordPress\nRewriteEngine On\nRewriteRule ^index\\.php\$ - [L]\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule . /wp/index.php [L]\n# END WordPress\n";

$result = file_put_contents($htaccess, $newContent);
echo "Write result: " . ($result !== false ? "$result bytes written" : "FAILED") . "<br>";

// Verify
$after = file_get_contents($htaccess);
echo "After has 'Deny from all': " . (strpos($after, 'Deny from all') !== false ? 'YES (still there!)' : 'NO (removed)') . "<br>";
echo "After has '/wp/index.php': " . (strpos($after, '/wp/index.php') !== false ? 'YES' : 'NO') . "<br>";

// Fix wp-config.php
echo "<h2>wp-config.php</h2>";
$config = $_SERVER['DOCUMENT_ROOT'] . '/wp/wp-config.php';
echo "Path: $config<br>";
echo "Exists: " . (file_exists($config) ? 'YES' : 'NO') . "<br>";
echo "Writable: " . (is_writable($config) ? 'YES' : 'NO') . "<br>";

if (file_exists($config)) {
    $content = file_get_contents($config);
    echo "Has 'wp_': " . (strpos($content, "'wp_'") !== false ? 'YES' : 'NO') . "<br>";
    echo "Has 'eak_': " . (strpos($content, "'eak_'") !== false ? 'YES' : 'NO') . "<br>";
    
    $content = str_replace("'wp_'", "'eak_'", $content);
    copy($config, $config . '.bak2');
    $result = file_put_contents($config, $content);
    echo "Write result: " . ($result !== false ? "$result bytes" : "FAILED") . "<br>";
    
    $after = file_get_contents($config);
    echo "After has 'wp_': " . (strpos($after, "'wp_'") !== false ? 'YES (still there!)' : 'NO') . "<br>";
    echo "After has 'eak_': " . (strpos($after, "'eak_'") !== false ? 'YES' : 'NO') . "<br>";
}

echo "<hr><h3>Test:</h3>";
echo "<a href='/wp/'>/wp/</a> | <a href='/wp/wp-admin/'>Admin</a> | <a href='/wp/wp-json/wp/v2/posts'>API</a>";
