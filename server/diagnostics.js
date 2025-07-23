"use strict";
/**
 * ÆLang Diagnostics Provider
 * Provides error checking and validation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AELangDiagnostics = void 0;
const node_1 = require("vscode-languageserver/node");
class AELangDiagnostics {
    async getDiagnostics(document) {
        const diagnostics = [];
        const text = document.getText();
        const lines = text.split('\n');
        // Basic syntax checking
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lineNumber = i;
            // Check for common syntax errors
            this.checkSemicolons(line, lineNumber, diagnostics);
            this.checkBraces(line, lineNumber, diagnostics);
            this.checkTypos(line, lineNumber, diagnostics);
            this.checkFormatSpecifiers(line, lineNumber, diagnostics);
        }
        return diagnostics;
    }
    checkSemicolons(line, lineNumber, diagnostics) {
        // Check for missing semicolons after statements
        const trimmedLine = line.trim();
        if (trimmedLine.length > 0 &&
            !trimmedLine.endsWith(';') &&
            !trimmedLine.endsWith('{') &&
            !trimmedLine.endsWith('}') &&
            !trimmedLine.startsWith('//') &&
            !trimmedLine.includes('if ') &&
            !trimmedLine.includes('else') &&
            !trimmedLine.includes('while ') &&
            !trimmedLine.includes('for ') &&
            (trimmedLine.includes('let ') ||
                trimmedLine.includes('return') ||
                trimmedLine.includes('print') ||
                trimmedLine.includes('=') ||
                trimmedLine.includes('break') ||
                trimmedLine.includes('continue'))) {
            diagnostics.push({
                severity: node_1.DiagnosticSeverity.Error,
                range: {
                    start: { line: lineNumber, character: trimmedLine.length },
                    end: { line: lineNumber, character: trimmedLine.length }
                },
                message: 'Missing semicolon',
                source: 'aelang'
            });
        }
    }
    checkBraces(line, lineNumber, diagnostics) {
        // Check for unmatched braces (basic check)
        const openBraces = (line.match(/\{/g) || []).length;
        const closeBraces = (line.match(/\}/g) || []).length;
        if (openBraces !== closeBraces && line.trim().includes('{') && line.trim().includes('}')) {
            diagnostics.push({
                severity: node_1.DiagnosticSeverity.Error,
                range: {
                    start: { line: lineNumber, character: 0 },
                    end: { line: lineNumber, character: line.length }
                },
                message: 'Unmatched braces',
                source: 'aelang'
            });
        }
    }
    checkTypos(line, lineNumber, diagnostics) {
        // Check for common typos
        const commonTypos = [
            { typo: 'fucn', correct: 'func' },
            { typo: 'retrun', correct: 'return' },
            { typo: 'pirnt', correct: 'print' },
            { typo: 'raed', correct: 'read' },
            { typo: 'ture', correct: 'true' },
            { typo: 'fasle', correct: 'false' },
            { typo: 'stirng', correct: 'string' }
        ];
        for (const { typo, correct } of commonTypos) {
            const regex = new RegExp(`\\b${typo}\\b`, 'g');
            let match;
            while ((match = regex.exec(line)) !== null) {
                diagnostics.push({
                    severity: node_1.DiagnosticSeverity.Error,
                    range: {
                        start: { line: lineNumber, character: match.index },
                        end: { line: lineNumber, character: match.index + typo.length }
                    },
                    message: `Unknown identifier '${typo}'. Did you mean '${correct}'?`,
                    source: 'aelang'
                });
            }
        }
    }
    checkFormatSpecifiers(line, lineNumber, diagnostics) {
        // Check for invalid format specifiers in print statements
        if (line.includes('print(')) {
            const validSpecifiers = ['%d', '%u', '%ld', '%lu', '%f', '%t', '%c'];
            const specifierRegex = /%[a-zA-Z]+/g;
            let match;
            while ((match = specifierRegex.exec(line)) !== null) {
                const specifier = match[0];
                if (!validSpecifiers.includes(specifier)) {
                    diagnostics.push({
                        severity: node_1.DiagnosticSeverity.Warning,
                        range: {
                            start: { line: lineNumber, character: match.index },
                            end: { line: lineNumber, character: match.index + specifier.length }
                        },
                        message: `Unknown format specifier '${specifier}'. Valid specifiers: ${validSpecifiers.join(', ')}`,
                        source: 'aelang'
                    });
                }
            }
        }
    }
}
exports.AELangDiagnostics = AELangDiagnostics;
//# sourceMappingURL=diagnostics.js.map