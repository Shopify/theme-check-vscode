const promisify = require('util').promisify;
const exec = promisify(require('child_process').exec);
const vscode = require('vscode');
const { LanguageClient } = require('vscode-languageclient');
const LiquidFormatter = require('./formatter').default;

/**
 * @type vscode.DocumentFilter[]
 **/
const LIQUID = [
  {
    language: 'liquid',
    scheme: 'file',
  },
  {
    language: 'liquid',
    scheme: 'untitled',
  }
];

class CommandNotFoundError extends Error {}

const isWin = process.platform === 'win32';
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

let client;
let context;

function getConfig(path) {
  const [namespace, key] = path.split('.');
  return vscode.workspace.getConfiguration(namespace).get(key);
}

/**
 * @param {vscode.ExtensionContext} extensionContext
 */
async function activate(extensionContext) {
  context = extensionContext;

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'shopifyLiquid.restart',
      restartServer,
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand('shopifyLiquid.runChecks', () =>
      client.sendRequest('workspace/executeCommand', {
        command: 'runChecks',
      }),
    ),
  );

  restartFormattingEditProvider();

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
    context = undefined;
    client = undefined;
  }
}

async function restartServer() {
  if (client) await stopServer();
  await startServer();
}

let formattingProvider

async function restartFormattingEditProvider() {
  if (formattingProvider) {
    formattingProvider.dispose();
    formattingProvider = null;
  }

  if (!formattingProvider) {
    formattingProvider =
      vscode.languages.registerDocumentFormattingEditProvider(
        LIQUID,
        new LiquidFormatter(),
      );
    context.subscriptions.push(formattingProvider);
  }
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

let hasShownWarning = false;
async function getServerOptions() {
  const disableWarning = getConfig(
    'shopifyLiquid.disableWindowsWarning',
  );
  if (!disableWarning && isWin && !hasShownWarning) {
    hasShownWarning = true;
    vscode.window.showWarningMessage(
      'Shopify Liquid support on Windows is experimental. Please report any issue.',
    );
  }
  const themeCheckPath = getConfig(
    'shopifyLiquid.languageServerPath',
  );
  const shopifyCLIPath = getConfig('shopifyLiquid.shopifyCLIPath');

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
    } else {
      if (isWin) {
        vscode.window.showWarningMessage(
          `The 'theme-check-language-server' executable was not found on your $PATH. Was it installed? The path can also be changed via the "shopifyLiquid.languageServerPath" setting.`,
        );
      } else {
        console.error(e);
        vscode.window.showWarningMessage(
          `The 'shopify' executable was not found on your $PATH. Was it installed? The path can also be changed via the "shopifyLiquid.shopifyCLIPath" setting.`,
        );
      }
    }
  }
}

async function which(command) {
  if (isWin) {
    const { stdout } = await exec(`where.exe ${command}`);
    const executables = stdout
      .replace(/\r/g, '')
      .split('\n')
      .filter((exe) => exe.endsWith('bat'));
    return executables.length > 0 && executables[0];
  } else {
    const { stdout } = await exec(`which ${command}`);
    return stdout.split('\n')[0].replace('\r', '');
  }
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
  if (isWin) return;
  return {
    command,
    args: ['theme', 'language-server'],
  };
}

async function themeCheckExecutable(command) {
  await commandExists(command);
  return {
    command,
  };
}

async function commandExists(command) {
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
