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

const COMMAND_LOCATE_UNIX = 'which';
const COMMAND_LOCATE_WIN = 'where.exe';

let client;

async function getThemeCheckExecutable() {
  const configurationValue = vscode.workspace
    .getConfiguration('themeCheck')
    .get('languageServerPath');
  if (configurationValue) return configurationValue;

  const cmdResults = await Promise.all([
    COMMAND_LOCATE_UNIX,
    COMMAND_LOCATE_WIN
  ].map(async cmd => {
    try {
      const { stdout } = await exec(`${cmd} theme-check-language-server`);
      return stdout;
    } catch (e) {
      return null;
    }
  }));

  // Find any result
  const themeCheckPath = cmdResults.find(result => result && result.length);
  if(!themeCheckPath) {
    vscode.window.showWarningMessage(
      `The 'theme-check-language-server' executable was not found on your $PATH. Was it installed? The path can also be changed via the "themeCheck.languageServerPath" setting.`,
    );
    return;
  }

  // Clean up the path before returning result.
  return themeCheckPath
    .split('\n')
    .map(n => n.trim())
    .find(n => n && n.length)
  ;
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
  try {
    if (client) await Promise.race([client.stop(), sleep(1000)]);
  } catch (e) {
    console.error(e)
  } finally {
    client = undefined;
  }
}

async function restartServer() {
  if (client) await stopServer();
  await startServer();
}
/** */

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
