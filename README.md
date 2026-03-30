# Pattern Programming Language

Object Oriented, meet Functional.  Functional, meet Object Oriented!

## VSCode Extension - Local Deployment

The Pattern Language VSCode extension can be built and deployed locally using automated scripts.

### Prerequisites

- .NET 8.0 SDK
- Node.js and npm
- VSCode CLI (`code` command available in PATH)
- Visual Studio Code Extension Manager (`vsce`) - installed automatically via npm

### Quick Start

#### Windows (PowerShell)

```powershell
# Build and deploy for Windows (default)
.\extension\scripts\build-and-deploy.ps1

# Build for a specific platform
.\extension\scripts\build-and-deploy.ps1 -RuntimeId win-x64
.\extension\scripts\build-and-deploy.ps1 -RuntimeId linux-x64
.\extension\scripts\build-and-deploy.ps1 -RuntimeId osx-arm64
```

#### Linux/Mac (Bash)

```bash
# Make script executable (first time only)
chmod +x extension/scripts/build-and-deploy.sh

# Build and deploy for Linux (default)
./extension/scripts/build-and-deploy.sh

# Build for a specific platform
./extension/scripts/build-and-deploy.sh linux-x64
./extension/scripts/build-and-deploy.sh osx-x64
./extension/scripts/build-and-deploy.sh osx-arm64
```

### What the Scripts Do

The deployment scripts automate the following steps:

1. **Build LSP Server**: Runs `dotnet publish` for the `lsp-csharp` project with the specified runtime identifier (RID), creating a self-contained, single-file executable
2. **Compile TypeScript**: Compiles the TypeScript extension code to JavaScript
3. **Package Extension**: Creates a `.vsix` package file using `vsce package`
4. **Install Extension**: Installs the packaged extension into VSCode using `code --install-extension --force`

### After Installation

After running the deployment script:

1. Reload VSCode (or close and reopen) to activate the updated extension
2. Open a C# file to verify the extension is working
3. Check the Output panel (View → Output → Pattern Language Support) for LSP server logs

### Manual Deployment Steps

If you prefer to run the steps manually:

```bash
# 1. Publish LSP server
cd lsp-csharp
dotnet publish -c Release -r win-x64 --self-contained true

# 2. Compile TypeScript
cd ../extension
npm install
npm run compile

# 3. Package extension
npm run package:vsix

# 4. Install extension
code --install-extension pattern-lang-vscode-*.vsix --force
```

### Supported Runtime Identifiers

- `win-x64` - Windows 64-bit
- `linux-x64` - Linux 64-bit
- `osx-x64` - macOS Intel
- `osx-arm64` - macOS Apple Silicon
