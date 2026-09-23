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
  console.log('=== Detailed Check ===\n');

  // Check REST API properly
  const api = await fetch('https://evangelisteahongankomlavi.com/wp/wp-json/wp/v2/posts');
  console.log('REST API:', api.status, api.ct);
  console.log('Body:', api.body.substring(0, 500));
  try {
    const json = JSON.parse(api.body);
    console.log('JSON OK:', json.length, 'posts');
    json.slice(0, 3).forEach(p => console.log(`  - ${p.title.rendered} (${p.slug})`));
  } catch {
    console.log('Not JSON');
  }

  // Check /wp/ homepage
  const wp = await fetch('https://evangelisteahongankomlavi.com/wp/');
  console.log('\nWP Home:', wp.status);
  console.log('Has WordPress:', wp.body.includes('WordPress'));
  console.log('Has login:', wp.body.includes('login'));

  // Check homepage still works
  const home = await fetch('https://evangelisteahongankomlavi.com/');
  console.log('\nNext.js Home:', home.status);
  console.log('Has sermon links:', home.body.includes('sermons/'));

  // Check sermon page
  const serm = await fetch('https://evangelisteahongankomlavi.com/sermons/');
  console.log('\nSermons page:', serm.status);

  // Check about page
  const about = await fetch('https://evangelisteahongankomlavi.com/about');
  console.log('About:', about.status);
})();
