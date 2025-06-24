# Copilot Instructions for ÆLang VS Code Extension

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a VS Code extension project for ÆLang syntax highlighting. Please use the get_vscode_api with a query as input to fetch the latest VS Code API references.

## Project Context

This extension provides syntax highlighting and language support for ÆLang - a systems programming language designed for OS development.

## ÆLang Language Features to Support

- **Keywords**: `let`, `func`, `extern`, `void`, `i32`, `f32`, `if`, `else`, `while`, `for`, `return`
- **Built-in Functions**: `print`, `print_int`, `print_float`, `read_int`, `read_float`
- **Operators**: `+`, `-`, `*`, `/`, `=`, `==`, `!=`, `<`, `>`, `<=`, `>=`
- **Literals**: integers, floats, strings, booleans
- **Comments**: `//` for single-line comments
- **File Extension**: `.ae`

## Syntax Highlighting Goals

1. Keywords should be highlighted in blue/purple
2. Types (i32, f32) should be highlighted in green
3. Strings should be highlighted in orange/red
4. Numbers should be highlighted in blue
5. Comments should be highlighted in gray/green
6. Function names should be highlighted appropriately
7. Operators should have distinct highlighting

## Best Practices

- Follow VS Code extension development guidelines
- Use TextMate grammar rules for syntax highlighting
- Ensure proper language configuration for bracket matching, auto-indentation, etc.
- Test the extension thoroughly with ÆLang code samples
