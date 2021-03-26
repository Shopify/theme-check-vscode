const indentationRules = require('./indentation-rules');
module.exports = {
  "comments": {
    "blockComment": ["{% comment %}", "{% endcomment %}"]
  },
  "brackets": [
    ["{", "}"],
    ["[", "]"],
    ["<", ">"]
  ],
  "autoClosingPairs": [
    { "open": "{", "close": "}" },
    { "open": "{%", "close": "%}" },
    { "open": "{%-", "close": "-%}" },
    { "open": "{{", "close": "}}" },
    { "open": "{{-", "close": "-}}" },
    { "open": "<", "close": ">" },
    { "open": "[", "close": "]" },
    { "open": "'", "close": "'", "notIn": ["string", "comment"] },
    { "open": "\"", "close": "\"", "notIn": ["string"] }
  ],
  "autoCloseBefore": "%-:.,=}])>'\"` \n\t",
  "surroundingPairs": [
    ["-", "-"],
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
    ["'", "'"],
    ["\"", "\""],
    ["`", "`"]
  ],
  indentationRules,
}
