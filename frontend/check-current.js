const https = require('https');

function fetch(url) {
  return new Promise((resolve) => {
    https.get(url, { timeout: 15000 }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: body.substring(0, 2000) }));
    }).on('error', (err) => resolve({ status: 0, body: err.message }));
  });
}

(async () => {
  console.log('=== Current Status ===\n');
  const urls = [
    { url: 'https://evangelisteahongankomlavi.com/wp/wp-fix-prefix.php', name: 'Fixer' },
    { url: 'https://evangelisteahongankomlavi.com/wp/wp-diag.php', name: 'Diag' },
    { url: 'https://evangelisteahongankomlavi.com/wp/', name: 'WP /wp/' },
    { url: 'https://evangelisteahongankomlavi.com/wp/wp-json/wp/v2/posts', name: 'REST API' },
  ];

  for (const { url, name } of urls) {
    const r = await fetch(url);
    console.log(`${r.status}  ${name}`);
    if (r.status === 200 && r.body.length > 100) {
      // Check for key indicators
      if (r.body.includes('prefix') || r.body.includes('Prefix')) {
        console.log(`  ${r.body.substring(0, 800)}`);
      } else if (r.body.includes('PHP') || r.body.includes('Database')) {
        console.log(`  ${r.body.substring(0, 800)}`);
      } else if (r.body.includes('<!DOCTYPE')) {
        console.log(`  HTML (Next.js)`);
      } else {
        console.log(`  ${r.body.substring(0, 200)}`);
      }
    }
    console.log('');
  }
})();
