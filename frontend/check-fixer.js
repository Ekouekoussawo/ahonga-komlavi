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
  console.log('=== Check Fixer ===\n');
  const r = await fetch('https://evangelisteahongankomlavi.com/wp/wp-fix-prefix.php');
  console.log(`${r.status}`);
  console.log(r.body);
})();
