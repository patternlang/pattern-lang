# Pattern Language Support for VSCode

This extension provides language support for the Pattern programming language with LSP (Language Server Protocol) integration.

## Building the Extension

### Prerequisites

- Node.js and npm
- .NET SDK 6.0 or later
- Visual Studio Code

### Build Steps

1. Build the C# LSP server:
   ```bash
   dotnet build ../lsp-csharp/lsp-csharp.csproj
   ```

2. Install extension dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

This will:
- Compile the TypeScript extension code
- Copy the LSP server binaries to the extension output directory

### Creating a Package

To create a `.vsix` package for distribution:

```bash
npm run package
```

This will generate a `pattern-language-support-<version>.vsix` file.

### Installing the Extension Locally

To install the extension for local development:

```bash
code --install-extension pattern-language-support-<version>.vsix
```

Or install it directly from the extension directory:

```bash
code --install-extension .
```

### Development

To watch for changes during development:

```bash
npm run watch
```

Then press F5 in VSCode to launch the Extension Development Host.

## Features

- Syntax highlighting for `.pattern` files
- LSP integration for advanced language features
