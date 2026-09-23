const https = require('https');

function fetch(url) {
  return new Promise((resolve) => {
    https.get(url, { timeout: 15000 }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, ct: res.headers['content-type'], body: body.substring(0, 500) }));
    }).on('error', (err) => resolve({ status: 0, error: err.message }));
  });
}

(async () => {
  console.log('=== WordPress After .htaccess Fix ===\n');
  const urls = [
    'https://evangelisteahongankomlavi.com/wp/',
    'https://evangelisteahongankomlavi.com/wp/wp-admin/',
    'https://evangelisteahongankomlavi.com/wp/wp-json/wp/v2/posts',
    'https://evangelisteahongankomlavi.com/wp/wp-json/wp/v2/posts?per_page=3',
    'https://evangelisteahongankomlavi.com/wp/index.php',
  ];

  for (const url of urls) {
    const r = await fetch(url);
    const isJson = r.ct && r.ct.includes('json');
    console.log(`${r.status}  ${url}`);
    console.log(`  Content-Type: ${r.ct}`);
    if (isJson) {
      try {
        const json = JSON.parse(r.body);
        console.log(`  JSON: ${Array.isArray(json) ? json.length + ' posts' : 'object'}`);
      } catch {
        console.log(`  Body: ${r.body.substring(0, 200)}`);
      }
    } else if (r.status === 200 && r.body.includes('<!DOCTYPE')) {
      console.log(`  Returns HTML (Next.js fallback?)`);
    }
    console.log('');
  }
})();
