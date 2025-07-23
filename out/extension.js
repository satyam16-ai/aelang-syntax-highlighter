"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const node_1 = require("vscode-languageclient/node");
let client;
function activate(context) {
    console.log('ÆLang Language Support extension is now active!');
    // Language server setup - use bundled server
    const serverModule = context.asAbsolutePath(path.join('server', 'server.js'));
    // Debug options for the server
    const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };
    // Server options
    const serverOptions = {
        run: { module: serverModule, transport: node_1.TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: node_1.TransportKind.ipc,
            options: debugOptions
        }
    };
    // Client options
    const clientOptions = {
        documentSelector: [{ scheme: 'file', language: 'aelang' }],
        synchronize: {
            fileEvents: vscode.workspace.createFileSystemWatcher('**/.clientrc')
        },
        outputChannelName: 'ÆLang Language Server',
        revealOutputChannelOn: 4, // Never automatically reveal output channel
    };
    // Create the language client
    client = new node_1.LanguageClient('aelangLanguageServer', 'ÆLang Language Server', serverOptions, clientOptions);
    // Register commands
    context.subscriptions.push(vscode.commands.registerCommand('aelang.restartLanguageServer', restartLanguageServer));
    context.subscriptions.push(vscode.commands.registerCommand('aelang.showOutputChannel', () => {
        client.outputChannel.show();
    }));
    // Register status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
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
            vscode.window.showInformationMessage('ÆLang Language Support is now active! Enjoy IntelliSense, diagnostics, and auto-completion.', 'Got it!', 'Show Features').then(selection => {
                if (selection === 'Show Features') {
                    vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://github.com/satyam/aelang-vscode-extension#features'));
                }
            });
            config.update('welcomeShown', true, vscode.ConfigurationTarget.Global);
        }
    }).catch(error => {
        console.error('Failed to start ÆLang Language Server:', error);
        statusBarItem.text = "$(error) ÆLang LSP";
        statusBarItem.color = new vscode.ThemeColor('errorForeground');
        statusBarItem.tooltip = `ÆLang Language Server failed to start: ${error.message}`;
        vscode.window.showErrorMessage('ÆLang Language Server failed to start. Check the output panel for details.', 'Show Output').then(selection => {
            if (selection === 'Show Output') {
                client.outputChannel.show();
            }
        });
    });
    context.subscriptions.push(client);
    // Register file association helper
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(document => {
        if (document.fileName.endsWith('.ae') && document.languageId !== 'aelang') {
            vscode.window.showInformationMessage('This appears to be an ÆLang file. Would you like to set the language mode?', 'Yes', 'Not now').then(selection => {
                if (selection === 'Yes') {
                    vscode.languages.setTextDocumentLanguage(document, 'aelang');
                }
            });
        }
    }));
    // Register custom commands for ÆLang development
    context.subscriptions.push(vscode.commands.registerCommand('aelang.compileFile', () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor && activeEditor.document.languageId === 'aelang') {
            const terminal = vscode.window.createTerminal('ÆLang Compiler');
            const filePath = activeEditor.document.fileName;
            terminal.sendText(`cd "${path.dirname(filePath)}" && aelang compile "${path.basename(filePath)}"`);
            terminal.show();
        }
        else {
            vscode.window.showWarningMessage('Please open an ÆLang file (.ae) to compile.');
        }
    }));
    console.log('ÆLang Language Support extension activated successfully');
}
function deactivate() {
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
//# sourceMappingURL=extension.js.map