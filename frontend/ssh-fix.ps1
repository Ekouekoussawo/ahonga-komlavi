// Try SSH to check wp-config.php content and fix directly
// Use PowerShell SSH
const ps = `
\$password = 'g-s}n&4SOuT54^J.K&XGbV5wgy(YWKQ='
\$secpass = ConvertTo-SecureString \$password -AsPlainText -Force
\$cred = New-Object System.Management.Automation.PSCredential('zank@gator3223.hostgator.com', \$secpass)
\$session = New-SSHSession -ComputerName gator3223.hostgator.com -Port 22 -Credential \$cred -AcceptKey -ErrorAction Stop

# Check wp-config.php
\$config = cat /home4/zank/evangelisteahongankomlavi.com/wp/wp-config.php | Select-String "table_prefix"
Write-Output "table_prefix line:"
Write-Output \$config

# Fix it
\$configPath = '/home4/zank/evangelisteahongankomlavi.com/wp/wp-config.php'
\$content = Get-Content \$configPath -Raw
\$newContent = \$content -replace "'wp_'", "'eak_'"
Set-Content \$configPath \$newContent -NoNewline
Write-Output "Fixed. New prefix line:"
(Get-Content \$configPath | Select-String "table_prefix")

Remove-SSHSession -Session \$session
`;

console.log(ps);
