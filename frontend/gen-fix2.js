const fs = require('fs');

// Simpler fix using string replacement, no regex issues
const fixScript = `<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

\$configFile = \$_SERVER['DOCUMENT_ROOT'] . '/wp/wp-config.php';
echo "<h2>Table Prefix Fixer</h2>";
echo "<p>File: \$configFile</p>";
echo "<p>Exists: " . (file_exists(\$configFile) ? 'YES' : 'NO') . "</p>";

if (!file_exists(\$configFile)) {
    echo "<p style='color:red'>File not found</p>";
    exit(1);
}

\$content = file_get_contents(\$configFile);

// Find current prefix
\$prefix = 'wp_';
if (strpos(\$content, "\\\$table_prefix = '") !== false) {
    preg_match("/\\\$table_prefix\\s*=\\s*'([^']+)'/", \$content, \$m);
    \$prefix = \$m[1] ?? 'not found';
}
echo "<p>Current prefix: <strong>\$prefix</strong></p>";

if (\$prefix === 'eak_') {
    echo "<p style='color:green'>Already fixed!</p>";
} else {
    // Replace
    \$newContent = str_replace("\\\$table_prefix = '$prefix'", "\\\$table_prefix = 'eak_'", \$content);
    if (\$newContent !== \$content) {
        copy(\$configFile, \$configFile . '.bak_prefix');
        file_put_contents(\$configFile, \$newContent);
        echo "<p style='color:green'>Prefix changed: $prefix -> eak_</p>";
    } else {
        echo "<p style='color:red'>Replacement failed</p>";
    }
}

// Verify
\$content2 = file_get_contents(\$configFile);
if (preg_match("/\\\$table_prefix\\s*=\\s*'([^']+)'/", \$content2, \$m2)) {
    echo "<p>Verified prefix: " . \$m2[1] . "</p>";
}

// Test DB with new prefix
echo "<h3>DB Test</h3>";
try {
    \$pdo = new PDO("mysql:host=localhost;dbname=zank_ahonga;charset=utf8mb4", 'zank_ahonga', 'csdFVM5sAIonVoO8UCwE5J4o');
    \$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    \$stmt = \$pdo->query("SHOW TABLES LIKE 'eak_%'");
    \$tables = \$stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "<p>eak_ tables found: " . count(\$tables) . "</p>";
    echo "<ul>" . implode('', array_map(fn(\$t) => "<li>\$t</li>", \$tables)) . "</ul>";
} catch (PDOException \$e) {
    echo "<p style='color:red'>DB error: " . \$e->getMessage() . "</p>";
}

echo "<hr><p><a href='/wp/'>Try WordPress</a></p>";
`;

fs.writeFileSync('C:/Users/Oel/sites/ahonga-komlavi/frontend/public/wp-fix-prefix.php', fixScript, 'utf8');
console.log('Created wp-fix-prefix.php');
