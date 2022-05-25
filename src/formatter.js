const vscode = require('vscode');
const prettier = require('prettier');
const LiquidPrettierPlugin = require('@shopify/prettier-plugin-liquid/standalone');

class LiquidFormatter {
  /**
   * @param {vscode.TextDocument} textDocument - the text doc
   * @returns {vscode.ProviderResult<vscode.TextEdit[]>}
   */
  async provideDocumentFormattingEdits(textDocument) {
    return [await toTextEdit(textDocument)];
  }
}

/**
 * @param {vscode.TextDocument} textDocument
 * @param {string} source
 * @returns {vscode.ProviderResult<vscode.TextEdit>}
 */
async function toTextEdit(textDocument) {
  const options = await prettier.resolveConfig(
    textDocument.uri.fsPath,
  );
  const text = textDocument.getText();
  const formatted = prettier.format(text, {
    ...options,
    parser: 'liquid-html',
    plugins: [LiquidPrettierPlugin],
  });
  const start = textDocument.positionAt(0);
  const end = textDocument.positionAt(text.length - 1);
  return vscode.TextEdit.replace(
    new vscode.Range(start, end),
    formatted,
  );
}

module.exports = LiquidFormatter;
