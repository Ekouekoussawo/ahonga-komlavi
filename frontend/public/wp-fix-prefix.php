<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

$f = $_SERVER['DOCUMENT_ROOT'] . '/wp/wp-config.php';
echo "Prefix Fixer<br>";
echo "File: $f<br>";
echo "Exists: " . (file_exists($f) ? 'YES' : 'NO') . "<br>";

$c = file_get_contents($f);

// Simple approach: find and replace the prefix
echo "Searching for wp_...<br>";
if (strpos($c, "'wp_'") !== false) {
    echo "Found 'wp_' in file<br>";
    $n = str_replace("'wp_'", "'eak_'", $c);
    if ($n !== $c) {
        copy($f, $f . '.bak');
        file_put_contents($f, $n);
        echo "<span style='color:green'>Fixed! wp_ replaced with eak_</span><br>";
    }
} else {
    echo "'wp_' not found<br>";
}

// Show context around eak_
$pos = strpos($n ?? $c, 'eak_');
if ($pos !== false) {
    echo "Context: " . substr($n ?? $c, max(0,$pos-20), 50) . "<br>";
}

// DB test
echo "<br>DB Test:<br>";
try {
    $pdo = new PDO("mysql:host=localhost;dbname=zank_ahonga;charset=utf8mb4", 'zank_ahonga', 'csdFVM5sAIonVoO8UCwE5J4o');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $t = $pdo->query("SHOW TABLES LIKE 'eak_%'")->fetchAll(PDO::FETCH_COLUMN);
    echo "eak_ tables: " . count($t) . "<br>";
    foreach ($t as $_t) echo "- $_t<br>";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "<br>";
}

echo "<hr><a href='/wp/'>WordPress</a>";
