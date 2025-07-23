/**
 * ÆLang Semantic Analyzer
 * Performs type checking and semantic analysis
 */
import { ASTNode, Program } from './parser';
export interface SemanticError {
    message: string;
    start: number;
    end: number;
    relatedInfo?: {
        start: number;
        end: number;
        message: string;
    }[];
}
export interface TypeInfo {
    name: string;
    size: number;
    signed: boolean;
    category: 'integer' | 'float' | 'special';
}
export interface Symbol {
    name: string;
    type: TypeInfo;
    kind: 'variable' | 'function' | 'parameter';
    scope: string;
    declaration: ASTNode;
}
export declare class AELangSemanticAnalyzer {
    private errors;
    private symbols;
    private currentScope;
    private scopeStack;
    private types;
    private builtins;
    analyze(ast: Program): SemanticError[];
    private visitProgram;
    private visitNode;
    private visitFunctionDeclaration;
    private visitParameter;
    private visitVariableDeclaration;
    private visitCallExpression;
    private visitIdentifier;
    private visitBinaryExpression;
    private visitAssignmentExpression;
    private visitLiteral;
    private visitBlockStatement;
    private visitIfStatement;
    private visitWhileStatement;
    private visitForStatement;
    private visitReturnStatement;
    private checkArithmeticOperation;
    private checkEqualityOperation;
    private checkComparisonOperation;
    private checkLogicalOperation;
    private areTypesCompatible;
    private enterScope;
    private exitScope;
    private getSymbolKey;
    private findSymbol;
    private getTypeInfoInternal;
    private addError;
    getSymbols(): Map<string, Symbol>;
    getTypeInfo(typeName: string): TypeInfo | null;
    getBuiltinFunctions(): Map<string, {
        returnType: TypeInfo;
        parameters: TypeInfo[];
    }>;
}
//# sourceMappingURL=semantics.d.ts.map