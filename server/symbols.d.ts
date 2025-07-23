/**
 * ÆLang Symbol Table
 * Manages symbols and provides hover information
 */
import { Position, Range } from 'vscode-languageserver/node';
import { ASTNode } from './parser';
export interface SymbolInfo {
    name: string;
    type: string;
    kind: 'variable' | 'function' | 'parameter' | 'type';
    scope: string;
    definition: {
        range: Range;
        uri: string;
    };
    documentation?: string;
    getHoverInfo(): string;
}
export declare class AELangSymbolTable {
    private symbols;
    update(uri: string, ast: ASTNode): void;
    getSymbolAt(uri: string, position: Position): SymbolInfo | null;
    private extractSymbols;
    private generateFunctionDocumentation;
    private generateVariableDocumentation;
    private isPositionInRange;
}
declare module './symbols' {
    interface SymbolInfo {
        getHoverInfo(): string;
    }
}
//# sourceMappingURL=symbols.d.ts.map