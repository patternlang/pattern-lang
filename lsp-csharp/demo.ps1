#!/usr/bin/env pwsh
# Demo script showing LSP server in action

Write-Host @"
========================================
LSP C# Server Demo
========================================

This demo shows the LSP server processing
JSON-RPC messages over stdio.

"@ -ForegroundColor Cyan

# Build first
Write-Host "Building..." -ForegroundColor Yellow
dotnet build --nologo -v quiet

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Build successful!`n" -ForegroundColor Green

# Demo messages
Write-Host "Sending LSP messages to server...`n" -ForegroundColor Cyan

Write-Host "1. Initialize Request" -ForegroundColor Yellow
Write-Host "   → Server returns capabilities" -ForegroundColor Gray
$init = Get-Content "test-initialize.json" -Raw
Write-Host "   Message: " -NoNewline -ForegroundColor DarkGray
Write-Host $init.Substring(0, [Math]::Min(60, $init.Length)) -NoNewline -ForegroundColor DarkGray
Write-Host "..." -ForegroundColor DarkGray
Write-Host "   Response:" -ForegroundColor DarkGray
$init | dotnet run --no-build | ForEach-Object { Write-Host "   $_" -ForegroundColor White }
Write-Host ""

Write-Host "2. Document Open Notification" -ForegroundColor Yellow
Write-Host "   → Server acknowledges document open" -ForegroundColor Gray
$didOpen = Get-Content "test-didopen.json" -Raw
Write-Host "   Message: " -NoNewline -ForegroundColor DarkGray
Write-Host $didOpen.Substring(0, [Math]::Min(60, $didOpen.Length)) -NoNewline -ForegroundColor DarkGray
Write-Host "..." -ForegroundColor DarkGray
Write-Host "   Response:" -ForegroundColor DarkGray
$didOpen | dotnet run --no-build | ForEach-Object { Write-Host "   $_" -ForegroundColor White }
Write-Host ""

Write-Host "3. Unknown Method Test" -ForegroundColor Yellow
Write-Host "   → Server reports unknown method" -ForegroundColor Gray
$unknown = '{"jsonrpc":"2.0","method":"test/unknown","params":{}}'
Write-Host "   Message: $unknown" -ForegroundColor DarkGray
Write-Host "   Response:" -ForegroundColor DarkGray
$unknown | dotnet run --no-build | ForEach-Object { Write-Host "   $_" -ForegroundColor White }
Write-Host ""

Write-Host @"
========================================
Demo Complete!

The server is ready to process LSP
messages over stdin/stdout.

To run your own tests:
  .\run-tests.ps1

To start the server interactively:
  dotnet run

"@ -ForegroundColor Green
