const https = require('https');

function fetch(url) {
  return new Promise((resolve) => {
    https.get(url, { timeout: 15000 }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, ct: res.headers['content-type'], body: body.substring(0, 2000) }));
    }).on('error', (err) => resolve({ status: 0, body: err.message }));
  });
}

(async () => {
  console.log('=== Deep Investigation ===\n');

  // Check .htaccess directly
  const htaccess = await fetch('https://evangelisteahongankomlavi.com/wp/.htaccess');
  console.log('.htaccess:', htaccess.status);
  console.log(htaccess.body.substring(0, 500));

  console.log('\n---');

  // Check REST API with full response
  const api = await fetch('https://evangelisteahongankomlavi.com/wp/wp-json/wp/v2/posts?per_page=1');
  console.log('\nREST API:', api.status);
  console.log('CT:', api.ct);
  console.log('Body:', api.body.substring(0, 500));

  console.log('\n---');

  // Check homepage content type
  const home = await fetch('https://evangelisteahongankomlavi.com/');
  console.log('\nHomepage:', home.status);
  console.log('CT:', home.ct);
  console.log('Has sermon:', home.body.includes('sermons'));
  console.log('Has Dashboard:', home.body.includes('Dashboard'));
  console.log('Has React:', home.body.includes('React') || home.body.includes('react'));
  console.log('First 200 chars:', home.body.substring(0, 200));

  // Check wp/ homepage
  const wp = await fetch('https://evangelisteahongankomlavi.com/wp/');
  console.log('\nWP Home:', wp.status);
  console.log('CT:', wp.ct);
  console.log('First 300 chars:', wp.body.substring(0, 300));

  // Check a sermon page
  const serm = await fetch('https://evangelisteahongankomlavi.com/sermons/armee-de-midi/');
  console.log('\nSermon:', serm.status);
  console.log('Has sermon text:', serm.body.includes('Armee') || serm.body.includes('Armée'));
})();
