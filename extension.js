const path = require('path');
const promisify = require('util').promisify;
const exec = promisify(require('child_process').exec);
const { workspace, ExtensionContext } = require('vscode');

const {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} = require('vscode-languageclient');

let client;

async function getThemeCheckExecutable() {
  const { stdout: themeCheckRoot } = await exec(`/opt/dev/bin/dev project-path theme-check | tr -d '\\n'`)
  return path.join(themeCheckRoot, 'bin', 'liquid-server');
}

async function activate(context) {
  // The server is implemented in node
  let serverModule = await getThemeCheckExecutable();

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  let serverOptions = {
    command: serverModule,
  };

  // Options to control the language client
  let clientOptions = {
    // Register the server for plain text documents
    documentSelector: [
      { scheme: 'file', language: 'liquid' },
      { scheme: 'file', language: 'plaintext' }
    ],
  };

  // Create the language client and start the client.
  client = new LanguageClient(
    'theme-check',
    'theme-check',
    serverOptions,
    clientOptions,
  );

  // Start the client. This will also launch the server
  client.start();
}

function deactivate() {
  if (!client) {
    return undefined;
  }
  return client.stop();
}

module.exports = {
	activate,
	deactivate,
}
