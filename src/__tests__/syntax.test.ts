import { describe, it, expect } from "vitest";
import { tokenize, highlightElixir } from "@/lib/syntax";

describe("tokenize", () => {
  it("tokenizes keywords", () => {
    const tokens = tokenize("def do end");
    const keywords = tokens.filter((t) => t.type === "keyword");
    expect(keywords.map((t) => t.value)).toEqual(["def", "do", "end"]);
  });

  it("tokenizes atoms", () => {
    const tokens = tokenize(":ok :error :hello_world");
    const atoms = tokens.filter((t) => t.type === "atom");
    expect(atoms.map((t) => t.value)).toEqual([":ok", ":error", ":hello_world"]);
  });

  it("tokenizes strings", () => {
    const tokens = tokenize('"hello" "world"');
    const strings = tokens.filter((t) => t.type === "string");
    expect(strings.map((t) => t.value)).toEqual(['"hello"', '"world"']);
  });

  it("tokenizes strings with escape sequences", () => {
    const tokens = tokenize('"hello\\nworld"');
    const strings = tokens.filter((t) => t.type === "string");
    expect(strings).toHaveLength(1);
    expect(strings[0].value).toBe('"hello\\nworld"');
  });

  it("tokenizes integers", () => {
    const tokens = tokenize("42 1_000");
    const numbers = tokens.filter((t) => t.type === "number");
    expect(numbers.map((t) => t.value)).toEqual(["42", "1_000"]);
  });

  it("tokenizes hex, octal, and binary literals", () => {
    const tokens = tokenize("0xFF 0o777 0b1010");
    const numbers = tokens.filter((t) => t.type === "number");
    expect(numbers.map((t) => t.value)).toEqual(["0xFF", "0o777", "0b1010"]);
  });

  it("tokenizes floats", () => {
    const tokens = tokenize("3.14 1.0e10");
    const numbers = tokens.filter((t) => t.type === "number");
    expect(numbers.map((t) => t.value)).toEqual(["3.14", "1.0e10"]);
  });

  it("tokenizes comments", () => {
    const tokens = tokenize("# this is a comment\nx = 1");
    const comments = tokens.filter((t) => t.type === "comment");
    expect(comments).toHaveLength(1);
    expect(comments[0].value).toBe("# this is a comment");
  });

  it("tokenizes operators", () => {
    const tokens = tokenize("|> -> <> ++ == ===");
    const ops = tokens.filter((t) => t.type === "operator");
    expect(ops.map((t) => t.value)).toEqual(["|>", "->", "<>", "++", "==", "==="]);
  });

  it("tokenizes module names", () => {
    const tokens = tokenize("String Enum IO");
    const modules = tokens.filter((t) => t.type === "module");
    expect(modules.map((t) => t.value)).toEqual(["String", "Enum", "IO"]);
  });

  it("treats true, false, nil as keywords", () => {
    const tokens = tokenize("true false nil");
    const keywords = tokens.filter((t) => t.type === "keyword");
    expect(keywords.map((t) => t.value)).toEqual(["true", "false", "nil"]);
  });

  it("tokenizes punctuation", () => {
    const tokens = tokenize("{:ok, 42}");
    const punct = tokens.filter((t) => t.type === "punctuation");
    expect(punct.map((t) => t.value)).toEqual(["{", ",", "}"]);
  });

  it("handles empty string", () => {
    expect(tokenize("")).toEqual([]);
  });

  it("tokenizes a complete expression", () => {
    const tokens = tokenize('name = "Elixir"');
    expect(tokens.length).toBeGreaterThan(0);
    const types = tokens.map((t) => t.type);
    expect(types).toContain("string");
    expect(types).toContain("operator");
  });
});

describe("highlightElixir", () => {
  it("wraps keywords in span with syn-keyword class", () => {
    const html = highlightElixir("def");
    expect(html).toBe('<span class="syn-keyword">def</span>');
  });

  it("wraps atoms in span with syn-atom class", () => {
    const html = highlightElixir(":ok");
    expect(html).toBe('<span class="syn-atom">:ok</span>');
  });

  it("wraps strings in span with syn-string class", () => {
    const html = highlightElixir('"hello"');
    expect(html).toContain('class="syn-string"');
    expect(html).toContain("hello");
  });

  it("wraps numbers in span with syn-number class", () => {
    const html = highlightElixir("42");
    expect(html).toBe('<span class="syn-number">42</span>');
  });

  it("wraps comments in span with syn-comment class", () => {
    const html = highlightElixir("# comment");
    expect(html).toBe('<span class="syn-comment"># comment</span>');
  });

  it("wraps operators in span with syn-operator class", () => {
    const html = highlightElixir("|>");
    expect(html).toBe('<span class="syn-operator">|&gt;</span>');
  });

  it("escapes HTML entities", () => {
    const html = highlightElixir("x < 5");
    expect(html).toContain("&lt;");
    expect(html).not.toContain("<5");
  });

  it("leaves plain text unwrapped", () => {
    const html = highlightElixir("x");
    expect(html).toBe("x");
  });

  it("handles multi-line code", () => {
    const html = highlightElixir("def hello do\n  :world\nend");
    expect(html).toContain('<span class="syn-keyword">def</span>');
    expect(html).toContain('<span class="syn-atom">:world</span>');
    expect(html).toContain('<span class="syn-keyword">end</span>');
  });
});
