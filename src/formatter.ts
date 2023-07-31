import {
  Uri,
  DiagnosticCollection,
  TextDocument,
  TextEdit,
  Diagnostic,
  Range,
  Position,
  workspace,
} from 'vscode';
import * as prettier from 'prettier';
import * as LiquidPrettierPlugin from '@shopify/prettier-plugin-liquid/standalone';
import { LiquidHTMLASTParsingError } from '@shopify/prettier-plugin-liquid/dist/parser/errors';

export default class LiquidFormatter {
  constructor(
    public diagnosticCollection: DiagnosticCollection,
    public diagnosticTextDocumentVersion: Map<Uri, number>,
  ) {}

  async provideDocumentFormattingEdits(
    textDocument: TextDocument,
  ): Promise<TextEdit[] | null> {
    try {
      const textEdits = [await toTextEdit(textDocument)];

      // We clear previous parsing errors if successful this time
      if (this.diagnosticCollection.has(textDocument.uri)) {
        this.diagnosticCollection.delete(textDocument.uri);
        this.diagnosticTextDocumentVersion.delete(textDocument.uri);
      }

      return textEdits;
    } catch (err: any) {
      // Present the LiquidHTMLParsingError as an error in the Problems tab
      if (
        !!err &&
        'name' in err &&
        'loc' in err &&
        err.name === 'LiquidHTMLParsingError'
      ) {
        const diagnostic = toDiagnostic(err as LiquidHTMLASTParsingError);
        if (diagnostic) {
          this.diagnosticCollection.set(textDocument.uri, [diagnostic]);
          this.diagnosticTextDocumentVersion.set(
            textDocument.uri,
            textDocument.version,
          );
        }
      }

      return null;
    }
  }
}

async function toTextEdit(textDocument: TextDocument): Promise<TextEdit> {
  const useProjectPrettierConfig = workspace
    .getConfiguration('shopifyLiquid')
    .get('useProjectPrettierConfig');

  const options = await prettier.resolveConfig(textDocument.uri.fsPath);
  const text = textDocument.getText();

  let prettierOptions: prettier.Options = {};
  if (useProjectPrettierConfig) {
    prettierOptions = options || {};

    // if use prettier auto plugin
    prettierOptions.plugins = prettierOptions.plugins?.map((item) => {
      if (typeof item === 'string') {
        const workspaceFolder = workspace.getWorkspaceFolder(textDocument.uri);
        if (workspaceFolder) {
          const moduleAbsoluteUri = Uri.joinPath(
            workspaceFolder?.uri,
            `node_modules/${item}`,
          );
          return moduleAbsoluteUri.path;
        }
      }
      return item;
    });
    prettierOptions.parser = 'liquid-html';
  } else {
    prettierOptions = {
      ...options,
      parser: 'liquid-html',
      plugins: [LiquidPrettierPlugin],
    };
  }

  let formatted = text;

  try {
    formatted = prettier.format(text, prettierOptions);
  } catch (e) {
    console.error('formatter error', e);
  }

  const start = textDocument.positionAt(0);
  const end = textDocument.positionAt(text.length);
  return TextEdit.replace(new Range(start, end), formatted);
}

function toDiagnostic(err: LiquidHTMLASTParsingError): Diagnostic | undefined {
  if (!err.loc) {
    return undefined;
  }
  const { start, end } = err.loc!;
  const errorMessage = err.message.split('\n')[0];
  const diagnostic = new Diagnostic(
    new Range(
      new Position(start.line - 1, start.column),
      new Position(end.line - 1, end.column),
    ),
    errorMessage,
  );
  diagnostic.source = 'prettier-plugin-liquid';
  diagnostic.code = err.name;
  return diagnostic;
}
