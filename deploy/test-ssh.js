const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH connected!');
  conn.exec('echo hello', (err, stream) => {
    if (err) { console.error('exec error:', err); conn.end(); return; }
    let data = '';
    stream.on('data', (d) => data += d.toString());
    stream.on('end', () => {
      console.log('Output:', data.trim());
      conn.end();
    });
  });
}).on('error', (err) => {
  console.error('SSH connection error:', err.message);
}).connect({
  host: 'gator3223.hostgator.com',
  port: 22,
  username: 'zank',
  password: process.env.HG_PASS || 'test',
});
