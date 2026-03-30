const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..', '..', 'lsp-csharp', 'bin', 'Debug', 'net6.0');
const targetDir = path.join(__dirname, '..', 'out', 'lsp');

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    
    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach(childItemName => {
            copyRecursiveSync(
                path.join(src, childItemName),
                path.join(dest, childItemName)
            );
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

console.log('Copying LSP binaries...');
console.log(`  From: ${sourceDir}`);
console.log(`  To:   ${targetDir}`);

if (!fs.existsSync(sourceDir)) {
    console.error(`Error: LSP binaries not found at ${sourceDir}`);
    console.error('Please build the C# LSP project first by running:');
    console.error('  dotnet build lsp-csharp/lsp-csharp.csproj');
    process.exit(1);
}

copyRecursiveSync(sourceDir, targetDir);
console.log('LSP binaries copied successfully!');
