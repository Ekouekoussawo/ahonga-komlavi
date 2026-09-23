const https = require('https');

function fetch(url) {
  return new Promise((resolve) => {
    https.get(url, { timeout: 15000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const target = new URL(res.headers.location, url).href;
        console.log(`  301 -> ${target}`);
        return fetch(target, resolve);
      }
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body, ct: res.headers['content-type'] }));
    }).on('error', (err) => resolve({ status: 0, error: err.message }));
  });
}

(async () => {
  console.log('=== FIXED VERIFICATION (follows redirects) ===\n');

  const pages = [
    'https://evangelisteahongankomlavi.com/',
    'https://evangelisteahongankomlavi.com/about',
    'https://evangelisteahongankomlavi.com/contact',
    'https://evangelisteahongankomlavi.com/galerie',
    'https://evangelisteahongankomlavi.com/ministry',
    'https://evangelisteahongankomlavi.com/preche',
    'https://evangelisteahongankomlavi.com/sermons',
  ];

  for (const url of pages) {
    const r = await fetch(url);
    const ok = r.status === 200;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${r.status}  ${url}`);
  }

  // Check replacement chars via byte buffer
  const home = await fetch('https://evangelisteahongankomlavi.com/');
  const buf = Buffer.from(home.body, 'utf8');
  const repl = Buffer.from([0xEF, 0xBF, 0xBD]);
  let count = 0;
  let pos = 0;
  while ((pos = buf.indexOf(repl, pos)) !== -1) { count++; pos++; }
  console.log(`\nReplacement chars (byte-level): ${count}`);

  // Check French characters
  const hasFrench = buf.includes(Buffer.from('communauté', 'utf8'));
  console.log(`Has French text: ${hasFrench ? 'PASS' : 'FAIL'}`);

  console.log('\n=== DONE ===');
})();
