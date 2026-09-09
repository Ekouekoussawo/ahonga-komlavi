<#>
.SYNOPSIS
    Starts the Next.js dev server on the remote 32GB machine with local port forwarding.

.DESCRIPTION
    Uses the SSH config alias 'remote-build' (configure in ~/.ssh/config) to connect
    to the remote machine, forwards local port 3000 to remote port 3000, and runs
    'npm run dev' in the frontend directory.

.PREREQUISITES
    - SSH config alias 'remote-build' defined in ~/.ssh/config
    - Remote machine has the repo cloned at the same path: C:\Users\Oel\sites\ahonga-komlavi
    - Remote machine has Node.js and dependencies installed (npm install already run)
    - Local port 3000 is available

.USAGE
    1. Run this script: .\scripts\remote-dev.ps1
    2. Open http://localhost:3000 in your local browser
    3. Press Ctrl+C to stop the dev server and close the tunnel

.EXAMPLE
    .\scripts\remote-dev.ps1
#>
param()

$sshAlias = "remote-build"
$remotePath = "C:\Users\Oel\sites\ahonga-komlavi\frontend"
$localPort = 3000
$remotePort = 3000
$command = "npm run dev"

Write-Host "Starting remote dev server on '$sshAlias' with port forwarding..." -ForegroundColor Cyan
Write-Host "Local: http://localhost:$localPort  ->  Remote: localhost:$remotePort" -ForegroundColor Gray
Write-Host "Press Ctrl+C to stop" -ForegroundColor Gray
Write-Host ""

ssh -L $localPort:localhost:$remotePort $sshAlias "cd `$remotePath && $command"

$exitCode = $LASTEXITCODE
if ($exitCode -eq 0) {
    Write-Host "Remote dev server stopped." -ForegroundColor Green
} else {
    Write-Host "Remote dev server exited with code $exitCode." -ForegroundColor Red
}
exit $exitCode