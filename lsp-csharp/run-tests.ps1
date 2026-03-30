#!/usr/bin/env pwsh
# Comprehensive test runner for LSP C# server

param(
    [switch]$Build = $true,
    [switch]$Verbose = $false
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "LSP C# Server Test Suite" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $scriptDir

try {
    # Build if requested
    if ($Build) {
        Write-Host "[1/3] Building project..." -ForegroundColor Yellow
        dotnet build --nologo
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Build failed!" -ForegroundColor Red
            exit 1
        }
        Write-Host "Build successful!" -ForegroundColor Green
        Write-Host ""
    }
    
    # Verify test message files exist
    Write-Host "[2/3] Verifying test files..." -ForegroundColor Yellow
    $testFiles = @("test-initialize.json", "test-didopen.json", "test-shutdown.json")
    foreach ($file in $testFiles) {
        if (-not (Test-Path $file)) {
            Write-Host "Missing test file: $file" -ForegroundColor Red
            exit 1
        }
        Write-Host "  Found: $file" -ForegroundColor Gray
    }
    Write-Host "All test files present!" -ForegroundColor Green
    Write-Host ""
    
    # Run tests
    Write-Host "[3/3] Running LSP tests..." -ForegroundColor Yellow
    Write-Host ""
    
    # Test 1: Initialize
    Write-Host "Test 1: Initialize Request" -ForegroundColor Cyan
    Write-Host "----------------------------------------" -ForegroundColor DarkGray
    $initMsg = Get-Content "test-initialize.json" -Raw
    if ($Verbose) {
        Write-Host "Input: $initMsg" -ForegroundColor DarkGray
    }
    
    $output1 = $initMsg | dotnet run --no-build 2>&1
    Write-Host "Output: $output1" -ForegroundColor White
    
    if ($output1 -match "capabilities") {
        Write-Host "✓ PASSED: Initialize response received" -ForegroundColor Green
    } else {
        Write-Host "✗ FAILED: No initialize response" -ForegroundColor Red
    }
    Write-Host ""
    
    # Test 2: DidOpen Notification
    Write-Host "Test 2: textDocument/didOpen Notification" -ForegroundColor Cyan
    Write-Host "----------------------------------------" -ForegroundColor DarkGray
    $didOpenMsg = Get-Content "test-didopen.json" -Raw
    if ($Verbose) {
        Write-Host "Input: $didOpenMsg" -ForegroundColor DarkGray
    }
    
    $output2 = $didOpenMsg | dotnet run --no-build 2>&1
    Write-Host "Output: $output2" -ForegroundColor White
    
    if ($output2 -match "Document opened") {
        Write-Host "✓ PASSED: DidOpen handled" -ForegroundColor Green
    } else {
        Write-Host "✗ FAILED: DidOpen not handled" -ForegroundColor Red
    }
    Write-Host ""
    
    # Test 3: Unknown Method
    Write-Host "Test 3: Unknown Method Handling" -ForegroundColor Cyan
    Write-Host "----------------------------------------" -ForegroundColor DarkGray
    $unknownMsg = '{"jsonrpc":"2.0","method":"unknown/method","params":{}}'
    if ($Verbose) {
        Write-Host "Input: $unknownMsg" -ForegroundColor DarkGray
    }
    
    $output3 = $unknownMsg | dotnet run --no-build 2>&1
    Write-Host "Output: $output3" -ForegroundColor White
    
    if ($output3 -match "Unknown method") {
        Write-Host "✓ PASSED: Unknown method detected" -ForegroundColor Green
    } else {
        Write-Host "✗ FAILED: Unknown method not detected" -ForegroundColor Red
    }
    Write-Host ""
    
    # Test 4: Message Sequence
    Write-Host "Test 4: Message Sequence (init -> didOpen -> shutdown)" -ForegroundColor Cyan
    Write-Host "----------------------------------------" -ForegroundColor DarkGray
    
    $messages = @(
        (Get-Content "test-initialize.json" -Raw),
        (Get-Content "test-didopen.json" -Raw),
        (Get-Content "test-shutdown.json" -Raw)
    )
    
    if ($Verbose) {
        Write-Host "Input: Multiple messages in sequence" -ForegroundColor DarkGray
    }
    
    $output4 = ($messages -join "`n") | dotnet run --no-build 2>&1
    Write-Host "Output: $output4" -ForegroundColor White
    
    $hasInit = $output4 -match "capabilities"
    $hasDidOpen = $output4 -match "Document opened"
    
    if ($hasInit -and $hasDidOpen) {
        Write-Host "✓ PASSED: Message sequence handled correctly" -ForegroundColor Green
    } else {
        Write-Host "✗ FAILED: Message sequence not handled correctly" -ForegroundColor Red
        Write-Host "  Init response: $hasInit" -ForegroundColor Gray
        Write-Host "  DidOpen response: $hasDidOpen" -ForegroundColor Gray
    }
    Write-Host ""
    
    # Summary
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Test Suite Complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    
} finally {
    Pop-Location
}
