# Remote Task Offload Scripts

These PowerShell scripts offload heavy Node.js tasks (build, dev, lint, typecheck) to a remote 32GB Windows machine via SSH.

## Prerequisites

### 1. Configure SSH Config Alias

Add the following to your local `~/.ssh/config` (or `C:\Users\<YourUser>\.ssh\config` on Windows):

```ssh
Host remote-build
    HostName <REMOTE_IP_OR_HOSTNAME>
    User <REMOTE_USERNAME>
    # Optional: specify SSH key if not using default
    # IdentityFile ~/.ssh/id_ed25519
    # Optional: keep connection alive
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

Replace `<REMOTE_IP_OR_HOSTNAME>` and `<REMOTE_USERNAME>` with your remote machine's details.

Using an SSH config alias handles dynamic IPs — just update the `HostName` in the config when the IP changes.

### 2. Remote Machine Setup

On the 32GB remote machine:

1. Clone the repo at the **same path**:
   ```powershell
   git clone <REPO_URL> C:\Users\Oel\sites\ahonga-komlavi
   ```

2. Install dependencies:
   ```powershell
   # Either run locally:
   .\scripts\remote-install.ps1
   # Or on the remote machine directly:
   cd C:\Users\Oel\sites\ahonga-komlavi\frontend && npm install
   ```

3. Ensure Node.js version matches local (check with `node --version` on both machines).

## Available Scripts

| Script | Purpose | Port Forwarding |
|--------|---------|-----------------|
| `remote-build.ps1` | Production build (`npm run build`) | No |
| `remote-dev.ps1` | Dev server (`npm run dev`) | Yes: localhost:3000 → remote:3000 |
| `remote-lint.ps1` | Linting (`npm run lint`) | No |
| `remote-typecheck.ps1` | Type checking (`npx tsc --noEmit`) | No |
| `remote-install.ps1` | Install deps (`npm install`) | No |

## Usage

```powershell
# Production build
.\scripts\remote-build.ps1

# Dev server (opens http://localhost:3000 locally)
.\scripts\remote-dev.ps1

# Linting
.\scripts\remote-lint.ps1

# Type checking
.\scripts\remote-typecheck.ps1

# Initial dependency install (run once after clone)
.\scripts\remote-install.ps1
```

## Workflow

1. **Edit locally** in VS Code
2. **Run heavy tasks remotely** via these scripts
3. **For `remote-dev.ps1`**: browse `http://localhost:3000` (forwarded through SSH tunnel)
4. **Sync code**: Commit and push locally; pull on remote before running remote tasks

## Troubleshooting

- **"ssh: connect to host ... port 22: Connection timed out"**: Check remote IP, firewall, and SSH service
- **"npm: command not found"**: Ensure Node.js is in PATH on remote machine
- **Port 3000 already in use**: Stop any local dev server, or change `$localPort` in `remote-dev.ps1`
- **Path mismatch**: Ensure remote repo is cloned at `C:\Users\Oel\sites\ahonga-komlavi`

## Security Notes

- Use SSH keys (not passwords) for authentication
- The `.gitignore` excludes `.env*.local` — ensure remote machine has its own `.env.local` with required credentials
- Never commit secrets to the repo