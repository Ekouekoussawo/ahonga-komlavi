// Test SSH via PowerShell
const { execSync } = require('child_process');

const password = 'g-s}n&4SOuT54^J.K&XGbV5wgy(YWKQ=';
const host = 'gator3223.hostgator.com';
const user = 'zank';

// Try using sshpass via apt or check what tools are available
try {
  const result = execSync('where ssh 2>$null 2>&1', { encoding: 'utf8', shell: 'powershell' }).trim();
  console.log('SSH location:', result);
} catch(e) {
  console.log('SSH not found:', e.message.substring(0, 100));
}

// Try using Windows OpenSSH
const psCommand = `
$password = '${password}'
$secpass = ConvertTo-SecureString $password -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential("${user}@${host}", $secpass)
try {
    $session = New-SSHSession -ComputerName ${host} -Port 22 -Credential $cred -AcceptKey -ErrorAction Stop
    Write-Output "SSH WORKS via Posh-SSH"
    Remove-SSHSession -Session $session
} catch {
    Write-Output "Posh-SSH failed: $($_.Exception.Message)"
}
`;

console.log('Trying PowerShell SSH...');
try {
  const result = execSync(`powershell -Command "${psCommand}"`, { encoding: 'utf8', timeout: 20000, shell: 'powershell' });
  console.log(result);
} catch(e) {
  console.log('PowerShell SSH failed:', e.message.substring(0, 200));
}
