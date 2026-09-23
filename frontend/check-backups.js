const https = require('https');

function fetch(url) {
  return new Promise((resolve) => {
    https.get(url, { timeout: 15000 }, (res) => {
      resolve({ status: res.statusCode });
    }).on('error', (err) => resolve({ status: 0 }));
  });
}

(async () => {
  const urls = [
    'https://evangelisteahongankomlavi.com/wp/wp-config.php.bak',
    'https://evangelisteahongankomlavi.com/wp/wp-config.php.bak_prefix',
    'https://evangelisteahongankomlavi.com/wp/wp-config.php.bak_prefix_fix',
  ];
  for (const url of urls) {
    const r = await fetch(url);
    console.log(url, r.status);
  }
})();
