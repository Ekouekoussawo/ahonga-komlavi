const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const HOST = 'gator3223.hostgator.com';
const USER = 'zank';
const PASS = process.env.HG_PASS || 'g-s}n&4SOuT54^J.K&XGbV5wgy(YWKQ=';
const REMOTE_ROOT = '/home4/zank/evangelisteahongankomlavi.com';
const LOCAL_OUT = path.resolve(__dirname, '../frontend/out');

function walk(dir, base = dir) {
  const entries = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(base, full);
    if (entry.isDirectory()) {
      entries.push(...walk(full, base));
    } else {
      entries.push(full);
    }
  }
  return entries;
}

async function deploy() {
  const files = walk(LOCAL_OUT);
  console.log(`Uploading ${files.length} files...`);

  const conn = new Client();
  await new Promise((resolve, reject) => {
    conn.on('ready', resolve).on('error', reject).connect({ host: HOST, port: 22, username: USER, password: PASS });
  });
  console.log('Connected via SSH');

  let uploaded = 0;
  let skipped = 0;
  const sftp = await new Promise((resolve, reject) => {
    conn.sftp((err, sftp) => (err ? reject(err) : resolve(sftp)));
  });

  for (const localFile of files) {
    const relPath = path.relative(LOCAL_OUT, localFile);
    const remotePath = REMOTE_ROOT + '/' + relPath.split(path.sep).join('/');
    const remoteDir = path.dirname(remotePath);

    try {
      await sftp.stat(remotePath);
      const localStat = fs.statSync(localFile);
      const remoteStat = await sftp.stat(remotePath);
      if (localStat.mtime.getTime() <= remoteStat.mtime.getTime()) {
        skipped++;
        continue;
      }
    } catch {
      // file doesn't exist remotely, need to create dirs
    }

    // Ensure remote directory exists
    const dirs = remotePath.split('/').slice(1, -1);
    let current = '';
    for (const dir of dirs) {
      current += '/' + dir;
      try { await sftp.mkdir(current); } catch { /* already exists */ }
    }

    await sftp.fastPut(localFile, remotePath);
    uploaded++;
    console.log(`  ✓ ${relPath}`);
  }

  console.log(`\nDone: ${uploaded} uploaded, ${skipped} skipped`);
  conn.end();
}

deploy().catch((err) => {
  console.error('Deploy failed:', err.message);
  process.exit(1);
});
