import * as path from 'path';
import * as os from 'os';
import * as vscode from 'vscode';
import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    Executable,
    TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: vscode.ExtensionContext) {
    const serverExecutable = getServerExecutable(context);
    
    if (!serverExecutable) {
        const errorMsg = 'Failed to determine the appropriate LSP server executable for this platform';
        vscode.window.showErrorMessage(errorMsg);
        throw new Error(errorMsg);
    }

    const serverOptions: ServerOptions = {
        run: { 
            command: serverExecutable,
            transport: TransportKind.stdio
        },
        debug: {
            command: serverExecutable,
            transport: TransportKind.stdio
        }
    };

    const clientOptions: LanguageClientOptions = {
        documentSelector: [
            { scheme: 'file', language: 'pattern' },
            { scheme: 'file', language: 'csharp' }
        ],
        synchronize: {
            fileEvents: vscode.workspace.createFileSystemWatcher('**/*.{pattern,cs}')
        }
    };

    try {
        client = new LanguageClient(
            'patternLanguageServer',
            'Pattern Language Server (C# LSP)',
            serverOptions,
            clientOptions
        );

        client.start().catch((error) => {
            const errorMsg = `Failed to start Pattern Language Server: ${error.message}`;
            vscode.window.showErrorMessage(errorMsg);
            console.error(errorMsg, error);
        });

        context.subscriptions.push({
            dispose: () => {
                if (client) {
                    client.stop();
                }
            }
        });
    } catch (error) {
        const errorMsg = `Error initializing Pattern Language Server: ${error instanceof Error ? error.message : String(error)}`;
        vscode.window.showErrorMessage(errorMsg);
        console.error(errorMsg, error);
        throw error;
    }
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
}

function getServerExecutable(context: vscode.ExtensionContext): string | null {
    const platform = os.platform();
    
    let serverBinary: string;
    
    switch (platform) {
        case 'win32':
            serverBinary = 'lsp-csharp.exe';
            break;
        case 'darwin':
            serverBinary = 'lsp-csharp';
            break;
        case 'linux':
            serverBinary = 'lsp-csharp';
            break;
        default:
            console.error(`Unsupported platform: ${platform}`);
            return null;
    }
    
    return context.asAbsolutePath(path.join('server', serverBinary));
}