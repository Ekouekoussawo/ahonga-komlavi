<#>
.SYNOPSIS
    Installs npm dependencies on the remote 32GB machine via SSH.

.DESCRIPTION
    Uses the SSH config alias 'remote-build' (configure in ~/.ssh/config) to connect
    to the remote machine and execute 'npm install' in the frontend directory.
    Run this once after cloning the repo on the remote machine.

.PREREQUISITES
    - SSH config alias 'remote-build' defined in ~/.ssh/config
    - Remote machine has the repo cloned at the same path: C:\Users\Oel\sites\ahonga-komlavi
    - Remote machine has Node.js and npm installed

.EXAMPLE
    .\scripts\remote-install.ps1
#>
param()

$sshAlias = "remote-build"
$remotePath = "C:\Users\Oel\sites\ahonga-komlavi\frontend"
$command = "npm install"

Write-Host "Installing dependencies on remote machine '$sshAlias'..." -ForegroundColor Cyan
Write-Host "Executing: cd $remotePath && $command" -ForegroundColor Gray

ssh $sshAlias "cd `$remotePath && $command"

$exitCode = $LASTEXITCODE
if ($exitCode -eq 0) {
    Write-Host "Remote npm install completed successfully." -ForegroundColor Green
} else {
    Write-Host "Remote npm install failed with exit code $exitCode." -ForegroundColor Red
}
exit $exitCode