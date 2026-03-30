#!/usr/bin/env pwsh
# Build and Deploy Script for Pattern Language VSCode Extension (Windows/PowerShell)
# This script automates the complete build and local deployment process

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("win-x64", "linux-x64", "osx-x64", "osx-arm64")]
    [string]$RuntimeId = "win-x64"
)

$ErrorActionPreference = "Stop"

# Colors for output
function Write-Info { Write-Host "INFO: $args" -ForegroundColor Cyan }
function Write-Success { Write-Host "SUCCESS: $args" -ForegroundColor Green }
function Write-Error { Write-Host "ERROR: $args" -ForegroundColor Red }

# Get script directory and project root
$ScriptDir = Split-Path -Parent $PSCommandPath
$ExtensionDir = Split-Path -Parent $ScriptDir
$RootDir = Split-Path -Parent $ExtensionDir
$LspDir = Join-Path $RootDir "lsp-csharp"

Write-Info "Starting build and deployment process..."
Write-Info "Runtime ID: $RuntimeId"
Write-Info "Extension Directory: $ExtensionDir"
Write-Info "LSP Directory: $LspDir"

# Step 1: Build and publish LSP server
Write-Info "Step 1: Building and publishing LSP server..."
Push-Location $LspDir
try {
    & dotnet publish -c Release -r $RuntimeId --self-contained true
    if ($LASTEXITCODE -ne 0) {
        throw "dotnet publish failed with exit code $LASTEXITCODE"
    }
    Write-Success "LSP server published successfully"
} finally {
    Pop-Location
}

# Step 2: Compile TypeScript extension
Write-Info "Step 2: Compiling TypeScript extension..."
Push-Location $ExtensionDir
try {
    # Check if node_modules exists
    if (-not (Test-Path "node_modules")) {
        Write-Info "Installing npm dependencies..."
        & npm install
        if ($LASTEXITCODE -ne 0) {
            throw "npm install failed with exit code $LASTEXITCODE"
        }
    }
    
    Write-Info "Compiling TypeScript..."
    & npm run compile
    if ($LASTEXITCODE -ne 0) {
        throw "TypeScript compilation failed with exit code $LASTEXITCODE"
    }
    Write-Success "TypeScript compiled successfully"
} finally {
    Pop-Location
}

# Step 3: Package extension
Write-Info "Step 3: Packaging VSCode extension..."
Push-Location $ExtensionDir
try {
    # Remove old .vsix files
    Get-ChildItem -Path . -Filter "*.vsix" | Remove-Item -Force
    Write-Info "Removed old .vsix files"
    
    & npm run package:vsix
    if ($LASTEXITCODE -ne 0) {
        throw "vsce package failed with exit code $LASTEXITCODE"
    }
    Write-Success "Extension packaged successfully"
} finally {
    Pop-Location
}

# Step 4: Install extension in VSCode
Write-Info "Step 4: Installing extension in VSCode..."
Push-Location $ExtensionDir
try {
    $VsixFile = Get-ChildItem -Path . -Filter "*.vsix" | Select-Object -First 1
    if (-not $VsixFile) {
        throw "No .vsix file found"
    }
    
    Write-Info "Installing $($VsixFile.Name)..."
    & code --install-extension $VsixFile.FullName --force
    if ($LASTEXITCODE -ne 0) {
        throw "Extension installation failed with exit code $LASTEXITCODE"
    }
    Write-Success "Extension installed successfully"
} finally {
    Pop-Location
}

Write-Success "Build and deployment completed successfully!"
Write-Info "Please reload VSCode to activate the updated extension."
