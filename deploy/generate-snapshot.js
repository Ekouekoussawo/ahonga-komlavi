const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const HOST = 'gator3223.hostgator.com';
const USER = 'zank';
const PASS = process.env.HG_PASS || 'g-s}n&4SOuT54^J.K&XGbV5wgy(YWKQ=';
const DB_USER = 'zank_ahonga';
const DB_NAME = 'zank_ahonga';
const DB_PASS = 'csdFVM5sAIonVoO8UCwE5J4o';
const TABLE_PREFIX = 'eak_';

async function runMySQL(sql) {
  const conn = new Client();
  return new Promise((resolve, reject) => {
    conn.on('ready', () => {
      // Use base64 to avoid all quoting issues
      const b64 = Buffer.from(sql, 'utf8').toString('base64');
      const command = `echo "${b64}" | base64 -d | mysql -u ${DB_USER} -p'${DB_PASS}' ${DB_NAME}`;
      conn.exec(command, (err, stream) => {
        if (err) { conn.end(); return reject(err); }
        let data = '';
        let errData = '';
        stream.on('data', (d) => data += d.toString());
        if (stream.stderr) stream.stderr.on('data', (d) => errData += d.toString());
        stream.on('end', () => {
          conn.end();
          try {
            resolve(JSON.parse(data));
          } catch {
            console.error('MySQL STDERR:', errData.substring(0, 300));
            resolve(null);
          }
        });
      });
    }).connect({ host: HOST, port: 22, username: USER, password: PASS });
  });
}

async function generateSnapshot() {
  console.log('Step 1: Querying posts...');
  const posts = await runMySQL(
    `SELECT p.ID as id, p.post_title as title, p.post_content as content, ` +
    `p.post_excerpt as excerpt, p.post_name as slug, p.post_date as date, ` +
    `p.post_author as author_id, p.post_type as post_type, p.post_parent as post_parent, p.guid as guid ` +
    `FROM ${TABLE_PREFIX}posts p ` +
    `WHERE p.post_status='publish' AND p.post_type IN ('post','page')`
  );
  if (!posts || posts.length === 0) { console.error('No posts found'); process.exit(1); }
  console.log(`  Found ${posts.length} posts`);

  console.log('Step 2: Querying term relationships...');
  const tr = await runMySQL(
    `SELECT tr.object_id, tt.term_taxonomy_id, tt.taxonomy, ` +
    `t.term_id, t.name as term_name, t.slug as term_slug ` +
    `FROM ${TABLE_PREFIX}term_relation tr ` +
    `JOIN ${TABLE_PREFIX}term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id ` +
    `JOIN ${TABLE_PREFIX}terms t ON tt.term_id = t.term_id`
  );
  const trData = tr || [];
  console.log(`  Found ${trData.length} term relationships`);

  console.log('Step 3: Querying authors...');
  const users = await runMySQL(
    `SELECT ID, display_name, user_nicename FROM ${TABLE_PREFIX}users`
  );
  const usersData = users || [];
  const userMap = {};
  for (const u of usersData) userMap[u.ID] = u;
  console.log(`  Found ${usersData.length} users`);

  console.log('Step 4: Querying featured media...');
  const thumbnails = await runMySQL(
    `SELECT pm.post_id, p.guid as media_url, p.post_mime_type ` +
    `FROM ${TABLE_PREFIX}postmeta pm ` +
    `JOIN ${TABLE_PREFIX}posts p ON pm.meta_value = p.ID AND p.post_type = 'attachment' ` +
    `WHERE pm.meta_key = '_thumbnail_id'`
  );
  const thumbData = thumbnails || [];
  const thumbMap = {};
  for (const t of thumbData) thumbMap[t.post_id] = t.media_url;
  console.log(`  Found ${thumbData.length} featured media`);

  // Build posts with _embed
  console.log('Step 5: Building snapshot...');
  const result = [];
  for (const p of posts) {
    const post = {
      id: p.id,
      title: { rendered: p.title || '' },
      content: { rendered: p.content || '' },
      excerpt: { rendered: p.excerpt || '' },
      slug: p.slug || '',
      date: p.date || '',
      author: p.author_id,
      featured_media: thumbMap[p.id] ? 1 : 0,
      _embedded: {
        author: [],
        'wp:term': [[], []],
        'wp:featuredmedia': [],
      },
    };

    // Author
    const author = userMap[p.author_id];
    if (author) {
      post._embedded.author.push({
        id: author.ID,
        name: author.display_name,
        slug: author.user_nicename || '',
      });
    }

    // Categories and tags
    for (const rel of trData) {
      if (rel.object_id === p.id) {
        const term = { id: rel.term_id, name: rel.term_name, slug: rel.term_slug };
        const idx = rel.taxonomy === 'category' ? 0 : 1;
        if (!post._embedded['wp:term'][idx].some((t) => t.slug === rel.term_slug)) {
          post._embedded['wp:term'][idx].push(term);
        }
      }
    }

    // Featured media
    if (thumbMap[p.id]) {
      post._embedded['wp:featuredmedia'].push({ source_url: thumbMap[p.id] });
    }

    result.push(post);
  }

  console.log(`Built ${result.length} posts`);

  // Save to both locations
  const publicPath = path.resolve(__dirname, '../frontend/public/_generated/wp-content.json');
  const localPath = path.resolve(__dirname, '../frontend/data/wp-content.json');
  fs.writeFileSync(publicPath, JSON.stringify(result, null, 2));
  fs.writeFileSync(localPath, JSON.stringify(result, null, 2));
  console.log(`Saved ${publicPath} and ${localPath}`);

  return result;
}

generateSnapshot().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
