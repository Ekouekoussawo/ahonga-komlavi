const https = require('https');

function fetch(url) {
  return new Promise((resolve) => {
    https.get(url, { timeout: 15000 }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, ct: res.headers['content-type'], body: body.substring(0, 1000) }));
    }).on('error', (err) => resolve({ status: 0, error: err.message }));
  });
}

(async () => {
  console.log('=== Current Status Check ===\n');
  const urls = [
    { url: 'https://evangelisteahongankomlavi.com/', name: 'Homepage' },
    { url: 'https://evangelisteahongankomlavi.com/sermons', name: 'Sermons' },
    { url: 'https://evangelisteahongankomlavi.com/wp/', name: 'WordPress /wp/' },
    { url: 'https://evangelisteahongankomlavi.com/wp/wp-json/wp/v2/posts', name: 'REST API' },
    { url: 'https://evangelisteahongankomlavi.com/wp/wp-diag.php', name: 'PHP Diagnostic' },
  ];

  for (const { url, name } of urls) {
    try {
      const r = await fetch(url);
      const isJson = r.ct && r.ct.includes('json');
      console.log(`${r.status}  ${name}`);
      if (isJson) {
        try {
          const json = JSON.parse(r.body);
          console.log(`  JSON OK: ${Array.isArray(json) ? json.length + ' items' : 'object'}`);
        } catch {
          console.log(`  Body: ${r.body.substring(0, 200)}`);
        }
      } else if (r.body.includes('Database') || r.body.includes('PHP')) {
        console.log(`  ${r.body.substring(0, 500)}`);
      } else if (r.body.includes('<!DOCTYPE')) {
        console.log(`  Returns HTML`);
      } else if (r.status === 500) {
        console.log(`  Empty 500 - PHP error (no display)`);
      }
    } catch (e) {
      console.log(`ERROR  ${name}: ${e.message.substring(0, 80)}`);
    }
    console.log('');
  }
})();
