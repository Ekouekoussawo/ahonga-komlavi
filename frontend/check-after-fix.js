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
  console.log('=== After Fix ===\n');
  const urls = [
    { url: 'https://evangelisteahongankomlavi.com/wp/wp-fix-all.php', name: 'Fixer' },
    { url: 'https://evangelisteahongankomlavi.com/wp/', name: 'WP /wp/' },
    { url: 'https://evangelisteahongankomlavi.com/wp/wp-admin/', name: 'WP Admin' },
    { url: 'https://evangelisteahongankomlavi.com/wp/wp-json/wp/v2/posts', name: 'REST API' },
    { url: 'https://evangelisteahongankomlavi.com/', name: 'Next.js Home' },
  ];

  for (const { url, name } of urls) {
    const r = await fetch(url);
    let info = `${r.status}  ${name}`;
    if (r.status === 200 && r.body.includes('Dashboard')) info += ' | Admin Dashboard';
    else if (r.status === 200 && r.body.includes('login')) info += ' | Login';
    else if (r.status === 200 && r.body.includes('WordPress')) info += ' | WP Page';
    else if (r.status === 200 && r.ct && r.ct.includes('json')) info += ' | JSON';
    else if (r.status === 200 && r.body.includes('eak_')) info += ' | eak_ confirmed';
    else if (r.status === 500) info += ' | PHP error';
    else if (r.status === 0) info += ' | ERR';
    console.log(info);
  }
})();
