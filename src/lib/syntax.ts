type TokenType =
  | "keyword"
  | "atom"
  | "string"
  | "number"
  | "comment"
  | "operator"
  | "module"
  | "function"
  | "variable"
  | "punctuation"
  | "plain";

interface Token {
  type: TokenType;
  value: string;
}

const KEYWORDS = new Set([
  "def",
  "defp",
  "defmodule",
  "do",
  "end",
  "if",
  "else",
  "unless",
  "case",
  "cond",
  "when",
  "fn",
  "and",
  "or",
  "not",
  "in",
  "true",
  "false",
  "nil",
  "after",
  "rescue",
  "catch",
  "with",
  "for",
  "import",
  "require",
  "alias",
  "use",
  "raise",
  "try",
  "receive",
  "send",
  "spawn",
  "self",
]);

const RULES: [RegExp, TokenType][] = [
  [/^#[^\n]*/, "comment"],
  [/^"""[\s\S]*?"""/, "string"],
  [/^"(?:[^"\\]|\\.)*"/, "string"],
  [/^'(?:[^'\\]|\\.)*'/, "string"],
  [/^~[a-zA-Z]"""[\s\S]*?"""/, "string"],
  [/^~[a-zA-Z]"(?:[^"\\]|\\.)*"/, "string"],
  [/^:[a-zA-Z_]\w*/, "atom"],
  [/^0[xXoObB][\da-fA-F_]+/, "number"],
  [/^\d[\d_]*\.[\d_]+(?:[eE][+-]?\d+)?/, "number"],
  [/^\d[\d_]*/, "number"],
  [/^(?:->|<-|=>|\|>|\\\\|::|\.\.\.|\.\.|\+\+|--|<>|=~|!==|===|!==|!=|==|>=|<=|&&|\|\||[+\-*\/=<>!&|^])/, "operator"],
  [/^[A-Z]\w*/, "module"],
  [/^[a-z_]\w*[?!]?/, "plain"],
  [/^[(){}\[\],.:;@]/, "punctuation"],
  [/^\s+/, "plain"],
];

export function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let remaining = code;

  while (remaining.length > 0) {
    let matched = false;

    for (const [regex, type] of RULES) {
      const match = remaining.match(regex);
      if (match) {
        let tokenType = type;
        const value = match[0];

        if (type === "plain" && KEYWORDS.has(value)) {
          tokenType = "keyword";
        }

        tokens.push({ type: tokenType, value });
        remaining = remaining.slice(value.length);
        matched = true;
        break;
      }
    }

    if (!matched) {
      tokens.push({ type: "plain", value: remaining[0] });
      remaining = remaining.slice(1);
    }
  }

  return tokens;
}

export function highlightElixir(code: string): string {
  const tokens = tokenize(code);
  return tokens
    .map((t) => {
      const escaped = t.value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      if (t.type === "plain" || t.type === "punctuation") {
        return escaped;
      }
      return `<span class="syn-${t.type}">${escaped}</span>`;
    })
    .join("");
}
