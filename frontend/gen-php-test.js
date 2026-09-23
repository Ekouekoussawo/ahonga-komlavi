const fs = require('fs');

// Simple PHP test - does PHP execute in /wp/?
const simple = "<?php echo 'PHP_OK_' . PHP_VERSION; ?>";
fs.writeFileSync('C:/Users/Oel/sites/ahonga-komlavi/frontend/public/php-test.php', simple, 'utf8');
console.log('Created php-test.php');

// Also create a test in /wp/ style
const wpSimple = "<?php echo 'WP_PHP_OK_' . PHP_VERSION; ?>";
fs.writeFileSync('C:/Users/Oel/sites/ahonga-komlavi/frontend/public/wpphp-test.php', wpSimple, 'utf8');
console.log('Created wpphp-test.php');

// Check what's happening with WordPress - try reading wp-config from server via a different approach
// Check if wp-config.php exists by trying to access a non-PHP file
console.log('\nCheck if wp directory exists on server by checking for readme.html');
