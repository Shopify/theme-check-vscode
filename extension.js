const path = require('path');
const promisify = require('util').promisify;
const exec = promisify(require('child_process').exec);
const { workspace, window, ExtensionContext } = require('vscode');

const {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} = require('vscode-languageclient');

let client;

async function getThemeCheckExecutable() {
  const configurationValue = workspace
    .getConfiguration('themeCheck')
    .get('languageServerPath');
  if (configurationValue) return configurationValue;

  try {
    const { stdout } = await exec(
      'which theme-check-language-server',
    );
    return stdout.replace('\n', '');
  } catch (e) {
    window.showWarningMessage(
      `The 'theme-check-language-server' executable was not found on your $PATH. Was it installed? The path can also be changed via the "themeCheck.languageServerPath" setting.`,
    );
  }
}

async function activate(context) {
  const serverModule = await getThemeCheckExecutable();
  if (!serverModule) return;

  const serverOptions = {
    command: serverModule,
  };

  const clientOptions = {
    documentSelector: [
      { scheme: 'file', language: 'liquid' },
      { scheme: 'file', language: 'plaintext' },
    ],
  };

  client = new LanguageClient(
    'theme-check',
    'theme-check',
    serverOptions,
    clientOptions,
  );

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
};
