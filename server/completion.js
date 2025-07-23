"use strict";
/**
 * ÆLang Code Completion Provider
 * Provides IntelliSense and auto-completion features
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AELangCompletionProvider = void 0;
const node_1 = require("vscode-languageserver/node");
class AELangCompletionProvider {
    constructor() {
        // ÆLang keywords
        this.keywords = [
            {
                label: 'func',
                kind: node_1.CompletionItemKind.Keyword,
                detail: 'Function declaration',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: 'Declares a new function\n\n```aelang\nfunc functionName(param: type): returnType {\n    // function body\n}\n```'
                },
                insertText: 'func ${1:functionName}(${2:param}: ${3:type}): ${4:returnType} {\n    ${0}\n}',
                insertTextFormat: node_1.InsertTextFormat.Snippet
            },
            {
                label: 'let',
                kind: node_1.CompletionItemKind.Keyword,
                detail: 'Variable declaration',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: 'Declares a new variable\n\n```aelang\nlet variableName: type = value;\n```'
                },
                insertText: 'let ${1:variableName}: ${2:type} = ${0};',
                insertTextFormat: node_1.InsertTextFormat.Snippet
            },
            {
                label: 'if',
                kind: node_1.CompletionItemKind.Keyword,
                detail: 'Conditional statement',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: 'Conditional execution\n\n```aelang\nif (condition) {\n    // code\n}\n```'
                },
                insertText: 'if (${1:condition}) {\n    ${0}\n}',
                insertTextFormat: node_1.InsertTextFormat.Snippet
            },
            {
                label: 'else',
                kind: node_1.CompletionItemKind.Keyword,
                detail: 'Alternative condition',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: 'Alternative execution path\n\n```aelang\nelse {\n    // code\n}\n```'
                }
            },
            {
                label: 'while',
                kind: node_1.CompletionItemKind.Keyword,
                detail: 'While loop',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: 'Loop while condition is true\n\n```aelang\nwhile (condition) {\n    // code\n}\n```'
                },
                insertText: 'while (${1:condition}) {\n    ${0}\n}',
                insertTextFormat: node_1.InsertTextFormat.Snippet
            },
            {
                label: 'for',
                kind: node_1.CompletionItemKind.Keyword,
                detail: 'For loop',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: 'For loop with initialization, condition, and update\n\n```aelang\nfor (init; condition; update) {\n    // code\n}\n```'
                },
                insertText: 'for (${1:let i: i32 = 0}; ${2:i < 10}; ${3:i = i + 1}) {\n    ${0}\n}',
                insertTextFormat: node_1.InsertTextFormat.Snippet
            },
            {
                label: 'return',
                kind: node_1.CompletionItemKind.Keyword,
                detail: 'Return statement',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: 'Returns a value from a function\n\n```aelang\nreturn value;\n```'
                },
                insertText: 'return ${0};',
                insertTextFormat: node_1.InsertTextFormat.Snippet
            },
            {
                label: 'break',
                kind: node_1.CompletionItemKind.Keyword,
                detail: 'Break statement',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: 'Breaks out of a loop'
                }
            },
            {
                label: 'continue',
                kind: node_1.CompletionItemKind.Keyword,
                detail: 'Continue statement',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: 'Continues to the next iteration of a loop'
                }
            },
            {
                label: 'extern',
                kind: node_1.CompletionItemKind.Keyword,
                detail: 'External function declaration',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: 'Declares an external function\n\n```aelang\nextern functionName(param: type): returnType;\n```'
                },
                insertText: 'extern ${1:functionName}(${2:param}: ${3:type}): ${4:returnType};',
                insertTextFormat: node_1.InsertTextFormat.Snippet
            }
        ];
        // ÆLang data types
        this.types = [
            // Integer types
            {
                label: 'i8',
                kind: node_1.CompletionItemKind.TypeParameter,
                detail: 'Signed 8-bit integer (-128 to 127)',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**Signed 8-bit integer**\n\nRange: -128 to 127\nSize: 1 byte'
                }
            },
            {
                label: 'i16',
                kind: node_1.CompletionItemKind.TypeParameter,
                detail: 'Signed 16-bit integer (-32,768 to 32,767)',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**Signed 16-bit integer**\n\nRange: -32,768 to 32,767\nSize: 2 bytes'
                }
            },
            {
                label: 'i32',
                kind: node_1.CompletionItemKind.TypeParameter,
                detail: 'Signed 32-bit integer (-2,147,483,648 to 2,147,483,647)',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**Signed 32-bit integer**\n\nRange: -2,147,483,648 to 2,147,483,647\nSize: 4 bytes'
                }
            },
            {
                label: 'i64',
                kind: node_1.CompletionItemKind.TypeParameter,
                detail: 'Signed 64-bit integer',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**Signed 64-bit integer**\n\nRange: -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807\nSize: 8 bytes'
                }
            },
            {
                label: 'u8',
                kind: node_1.CompletionItemKind.TypeParameter,
                detail: 'Unsigned 8-bit integer (0 to 255)',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**Unsigned 8-bit integer**\n\nRange: 0 to 255\nSize: 1 byte'
                }
            },
            {
                label: 'u16',
                kind: node_1.CompletionItemKind.TypeParameter,
                detail: 'Unsigned 16-bit integer (0 to 65,535)',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**Unsigned 16-bit integer**\n\nRange: 0 to 65,535\nSize: 2 bytes'
                }
            },
            {
                label: 'u32',
                kind: node_1.CompletionItemKind.TypeParameter,
                detail: 'Unsigned 32-bit integer (0 to 4,294,967,295)',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**Unsigned 32-bit integer**\n\nRange: 0 to 4,294,967,295\nSize: 4 bytes'
                }
            },
            {
                label: 'u64',
                kind: node_1.CompletionItemKind.TypeParameter,
                detail: 'Unsigned 64-bit integer',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**Unsigned 64-bit integer**\n\nRange: 0 to 18,446,744,073,709,551,615\nSize: 8 bytes'
                }
            },
            // Floating-point types
            {
                label: 'f8',
                kind: node_1.CompletionItemKind.TypeParameter,
                detail: '8-bit floating-point number',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**8-bit floating-point**\n\nLimited precision floating-point number\nSize: 1 byte'
                }
            },
            {
                label: 'f16',
                kind: node_1.CompletionItemKind.TypeParameter,
                detail: '16-bit floating-point number',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**16-bit floating-point**\n\nHalf-precision floating-point number\nSize: 2 bytes'
                }
            },
            {
                label: 'f32',
                kind: node_1.CompletionItemKind.TypeParameter,
                detail: '32-bit floating-point number',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**32-bit floating-point**\n\nSingle-precision floating-point number\nSize: 4 bytes'
                }
            },
            {
                label: 'f64',
                kind: node_1.CompletionItemKind.TypeParameter,
                detail: '64-bit floating-point number',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**64-bit floating-point**\n\nDouble-precision floating-point number\nSize: 8 bytes'
                }
            },
            // Special types
            {
                label: 'num',
                kind: node_1.CompletionItemKind.TypeParameter,
                detail: 'Dynamic number type',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**Dynamic number type**\n\nCan hold any numeric value (integer or floating-point)\nAutomatically adapts to the value assigned'
                }
            },
            {
                label: 'bool',
                kind: node_1.CompletionItemKind.TypeParameter,
                detail: 'Boolean type (true/false)',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**Boolean type**\n\nCan hold either `true` or `false`\nSize: 1 byte'
                }
            },
            {
                label: 'char',
                kind: node_1.CompletionItemKind.TypeParameter,
                detail: 'Character type',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**Character type**\n\nHolds a single ASCII character\nSize: 1 byte'
                }
            },
            {
                label: 'str',
                kind: node_1.CompletionItemKind.TypeParameter,
                detail: 'String type',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**String type**\n\nHolds a sequence of characters\nVariable size'
                }
            },
            {
                label: 'void',
                kind: node_1.CompletionItemKind.TypeParameter,
                detail: 'Void type (no value)',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**Void type**\n\nRepresents no value\nUsed for functions that do not return anything'
                }
            }
        ];
        // Built-in functions
        this.builtinFunctions = [
            {
                label: 'print',
                kind: node_1.CompletionItemKind.Function,
                detail: 'print(format: str, ...): void',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**Universal print function**\n\nPrints formatted output to console\n\n**Format specifiers:**\n- `%d` - signed integers\n- `%u` - unsigned integers\n- `%ld` - 64-bit signed integers\n- `%lu` - 64-bit unsigned integers\n- `%f` - floating-point numbers\n- `%t` - boolean values\n- `%c` - characters\n\n```aelang\nprint("Hello, world!\\n");\nprint("Number: %d\\n", 42);\nprint("Float: %f\\n", 3.14);\n```'
                },
                insertText: 'print("${1:format}"${2:, ${3:args}});',
                insertTextFormat: node_1.InsertTextFormat.Snippet
            },
            {
                label: 'read',
                kind: node_1.CompletionItemKind.Function,
                detail: 'read(): num',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**Universal read function**\n\nReads user input and returns as num type\n\n```aelang\nlet value: num = read();\n```'
                },
                insertText: 'read()',
                insertTextFormat: node_1.InsertTextFormat.PlainText
            },
            // Legacy functions
            {
                label: 'print_int',
                kind: node_1.CompletionItemKind.Function,
                detail: 'print_int(value: i32): void',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**Legacy integer print function**\n\nPrints an integer value\n\n```aelang\nprint_int(42);\n```'
                },
                insertText: 'print_int(${1:value});',
                insertTextFormat: node_1.InsertTextFormat.Snippet
            },
            {
                label: 'print_float',
                kind: node_1.CompletionItemKind.Function,
                detail: 'print_float(value: f32): void',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**Legacy float print function**\n\nPrints a floating-point value\n\n```aelang\nprint_float(3.14);\n```'
                },
                insertText: 'print_float(${1:value});',
                insertTextFormat: node_1.InsertTextFormat.Snippet
            },
            {
                label: 'print_str',
                kind: node_1.CompletionItemKind.Function,
                detail: 'print_str(value: str): void',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**Legacy string print function**\n\nPrints a string value\n\n```aelang\nprint_str("Hello");\n```'
                },
                insertText: 'print_str("${1:text}");',
                insertTextFormat: node_1.InsertTextFormat.Snippet
            },
            {
                label: 'print_bool',
                kind: node_1.CompletionItemKind.Function,
                detail: 'print_bool(value: bool): void',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**Legacy boolean print function**\n\nPrints a boolean value\n\n```aelang\nprint_bool(true);\n```'
                },
                insertText: 'print_bool(${1:value});',
                insertTextFormat: node_1.InsertTextFormat.Snippet
            },
            {
                label: 'read_int',
                kind: node_1.CompletionItemKind.Function,
                detail: 'read_int(): i32',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**Legacy integer read function**\n\nReads an integer from user input\n\n```aelang\nlet value: i32 = read_int();\n```'
                },
                insertText: 'read_int()',
                insertTextFormat: node_1.InsertTextFormat.PlainText
            },
            {
                label: 'read_float',
                kind: node_1.CompletionItemKind.Function,
                detail: 'read_float(): f32',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**Legacy float read function**\n\nReads a floating-point number from user input\n\n```aelang\nlet value: f32 = read_float();\n```'
                },
                insertText: 'read_float()',
                insertTextFormat: node_1.InsertTextFormat.PlainText
            },
            {
                label: 'read_num',
                kind: node_1.CompletionItemKind.Function,
                detail: 'read_num(): num',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**Legacy num read function**\n\nReads a number from user input\n\n```aelang\nlet value: num = read_num();\n```'
                },
                insertText: 'read_num()',
                insertTextFormat: node_1.InsertTextFormat.PlainText
            },
            {
                label: 'read_bool',
                kind: node_1.CompletionItemKind.Function,
                detail: 'read_bool(): bool',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**Legacy boolean read function**\n\nReads a boolean from user input\n\n```aelang\nlet value: bool = read_bool();\n```'
                },
                insertText: 'read_bool()',
                insertTextFormat: node_1.InsertTextFormat.PlainText
            },
            {
                label: 'read_char',
                kind: node_1.CompletionItemKind.Function,
                detail: 'read_char(): char',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**Legacy character read function**\n\nReads a character from user input\n\n```aelang\nlet value: char = read_char();\n```'
                },
                insertText: 'read_char()',
                insertTextFormat: node_1.InsertTextFormat.PlainText
            }
        ];
        // Boolean literals
        this.literals = [
            {
                label: 'true',
                kind: node_1.CompletionItemKind.Constant,
                detail: 'Boolean true value',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**Boolean true literal**\n\nRepresents the boolean value true'
                }
            },
            {
                label: 'false',
                kind: node_1.CompletionItemKind.Constant,
                detail: 'Boolean false value',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**Boolean false literal**\n\nRepresents the boolean value false'
                }
            },
            {
                label: 'null',
                kind: node_1.CompletionItemKind.Constant,
                detail: 'Null value',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**Null literal**\n\nRepresents a null or empty value'
                }
            }
        ];
        // Operators
        this.operators = [
            {
                label: '==',
                kind: node_1.CompletionItemKind.Operator,
                detail: 'Equality operator',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**Equality comparison**\n\nChecks if two values are equal\n\n```aelang\nif (a == b) { ... }\n```'
                }
            },
            {
                label: '!=',
                kind: node_1.CompletionItemKind.Operator,
                detail: 'Inequality operator',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**Inequality comparison**\n\nChecks if two values are not equal\n\n```aelang\nif (a != b) { ... }\n```'
                }
            },
            {
                label: '<=',
                kind: node_1.CompletionItemKind.Operator,
                detail: 'Less than or equal operator',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**Less than or equal comparison**\n\nChecks if left value is less than or equal to right value\n\n```aelang\nif (a <= b) { ... }\n```'
                }
            },
            {
                label: '>=',
                kind: node_1.CompletionItemKind.Operator,
                detail: 'Greater than or equal operator',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**Greater than or equal comparison**\n\nChecks if left value is greater than or equal to right value\n\n```aelang\nif (a >= b) { ... }\n```'
                }
            },
            {
                label: '&&',
                kind: node_1.CompletionItemKind.Operator,
                detail: 'Logical AND operator',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**Logical AND**\n\nReturns true if both operands are true\n\n```aelang\nif (a && b) { ... }\n```'
                }
            },
            {
                label: '||',
                kind: node_1.CompletionItemKind.Operator,
                detail: 'Logical OR operator',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: '**Logical OR**\n\nReturns true if either operand is true\n\n```aelang\nif (a || b) { ... }\n```'
                }
            }
        ];
    }
    provideCompletions(document, position) {
        const text = document.getText();
        const offset = document.offsetAt(position);
        const lineText = document.getText({
            start: { line: position.line, character: 0 },
            end: position
        });
        const completions = [];
        // Context-aware completions
        if (this.isInTypeContext(lineText)) {
            // Provide type completions
            completions.push(...this.types);
        }
        else if (this.isInFunctionCallContext(lineText)) {
            // Provide function completions
            completions.push(...this.builtinFunctions);
        }
        else {
            // Provide all completions
            completions.push(...this.keywords, ...this.types, ...this.builtinFunctions, ...this.literals, ...this.operators);
        }
        // Add snippet completions
        completions.push(...this.getSnippetCompletions());
        return completions;
    }
    resolveCompletion(item) {
        // Add additional information to completion items
        return item;
    }
    provideSignatureHelp(document, position) {
        const text = document.getText();
        const offset = document.offsetAt(position);
        // Find the function call context
        const functionContext = this.findFunctionCallContext(text, offset);
        if (!functionContext) {
            return undefined;
        }
        const signatures = [];
        // Add signature for built-in functions
        switch (functionContext.functionName) {
            case 'print':
                signatures.push({
                    label: 'print(format: str, ...args): void',
                    documentation: {
                        kind: node_1.MarkupKind.Markdown,
                        value: 'Universal print function with format specifiers'
                    },
                    parameters: [
                        {
                            label: 'format: str',
                            documentation: 'Format string with specifiers (%d, %u, %ld, %lu, %f, %t, %c)'
                        },
                        {
                            label: '...args',
                            documentation: 'Arguments to be formatted'
                        }
                    ]
                });
                break;
            case 'read':
                signatures.push({
                    label: 'read(): num',
                    documentation: {
                        kind: node_1.MarkupKind.Markdown,
                        value: 'Reads user input as a number'
                    },
                    parameters: []
                });
                break;
            case 'print_int':
                signatures.push({
                    label: 'print_int(value: i32): void',
                    documentation: 'Prints an integer value',
                    parameters: [
                        {
                            label: 'value: i32',
                            documentation: 'The integer value to print'
                        }
                    ]
                });
                break;
            case 'print_float':
                signatures.push({
                    label: 'print_float(value: f32): void',
                    documentation: 'Prints a floating-point value',
                    parameters: [
                        {
                            label: 'value: f32',
                            documentation: 'The floating-point value to print'
                        }
                    ]
                });
                break;
            case 'print_str':
                signatures.push({
                    label: 'print_str(value: str): void',
                    documentation: 'Prints a string value',
                    parameters: [
                        {
                            label: 'value: str',
                            documentation: 'The string value to print'
                        }
                    ]
                });
                break;
        }
        if (signatures.length === 0) {
            return undefined;
        }
        return {
            signatures,
            activeSignature: 0,
            activeParameter: functionContext.parameterIndex
        };
    }
    isInTypeContext(lineText) {
        // Check if we're in a context where a type is expected
        return /:\s*$/.test(lineText) || /let\s+\w+\s*:\s*$/.test(lineText);
    }
    isInFunctionCallContext(lineText) {
        // Check if we're in a function call context
        return /\w+\s*\($/.test(lineText);
    }
    findFunctionCallContext(text, offset) {
        // Find the nearest opening parenthesis before the current position
        let parenDepth = 0;
        let functionStart = -1;
        for (let i = offset - 1; i >= 0; i--) {
            const char = text[i];
            if (char === ')') {
                parenDepth++;
            }
            else if (char === '(') {
                if (parenDepth === 0) {
                    functionStart = i;
                    break;
                }
                else {
                    parenDepth--;
                }
            }
        }
        if (functionStart === -1) {
            return null;
        }
        // Find the function name before the opening parenthesis
        let nameEnd = functionStart - 1;
        while (nameEnd >= 0 && /\s/.test(text[nameEnd])) {
            nameEnd--;
        }
        let nameStart = nameEnd;
        while (nameStart >= 0 && /\w/.test(text[nameStart])) {
            nameStart--;
        }
        const functionName = text.substring(nameStart + 1, nameEnd + 1);
        // Count the number of commas to determine parameter index
        let parameterIndex = 0;
        for (let i = functionStart + 1; i < offset; i++) {
            if (text[i] === ',') {
                parameterIndex++;
            }
        }
        return { functionName, parameterIndex };
    }
    getSnippetCompletions() {
        return [
            {
                label: 'main function',
                kind: node_1.CompletionItemKind.Snippet,
                detail: 'Main function template',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: 'Creates a main function template'
                },
                insertText: 'func main(): void {\n    ${0}\n}',
                insertTextFormat: node_1.InsertTextFormat.Snippet
            },
            {
                label: 'print statement',
                kind: node_1.CompletionItemKind.Snippet,
                detail: 'Print statement with newline',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: 'Creates a print statement with newline'
                },
                insertText: 'print("${1:message}\\n");',
                insertTextFormat: node_1.InsertTextFormat.Snippet
            },
            {
                label: 'variable declaration',
                kind: node_1.CompletionItemKind.Snippet,
                detail: 'Variable declaration with type and value',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: 'Creates a variable declaration'
                },
                insertText: 'let ${1:name}: ${2:type} = ${3:value};',
                insertTextFormat: node_1.InsertTextFormat.Snippet
            },
            {
                label: 'if-else statement',
                kind: node_1.CompletionItemKind.Snippet,
                detail: 'If-else statement template',
                documentation: {
                    kind: node_1.MarkupKind.Markdown,
                    value: 'Creates an if-else statement template'
                },
                insertText: 'if (${1:condition}) {\n    ${2}\n} else {\n    ${3}\n}',
                insertTextFormat: node_1.InsertTextFormat.Snippet
            }
        ];
    }
}
exports.AELangCompletionProvider = AELangCompletionProvider;
//# sourceMappingURL=completion.js.map