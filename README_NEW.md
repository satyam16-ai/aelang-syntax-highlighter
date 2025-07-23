# ÆLang Language Support for VS Code

**Complete IDE support for ÆLang with syntax highlighting, IntelliSense, diagnostics, and language server integration.**

## ✨ Features

### 🎨 **Advanced Syntax Highlighting**
- **Complete type system support**: All 15 ÆLang data types
  - Signed integers: `i8`, `i16`, `i32`, `i64`
  - Unsigned integers: `u8`, `u16`, `u32`, `u64`
  - Floating-point: `f8`, `f16`, `f32`, `f64`
  - Special types: `num`, `bool`, `char`, `str`, `void`
- **Format specifiers**: `%d`, `%u`, `%ld`, `%lu`, `%f`, `%t`, `%c`
- **Enhanced language constructs**: Functions, control flow, operators

### 🧠 **IntelliSense & Auto-completion**
- **Smart completions**: Context-aware suggestions for keywords, types, and functions
- **Parameter hints**: Real-time help during function calls
- **Type information**: Hover for detailed type and function documentation
- **Code snippets**: Pre-built templates for common patterns

### 🚨 **Real-time Diagnostics**
- **Syntax validation**: Immediate feedback on syntax errors
- **Type checking**: Comprehensive type validation
- **Semantic analysis**: Function calls, variable declarations, scope validation
- **Error highlighting**: Clear visual indicators with detailed messages

### 🔧 **Development Tools**
- **Go to Definition**: Quick navigation to symbol definitions
- **Find All References**: Locate all usages of variables and functions
- **Symbol Search**: Quickly find symbols across your project
- **Language Server**: Powered by a dedicated ÆLang Language Server Protocol implementation

## 🚀 Installation

### From VS Code Marketplace
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "ÆLang Language Support"
4. Click Install

### From VSIX File
1. Download the latest `.vsix` file from the releases
2. Open VS Code
3. Press `Ctrl+Shift+P` and run "Extensions: Install from VSIX..."
4. Select the downloaded `.vsix` file

## 📝 Usage

### File Association
- Open any `.ae` file and VS Code will automatically:
  - Apply ÆLang syntax highlighting
  - Start the language server
  - Enable IntelliSense features

### Commands
- **ÆLang: Restart Language Server** - Restart the language server if needed
- **ÆLang: Show Language Server Output** - View language server logs
- **ÆLang: Compile Current File** - Compile the currently open ÆLang file

### Status Bar
- **ÆLang LSP indicator**: Shows language server status
  - ✅ Green check: Language server is running
  - ❌ Red error: Language server failed to start

## ⚙️ Configuration

Access settings via `File > Preferences > Settings` and search for "ÆLang":

```json
{
  "aelang.languageServer.enabled": true,
  "aelang.languageServer.trace": "off",
  "aelang.completion.enabled": true,
  "aelang.diagnostics.enabled": true,
  "aelang.compiler.path": "aelang"
}
```

### Available Settings
- `aelang.languageServer.enabled`: Enable/disable the language server
- `aelang.languageServer.trace`: Set trace level (off/messages/verbose)
- `aelang.completion.enabled`: Enable/disable auto-completion
- `aelang.diagnostics.enabled`: Enable/disable real-time diagnostics
- `aelang.compiler.path`: Path to the ÆLang compiler executable

## 📚 ÆLang Language Overview

### Data Types
```aelang
// Integer types
let small: i8 = -128;
let big: u64 = 18446744073709551615;

// Floating-point types
let precise: f64 = 3.141592653589793;
let compact: f8 = 3.14;

// Special types
let dynamic: num = 42.5;    // Dynamic number type
let flag: bool = true;      // Boolean
let letter: char = 'A';     // Character
let text: str = "Hello";    // String
```

### Functions and I/O
```aelang
// Universal print with format specifiers
print("Value: %d, Float: %f, Bool: %t\n", 42, 3.14, true);

// Input functions
let input: num = read();
let number: i32 = read_int();

// Function declarations
func calculate(a: i32, b: i32): i32 {
    return a + b;
}

// External declarations
extern malloc(size: u64): void;
```

### Control Flow
```aelang
// Conditional statements
if (value > 0) {
    print("Positive\n");
} else {
    print("Non-positive\n");
}

// Loops
for (let i: i32 = 0; i < 10; i = i + 1) {
    print("Count: %d\n", i);
}

while (condition) {
    // Loop body
}
```

## 🏗️ Architecture

### Language Server Features
- **Parser**: Complete ÆLang grammar implementation with AST generation
- **Semantic Analyzer**: Type checking and symbol resolution
- **Completion Provider**: Context-aware IntelliSense
- **Diagnostics Engine**: Real-time error detection
- **Symbol Table**: Cross-reference and navigation support

### Extension Components
- **Syntax Highlighter**: TextMate grammar for visual highlighting
- **Language Client**: VS Code extension that connects to the language server
- **Icon Theme**: Custom file icons for ÆLang files
- **Configuration**: User-customizable settings

## 🔧 Development

### Prerequisites
- Node.js 16.0.0 or higher
- VS Code 1.101.0 or higher
- TypeScript compiler

### Building from Source
```bash
# Clone the repository
git clone https://github.com/satyam/aelang-vscode-extension.git
cd aelang-vscode-extension

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Package the extension
npx vsce package
```

### Language Server
The extension includes a dedicated Language Server Protocol implementation located in the `language_server` directory. To build and test the language server separately:

```bash
cd language_server
npm install
npm run build
./test.sh
```

## 🐛 Troubleshooting

### Language Server Issues
1. **Server not starting**: Check the output panel ("ÆLang Language Server")
2. **Missing features**: Ensure `aelang.languageServer.enabled` is `true`
3. **Performance issues**: Try restarting with "ÆLang: Restart Language Server"

### Common Solutions
- **Restart VS Code**: Sometimes needed after initial installation
- **Check file extension**: Ensure files use `.ae` extension
- **Verify settings**: Check ÆLang configuration in VS Code settings

### Getting Help
- **Output Panel**: View "ÆLang Language Server" for detailed logs
- **Developer Tools**: Enable trace mode for debugging
- **GitHub Issues**: Report bugs and request features

## 📋 Changelog

### Version 0.3.0
- ✅ **Language Server Integration**: Complete LSP implementation
- ✅ **IntelliSense**: Auto-completion and parameter hints
- ✅ **Real-time Diagnostics**: Syntax and semantic error checking
- ✅ **Hover Information**: Rich documentation tooltips
- ✅ **Go to Definition**: Symbol navigation
- ✅ **Commands**: Compiler integration and server management

### Version 0.2.0
- ✅ **Complete Type System**: All 15 ÆLang data types
- ✅ **Format Specifiers**: Enhanced print function support
- ✅ **Improved Highlighting**: Better syntax recognition

### Version 0.1.0
- ✅ **Initial Release**: Basic syntax highlighting
- ✅ **File Association**: `.ae` file support
- ✅ **Icon Theme**: Custom ÆLang file icons

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This extension is released under the MIT License. See the LICENSE file for details.

## 🔗 Related Projects

- **[ÆLang Compiler](https://github.com/satyam/aelang-compiler)**: The core ÆLang compiler
- **[ÆLang Examples](https://github.com/satyam/aelang-examples)**: Sample programs and tutorials
- **[ÆLang Documentation](https://github.com/satyam/aelang-docs)**: Complete language reference

---

**Enjoy coding with ÆLang! 🚀**
