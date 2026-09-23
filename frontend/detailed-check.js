const https = require('https');

function fetch(url) {
  return new Promise((resolve) => {
    https.get(url, { timeout: 15000 }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, ct: res.headers['content-type'], body: body.substring(0, 2000), headers: res.headers }));
    }).on('error', (err) => resolve({ status: 0, body: err.message }));
  });
}

(async () => {
  console.log('=== Detailed Check ===\n');
  const urls = [
    { url: 'https://evangelisteahongankomlavi.com/wp/wp-diag.php', name: 'Diag' },
    { url: 'https://evangelisteahongankomlavi.com/wp/wp-fix-prefix.php', name: 'Fixer' },
    { url: 'https://evangelisteahongankomlavi.com/wp/', name: 'WP /wp/' },
    { url: 'https://evangelisteahongankomlavi.com/wp/wp-json/wp/v2/posts', name: 'REST API' },
  ];

  for (const { url, name } of urls) {
    const r = await fetch(url);
    console.log(`${r.status}  ${name}`);
    console.log(`  CT: ${r.ct}`);
    if (r.status === 200 && r.body) {
      // Show key indicators
      if (r.body.includes('prefix')) console.log(`  PREFIX: ${r.body.substring(r.body.indexOf('prefix'), r.body.indexOf('prefix')+200)}`);
      if (r.body.includes('PHP Version')) console.log(`  ${r.body.substring(0, 500)}`);
      if (r.body.includes('eak_')) console.log(`  HAS eak_: YES`);
      if (r.body.includes('Dashboard') || r.body.includes('wp-admin')) console.log(`  WP ADMIN PAGE`);
      if (r.body.includes('ERROR') || r.body.includes('error')) console.log(`  ${r.body.substring(0, 300)}`);
      if (r.body.includes('<!DOCTYPE')) console.log(`  HTML`);
    } else if (r.status === 0) {
      console.log(`  ERR: ${r.body.substring(0, 100)}`);
    }
    console.log('');
  }
})();
