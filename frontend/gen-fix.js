const fs = require('fs');

// Create a PHP script to fix the table prefix in wp-config.php
const fixScript = `<?php
// Fix WordPress table prefix
\$configFile = \$_SERVER['DOCUMENT_ROOT'] . '/wp/wp-config.php';
echo "<h2>Table Prefix Fixer</h2>";
echo "<p>Config file: \$configFile</p>";
echo "<p>File exists: " . (file_exists(\$configFile) ? 'YES' : 'NO') . "</p>";

if (!file_exists(\$configFile)) {
    echo "<p style='color:red'>ERROR: Config file not found</p>";
    exit(1);
}

\$content = file_get_contents(\$configFile);
echo "<p>Current prefix: ";
if (preg_match("/\\\$table_prefix\\s*=\\s*'([^']+)'/", \$content, \$m)) {
    echo \$m[1] . "</p>";
} else {
    echo "not found</p>";
}

// Replace wp_ with eak_ in table prefix
\$newContent = preg_replace(
    "/\\\$table_prefix\\s*=\\s*'([^']+)'/",
    "\$table_prefix = 'eak_'",
    \$content
);

if (\$newContent !== \$content) {
    // Also fix any references to wp_ tables in the config (like table names in options)
    // Save
    \$backup = \$configFile . '.bak_prefix_fix';
    copy(\$configFile, \$backup);
    echo "<p>Backup saved to: \$backup</p>";
    
    file_put_contents(\$configFile, \$newContent);
    echo "<p style='color:green'>Table prefix updated from wp_ to eak_</p>";
} else {
    echo "<p>No changes needed or already fixed</p>";
}

// Verify
\$content2 = file_get_contents(\$configFile);
if (preg_match("/\\\$table_prefix\\s*=\\s*'([^']+)'/", \$content2, \$m2)) {
    echo "<p>New prefix: " . \$m2[1] . "</p>";
}

echo "<hr><p><a href='/wp/'>Try WordPress</a> | <a href='/wp/wp-admin/'>Try Admin</a></p>";
`;

fs.writeFileSync('C:/Users/Oel/sites/ahonga-komlavi/frontend/public/wp-fix-prefix.php', fixScript, 'utf8');
console.log('Created wp-fix-prefix.php');
console.log('Upload to /home4/zank/evangelisteahongankomlavi.com/wp/wp-fix-prefix.php');
console.log('Then access https://evangelisteahongankomlavi.com/wp/wp-fix-prefix.php');
