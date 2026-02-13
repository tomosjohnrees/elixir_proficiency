import type { QuizQuestion } from "@/lib/types";

const questions: QuizQuestion[] = [
  {
    question: "What is a double-quoted string in Elixir, internally?",
    options: [
      { label: "A list of characters" },
      { label: "A UTF-8 encoded binary", correct: true },
      { label: "An array of bytes" },
      { label: "A linked list of codepoints" },
    ],
    explanation:
      "Elixir strings are UTF-8 encoded binaries — contiguous sequences of bytes. is_binary(\"hello\") returns true. This is different from charlists ('hello') which are lists of integer codepoints.",
  },
  {
    question: "What does `'hello' == \"hello\"` return?",
    options: [
      { label: "true" },
      { label: "false", correct: true },
      { label: "An error" },
      { label: "nil" },
    ],
    explanation:
      "This is a common trap! 'hello' (single quotes) is a charlist — a list of integers. \"hello\" (double quotes) is a binary string. They're completely different data types, so they're never equal. Use to_string/1 or to_charlist/1 to convert between them.",
  },
  {
    question: "What is `byte_size(\"café\")`?",
    options: [
      { label: "4" },
      { label: "5", correct: true },
      { label: "6" },
      { label: "8" },
    ],
    explanation:
      "\"café\" has 4 graphemes but 5 bytes. The characters c, a, f are 1 byte each (ASCII), but é requires 2 bytes in UTF-8 encoding. So byte_size returns 3 + 2 = 5, while String.length returns 4.",
  },
  {
    question: "What does `<<char::utf8, rest::binary>> = \"José\"` bind `char` to?",
    options: [
      { label: "\"J\" (the string)" },
      { label: "74 (the Unicode codepoint for J)", correct: true },
      { label: "<<74>> (a binary)" },
      { label: "An error — you can't pattern match strings" },
    ],
    explanation:
      "The ::utf8 modifier extracts the Unicode codepoint as an integer. J has codepoint 74. The rest::binary captures the remaining bytes as a string \"osé\". To get the character as a string, you'd need <<char::utf8>> which creates a new one-character binary.",
  },
  {
    question: "What does `~w(foo bar baz)a` return?",
    options: [
      { label: "[\"foo\", \"bar\", \"baz\"]" },
      { label: "[:foo, :bar, :baz]", correct: true },
      { label: "'foo bar baz'" },
      { label: "An error — ~w doesn't accept modifiers" },
    ],
    explanation:
      "The ~w sigil creates a word list by splitting on whitespace. The a modifier at the end converts each word to an atom. Without a modifier (or with s), you get strings. With c, you get charlists. The a modifier is the most commonly used variant.",
  },
  {
    question: "What is `String.length(\"🇺🇸\")` in Elixir?",
    options: [
      { label: "2" },
      { label: "4" },
      { label: "1", correct: true },
      { label: "8" },
    ],
    explanation:
      "The flag emoji 🇺🇸 is composed of two regional indicator codepoints (🇺 and 🇸), but Elixir's String.length/1 counts grapheme clusters — what humans perceive as a single character. Since the two codepoints combine into one visible flag, the length is 1.",
  },
  {
    question: "What does `<<first, rest::binary>> = \"über\"` bind `first` to?",
    options: [
      { label: "252 — the Unicode codepoint for ü" },
      { label: "195 — the first byte of the UTF-8 encoding of ü", correct: true },
      { label: "\"ü\" — the first grapheme as a string" },
      { label: "An error because ü is a multi-byte character" },
    ],
    explanation:
      "Without the ::utf8 modifier, binary pattern matching extracts raw bytes. The character ü (codepoint 252) is encoded as two bytes in UTF-8: <<195, 188>>. So `first` gets bound to 195, just the first byte — not the full character. To match a full UTF-8 codepoint, you need `<<first::utf8, rest::binary>>`.",
  },
  {
    question: "Which function would you use to convert a charlist returned by an Erlang function into an Elixir string?",
    options: [
      { label: "String.from_charlist/1" },
      { label: "to_string/1", correct: true },
      { label: "Enum.join/1" },
      { label: "List.to_string/1" },
    ],
    explanation:
      "The Kernel function to_string/1 converts a charlist (list of codepoints) into a binary string. It calls the String.Chars protocol under the hood. Enum.join/1 would also work for simple cases, but to_string/1 is the idiomatic choice and handles all types that implement String.Chars.",
  },
  {
    question: "What is the difference between `String.codepoints(\"é\")` and `String.graphemes(\"é\")` when é is composed as `e` + combining accent (two codepoints)?",
    options: [
      { label: "Both return [\"é\"] — they are identical functions" },
      { label: "codepoints returns [\"e\", \"́\"] while graphemes returns [\"é\"]", correct: true },
      { label: "codepoints returns [101, 769] while graphemes returns [\"é\"]" },
      { label: "graphemes returns [\"e\", \"́\"] while codepoints returns [\"é\"]" },
    ],
    explanation:
      "String.codepoints/1 splits a string into individual Unicode codepoints, so a composed é becomes [\"e\", \"́\"] (the base letter and the combining accent mark as separate strings). String.graphemes/1 groups codepoints that form a single visible character, returning [\"é\"]. This distinction matters when processing text with combining characters.",
  },
  {
    question: "What does the following return?\n`<<0xCA, 0xFE>>`",
    options: [
      { label: "\"café\" — Elixir interprets hex bytes as UTF-8 text" },
      { label: "A 2-byte binary <<202, 254>>", correct: true },
      { label: "An error because 0xFE is not valid UTF-8" },
      { label: "The integer 51966" },
    ],
    explanation:
      "The <<>> syntax creates a binary from byte values. 0xCA is 202 and 0xFE is 254 in decimal. The result is a 2-byte binary <<202, 254>>. Elixir won't display it as a string because these bytes don't form valid UTF-8. Binaries don't have to be valid UTF-8 — only strings do.",
  },
  {
    question: "What is the purpose of IO data (iodata) in Elixir?",
    options: [
      { label: "A special string type that supports Unicode normalization" },
      { label: "A way to avoid copying when building output by using nested lists of strings and bytes", correct: true },
      { label: "A binary format used exclusively for file I/O operations" },
      { label: "A protocol that converts any data type to a printable string" },
    ],
    explanation:
      "IO data is a nested list structure containing strings, byte integers (0-255), and other IO data lists. Its key advantage is avoiding the repeated memory allocation and copying that happens when concatenating strings. Instead of building one big string, you pass the nested structure to IO functions which flatten it at write time. This is critical for performance in web frameworks like Phoenix.",
  },
  {
    question: "What does `String.valid?(<<0xFF, 0xFE>>)` return?",
    options: [
      { label: "true — all byte sequences are valid strings" },
      { label: "false — these bytes are not valid UTF-8", correct: true },
      { label: "An error because the argument is not a string" },
      { label: "true — 0xFF and 0xFE are the UTF-16 byte order mark" },
    ],
    explanation:
      "String.valid?/1 checks whether a binary is valid UTF-8. The bytes 0xFF and 0xFE never appear in valid UTF-8 encoding (they are used in UTF-16/UTF-32 byte order marks). Since Elixir strings must be valid UTF-8 binaries, this returns false. Any binary can be passed to String.valid?/1 — it won't raise an error.",
  },
  {
    question: "Given `s = \"noël\"` where ë is a single codepoint (U+00EB), what are `byte_size(s)` and `String.length(s)` respectively?",
    options: [
      { label: "4 and 4" },
      { label: "5 and 4", correct: true },
      { label: "6 and 4" },
      { label: "5 and 5" },
    ],
    explanation:
      "The string \"noël\" has 4 graphemes: n, o, ë, l. The characters n, o, and l are ASCII (1 byte each), but ë (U+00EB) requires 2 bytes in UTF-8 encoding. So byte_size is 3 + 2 = 5, while String.length counts 4 graphemes. This discrepancy between byte size and character count is fundamental to understanding UTF-8 strings.",
  },
  {
    question: "How does the String.Chars protocol relate to string interpolation?",
    options: [
      { label: "It has no relation — interpolation uses Kernel.inspect/1" },
      { label: "Interpolation calls String.Chars.to_string/1 on the interpolated value", correct: true },
      { label: "It converts strings to charlists for interpolation" },
      { label: "It is only used by IO.puts/1, not by interpolation" },
    ],
    explanation:
      "When you write `\"Hello, #{value}\"`, Elixir calls the String.Chars protocol's to_string/1 on the interpolated value. This is why you can interpolate integers, atoms, and other types — they implement String.Chars. If you try to interpolate a type that doesn't implement the protocol (like a map), you'll get a Protocol.UndefinedError at runtime.",
  },
  {
    question: "What does this binary pattern match extract?\n`<<_::binary-size(4), middle::binary-size(3), _::binary>> = \"Hello, world!\"`",
    options: [
      { label: "\"lo,\" — bytes 5 through 7" },
      { label: "\"o, \" — bytes 4 through 6", correct: true },
      { label: "\"llo\" — bytes 3 through 5" },
      { label: "An error because you can't skip bytes in binary patterns" },
    ],
    explanation:
      "The pattern skips the first 4 bytes with `_::binary-size(4)` (matching \"Hell\"), then captures the next 3 bytes into `middle` with `::binary-size(3)` (matching \"o, \"), and the `_::binary` ignores the rest. Binary size offsets are zero-indexed from the current position, so after skipping 4 bytes, you get bytes at positions 4, 5, and 6 — which are \"o\", \",\", and \" \".",
  },
];

export default questions;
