<h1 align="center" style="position: relative;" >
  <br>
    <img src="https://github.com/Shopify/theme-check-vscode/blob/master/shopify_glyph.png?raw=true" alt="logo" width="150" height="160">
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

This VS Code extensions depends on [Theme Check][tc]. It is installed separately through Homebrew _or_ RubyGems.

**Homebrew**

You’ll need to run `brew tap` first to add Shopify’s third-party repositories to Homebrew.

```sh
brew tap shopify/shopify
brew install theme-check
```

**RubyGems**

```sh
gem install theme-check
```

⚠️ **Note:** Windows not yet supported.

## Configuration

- `"themeCheck.languageServerPath": string`, (optional) a path to the `theme-check-language-server` executable.

[tc]: https://github.com/Shopify/theme-check

## Credits

- Syntax highlighting from [siteleaf/liquid-syntax-mode](https://github.com/siteleaf/liquid-syntax-mode)
