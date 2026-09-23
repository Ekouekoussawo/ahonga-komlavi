const https = require('https');

function fetch(url) {
  return new Promise((resolve) => {
    https.get(url, { timeout: 15000 }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, ct: res.headers['content-type'], body: body.substring(0, 1500) }));
    }).on('error', (err) => resolve({ status: 0, error: err.message }));
  });
}

(async () => {
  console.log('=== Current Status ===\n');
  const urls = [
    { url: 'https://evangelisteahongankomlavi.com/', name: 'Homepage' },
    { url: 'https://evangelisteahongankomlavi.com/sermons', name: 'Sermons' },
    { url: 'https://evangelisteahongankomlavi.com/wp/', name: 'WordPress /wp/' },
    { url: 'https://evangelisteahongankomlavi.com/wp/wp-json/wp/v2/posts', name: 'REST API' },
    { url: 'https://evangelisteahongankomlavi.com/wp/wp-diag.php', name: 'PHP Diagnostic' },
  ];

  for (const { url, name } of urls) {
    const r = await fetch(url);
    console.log(`${r.status}  ${name}`);
    if (r.ct && r.ct.includes('json')) {
      try {
        const json = JSON.parse(r.body);
        console.log(`  JSON: ${Array.isArray(json) ? json.length + ' posts' : 'object'}`);
      } catch {
        console.log(`  ${r.body.substring(0, 200)}`);
      }
    } else if (r.body.includes('PHP') || r.body.includes('Database') || r.body.includes('ERROR')) {
      console.log(`  ${r.body.substring(0, 800)}`);
    } else if (r.status === 500) {
      console.log(`  500 - PHP error (no display)`);
    } else if (r.status === 404) {
      console.log(`  404 - File not found`);
    } else if (r.body.includes('<!DOCTYPE')) {
      console.log(`  Returns HTML`);
    } else {
      console.log(`  ${r.body.substring(0, 200)}`);
    }
    console.log('');
  }
})();
