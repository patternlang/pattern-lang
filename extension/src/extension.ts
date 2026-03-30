import * as path from 'path';
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
    const serverExecutable = path.join(
        context.extensionPath,
        'out',
        'lsp',
        'lsp-csharp.exe'
    );

    const run: Executable = {
        command: serverExecutable,
        transport: TransportKind.stdio
    };

    const serverOptions: ServerOptions = {
        run: run,
        debug: run
    };

    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'pattern' }],
        synchronize: {
            fileEvents: vscode.workspace.createFileSystemWatcher('**/*.pattern')
        }
    };

    client = new LanguageClient(
        'patternLanguageServer',
        'Pattern Language Server',
        serverOptions,
        clientOptions
    );

    client.start();
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
