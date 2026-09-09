<#>
.SYNOPSIS
    Runs ESLint on the remote 32GB machine via SSH.

.DESCRIPTION
    Uses the SSH config alias 'remote-build' (configure in ~/.ssh/config) to connect
    to the remote machine and execute 'npm run lint' in the frontend directory.

.PREREQUISITES
    - SSH config alias 'remote-build' defined in ~/.ssh/config
    - Remote machine has the repo cloned at the same path: C:\Users\Oel\sites\ahonga-komlavi
    - Remote machine has Node.js and dependencies installed (npm install already run)

.EXAMPLE
    .\scripts\remote-lint.ps1
#>
param()

$sshAlias = "remote-build"
$remotePath = "C:\Users\Oel\sites\ahonga-komlavi\frontend"
$command = "npm run lint"

Write-Host "Running remote lint on '$sshAlias'..." -ForegroundColor Cyan
Write-Host "Executing: cd $remotePath && $command" -ForegroundColor Gray

ssh $sshAlias "cd `$remotePath && $command"

$exitCode = $LASTEXITCODE
if ($exitCode -eq 0) {
    Write-Host "Remote lint passed." -ForegroundColor Green
} else {
    Write-Host "Remote lint failed with exit code $exitCode." -ForegroundColor Red
}
exit $exitCode