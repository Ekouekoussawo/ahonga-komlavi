const https = require('https');

function fetch(url) {
  return new Promise((resolve) => {
    https.get(url, { timeout: 15000 }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, ct: res.headers['content-type'], body: body.substring(0, 1500) }));
    }).on('error', (err) => resolve({ status: 0, body: err.message }));
  });
}

(async () => {
  console.log('=== Status Check ===\n');
  const urls = [
    { url: 'https://evangelisteahongankomlavi.com/wp/wp-config.php.bak', name: 'Backup exists' },
    { url: 'https://evangelisteahongankomlavi.com/wp/wp-fix-prefix.php', name: 'Fixer' },
    { url: 'https://evangelisteahongankomlavi.com/wp/wp-diag.php', name: 'Diag' },
    { url: 'https://evangelisteahongankomlavi.com/wp/', name: 'WP /wp/' },
    { url: 'https://evangelisteahongankomlavi.com/wp/wp-admin/', name: 'WP Admin' },
    { url: 'https://evangelisteahongankomlavi.com/wp/wp-json/wp/v2/posts', name: 'REST API' },
    { url: 'https://evangelisteahongankomlavi.com/', name: 'Homepage' },
    { url: 'https://evangelisteahongankomlavi.com/sermons', name: 'Sermons' },
  ];

  for (const { url, name } of urls) {
    const r = await fetch(url);
    console.log(`${r.status}  ${name}`);
    if (r.status === 200 && r.ct && r.ct.includes('json')) {
      try {
        const json = JSON.parse(r.body);
        console.log(`  JSON: ${Array.isArray(json) ? json.length + ' posts' : 'object'}`);
      } catch {
        console.log(`  ${r.body.substring(0, 100)}`);
      }
    } else if (r.status === 200 && r.body.includes('Dashboard') || r.body.includes('wp-admin') || r.body.includes('login')) {
      console.log(`  WordPress admin page`);
    } else if (r.status === 200 && r.body.includes('<!DOCTYPE')) {
      console.log(`  HTML`);
    } else if (r.status === 500) {
      console.log(`  500 PHP error`);
    } else if (r.body.includes('Error') || r.body.includes('error')) {
      console.log(`  ${r.body.substring(0, 200)}`);
    }
  }
})();
