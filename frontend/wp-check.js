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
  console.log('=== WordPress Site Check ===\n');
  const urls = [
    { url: 'https://evangelisteahongankomlavi.com/wp/', name: 'WP Home /wp/' },
    { url: 'https://evangelisteahongankomlavi.com/wp/wp-admin/', name: 'WP Admin' },
    { url: 'https://evangelisteahongankomlavi.com/wp/wp-json/wp/v2/posts', name: 'REST API' },
    { url: 'https://evangelisteahongankomlavi.com/wp/wp-diag.php', name: 'Diag' },
    { url: 'https://evangelisteahongankomlavi.com/wp/wp-fix-prefix.php', name: 'Fixer' },
  ];

  for (const { url, name } of urls) {
    const r = await fetch(url);
    let info = `${r.status}  ${name}`;
    if (r.ct && r.ct.includes('json')) {
      try {
        const json = JSON.parse(r.body);
        info += ` | JSON: ${Array.isArray(json) ? json.length + ' posts' : 'object'}`;
      } catch { info += ` | ${r.body.substring(0, 100)}`; }
    } else if (r.status === 200 && r.body.includes('Dashboard')) {
      info += ' | WP Admin Dashboard';
    } else if (r.status === 200 && r.body.includes('login')) {
      info += ' | Login page';
    } else if (r.status === 200 && r.body.includes('prefix')) {
      info += ` | ${r.body.substring(0, 300)}`;
    } else if (r.status === 200 && r.body.includes('eak_')) {
      info += ' | eak_ found';
    } else if (r.status === 500) {
      info += ' | PHP error';
    } else if (r.status === 0) {
      info += ` | ERR: ${r.body.substring(0, 80)}`;
    }
    console.log(info);
  }

  // Also check Next.js pages still work
  console.log('\n=== Next.js Pages ===\n');
  const nextUrls = [
    'https://evangelisteahongankomlavi.com/',
    'https://evangelisteahongankomlavi.com/sermons',
  ];
  for (const url of nextUrls) {
    const r = await fetch(url);
    console.log(`${r.status}  ${url}`);
  }
})();
