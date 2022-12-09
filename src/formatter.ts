import * as vscode from 'vscode';
import * as prettier from 'prettier';
import * as LiquidPrettierPlugin from '@shopify/prettier-plugin-liquid/standalone';

export default class LiquidFormatter {
  async provideDocumentFormattingEdits(
    textDocument: vscode.TextDocument,
  ): Promise<vscode.TextEdit[] | null> {
    try {
      return [await toTextEdit(textDocument)];
    } catch (e) {
      return null;
    }
  }
}

async function toTextEdit(
  textDocument: vscode.TextDocument,
): Promise<vscode.TextEdit> {
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
  const end = textDocument.positionAt(text.length);
  return vscode.TextEdit.replace(
    new vscode.Range(start, end),
    formatted,
  );
}
