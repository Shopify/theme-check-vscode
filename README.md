<h1 align="center" style="position: relative;" >
  <br>
    <img src="https://github.com/Shopify/theme-check-vscode/blob/main/images/shopify_glyph.png?raw=true" alt="logo" width="150" height="160">
  <br>
  Shopify Liquid
  <br>
</h1>

<h4 align="center">A complete developer experience for Shopify themes</h4>

Official VS Code extension for [Shopify Liquid](https://shopify.dev/docs/themes) powered by [Theme Check][tc] the Liquid linter and language server for online store themes.

![](https://github.com/Shopify/theme-check-vscode/blob/feature/readme-revamp/images/demo.gif?raw=true)

[Features](#features) |  [Installation](#installation) | [Configuration](#configuration) | [📦 VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=shopify.theme-check-vscode).

## Features

- 🎨 Syntax highlighting
- 💧 Liquid language server ([Theme Check][tc])
  - 📗 Completions
  - ✅ Linting
  - 🔎 Go to source
- 📐 Automatic indentation
- 🎎 Auto closing pairs

## Installation

This VS Code extensions depends on the [Theme Check][tc] language server, which is bundled in the latest [Shopify CLI](https://shopify.dev/tools/cli).

To install the `shopify` CLI, follow these steps:

1. Go to https://shopify.dev/tools/cli/installation
2. Follow the instructions for your operating system

⚠️ **Note:** Windows not yet supported.

## Configuration

- `"shopifyLiquid.shopifyCLIPath": string`, (optional) a path to the `shopify` executable.
- `"shopifyLiquid.languageServerPath": string`, (optional) a path to the `theme-check-language-server` executable.

[tc]: https://github.com/Shopify/theme-check

## Credits

- Syntax highlighting from [siteleaf/liquid-syntax-mode](https://github.com/siteleaf/liquid-syntax-mode)
