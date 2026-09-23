const https = require('https');

function fetch(url) {
  return new Promise((resolve) => {
    https.get(url, { timeout: 15000 }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, ct: res.headers['content-type'], body: body.substring(0, 2000) }));
    }).on('error', (err) => resolve({ status: 0, error: err.message }));
  });
}

(async () => {
  console.log('=== Status After Prefix Fix ===\n');
  const urls = [
    { url: 'https://evangelisteahongankomlavi.com/wp/wp-fix-prefix.php', name: 'Fixer' },
    { url: 'https://evangelisteahongankomlavi.com/wp/', name: 'WordPress /wp/' },
    { url: 'https://evangelisteahongankomlavi.com/wp/wp-admin/', name: 'WP Admin' },
    { url: 'https://evangelisteahongankomlavi.com/wp/wp-json/wp/v2/posts', name: 'REST API' },
    { url: 'https://evangelisteahongankomlavi.com/', name: 'Homepage' },
    { url: 'https://evangelisteahongankomlavi.com/sermons', name: 'Sermons' },
  ];

  for (const { url, name } of urls) {
    const r = await fetch(url);
    console.log(`${r.status}  ${name}`);
    if (r.body.includes('prefix') || r.body.includes('Prefix') || r.body.includes('eak')) {
      console.log(`  ${r.body.substring(0, 600)}`);
    } else if (r.ct && r.ct.includes('json')) {
      try {
        const json = JSON.parse(r.body);
        console.log(`  JSON: ${Array.isArray(json) ? json.length + ' posts' : 'object'}`);
      } catch {
        console.log(`  ${r.body.substring(0, 200)}`);
      }
    } else if (r.body.includes('<!DOCTYPE')) {
      console.log(`  HTML`);
    } else if (r.status === 500) {
      console.log(`  500`);
    }
    console.log('');
  }
})();
