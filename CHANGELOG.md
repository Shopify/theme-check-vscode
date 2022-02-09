
1.3.4 / 2022-02-09
==================

  * Fixup highlighting of raw and comment tags inside injections

1.3.3 / 2022-02-08
==================

  * Fixup highlighting of liquid tag comment blocks

1.3.2 / 2022-02-04
==================

  * Fixup bracket coloring inside embedded languages [#67](https://github.com/shopify/theme-check-vscode/issues/67)

1.3.1 / 2022-02-04
==================

  * Fix annoying `{%--%} %}` autoclose issue ([#65](https://github.com/shopify/theme-check-vscode/issues/65))
  * Add support for `editor.bracketPairColorization.enabled` ([#62](https://github.com/shopify/theme-check-vscode/issues/62))

1.3.0 / 2022-02-01
==================

  * Syntax highlighting overhaul ([#61](https://github.com/shopify/theme-check-vscode/issues/61))

1.2.0 / 2021-12-01
==================

  * Overdue updates
    - Document new LanguageServer configurations.
    - Add way to opt out of annoying Windows warning.
    - Improve the `activationEvents` (only folders with .theme-check.yml or onLanguage:liquid will start the extension)
    - Add new "Shopify Theme Check: Run checks" command to manually run checks (for those that turn off all the checkOn* configs)

1.1.5 / 2021-09-07
==================

  * Fix date typo in CHANGELOG.

1.1.4 / 2021-09-07
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
