# Pattern to C# Transpilation

This document describes the transpilation of `lsp/server.pattern` to C# in `lsp-csharp/Program.cs`.

## Source Pattern Code

The original Pattern language code in `lsp/server.pattern` defines an LSP server with the following structure:

- **Application Scope**: LSP
- **Needs Statements**: Import System libraries for Console, Process, Dictionary, and JSON
- **Application Definition**: LanguageServer class
  - Mutable fields for handlers dictionary and running state
  - Start block (entry point)
  - Methods for initializing handlers, processing messages, and handling LSP requests

## Transpilation Approach

Due to syntax differences between the current Pattern grammar implementation and the source file (specifically the `|>` lambda operator vs `=>` in the parser), the transpilation was performed manually following these principles:

### 1. Application Scope → Namespace
```pattern
Application Scope LSP
```
Becomes:
```csharp
namespace LSP
```

### 2. Needs Statements → Using Directives
```pattern
Needs Static System:>Console
Needs Static System.Diagnostics:>Process
```
Becomes:
```csharp
using System;
using System.Diagnostics;
```

### 3. Application Definition → Class Definition
```pattern
Application LanguageServer
    ...
End LanguageServer
```
Becomes:
```csharp
public class LanguageServer
{
    ...
}
```

### 4. Mutable Declarations → Field Declarations
```pattern
Mutable _handlers Of Dictionary Of String, Action
Mutable _running Of Boolean = True
```
Becomes:
```csharp
private Dictionary<string, Action<string>> _handlers;
private bool _running = true;
```

### 5. Start Block → Main Method
```pattern
Start
    Parameter args Of Array Of String
    ...
End Start
```
Becomes:
```csharp
public static void Main(string[] args)
{
    var server = new LanguageServer();
    ...
}
```

### 6. Match Statements → If/Switch Statements
```pattern
Match line
    Some |> input => ProcessMessage(input)
    None |> _running = False
End Match
```
Becomes:
```csharp
if (line != null)
{
    server.ProcessMessage(line);
}
else
{
    server._running = false;
}
```

### 7. Method Definitions → Method Declarations
```pattern
Method ProcessMessage
    Parameter message Of String
    ...
End ProcessMessage
```
Becomes:
```csharp
private void ProcessMessage(string message)
{
    ...
}
```

### 8. Type Mappings

| Pattern Type | C# Type |
|--------------|---------|
| `String` | `string` |
| `Boolean` | `bool` |
| `Integer` | `int` |
| `Dictionary Of String, Action` | `Dictionary<string, Action<string>>` |
| `Array Of String` | `string[]` |
| `JsonObject` | `JsonObject` (from System.Text.Json.Nodes) |
| `JsonDocument` | `JsonDocument` (from System.Text.Json) |
| `ProcessStartInfo` | `ProcessStartInfo` (from System.Diagnostics) |

## Key Semantic Conversions

### Match Expression (Option Types)
Pattern's `Some`/`None` pattern matching for null checking:
```pattern
Match value
    Some |> x => HandleValue(x)
    None |> HandleNull()
```
Becomes C#'s explicit null check:
```csharp
if (value != null)
{
    HandleValue(value);
}
else
{
    HandleNull();
}
```

### Object Construction
Pattern's constructor syntax:
```pattern
Const response = JsonObject()
```
Becomes C#'s new expression:
```csharp
var response = new JsonObject();
```

### Method Calls
Pattern uses dot notation for member access, same as C#:
```pattern
doc.RootElement.GetProperty("method").GetString()
```
Remains:
```csharp
doc.RootElement.GetProperty("method").GetString()
```

## Implementation Details

### LSP Message Handling

The server implements a handler dispatch pattern:

1. **Initialize handlers dictionary** - Maps method names to handler functions
2. **Read messages from stdin** - Line-by-line JSON-RPC messages
3. **Parse and dispatch** - Extract method name, invoke corresponding handler
4. **Send responses to stdout** - JSON-RPC responses

### Supported LSP Methods

- `initialize` - Returns server capabilities
- `shutdown` - Sets running flag to false
- `textDocument/didOpen` - Logs document open event

### Error Handling

All JSON parsing is wrapped in try-catch to prevent crashes from malformed messages.

## Testing

The transpiled code includes comprehensive test files:

- **test-initialize.json** - LSP initialize request
- **test-didopen.json** - Document open notification
- **test-shutdown.json** - Shutdown request
- **run-tests.ps1** - Automated test suite
- **demo.ps1** - Interactive demo

## Build and Run

```powershell
# Build
dotnet build

# Run tests
.\run-tests.ps1

# Run demo
.\demo.ps1

# Run interactively
dotnet run
```

## Future Enhancements

To fully automate this transpilation:

1. Update the PEG.js grammar to support the `|>` lambda operator
2. Implement proper lambda parameter binding in match handlers
3. Add support for `Action` delegates with proper type inference
4. Enhance the emitter to handle pattern matching variations

The current manual transpilation serves as a reference implementation for these enhancements.
