// These HTML elements do not require to be closed (either via </tag> or <tag />)
const voidElements = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'menuitem',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
];

const openingLiquidTags = [
  'if',
  'form',
  'comment',
  'case',
  'when',
  'for',
  'unless',
];

const closingLiquidTags = openingLiquidTags.map(
  (name) => `end${name}`,
);

// https://regex101.com/r/CJhNM4/1
function increaseIndentPattern() {
  const patterns = [
    // Opening HTML tags that are not self closing. Here we use a negative
    // lookahead (?!) to make sure that the next character after < is not /
    // or one of the void elements.
    String.raw`<(?!\/|${voidElements.join('|')})[^>]+>`,

    // Opening liquid tags that have a corresponding end$name tag.
    String.raw`{%-?\s+(?:${openingLiquidTags.join('|')}).*?-?%}`, // opening liquid tags

    // Tag start not closed
    String.raw`{%(?:(?!%}).)*`,

    // Variable start not closed
    String.raw`{{(?:(?!}}).)*`,

    // Opening Brace Not Closed
    String.raw`{(?:(?!}).)*`,
    String.raw`\[(?:(?!\]).)*`,
    String.raw`\((?:(?!\)).)*`,
  ];

  // The line must end by one of those patterns
  return String.raw`(${patterns.join('|')})$`;
}

// https://regex101.com/r/zaMWXO/1
function decreaseIndentPattern() {
  const patterns = [
    // Closing HTML tags
    String.raw`<\/[^>]+>`,

    // Closing liquid tags
    String.raw`{%-?\s+(?:${closingLiquidTags.join('|')}).*?-?%}`, // opening liquid tags

    // Multiline tag closed
    String.raw`%}`,

    // Multiline variable closed
    String.raw`}}`,

    // Multiline HTML tag closed
    String.raw`>`,

    // Multiline Closing Braces (JS/CSS)
    String.raw`}`,
    String.raw`\)`,
    String.raw`\]`,
  ];

  // The line must start by one of those patterns
  return String.raw`^\s*(${patterns.join('|')})`;
}

const indentationRules = {
  indentationRules: {
    increaseIndentPattern: increaseIndentPattern(),
    decreaseIndentPattern: decreaseIndentPattern(),
  }
}

// console.log(increaseIndentPattern());
// console.log(decreaseIndentPattern());
console.log(JSON.stringify(indentationRules, null, 2));
