const { Client } = require('ssh2');
const fs = require('fs');

const HOST = 'gator3223.hostgator.com';
const USER = 'zank';
const PASS = process.env.HG_PASS || 'g-s}n&4SOuT54^J.K&XGbV5wgy(YWKQ=';
const DB_USER = 'zank_ahonga';
const DB_NAME = 'zank_ahonga';
const DB_PASS = 'csdFVM5sAIonVoO8UCwE5J4o';
const TABLE_PREFIX = 'eak_';

async function runMySQL(sql, label) {
  const conn = new Client();
  return new Promise((resolve, reject) => {
    conn.on('ready', () => {
      // Write SQL to a temp file to avoid quoting issues
      conn.exec(`cat > /tmp/sqltmp.sql << 'SQLEOF'\n${sql}\nSQLEOF\nmysql -u ${DB_USER} -p'${DB_PASS}' ${DB_NAME} < /tmp/sqltmp.sql`, (err, stream) => {
        if (err) return reject(err);
        let data = '';
        let errData = '';
        stream.on('data', (d) => data += d.toString());
        stream.stderr.on('data', (d) => errData += d.toString());
        stream.on('end', () => {
          conn.end();
          if (errData && !data) {
            console.error(`[${label}] STDERR:`, errData.substring(0, 500));
          }
          try {
            resolve(JSON.parse(data));
          } catch {
            console.log(`[${label}] Raw output (first 300):`, data.substring(0, 300));
            resolve(null);
          }
        });
      });
    }).connect({ host: HOST, port: 22, username: USER, password: PASS });
  });
}

async function main() {
  // Check columns in eak_posts
  const cols = await runMySQL(
    `SHOW COLUMNS FROM ${TABLE_PREFIX}posts WHERE Field IN ('ID','post_title','post_content','post_excerpt','post_name','post_date','post_author','post_type','post_parent','guid','post_mime_type')`,
    'posts-columns'
  );
  console.log('Posts columns:', JSON.stringify(cols, null, 2));

  // Check post types and counts
  const types = await runMySQL(
    `SELECT post_type, COUNT(*) as cnt FROM ${TABLE_PREFIX}posts WHERE post_status='publish' GROUP BY post_type`,
    'post-types'
  );
  console.log('Post types:', JSON.stringify(types, null, 2));

  // Check for featured media meta
  const thumb = await runMySQL(
    `SELECT meta_id, post_id, meta_key, meta_value FROM ${TABLE_PREFIX}postmeta WHERE meta_key='_thumbnail_id' LIMIT 5`,
    'thumbnails'
  );
  console.log('Thumbnails:', JSON.stringify(thumb, null, 2));

  // Check term taxonomy types
  const tax = await runMySQL(
    `SELECT taxonomy, COUNT(*) as cnt FROM ${TABLE_PREFIX}term_taxonomy GROUP BY taxonomy`,
    'taxonomies'
  );
  console.log('Taxonomies:', JSON.stringify(tax, null, 2));
}

main().catch((err) => { console.error('Failed:', err); process.exit(1); });
