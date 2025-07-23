/**
 * ÆLang Diagnostics Provider
 * Provides error checking and validation
 */
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Diagnostic } from 'vscode-languageserver/node';
export declare class AELangDiagnostics {
    getDiagnostics(document: TextDocument): Promise<Diagnostic[]>;
    private checkSemicolons;
    private checkBraces;
    private checkTypos;
    private checkFormatSpecifiers;
}
//# sourceMappingURL=diagnostics.d.ts.map