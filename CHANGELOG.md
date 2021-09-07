
1.1.4 / 2021-08-23
==================

  * Fix the where command for Windows (select the .bat file)

1.1.3 / 2021-08-23
==================

  * Add Windows experimental warning in editor
  * Disable `shopify theme language-server` on Windows until we fix the upstream bug (See ([#42](https://github.com/shopify/theme-check-vscode/issues/42)))

1.1.2 / 2021-08-16
==================

  * Put Windows warning on README.
  * Bump path-parse from 1.0.6 to 1.0.7

1.1.0 / 2021-07-15
==================

  * Add Windows support

1.0.0 / 2021-06-29
==================

  * v1.0.0
  * Add Shopify CLI as recommended installation method

0.3.2 / 2021-06-29
==================

  * Rename from Theme Check -> Shopify Liquid
  * Add Syntax Highlighting
  * Add fancy README

0.2.0 / 2021-03-15
==================

  * Add Language Configuration
    * Auto closing `{%`, `{{`, `{%-`, `{{-`, `<`, ...
    * Indentation rules
    * Block comment with `{% comment %}` `{% endcomment %}`
  * Upgrade `vscode-languageclient` to v7.0.0 to support link to diagnostic documentation

0.1.5 / 2021-02-11
==================

  * Add onDidChangeConfiguration handler
  * Add restart server command
  * Fix links in README

0.1.4 / 2021-01-28
==================

  * Listen to changes in json files (for translations)
  * Fixup typo in config

0.1.2 / 2021-01-22
==================

  * Change activationEvent to onStartupFinished. :crossed_fingers:

0.1.1 / 2021-01-22
==================

  * Fix issue with vsix package on the VS Code Marketplace.
