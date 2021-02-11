const path = require('path');
const promisify = require('util').promisify;
const exec = promisify(require('child_process').exec);
const vscode = require('vscode');

const {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} = require('vscode-languageclient');

let client;

async function getThemeCheckExecutable() {
  const configurationValue = vscode.workspace
    .getConfiguration('themeCheck')
    .get('languageServerPath');
  if (configurationValue) return configurationValue;

  try {
    const { stdout } = await exec(
      'which theme-check-language-server',
    );
    return stdout.replace('\n', '');
  } catch (e) {
    vscode.window.showWarningMessage(
      `The 'theme-check-language-server' executable was not found on your $PATH. Was it installed? The path can also be changed via the "themeCheck.languageServerPath" setting.`,
    );
  }
}

async function startServer() {
  const serverModule = await getThemeCheckExecutable();
  console.log('Server Module %s', serverModule);
  if (!serverModule) return;

  const serverOptions = {
    command: serverModule,
  };

  const clientOptions = {
    documentSelector: [
      { scheme: 'file', language: 'liquid' },
      { scheme: 'file', language: 'plaintext' },
      { scheme: 'file', language: 'html' },
      { scheme: 'file', language: 'javascript' },
      { scheme: 'file', language: 'css' },
      { scheme: 'file', language: 'scss' },
      { scheme: 'file', language: 'json' },
    ],
  };

  client = new LanguageClient(
    'theme-check',
    'Theme Check Language Server',
    serverOptions,
    clientOptions,
  );

  client.start();
}

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function stopServer() {
  if (client) await Promise.race([client.stop(), sleep(1000)]);
  client = undefined;
}

async function restartServer() {
  if (client) await stopServer();
  await startServer();
}

function onConfigChange(event) {
  if (event.affectsConfiguration('themeCheck.languageServerPath')) {
    restartServer();
  }
}

async function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'themeCheck.restart',
      restartServer,
    ),
  );
  vscode.workspace.onDidChangeConfiguration(onConfigChange);
  await startServer();
}

function deactivate() {
  return stopServer();
}

module.exports = {
  activate,
  deactivate,
};
