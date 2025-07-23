/**
 * ÆLang Code Completion Provider
 * Provides IntelliSense and auto-completion features
 */
import { CompletionItem, Position, SignatureHelp } from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';
export declare class AELangCompletionProvider {
    private keywords;
    private types;
    private builtinFunctions;
    private literals;
    private operators;
    provideCompletions(document: TextDocument, position: Position): CompletionItem[];
    resolveCompletion(item: CompletionItem): CompletionItem;
    provideSignatureHelp(document: TextDocument, position: Position): SignatureHelp | undefined;
    private isInTypeContext;
    private isInFunctionCallContext;
    private findFunctionCallContext;
    private getSnippetCompletions;
}
//# sourceMappingURL=completion.d.ts.map