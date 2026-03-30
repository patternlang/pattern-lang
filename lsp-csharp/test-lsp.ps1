# Test script for LSP server over stdio
# Reads JSON-RPC messages from files and pipes them to the server

Write-Host "Building LSP server..." -ForegroundColor Cyan
dotnet build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`nStarting LSP server tests..." -ForegroundColor Cyan
Write-Host "=" * 60

# Test 1: Initialize
Write-Host "`nTest 1: Initialize request" -ForegroundColor Yellow
$initMsg = Get-Content "test-initialize.json" -Raw
Write-Host "Sending: $initMsg" -ForegroundColor Gray
$initMsg | dotnet run --no-build
Write-Host ""

# Test 2: DidOpen notification
Write-Host "Test 2: textDocument/didOpen notification" -ForegroundColor Yellow
$didOpenMsg = Get-Content "test-didopen.json" -Raw
Write-Host "Sending: $didOpenMsg" -ForegroundColor Gray
$didOpenMsg | dotnet run --no-build
Write-Host ""

# Test 3: Multiple messages in sequence
Write-Host "Test 3: Multiple messages in sequence" -ForegroundColor Yellow
$messages = @(
    (Get-Content "test-initialize.json" -Raw),
    (Get-Content "test-didopen.json" -Raw),
    (Get-Content "test-shutdown.json" -Raw)
)

$messages | ForEach-Object {
    Write-Host "Sending: $_" -ForegroundColor Gray
    $_ | dotnet run --no-build
    Start-Sleep -Milliseconds 100
}

Write-Host "`n" + ("=" * 60)
Write-Host "Tests completed!" -ForegroundColor Green
