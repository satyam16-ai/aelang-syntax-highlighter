"use strict";
/**
 * ÆLang Semantic Analyzer
 * Performs type checking and semantic analysis
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AELangSemanticAnalyzer = void 0;
class AELangSemanticAnalyzer {
    constructor() {
        this.errors = [];
        this.symbols = new Map();
        this.currentScope = 'global';
        this.scopeStack = ['global'];
        // ÆLang type system
        this.types = new Map([
            ['i8', { name: 'i8', size: 8, signed: true, category: 'integer' }],
            ['i16', { name: 'i16', size: 16, signed: true, category: 'integer' }],
            ['i32', { name: 'i32', size: 32, signed: true, category: 'integer' }],
            ['i64', { name: 'i64', size: 64, signed: true, category: 'integer' }],
            ['u8', { name: 'u8', size: 8, signed: false, category: 'integer' }],
            ['u16', { name: 'u16', size: 16, signed: false, category: 'integer' }],
            ['u32', { name: 'u32', size: 32, signed: false, category: 'integer' }],
            ['u64', { name: 'u64', size: 64, signed: false, category: 'integer' }],
            ['f8', { name: 'f8', size: 8, signed: true, category: 'float' }],
            ['f16', { name: 'f16', size: 16, signed: true, category: 'float' }],
            ['f32', { name: 'f32', size: 32, signed: true, category: 'float' }],
            ['f64', { name: 'f64', size: 64, signed: true, category: 'float' }],
            ['num', { name: 'num', size: 64, signed: true, category: 'special' }],
            ['bool', { name: 'bool', size: 8, signed: false, category: 'special' }],
            ['char', { name: 'char', size: 8, signed: false, category: 'special' }],
            ['str', { name: 'str', size: 64, signed: false, category: 'special' }],
            ['void', { name: 'void', size: 0, signed: false, category: 'special' }]
        ]);
        // Built-in functions
        this.builtins = new Map([
            ['print', {
                    returnType: this.types.get('void'),
                    parameters: [] // Variadic function
                }],
            ['read', {
                    returnType: this.types.get('num'),
                    parameters: []
                }],
            ['print_int', {
                    returnType: this.types.get('void'),
                    parameters: [this.types.get('i32')]
                }],
            ['print_float', {
                    returnType: this.types.get('void'),
                    parameters: [this.types.get('f32')]
                }],
            ['print_str', {
                    returnType: this.types.get('void'),
                    parameters: [this.types.get('str')]
                }],
            ['print_bool', {
                    returnType: this.types.get('void'),
                    parameters: [this.types.get('bool')]
                }],
            ['read_int', {
                    returnType: this.types.get('i32'),
                    parameters: []
                }],
            ['read_float', {
                    returnType: this.types.get('f32'),
                    parameters: []
                }],
            ['read_num', {
                    returnType: this.types.get('num'),
                    parameters: []
                }],
            ['read_bool', {
                    returnType: this.types.get('bool'),
                    parameters: []
                }],
            ['read_char', {
                    returnType: this.types.get('char'),
                    parameters: []
                }]
        ]);
    }
    analyze(ast) {
        this.errors = [];
        this.symbols.clear();
        this.currentScope = 'global';
        this.scopeStack = ['global'];
        // Add built-in functions to symbol table
        for (const [name, info] of this.builtins) {
            this.symbols.set(this.getSymbolKey(name, 'global'), {
                name,
                type: info.returnType,
                kind: 'function',
                scope: 'global',
                declaration: {
                    type: 'FunctionDeclaration',
                    start: 0,
                    end: 0
                }
            });
        }
        this.visitProgram(ast);
        return this.errors;
    }
    visitProgram(node) {
        for (const stmt of node.body) {
            this.visitNode(stmt);
        }
    }
    visitNode(node) {
        switch (node.type) {
            case 'FunctionDeclaration':
                return this.visitFunctionDeclaration(node);
            case 'VariableDeclaration':
                return this.visitVariableDeclaration(node);
            case 'CallExpression':
                return this.visitCallExpression(node);
            case 'Identifier':
                return this.visitIdentifier(node);
            case 'BinaryExpression':
                return this.visitBinaryExpression(node);
            case 'AssignmentExpression':
                return this.visitAssignmentExpression(node);
            case 'Literal':
                return this.visitLiteral(node);
            case 'BlockStatement':
                this.visitBlockStatement(node);
                return null;
            case 'IfStatement':
                this.visitIfStatement(node);
                return null;
            case 'WhileStatement':
                this.visitWhileStatement(node);
                return null;
            case 'ForStatement':
                this.visitForStatement(node);
                return null;
            case 'ReturnStatement':
                this.visitReturnStatement(node);
                return null;
            case 'ExpressionStatement':
                this.visitNode(node.expression);
                return null;
            default:
                return null;
        }
    }
    visitFunctionDeclaration(node) {
        // Check if function already exists
        const symbolKey = this.getSymbolKey(node.name, this.currentScope);
        if (this.symbols.has(symbolKey)) {
            this.addError(`Function '${node.name}' is already declared`, node.start, node.end);
            return null;
        }
        // Validate return type
        const returnType = this.getTypeInfoInternal(node.returnType.typeName);
        if (!returnType) {
            this.addError(`Unknown return type '${node.returnType.typeName}'`, node.returnType.start, node.returnType.end);
            return null;
        }
        // Add function to symbol table
        this.symbols.set(symbolKey, {
            name: node.name,
            type: returnType,
            kind: 'function',
            scope: this.currentScope,
            declaration: node
        });
        // Enter function scope
        this.enterScope(node.name);
        // Process parameters
        for (const param of node.parameters) {
            this.visitParameter(param);
        }
        // Process function body (if not extern)
        if (!node.isExtern && node.body) {
            this.visitNode(node.body);
        }
        // Exit function scope
        this.exitScope();
        return returnType;
    }
    visitParameter(param) {
        const paramType = this.getTypeInfoInternal(param.typeAnnotation.typeName);
        if (!paramType) {
            this.addError(`Unknown parameter type '${param.typeAnnotation.typeName}'`, param.typeAnnotation.start, param.typeAnnotation.end);
            return;
        }
        // Check for duplicate parameters
        const symbolKey = this.getSymbolKey(param.name, this.currentScope);
        if (this.symbols.has(symbolKey)) {
            this.addError(`Parameter '${param.name}' is already declared`, param.start, param.end);
            return;
        }
        // Add parameter to symbol table
        this.symbols.set(symbolKey, {
            name: param.name,
            type: paramType,
            kind: 'parameter',
            scope: this.currentScope,
            declaration: param
        });
    }
    visitVariableDeclaration(node) {
        // Check for duplicate declaration in current scope
        const symbolKey = this.getSymbolKey(node.name, this.currentScope);
        if (this.symbols.has(symbolKey)) {
            this.addError(`Variable '${node.name}' is already declared in this scope`, node.start, node.end);
            return null;
        }
        let declaredType = null;
        // Get declared type if specified
        if (node.typeAnnotation) {
            declaredType = this.getTypeInfoInternal(node.typeAnnotation.typeName);
            if (!declaredType) {
                this.addError(`Unknown type '${node.typeAnnotation.typeName}'`, node.typeAnnotation.start, node.typeAnnotation.end);
                return null;
            }
        }
        // Check initializer type
        let initializerType = null;
        if (node.initializer) {
            initializerType = this.visitNode(node.initializer);
        }
        // Type inference and checking
        let finalType;
        if (declaredType && initializerType) {
            // Both type annotation and initializer present
            if (!this.areTypesCompatible(declaredType, initializerType)) {
                this.addError(`Cannot assign value of type '${initializerType.name}' to variable of type '${declaredType.name}'`, node.initializer.start, node.initializer.end);
                return null;
            }
            finalType = declaredType;
        }
        else if (declaredType) {
            // Only type annotation present
            finalType = declaredType;
        }
        else if (initializerType) {
            // Only initializer present (type inference)
            finalType = initializerType;
        }
        else {
            // Neither present - error
            this.addError(`Variable '${node.name}' must have either a type annotation or an initializer`, node.start, node.end);
            return null;
        }
        // Add variable to symbol table
        this.symbols.set(symbolKey, {
            name: node.name,
            type: finalType,
            kind: 'variable',
            scope: this.currentScope,
            declaration: node
        });
        return finalType;
    }
    visitCallExpression(node) {
        if (node.callee.type !== 'Identifier') {
            this.addError('Only function identifiers can be called', node.callee.start, node.callee.end);
            return null;
        }
        const functionName = node.callee.name;
        // Check if function exists
        const symbol = this.findSymbol(functionName);
        if (!symbol || symbol.kind !== 'function') {
            this.addError(`Unknown function '${functionName}'`, node.callee.start, node.callee.end);
            return null;
        }
        // Check built-in functions
        if (this.builtins.has(functionName)) {
            const builtin = this.builtins.get(functionName);
            // Special handling for print (variadic)
            if (functionName === 'print') {
                // First argument should be a string (format)
                if (node.arguments.length === 0) {
                    this.addError('Function print expects at least one argument (format string)', node.start, node.end);
                    return null;
                }
                const formatType = this.visitNode(node.arguments[0]);
                if (formatType && formatType.name !== 'str') {
                    this.addError('First argument to print must be a string', node.arguments[0].start, node.arguments[0].end);
                }
                // Validate remaining arguments (simplified validation)
                for (let i = 1; i < node.arguments.length; i++) {
                    this.visitNode(node.arguments[i]);
                }
            }
            else {
                // Check argument count for other built-ins
                if (node.arguments.length !== builtin.parameters.length) {
                    this.addError(`Function '${functionName}' expects ${builtin.parameters.length} arguments, got ${node.arguments.length}`, node.start, node.end);
                    return null;
                }
                // Check argument types
                for (let i = 0; i < node.arguments.length; i++) {
                    const argType = this.visitNode(node.arguments[i]);
                    const expectedType = builtin.parameters[i];
                    if (argType && !this.areTypesCompatible(expectedType, argType)) {
                        this.addError(`Argument ${i + 1} to '${functionName}' expects type '${expectedType.name}', got '${argType.name}'`, node.arguments[i].start, node.arguments[i].end);
                    }
                }
            }
            return builtin.returnType;
        }
        // For user-defined functions, check arguments against parameters
        const funcDecl = symbol.declaration;
        if (node.arguments.length !== funcDecl.parameters.length) {
            this.addError(`Function '${functionName}' expects ${funcDecl.parameters.length} arguments, got ${node.arguments.length}`, node.start, node.end);
            return null;
        }
        // Check argument types
        for (let i = 0; i < node.arguments.length; i++) {
            const argType = this.visitNode(node.arguments[i]);
            const paramType = this.getTypeInfoInternal(funcDecl.parameters[i].typeAnnotation.typeName);
            if (argType && paramType && !this.areTypesCompatible(paramType, argType)) {
                this.addError(`Argument ${i + 1} to '${functionName}' expects type '${paramType.name}', got '${argType.name}'`, node.arguments[i].start, node.arguments[i].end);
            }
        }
        return symbol.type;
    }
    visitIdentifier(node) {
        const symbol = this.findSymbol(node.name);
        if (!symbol) {
            this.addError(`Unknown identifier '${node.name}'`, node.start, node.end);
            return null;
        }
        return symbol.type;
    }
    visitBinaryExpression(node) {
        const leftType = this.visitNode(node.left);
        const rightType = this.visitNode(node.right);
        if (!leftType || !rightType) {
            return null;
        }
        // Type checking for binary operations
        switch (node.operator) {
            case '+':
            case '-':
            case '*':
            case '/':
            case '%':
                return this.checkArithmeticOperation(leftType, rightType, node.operator, node);
            case '==':
            case '!=':
                return this.checkEqualityOperation(leftType, rightType, node);
            case '<':
            case '>':
            case '<=':
            case '>=':
                return this.checkComparisonOperation(leftType, rightType, node);
            case '&&':
            case '||':
                return this.checkLogicalOperation(leftType, rightType, node);
            default:
                this.addError(`Unknown binary operator '${node.operator}'`, node.start, node.end);
                return null;
        }
    }
    visitAssignmentExpression(node) {
        const leftType = this.visitNode(node.left);
        const rightType = this.visitNode(node.right);
        if (!leftType || !rightType) {
            return null;
        }
        if (!this.areTypesCompatible(leftType, rightType)) {
            this.addError(`Cannot assign value of type '${rightType.name}' to variable of type '${leftType.name}'`, node.right.start, node.right.end);
        }
        return leftType;
    }
    visitLiteral(node) {
        if (typeof node.value === 'number') {
            // Determine if it's an integer or float
            if (Number.isInteger(node.value)) {
                // Choose appropriate integer type based on value
                if (node.value >= -128 && node.value <= 127) {
                    return this.types.get('i8');
                }
                else if (node.value >= -32768 && node.value <= 32767) {
                    return this.types.get('i16');
                }
                else if (node.value >= -2147483648 && node.value <= 2147483647) {
                    return this.types.get('i32');
                }
                else {
                    return this.types.get('i64');
                }
            }
            else {
                return this.types.get('f32'); // Default float type
            }
        }
        if (typeof node.value === 'string') {
            if (node.raw && node.raw.startsWith("'")) {
                return this.types.get('char');
            }
            return this.types.get('str');
        }
        if (typeof node.value === 'boolean') {
            return this.types.get('bool');
        }
        if (node.value === null) {
            return this.types.get('void');
        }
        return null;
    }
    visitBlockStatement(node) {
        this.enterScope(`block_${node.start}`);
        for (const stmt of node.statements) {
            this.visitNode(stmt);
        }
        this.exitScope();
    }
    visitIfStatement(node) {
        const conditionType = this.visitNode(node.condition);
        if (conditionType && conditionType.name !== 'bool') {
            this.addError(`If condition must be of type 'bool', got '${conditionType.name}'`, node.condition.start, node.condition.end);
        }
        this.visitNode(node.consequent);
        if (node.alternate) {
            this.visitNode(node.alternate);
        }
    }
    visitWhileStatement(node) {
        const conditionType = this.visitNode(node.condition);
        if (conditionType && conditionType.name !== 'bool') {
            this.addError(`While condition must be of type 'bool', got '${conditionType.name}'`, node.condition.start, node.condition.end);
        }
        this.visitNode(node.body);
    }
    visitForStatement(node) {
        this.enterScope(`for_${node.start}`);
        if (node.init) {
            this.visitNode(node.init);
        }
        if (node.condition) {
            const conditionType = this.visitNode(node.condition);
            if (conditionType && conditionType.name !== 'bool') {
                this.addError(`For condition must be of type 'bool', got '${conditionType.name}'`, node.condition.start, node.condition.end);
            }
        }
        if (node.update) {
            this.visitNode(node.update);
        }
        this.visitNode(node.body);
        this.exitScope();
    }
    visitReturnStatement(node) {
        if (node.argument) {
            this.visitNode(node.argument);
        }
    }
    // Type checking helper methods
    checkArithmeticOperation(leftType, rightType, operator, node) {
        // Modulo only works on integers
        if (operator === '%' && (leftType.category !== 'integer' || rightType.category !== 'integer')) {
            this.addError('Modulo operator can only be used with integer types', node.start, node.end);
            return null;
        }
        // Check if types are compatible for arithmetic
        if (leftType.category === 'special' || rightType.category === 'special') {
            // Only num type supports arithmetic among special types
            if (leftType.name !== 'num' && rightType.name !== 'num') {
                this.addError(`Arithmetic operation not supported between '${leftType.name}' and '${rightType.name}'`, node.start, node.end);
                return null;
            }
            return this.types.get('num');
        }
        // Return the larger type
        return leftType.size >= rightType.size ? leftType : rightType;
    }
    checkEqualityOperation(leftType, rightType, node) {
        // Equality can be checked between compatible types
        if (!this.areTypesCompatible(leftType, rightType)) {
            this.addError(`Cannot compare '${leftType.name}' and '${rightType.name}'`, node.start, node.end);
        }
        return this.types.get('bool');
    }
    checkComparisonOperation(leftType, rightType, node) {
        // Comparison only works on numeric types
        if (leftType.category === 'special' || rightType.category === 'special') {
            if (leftType.name !== 'num' && rightType.name !== 'num') {
                this.addError(`Comparison operation not supported between '${leftType.name}' and '${rightType.name}'`, node.start, node.end);
            }
        }
        return this.types.get('bool');
    }
    checkLogicalOperation(leftType, rightType, node) {
        // Logical operations require boolean operands
        if (leftType.name !== 'bool') {
            this.addError(`Left operand of logical operation must be 'bool', got '${leftType.name}'`, node.start, node.end);
        }
        if (rightType.name !== 'bool') {
            this.addError(`Right operand of logical operation must be 'bool', got '${rightType.name}'`, node.start, node.end);
        }
        return this.types.get('bool');
    }
    areTypesCompatible(expected, actual) {
        // Exact match
        if (expected.name === actual.name) {
            return true;
        }
        // num type is compatible with all numeric types
        if (expected.name === 'num' && (actual.category === 'integer' || actual.category === 'float')) {
            return true;
        }
        if (actual.name === 'num' && (expected.category === 'integer' || expected.category === 'float')) {
            return true;
        }
        // Integer type promotion (smaller to larger)
        if (expected.category === 'integer' && actual.category === 'integer') {
            return expected.size >= actual.size && expected.signed === actual.signed;
        }
        // Float type promotion
        if (expected.category === 'float' && actual.category === 'float') {
            return expected.size >= actual.size;
        }
        // Integer to float promotion
        if (expected.category === 'float' && actual.category === 'integer') {
            return expected.size >= 32; // Only allow promotion to f32 or larger
        }
        return false;
    }
    // Symbol table management
    enterScope(scopeName) {
        this.currentScope = `${this.currentScope}.${scopeName}`;
        this.scopeStack.push(this.currentScope);
    }
    exitScope() {
        this.scopeStack.pop();
        this.currentScope = this.scopeStack[this.scopeStack.length - 1];
    }
    getSymbolKey(name, scope) {
        return `${scope}.${name}`;
    }
    findSymbol(name) {
        // Search from current scope up to global
        for (let i = this.scopeStack.length - 1; i >= 0; i--) {
            const scope = this.scopeStack[i];
            const key = this.getSymbolKey(name, scope);
            if (this.symbols.has(key)) {
                return this.symbols.get(key);
            }
        }
        return null;
    }
    getTypeInfoInternal(typeName) {
        return this.types.get(typeName) || null;
    }
    addError(message, start, end) {
        this.errors.push({
            message,
            start,
            end
        });
    }
    // Public methods for language server
    getSymbols() {
        return this.symbols;
    }
    getTypeInfo(typeName) {
        return this.types.get(typeName) || null;
    }
    getBuiltinFunctions() {
        return this.builtins;
    }
}
exports.AELangSemanticAnalyzer = AELangSemanticAnalyzer;
//# sourceMappingURL=semantics.js.map