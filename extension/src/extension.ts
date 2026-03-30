import * as path from 'path';
import * as os from 'os';
import { workspace, ExtensionContext, window } from 'vscode';
import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
    const serverExecutable = getServerExecutable(context);
    
    if (!serverExecutable) {
        const errorMsg = 'Failed to determine the appropriate LSP server executable for this platform';
        window.showErrorMessage(errorMsg);
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
        documentSelector: [{ scheme: 'file', language: 'csharp' }],
        synchronize: {
            fileEvents: workspace.createFileSystemWatcher('**/*.cs')
        }
    };

    try {
        client = new LanguageClient(
            'csharpLanguageServer',
            'C# Language Server',
            serverOptions,
            clientOptions
        );

        client.start().catch((error) => {
            const errorMsg = `Failed to start C# Language Server: ${error.message}`;
            window.showErrorMessage(errorMsg);
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
        const errorMsg = `Error initializing C# Language Server: ${error instanceof Error ? error.message : String(error)}`;
        window.showErrorMessage(errorMsg);
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

function getServerExecutable(context: ExtensionContext): string | null {
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
