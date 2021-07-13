const promisify = require('util').promisify;
const exec = promisify(require('child_process').exec);
const vscode = require('vscode');

const { LanguageClient } = require('vscode-languageclient');

class CommandNotFoundError extends Error {}
class IncompatibleVersionError extends Error {}

const isWin = process.platform === 'win32';
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

let client;

async function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'shopifyLiquid.restart',
      restartServer,
    ),
  );
  vscode.workspace.onDidChangeConfiguration(onConfigChange);
  await startServer();
}

function deactivate() {
  return stopServer();
}

async function startServer() {
  const serverOptions = await getServerOptions();
  console.info(
    'shopify.theme-check-vscode: Server options %s',
    JSON.stringify(serverOptions, null, 2),
  );
  if (!serverOptions) return;

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
    'shopifyLiquid',
    'Theme Check Language Server',
    serverOptions,
    clientOptions,
  );

  client.start();
}

async function stopServer() {
  try {
    if (client) await Promise.race([client.stop(), sleep(1000)]);
  } catch (e) {
    console.error(e);
  } finally {
    client = undefined;
  }
}

async function restartServer() {
  if (client) await stopServer();
  await startServer();
}

function onConfigChange(event) {
  const didChangeThemeCheck = event.affectsConfiguration(
    'shopifyLiquid.languageServerPath',
  );
  const didChangeShopifyCLI = event.affectsConfiguration(
    'shopifyLiquid.shopifyCLIPath',
  );
  if (didChangeThemeCheck || didChangeShopifyCLI) {
    restartServer();
  }
}

async function getServerOptions() {
  const themeCheckPath = vscode.workspace
    .getConfiguration('shopifyLiquid')
    .get('languageServerPath');
  const shopifyCLIPath = vscode.workspace
    .getConfiguration('shopifyLiquid')
    .get('shopifyCLIPath');

  try {
    const executable =
      (shopifyCLIPath &&
        (await shopifyCLIExecutable(shopifyCLIPath))) ||
      (themeCheckPath &&
        (await themeCheckExecutable(themeCheckPath))) ||
      (await getShopifyCLIExecutable()) ||
      (await getThemeCheckExecutable());
    if (!executable) throw new Error('No executable found');
    return executable;
  } catch (e) {
    if (e instanceof CommandNotFoundError) {
      vscode.window.showErrorMessage(e.message);
    } else if (e instanceof IncompatibleVersionError) {
      vscode.window.showErrorMessage(
        `The shopify CLI must be of version >= 2.`,
      );
    } else {
      vscode.window.showWarningMessage(
        `The 'shopify' executable was not found on your $PATH. Was it installed? The path can also be changed via the "shopifyLiquid.shopifyCLIPath" setting.`,
      );
    }
  }
}

async function which(command) {
  const whichCmd = isWin ? 'where' : 'which';
  const { stdout } = await exec(`${whichCmd} ${command}`);
  return stdout.split('\n')[0].replace('\r', '');
}

async function getShopifyCLIExecutable() {
  try {
    const path = await which('shopify');
    return shopifyCLIExecutable(path);
  } catch (e) {
    return undefined;
  }
}

async function getThemeCheckExecutable() {
  try {
    const path = await which('theme-check-language-server');
    return themeCheckExecutable(path);
  } catch (e) {
    return undefined;
  }
}

async function shopifyCLIExecutable(command) {
  await shopifyCLIIsAtLeastVersion2(command);
  return {
    command,
    args: ['theme', 'language-server'],
  };
}

async function themeCheckExecutable(command) {
  await themeCheckExecutableExists(command);
  return {
    command,
  };
}

async function shopifyCLIIsAtLeastVersion2(command) {
  try {
    const { stdout: version } = await exec(`${command} version`);
    const major = /(?<major>^\d+\.)/.exec(version)?.groups?.major;
    const isAtLeastVersion2 =
      Boolean(major) && parseInt(major, 10) >= 2;
    if (!isAtLeastVersion2) throw new IncompatibleVersionError();
  } catch (e) {
    if (/No such file or directory/.test(e.message)) {
      throw new CommandNotFoundError(
        `${command} not found, are you sure this is the correct path?`,
      );
    } else {
      throw e;
    }
  }
}

async function themeCheckExecutableExists(command) {
  try {
    !isWin && (await exec(`[[ -f "${command}" ]]`));
  } catch (e) {
    throw new CommandNotFoundError(
      `${command} not found, are you sure this is the correct path?`,
    );
  }
}

module.exports = {
  activate,
  deactivate,
};
