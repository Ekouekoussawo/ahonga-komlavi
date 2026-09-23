const https = require('https');

function fetch(url) {
  return new Promise((resolve) => {
    https.get(url, { timeout: 15000 }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, ct: res.headers['content-type'], body: body.substring(0, 500) }));
    }).on('error', (err) => resolve({ status: 0, body: err.message }));
  });
}

(async () => {
  console.log('=== Quick Status ===\n');
  const urls = [
    { url: 'https://evangelisteahongankomlavi.com/', name: 'Next.js Home' },
    { url: 'https://evangelisteahongankomlavi.com/sermons', name: 'Sermons' },
    { url: 'https://evangelisteahongankomlavi.com/wp/', name: 'WP /wp/' },
    { url: 'https://evangelisteahongankomlavi.com/wp/wp-json/wp/v2/posts', name: 'REST API' },
  ];
  for (const { url, name } of urls) {
    const r = await fetch(url);
    console.log(`${r.status}  ${name}`);
  }
})();
