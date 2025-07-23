/**
 * ÆLang Parser for Language Server
 * Parses ÆLang source code into an Abstract Syntax Tree (AST)
 */
export interface ASTNode {
    type: string;
    start: number;
    end: number;
    [key: string]: any;
}
export interface Program extends ASTNode {
    type: 'Program';
    body: ASTNode[];
}
export interface FunctionDeclaration extends ASTNode {
    type: 'FunctionDeclaration';
    name: string;
    parameters: Parameter[];
    returnType: TypeAnnotation;
    body: BlockStatement;
    isExtern: boolean;
}
export interface Parameter extends ASTNode {
    type: 'Parameter';
    name: string;
    typeAnnotation: TypeAnnotation;
}
export interface TypeAnnotation extends ASTNode {
    type: 'TypeAnnotation';
    typeName: string;
}
export interface VariableDeclaration extends ASTNode {
    type: 'VariableDeclaration';
    name: string;
    typeAnnotation?: TypeAnnotation;
    initializer?: ASTNode;
}
export interface BlockStatement extends ASTNode {
    type: 'BlockStatement';
    statements: ASTNode[];
}
export interface IfStatement extends ASTNode {
    type: 'IfStatement';
    condition: ASTNode;
    consequent: ASTNode;
    alternate?: ASTNode;
}
export interface WhileStatement extends ASTNode {
    type: 'WhileStatement';
    condition: ASTNode;
    body: ASTNode;
}
export interface ForStatement extends ASTNode {
    type: 'ForStatement';
    init?: ASTNode;
    condition?: ASTNode;
    update?: ASTNode;
    body: ASTNode;
}
export interface ReturnStatement extends ASTNode {
    type: 'ReturnStatement';
    argument?: ASTNode;
}
export interface ExpressionStatement extends ASTNode {
    type: 'ExpressionStatement';
    expression: ASTNode;
}
export interface CallExpression extends ASTNode {
    type: 'CallExpression';
    callee: ASTNode;
    arguments: ASTNode[];
}
export interface Identifier extends ASTNode {
    type: 'Identifier';
    name: string;
}
export interface Literal extends ASTNode {
    type: 'Literal';
    value: any;
    raw: string;
}
export interface BinaryExpression extends ASTNode {
    type: 'BinaryExpression';
    left: ASTNode;
    operator: string;
    right: ASTNode;
}
export interface AssignmentExpression extends ASTNode {
    type: 'AssignmentExpression';
    left: ASTNode;
    operator: string;
    right: ASTNode;
}
export declare class AELangParser {
    private text;
    private tokens;
    private current;
    parse(text: string): Program;
    private tokenize;
    private getKeywordType;
    private parseTopLevelStatement;
    private parseExternDeclaration;
    private parseFunctionDeclaration;
    private parseParameterList;
    private parseTypeAnnotation;
    private parseBlockStatement;
    private parseStatement;
    private parseVariableDeclaration;
    private parseIfStatement;
    private parseWhileStatement;
    private parseForStatement;
    private parseReturnStatement;
    private parseExpressionStatement;
    private parseExpression;
    private parseAssignment;
    private parseLogicalOr;
    private parseLogicalAnd;
    private parseEquality;
    private parseComparison;
    private parseTerm;
    private parseFactor;
    private parseUnary;
    private parseCall;
    private finishCall;
    private parsePrimary;
    private match;
    private check;
    private advance;
    private isAtEnd;
    private peek;
    private previous;
    private consume;
    private synchronize;
}
//# sourceMappingURL=parser.d.ts.map