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
- `print_int()` - Integer output  
- `print_float()` - Float output
- `read_int()` - Integer input
- `read_float()` - Float input

### Operators
- **Arithmetic**: `+`, `-`, `*`, `/`, `%`
- **Comparison**: `==`, `!=`, `<`, `>`, `<=`, `>=`
- **Assignment**: `=`
- **Logical**: `&&`, `||`, `!`

## Usage

1. Install this extension in VS Code
2. Open or create a file with `.ae` extension
3. Start writing ÆLang code with full syntax highlighting

## Example Code

```aelang
// ÆLang Calculator Example
extern print_int(val: i32);
extern read_int();

func main(): void {
    print("Enter two numbers:");
    
    let a: i32 = read_int();
    let b: i32 = read_int();
    
    let sum: i32 = a + b;
    print("Sum: ");
    print_int(sum);
}
```

## Installation

### From VS Code Marketplace
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "ÆLang Language Support"
4. Click Install

### Manual Installation
1. Download the `.vsix` file
2. Open VS Code
3. Open Command Palette (Ctrl+Shift+P)
4. Run "Extensions: Install from VSIX..."
5. Select the downloaded file

## About ÆLang

**ÆLang** is a systems programming language specifically designed for Operating System Development. Key features include:

- **Direct Assembly Generation**: Pure NASM output with no runtime overhead
- **Minimal Dependencies**: Only requires assembler and linker
- **Bare-Metal Ready**: Can run without operating system
- **Zero-Cost Abstractions**: High-level syntax that compiles to optimal assembly
- **OS Development Focus**: Built for kernel development, bootloaders, and embedded systems

## Contributing

Found a bug or want to contribute? Please visit our [GitHub repository](https://github.com/satyam/aelang-vscode-extension).

## License

This extension is licensed under MIT License.

## Release Notes

### 0.0.1

- Initial release
- Basic syntax highlighting for ÆLang
- Language configuration for editing experience
- Support for all ÆLang keywords and constructs

---

**Created by Satyam** - Built for OS developers, by OS developers! 🔧⚡
