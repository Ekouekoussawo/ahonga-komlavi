const https = require('https');

function fetch(url) {
  return new Promise((resolve) => {
    https.get(url, { timeout: 15000 }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, ct: res.headers['content-type'], body: body.substring(0, 1000) }));
    }).on('error', (err) => resolve({ status: 0, body: err.message }));
  });
}

(async () => {
  console.log('=== NEXT.JS SITE ===\n');
  const nextUrls = [
    'https://evangelisteahongankomlavi.com/',
    'https://evangelisteahongankomlavi.com/sermons',
    'https://evangelisteahongankomlavi.com/about',
  ];
  for (const url of nextUrls) {
    const r = await fetch(url);
    console.log(`${r.status}  ${url}`);
  }

  console.log('\n=== WORDPRESS ===\n');
  const wpUrls = [
    { url: 'https://evangelisteahongankomlavi.com/wp/', name: '/wp/' },
    { url: 'https://evangelisteahongankomlavi.com/wp/wp-admin/', name: '/wp/wp-admin/' },
    { url: 'https://evangelisteahongankomlavi.com/wp/wp-json/wp/v2/posts', name: '/wp/wp-json/wp/v2/posts' },
    { url: 'https://evangelisteahongankomlavi.com/wp/wp-fix-all.php', name: '/wp/wp-fix-all.php' },
    { url: 'https://evangelisteahongankomlavi.com/wp/wp-diag.php', name: '/wp/wp-diag.php' },
    { url: 'https://evangelisteahongankomlavi.com/wp/wp-fix-prefix.php', name: '/wp/wp-fix-prefix.php' },
  ];
  for (const { url, name } of wpUrls) {
    const r = await fetch(url);
    let info = `${r.status}  ${name}`;
    if (r.ct && r.ct.includes('json')) info += ' | JSON';
    else if (r.status === 200 && r.body.includes('Dashboard')) info += ' | Admin Dashboard';
    else if (r.status === 200 && r.body.includes('login')) info += ' | Login';
    else if (r.status === 200 && r.body.includes('WordPress')) info += ' | WP Page';
    else if (r.status === 500) info += ' | PHP error';
    else if (r.status === 0) info += ' | ERR: ' + r.body.substring(0, 60);
    console.log(info);
  }
})();
