# LSP C# Server - Quick Start Guide

## 5-Minute Quick Start

### 1. Build the Server

```powershell
dotnet build
```

### 2. Run the Demo

```powershell
.\demo.ps1
```

This will:
- Build the project
- Send sample LSP messages
- Show server responses

### 3. Run the Test Suite

```powershell
.\run-tests.ps1
```

This will:
- Build the project
- Run 4 comprehensive tests
- Show pass/fail results

## What You Get

A working LSP server that:
- ✓ Accepts JSON-RPC messages over stdin
- ✓ Dispatches to appropriate handlers
- ✓ Sends responses over stdout
- ✓ Handles initialize, shutdown, and didOpen

## Example Usage

### Send a Single Message

```powershell
Get-Content test-initialize.json | dotnet run
```

### Send Multiple Messages

```powershell
Get-Content test-initialize.json, test-didopen.json, test-shutdown.json | dotnet run
```

### Interactive Mode

```powershell
dotnet run
# Then type or paste JSON-RPC messages
# Press Ctrl+C to exit
```

## Test Messages

### Initialize Request
```json
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"processId":null,"clientInfo":{"name":"test-client"},"capabilities":{}}}
```

### Document Open Notification
```json
{"jsonrpc":"2.0","method":"textDocument/didOpen","params":{"textDocument":{"uri":"file:///test.txt","languageId":"plaintext","version":1,"text":"Hello"}}}
```

### Shutdown Request
```json
{"jsonrpc":"2.0","id":2,"method":"shutdown","params":null}
```

## Next Steps

- Read **README.md** for detailed usage
- See **TRANSPILATION.md** for how Pattern → C# works
- Check **IMPLEMENTATION.md** for architecture details

## Troubleshooting

**Build fails?**
- Ensure .NET 6.0 SDK or later is installed
- Run `dotnet --version` to check

**Tests fail?**
- Make sure you're in the `lsp-csharp` directory
- Check that test JSON files exist
- Try running `.\demo.ps1` first

**Nothing happens when running?**
- The server waits for input on stdin
- Pipe a test message: `Get-Content test-initialize.json | dotnet run`
- Or run the demo: `.\demo.ps1`

## Files Overview

| File | Purpose |
|------|---------|
| `Program.cs` | Main server implementation |
| `demo.ps1` | Quick interactive demo |
| `run-tests.ps1` | Comprehensive test suite |
| `test-*.json` | Sample LSP messages |

That's it! You're ready to use the LSP server.
