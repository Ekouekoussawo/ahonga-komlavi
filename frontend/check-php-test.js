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
  const tests = [
    'https://evangelisteahongankomlavi.com/php-test.php',
    'https://evangelisteahongankomlavi.com/wpphp-test.php',
  ];

  for (const url of tests) {
    const r = await fetch(url);
    console.log(`${url}: ${r.status}`);
    console.log(`  CT: ${r.ct}`);
    console.log(`  Body: ${r.body.substring(0, 300)}`);
    console.log('');
  }
})();
