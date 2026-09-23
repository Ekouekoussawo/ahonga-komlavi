const https = require('https');

function fetch(url) {
  return new Promise((resolve) => {
    https.get(url, { timeout: 15000 }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    }).on('error', (err) => resolve({ status: 0, error: err.message }));
  });
}

(async () => {
  // Try to read the root .htaccess - it's blocked by Apache, but let's check if we can get it differently
  // Let me check what the homepage HTML says about the server
  const home = await fetch('https://evangelisteahongankomlavi.com/');
  console.log('Homepage status:', home.status);
  console.log('Content-Type:', home.ct);

  // Check if /wp/ has a different response when accessed with trailing slash
  console.log('\n=== /wp/ with trailing slash ===');
  const wp1 = await fetch('https://evangelisteahongankomlavi.com/wp/');
  console.log('/wp/:', wp1.status);

  console.log('\n=== /wp/wp-admin/ ===');
  const wp2 = await fetch('https://evangelisteahongankomlavi.com/wp/wp-admin/');
  console.log('/wp/wp-admin/:', wp2.status);

  // Check if there's a PHP test we can run
  console.log('\n=== Check PHP version via a test ===');
  // The fact that /wp/wp-json/wp/v2/posts returns HTML means it's going through Next.js
  // We need to check if WordPress PHP works at all

  // Let me check what files are in the wp directory
  console.log('\n=== Check if WordPress files exist ===');
  // Try to access a known WordPress file
  const readme = await fetch('https://evangelisteahongankomlavi.com/wp/wp-includes/version.php');
  console.log('wp-includes/version.php:', readme.status);
  if (readme.status === 200) {
    console.log('Contains WordPress:', readme.body.includes('wp_version'));
  }

  // Try another approach - check if Apache serves PHP by accessing a PHP file directly
  console.log('\n=== PHP test ===');
  // Check if there's a test PHP file we can create info about
  // Or check the error log
})();
