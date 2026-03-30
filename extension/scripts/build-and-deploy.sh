#!/usr/bin/env bash
# Build and Deploy Script for Pattern Language VSCode Extension (Linux/Mac)
# This script automates the complete build and local deployment process

set -e

# Default runtime identifier
RUNTIME_ID="${1:-linux-x64}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

function info() {
    echo -e "${CYAN}INFO: $1${NC}"
}

function success() {
    echo -e "${GREEN}SUCCESS: $1${NC}"
}

function error() {
    echo -e "${RED}ERROR: $1${NC}"
}

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXTENSION_DIR="$(dirname "$SCRIPT_DIR")"
ROOT_DIR="$(dirname "$EXTENSION_DIR")"
LSP_DIR="$ROOT_DIR/lsp-csharp"

# Validate runtime ID
case "$RUNTIME_ID" in
    linux-x64|osx-x64|osx-arm64)
        ;;
    *)
        error "Invalid runtime ID: $RUNTIME_ID"
        echo "Usage: $0 [linux-x64|osx-x64|osx-arm64]"
        echo "Default: linux-x64"
        exit 1
        ;;
esac

info "Starting build and deployment process..."
info "Runtime ID: $RUNTIME_ID"
info "Extension Directory: $EXTENSION_DIR"
info "LSP Directory: $LSP_DIR"

# Step 1: Build and publish LSP server
info "Step 1: Building and publishing LSP server..."
cd "$LSP_DIR"
dotnet publish -c Release -r "$RUNTIME_ID" --self-contained true
success "LSP server published successfully"

# Step 2: Compile TypeScript extension
info "Step 2: Compiling TypeScript extension..."
cd "$EXTENSION_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    info "Installing npm dependencies..."
    npm install
fi

info "Compiling TypeScript..."
npm run compile
success "TypeScript compiled successfully"

# Step 3: Package extension
info "Step 3: Packaging VSCode extension..."
cd "$EXTENSION_DIR"

# Remove old .vsix files
rm -f *.vsix
info "Removed old .vsix files"

npm run package:vsix
success "Extension packaged successfully"

# Step 4: Install extension in VSCode
info "Step 4: Installing extension in VSCode..."
cd "$EXTENSION_DIR"

VSIX_FILE=$(ls -t *.vsix 2>/dev/null | head -n 1)
if [ -z "$VSIX_FILE" ]; then
    error "No .vsix file found"
    exit 1
fi

info "Installing $VSIX_FILE..."
code --install-extension "$VSIX_FILE" --force
success "Extension installed successfully"

success "Build and deployment completed successfully!"
info "Please reload VSCode to activate the updated extension."
