# Interactive test for LSP server
# Pipes test messages one at a time to observe output

Write-Host "Building LSP server..." -ForegroundColor Cyan
dotnet build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`nTesting LSP server with sample messages..." -ForegroundColor Cyan
Write-Host "Note: The server reads from stdin line by line." -ForegroundColor Gray
Write-Host ""

# Create a temp file with all test messages
$testMessages = @"
$(Get-Content "test-initialize.json" -Raw)
$(Get-Content "test-didopen.json" -Raw)
$(Get-Content "test-shutdown.json" -Raw)
"@

# Write messages to temp file
$tempFile = [System.IO.Path]::GetTempFileName()
$testMessages | Out-File -FilePath $tempFile -Encoding utf8

Write-Host "Piping test messages to server..." -ForegroundColor Yellow
Write-Host "Input messages:" -ForegroundColor Cyan
Get-Content $tempFile | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
Write-Host ""
Write-Host "Server output:" -ForegroundColor Cyan

# Pipe the messages to the server
Get-Content $tempFile | dotnet run --no-build

# Cleanup
Remove-Item $tempFile

Write-Host "`nTest completed!" -ForegroundColor Green
