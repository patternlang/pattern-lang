# LSP Server (C# Implementation)

This directory contains a C# implementation of a Language Server Protocol (LSP) server, transpiled from the Pattern language source in `lsp/server.pattern`.

## Files

- **Program.cs** - Main C# implementation of the LSP server
- **lsp-csharp.csproj** - .NET project file
- **test-initialize.json** - Sample LSP initialize request
- **test-didopen.json** - Sample textDocument/didOpen notification
- **test-shutdown.json** - Sample shutdown request
- **test-lsp.ps1** - PowerShell test script
- **test-interactive.ps1** - Interactive test script with all messages

## Building

```powershell
dotnet build
```

## Running

The server reads JSON-RPC messages from stdin and writes responses to stdout:

```powershell
dotnet run
```

## Testing

### Run automated tests:

```powershell
.\test-lsp.ps1
```

### Run interactive test with sample messages:

```powershell
.\test-interactive.ps1
```

### Manual testing:

```powershell
# Send a single message
Get-Content test-initialize.json | dotnet run

# Send multiple messages
Get-Content test-initialize.json, test-didopen.json, test-shutdown.json | dotnet run
```

## Supported LSP Methods

- **initialize** - Initializes the server and returns capabilities
- **shutdown** - Gracefully shuts down the server
- **textDocument/didOpen** - Handles document open notifications

## Architecture

The server implements a simple message dispatch pattern:

1. Reads JSON-RPC messages line-by-line from stdin
2. Parses the message and extracts the method name
3. Dispatches to the appropriate handler based on method name
4. Sends responses back via stdout

## JSON-RPC Message Format

Messages follow the Language Server Protocol JSON-RPC format:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": { ... }
}
```

## Notes

- The server runs in a loop, processing messages until it receives a null input or shutdown request
- All JSON parsing errors are caught and the server continues running
- The `RunExternalProcess` method is included but not currently used by the LSP handlers
