const { execSync } = require('child_process');

const ssh = 'ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -p 22 zank@gator3223.hostgator.com';
const password = 'g-s}n&4SOuT54^J.K&XGbV5wgy(YWKQ=';

// Use sshpass or expect-like approach
// Try with sshpass first
try {
  const result = execSync(`which sshpass 2>/dev/null`, { encoding: 'utf8' }).trim();
  console.log('sshpass found:', result);
} catch {
  console.log('sshpass NOT found');
}

// Try direct SSH with password using sshpass
try {
  const cmd = `echo '${password}' | ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -p 22 zank@gator3223.hostgator.com 'echo "SSH WORKS" && php -v 2>&1 | head -3'`;
  console.log('Attempting SSH...');
  const result = execSync(cmd, { encoding: 'utf8', timeout: 15000, shell: 'bash' });
  console.log(result);
} catch(e) {
  console.log('SSH attempt failed:', e.message.substring(0, 200));
}
