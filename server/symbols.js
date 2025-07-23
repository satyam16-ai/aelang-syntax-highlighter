"use strict";
/**
 * ÆLang Symbol Table
 * Manages symbols and provides hover information
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AELangSymbolTable = void 0;
class AELangSymbolTable {
    constructor() {
        this.symbols = new Map();
    }
    update(uri, ast) {
        this.symbols.set(uri, new Map());
        this.extractSymbols(uri, ast);
    }
    getSymbolAt(uri, position) {
        const documentSymbols = this.symbols.get(uri);
        if (!documentSymbols) {
            return null;
        }
        // Find symbol at position (simplified implementation)
        for (const [name, symbol] of documentSymbols) {
            const range = symbol.definition.range;
            if (this.isPositionInRange(position, range)) {
                return symbol;
            }
        }
        return null;
    }
    extractSymbols(uri, node) {
        const documentSymbols = this.symbols.get(uri);
        switch (node.type) {
            case 'Program':
                for (const child of node.body) {
                    this.extractSymbols(uri, child);
                }
                break;
            case 'FunctionDeclaration':
                const funcNode = node;
                const funcSymbol = {
                    name: funcNode.name,
                    type: funcNode.returnType.typeName,
                    kind: 'function',
                    scope: 'global',
                    definition: {
                        range: {
                            start: { line: 0, character: node.start },
                            end: { line: 0, character: node.end }
                        },
                        uri
                    },
                    documentation: this.generateFunctionDocumentation(funcNode),
                    getHoverInfo: function () {
                        return this.documentation || `${this.kind}: ${this.name}`;
                    }
                };
                documentSymbols.set(funcNode.name, funcSymbol);
                break;
            case 'VariableDeclaration':
                const varNode = node;
                const varSymbol = {
                    name: varNode.name,
                    type: varNode.typeAnnotation?.typeName || 'inferred',
                    kind: 'variable',
                    scope: 'local',
                    definition: {
                        range: {
                            start: { line: 0, character: node.start },
                            end: { line: 0, character: node.end }
                        },
                        uri
                    },
                    documentation: this.generateVariableDocumentation(varNode),
                    getHoverInfo: function () {
                        return this.documentation || `${this.kind}: ${this.name}`;
                    }
                };
                documentSymbols.set(varNode.name, varSymbol);
                break;
        }
        // Recursively extract from child nodes
        for (const key in node) {
            const value = node[key];
            if (Array.isArray(value)) {
                for (const item of value) {
                    if (item && typeof item === 'object' && item.type) {
                        this.extractSymbols(uri, item);
                    }
                }
            }
            else if (value && typeof value === 'object' && value.type) {
                this.extractSymbols(uri, value);
            }
        }
    }
    generateFunctionDocumentation(funcNode) {
        let doc = `**Function: ${funcNode.name}**\n\n`;
        if (funcNode.isExtern) {
            doc += '*External function declaration*\n\n';
        }
        doc += `**Returns:** ${funcNode.returnType.typeName}\n\n`;
        if (funcNode.parameters.length > 0) {
            doc += '**Parameters:**\n';
            for (const param of funcNode.parameters) {
                doc += `- \`${param.name}: ${param.typeAnnotation.typeName}\`\n`;
            }
        }
        else {
            doc += '**Parameters:** None\n';
        }
        return doc;
    }
    generateVariableDocumentation(varNode) {
        let doc = `**Variable: ${varNode.name}**\n\n`;
        if (varNode.typeAnnotation) {
            doc += `**Type:** ${varNode.typeAnnotation.typeName}\n\n`;
        }
        else {
            doc += '**Type:** Inferred from initializer\n\n';
        }
        if (varNode.initializer) {
            doc += '**Initialized:** Yes\n';
        }
        else {
            doc += '**Initialized:** No\n';
        }
        return doc;
    }
    isPositionInRange(position, range) {
        const { line, character } = position;
        const { start, end } = range;
        if (line < start.line || line > end.line) {
            return false;
        }
        if (line === start.line && character < start.character) {
            return false;
        }
        if (line === end.line && character > end.character) {
            return false;
        }
        return true;
    }
}
exports.AELangSymbolTable = AELangSymbolTable;
// Add method to SymbolInfo prototype
Object.defineProperty(Object.prototype, 'getHoverInfo', {
    value: function () {
        return this.documentation || `${this.kind}: ${this.name}`;
    },
    enumerable: false
});
//# sourceMappingURL=symbols.js.map