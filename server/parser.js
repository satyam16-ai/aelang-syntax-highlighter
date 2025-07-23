"use strict";
/**
 * ÆLang Parser for Language Server
 * Parses ÆLang source code into an Abstract Syntax Tree (AST)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AELangParser = void 0;
class AELangParser {
    constructor() {
        this.text = '';
        this.tokens = [];
        this.current = 0;
    }
    parse(text) {
        this.text = text;
        this.tokens = this.tokenize(text);
        this.current = 0;
        const body = [];
        while (!this.isAtEnd()) {
            try {
                const stmt = this.parseTopLevelStatement();
                if (stmt) {
                    body.push(stmt);
                }
            }
            catch (error) {
                // Skip to next statement on error
                this.synchronize();
            }
        }
        return {
            type: 'Program',
            start: 0,
            end: text.length,
            body
        };
    }
    tokenize(text) {
        const tokens = [];
        let current = 0;
        while (current < text.length) {
            let char = text[current];
            // Skip whitespace
            if (/\s/.test(char)) {
                current++;
                continue;
            }
            // Comments
            if (char === '/' && text[current + 1] === '/') {
                while (current < text.length && text[current] !== '\n') {
                    current++;
                }
                continue;
            }
            // String literals
            if (char === '"') {
                let start = current;
                current++; // Skip opening quote
                while (current < text.length && text[current] !== '"') {
                    if (text[current] === '\\')
                        current++; // Skip escape
                    current++;
                }
                current++; // Skip closing quote
                tokens.push({
                    type: 'STRING',
                    value: text.slice(start, current),
                    start,
                    end: current
                });
                continue;
            }
            // Character literals
            if (char === "'") {
                let start = current;
                current++; // Skip opening quote
                if (text[current] === '\\')
                    current++; // Skip escape
                current++; // Skip character
                current++; // Skip closing quote
                tokens.push({
                    type: 'CHAR',
                    value: text.slice(start, current),
                    start,
                    end: current
                });
                continue;
            }
            // Numbers
            if (/\d/.test(char)) {
                let start = current;
                // Handle different number formats
                if (char === '0' && current + 1 < text.length) {
                    const next = text[current + 1];
                    if (next === 'x' || next === 'X') {
                        // Hexadecimal
                        current += 2;
                        while (current < text.length && /[0-9a-fA-F]/.test(text[current])) {
                            current++;
                        }
                    }
                    else if (next === 'b' || next === 'B') {
                        // Binary
                        current += 2;
                        while (current < text.length && /[01]/.test(text[current])) {
                            current++;
                        }
                    }
                    else if (next === 'o' || next === 'O') {
                        // Octal
                        current += 2;
                        while (current < text.length && /[0-7]/.test(text[current])) {
                            current++;
                        }
                    }
                    else {
                        // Regular decimal
                        while (current < text.length && /\d/.test(text[current])) {
                            current++;
                        }
                    }
                }
                else {
                    // Regular decimal
                    while (current < text.length && /\d/.test(text[current])) {
                        current++;
                    }
                }
                // Check for decimal point
                if (current < text.length && text[current] === '.') {
                    current++;
                    while (current < text.length && /\d/.test(text[current])) {
                        current++;
                    }
                }
                // Check for scientific notation
                if (current < text.length && (text[current] === 'e' || text[current] === 'E')) {
                    current++;
                    if (current < text.length && (text[current] === '+' || text[current] === '-')) {
                        current++;
                    }
                    while (current < text.length && /\d/.test(text[current])) {
                        current++;
                    }
                }
                tokens.push({
                    type: 'NUMBER',
                    value: text.slice(start, current),
                    start,
                    end: current
                });
                continue;
            }
            // Identifiers and keywords
            if (/[a-zA-Z_]/.test(char)) {
                let start = current;
                while (current < text.length && /[a-zA-Z0-9_]/.test(text[current])) {
                    current++;
                }
                const value = text.slice(start, current);
                const tokenType = this.getKeywordType(value) || 'IDENTIFIER';
                tokens.push({
                    type: tokenType,
                    value,
                    start,
                    end: current
                });
                continue;
            }
            // Two-character operators
            if (current + 1 < text.length) {
                const twoChar = text.slice(current, current + 2);
                if (['==', '!=', '<=', '>=', '&&', '||'].includes(twoChar)) {
                    tokens.push({
                        type: 'OPERATOR',
                        value: twoChar,
                        start: current,
                        end: current + 2
                    });
                    current += 2;
                    continue;
                }
            }
            // Single-character tokens
            const singleCharTokens = {
                '(': 'LPAREN',
                ')': 'RPAREN',
                '{': 'LBRACE',
                '}': 'RBRACE',
                '[': 'LBRACKET',
                ']': 'RBRACKET',
                ';': 'SEMICOLON',
                ':': 'COLON',
                ',': 'COMMA',
                '.': 'DOT',
                '=': 'ASSIGN',
                '+': 'PLUS',
                '-': 'MINUS',
                '*': 'MULTIPLY',
                '/': 'DIVIDE',
                '%': 'MODULO',
                '<': 'LT',
                '>': 'GT',
                '!': 'NOT'
            };
            if (singleCharTokens[char]) {
                tokens.push({
                    type: singleCharTokens[char],
                    value: char,
                    start: current,
                    end: current + 1
                });
                current++;
                continue;
            }
            // Unknown character
            current++;
        }
        tokens.push({
            type: 'EOF',
            value: '',
            start: current,
            end: current
        });
        return tokens;
    }
    getKeywordType(value) {
        const keywords = {
            'func': 'FUNC',
            'let': 'LET',
            'if': 'IF',
            'else': 'ELSE',
            'while': 'WHILE',
            'for': 'FOR',
            'return': 'RETURN',
            'break': 'BREAK',
            'continue': 'CONTINUE',
            'extern': 'EXTERN',
            'true': 'TRUE',
            'false': 'FALSE',
            'null': 'NULL',
            'void': 'VOID',
            'i8': 'TYPE',
            'i16': 'TYPE',
            'i32': 'TYPE',
            'i64': 'TYPE',
            'u8': 'TYPE',
            'u16': 'TYPE',
            'u32': 'TYPE',
            'u64': 'TYPE',
            'f8': 'TYPE',
            'f16': 'TYPE',
            'f32': 'TYPE',
            'f64': 'TYPE',
            'num': 'TYPE',
            'bool': 'TYPE',
            'char': 'TYPE',
            'str': 'TYPE'
        };
        return keywords[value] || null;
    }
    parseTopLevelStatement() {
        if (this.check('EXTERN')) {
            return this.parseExternDeclaration();
        }
        if (this.check('FUNC')) {
            return this.parseFunctionDeclaration();
        }
        return this.parseStatement();
    }
    parseExternDeclaration() {
        const start = this.previous().start;
        this.consume('EXTERN', "Expected 'extern'");
        const name = this.consume('IDENTIFIER', 'Expected function name').value;
        this.consume('LPAREN', "Expected '('");
        const parameters = this.parseParameterList();
        this.consume('RPAREN', "Expected ')'");
        this.consume('COLON', "Expected ':'");
        const returnType = this.parseTypeAnnotation();
        this.consume('SEMICOLON', "Expected ';'");
        return {
            type: 'FunctionDeclaration',
            name,
            parameters,
            returnType,
            body: { type: 'BlockStatement', statements: [], start, end: this.previous().end },
            isExtern: true,
            start,
            end: this.previous().end
        };
    }
    parseFunctionDeclaration() {
        const start = this.previous().start;
        this.consume('FUNC', "Expected 'func'");
        const name = this.consume('IDENTIFIER', 'Expected function name').value;
        this.consume('LPAREN', "Expected '('");
        const parameters = this.parseParameterList();
        this.consume('RPAREN', "Expected ')'");
        this.consume('COLON', "Expected ':'");
        const returnType = this.parseTypeAnnotation();
        const body = this.parseBlockStatement();
        return {
            type: 'FunctionDeclaration',
            name,
            parameters,
            returnType,
            body,
            isExtern: false,
            start,
            end: this.previous().end
        };
    }
    parseParameterList() {
        const parameters = [];
        if (!this.check('RPAREN')) {
            do {
                const start = this.peek().start;
                const name = this.consume('IDENTIFIER', 'Expected parameter name').value;
                this.consume('COLON', "Expected ':'");
                const typeAnnotation = this.parseTypeAnnotation();
                parameters.push({
                    type: 'Parameter',
                    name,
                    typeAnnotation,
                    start,
                    end: this.previous().end
                });
            } while (this.match('COMMA'));
        }
        return parameters;
    }
    parseTypeAnnotation() {
        const start = this.peek().start;
        const typeName = this.consume('TYPE', 'Expected type').value;
        return {
            type: 'TypeAnnotation',
            typeName,
            start,
            end: this.previous().end
        };
    }
    parseBlockStatement() {
        const start = this.peek().start;
        this.consume('LBRACE', "Expected '{'");
        const statements = [];
        while (!this.check('RBRACE') && !this.isAtEnd()) {
            const stmt = this.parseStatement();
            if (stmt)
                statements.push(stmt);
        }
        this.consume('RBRACE', "Expected '}'");
        return {
            type: 'BlockStatement',
            statements,
            start,
            end: this.previous().end
        };
    }
    parseStatement() {
        if (this.match('LET'))
            return this.parseVariableDeclaration();
        if (this.match('IF'))
            return this.parseIfStatement();
        if (this.match('WHILE'))
            return this.parseWhileStatement();
        if (this.match('FOR'))
            return this.parseForStatement();
        if (this.match('RETURN'))
            return this.parseReturnStatement();
        if (this.match('LBRACE'))
            return this.parseBlockStatement();
        return this.parseExpressionStatement();
    }
    parseVariableDeclaration() {
        const start = this.previous().start;
        const name = this.consume('IDENTIFIER', 'Expected variable name').value;
        let typeAnnotation;
        if (this.match('COLON')) {
            typeAnnotation = this.parseTypeAnnotation();
        }
        let initializer;
        if (this.match('ASSIGN')) {
            initializer = this.parseExpression();
        }
        this.consume('SEMICOLON', "Expected ';'");
        return {
            type: 'VariableDeclaration',
            name,
            typeAnnotation,
            initializer,
            start,
            end: this.previous().end
        };
    }
    parseIfStatement() {
        const start = this.previous().start;
        this.consume('LPAREN', "Expected '('");
        const condition = this.parseExpression();
        this.consume('RPAREN', "Expected ')'");
        const consequent = this.parseStatement();
        let alternate;
        if (this.match('ELSE')) {
            alternate = this.parseStatement();
        }
        return {
            type: 'IfStatement',
            condition,
            consequent,
            alternate,
            start,
            end: this.previous().end
        };
    }
    parseWhileStatement() {
        const start = this.previous().start;
        this.consume('LPAREN', "Expected '('");
        const condition = this.parseExpression();
        this.consume('RPAREN', "Expected ')'");
        const body = this.parseStatement();
        return {
            type: 'WhileStatement',
            condition,
            body,
            start,
            end: this.previous().end
        };
    }
    parseForStatement() {
        const start = this.previous().start;
        this.consume('LPAREN', "Expected '('");
        let init;
        if (!this.check('SEMICOLON')) {
            init = this.match('LET') ? this.parseVariableDeclaration() : this.parseExpressionStatement();
        }
        else {
            this.advance(); // consume semicolon
        }
        let condition;
        if (!this.check('SEMICOLON')) {
            condition = this.parseExpression();
        }
        this.consume('SEMICOLON', "Expected ';'");
        let update;
        if (!this.check('RPAREN')) {
            update = this.parseExpression();
        }
        this.consume('RPAREN', "Expected ')'");
        const body = this.parseStatement();
        return {
            type: 'ForStatement',
            init,
            condition,
            update,
            body,
            start,
            end: this.previous().end
        };
    }
    parseReturnStatement() {
        const start = this.previous().start;
        let argument;
        if (!this.check('SEMICOLON')) {
            argument = this.parseExpression();
        }
        this.consume('SEMICOLON', "Expected ';'");
        return {
            type: 'ReturnStatement',
            argument,
            start,
            end: this.previous().end
        };
    }
    parseExpressionStatement() {
        const start = this.peek().start;
        const expression = this.parseExpression();
        this.consume('SEMICOLON', "Expected ';'");
        return {
            type: 'ExpressionStatement',
            expression,
            start,
            end: this.previous().end
        };
    }
    parseExpression() {
        return this.parseAssignment();
    }
    parseAssignment() {
        const expr = this.parseLogicalOr();
        if (this.match('ASSIGN')) {
            const operator = this.previous().value;
            const right = this.parseAssignment();
            return {
                type: 'AssignmentExpression',
                left: expr,
                operator,
                right,
                start: expr.start,
                end: right.end
            };
        }
        return expr;
    }
    parseLogicalOr() {
        let expr = this.parseLogicalAnd();
        while (this.match('OPERATOR') && this.previous().value === '||') {
            const operator = this.previous().value;
            const right = this.parseLogicalAnd();
            expr = {
                type: 'BinaryExpression',
                left: expr,
                operator,
                right,
                start: expr.start,
                end: right.end
            };
        }
        return expr;
    }
    parseLogicalAnd() {
        let expr = this.parseEquality();
        while (this.match('OPERATOR') && this.previous().value === '&&') {
            const operator = this.previous().value;
            const right = this.parseEquality();
            expr = {
                type: 'BinaryExpression',
                left: expr,
                operator,
                right,
                start: expr.start,
                end: right.end
            };
        }
        return expr;
    }
    parseEquality() {
        let expr = this.parseComparison();
        while (this.match('OPERATOR') && ['==', '!='].includes(this.previous().value)) {
            const operator = this.previous().value;
            const right = this.parseComparison();
            expr = {
                type: 'BinaryExpression',
                left: expr,
                operator,
                right,
                start: expr.start,
                end: right.end
            };
        }
        return expr;
    }
    parseComparison() {
        let expr = this.parseTerm();
        while (this.match('OPERATOR', 'LT', 'GT') ||
            (this.match('OPERATOR') && ['<=', '>='].includes(this.previous().value))) {
            const operator = this.previous().value;
            const right = this.parseTerm();
            expr = {
                type: 'BinaryExpression',
                left: expr,
                operator,
                right,
                start: expr.start,
                end: right.end
            };
        }
        return expr;
    }
    parseTerm() {
        let expr = this.parseFactor();
        while (this.match('PLUS', 'MINUS')) {
            const operator = this.previous().value;
            const right = this.parseFactor();
            expr = {
                type: 'BinaryExpression',
                left: expr,
                operator,
                right,
                start: expr.start,
                end: right.end
            };
        }
        return expr;
    }
    parseFactor() {
        let expr = this.parseUnary();
        while (this.match('MULTIPLY', 'DIVIDE', 'MODULO')) {
            const operator = this.previous().value;
            const right = this.parseUnary();
            expr = {
                type: 'BinaryExpression',
                left: expr,
                operator,
                right,
                start: expr.start,
                end: right.end
            };
        }
        return expr;
    }
    parseUnary() {
        if (this.match('NOT', 'MINUS')) {
            const operator = this.previous().value;
            const right = this.parseUnary();
            return {
                type: 'UnaryExpression',
                operator,
                argument: right,
                start: this.previous().start,
                end: right.end
            };
        }
        return this.parseCall();
    }
    parseCall() {
        let expr = this.parsePrimary();
        while (true) {
            if (this.match('LPAREN')) {
                expr = this.finishCall(expr);
            }
            else {
                break;
            }
        }
        return expr;
    }
    finishCall(callee) {
        const args = [];
        if (!this.check('RPAREN')) {
            do {
                args.push(this.parseExpression());
            } while (this.match('COMMA'));
        }
        this.consume('RPAREN', "Expected ')' after arguments");
        return {
            type: 'CallExpression',
            callee,
            arguments: args,
            start: callee.start,
            end: this.previous().end
        };
    }
    parsePrimary() {
        if (this.match('TRUE')) {
            return {
                type: 'Literal',
                value: true,
                raw: 'true',
                start: this.previous().start,
                end: this.previous().end
            };
        }
        if (this.match('FALSE')) {
            return {
                type: 'Literal',
                value: false,
                raw: 'false',
                start: this.previous().start,
                end: this.previous().end
            };
        }
        if (this.match('NULL')) {
            return {
                type: 'Literal',
                value: null,
                raw: 'null',
                start: this.previous().start,
                end: this.previous().end
            };
        }
        if (this.match('NUMBER')) {
            const token = this.previous();
            return {
                type: 'Literal',
                value: parseFloat(token.value),
                raw: token.value,
                start: token.start,
                end: token.end
            };
        }
        if (this.match('STRING')) {
            const token = this.previous();
            return {
                type: 'Literal',
                value: token.value.slice(1, -1), // Remove quotes
                raw: token.value,
                start: token.start,
                end: token.end
            };
        }
        if (this.match('CHAR')) {
            const token = this.previous();
            return {
                type: 'Literal',
                value: token.value.slice(1, -1), // Remove quotes
                raw: token.value,
                start: token.start,
                end: token.end
            };
        }
        if (this.match('IDENTIFIER')) {
            const token = this.previous();
            return {
                type: 'Identifier',
                name: token.value,
                start: token.start,
                end: token.end
            };
        }
        if (this.match('LPAREN')) {
            const expr = this.parseExpression();
            this.consume('RPAREN', "Expected ')' after expression");
            return expr;
        }
        throw new Error(`Unexpected token: ${this.peek().value}`);
    }
    // Helper methods
    match(...types) {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }
    check(type) {
        if (this.isAtEnd())
            return false;
        return this.peek().type === type;
    }
    advance() {
        if (!this.isAtEnd())
            this.current++;
        return this.previous();
    }
    isAtEnd() {
        return this.peek().type === 'EOF';
    }
    peek() {
        return this.tokens[this.current];
    }
    previous() {
        return this.tokens[this.current - 1];
    }
    consume(type, message) {
        if (this.check(type))
            return this.advance();
        throw new Error(`${message}. Got ${this.peek().type}`);
    }
    synchronize() {
        this.advance();
        while (!this.isAtEnd()) {
            if (this.previous().type === 'SEMICOLON')
                return;
            switch (this.peek().type) {
                case 'FUNC':
                case 'LET':
                case 'FOR':
                case 'IF':
                case 'WHILE':
                case 'RETURN':
                    return;
            }
            this.advance();
        }
    }
}
exports.AELangParser = AELangParser;
//# sourceMappingURL=parser.js.map