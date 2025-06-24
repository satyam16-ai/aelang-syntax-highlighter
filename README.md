# ÆLang Language Support for VS Code

This extension provides syntax highlighting and language support for **ÆLang** - a systems programming language designed for OS development.

## Features

- **Syntax Highlighting**: Full syntax highlighting for ÆLang keywords, types, operators, and constructs
- **Language Support**: Proper bracket matching, auto-indentation, and code folding
- **File Association**: Automatic recognition of `.ae` files
- **OS Development Focus**: Optimized for systems programming and kernel development workflows

## ÆLang Language Features

### Keywords
- **Control Flow**: `if`, `else`, `while`, `for`, `return`, `break`, `continue`
- **Declarations**: `let`, `func`, `extern`
- **Types**: `void`, `i32`, `f32`, `bool`, `str`

### Built-in Functions
- `print()` - String output
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
