import * as vscode from 'vscode';
import * as path from 'path';
import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: vscode.ExtensionContext) {
    console.log('ÆLang Language Support extension is now active!');

    // Language server setup - use bundled server
    const serverModule = context.asAbsolutePath(
        path.join('server', 'server.js')
    );

    // Debug options for the server
    const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

    // Server options
    const serverOptions: ServerOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: TransportKind.ipc,
            options: debugOptions
        }
    };

    // Client options
    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'aelang' }],
        synchronize: {
            fileEvents: vscode.workspace.createFileSystemWatcher('**/.clientrc')
        },
        outputChannelName: 'ÆLang Language Server',
        revealOutputChannelOn: 4, // Never automatically reveal output channel
    };

    // Create the language client
    client = new LanguageClient(
        'aelangLanguageServer',
        'ÆLang Language Server',
        serverOptions,
        clientOptions
    );

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('aelang.restartLanguageServer', restartLanguageServer)
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('aelang.showOutputChannel', () => {
            client.outputChannel.show();
        })
    );

    // Register status bar item
    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );
    statusBarItem.text = "$(check) ÆLang LSP";
    statusBarItem.tooltip = "ÆLang Language Server is running";
    statusBarItem.command = 'aelang.showOutputChannel';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    // Start the client and register it
    client.start().then(() => {
        console.log('ÆLang Language Server started successfully');
        statusBarItem.text = "$(check) ÆLang LSP";
        statusBarItem.color = new vscode.ThemeColor('statusBar.foreground');
        
        // Show welcome message for new users
        const config = vscode.workspace.getConfiguration('aelang');
        if (!config.get('welcomeShown')) {
            vscode.window.showInformationMessage(
                'ÆLang Language Support is now active! Enjoy IntelliSense, diagnostics, and auto-completion.',
                'Got it!',
                'Show Features'
            ).then(selection => {
                if (selection === 'Show Features') {
                    vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(
                        'https://github.com/satyam/aelang-vscode-extension#features'
                    ));
                }
            });
            config.update('welcomeShown', true, vscode.ConfigurationTarget.Global);
        }
    }).catch(error => {
        console.error('Failed to start ÆLang Language Server:', error);
        statusBarItem.text = "$(error) ÆLang LSP";
        statusBarItem.color = new vscode.ThemeColor('errorForeground');
        statusBarItem.tooltip = `ÆLang Language Server failed to start: ${error.message}`;
        
        vscode.window.showErrorMessage(
            'ÆLang Language Server failed to start. Check the output panel for details.',
            'Show Output'
        ).then(selection => {
            if (selection === 'Show Output') {
                client.outputChannel.show();
            }
        });
    });

    context.subscriptions.push(client);

    // Register file association helper
    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(document => {
            if (document.fileName.endsWith('.ae') && document.languageId !== 'aelang') {
                vscode.window.showInformationMessage(
                    'This appears to be an ÆLang file. Would you like to set the language mode?',
                    'Yes',
                    'Not now'
                ).then(selection => {
                    if (selection === 'Yes') {
                        vscode.languages.setTextDocumentLanguage(document, 'aelang');
                    }
                });
            }
        })
    );

    // Register custom commands for ÆLang development
    context.subscriptions.push(
        vscode.commands.registerCommand('aelang.compileFile', () => {
            const activeEditor = vscode.window.activeTextEditor;
            if (activeEditor && activeEditor.document.languageId === 'aelang') {
                const terminal = vscode.window.createTerminal('ÆLang Compiler');
                const filePath = activeEditor.document.fileName;
                terminal.sendText(`cd "${path.dirname(filePath)}" && aelang compile "${path.basename(filePath)}"`);
                terminal.show();
            } else {
                vscode.window.showWarningMessage('Please open an ÆLang file (.ae) to compile.');
            }
        })
    );

    console.log('ÆLang Language Support extension activated successfully');
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    console.log('Deactivating ÆLang Language Support extension...');
    return client.stop();
}

async function restartLanguageServer() {
    if (client) {
        vscode.window.showInformationMessage('Restarting ÆLang Language Server...');
        await client.stop();
        await client.start();
        vscode.window.showInformationMessage('ÆLang Language Server restarted successfully!');
    }
}
