"use strict";
/**
 * ÆLang Language Server
 * Provides IntelliSense, diagnostics, and other IDE features for ÆLang
 */
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("vscode-languageserver/node");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const parser_1 = require("./parser");
const semantics_1 = require("./semantics");
const completion_1 = require("./completion");
const diagnostics_1 = require("./diagnostics");
const symbols_1 = require("./symbols");
// Create a connection for the server
const connection = (0, node_1.createConnection)(node_1.ProposedFeatures.all);
// Create a simple text document manager
const documents = new node_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
// ÆLang components
const parser = new parser_1.AELangParser();
const semanticAnalyzer = new semantics_1.AELangSemanticAnalyzer();
const completionProvider = new completion_1.AELangCompletionProvider();
const diagnostics = new diagnostics_1.AELangDiagnostics();
const symbolTable = new symbols_1.AELangSymbolTable();
let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;
connection.onInitialize((params) => {
    const capabilities = params.capabilities;
    // Does the client support the `workspace/configuration` request?
    hasConfigurationCapability = !!(capabilities.workspace && !!capabilities.workspace.configuration);
    hasWorkspaceFolderCapability = !!(capabilities.workspace && !!capabilities.workspace.workspaceFolders);
    hasDiagnosticRelatedInformationCapability = !!(capabilities.textDocument &&
        capabilities.textDocument.publishDiagnostics &&
        capabilities.textDocument.publishDiagnostics.relatedInformation);
    const result = {
        capabilities: {
            textDocumentSync: node_1.TextDocumentSyncKind.Incremental,
            // Tell the client that this server supports code completion
            completionProvider: {
                resolveProvider: true,
                triggerCharacters: ['.', ':', ' ', '(', '{']
            },
            // Support hover information
            hoverProvider: true,
            // Support signature help
            signatureHelpProvider: {
                triggerCharacters: ['(', ',']
            },
            // Support go to definition
            definitionProvider: true,
            // Support document diagnostics
            diagnosticProvider: {
                identifier: 'aelang',
                interFileDependencies: false,
                workspaceDiagnostics: false
            }
        }
    };
    if (hasWorkspaceFolderCapability) {
        result.capabilities.workspace = {
            workspaceFolders: {
                supported: true
            }
        };
    }
    return result;
});
connection.onInitialized(() => {
    if (hasConfigurationCapability) {
        // Register for all configuration changes
        connection.client.register(node_1.DidChangeConfigurationNotification.type, undefined);
    }
    if (hasWorkspaceFolderCapability) {
        connection.workspace.onDidChangeWorkspaceFolders(_event => {
            connection.console.log('Workspace folder change event received.');
        });
    }
});
// Document change events
documents.onDidChangeContent(change => {
    validateTextDocument(change.document);
});
async function validateTextDocument(textDocument) {
    const text = textDocument.getText();
    const diagnostics = [];
    try {
        // Parse the document
        const ast = parser.parse(text);
        // Perform semantic analysis
        const semanticErrors = semanticAnalyzer.analyze(ast);
        // Convert semantic errors to diagnostics
        for (const error of semanticErrors) {
            const diagnostic = {
                severity: node_1.DiagnosticSeverity.Error,
                range: {
                    start: textDocument.positionAt(error.start),
                    end: textDocument.positionAt(error.end)
                },
                message: error.message,
                source: 'aelang'
            };
            if (hasDiagnosticRelatedInformationCapability) {
                diagnostic.relatedInformation = error.relatedInfo?.map(info => ({
                    location: {
                        uri: textDocument.uri,
                        range: {
                            start: textDocument.positionAt(info.start),
                            end: textDocument.positionAt(info.end)
                        }
                    },
                    message: info.message
                }));
            }
            diagnostics.push(diagnostic);
        }
        // Update symbol table
        symbolTable.update(textDocument.uri, ast);
    }
    catch (parseError) {
        // Handle parse errors
        const diagnostic = {
            severity: node_1.DiagnosticSeverity.Error,
            range: {
                start: textDocument.positionAt(0),
                end: textDocument.positionAt(text.length)
            },
            message: `Parse error: ${parseError.message}`,
            source: 'aelang'
        };
        diagnostics.push(diagnostic);
    }
    // Send the computed diagnostics to VS Code
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}
// Document diagnostic provider
connection.languages.diagnostics.on(async (params) => {
    const document = documents.get(params.textDocument.uri);
    if (document !== undefined) {
        return {
            kind: node_1.DocumentDiagnosticReportKind.Full,
            items: await diagnostics.getDiagnostics(document)
        };
    }
    else {
        return {
            kind: node_1.DocumentDiagnosticReportKind.Full,
            items: []
        };
    }
});
// Code completion
connection.onCompletion((_textDocumentPosition) => {
    const document = documents.get(_textDocumentPosition.textDocument.uri);
    if (!document) {
        return [];
    }
    return completionProvider.provideCompletions(document, _textDocumentPosition.position);
});
// Completion item resolve
connection.onCompletionResolve((item) => {
    return completionProvider.resolveCompletion(item);
});
// Hover provider
connection.onHover((params) => {
    const document = documents.get(params.textDocument.uri);
    if (!document) {
        return undefined;
    }
    const position = params.position;
    const word = getWordAtPosition(document, position);
    if (!word) {
        return undefined;
    }
    // Get hover information from symbol table
    const symbol = symbolTable.getSymbolAt(params.textDocument.uri, position);
    if (symbol) {
        return {
            contents: {
                kind: node_1.MarkupKind.Markdown,
                value: symbol.getHoverInfo()
            }
        };
    }
    return undefined;
});
// Signature help provider
connection.onSignatureHelp((params) => {
    const document = documents.get(params.textDocument.uri);
    if (!document) {
        return undefined;
    }
    return completionProvider.provideSignatureHelp(document, params.position);
});
// Go to definition provider
connection.onDefinition((params) => {
    const document = documents.get(params.textDocument.uri);
    if (!document) {
        return undefined;
    }
    const symbol = symbolTable.getSymbolAt(params.textDocument.uri, params.position);
    if (symbol && symbol.definition) {
        return node_1.Location.create(params.textDocument.uri, symbol.definition.range);
    }
    return undefined;
});
// Utility function to get word at position
function getWordAtPosition(document, position) {
    const text = document.getText();
    const offset = document.offsetAt(position);
    let start = offset;
    let end = offset;
    // Find word boundaries
    while (start > 0 && /\w/.test(text[start - 1])) {
        start--;
    }
    while (end < text.length && /\w/.test(text[end])) {
        end++;
    }
    if (start === end) {
        return undefined;
    }
    return text.substring(start, end);
}
// Make the text document manager listen on the connection
documents.listen(connection);
// Listen on the connection
connection.listen();
console.log('ÆLang Language Server started and listening...');
//# sourceMappingURL=server.js.map